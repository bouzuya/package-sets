const fs = require('fs');

const readJsonSync = (f) => {
  const data = fs.readFileSync(f, { encoding: 'utf-8' });
  return JSON.parse(data);
};

const writeJsonSync = (f, o) => {
  const data = JSON.stringify(o, null, 2) + '\n';
  fs.writeFileSync(f, data, { encoding: 'utf-8' });
};

const main = () => {
  const original = readJsonSync('./packages.json');
  const bouzuya = readJsonSync('./bouzuya.json');
  const o = { ...original, ...bouzuya };
  // dirty hack for sort props
  const data = Object.keys(o).sort().reduce((a, k) => {
    return {
      ...a, ...{ [k]: o[k] }
    };
  }, {});
  writeJsonSync('./packages.json', data);
};

main();
