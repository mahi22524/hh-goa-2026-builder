import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, '../public/fonts');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=JetBrains+Mono:wght@400&family=Space+Grotesk:wght@400;700&display=swap';

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: status code ${res.statusCode}`));
        } else {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file from ${url}: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    if (!fs.existsSync(FONTS_DIR)) {
      fs.mkdirSync(FONTS_DIR, { recursive: true });
    }

    const targets = [
      { family: 'Space Grotesk', weight: '400', filename: 'SpaceGrotesk-Regular.woff2' },
      { family: 'Space Grotesk', weight: '700', filename: 'SpaceGrotesk-Bold.woff2' },
      { family: 'Fraunces', weight: '700', filename: 'Fraunces-Bold.woff2' },
      { family: 'JetBrains Mono', weight: '400', filename: 'JetBrainsMono-Regular.woff2' }
    ];

    let allExist = true;
    for (const target of targets) {
      if (!fs.existsSync(path.join(FONTS_DIR, target.filename))) {
        allExist = false;
        break;
      }
    }

    if (allExist) {
      console.log('All fonts already downloaded. Skipping Google Fonts fetch.');
      return;
    }

    console.log('Fetching Google Fonts CSS metadata...');
    const css = await fetchUrl(CSS_URL, { 'User-Agent': USER_AGENT });

    // Parse the CSS.
    // We look for latin blocks.
    // Each font face looks like:
    // /* latin */
    // @font-face {
    //   font-family: 'Space Grotesk';
    //   font-style: normal;
    //   font-weight: 400;
    //   src: url(https://fonts.gstatic.com/s/spacegrotesk/v16/...) format('woff2');
    // }
    
    // Split the CSS by "@font-face"
    const blocks = css.split('@font-face');
    
    // We want to find specific combinations:
    // 1. family 'Space Grotesk', weight 400, latin
    // 2. family 'Space Grotesk', weight 700, latin
    // 3. family 'Fraunces', weight 700, latin
    // 4. family 'JetBrains Mono', weight 400, latin
    
    // The targets are already declared above. We can use them directly.

    console.log('Extracting and downloading font URLs...');
    for (const target of targets) {
      let matchedUrl = null;
      
      for (const block of blocks) {
        // Check if this block matches our target family and weight and is latin
        const hasFamily = block.toLowerCase().includes(`font-family: '${target.family.toLowerCase()}'`) ||
                          block.toLowerCase().includes(`font-family: "${target.family.toLowerCase()}"`);
        const hasWeight = block.toLowerCase().includes(`font-weight: ${target.weight}`) ||
                          block.toLowerCase().includes(`font-weight:  ${target.weight}`); // double space sometimes
        
        // Google fonts puts comments like "/* latin */" right before @font-face, which lands in the preceding split,
        // or inside the @font-face block if parsed differently. Since we split by '@font-face', the comment '/* latin */'
        // for block N is actually at the end of block N-1. But we can check if the block contains "latin" or check
        // the url pattern. Standard latin blocks usually contain the latin character sets.
        // Actually, we can check if it contains 'src: url('
        if (hasFamily && hasWeight) {
          const urlMatch = block.match(/src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
          if (urlMatch) {
            matchedUrl = urlMatch[1];
            // If it's a latin block, we select it. (The css output usually has latin at the end of the block list)
            // If there's multiple, let's pick it. We can just keep the last one or the one matching latin.
            // Let's print out the match.
          }
        }
      }

      if (matchedUrl) {
        const dest = path.join(FONTS_DIR, target.filename);
        console.log(`- Downloading ${target.filename} from ${matchedUrl}...`);
        await downloadFile(matchedUrl, dest);
      } else {
        console.error(`- Failed to find URL for font ${target.family} (${target.weight})`);
      }
    }

    console.log('Font downloads complete!');
  } catch (error) {
    console.error('Font download failed:', error);
    process.exit(1);
  }
}

main();
