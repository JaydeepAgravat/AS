const fs = require('fs');
const path = require('path');

const SRC_PATH = path.join(process.cwd(), 'src');

// ---------- GET FOLDERS ----------
function getSrcFolders() {
  if (!fs.existsSync(SRC_PATH)) {
    console.log('❌ src folder not found');
    process.exit(1);
  }

  return fs.readdirSync(SRC_PATH).filter(item => {
    const fullPath = path.join(SRC_PATH, item);
    return fs.statSync(fullPath).isDirectory();
  });
}

// ---------- GENERATE ALIASES ----------
function generateAliases() {
  const folders = getSrcFolders();

  const tsPaths = {};
  const babelAliases = {};

  folders.forEach(folder => {
    const key = `@${folder}`;

    tsPaths[`${key}/*`] = [`src/${folder}/*`];
    babelAliases[key] = `./src/${folder}`;
  });

  return { tsPaths, babelAliases };
}

// ---------- UPDATE TSCONFIG ----------
function updateTsConfig(tsPaths) {
  const tsPath = path.join(process.cwd(), 'tsconfig.json');

  if (!fs.existsSync(tsPath)) {
    console.log('❌ tsconfig.json not found');
    return;
  }

  const tsConfig = JSON.parse(fs.readFileSync(tsPath, 'utf-8'));

  tsConfig.compilerOptions = tsConfig.compilerOptions || {};
  tsConfig.compilerOptions.baseUrl = '.';
  tsConfig.compilerOptions.paths = tsPaths;
  tsConfig.compilerOptions.types = ['jest'];

  fs.writeFileSync(tsPath, JSON.stringify(tsConfig, null, 2));
  console.log('✅ tsconfig.json updated');
}

// ---------- UPDATE BABEL CONFIG ----------
function updateBabelConfig(babelAliases) {
  const babelPath = path.join(process.cwd(), 'babel.config.js');

  if (!fs.existsSync(babelPath)) {
    console.log('❌ babel.config.js not found');
    return;
  }

  const content = `
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: ${JSON.stringify(babelAliases, null, 8)},
      },
    ],
  ],
};
`;

  fs.writeFileSync(babelPath, content.trim());
  console.log('✅ babel.config.js updated');
}

// ---------- RUN ----------
function run() {
  const { tsPaths, babelAliases } = generateAliases();

  updateTsConfig(tsPaths);
  updateBabelConfig(babelAliases);

  console.log('🚀 Dynamic alias setup completed!');
}

run();
