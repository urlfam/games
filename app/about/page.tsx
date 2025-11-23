import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us | Puzzio.io',
  description:
    'Learn about Puzzio.io - your destination for browser-based gaming and gaming news.',
};

export default function AboutPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Puzzio.io?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Puzzio.io is a free online platform for instant browser-based gaming and the latest gaming news. Our mission is to make high-quality games accessible to everyone, anywhere, without downloads or installations.',
        },
      },
      {
        '@type': 'Question',
        name: 'What kind of games do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer hundreds of free-to-play browser games across multiple genres, including Puzzle, Action, Strategy, and Arcade. All games are available for instant play.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Puzzio.io free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our games and news content are completely free. We believe everyone deserves access to quality gaming entertainment without any cost.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold text-slate-900">
                  Puzzio<span className="text-purple-500">.io</span>
                </Link>
                <div className="hidden md:flex gap-6">
                  <Link
                    href="/play"
                    className="text-gray-600 font-medium hover:text-slate-900"
                  >
                    PLAY
                  </Link>
                  <Link
                    href="/news"
                    className="text-gray-600 font-medium hover:text-slate-900"
                  >
                    NEWS
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
            ]}
          />

          {/* Content */}
          <article className="mt-8 prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              About Puzzio.io
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Your destination for instant browser-based gaming and the latest
              gaming news.
            </p>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Our Mission
                </h2>
                <p>
                  At Puzzio.io, we believe gaming should be accessible to
                  everyone, anywhere, anytime. Our mission is to bring
                  high-quality browser-based games directly to your screen
                  without the hassle of downloads, installations, or expensive
                  hardware requirements.
                </p>
                <p className="mt-4">
                  We're passionate about democratizing gaming and making it
                  possible for anyone with an internet connection to enjoy
                  immersive gaming experiences instantly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  What We Offer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Instant Play Games
                    </h3>
                    <p className="text-gray-600">
                      Browse and play hundreds of browser-based games across
                      multiple genres. No downloads required - just click and
                      play.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Gaming News
                    </h3>
                    <p className="text-gray-600">
                      Stay up-to-date with the latest gaming news, reviews, and
                      industry analysis from our expert team of gaming
                      journalists.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Community
                    </h3>
                    <p className="text-gray-600">
                      Join a vibrant community of gamers who share your passion
                      for browser gaming and casual play experiences.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Free Access
                    </h3>
                    <p className="text-gray-600">
                      All our games and content are available completely free.
                      We believe everyone deserves access to quality gaming
                      entertainment.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Our Story
                </h2>
                <p>
                  Puzzio.io was founded in 2025 by a team of gaming enthusiasts
                  who saw the potential of browser-based gaming to revolutionize
                  how people access and enjoy games. We started with a simple
                  vision: make gaming accessible to everyone, regardless of
                  their device or technical capabilities.
                </p>
                <p className="mt-4">
                  Today, we serve millions of players worldwide, offering a
                  curated collection of the best browser games alongside
                  comprehensive gaming news coverage. Our platform continues to
                  grow, driven by our commitment to quality, accessibility, and
                  community.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Our Values
                </h2>
                <ul className="space-y-4 my-6">
                  <li className="flex gap-3">
                    <span className="text-purple-500 font-bold text-xl">✓</span>
                    <div>
                      <strong className="text-slate-900">Accessibility:</strong>{' '}
                      Gaming should be available to everyone, regardless of
                      device or location.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-500 font-bold text-xl">✓</span>
                    <div>
                      <strong className="text-slate-900">Quality:</strong> We
                      curate only the best games and provide insightful,
                      accurate gaming news.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-500 font-bold text-xl">✓</span>
                    <div>
                      <strong className="text-slate-900">Community:</strong> We
                      foster a welcoming, inclusive environment for all gamers.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-500 font-bold text-xl">✓</span>
                    <div>
                      <strong className="text-slate-900">Innovation:</strong> We
                      embrace new technologies to enhance the browser gaming
                      experience.
                    </div>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Join Us
                </h2>
                <p>
                  Whether you're a casual player looking for a quick gaming fix
                  or a hardcore gamer seeking your next challenge, Puzzio.io has
                  something for you. Browse our game collection, read our latest
                  news, and become part of our growing community.
                </p>
                <div className="flex gap-4 mt-6">
                  <Link
                    href="/play"
                    className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Browse Games
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-block px-6 py-3 border-2 border-purple-500 text-purple-500 hover:bg-purple-50 font-medium rounded-lg transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
