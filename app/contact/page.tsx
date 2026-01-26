import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Us | Puzzio.io',
  description:
    "Get in touch with the Puzzio.io team. We'd love to hear from you.",
};

export default function ContactPage() {
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Puzzio',
    description: 'Get in touch with the Puzzio team for support, business inquiries, or feedback.',
    url: 'https://puzzio.io/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'Puzzio',
      telephone: '+1-757-275-2390',
      email: 'contact@puzzio.io',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '242 Central Park Ave',
        addressLocality: 'Virginia Beach',
        addressRegion: 'VA',
        postalCode: '23462',
        addressCountry: 'US',
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://puzzio.io',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: 'https://puzzio.io/contact',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact', href: '/contact' },
          ]}
        />

        {/* Content */}
        <div className="mt-8">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg mb-12">
            Have a question or feedback? We&apos;d love to hear from you. Get in
            touch using the information below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    General Inquiries
                  </h3>
                  <p className="text-gray-400">
                    <a
                      href="mailto:hello@puzzio.io"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      hello@puzzio.io
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Business & Partnerships
                  </h3>
                  <p className="text-gray-400">
                    <a
                      href="mailto:business@puzzio.io"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      business@puzzio.io
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Support
                  </h3>
                  <p className="text-gray-400">
                    <a
                      href="mailto:support@puzzio.io"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      support@puzzio.io
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Privacy & Legal
                  </h3>
                  <p className="text-gray-400">
                    <a
                      href="mailto:legal@puzzio.io"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      legal@puzzio.io
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div className="bg-slate-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h2>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
