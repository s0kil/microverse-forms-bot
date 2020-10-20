import config from "../config.js";
import { showMessage } from "../utilities.js";
import { validateSubmission, submitForm } from "../helpers.js";

export default async (page, form) => {
  const name = (n) => `name='algorithms_session[${n}]'`;

  showMessage("Submitting Algorithms Form");

  await page.goto(config.DASHBOARD.PAGES.ALGORITHMS);

  const role = form["roles"][String(form["role"])];
  await page.check(`input[${name("role")}][type='radio'][value='${role}']`);

  await page.check(
    `input[${name("loud_enough")}][type='radio'][value='${
      form["presenterLoudEnough"]
    }']`
  );

  await page.check(
    `input[${name("wording_rating")}][type='radio'][value='${
      form["presenterWordingRating"]
    }']`
  );

  const realTimeCode =
    form["realTimeCodeOptions"][String(form["realTimeCode"])];
  await page.check(
    `input[${name("real_time_code")}][type='radio'][value='${realTimeCode}']`
  );

  await page.check(
    `input[${name("real_life_help")}][type='radio'][value='${
      form["realLifeHelp"]
    }']`
  );

  const askForHelp = form["askForHelpOptions"][String(form["askForHelp"])];
  await page.check(
    `input[${name("ask_for_help")}][type='radio'][value='${askForHelp}']`
  );

  await page.check(
    `input[${name("solution_with_examples")}][type='radio'][value='${
      form["solutionWithExamples"]
    }']`
  );

  await page.check(
    `input[${name("solution_efficiency")}][type='radio'][value='${
      form["solutionEfficiency"]
    }']`
  );

  const feedbackResponse =
    form["feedbackResponseOptions"][String(form["feedbackResponse"])];
  await page.check(
    `input[${name(
      "feedback_response"
    )}][type='radio'][value='${feedbackResponse}']`
  );

  await page.selectOption(
    `select[${name("coding_challenge_id")}]`,
    form["codingChallenge"]
  );

  const overallRating =
    form["overallRatingOptions"][String(form["overallRating"])];
  await page.check(
    `input[${name("overall_rating")}][type='radio'][value='${overallRating}']`
  );

  await page.fill(`textarea[${name("comments")}]`, form["comments"]);

  await submitForm(page);

  await validateSubmission(
    page,
    "Thank you for submitting Mob Programming Session Form."
  );
};
