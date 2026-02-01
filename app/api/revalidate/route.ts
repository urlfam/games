import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    const secretEnv = process.env.REVALIDATE_SECRET || 'puzzio-revalidate-secret-2024';

    if (secret !== secretEnv) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const path = request.nextUrl.searchParams.get('path');
    const tag = request.nextUrl.searchParams.get('tag');

    if (path) {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
      return NextResponse.json({ revalidated: true, type: 'path', path, now: Date.now() });
    }

    if (tag) {
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
      return NextResponse.json({ revalidated: true, type: 'tag', tag, now: Date.now() });
    }

    // Default: revalidate homepage and standard routes
    revalidatePath('/');
    
    return NextResponse.json({ revalidated: true, type: 'default', path: '/', now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Only POST method is allowed for revalidation' }, { status: 405 });
}
