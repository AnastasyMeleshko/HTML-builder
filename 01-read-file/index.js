const fs = require('fs');
const path = require('path');
const {stdout} = process;

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));
stream.on('data', data => {
  stdout.write(data.toString());
});
