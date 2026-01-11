import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SEO_DB_PATH = path.join(DATA_DIR, 'seo.json');

export interface SeoData {
  slug: string;
  type: 'Category' | 'Tag';
  header_desc?: string;
  main_content?: string;
}

interface SeoStore {
  Category: Record<string, SeoData>;
  Tag: Record<string, SeoData>;
}

async function ensureSeoFile() {
  try {
    await fs.access(SEO_DB_PATH);
  } catch {
    const initialData: SeoStore = { Category: {}, Tag: {} };
    await fs.writeFile(SEO_DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

export async function getSeoData(slug: string, type: 'Category' | 'Tag'): Promise<SeoData | null> {
  await ensureSeoFile();
  try {
    const data = await fs.readFile(SEO_DB_PATH, 'utf-8');
    const store: SeoStore = JSON.parse(data);
    return store[type]?.[slug] || null;
  } catch (error) {
    console.error('Error reading SEO data:', error);
    return null;
  }
}

export async function updateSeoData(newContent: SeoData): Promise<void> {
  await ensureSeoFile();
  try {
    const data = await fs.readFile(SEO_DB_PATH, 'utf-8');
    const store: SeoStore = JSON.parse(data);

    if (!store[newContent.type]) {
      store[newContent.type] = {};
    }

    store[newContent.type][newContent.slug] = {
      ...store[newContent.type][newContent.slug],
      ...newContent,
    };

    await fs.writeFile(SEO_DB_PATH, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error('Error updating SEO data:', error);
    throw error;
  }
}
