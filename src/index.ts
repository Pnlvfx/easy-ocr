import coraline, { temporaryFile } from 'coraline';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

interface OcrOptions {
  pythonPath: string;
}

interface Point {
  0: number;
  1: number;
}

interface BoundingBox {
  0: Point;
  1: Point;
  2: Point;
  3: Point;
}

export interface TextDetection {
  bounding_box: BoundingBox;
  text: string;
  confidence: number;
}

const script = path.join(import.meta.dirname, 'python/easy-ocr.py');

const easyOcr = {
  reader: (_lang: string, options: OcrOptions) => {
    return {
      readAsText: (image: string) => {
        return new Promise<TextDetection[]>((resolve, reject) => {
          const output = temporaryFile({ extension: 'json' });
          const ocr = spawn(options.pythonPath, [script, image, output]);

          ocr.on('error', reject);

          let error = '';

          ocr.stderr.on('data', (chunk: Buffer) => {
            error += chunk.toString();
          });

          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          ocr.on('close', async (code) => {
            if (code === 0) {
              const data = await fs.readFile(output, { encoding: 'utf8' });
              await coraline.rm(output);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              resolve(JSON.parse(data));
            } else {
              reject(new Error(error));
            }
          });
        });
      },
    };
  },
};

export default easyOcr;
