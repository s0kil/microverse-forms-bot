import fs, { promises as fsp } from "fs";

import config from "./config.js";

export const restoreSession = async (context) => {
  const cookiesFileExists = await fsp
    .access(config.COOKIES_FILE, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

  if (!cookiesFileExists) return; // New Session

  showMessage("Restoring Previous Session");

  const cookies = await fsp.readFile(config.COOKIES_FILE);
  await context.addCookies(JSON.parse(cookies));
};

export const saveSession = async (context) => {
  showMessage("Saving New Session");

  const cookies = await context.cookies();
  await fsp.writeFile(config.COOKIES_FILE, JSON.stringify(cookies));
};

export const showMessage = (message) => {
  console.info(`MFB> ${message}`);
};
