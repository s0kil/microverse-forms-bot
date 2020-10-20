import config from "../config.js";
import { showMessage } from "../utilities.js";

export default async (page, form) => {
  showMessage("Submitting Algorithms Form");

  await page.goto(config.DASHBOARD.PAGES.ALGORITHMS);

  const role = form["roles"][String(form["role"])];
  await page.check(
    `input[name='algorithms_session[role]'][type='radio'][value='${role}']`
  );

  await page.check(
    `input[name='algorithms_session[loud_enough]'][type='radio'][value='${form["presenterLoudEnough"]}']`
  );

  await page.check(
    `input[name='algorithms_session[wording_rating]'][type='radio'][value='${form["presenterWordingRating"]}']`
  );

  const realTimeCode =
    form["realTimeCodeOptions"][String(form["realTimeCode"])];
  await page.check(
    `input[name='algorithms_session[real_time_code]'][type='radio'][value='${realTimeCode}']`
  );

  await page.check(
    `input[name='algorithms_session[real_life_help]'][type='radio'][value='${form["realLifeHelp"]}']`
  );

  const askForHelp = form["askForHelpOptions"][String(form["askForHelp"])];
  await page.check(
    `input[name='algorithms_session[ask_for_help]'][type='radio'][value='${askForHelp}']`
  );

  await page.check(
    `input[name='algorithms_session[solution_with_examples]'][type='radio'][value='${form["solutionWithExamples"]}']`
  );

  await page.check(
    `input[name='algorithms_session[solution_efficiency]'][type='radio'][value='${form["solutionEfficiency"]}']`
  );

  const feedbackResponse =
    form["feedbackResponseOptions"][String(form["feedbackResponse"])];
  await page.check(
    `input[name='algorithms_session[feedback_response]'][type='radio'][value='${feedbackResponse}']`
  );

  await page.selectOption(
    "select[name='algorithms_session[coding_challenge_id]']",
    form["codingChallenge"]
  );

  const overallRating =
    form["overallRatingOptions"][String(form["overallRating"])];
  await page.check(
    `input[name='algorithms_session[overall_rating]'][type='radio'][value='${overallRating}']`
  );

  await page.fill(
    "textarea[name='algorithms_session[comments]']",
    form["comments"]
  );

  await Promise.all([
    page.click("input[name='commit'][type='submit'][value='Submit']"),
    page.waitForNavigation(), // Wait Until Form Submitted
  ]);

  const alert = await page.textContent("div.alert.alert-success");
  if (alert === "Thank you for submitting Mob Programming Session Form.") {
    showMessage("Form Submitted.");
  } else {
    showMessage("Form Submission Failed.");
  }
};
