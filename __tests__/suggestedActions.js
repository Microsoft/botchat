import { By, Key } from 'selenium-webdriver';

import { imageSnapshotOptions, timeouts } from './constants.json';

import allOutgoingActivitiesSent from './setup/conditions/allOutgoingActivitiesSent';
import botConnected from './setup/conditions/botConnected';
import minNumActivitiesShown from './setup/conditions/minNumActivitiesShown';
import suggestedActionsShowed from './setup/conditions/suggestedActionsShowed';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

describe('suggested-actions command', async () => {
  test('should show correctly formatted buttons when suggested actions are displayed', async() => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(botConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('suggested-actions', Key.RETURN);
    await driver.wait(suggestedActionsShowed(), timeouts.directLine);
    await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('should show response from bot and no text from user on imback', async () => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(botConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('suggested-actions', Key.RETURN);
    await driver.wait(suggestedActionsShowed(), timeouts.directLine);

    const buttons = await driver.findElements(By.css('button'));

    const imBackButton = buttons[1];

    await imBackButton.click();
    await driver.wait(minNumActivitiesShown(4), timeouts.directLine);
    await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('should show response from bot and no text from user on postback', async () => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(botConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('suggested-actions', Key.RETURN);
    await driver.wait(suggestedActionsShowed(), timeouts.directLine);

    const buttons = await driver.findElements(By.css('button'));

    const postBackStringButton = buttons[2];

    await postBackStringButton.click();
    await driver.wait(minNumActivitiesShown(3), timeouts.directLine);
    await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('should show response from bot and text from user on postback', async () => {
    const { driver, pageObjects } = await setupWebDriver();

      await driver.wait(botConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('suggested-actions', Key.RETURN);
    await driver.wait(suggestedActionsShowed(), timeouts.directLine);

    const buttons = await driver.findElements(By.css('button'));

    const postBackStringButton = buttons[3];

    await postBackStringButton.click();
    await driver.wait(minNumActivitiesShown(3), timeouts.directLine);
    await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);


  test('should show response from bot and no text from user on messageback', async () => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(botConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('suggested-actions', Key.RETURN);
    await driver.wait(suggestedActionsShowed(), timeouts.directLine);

    const buttons = await driver.findElements(By.css('button'));

    const postBackStringButton = buttons[4];

    await postBackStringButton.click();
    await driver.wait(minNumActivitiesShown(4), timeouts.directLine);
    await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('should show response from bot and text from user on messageback', async () => {
    const { driver, pageObjects } = await setupWebDriver();

    await driver.wait(botConnected(), timeouts.directLine);

    const input = await driver.findElement(By.css('input[type="text"]'));

    await input.sendKeys('suggested-actions', Key.RETURN);
    await driver.wait(suggestedActionsShowed(), timeouts.directLine);

    const buttons = await driver.findElements(By.css('button'));

    const postBackStringButton = buttons[4];

    await postBackStringButton.click();
    await driver.wait(minNumActivitiesShown(4), timeouts.directLine);
    await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);
});
