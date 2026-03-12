import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '_posts');
const IMAGES_DIR = path.join(__dirname, 'images');

// ── Helpers ──────────────────────────────────────────────

function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getMonthYear() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function pandocAvailable() {
    try {
        execSync('pandoc --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// ── Mode A: Scaffold from scratch ────────────────────────

function scaffoldPost(title) {
    const slug = slugify(title);
    const filename = `${slug}.md`;
    const filepath = path.join(POSTS_DIR, filename);

    if (fs.existsSync(filepath)) {
        console.error(`\n  ✗ File already exists: _posts/${filename}\n`);
        process.exit(1);
    }

    const template = `---
title: "${title}"
date: "${getMonthYear()}"
description: "A short description for SEO and link previews."
---

Your opening paragraph goes here. Set the context and hook the reader.

### 1. First Section

Body text for the first section. Reference a source like this.<sup>[1](#fn-1)</sup>

![A descriptive alt text](../images/${slug}-image.jpg)
*Fig 1. — Caption describing the image.*

### 2. Second Section

More body text. Another citation here.<sup>[2](#fn-2)</sup>

---

<span id="fn-1">[1]</span> Author. *Title*. [https://example.com](https://example.com)

<span id="fn-2">[2]</span> Author. *Title*. [https://example.com](https://example.com)
`;

    ensureDir(POSTS_DIR);
    fs.writeFileSync(filepath, template);

    console.log(`\n  ✓ Created: _posts/${filename}`);
    console.log(`  ✓ Date set to: ${getMonthYear()}`);
    console.log(`\n  Next steps:`);
    console.log(`    1. Edit _posts/${filename} with your essay content`);
    console.log(`    2. Place images in images/ directory`);
    console.log(`    3. Run: node build.js`);
    console.log(`    4. Preview: open posts/${slug}.html`);
    console.log(`    5. Commit and push\n`);

    return filepath;
}

// ── Mode B: Import from .docx ────────────────────────────

function importDocx(docxPath) {
    // Resolve the path
    const resolvedPath = path.resolve(docxPath);

    if (!fs.existsSync(resolvedPath)) {
        console.error(`\n  ✗ File not found: ${docxPath}\n`);
        process.exit(1);
    }

    if (!resolvedPath.endsWith('.docx')) {
        console.error(`\n  ✗ Not a .docx file: ${docxPath}\n`);
        process.exit(1);
    }

    if (!pandocAvailable()) {
        console.error(`\n  ✗ Pandoc is not installed.`);
        console.error(`    Install it with: brew install pandoc`);
        console.error(`    Or visit: https://pandoc.org/installing.html\n`);
        process.exit(1);
    }

    // Derive slug from filename
    const baseName = path.basename(resolvedPath, '.docx');
    const slug = slugify(baseName);
    const filename = `${slug}.md`;
    const filepath = path.join(POSTS_DIR, filename);

    if (fs.existsSync(filepath)) {
        console.error(`\n  ✗ File already exists: _posts/${filename}`);
        console.error(`    Delete it first or choose a different name.\n`);
        process.exit(1);
    }

    // Create a temp directory for image extraction
    const mediaDir = path.join(__dirname, `_temp_media_${slug}`);
    ensureDir(POSTS_DIR);
    ensureDir(IMAGES_DIR);

    try {
        // Convert with Pandoc, extracting media
        const pandocCmd = `pandoc "${resolvedPath}" -t markdown --wrap=none --extract-media="${mediaDir}"`;
        const markdown = execSync(pandocCmd, { encoding: 'utf-8' });

        // Move extracted images to images/ and fix paths
        let processedMarkdown = markdown;
        if (fs.existsSync(mediaDir)) {
            const walkFiles = (dir) => {
                let files = [];
                for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                    const full = path.join(dir, entry.name);
                    if (entry.isDirectory()) files = files.concat(walkFiles(full));
                    else files.push(full);
                }
                return files;
            };

            const mediaFiles = walkFiles(mediaDir);
            let imgIndex = 1;

            for (const mediaFile of mediaFiles) {
                const ext = path.extname(mediaFile);
                const newName = `${slug}-${imgIndex}${ext}`;
                const dest = path.join(IMAGES_DIR, newName);
                fs.copyFileSync(mediaFile, dest);

                // Replace the temp media path with the correct relative path
                const relativeTempPath = path.relative(__dirname, mediaFile);
                processedMarkdown = processedMarkdown.replaceAll(relativeTempPath, `../images/${newName}`);

                console.log(`  ✓ Extracted image: images/${newName}`);
                imgIndex++;
            }

            // Clean up temp media directory
            fs.rmSync(mediaDir, { recursive: true, force: true });
        }

        // Try to extract a title from the first heading
        const titleMatch = processedMarkdown.match(/^#\s+(.+)$/m);
        let title = titleMatch ? titleMatch[1].trim() : baseName.replace(/-/g, ' ');

        // Remove the first heading from body (it'll be in frontmatter)
        if (titleMatch) {
            processedMarkdown = processedMarkdown.replace(/^#\s+.+\n*/m, '');
        }

        // Build final file with frontmatter
        const finalContent = `---
title: "${title}"
date: "${getMonthYear()}"
description: "A short description for SEO and link previews."
---

${processedMarkdown.trim()}
`;

        fs.writeFileSync(filepath, finalContent);

        console.log(`\n  ✓ Converted: ${path.basename(resolvedPath)} → _posts/${filename}`);
        console.log(`  ✓ Title detected: "${title}"`);
        console.log(`  ✓ Date set to: ${getMonthYear()}`);
        console.log(`\n  Next steps:`);
        console.log(`    1. Review _posts/${filename} — tweak title/description in frontmatter`);
        console.log(`    2. Run: node build.js`);
        console.log(`    3. Preview: open posts/${slug}.html`);
        console.log(`    4. Commit and push\n`);

    } catch (err) {
        // Clean up on error
        if (fs.existsSync(mediaDir)) {
            fs.rmSync(mediaDir, { recursive: true, force: true });
        }
        console.error(`\n  ✗ Conversion failed: ${err.message}\n`);
        process.exit(1);
    }

    return filepath;
}

// ── CLI ──────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
  Usage:
    node new-post.js "My Essay Title"       Create a new post from scratch
    node new-post.js --from essay.docx      Import from a Word document
`);
    process.exit(0);
}

if (args[0] === '--from') {
    if (!args[1]) {
        console.error('\n  ✗ Please provide a .docx file path.\n');
        process.exit(1);
    }
    importDocx(args[1]);
} else {
    const title = args.join(' ');
    scaffoldPost(title);
}

// Run build
console.log('  Building site...\n');
try {
    execSync('node build.js', { cwd: __dirname, stdio: 'inherit' });
} catch {
    console.error('\n  ⚠ Build failed. Run "node build.js" manually to debug.\n');
}
