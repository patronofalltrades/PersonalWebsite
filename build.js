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
        const outputFilename = file.replace('.md', '.html');
        finalHtml = finalHtml.replace(/\{\{url_path\}\}/g, `posts/${outputFilename}`);
        finalHtml = finalHtml.replace(/\{\{content\}\}/g, htmlContent);

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
        finalHtml = finalHtml.replace(/\{\{url_path\}\}/g, outputFilename);
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

// Build the Writing section in index.html from _posts/ frontmatter
function buildWritingSection() {
    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log('Skipping writing section: index.html not found');
        return;
    }

    let indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // Collect all posts
    const posts = [];
    if (fs.existsSync(POSTS_DIR)) {
        fs.readdirSync(POSTS_DIR).forEach(file => {
            if (!file.endsWith('.md')) return;
            const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
            const { attributes } = fm(content);
            posts.push({
                title: attributes.title || file.replace('.md', ''),
                date: attributes.date || '',
                slug: file.replace('.md', ''),
            });
        });
    }

    // Sort by date (newest first) — parse "Mon YYYY" format
    const monthOrder = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    posts.sort((a, b) => {
        const [aMonth, aYear] = a.date.split(' ');
        const [bMonth, bYear] = b.date.split(' ');
        const aVal = (parseInt(aYear) || 0) * 12 + (monthOrder[aMonth] || 0);
        const bVal = (parseInt(bYear) || 0) * 12 + (monthOrder[bMonth] || 0);
        return bVal - aVal;
    });

    // Generate HTML
    let writingHtml;
    if (posts.length === 0) {
        writingHtml = `
                    <p class="reveal-child"
                        style="color: var(--text-faint); font-style: italic; padding-top: 12px; font-size: 0.95rem;">
                        Currently cooking some things up... Check back later.
                    </p>`;
    } else {
        writingHtml = posts.map(post => `
                    <a href="posts/${post.slug}.html" class="project-row reveal-child">
                        <span class="project-type">${post.date}</span>
                        <h3 class="project-name">${post.title}</h3>
                        <span class="project-arrow"><svg class="project-arrow-svg" width="14" height="14"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg></span>
                    </a>`).join('\n');
    }

    // Replace the writing-list div contents
    const writingListRegex = /(<div class="writing-list"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>\s*<!-- 6\. Projects -->)/;
    const match = indexHtml.match(writingListRegex);

    if (match) {
        indexHtml = indexHtml.replace(writingListRegex, `$1\n${writingHtml}\n                $3`);
        fs.writeFileSync(indexPath, indexHtml);
        console.log(`Updated writing section with ${posts.length} post(s)`);
    } else {
        console.log('Warning: Could not find writing-list div in index.html');
    }
}

// Run all builders
console.log('Building blog posts...');
buildPosts();
console.log('\nBuilding project pages...');
buildProjects();
console.log('\nUpdating writing section...');
buildWritingSection();
console.log('\nBuild complete!');
