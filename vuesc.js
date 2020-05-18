#!/usr/bin/env node
const clone = require("git-clone-promise");
const program = require("commander");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");

const docs = require("./docs");

program
  .version("1.0.0")
  .description("Craete vue project with Supconit webApp.");

program
  .command("create <projectName>")
  // 可选参数 默认'vue'
  .option(
    "-t, --template <template>",
    "Please choose the template name. (Only vue now!)",
    /^(vue)$/i,
    "vue"
  )
  .action(function (projectName, options) {
    // 执行命令的的函数
    // 从options中获取 template，默认为 vue
    // const { template } = options;
    // 获取当前命令的路径
    const pwd = shell.pwd();
    // 获取项目的最终存放路径
    const targetPath = path.join(pwd.toString(), projectName);
    const repository = `https://github.com/Gracezou/vuesc-template`;
    console.log("Downloading... please be patient!😁");
    clone(repository, targetPath).then((res) => {
      // 删除.git文件
      shell.rm("-rf", path.join(targetPath, ".git"));
      // 改写package.json中的部分配置
      fs.readFile(
        path.join(targetPath, "./package.json"),
        "utf8",
        (err, data) => {
          if (err) throw err;
          let list = JSON.parse(data);
          list.name = projectName;
          let newContent = JSON.stringify(list, null, 2);
          fs.writeFile(
            path.join(targetPath, "./package.json"),
            newContent,
            "utf8",
            (err) => {
              if (err) throw err;
              console.log("Downlaod success!😁");
              console.log(``);
              console.log(`cd ${projectName}`);
              console.log(`npm run serve`);
            }
          );
        }
      );
    });
  });

program.on("--help", () => {
  docs.explain();
});

program.parse(process.argv);
const { args } = program;
if (args.length === 0) program.help();
