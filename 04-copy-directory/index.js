const fs = require('fs/promises');
const path = require('path');
const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

async function copyDir(pathSource, pathToSave) {
  try {
    await fs.rm(pathToSave, { recursive: true, force: true });
    await fs.mkdir(pathToSave, { recursive: true });

    const files = await fs.readdir(pathSource, { withFileTypes: true });

    for (let file of files) {
      let mySource = path.join(pathSource, file.name);
      let myCopy = path.join(pathToSave, file.name);
      if (file.isDirectory()) {
        copyDir(mySource, myCopy);
      } else {
        await fs.copyFile(mySource, myCopy);
      }
    }

  } catch (err) {
    console.error(err.message);
  }
}

copyDir(pathFrom, pathTo);
