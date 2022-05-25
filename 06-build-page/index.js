const path = require('path');
const { readFile, writeFile, readdir, copyFile, mkdir, rm } = require('fs').promises;

const newDirPath = path.join(__dirname, 'project-dist');
const newAssetsPath = path.join(newDirPath, 'assets');
const newCssPath = path.join(newDirPath, 'style.css');
const newHtmlPath = path.join(newDirPath, 'index.html');

const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const cssPath = path.join(__dirname, 'styles');
const htmlPath = path.join(__dirname, 'template.html');

async function createDir(dirName) {
  await rm(dirName, {recursive: true, force: true});
  await mkdir(dirName);
}

async function createHtml() {
  let htmlBase = await readFile(htmlPath, 'utf-8');
  const files = await readdir(componentsPath, { withFileTypes: true });

  for (let file of files) {
    const componentContent = await readFile(path.join(componentsPath, `${file.name}`), 'utf-8');
    const regExp = new RegExp(`{{${(file.name).split('.')[0]}}}`, 'g');
    htmlBase = htmlBase.replace(regExp, componentContent);
  }

  await writeFile(newHtmlPath, htmlBase);
}

async function mergeFiles() {
  let arrStyles = [];
  const files = await readdir(cssPath, { withFileTypes: true });

  for (let file of files) {
    const pathToFile = path.join(cssPath, file.name);
    const fileType = path.extname(pathToFile);

    if (fileType === '.css') {
      const content = await readFile(pathToFile, 'utf8');
      arrStyles.push(content);
    }
  }
  await writeFile(newCssPath, arrStyles.join('\n'), 'utf8');
}

async function copyDir(from, to) {
  const files = await readdir(from, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(path.join(from, file.name), path.join(to, file.name));
    } else if (file.isDirectory()) {
      await mkdir(path.join(to, file.name), { recursive: true });
      await copyDir(path.join(from, file.name), path.join(to, file.name));
    }
  }
}

(async() => {
  createDir(newDirPath);
  mergeFiles();
  copyDir(assetsPath, newAssetsPath);
  createHtml();
})();
