import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SEO_DB_PATH = path.join(DATA_DIR, 'seo.json');

export interface SeoData {
  slug: string;
  type: 'Category' | 'Tag';
  header_desc?: string;
  main_content?: string;
  faq_schema?: Array<{ question: string; answer: string }>;
}

interface SeoStore {
  Category: Record<string, SeoData>;
  Tag: Record<string, SeoData>;
}

async function ensureSeoFile() {
  try {
    await fs.access(SEO_DB_PATH);
  } catch {
    try {
      const initialData: SeoStore = { Category: {}, Tag: {} };
      await fs.writeFile(SEO_DB_PATH, JSON.stringify(initialData, null, 2));
    } catch (ioError) {
      console.warn('Could not create SEO file (this is expected in read-only environments):', ioError);
    }
  }
}

export async function getSeoData(
  slug: string,
  type: 'Category' | 'Tag',
): Promise<SeoData | null> {
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

export async function getAllSeoData(): Promise<
  {
    slug: string;
    type: 'Category' | 'Tag';
    hasHeader: boolean;
    hasContent: boolean;
  }[]
> {
  await ensureSeoFile();
  try {
    const data = await fs.readFile(SEO_DB_PATH, 'utf-8');
    const store: SeoStore = JSON.parse(data);

    const results: any[] = [];

    // Process Categories
    Object.entries(store.Category || {}).forEach(([slug, data]) => {
      results.push({
        slug,
        type: 'Category',
        hasHeader: !!data.header_desc,
        hasContent: !!data.main_content,
      });
    });

    // Process Tags
    Object.entries(store.Tag || {}).forEach(([slug, data]) => {
      results.push({
        slug,
        type: 'Tag',
        hasHeader: !!data.header_desc,
        hasContent: !!data.main_content,
      });
    });

    return results;
  } catch (error) {
    console.error('Error reading all SEO data:', error);
    return [];
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
