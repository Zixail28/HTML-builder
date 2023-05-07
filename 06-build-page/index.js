const fs = require("fs");
const path = require("path");

async function bundler() {
  try {
    await fs.promises.access(path.join(__dirname, "project-dist"));
  } catch (error) {
    await fs.promises.mkdir(path.join(__dirname, "project-dist"));
  }

  generateHTML(
    path.join(__dirname, "template.html"),
    path.join(__dirname, "project-dist", "index.html")
  );
  generateCSS(
    path.join(__dirname, "styles"),
    path.join(__dirname, "project-dist", "style.css")
  );
  copyDir(
    path.join(__dirname, "assets"),
    path.join(__dirname, "project-dist", "assets")
  );
}

async function generateHTML(from, to) {
  const output = fs.createWriteStream(to);
  const readStream = fs.createReadStream(from);
  let template = "";
  readStream.on("data", (chunk) => {
    template += chunk.toString();
  });
  await new Promise((resolve) => readStream.on("end", resolve));
  const matches = template
    .match(/{{([^{}]+)}}/g)
    .map((match) => match.slice(2, -2)); // console.log(matches)

  const promises = [];
  for (const match of matches) {
    const readStream = fs.createReadStream(
      path.join(__dirname, "components", `${match}.html`)
    );
    let htmlContent = "";
    readStream.on("data", (chunk) => {
      htmlContent += chunk.toString();
    });
    const promise = new Promise((resolve) =>
      readStream.on("end", () => resolve({ match, htmlContent }))
    );
    promises.push(promise);
  }

  for await (const { match, htmlContent } of promises) {
    template = template.replace(`{{${match}}}`, htmlContent);
  }
  output.write(template);
}

async function generateCSS(from, to) {
  const output = fs.createWriteStream(to);
  const dir = await fs.promises.readdir(from, {
    withFileTypes: true,
  });
  dir.forEach((file, i) => {
    if (path.extname(path.join(__dirname, dir[i].name)) === ".css") {
      const readStream = fs.createReadStream(path.join(from, dir[i].name));
      readStream.pipe(output);
    }
  });
}

async function copyDir(from, to) {
  await fs.promises.mkdir(to);
  const dir = await fs.promises.readdir(from, { withFileTypes: true });
  dir.forEach(async (el, i) => {
    if (!el.isFile())
      return copyDir(path.join(from, el.name), path.join(to, el.name));
    await fs.promises.copyFile(
      path.join(from, el.name),
      path.join(to, el.name)
    );
  });
}

bundler();
