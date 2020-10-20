import config from "../config.js";
import { showMessage } from "../utilities.js";

export default async (page, form) => {
  showMessage("Submitting Code Review Form");

  await page.goto(config.DASHBOARD.PAGES.CODE_REVIEW);

  const role = form["roles"][String(form["selectedRoles"])];
  await page.check(
    `input[name='code_review_session[role]'][type='radio'][value='${role}']`
  );

  await page.check(
    `input[name='code_review_session[loud_enough]'][type='radio'][value='${form["presenterLoudEnough"]}']`
  );

  await page.check(
    `input[name='code_review_session[wording_rating]'][type='radio'][value='${form["presenterWordingRating"]}']`
  );

  const projectDescription =
    form["projectContextDescriptionOptions"][
      String(form["projectContextDescription"])
    ];
  await page.check(
    `input[name='code_review_session[project_context_description]'][type='radio'][value='${projectDescription}']`
  );

  const codeDescription =
    form["codeDescriptionOptions"][String(form["codeDescription"])];
  await page.check(
    `input[name='code_review_session[code_description]'][type='radio'][value='${codeDescription}']`
  );

  const feedbackResponse =
    form["feedbackResponseOptions"][String(form["feedbackResponse"])];
  await page.check(
    `input[name='code_review_session[feedback_response]'][type='radio'][value='${feedbackResponse}']`
  );

  await page.fill(
    "input[name='code_review_session[github_link]'][type='text']",
    form["githubLink"]
  );

  const overallRating =
    form["overallRatingOptions"][String(form["overallRating"])];
  await page.check(
    `input[name='code_review_session[overall_rating]'][type='radio'][value='${overallRating}']`
  );

  await page.fill(
    "textarea[name='code_review_session[comments]']",
    form["comments"]
  );

  await Promise.all([
    page.click("input[name='commit'][type='submit'][value='Submit']"),
    page.waitForNavigation(), // Wait Until Form Submitted
  ]);

  const alert = await page.textContent("div.alert.alert-success");
  if (
    alert === "Thank you for submitting Peer-To-Peer Code Review Session Form."
  ) {
    showMessage("Form Submitted.");
  } else {
    showMessage("Form Submission Failed.");
  }
};
