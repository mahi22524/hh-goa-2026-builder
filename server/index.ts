import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Enable CORS
app.use(cors());

// Security: Set body size limit for large base64 uploads
app.use(express.json({ limit: '15mb' }));

// Ensure 'generated' folder exists
const generatedDir = path.join(__dirname, '../generated');
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(generatedDir));

// POST /api/upload
app.post('/api/upload', async (req: express.Request, res: express.Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Security: Validate file type (must be PNG data URI)
    if (!image.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ error: 'Invalid file format. Only PNG images are accepted.' });
    }

    // Strip header to get base64 data
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    
    // Security: Validate size (Limit to 10MB decoded)
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image exceeds the size limit of 10MB.' });
    }

    // Generate safe filename
    const filename = `hh-goa-frame-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;

    const project = process.env.SUPABASE_PROJECT_ID;
    const bucket = process.env.SUPABASE_BUCKET;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (project && bucket && key) {
      // Use Supabase Storage
      const uploadUrl = `https://${project}.supabase.co/storage/v1/object/${bucket}/${filename}`;
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'image/png',
        },
        body: buffer,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Supabase upload error:', errorText);
        return res.status(500).json({ error: 'Failed to upload generated frame to sharing storage.' });
      }

      const publicUrl = `https://${project}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
      return res.status(200).json({ url: publicUrl });
    } else {
      // Fallback: Local filesystem (for local development)
      const filePath = path.join(generatedDir, filename);
      fs.writeFileSync(filePath, buffer);

      const host = req.get('host');
      const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const publicUrl = `${protocol}://${host}/uploads/${filename}`;

      return res.status(200).json({ url: publicUrl });
    }
  } catch (error) {
    console.error('Upload error:', error);
    // Security: Do not expose internal server paths/stack traces
    return res.status(500).json({ error: 'Internal server error while processing upload.' });
  }
});

// GET /share
app.get('/share', (req: express.Request, res: express.Response) => {
  try {
    const imgParam = req.query.img as string;

    if (!imgParam) {
      return res.status(400).send('Missing image parameter');
    }

    // Security: Validate filename to prevent path traversal and ensure it's a PNG
    const filename = path.basename(imgParam);
    if (!/^[a-zA-Z0-9_\-]+\.png$/.test(filename)) {
      return res.status(400).send('Invalid image parameter');
    }

    const project = process.env.SUPABASE_PROJECT_ID;
    const bucket = process.env.SUPABASE_BUCKET;

    let imageUrl = '';
    const host = req.get('host');
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

    if (project && bucket) {
      imageUrl = `https://${project}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
    } else {
      // Verify file exists locally (Fallback mode)
      const filePath = path.join(generatedDir, filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('Shared image not found');
      }
      imageUrl = `${protocol}://${host}/uploads/${filename}`;
    }

    const redirectUrl = `${protocol}://${host}`;

    // Return HTML with OG Metadata and a beautiful preview interface
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hacker House Goa 2026 — Shared Builder Frame</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="Hacker House Goa 2026 Builder Frame">
  <meta name="description" content="I just generated my official Hacker House Goa 2026 Builder Frame! Create your custom frame now.">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${protocol}://${host}/share?img=${filename}">
  <meta property="og:title" content="Hacker House Goa 2026 Builder Frame">
  <meta property="og:description" content="I just generated my official Hacker House Goa 2026 Builder Frame! Create your custom frame now.">
  <meta property="og:image" content="${imageUrl}">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${protocol}://${host}/share?img=${filename}">
  <meta name="twitter:title" content="Hacker House Goa 2026 Builder Frame">
  <meta name="twitter:description" content="I just generated my official Hacker House Goa 2026 Builder Frame! Create your custom frame now.">
  <meta name="twitter:image" content="${imageUrl}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-color: #03140b;
      --text-color: #f7f4eb;
      --accent-color: #ffde6a;
      --card-bg: #072314;
      --border-color: #1b3d27;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: 'Space Grotesk', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .container {
      max-width: 500px;
      width: 90%;
      text-align: center;
      padding: 24px;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    h1 {
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 8px;
      color: var(--accent-color);
      letter-spacing: -0.5px;
    }
    p {
      font-size: 14px;
      color: rgba(247, 244, 235, 0.7);
      margin-bottom: 24px;
    }
    .image-preview {
      width: 100%;
      aspect-ratio: 1/1;
      background-color: #000;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn {
      display: inline-block;
      padding: 14px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background-color: var(--accent-color);
      color: #03140b;
    }
    .btn-primary:hover {
      background-color: #ffe68d;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background-color: transparent;
      color: var(--text-color);
      border: 1px solid var(--border-color);
    }
    .btn-secondary:hover {
      background-color: rgba(247, 244, 235, 0.05);
      border-color: rgba(247, 244, 235, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>HACKER HOUSE GOA 2026</h1>
    <p>Official Builder Frame Generated Profile Frame</p>
    <div class="image-preview">
      <img src="${imageUrl}" alt="Hacker House Goa 2026 Builder Frame">
    </div>
    <div class="actions">
      <a href="${redirectUrl}" class="btn btn-primary">Create Your Frame</a>
      <a href="${imageUrl}" download="${filename}" class="btn btn-secondary">Download Image</a>
    </div>
  </div>
</body>
</html>
    `);
  } catch (error) {
    console.error('Share page error:', error);
    return res.status(500).send('Internal server error');
  }
});

// Serve frontend built assets in production
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    // If route is not share or api, serve the index.html from dist
    if (!req.path.startsWith('/api') && !req.path.startsWith('/share') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distDir, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
