import { imageSnapshotOptions, timeouts } from './constants.json';

import minNumActivitiesShown from './setup/conditions/minNumActivitiesShown';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

test('send username in activity', async () => {
  const { driver, pageObjects } = await setupWebDriver();

  await pageObjects.sendMessageViaSendBox('user name');

  await driver.wait(minNumActivitiesShown(3), timeouts.directLine);

  // Hide cursor before taking screenshot
  await pageObjects.hideCursor();

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
}, timeouts.test);
