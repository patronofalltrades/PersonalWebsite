import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import fm from 'front-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '_posts');
const OUTPUT_DIR = path.join(__dirname, 'posts');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

fs.readdirSync(POSTS_DIR).forEach(file => {
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { attributes, body } = fm(content);
    const htmlContent = marked(body);

    const title = attributes.title || 'Draft Article';
    const date = attributes.date || '';
    const description = attributes.description || 'An essay by Hanif Ramadhan.';

    let finalHtml = template.replace(/\{\{title\}\}/g, title);
    finalHtml = finalHtml.replace(/\{\{date\}\}/g, date);
    finalHtml = finalHtml.replace(/\{\{description\}\}/g, description);
    finalHtml = finalHtml.replace(/\{\{content\}\}/g, htmlContent);

    const outputFilename = file.replace('.md', '.html');
    fs.writeFileSync(path.join(OUTPUT_DIR, outputFilename), finalHtml);
    console.log(`Generated: posts/${outputFilename}`);
});
