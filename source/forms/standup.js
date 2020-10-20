import config from "../config.js";
import { showMessage } from "../utilities.js";
import { submitForm } from "../helpers.js";

export default async (page, form) => {
  const name = (n) => `name='standup[${n}]'`;

  showMessage("Submitting Standup Form");

  await page.goto(config.DASHBOARD.PAGES.STANDUP);

  await page.selectOption(
    `select[${name("achieved_goals")}]`,
    form["achievedGoals"]
  );

  await page.fill(`textarea[${name("upsides")}]`, form["upsides"]);

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
    `textarea[${name("goals_confidence")}]`,
    form["goalsConfidence"]
  );

  const motivationSelection =
    form["motivationLevels"][String(form["motivationLevel"])];

  await page.check(
    `input[${name("motivation")}][type='radio'][value='${motivationSelection}']`
  );

  await submitForm(page);

  const errorMessage = await page.$("p.inline-error-messages");
  if (errorMessage) {
    if (
      (await errorMessage.textContent()) ===
      "Standup was already submitted for the selected day."
    ) {
      showMessage("Standup Form Was Already Submitted");
    } else {
      showMessage("Form Failed To Submit");
    }
  } else {
    await validateSubmission(page, "Thank you for submitting Standup Form!");
  }
};
