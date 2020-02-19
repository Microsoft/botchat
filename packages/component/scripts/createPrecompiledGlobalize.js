const { format } = require('prettier');
const { join } = require('path');
const { writeFileSync } = require('fs');
const Globalize = require('globalize');
const globalizeCompiler = require('globalize-compiler');
const languages = Object.values(require('../src/Localization/overrides.json')).map(
  ({ GLOBALIZE_LANGUAGE }) => GLOBALIZE_LANGUAGE
);

Globalize.load(require('cldr-data').entireSupplemental());

const formattersAndParsers = languages.reduce((formattersAndParsers, language) => {
  Globalize.load(require('cldr-data').entireMainFor(language));

  const globalize = new Globalize(language);

  return [
    ...formattersAndParsers,
    ...[
      globalize.relativeTimeFormatter('hour'),
      globalize.relativeTimeFormatter('minute'),
      globalize.unitFormatter('byte', { form: 'long' }),
      globalize.unitFormatter('kilobyte', { form: 'short' }),
      globalize.unitFormatter('megabyte', { form: 'short' }),
      globalize.unitFormatter('gigabyte', { form: 'short' })
    ]
  ];
}, []);

const code = format(globalizeCompiler.compile(formattersAndParsers), { parser: 'babel' });

writeFileSync(join(__dirname, '../lib/Utils/PrecompiledGlobalize.js'), code);
