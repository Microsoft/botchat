import { imageSnapshotOptions, timeouts } from './constants.json';

// selenium-webdriver API doc:
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html

describe('offline UI', async () => {
  test('should show "unable to connect" UI when connection is slow', async() => {
    const { driver, pageObjects } = await setupWebDriver({
      createDirectLine: options => {
        const workingDirectLine = window.WebChat.createDirectLine(options);

        return {
          activity$: workingDirectLine.activity$,
          postActivity: workingDirectLine.postActivity.bind(workingDirectLine),

          connectionStatus$: new Observable(observer => {
            const subscription = workingDirectLine.connectionStatus$.subscribe({
              complete: () => observer.complete(),
              error: err => observer.error(err),
              next: connectionStatus => {
                connectionStatus !== 2 && observer.next(connectionStatus);
              }
            });

            return () => subscription.unsubscribe();
          })
        };
      },
      setup: () => new Promise(resolve => {
        const scriptElement = document.createElement('script');

        scriptElement.onload = resolve;
        scriptElement.setAttribute('src', 'https://unpkg.com/core-js@2.6.3/client/core.min.js');

        document.head.appendChild(scriptElement);
      })
    });

    await driver.sleep(15000);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);

  test('should show "unable to connect" UI when credentials are incorrect', async() => {
    const { driver, pageObjects } = await setupWebDriver({
      createDirectLine: () => {
        return window.WebChat.createDirectLine({ token: 'INVALID-TOKEN' });
      },
      setup: () => new Promise(resolve => {
        const scriptElement = document.createElement('script');

        scriptElement.onload = resolve;
        scriptElement.setAttribute('src', 'https://unpkg.com/core-js@2.6.3/client/core.min.js');

        document.head.appendChild(scriptElement);
      })
    });

    await driver.wait(async driver => {
      return await driver.executeScript(() =>
        !!~window.WebChatTest.actions.findIndex(({ type }) => type === 'DIRECT_LINE/CONNECT_REJECTED')
      );
    }, timeouts.directLine);

    // Hide cursor before taking screenshot
    await pageObjects.hideCursor();

    const base64PNG = await driver.takeScreenshot();

    expect(base64PNG).toMatchImageSnapshot(imageSnapshotOptions);
  }, 60000);
});
