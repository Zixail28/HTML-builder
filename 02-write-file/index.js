const fs = require("fs");
const path = require("path");
const process = require("node:process");
const output = fs.createWriteStream(path.join(__dirname, "textFile.txt"));
process.stdout.write("Вывод в консоль приветственного сообщения\n");

let data = "";

process.stdin.on("data", (data) => {
  if(data.toString() === "exit\r\n") {
    process.stdout.write("Прощальная фраза");
    process.exit();
  };
  output.write(data, "utf-8", () => {})
});

process.on("SIGINT", () => {
  process.stdout.write("Прощальная фраза"); process.exit();
})