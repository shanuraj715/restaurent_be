const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { stripBasePathFromImages } = require("./index");

const getPublicUrlFromPath = (absolutePath) => {
  const basePath = path.resolve(__dirname, process.env.ASSETS_BASE_PATH); // project root

  const relativePath = path
    .relative(basePath, absolutePath)
    .replace(/\\/g, "/"); // normalize for Windows

  return `${relativePath}`;
};

const resizeAndSave = async (filePath, destFolder, sizes = [], _fileName) => {
  const fileName = _fileName || path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath);

  const processedFiles = [];

  const image = sharp(filePath);
  const metadata = await image.metadata();

  for (const size of sizes) {
    const outputPath = path.join(destFolder, `${fileName}_${size.name}${ext}`);
    let resizedImage;
    if (metadata.width >= size.width && metadata.height >= size.height) {
      resizedImage = await image
        .resize(size.width, size.height)
        .jpeg({ quality: size.quality || 80 })
        .toFile(outputPath);
    } else {
      // Copy the original image instead of resizing
      fs.copyFileSync(filePath, outputPath);
      resizedImage = {
        format: ext.replace(".", ""),
        width: metadata.width,
        height: metadata.height,
        size: size.name,
      };
    }

    processedFiles.push({
      sizeInBytes: resizedImage.size,
      size: size.name,
      path: stripBasePathFromImages(outputPath),
      src: getPublicUrlFromPath(outputPath),
      extension: ext.replace(".", ""),
      width: resizedImage.width,
      height: resizedImage.height,
    });
  }
  // console.log(processedFiles)
  return processedFiles;
};

module.exports = {
  resizeAndSave,
  getPublicUrlFromPath,
};
