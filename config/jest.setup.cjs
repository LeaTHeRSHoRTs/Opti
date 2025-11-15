(() => {
  const path = require("path");
  const optiPath = path.resolve(__dirname, "../dist/opti.js");
  try {
    require(optiPath);
  } catch (e) {
    console.error(optiPath, "did not load");
  }

  const setup = globalThis.JEST_SETUP_FILE;

  if (setup) {
    try {
      const modulePath = path.resolve(__dirname, "../dist", setup);
      require(modulePath);
    } catch (e) {
      console.error(`Could not locate file ${setup}: ${e}`);
    }
  }
})();