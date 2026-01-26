import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Service | Puzzio.io',
  description: 'Read the terms and conditions for using Puzzio.io.',
};

export default function TermsPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service',
    description: 'Read the terms and conditions for using Puzzio.io.',
    url: 'https://puzzio.io/terms',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Puzzio',
      url: 'https://puzzio.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puzzio',
      url: 'https://puzzio.io',
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
        name: 'Terms of Service',
        item: 'https://puzzio.io/terms',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
              { label: 'Terms of Service', href: '/terms' },
            ]}
          />

          {/* Content */}
          <article className="mt-8 prose prose-lg prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-400 mb-8">Last updated: November 6, 2025</p>

            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Agreement to Terms
                </h2>
                <p>
                  By accessing and using Puzzio.io (&quot;Website,&quot;
                  &quot;Service&quot;), you agree to be bound by these Terms of
                  Service (&quot;Terms&quot;). If you disagree with any part of
                  these terms, you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Use License
                </h2>
                <p>
                  Permission is granted to temporarily access the games and
                  materials on Puzzio.io for personal, non-commercial use only.
                  This is the grant of a license, not a transfer of title.
                </p>
                <p className="mt-4">Under this license, you may not:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for commercial purposes</li>
                  <li>
                    Attempt to decompile or reverse engineer any software on the
                    Website
                  </li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>
                    Transfer the materials to another person or
                    &quot;mirror&quot; the materials on any other server
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  User Accounts
                </h2>
                <p>
                  If you create an account on our Service, you are responsible
                  for:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Maintaining the security of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Immediately notifying us of any unauthorized use</li>
                </ul>
                <p className="mt-4">
                  We reserve the right to terminate accounts, remove or edit
                  content at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Intellectual Property
                </h2>
                <p>
                  The Service and its original content, features, and
                  functionality are and will remain the exclusive property of
                  Puzzio.io and its licensors. The Service is protected by
                  copyright, trademark, and other laws.
                </p>
                <p className="mt-4">
                  Our trademarks and trade dress may not be used without our
                  prior written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Third-Party Games and Content
                </h2>
                <p>
                  Some games on our platform may be provided by third-party
                  developers. We do not endorse, support, or guarantee the
                  quality, reliability, or legality of such third-party games.
                </p>
                <p className="mt-4">
                  Third-party games may have their own terms and conditions
                  which you must comply with.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Prohibited Uses
                </h2>
                <p>You agree not to use the Service:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    For any unlawful purpose or to solicit others to perform
                    unlawful acts
                  </li>
                  <li>
                    To violate any international, federal, provincial, or state
                    regulations, rules, laws, or local ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights
                    or the rights of others
                  </li>
                  <li>
                    To harass, abuse, insult, harm, defame, slander, disparage,
                    intimidate, or discriminate
                  </li>
                  <li>To submit false or misleading information</li>
                  <li>
                    To upload or transmit viruses or any other type of malicious
                    code
                  </li>
                  <li>
                    To spam, phish, farm, pretext, spider, crawl, or scrape
                  </li>
                  <li>For any obscene or immoral purpose</li>
                  <li>
                    To interfere with or circumvent the security features of the
                    Service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Disclaimer
                </h2>
                <p>
                  The materials on Puzzio.io are provided on an &apos;as
                  is&apos; basis. Puzzio.io makes no warranties, expressed or
                  implied, and hereby disclaims and negates all other warranties
                  including, without limitation, implied warranties or
                  conditions of merchantability, fitness for a particular
                  purpose, or non-infringement of intellectual property.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Limitations of Liability
                </h2>
                <p>
                  In no event shall Puzzio.io or its suppliers be liable for any
                  damages (including, without limitation, damages for loss of
                  data or profit, or due to business interruption) arising out
                  of the use or inability to use the materials on Puzzio.io.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Governing Law
                </h2>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws of the Commonwealth of Virginia,
                  United States, and you irrevocably submit to the exclusive
                  jurisdiction of the courts in Virginia Beach, VA.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Changes to Terms
                </h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. We will provide notice of any
                  significant changes by posting the new Terms on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Contact Information
                </h2>
                <p>
                  If you have any questions about these Terms, please contact
                  us:
                </p>
                <ul className="list-none space-y-2 my-4">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a
                      href="mailto:legal@puzzio.io"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      legal@puzzio.io
                    </a>
                  </li>
                  <li>
                    <strong>Contact Page:</strong>{' '}
                    <Link
                      href="/contact"
                      className="text-purple-500 hover:text-purple-600"
                    >
                      puzzio.io/contact
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
