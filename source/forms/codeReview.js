import config from "../config.js";
import { showMessage } from "../utilities.js";
import { validateSubmission, submitForm } from "../helpers.js";

export default async (page, form) => {
  const name = (n) => `name='code_review_session[${n}]'`;

  showMessage("Submitting Code Review Form");

  await page.goto(config.DASHBOARD.PAGES.CODE_REVIEW);

  const role = form["roles"][String(form["selectedRoles"])];
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

  const projectDescription =
    form["projectContextDescriptionOptions"][
      String(form["projectContextDescription"])
    ];
  await page.check(
    `input[${name(
      "project_context_description"
    )}][type='radio'][value='${projectDescription}']`
  );

  const codeDescription =
    form["codeDescriptionOptions"][String(form["codeDescription"])];
  await page.check(
    `input[${name(
      "code_description"
    )}][type='radio'][value='${codeDescription}']`
  );

  const feedbackResponse =
    form["feedbackResponseOptions"][String(form["feedbackResponse"])];
  await page.check(
    `input[${name(
      "feedback_response"
    )}][type='radio'][value='${feedbackResponse}']`
  );

  await page.fill(
    `input[${name("github_link")}][type='text']`,
    form["githubLink"]
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
    "Thank you for submitting Peer-To-Peer Code Review Session Form."
  );
};
