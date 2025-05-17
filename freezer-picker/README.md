# Freezer Picker

A simple React + TypeScript app that uses OCR to read a list of freezer items from an image and helps you pick dinner.

## Features

1. Upload a picture containing a list of items.
2. OCR processing via [Tesseract.js](https://github.com/naptha/tesseract.js).
3. Automatic item categorization (meat, vegetable, carb) with manual correction if needed.
4. Randomly picks one item from each category and shows it with an animation.

## Development

Install dependencies and start a development server:

```bash
npm install
npm start
```

The app will open at http://localhost:3000.

To build for production:

```bash
npm run build
```

## Deployment

This repository contains a GitHub Actions workflow that deploys the built app
to **GitHub Pages**. When changes are pushed to the `main` branch (or the
workflow is run manually), the action will:

1. Install dependencies and run `npm run build`.
2. Publish the contents of the `dist` folder to the `gh-pages` branch.

After the workflow runs, enable GitHub Pages in the repository settings and
select the `gh-pages` branch as the source. The site will then be available at
`https://<your-username>.github.io/<repo>/`.
