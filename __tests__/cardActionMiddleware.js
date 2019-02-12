import { By, Key } from 'selenium-webdriver';

import { imageSnapshotOptions, timeouts } from './constants.json';

import allOutgoingActivitiesSent from './setup/conditions/allOutgoingActivitiesSent';
import botConnected from './setup/conditions/botConnected';
import suggestedActionsShowed from './setup/conditions/suggestedActionsShowed';
import minNumActivitiesShown from './setup/conditions/minNumActivitiesShown.js';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

test('card action "openUrl"', async () => {
  const { driver, pageObjects } = await setupWebDriver({
    props: {
      cardActionMiddleware: ({ dispatch }) => next => ({ cardAction }) => {
        if (cardAction.type === 'openUrl') {
          dispatch({
            type: 'WEB_CHAT/SEND_MESSAGE',
            payload: {
              text: `Navigating to ${ cardAction.value }`
            }
          });
        } else {
          return next(cardAction);
        }
      }
    }
  });

  await driver.wait(botConnected(), timeouts.directLine);

  const input = await driver.findElement(By.css('input[type="text"]'));

  await input.sendKeys('card-actions', Key.RETURN);
  await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
  await driver.wait(suggestedActionsShowed(), timeouts.directLine);

  const openUrlButton = await driver.findElement(By.css('[role="form"] ul > li:first-child button'));

  await openUrlButton.click();
  await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
  await driver.wait(minNumActivitiesShown(5), timeouts.directLine);

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
}, 60000);

test('card action "signin"', async () => {
  const { driver, pageObjects } = await setupWebDriver({
    props: {
      cardActionMiddleware: ({ dispatch }) => next => ({ cardAction, getSignInUrl }) => {
        if (cardAction.type === 'signin') {
          getSignInUrl().then(url => {
            dispatch({
              type: 'WEB_CHAT/SEND_MESSAGE',
              payload: {
                text: `Signing into ${ new URL(url).host }`
              }
            });
          });
        } else {
          return next(cardAction);
        }
      }
    }
  });

  await driver.wait(botConnected(), timeouts.directLine);

  const input = await driver.findElement(By.css('input[type="text"]'));

  await input.sendKeys('oauth', Key.RETURN);
  await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);

  const openUrlButton = await driver.findElement(By.css('[role="log"] ul > li button'));

  await openUrlButton.click();
  await driver.wait(allOutgoingActivitiesSent(), timeouts.directLine);
  await driver.wait(minNumActivitiesShown(5), timeouts.directLine);

  // When sign in card is show, the focus moved to the "Sign in" button, need to blur it.
  await driver.executeScript(() => {
    for (let element of document.querySelectorAll(':focus')) {
      element.blur();
    }
  });

  const base64PNG = await driver.takeScreenshot();

  expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
}, 60000);
