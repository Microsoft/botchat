import { legacyEmbedURL } from '../urlBuilder';
import createElement from '../createElement';

function azureEffectiveLocale(language) {
  return language.toLowerCase().replace(/-/, '.');
}

export default function setupLegacyVersionFamily({ botId }, { language, secret, token }, features = []) {
  return new Promise((resolve, reject) => {
    // Version 1 also depends on your token.
    // If you are using a token on Aries, you get Aries (v1).
    // If you are using a token on Scorpio, you get Scorpio (v3).

    const params = new URLSearchParams();

    features.length && params.set('features', features.join(','));
    language && params.set('l', azureEffectiveLocale(language));
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
