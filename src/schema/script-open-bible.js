/**
 * This script only parses text files from openbible.com
 * Run this script from the project root
 * Examples: node src/schema/script-open-bible.js cpdv
 * where "cpdv" is a bible identifier
 */

import * as fs from "fs";
import * as readline from "readline";

// Get the bibles Object
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bibles = require("./bibles.json");

async function parseTextFile(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
}

async function main() {
  const bibleIdentifier = process.argv.slice(2)[0];
  console.log(">>> bibleIdentifier-" + bibleIdentifier);
  const sourceFilePath = `sources/${bibleIdentifier}.txt`;

  try {
    const lines = await parseTextFile(sourceFilePath);
    let currentBook = undefined;
    let oldT = {};
    let newT = {};
    let newFlag = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Separate the identifier from the text
      const arr = line.split("\t");
      const identifier = arr[0];
      const text = arr[1];

      // Get just the book, chapter, verse from the identifier
      // Matthews 1:1
      // 1 John 1:1
      // There may be a space in the book name
      const lastIndex = identifier.lastIndexOf(" ");
      currentBook = identifier.substring(0, lastIndex);

      let currentChapter = undefined;
      const idArr = identifier.split(" ");
      const index = idArr.length - 1;
      currentChapter = idArr[index].split(":")[0];

      const currentVerse = idArr[index].split(":")[1];

      if (currentBook === "Matthew" || newFlag) {
        newFlag = true;
        newT[currentBook] = { chapterCnt: 0 };
      } else {
        oldT[currentBook] = { chapterCnt: 0 };
      }

      // Now write the line to its chapter file
      const pathBook = `public/chapters/${bibleIdentifier}/${currentBook}`;
      const pathChapter = `public/chapters/${bibleIdentifier}/${currentBook}/${currentChapter}.json`;

      let data = {};
      if (!fs.existsSync(pathBook)) {
        fs.mkdirSync(pathBook);
        fs.writeFileSync(pathChapter, JSON.stringify(data));
      }
      if (currentVerse == "1") {
        fs.writeFileSync(pathChapter, JSON.stringify(data));
      } else {
        data = fs.readFileSync(pathChapter, "utf8");
        data = JSON.parse(data);
      }
      data[currentVerse] = text;
      fs.writeFileSync(pathChapter, JSON.stringify(data, null, 4));
    }

    // Now get the chapter count for each oldT book
    for (const book in oldT) {
      let chapterCnt = 0;
      console.log(book);
      const pathBook = `public/chapters/${bibleIdentifier}/${book}`;
      fs.readdirSync(pathBook).forEach(() => {
        chapterCnt++;
      });
      oldT[book].chapterCnt = chapterCnt;
    }

    // Now get the chapter count for each newT book
    for (const book in newT) {
      let chapterCnt = 0;
      const pathBook = `public/chapters/${bibleIdentifier}/${book}`;
      fs.readdirSync(pathBook).forEach(() => {
        chapterCnt++;
      });
      newT[book].chapterCnt = chapterCnt;
    }

    // Update the Bibles object with new refreshed data
    bibles[bibleIdentifier].old = oldT;
    bibles[bibleIdentifier].new = newT;
    fs.writeFileSync(`src/schema/bibles.json`, JSON.stringify(bibles, null, 4));
  } catch (err) {
    console.error(err);
  }
}

main();
