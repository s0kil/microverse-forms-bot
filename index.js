const fs = require("fs").promises;
const YAML = require("yamljs");
const playwright = require("playwright");

// Load `.env`
require("dotenv").config();

const MICROVERSE_DASHBOARD_PATH = "https://dashboard.microverse.org";
const COOKIES_FILE = "cookies.json";
const FORMS_FILE = "forms.yml";

const DASHBOARD_PAGES = {
  STANDUP_FORM: `${MICROVERSE_DASHBOARD_PATH}/standups/new`,
};

const FORMS = YAML.load(FORMS_FILE);

(async () => {
  const browser = await playwright["chromium"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await restoreSession(context);
  await page.goto(`${MICROVERSE_DASHBOARD_PATH}`);
  const pageUrl = new URL(page.url());

  // Check If Needs To Login
  if (pageUrl.pathname === "/login") {
    await dashboardLogin(page);
    await saveSession(context);
  }

  await submitStandupForm(page);

  await page.screenshot({
    path: "dashboard.jpg",
    fullPage: true,
    quality: 100,
    type: "jpeg",
  });

  await browser.close();
})();

const dashboardLogin = async (page) => {
  const emailSelector = "input[name='email'][type='email'][aria-label='Email']";
  const passwordSelector =
    "input[name='password'][type='password'][aria-label='Password']";

  await page.waitForSelector(emailSelector);
  await page.waitForSelector(passwordSelector);

  await page.fill(emailSelector, process.env.MICROVERSE_DASHBOARD_EMAIL);
  await page.fill(passwordSelector, process.env.MICROVERSE_DASHBOARD_PASSWORD);

  await Promise.all([
    page.click("button[name='submit'][type='submit'][aria-label='Log In']"),
    page.waitForNavigation(), // Wait Until Redirected To Dashboard Page
  ]);
};

const submitStandupForm = async (page) => {
  await page.goto(DASHBOARD_PAGES.STANDUP_FORM);

  const form = FORMS["standup"];

  await page.selectOption(
    "select[name='standup[achieved_goals]']",
    form["achievedGoals"]
  );

  await page.fill("textarea[name='standup[upsides]']", form["upsides"]);

  const blockers = form["selectedBlockers"].map(
    (blockerId) => form["blockers"][String(blockerId)]
  );

  for (const blocker of blockers) {
    await page.check(
      `input[name='standup[blockers][]'][type='checkbox'][value='${blocker}']`
    );
  }

  const goals = form["goals"];
  for (const index in goals) {
    const goalId = Number(index) + 1; // Start From 1 Instead Of 0

    await page.fill(
      `input[name='standup[goals][]'][type='text'][id='goals_${goalId}']`,
      `${goals[index]}`
    );
  }

  await page.fill(
    "textarea[name='standup[goals_confidence]']",
    form["goalsConfidence"]
  );

  const motivationSelection =
    form["motivationLevels"][String(form["motivationLevel"])];

  await page.check(
    `input[name='standup[motivation]'][type='radio'][value='${motivationSelection}']`
  );

  await Promise.all([
    page.click("input[name='commit'][type='submit'][value='Submit']"),
    page.waitForNavigation(), // Wait Until Form Submitted
  ]);
};

const restoreSession = async (context) => {
  const cookies = await fs.readFile(COOKIES_FILE);
  await context.addCookies(JSON.parse(cookies));
};

const saveSession = async (context) => {
  const cookies = await context.cookies();
  await fs.writeFile(COOKIES_FILE, JSON.stringify(cookies));
};
