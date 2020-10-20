# Microverse Forms Bot

To use, copy `.env-sample` to `.env` file, and fill out with your dashboard login details (email, password)

Fill out and choose the form contents in `forms.yml` file.

Install dependencies: `npm install`

To submit form, run: `npm start`

Choose form to submit, and press enter/return.

## Forms Supported

- Morning Code Review
- Evening Standup

#### Extra

- Check the `dashboard.jpg` image to see if your submission went through.

- The `cookies.json` file is used to save cookies from Chromium headless browser, so we don't have to login every time we try and access the Microverse dashboard
