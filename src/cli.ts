import coraline from 'coraline';
import easyOcr from './index.js';

const run = async () => {
  await coraline.input.create();

  const reader = easyOcr.reader('', { pythonPath: '/home/simone/web/gto-poker/.venv/bin/python3' });
  const textDetections = await reader.readText('media/temp.png');
  // eslint-disable-next-line no-console
  console.log(textDetections);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
