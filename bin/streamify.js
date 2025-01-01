#!/usr/bin/env node
const fs = require("fs");
const { FileReadableStream, ReadableStream } = require("../lib/readable");
const { FileWritableStream, WritableStream } = require("../lib/writable");

const args = process.argv.slice(2);

if (args.length < 4) {
  console.log(
    "Usage: streamify <read/write> <inputFile> <outputFile> <chunksize> <startByte only when reading> <endByte only when reading>"
  );
  process.exit(1);
}

const [command, inputFile, outputFile, chunkSize, startByte, endByte] = args;

if (!fs.existsSync(inputFile)) {
  console.log(`Error: Input file, ${inputFile}, does not exists.`);
  process.exit(1);
}

if (command === "read") {
  ReadableStream(
    inputFile,
    outputFile,
    chunkSize,
    startByte,
    endByte,
    FileWritableStream
  );
} else if (command === "write") {
  WritableStream(inputFile, outputFile, chunkSize, FileReadableStream);
} else {
  console.log("Invalid Command; Use 'read' or 'write'.");
  process.exit(1);
}
