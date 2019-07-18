/* eslint no-magic-numbers: ["error", { "ignore": [2] }] */

export default function CarouselFilmStrip({ bubbleMaxWidth, bubbleMinWidth, paddingRegular }) {
  return {
    // Browser quirks: Firefox has no way to hide scrollbar and while keeping it in function
    // https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
    '@supports (-moz-appearance: none)': {
      marginBottom: -17
    },

    paddingLeft: paddingRegular,

    '&.indented-content > .content': {
      marginLeft: paddingRegular
    },

    '&.extra-right-indent > .content': {
      paddingRight: paddingRegular * 2
    },

    '&:not(.extra-right-indent) > .content': {
      paddingRight: paddingRegular
    },

    '& > .content': {
      '& > ul': {
        '&:not(:first-child)': {
          marginTop: paddingRegular
        },

        '& > li': {
          maxWidth: bubbleMaxWidth,
          minWidth: bubbleMinWidth,

          '&:not(:last-child)': {
            marginRight: paddingRegular
          }
        }
      },

      '& > .indented': {
        marginLeft: paddingRegular
      }
    }
  };
}
