const stripANSI = require('strip-ansi');

const override = require('../../utils/override');

// Send the error back to the browser console.
module.exports = function (webDriver, error) {
  return override(error, async error => {
    /* istanbul ignore next */
    await webDriver.executeScript(
      (message, stack) => {
        const error = new Error(message);

        error.stack = stack;

        console.error(error);

        console.log(
          '%c❌ FAILED%c',
          'background-color: red; border-radius: 4px; color: white; font-size: 200%; padding: 2px 4px;',
          ''
        );

        const div = document.createElement('div');

        div.setAttribute(
          'style',
          'align-items: center; background-color: red; border: solid 4px black; border-radius: 10px; bottom: 10px; display: flex; font-size: 60px; height: 100px; justify-content: center; position: fixed; right: 10px; width: 100px;'
        );

        div.textContent = '❌';

        document.body.appendChild(div);
      },
      stripANSI(error.message),
      stripANSI(error.stack)
    );
  });
};
