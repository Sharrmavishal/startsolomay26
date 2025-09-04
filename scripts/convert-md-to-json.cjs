// scripts/convert-md-to-json.cjs
// Script to convert all markdown files in content/homepage to JSON in content/sections
// Uses gray-matter for frontmatter parsing

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SRC_DIR = path.join(__dirname, '../content/homepage');
const DEST_DIR = path.join(__dirname, '../content/sections');

function mdToJson() {
  if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    const filePath = path.join(SRC_DIR, file);
    const md = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(md);
    const json = { ...data, body: content.trim() };
    const jsonFile = file.replace(/\.md$/, '.json');
    fs.writeFileSync(path.join(DEST_DIR, jsonFile), JSON.stringify(json, null, 2), 'utf8');
    console.log(`Converted ${file} -> ${jsonFile}`);
  });
}

mdToJson();
