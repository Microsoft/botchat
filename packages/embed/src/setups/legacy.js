import { legacyEmbedURL } from '../urlBuilder';
import createElement from './createElement';

const JAVASCRIPT_LOCALE_PATTERN = /^([a-z]{2})(-([A-Za-z]{2}))?$/;

function toAzureLocale(language) {
  const match = JAVASCRIPT_LOCALE_PATTERN.exec(language);

  if (match) {
    if (match[2]) {
      return `${ match[1] }.${ match[1] }-${ match[2].toLowerCase() }`;
    } else {
      return match[1];
    }
  }
}

export default function setupLegacyVersionFamily(_, { botId }, { language, secret, token }, features = []) {
  return new Promise((resolve, reject) => {
    // Version 1 also depends on your token.
    // If you are using a token on Aries, you get Aries (v1).
    // If you are using a token on Scorpio, you get Scorpio (v3).

    const params = new URLSearchParams();

    features.length && params.set('features', features.join(','));
    language && params.set('l', toAzureLocale(language));
    secret && params.set('s', secret);
    token && params.set('t', token);

    document.body.appendChild(
      createElement(
        'div',
        {
          style: {
            height: '100%',
            overflow: 'hidden'
          }
        },
        createElement(
          'iframe',
          {
            onError: reject,
            onLoad: resolve,
            src: legacyEmbedURL(botId, params),
            style: {
              border: '0',
              height: '100%',
              width: '100%'
            }
          }
        )
      )
    );
  });
}
