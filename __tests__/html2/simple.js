/** @jest-environment ./packages/testharness2/src/host/jest/WebDriverEnvironment.js */

describe('simple', () => {
  test('should render UI.', () => runHTML('simple.html'));
});