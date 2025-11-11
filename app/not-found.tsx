import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          Sorry, we could not find the page you are looking for.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/play"
            className="px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
          >
            Browse Games
          </Link>
          <Link
            href="/news"
            className="px-6 py-3 bg-white text-slate-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Read News
          </Link>
        </div>
      </div>
    </div>
  );
}
