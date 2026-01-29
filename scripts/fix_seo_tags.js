const fs = require('fs');
const path = require('path');

const SEO_PATH = path.join(__dirname, '../data/seo.json');

console.log('Checking SEO file at:', SEO_PATH);

if (!fs.existsSync(SEO_PATH)) {
  console.error('File seo.json not found!');
  process.exit(1);
}

const raw = fs.readFileSync(SEO_PATH, 'utf-8');
const data = JSON.parse(raw);

let modified = false;

function processContent(str) {
  if (!str) return str;
  let newStr = str;
  
  // Replace relative HREF
  if (newStr.includes('href="/tag/')) {
    newStr = newStr.replace(/href="\/tag\//g, 'href="/t/');
    modified = true;
  }
  
  // Replace Absolute URL
  if (newStr.includes('https://puzzio.io/tag/')) {
    newStr = newStr.replace(/https:\/\/puzzio.io\/tag\//g, 'https://puzzio.io/t/');
    modified = true;
  }

  return newStr;
}

// Iterate Categories
if (data.Category) {
  for (const key in data.Category) {
    if (data.Category[key].main_content) {
      const oldC = data.Category[key].main_content;
      const newC = processContent(oldC);
      if (oldC !== newC) {
        console.log(`Updated content for Category: ${key}`);
        data.Category[key].main_content = newC;
      }
    }
  }
}

// Iterate Tags
if (data.Tag) {
  for (const key in data.Tag) {
    if (data.Tag[key].main_content) {
        const oldC = data.Tag[key].main_content;
        const newC = processContent(oldC);
        if (oldC !== newC) {
          console.log(`Updated content for Tag: ${key}`);
          data.Tag[key].main_content = newC;
        }
    }
  }
}

if (modified) {
  fs.writeFileSync(SEO_PATH, JSON.stringify(data, null, 2));
  console.log('Successfully updated seo.json');
} else {
  console.log('No changes needed.');
}
