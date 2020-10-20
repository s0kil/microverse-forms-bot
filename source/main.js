import YAML from "yamljs";
import { chromium } from "playwright-chromium";

import config from "./config.js";
import * as utilities from "./utilities.js";

const forms = YAML.load(config.FORMS_FILE);

// Form Submiters
import submitStandupForm from "./forms/standup.js";

(async () => {
  utilities.showMessage("Starting Microverse Forms Bot");

  const browser = await chromium.launch();
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

  utilities.showMessage("Done, Goodbye");
  await browser.close();
})();

const dashboardLogin = async (page) => {
  utilities.showMessage(`Logging In As ${config.DASHBOARD.EMAIL}`);

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
