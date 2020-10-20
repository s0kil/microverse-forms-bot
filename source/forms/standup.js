import config from "../config.js";

export default async (page, form) => {
  await page.goto(config.DASHBOARD.PAGES.STANDUP_FORM);

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
