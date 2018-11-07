import { Builder } from 'selenium-webdriver';
import { createServer } from 'http';
import { join } from 'path';
import { promisify } from 'util';
import { configureToMatchImageSnapshot, toMatchImageSnapshot } from 'jest-image-snapshot';
import getPort from 'get-port';
import handler from 'serve-handler';

import setupBrowsers from './setupBrowsers';

const BROWSER_NAME = 'chrome-local';

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    customSnapshotsDir: join(__dirname, '../__image_snapshots__', BROWSER_NAME)
  })
});

let driverPromise;
let serverPromise;

global.setupWebDriver = async () => {
  if (!driverPromise) {
    driverPromise = (async () => {
      const builder = new Builder().forBrowser('chrome');
      const { port } = await global.setupWebServer();
      const driver = await setupBrowsers(BROWSER_NAME, builder).build();

      await driver.get(`http://localhost:${ port }/index.html`);

      return { driver };
    })();
  }

  return await driverPromise;
};

global.setupWebServer = async () => {
  if (!serverPromise) {
    serverPromise = new Promise(async (resolve, reject) => {
      const port = await getPort();
      const httpServer = createServer((req, res) => handler(req, res, {
        redirects: [
          { source: '/', destination: '__tests__/setup/index.html' }
        ],
        rewrites: [
          { source: '/webchat.js', destination: 'packages/bundle/dist/webchat.js' },
          { source: '/webchat-es5.js', destination: 'packages/bundle/dist/webchat-es5.js' },
          { source: '/webchat-minimal.js', destination: 'packages/bundle/dist/webchat-minimal.js' }
        ],
        public: join(__dirname, '../..'),
      }));

      httpServer.once('error', reject);

      httpServer.listen(port, () => {
        resolve({
          close: promisify(httpServer.close.bind(httpServer)),
          port
        });
      });
    });
  }

  return await serverPromise;
}

afterEach(async () => {
  if (driverPromise) {
    const { driver } = await driverPromise;

    try {
      global.__coverage__ = await driver.executeScript(() => window.__coverage__);
    } finally {
      await driver.quit();
    }
  }
});

afterAll(async () => {
  if (serverPromise) {
    await (await serverPromise).close();
  }
});
