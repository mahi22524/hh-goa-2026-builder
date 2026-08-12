import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!image.startsWith('data:image/png;base64,')) {
      return res.status(400).json({ error: 'Invalid file format. Only PNG images are accepted.' });
    }

    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image exceeds the size limit of 10MB.' });
    }

    const filename = `hh-goa-frame-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;

    const project = process.env.SUPABASE_PROJECT_ID;
    const bucket = process.env.SUPABASE_BUCKET;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!project || !bucket || !key) {
      console.error('Missing Supabase configurations in production Vercel Serverless Function.');
      return res.status(500).json({ error: 'Storage provider is not configured on the server. Please check environment variables.' });
    }

    // Upload to Supabase Storage using standard REST API
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

  } catch (error: any) {
    console.error('Upload handler crashed:', error);
    return res.status(500).json({ error: 'Internal server error while processing upload.' });
  }
}
