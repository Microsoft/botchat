/** @jest-environment ./packages/testharness2/src/host/jest/WebDriverEnvironment.js */

describe('Auto-scroll with "page" snap behavior', () => {
  test('should scroll correctly', () => runHTML('autoScroll.snap.page.html'));
});