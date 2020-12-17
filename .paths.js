const path = require('path');

const root = __dirname;
const env = path.join(root, './.env');
const src = path.join(root, '/src');
const entry = path.join(src, '/index.js');
const atoms = path.join(src, '/components/atoms');
const molecules = path.join(src, '/components/molecules');
const organisms = path.join(src, '/components/organisms');

const dist = path.join(__dirname, '/dist');

const alias = { src, atoms, molecules, organisms };

module.exports = {
  root,
  env,
  src,
  entry,
  dist,
  alias,
};
