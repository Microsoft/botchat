import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

import AdaptiveCardBuilder from './AdaptiveCardBuilder';
import AdaptiveCardRenderer from './AdaptiveCardRenderer';

export default class HeroCardAttachment extends React.Component {
  constructor(props) {
    super(props);

    this.buildCard = memoize((adaptiveCards, content) => {
      const builder = new AdaptiveCardBuilder(adaptiveCards);

      (content.images || []).forEach(image => builder.addImage(image.url, null, image.tap));

      builder.addCommon(content);

      return builder.card;
    });
  }

  render() {
    const {
      props: {
        adaptiveCards,
        attachment: { content } = {}
      }
    } = this;

    return (
      <AdaptiveCardRenderer
        adaptiveCard={ content && this.buildCard(adaptiveCards, content) }
        tapAction={ content && content.tap }
      />
    );
  }
}

HeroCardAttachment.propTypes = {
  adaptiveCards: PropTypes.any,
  attachment: PropTypes.shape({
    content: PropTypes.any
  })
};
