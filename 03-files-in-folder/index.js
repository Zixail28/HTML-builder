const fs = require("fs");
const path = require("path");

async function readFileName(folder) {
  const files = await fs.promises.readdir(folder, { withFileTypes: true });

  files.forEach(async (el) => {
    const { name } = el;
    if (!el.isFile()) return readFileName(path.join(folder, name));
    const file = await fs.promises.stat(path.join(folder, name));
    const ext = path.extname(path.join(folder, name));
    console.log(
      `${path.basename(path.join(folder, name), ext)} - ${
        ext.split(".")[1]
      } - ${file.size}b`
    );
  });
}

readFileName(path.join(__dirname, "secret-folder"));
