export default function createNotificationStyleSet({
  notificationAreaHeight,
  notificationErrorColor,
  notificationFontSize,
  notificationIconWidth,
  notificationInfoColor,
  notificationSuccessColor,
  notificationTextPadding,
  notificationWarnColor,
  primaryFont
}) {
  return {
    alignItems: 'center',
    fontFamily: primaryFont,
    fontSize: notificationFontSize,
    minHeight: notificationAreaHeight,

    '&.webchat__notification--error': {
      color: notificationErrorColor,
      fill: notificationErrorColor
    },

    '&.webchat__notification--info': {
      color: notificationInfoColor,
      fill: notificationInfoColor
    },

    '&.webchat__notification--success': {
      color: notificationSuccessColor,
      fill: notificationSuccessColor
    },

    '&.webchat__notification--warn': {
      color: notificationWarnColor,
      fill: notificationWarnColor
    },

    '& .webchat__notification__iconBox': {
      alignItems: 'center',
      // alignSelf: 'stretch',
      display: 'flex',
      height: notificationAreaHeight,
      justifyContent: 'center',
      width: notificationIconWidth
    },

    '& .webchat__notification__dismissButton': {
      alignItems: 'center',
      // alignSelf: 'stretch',
      appearance: 'none',
      backgroundColor: 'Transparent',
      border: 0,
      display: 'flex',
      height: notificationAreaHeight,
      justifyContent: 'center',
      outline: 0,
      padding: 0,
      width: notificationAreaHeight,

      '&:focus .webchat__notification__dismissButtonFocus': {
        borderColor: 'rgba(26, 10, 0, .7)'
      },

      '&:hover .webchat__notification__dismissButtonFocus': {
        backgroundColor: 'rgba(0, 0, 0, .12)'
      }
    },

    '& .webchat__notification__dismissButtonFocus': {
      alignItems: 'center',
      borderColor: 'Transparent',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 3,
      display: 'flex',
      height: 22,
      justifyContent: 'center',
      width: 22
    },

    '& .webchat__notification__text': {
      paddingBottom: notificationTextPadding,
      paddingTop: notificationTextPadding
    }
  };
}
