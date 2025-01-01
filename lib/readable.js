const fs = require("node:fs");
const { Readable } = require("node:stream");

class FileReadableStream extends Readable {
  constructor({ highWaterMark, fileName, startByte, endByte }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.startByte = startByte;
    this.endByte = endByte;
    this.currentByte = startByte;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return callback(err);
      this.fd = fd;
      callback();
    });
  }

  _read(size) {
    if (this.currentByte > this.endByte) {
      this.push(null);
      return;
    }
    const bytesToRead = Math.min(size, this.endByte - this.currentByte + 1);
    const buffer = Buffer.alloc(bytesToRead);

    fs.read(
      this.fd,
      buffer,
      0,
      bytesToRead,
      this.currentByte,
      (err, bytesRead) => {
        if (err) {
          this.destroy(err);
        } else {
          this.currentByte += bytesRead;
          this.push(buffer.subarray(0, bytesRead));
        }
      }
    );
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(error || err);
      });
    } else {
      callback(error);
    }
  }
}

async function ReadableStream(
  inputFile,
  outputFile,
  chunkSize,
  startByte,
  endByte,
  WritableStream
) {
  const stream = new FileReadableStream({
    fileName: inputFile,
    highWaterMark: +chunkSize,
    startByte: +startByte,
    endByte: +endByte,
  });
  const writableStream = new WritableStream({
    highWaterMark: +chunkSize,
    outputFile: outputFile,
  });

  stream.pipe(writableStream);

  stream.on("error", (err) => {
    console.error("Error in readable stream:", err);
  });

  writableStream.on("finish", () => {
    console.log(
      `File has been successfully written to ${writableStream.outputFile}`
    );
  });

  writableStream.on("error", (err) => {
    console.error("Error in writable stream:", err);
  });
}

module.exports = { FileReadableStream, ReadableStream };
