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

The build artifacts will be placed in the `dist` folder. Make sure you run
`npm install` before building so that Parcel and TypeScript are available.
