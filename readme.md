# Streamify

Streamify is a Node.js-based library that provides tools to handle streaming operations with custom-readable and writable streams. The library is designed for efficiently reading and writing large files in chunks, with support for specifying byte ranges to extract specific parts of a file.

---

## Features

- **Custom Readable Stream:** Read files chunk by chunk with support for specifying byte ranges.
- **Custom Writable Stream:** Write data to files in an efficient, memory-managed manner.
- **Flexible Integration:** Designed to work with any file type, including text, audio, and video files.
- **Error Handling:** Provides comprehensive error management for readable and writable streams.

---

## Installation

To use Streamify, clone the repository and include it in your Node.js project:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd streamify

# Install dependencies
npm install
```

---

## Usage

### Import the Library

```javascript
const { ReadableStream } = require("./lib/readable");
const { WritableStream } = require("./lib/writable");
```

### Example: Copying a File

```javascript
const inputFile = "./test/input.txt";
const outputFile = "./test/output.txt";
const chunkSize = 1024; // 1KB
const startByte = 0;
const endByte = 2048; // 2KB

(async () => {
  try {
    await ReadableStream(
      inputFile,
      outputFile,
      chunkSize,
      startByte,
      endByte,
      WritableStream
    );
    console.log("File copied successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
```

---

## API Reference

### **FileReadableStream**

A custom readable stream for reading files in chunks.

#### Constructor Options:

- `highWaterMark` _(number)_: The size (in bytes) of the internal buffer.
- `fileName` _(string)_: The path to the input file.
- `startByte` _(number)_: The byte to start reading from.
- `endByte` _(number)_: The byte to stop reading at.

#### Methods:

- `_construct(callback)`: Opens the file for reading.
- `_read(size)`: Reads a chunk of data from the file.
- `_destroy(error, callback)`: Closes the file and cleans up resources.

### **FileWritableStream**

A custom writable stream for writing files in chunks.

#### Constructor Options:

- `highWaterMark` _(number)_: The size (in bytes) of the internal buffer.
- `outputFile` _(string)_: The path to the output file.

#### Methods:

- `_construct(callback)`: Opens the file for writing.
- `_write(chunk, encoding, callback)`: Writes a chunk of data to the file.
- `_final(callback)`: Writes any remaining data before closing the file.
- `_destroy(error, callback)`: Closes the file and cleans up resources.

---

## Supported Use Cases

- **File Copying:** Transfer data from one file to another.
- **File Trimming:** Extract specific parts of a file (e.g., audio or video segments).
- **Large File Handling:** Efficiently process files that cannot fit into memory.

---

## Error Handling

Both `ReadableStream` and `WritableStream` include error handling via event listeners:

```javascript
stream.on("error", (err) => {
  console.error("Stream error:", err);
});
```

---

## Contributing

Streamify is an open-source project. Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature-name'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

- Inspired by Node.js streams documentation.
- Thanks to the developer community for feedback and contributions.
