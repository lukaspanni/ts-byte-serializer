let reporters = require("jasmine-reporters");
let junitReporter = new reporters.JUnitXmlReporter({
  savePath: "test-output/",
  consolidateAll: false,
});
jasmine.getEnv().addReporter(junitReporter);
