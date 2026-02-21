import fs from 'fs';
import path from 'path';

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const ogTags = `
    <meta property="og:description" content="Founder, MBA candidate, and product builder.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://hanif.info/og-image.jpg">
    <meta name="twitter:card" content="summary_large_image">`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');

    // Add title if it doesn't have an og:title yet
    let titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch && !content.includes('og:title')) {
        const title = titleMatch[1].trim();
        content = content.replace('</title>', `</title>\n    <meta property="og:title" content="${title}">`);
    }

    if (!content.includes('og:image')) {
        content = content.replace('</title>', '</title>' + ogTags);
        fs.writeFileSync(path.join(dir, file), content);
        console.log('Updated SEO for', file);
    }
});
