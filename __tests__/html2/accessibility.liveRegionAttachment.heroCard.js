/** @jest-environment ./packages/testharness2/src/host/jest/WebDriverEnvironment.js */

describe('accessibility requirement', () => {
  describe('attachments in live region', () => {
    test('hero card', () => runHTML('accessibility.liveRegionAttachment.heroCard.html'));
  });
});
