import setupAntares from './antares';
import setupScorpio from './scorpio';
import setupVersion3 from './version3';
import setupVersion4 from './version4';

export default async function setup(versionFamily, ...args) {
  switch (versionFamily) {
    case 'antares':
      await setupAntares(...args);
      break;

    case 'scorpio':
      await setupScorpio(...args);
      break;

    case '3':
      await setupVersion3(...args);
      break;

    default:
      await setupVersion4(...args);
      break;
  }
}
