/** @jest-environment ./packages/testharness2/src/host/jest/WebDriverEnvironment.js */

describe('offline UI', () => {
  test('should display "Network interruption occurred. Reconnecting…" status when connection is interrupted', () =>
    runHTML('offlineUI.networkInterrupt.html'));
});
