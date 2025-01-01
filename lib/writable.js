const fs = require("node:fs");
const { Writable } = require("node:stream");

class FileWritableStream extends Writable {
  constructor({ highWaterMark, outputFile }) {
    super({ highWaterMark });

    this.outputFile = outputFile;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
  }

  _construct(callback) {
    fs.open(this.outputFile, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize >= this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          callback(err);
        } else {
          this.chunks = [];
          this.chunkSize = 0;
          callback();
        }
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    if (this.chunkSize > 0) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        this.chunks = [];
        this.chunkSize = 0;
        callback(err);
      });
    } else {
      callback();
    }
  }

  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (closeErr) => {
        callback(closeErr || err);
      });
    } else {
      callback(err);
    }
  }
}

async function WritableStream(
  inputFile,
  outputFile,
  chunkSize,
  ReadableStream
) {
  const readableStream = new ReadableStream({
    highWaterMark: +chunkSize,
    fileName: inputFile,
    startByte: "",
    endByte: "",
  });
  const fileStream = new FileWritableStream({
    highWaterMark: +chunkSize,
    outputFile: outputFile,
  });

  readableStream.pipe(fileStream);

  readableStream.on("error", (err) => {
    console.error("Error in readable stream:", err.message);
  });

  fileStream.on("finish", () => {
    console.log(`File has been successfully written to ${outputFile}`);
  });

  fileStream.on("error", (err) => {
    console.error("Error in writable stream:", err.message);
  });
}

module.exports = { FileWritableStream, WritableStream };
