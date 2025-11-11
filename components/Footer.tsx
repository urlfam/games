import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 border-t border-purple-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-white inline-block mb-4"
            >
              Puzzio<span className="text-purple-500">.io</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your destination for browser games and gaming news. Play
              instantly, no downloads required.
            </p>
          </div>

          {/* Games */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Games
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/play"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  All Games
                </Link>
              </li>
              <li>
                <Link
                  href="/play?category=puzzle"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Puzzle Games
                </Link>
              </li>
              <li>
                <Link
                  href="/play?category=action"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Action Games
                </Link>
              </li>
              <li>
                <Link
                  href="/play?category=strategy"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Strategy Games
                </Link>
              </li>
              <li>
                <Link
                  href="/play?category=arcade"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Arcade Games
                </Link>
              </li>
              <li>
                <Link
                  href="/play?category=adventure"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Adventure Games
                </Link>
              </li>
            </ul>
          </div>

          {/* News */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              News
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/news"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/news/category/latest-news"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Latest News
                </Link>
              </li>
              <li>
                <Link
                  href="/news/category/reviews"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/news/category/industry-analysis"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Industry Analysis
                </Link>
              </li>
              <li>
                <Link
                  href="/news/category/interviews"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Interviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Puzzio.io. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
