import { By, Key } from 'selenium-webdriver';

import { imageSnapshotOptions, timeouts } from './constants.json';
import directLineConnected from './setup/conditions/directLineConnected';
import minNumActivitiesReached from './setup/conditions/minNumActivitiesReached';
import webChatLoaded from './setup/conditions/webChatLoaded';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

describe('stacked without avatar initials', () => {
  test('4 attachments', async () => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(webChatLoaded(), timeouts.navigation);
    await driver.wait(directLineConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('layout stacked', Key.RETURN);
    await driver.wait(minNumActivitiesReached(2), timeouts.directLine);

    // TODO: [P2] Remove this sleep which wait for the image to be loaded
    await driver.sleep(1000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    expect(await driver.takeScreenshot()).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('1 attachment', async () => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(webChatLoaded(), timeouts.navigation);
    await driver.wait(directLineConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('layout single', Key.RETURN);
    await driver.wait(minNumActivitiesReached(2), timeouts.directLine);

    // TODO: [P2] Remove this sleep which wait for the image to be loaded
    await driver.sleep(1000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    expect(await driver.takeScreenshot()).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('1 attachment with wide screen', async () => {
    const { driver, pageObjects } = await setupWebDriver({ width: 640 });

    await driver.wait(webChatLoaded(), timeouts.navigation);
    await driver.wait(directLineConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('layout single', Key.RETURN);
    await driver.wait(minNumActivitiesReached(2), timeouts.directLine);

    // TODO: [P2] Remove this sleep which wait for the image to be loaded
    await driver.sleep(1000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    expect(await driver.takeScreenshot()).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);
});

describe('stacked with avatar initials', () => {
  const WEB_CHAT_PROPS = { styleOptions: { botAvatarInitials: 'BF', userAvatarInitials: 'WC' } };

  test('4 attachments', async () => {
    const { driver, pageObjects } = await setupWebDriver({ props: WEB_CHAT_PROPS });

    await driver.wait(webChatLoaded(), timeouts.navigation);
    await driver.wait(directLineConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('layout stacked', Key.RETURN);
    await driver.wait(minNumActivitiesReached(2), timeouts.directLine);

    // TODO: [P2] Remove this sleep which wait for the image to be loaded
    await driver.sleep(1000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    expect(await driver.takeScreenshot()).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('1 attachment', async () => {
    const { driver, pageObjects } = await setupWebDriver({ props: WEB_CHAT_PROPS });

    await driver.wait(webChatLoaded(), timeouts.navigation);
    await driver.wait(directLineConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('layout single', Key.RETURN);
    await driver.wait(minNumActivitiesReached(2), timeouts.directLine);

    // TODO: [P2] Remove this sleep which wait for the image to be loaded
    await driver.sleep(1000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    expect(await driver.takeScreenshot()).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('1 attachment with wide screen', async () => {
    const { driver, pageObjects } = await setupWebDriver({ props: WEB_CHAT_PROPS, width: 640 });

    await driver.wait(webChatLoaded(), timeouts.navigation);
    await driver.wait(directLineConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('layout single', Key.RETURN);
    await driver.wait(minNumActivitiesReached(2), timeouts.directLine);

    // TODO: [P2] Remove this sleep which wait for the image to be loaded
    await driver.sleep(1000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    expect(await driver.takeScreenshot()).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);
});
