import YAML from "yamljs";
import playwright from "playwright";

import config from "./config.mjs";
import * as utilities from "./utilities.mjs";

const forms = YAML.load(config.FORMS_FILE);

// Form Submiters
import submitStandupForm from "./forms/standup.mjs";

(async () => {
  const browser = await playwright["chromium"].launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await utilities.restoreSession(context);
  await page.goto(`${config.DASHBOARD.URL}`);
  const pageUrl = new URL(page.url());

  // Check If Needs To Login
  if (pageUrl.pathname === "/login") {
    await dashboardLogin(page);
    await utilities.saveSession(context); // Save New Session
  }

  await submitStandupForm(page, forms["standup"]);

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

  await page.fill(emailSelector, config.DASHBOARD.EMAIL);
  await page.fill(passwordSelector, config.DASHBOARD.PASSWORD);

  await Promise.all([
    page.click("button[name='submit'][type='submit'][aria-label='Log In']"),
    page.waitForNavigation(), // Wait Until Redirected To Dashboard Page
  ]);
};
