import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const imgParam = req.query.img as string;

    if (!imgParam) {
      return res.status(400).send('Missing image parameter');
    }

    const filename = imgParam.split('/').pop() || '';
    if (!/^[a-zA-Z0-9_\-]+\.png$/.test(filename)) {
      return res.status(400).send('Invalid image parameter');
    }

    const project = process.env.SUPABASE_PROJECT_ID;
    const bucket = process.env.SUPABASE_BUCKET;

    if (!project || !bucket) {
      return res.status(500).send('Storage provider is not configured.');
    }

    // Reconstruct Supabase public URL
    const imageUrl = `https://${project}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;

    const host = req.headers.host || 'hh-goa-2026-builder.vercel.app';
    const protocol = 'https';
    const redirectUrl = `${protocol}://${host}`;

    // Return HTML with OG Metadata and preview interface
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
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
      --bg-color: #020b14;
      --text-color: #ffffff;
      --accent-color: #ffde6a;
      --card-bg: rgba(7, 35, 54, 0.45);
      --border-color: rgba(147, 197, 253, 0.25);
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
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
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
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 24px;
    }
    .image-preview {
      width: 100%;
      aspect-ratio: 1/1;
      background-color: #072336;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color);
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
      color: #020b14;
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
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>HACKER HOUSE GOA 2026</h1>
    <p>Official Builder Profile Frame</p>
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
}
