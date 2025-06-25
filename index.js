const express = require('express');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '5mb' }));

// Folder penyimpanan file JPG
const outputDir = path.join(__dirname, 'files');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Endpoint utama: menerima HTML JSON, menghasilkan JPG, dan respon URL
app.post('/generate', async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: 'Field "html" tidak ditemukan.' });

  const filename = `image-${uuidv4()}.jpg`;
  const outputPath = path.join(outputDir, filename);

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 800, height: 600 });
    await page.screenshot({ path: outputPath, type: 'jpeg', quality: 100, fullPage: true });
    await browser.close();

    const baseUrl = process.env.BASE_URL || req.protocol + '://' + req.get('host');
    const imageUrl = `${baseUrl}/files/${filename}`;
    res.json({ image_url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat gambar.' });
  }
});

// Serves static JPG files
app.use('/files', express.static(outputDir));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ HTML-to-JPG API jalan di port ${PORT}`));
