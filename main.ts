import { cpSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-threejs.ts';

const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const MAX_SCREENSHOTS = 4;
const MAX_SCREENSHOT_BYTES = 262144;
const MAX_DOSSIER_BYTES = 1.5 * 1024 * 1024;
const MAX_SOURCE_BYTES = 163840;

function fail(message: string): never {
  throw new Error(message);
}

function entries(path: string): string[] {
  return readdirSync(path).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function validateGame(game: string): void {
  const index = join(game, 'index.html');
  if (!lstatSync(index).isFile()) fail(`${index} is not a regular file`);
  console.log('PASS game/index.html is a regular file');

  function walk(directory: string): void {
    for (const name of entries(directory)) {
      const path = join(directory, name);
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) fail(`${path} is a symbolic link`);
      if (stat.isDirectory()) walk(path);
      else if (!stat.isFile()) fail(`${path} is not a regular file`);
    }
  }
  walk(game);
  console.log('PASS game contains no symbolic links');
}

function validateScreenshots(directory: string): string[] {
  const names = entries(directory);
  if (names.length < 3 || names.length > MAX_SCREENSHOTS) {
    fail(`${directory} contains ${names.length} entries; expected 3 or 4 screenshots`);
  }
  const allowed = /\.(?:png|jpe?g)$/i;
  for (const name of names) {
    const path = join(directory, name);
    const stat = lstatSync(path);
    if (!stat.isFile() || !allowed.test(name)) fail(`${path} is not a regular PNG or JPEG file`);
    if (stat.size > MAX_SCREENSHOT_BYTES) fail(`${path} is ${stat.size} bytes; maximum is ${MAX_SCREENSHOT_BYTES}`);
    console.log(`PASS ${path} is a regular image (${stat.size} bytes)`);
  }
  console.log(`PASS screenshots contains ${names.length} regular image files`);
  return names;
}

function gameTotals(game: string): { files: number; bytes: number } {
  let files = 0;
  let bytes = 0;
  function walk(directory: string): void {
    for (const name of entries(directory)) {
      const path = join(directory, name);
      const stat = lstatSync(path);
      if (stat.isDirectory()) walk(path);
      else if (stat.isFile()) {
        files++;
        bytes += stat.size;
      }
    }
  }
  walk(game);
  return { files, bytes };
}

function main(): void {
  const game = join(root, 'game');
  const screenshots = join(root, 'screenshots');
  validateGame(game);
  const screenshotNames = validateScreenshots(screenshots);
  console.log(`PASS screenshots sorted by name; cover is ${screenshotNames[0]}`);

  mkdirSync(output, { recursive: true });
  rmSync(join(output, 'game'), { recursive: true, force: true });
  rmSync(join(output, 'screenshots'), { recursive: true, force: true });
  cpSync(game, join(output, 'game'), { recursive: true });
  cpSync(screenshots, join(output, 'screenshots'), { recursive: true });

  const dossierBytes = buildDossier(output, {
    text_max_bytes: MAX_SOURCE_BYTES,
    screenshots: { max: MAX_SCREENSHOTS, max_bytes: MAX_SCREENSHOT_BYTES },
    game_max_files: 993,
    game_max_bytes: 50331648,
  });
  const dossierText = JSON.parse(Buffer.from(dossierBytes).toString('utf8')).text as string;
  const sourceBytes = Buffer.byteLength(dossierText, 'utf8');
  if (dossierBytes.length > MAX_DOSSIER_BYTES) fail(`dossier is ${dossierBytes.length} bytes; maximum is ${MAX_DOSSIER_BYTES}`);
  if (sourceBytes > MAX_SOURCE_BYTES) fail(`dossier source text is ${sourceBytes} bytes; maximum is ${MAX_SOURCE_BYTES}`);
  console.log(`PASS dossier serialized bytes are ${dossierBytes.length} (maximum ${MAX_DOSSIER_BYTES})`);
  console.log(`PASS dossier source text is ${sourceBytes} UTF-8 bytes (maximum ${MAX_SOURCE_BYTES})`);
  writeFileSync(join(output, 'dossier.json'), dossierBytes);

  const totals = gameTotals(game);
  console.log(`SUMMARY game: ${totals.files} files, ${totals.bytes} bytes`);
  console.log(`SUMMARY screenshots: ${screenshotNames.length}, cover ${screenshotNames[0]}`);
  console.log(`SUMMARY dossier: ${dossierBytes.length} bytes`);
}

try {
  main();
} catch (error) {
  console.error(`ERROR: ${(error as Error).message}`);
  process.exitCode = 1;
}
