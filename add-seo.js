import fs from 'fs';
import path from 'path';

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const ogTags = `
    <meta property="og:description" content="Founder, MBA candidate, and product builder.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://hanif.info/og-image.jpg">
    <meta name="twitter:card" content="summary_large_image">`;

const sitemapUrls = [];

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');

    // Extract title if needed
    let titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch && !content.includes('og:title')) {
        const title = titleMatch[1].trim();
        content = content.replace('</title>', `</title>\n    <meta property="og:title" content="${title}">`);
    }

    // Add og image tags if missing
    if (!content.includes('og:image')) {
        content = content.replace('</title>', '</title>' + ogTags);
        console.log('Updated open-graph SEO for', file);
    }

    // Determine Canonical URL
    const canonicalPath = file === 'index.html' ? '' : file;
    const canonicalURL = `https://hanif.info/${canonicalPath}`;

    // Add Canonical Tag if missing
    if (!content.includes('rel="canonical"')) {
        content = content.replace('</head>', `    <link rel="canonical" href="${canonicalURL}">\n</head>`);
        console.log('Added Canonical URL for', file);
    }

    // Add to sitemap list
    sitemapUrls.push(canonicalURL);

    // Save modifications
    fs.writeFileSync(path.join(dir, file), content);
});

// Generate sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === 'https://hanif.info/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapContent);
console.log('Successfully generated sitemap.xml');
