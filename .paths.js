const path = require('path');

const root = __dirname;
const env = path.join(root, './.env');
const src = path.join(root, '/src');
const entry = path.join(src, '/index.js');

const dist = path.join(__dirname, '/dist');

const alias = { src };

module.exports = {
  root,
  env,
  src,
  entry,
  dist,
  alias,
};
