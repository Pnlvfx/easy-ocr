import type { TextDetection } from './types.js';
import coraline, { temporaryFile } from 'coraline';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const script = path.join(import.meta.dirname, '../../python/easy-ocr.py');

interface OcrOptions {
  gpu?: boolean;
  download_enabled?: boolean;
  verbose?: boolean;
  cudnn_benchmark?: boolean;
  pythonPath?: string;
}

interface ReadTextOptions {
  allowlist?: string;
  blocklist?: string;
  threshold?: number;
  text_threshold?: number;
}

const easyOcr = {
  /** Lang list will become string | string[] */
  reader: (lang_list: string, ocrOptions: OcrOptions = {}) => {
    return {
      readText: (image: string, options: ReadTextOptions = {}) => {
        return new Promise<TextDetection[]>((resolve, reject) => {
          const python = ocrOptions.pythonPath ?? 'python3';
          delete ocrOptions.pythonPath;
          const output = temporaryFile({ extension: 'json' });
          const ocr = spawn(python, [script, image, lang_list, output, JSON.stringify(ocrOptions), JSON.stringify(options)]);

          ocr.on('error', reject);

          let error = '';

          ocr.stderr.on('data', (chunk: Buffer) => {
            error += chunk.toString();
          });

          ocr.stdout.on('data', (chunk: Buffer) => {
            if (ocrOptions.verbose) {
              // eslint-disable-next-line no-console
              console.log(chunk.toString());
            }
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

export type { BoundingBox, Point, TextDetection } from './types.js';
