const { execSync } = require('child_process');
const {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} = require('fs');

const readJsonSync = (f) => {
  const data = readFileSync(f, { encoding: 'utf8' });
  return JSON.parse(data);
};

const writeJsonSync = (f, o) => {
  const data = JSON.stringify(o, null, 2) + '\n';
  writeFileSync(f, data, { encoding: 'utf8' });
};

const mergeBouzuyaJson = (originalJson, bouzuyaJson, outputJson) => {
  const original = readJsonSync(originalJson);
  const bouzuya = readJsonSync(bouzuyaJson);
  const o = { ...original, ...bouzuya };
  // dirty hack for sort props
  const data = Object.keys(o).sort().reduce((a, k) => {
    return {
      ...a, ...{ [k]: o[k] }
    };
  }, {});
  writeJsonSync(outputJson, data);
};

const verifyPackages = (bouzuyaJson) => {
  const packageNames = Object.keys(readJsonSync(bouzuyaJson));

  writeJsonSync(
    './psc-package.json',
    { name: 'test', set: 'testing', source: '', depends: [] }
  );
  if (!existsSync('./.psc-package'))
    mkdirSync('./.psc-package');
  if (!existsSync('./.psc-package/testing'))
    mkdirSync('./.psc-package/testing');
  if (!existsSync('./.psc-package/testing/.set'))
    mkdirSync('./.psc-package/testing/.set');

  copyFileSync('./packages.json', './.psc-package/testing/.set/packages.json');

  packageNames.forEach((packageName) => {
    const output = execSync(
      `npm run psc-package -- verify ${packageName}`,
      { encoding: 'utf8' }
    );
    console.log(output);
  });
};

const main = () => {
  mergeBouzuyaJson('./packages.json', './bouzuya.json', './packages.json');
  verifyPackages('./bouzuya.json');
};

main();
