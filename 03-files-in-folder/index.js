const { readdir, stat } = require('fs').promises;
const path = require('path');
const { stdout } = process;

(async() =>  {
  const folderPath = path.join(__dirname, 'secret-folder');

  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const stats = await stat(path.join(folderPath, file.name));
        stdout.write(`${path.parse(file.name).name} - ${path.extname(file.name).slice(1)} - ${stats.size}b\n`);
      }
    }
  } catch (error) {
    stdout.write(error.message);
  }
})();
