import { describe, it } from '@jest/globals';
import easyOcr from '../src/index';
import path from 'path';

describe('whisper function', () => {
  it(
    'should transcribe audio successfully',
    async () => {
      const reader = easyOcr.reader('', { pythonPath: '' });
      const textDetection = await reader.readAsText(path.join('media', 'temp-png'));
      console.log(textDetection);
    },
    10 * 60 * 1000,
  );
});
