const fs = require("fs");
const path = require("path");
const output = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"))

async function createCSSBundle(par) {
  const dir = await fs.promises.readdir(par, {
    withFileTypes: true,
  });
  dir.forEach((file, i) => {
    if (path.extname(path.join(__dirname, dir[i].name)) === ".css") {
      const readStream = fs.createReadStream(path.join(par, dir[i].name))
      readStream.pipe(output);
    }
  })
}
createCSSBundle(path.join(__dirname, "styles"));