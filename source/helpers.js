import { showMessage } from "./utilities.js";

export async function validateSubmission(page, text) {
  const alertText = await page.textContent("div.alert.alert-success");
  if (alertText === text) {
    showMessage("Form Submitted.");
  } else {
    showMessage("Form Failed To Submit");
  }
}

export async function submitForm(page) {
  await Promise.all([
    page.click("input[name='commit'][type='submit'][value='Submit']"),
    page.waitForNavigation(), // Wait Until Form Submitted
  ]);
}
