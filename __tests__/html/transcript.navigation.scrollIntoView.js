/**
 * @jest-environment ./__tests__/html/__jest__/WebChatEnvironment.js
 */

describe('transcript navigation', () => {
  test('should scroll activated activity into view', () => runHTMLTest('transcript.navigation.scrollIntoView'));
});
