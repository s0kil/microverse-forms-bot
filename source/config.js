// Load `.env`
import dotenv from "dotenv";
dotenv.config();

const config = {
  COOKIES_FILE: "cookies.json",
  FORMS_FILE: "forms.yml",
};

config.DASHBOARD = {
  URL: "https://dashboard.microverse.org",
  EMAIL: process.env.MICROVERSE_DASHBOARD_EMAIL,
  PASSWORD: process.env.MICROVERSE_DASHBOARD_PASSWORD,
};

config.DASHBOARD.PAGES = {
  STANDUP: `${config.DASHBOARD.URL}/standups/new`,
  ALGORITHMS: `${config.DASHBOARD.URL}/algorithm_sessions/new`,
  CODE_REVIEW: `${config.DASHBOARD.URL}/code_review_sessions/new`,
};

export default config;
