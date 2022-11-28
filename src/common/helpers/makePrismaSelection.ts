const makePrismaSelection = (map) => {
  const obj = {};
  Object.keys(map).forEach((key) => {
    if (typeof map[key] !== 'boolean') {
      obj[key] = {};
      obj[key].select = makePrismaSelection(map[key]);
    } else {
      if (key !== '__typename') {
        obj[key] = true;
      }
    }
  });
  return obj;
};
export default makePrismaSelection;
