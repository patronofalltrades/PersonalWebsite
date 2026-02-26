import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import fm from 'front-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const POSTS_DIR = path.join(__dirname, '_posts');
const PROJECTS_DIR = path.join(__dirname, '_projects');
const POSTS_OUTPUT_DIR = path.join(__dirname, 'posts');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Ensure output directories exist
if (!fs.existsSync(POSTS_OUTPUT_DIR)) {
    fs.mkdirSync(POSTS_OUTPUT_DIR);
}

// Build blog posts
function buildPosts() {
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'blog-post.html'), 'utf-8');

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
        fs.writeFileSync(path.join(POSTS_OUTPUT_DIR, outputFilename), finalHtml);
        console.log(`Generated: posts/${outputFilename}`);
    });
}

// Build project pages
function buildProjects() {
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'project.html'), 'utf-8');

    fs.readdirSync(PROJECTS_DIR).forEach(file => {
        if (!file.endsWith('.md')) return;

        const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
        const { attributes, body } = fm(content);
        const htmlContent = marked(body);

        // Build metrics HTML if provided
        let metricsHtml = '';
        if (attributes.metrics && attributes.metrics.length > 0) {
            metricsHtml = `
            <div class="detail-impact">
                <p class="detail-impact-label">Key figures</p>
                <div class="detail-metrics">
                    ${attributes.metrics.map(m => `
                    <div class="detail-metric">
                        <span class="detail-metric-val">${m.value}</span>
                        <span class="detail-metric-label">${m.label}</span>
                    </div>
                    `).join('')}
                </div>
            </div>
            `;
        }

        // Build tags HTML if provided
        let tagsHtml = '';
        if (attributes.tags && attributes.tags.length > 0) {
            tagsHtml = `
            <div class="detail-tags">
                ${attributes.tags.map(tag => `<span class="detail-tag">${tag}</span>`).join('')}
            </div>
            `;
        }

        // Build citation HTML if provided
        let citationHtml = '';
        if (attributes.citation) {
            citationHtml = `
            <div class="case-section" style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border);">
                <p style="font-size: 0.8rem; color: var(--text-faint); line-height: 1.6;">
                    ${attributes.citation}
                </p>
            </div>
            `;
        }

        // Replace placeholders
        const outputFilename = file.replace('.md', '.html');
        let finalHtml = template.replace(/\{\{title\}\}/g, attributes.title || 'Untitled Project');
        finalHtml = finalHtml.replace(/\{\{caseTitle\}\}/g, attributes.caseTitle || attributes.title || 'Untitled Project');
        finalHtml = finalHtml.replace(/\{\{subtitle\}\}/g, attributes.subtitle || '');
        finalHtml = finalHtml.replace(/\{\{description\}\}/g, attributes.description || '');
        finalHtml = finalHtml.replace(/\{\{caseMeta\}\}/g, attributes.caseMeta || '');
        finalHtml = finalHtml.replace(/\{\{backLink\}\}/g, attributes.backLink || 'index.html');
        finalHtml = finalHtml.replace(/\{\{filename\}\}/g, outputFilename);
        finalHtml = finalHtml.replace(/\{\{metrics\}\}/g, metricsHtml);
        finalHtml = finalHtml.replace(/\{\{tags\}\}/g, tagsHtml);
        finalHtml = finalHtml.replace(/\{\{citation\}\}/g, citationHtml);
        finalHtml = finalHtml.replace(/\{\{content\}\}/g, htmlContent);

        fs.writeFileSync(path.join(__dirname, outputFilename), finalHtml);
        console.log(`Generated: ${outputFilename}`);
    });
}

// Run both builders
console.log('Building blog posts...');
buildPosts();
console.log('\nBuilding project pages...');
buildProjects();
console.log('\nBuild complete!');
