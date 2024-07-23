import coraline from 'coraline';
import easyOcr from './index.js';

const run = async () => {
  await coraline.input.create();

  const reader = easyOcr.reader('', { pythonPath: '/home/simone/.venv/bin/python3', gpu: true, verbose: true });
  const textDetections = await reader.readText('media/temp.png', { allowlist: 'UTGHJBUS0123456789', text_threshold: 0.3 });
  // eslint-disable-next-line no-console
  console.log(textDetections);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
