const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NihongoX",
      version: "1.0.0",
      description: "API documentation for NihongoX",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://nihongo-x.onrender.com"
            : `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/jpn-random-character/{type}:
 *   get:
 *     summary: Get a random Japanese character (hiragana or katakana)
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of character (hiragana or katakana)
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [basic, advanced]
 *         description: The difficulty level of the characters
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of options to generate
 *     responses:
 *       200:
 *         description: A random Japanese character with multiple-choice options
 *       400:
 *         description: Invalid level or type provided
 *       500:
 *         description: Error loading character data
 */
app.get("/api/jpn-random-character/:type", (req, res) => {
  const type = req.params.type;
  const level = req.query.level || "basic";
  const count = parseInt(req.query.count) || 6;

  let filename;
  if (level === "basic") {
    filename = "characters/basic.json";
  } else if (level === "advanced") {
    filename = "characters/advanced.json";
  } else {
    return res.status(400).send("Invalid level. Choose 'basic' or 'advanced'.");
  }

  let characterData;
  try {
    characterData = JSON.parse(
      fs.readFileSync(path.join(__dirname, filename), "utf-8")
    );
  } catch (error) {
    return res.status(500).send("Error loading character data.");
  }

  if (!characterData[type]) {
    return res.status(400).send("Invalid level or type provided.");
  }

  const randomChar =
    characterData[type][Math.floor(Math.random() * characterData[type].length)];

  const availableOptions = characterData[type].filter(
    (item) => item !== randomChar
  );
  const options = getRandom(availableOptions, count - 1).map(
    (item) => item.eng
  );
  options.push(randomChar.eng);

  const shuffledOptions = getRandom(options, options.length);

  res.json({
    character: randomChar.jpn,
    options: shuffledOptions,
    correct: randomChar.eng,
  });
});

/**
 * @swagger
 * /api/eng-random-character/{type}:
 *   get:
 *     summary: Get a random English character (with corresponding Japanese translation)
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of character (hiragana or katakana)
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [basic, advanced]
 *         description: The difficulty level of the characters
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of options to generate
 *     responses:
 *       200:
 *         description: A random English character with multiple-choice options
 *       400:
 *         description: Invalid level or type provided
 *       500:
 *         description: Error loading character data
 */

app.get("/api/eng-random-character/:type", (req, res) => {
  const type = req.params.type;
  const level = req.query.level || "basic";
  const count = parseInt(req.query.count) || 6;

  let filename;
  if (level === "basic") {
    filename = "characters/basic.json";
  } else if (level === "advanced") {
    filename = "characters/advanced.json";
  } else {
    return res.status(400).send("Invalid level. Choose 'basic' or 'advanced'.");
  }

  let characterData;
  try {
    characterData = JSON.parse(
      fs.readFileSync(path.join(__dirname, filename), "utf-8")
    );
  } catch (error) {
    return res.status(500).send("Error loading character data.");
  }

  if (!characterData[type]) {
    return res.status(400).send("Invalid level or type provided.");
  }

  const randomChar =
    characterData[type][Math.floor(Math.random() * characterData[type].length)];

  const availableOptions = characterData[type].filter(
    (item) => item !== randomChar
  );
  const options = getRandom(availableOptions, count - 1).map(
    (item) => item.jpn
  );
  options.push(randomChar.jpn);

  const shuffledOptions = getRandom(options, options.length);

  res.json({
    character: randomChar.eng,
    options: shuffledOptions,
    correct: randomChar.jpn,
  });
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

/**
 * Utility function to get random elements from an array
 * @param {Array} arr
 * @param {number} n
 * @returns {Array}
 */
function getRandom(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
