const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const resizeAndSave = async (filePath, destFolder, sizes = []) => {
  const fileName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);

  const processedFiles = [];

  const image = sharp(filePath);
  const metadata = await image.metadata();

  for (const size of sizes) {
    const outputPath = path.join(destFolder, `${fileName}_${size.name}${ext}`);

    if (metadata.width >= size.width && metadata.height >= size.height) {
      await image
        .resize(size.width, size.height)
        .jpeg({ quality: size.quality || 80 })
        .toFile(outputPath);
    } else {
      // Copy the original image instead of resizing
      fs.copyFileSync(filePath, outputPath);
    }

    processedFiles.push({
      size: size.name,
      path: outputPath,
      url: getPublicUrlFromPath(outputPath),
    });
  }

  return processedFiles;
};

const getPublicUrlFromPath = (absolutePath) => {
  const basePath = path.resolve(__dirname, "../../.."); // project root
  const relativePath = path
    .relative(basePath, absolutePath)
    .replace(/\\/g, "/"); // normalize for Windows
  return `${process.env.BASE_URL || "http://localhost:5000"}/${relativePath}`;
};

module.exports = {
  resizeAndSave,
  getPublicUrlFromPath,
};
