import cliSelect from "cli-select";

import { showMessage } from "./utilities.js";

import { main } from "./main.js";

showMessage("Microverse Forms Bot");
showMessage("Choose A Form To Submit:");

const FORMS = [
  {
    name: "Peer-to-Peer Code Review",
    handler: "codeReview",
  },
  {
    name: "Algorithms & Data Structures Mob Programming",
    handler: "algorithms",
  },
  {
    name: "Standup",
    handler: "standup",
  },
];

cliSelect({
  values: Object.values(FORMS).map((f) => f.name),
})
  .then(({ id }) => {
    const handlerName = FORMS[id].handler;
    main(handlerName);
  })
  .catch(() => {
    // No Operation, Terminate Program
  });
