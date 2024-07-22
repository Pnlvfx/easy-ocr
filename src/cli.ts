import coraline from 'coraline';
import easyOcr from './index.js';

const run = async () => {
  await coraline.input.create();
  // eslint-disable-next-line unicorn/prefer-blob-reading-methods
  const textDetections = await easyOcr.reader('', { pythonPath: '' }).readAsText('media/temp.png');
  // eslint-disable-next-line no-console
  console.log(textDetections);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
