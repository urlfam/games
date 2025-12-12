import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Puzzio.io',
  description:
    'Learn more about Puzzio.io, your premier destination for free online games. Discover our mission, vision, and commitment to providing the best gaming experience.',
  alternates: {
    canonical: '/about-us',
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            About Puzzio.io
          </h1>
          <p className="text-xl text-gray-400">
            Your Ultimate Free Online Gaming Destination
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Our Mission */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              At Puzzio.io, we believe that everyone deserves access to
              high-quality entertainment. Our mission is to provide a vast
              collection of free online games that can be enjoyed instantly,
              without downloads, installations, or barriers. We&apos;re
              committed to delivering fun, engaging, and accessible gaming
              experiences to players worldwide.
            </p>
          </section>

          {/* What We Offer */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  🎮 Diverse Game Library
                </h3>
                <p>
                  Thousands of games across multiple genres including action,
                  puzzle, sports, strategy, and more.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  🚀 Instant Play
                </h3>
                <p>
                  No downloads required. Click and play instantly from any
                  device with a web browser.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  🆓 100% Free
                </h3>
                <p>
                  All our games are completely free to play with no hidden fees
                  or subscriptions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  📱 Cross-Platform
                </h3>
                <p>
                  Play on desktop, tablet, or mobile. Our games work seamlessly
                  across all devices.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  ⚡ Regular Updates
                </h3>
                <p>
                  New games added regularly to keep your gaming experience fresh
                  and exciting.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  👥 Community Driven
                </h3>
                <p>
                  We listen to our players and continuously improve based on
                  your feedback.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Our Story
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Puzzio.io was born from a simple idea: gaming should be accessible
              to everyone, everywhere. We noticed that many gaming platforms
              required complex installations, expensive hardware, or paid
              subscriptions that created barriers for many players.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We set out to change that by creating a platform where anyone with
              an internet connection could enjoy quality games instantly. Today,
              we&apos;re proud to serve millions of players worldwide, offering
              a constantly growing library of games that cater to all tastes and
              skill levels.
            </p>
          </section>

          {/* Our Values */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Our Values
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Accessibility:</strong> Gaming
                  should be available to everyone, regardless of device or
                  budget.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Quality:</strong> We carefully
                  curate our game collection to ensure every game meets our
                  standards.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Innovation:</strong> We
                  continuously explore new technologies to enhance your gaming
                  experience.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Community:</strong> Our players
                  are at the heart of everything we do.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Safety:</strong> We prioritize
                  a safe, family-friendly environment for all ages.
                </div>
              </li>
            </ul>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6">
              Ready to start playing? Explore thousands of free games now!
            </p>
            <Link
              href="/play"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Start Playing Now
            </Link>
          </section>

          {/* Contact Section */}
          <section className="bg-slate-800 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Get in Touch
            </h2>
            <p className="text-gray-300 mb-6">
              Have questions, feedback, or suggestions? We&apos;d love to hear
              from you!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
