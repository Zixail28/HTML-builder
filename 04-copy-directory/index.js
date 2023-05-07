const fs = require("fs");
const path = require("path");

if(!fs.exists(path.join(__dirname, "files-copy"), (exists) => exists)) {
  fs.mkdir(path.join(__dirname, 'files-copy'), () => {})
}

async function copyDir() {
  const dir = await fs.promises.readdir(path.join(__dirname, "files"), {withFileTypes: true});
  dir.forEach((el, i) => {
    fs.copyFile(path.join(__dirname, "files", el.name), path.join(__dirname, "files-copy", el.name), () => {}) 
  })
}

copyDir();