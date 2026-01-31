import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | Puzzio.io',
  description:
    'Learn how Puzzio.io collects, uses, and protects your personal information. COPPA compliant.',
  alternates: {
    canonical: 'https://puzzio.io/privacy',
  },
};

export default function PrivacyPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    description:
      'Learn how Puzzio.io collects, uses, and protects your personal information.',
    url: 'https://puzzio.io/privacy',
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
        name: 'Privacy Policy',
        item: 'https://puzzio.io/privacy',
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
              { label: 'Privacy Policy', href: '/privacy' },
            ]}
          />

          {/* Content */}
          <article className="mt-8 prose prose-lg prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400 mb-8">
              <strong>Last updated: January 31, 2025</strong>
            </p>

            <div className="space-y-10 text-gray-300">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Introduction
                </h2>
                <p>
                  Welcome to Puzzio.io. We&apos;re committed to protecting your
                  privacy while you play games on our site. This Privacy Policy
                  explains what information we collect, how we use it, and what
                  rights you have.
                </p>
                <p className="mt-4">
                  The Puzzio.io website (&quot;Puzzio Site&quot; or
                  &quot;Site&quot;) is owned and operated by Puzzio, located at
                  242 Central Park Ave, Virginia Beach, VA 23462, United States.
                </p>
                <p className="mt-4">
                  By using Puzzio.io, you agree to this Privacy Policy. If you
                  don&apos;t agree, please don&apos;t use the Site. If
                  you&apos;re a parent or legal guardian allowing your child to
                  use Puzzio.io, you&apos;re agreeing to this policy on their
                  behalf.
                </p>
                <p className="mt-4">
                  <strong>Questions?</strong> Contact us at{' '}
                  <a
                    href="mailto:privacy@puzzio.io"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    privacy@puzzio.io
                  </a>{' '}
                  or through our{' '}
                  <Link
                    href="/contact"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    contact page
                  </Link>
                  .
                </p>
              </section>

              {/* 1. What Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. What Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Information You Don&apos;t Need to Give Us
                </h3>
                <p>
                  <strong>Good news:</strong> You can play games on Puzzio.io
                  without creating an account or giving us personal information
                  like your name, email, or phone number. Most features work
                  immediately without registration.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Information We Collect Automatically
                </h3>
                <p>
                  When you visit Puzzio.io, we automatically collect certain
                  technical information:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Device &amp; Browser Info:</strong> Browser type and
                    version, operating system, screen resolution
                  </li>
                  <li>
                    <strong>Network Data:</strong> IP address, general location
                    (country/city level, not your exact address)
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Pages visited, games played,
                    time spent, how you navigate the site
                  </li>
                  <li>
                    <strong>Referral Data:</strong> What website you came from
                    before visiting us
                  </li>
                </ul>
                <p>
                  This helps us understand how people use the site and improve
                  it.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Optional Information (If You Choose to Provide It)
                </h3>
                <p>
                  If you create an account to save your game progress, favorite
                  games, or use other features, we may collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Username</li>
                  <li>
                    Email address (if you want to save your account or reset
                    your password)
                  </li>
                  <li>Game scores, favorites, and preferences</li>
                  <li>Comments or ratings you post on games</li>
                </ul>
                <p>
                  If you contact us through our support form, we collect
                  whatever information you choose to share (name, email, your
                  question/issue).
                </p>
              </section>

              {/* 2. How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Run the site:</strong> Keep games loading, track
                    what&apos;s popular, fix bugs
                  </li>
                  <li>
                    <strong>Improve the experience:</strong> Figure out which
                    games people like, add features people want
                  </li>
                  <li>
                    <strong>Personalize (if you have an account):</strong> Save
                    your favorites, remember your preferences, show your scores
                  </li>
                  <li>
                    <strong>Communicate:</strong> Respond to support requests,
                    send important updates about the site
                  </li>
                  <li>
                    <strong>Stay safe:</strong> Detect and prevent fraud, abuse,
                    spam, and security issues
                  </li>
                  <li>
                    <strong>Legal compliance:</strong> Follow laws like COPPA
                    and GDPR
                  </li>
                </ul>
                <p className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <strong>We do NOT sell your personal information to third parties.</strong>
                </p>
              </section>

              {/* 3. Cookies and Tracking */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Cookies and Tracking
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  What Are Cookies?
                </h3>
                <p>
                  Cookies are small text files stored on your device when you
                  visit websites. They help websites remember you and work
                  properly.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  How We Use Cookies
                </h3>
                <p>Puzzio.io and our partners use cookies for:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Essential functions:</strong> Making the site work
                    (e.g., remembering if you&apos;re logged in)
                  </li>
                  <li>
                    <strong>Preferences:</strong> Remembering your settings and
                    favorites
                  </li>
                  <li>
                    <strong>Analytics:</strong> Understanding how people use the
                    site (via Google Analytics)
                  </li>
                  <li>
                    <strong>Advertising:</strong> Showing relevant ads and
                    limiting how often you see the same ad
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Types of Cookies
                </h3>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Session cookies:</strong> Deleted when you close
                    your browser
                  </li>
                  <li>
                    <strong>Persistent cookies:</strong> Stay on your device
                    until they expire or you delete them
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Managing Cookies
                </h3>
                <p>You can control cookies through your browser settings:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and Security →
                    Cookies
                  </li>
                  <li>
                    <strong>Firefox:</strong> Settings → Privacy &amp; Security
                    → Cookies
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Cookies
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Privacy → Cookies
                  </li>
                </ul>
                <p className="text-yellow-400">
                  <em>
                    Note: Blocking all cookies might break some features of the
                    site.
                  </em>
                </p>
              </section>

              {/* 4. Third-Party Services */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Third-Party Services
                </h2>
                <p>We work with third parties to run the site:</p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Analytics
                </h3>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Google Analytics:</strong> Helps us understand site
                    traffic and user behavior
                  </li>
                  <li>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Google&apos;s Privacy Policy
                    </a>
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Advertising Partners
                </h3>
                <p>
                  We use advertising networks to show ads on the site. These
                  partners may use cookies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    Show relevant ads based on your browsing (not on sites for
                    children under 13)
                  </li>
                  <li>Limit how many times you see the same ad</li>
                  <li>Measure ad performance</li>
                </ul>
                <p>
                  Advertising partners have their own privacy policies governing
                  how they use data.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Game Developers
                </h3>
                <p>
                  Most games on Puzzio.io are made by third-party developers.
                  When you play their games:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    The game may collect technical data (like device type) to
                    function properly
                  </li>
                  <li>Each developer has their own privacy practices</li>
                  <li>
                    We contractually require developers not to collect personal
                    information from users under 13
                  </li>
                  <li>
                    We monitor games for inappropriate content, but we don&apos;t
                    have complete control over third-party code
                  </li>
                </ul>
                <p className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                  <strong>Important:</strong> If a third-party game collects
                  personal data, that game&apos;s privacy policy applies, not
                  ours. We&apos;re not responsible for third-party data
                  collection.
                </p>
              </section>

              {/* 5. Children's Privacy (COPPA Compliance) */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Children&apos;s Privacy (COPPA Compliance)
                </h2>
                <p>
                  We take children&apos;s privacy seriously and comply with the
                  Children&apos;s Online Privacy Protection Act (COPPA).
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Age Gates
                </h3>
                <p>
                  Some games include age gates. If you&apos;re asked your age,
                  please provide it accurately. Based on this information, we
                  adjust what data is collected and how ads are shown.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  For Users Under 13
                </h3>
                <p>If you&apos;re under 13:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    You should only use Puzzio.io with permission from a parent
                    or guardian
                  </li>
                  <li>
                    We don&apos;t knowingly collect personal information from
                    you (name, email, phone, etc.)
                  </li>
                  <li>You don&apos;t need to register or create an account</li>
                  <li>
                    We only show contextual ads (based on the game content), NOT
                    behavioral ads based on tracking
                  </li>
                  <li>
                    Third parties cannot track you for behavioral advertising
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  What We DO Collect from Children (For Site Operation Only)
                </h3>
                <p>
                  We may collect certain technical data from children under 13,
                  but ONLY for internal operations:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    IP address and device ID (to identify age, prevent fraud,
                    maintain security)
                  </li>
                  <li>
                    Cookies (for site functionality, not behavioral advertising)
                  </li>
                  <li>
                    Usage data (which games were played, for analytics and
                    improvement)
                  </li>
                </ul>
                <p>
                  This is permitted under COPPA for &quot;internal
                  operations&quot; purposes.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Parental Rights
                </h3>
                <p>
                  If you&apos;re a parent and believe your child under 13 has
                  provided personal information to us, contact us at{' '}
                  <a
                    href="mailto:privacy@puzzio.io"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    privacy@puzzio.io
                  </a>
                  . You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Review information collected from your child</li>
                  <li>Request deletion of that information</li>
                  <li>Refuse further collection or use</li>
                </ul>
                <p>
                  Learn more about COPPA:{' '}
                  <a
                    href="https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    FTC&apos;s COPPA Guide
                  </a>
                </p>
              </section>

              {/* 6. Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Data Security
                </h2>
                <p>
                  We use reasonable security measures to protect your
                  information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>Encrypted connections (HTTPS)</li>
                  <li>Secure servers</li>
                  <li>Access controls</li>
                  <li>Regular security reviews</li>
                </ul>
                <p>
                  However, no method of transmission over the internet is 100%
                  secure. We can&apos;t guarantee absolute security, but we do
                  our best.
                </p>
              </section>

              {/* 7. Data Retention */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. Data Retention
                </h2>
                <p>We keep your information only as long as necessary:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Account data:</strong> Until you delete your
                    account, plus a short period for backups
                  </li>
                  <li>
                    <strong>Analytics data:</strong> Typically aggregated and
                    anonymized after 26 months
                  </li>
                  <li>
                    <strong>Support requests:</strong> Retained as needed to
                    provide support
                  </li>
                  <li>
                    <strong>Legal compliance:</strong> Kept as required by law
                  </li>
                </ul>
                <p>
                  You can request deletion of your data anytime (see &quot;Your
                  Rights&quot; below).
                </p>
              </section>

              {/* 8. International Users & GDPR */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. International Users &amp; GDPR
                </h2>
                <p>
                  Puzzio.io is operated from the United States. If you&apos;re
                  accessing the site from outside the US, your information may
                  be transferred to and processed in the United States.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  For Users in the European Union
                </h3>
                <p>
                  If you&apos;re in the EU, we process your data based on these
                  legal grounds:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Legitimate interest:</strong> Running the site,
                    preventing fraud, improving services
                  </li>
                  <li>
                    <strong>Consent:</strong> When you agree to certain data
                    collection (like account creation)
                  </li>
                  <li>
                    <strong>Contractual necessity:</strong> To provide services
                    you request
                  </li>
                  <li>
                    <strong>Legal obligation:</strong> When required by law
                  </li>
                </ul>
                <p>
                  You have specific rights under GDPR (see &quot;Your
                  Rights&quot; below).
                </p>
              </section>

              {/* 9. Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. Your Rights
                </h2>
                <p>
                  Depending on where you live, you may have these rights
                  regarding your information:
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="font-bold text-white mb-2">
                      Right to Access
                    </h4>
                    <p className="text-sm">
                      Request a copy of the personal data we have about you.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="font-bold text-white mb-2">
                      Right to Correction
                    </h4>
                    <p className="text-sm">
                      Ask us to correct inaccurate information.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="font-bold text-white mb-2">
                      Right to Deletion
                    </h4>
                    <p className="text-sm">
                      Request deletion of your personal data (&quot;Right to Be
                      Forgotten&quot;).
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="font-bold text-white mb-2">
                      Right to Restrict Processing
                    </h4>
                    <p className="text-sm">
                      Ask us to limit how we use your data.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="font-bold text-white mb-2">
                      Right to Data Portability
                    </h4>
                    <p className="text-sm">
                      Get your data in a portable format to transfer to another
                      service.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="font-bold text-white mb-2">
                      Right to Object
                    </h4>
                    <p className="text-sm">
                      Object to processing for legitimate interests or direct
                      marketing.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  How to Exercise Your Rights
                </h3>
                <p>
                  Email us at{' '}
                  <a
                    href="mailto:privacy@puzzio.io"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    privacy@puzzio.io
                  </a>{' '}
                  or use our{' '}
                  <Link
                    href="/contact"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    contact form
                  </Link>
                  .
                </p>
                <p className="mt-2">
                  We&apos;ll respond within 30 days. If your request is complex,
                  we may need more time and will let you know.
                </p>
              </section>

              {/* 10. Links to Other Websites */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. Links to Other Websites
                </h2>
                <p>Puzzio.io may link to external websites, including:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    Social media (Twitter, Facebook, Instagram, TikTok, Discord,
                    YouTube)
                  </li>
                  <li>Third-party game developers&apos; sites</li>
                  <li>Other gaming platforms</li>
                </ul>
                <p>
                  When you click a link and leave Puzzio.io, our Privacy Policy
                  no longer applies. Each website has its own privacy practices.
                  We&apos;re not responsible for external sites.
                </p>
              </section>

              {/* 11. Changes to This Privacy Policy */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. Changes to This Privacy Policy
                </h2>
                <p>We may update this Privacy Policy occasionally. When we do:</p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    We&apos;ll update the &quot;Last updated&quot; date at the
                    top
                  </li>
                  <li>Significant changes will be posted on the site</li>
                  <li>
                    Continued use of the site after changes means you accept the
                    updated policy
                  </li>
                </ul>
                <p>We recommend checking this page periodically.</p>
              </section>

              {/* 12. California Privacy Rights (CCPA) */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. California Privacy Rights (CCPA)
                </h2>
                <p>
                  If you&apos;re a California resident, you have additional
                  rights under the California Consumer Privacy Act:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>
                    <strong>Right to Know:</strong> What personal information we
                    collect and how we use it
                  </li>
                  <li>
                    <strong>Right to Delete:</strong> Request deletion of your
                    personal information
                  </li>
                  <li>
                    <strong>Right to Opt-Out:</strong> We don&apos;t sell
                    personal information, so there&apos;s nothing to opt out of
                  </li>
                  <li>
                    <strong>Right to Non-Discrimination:</strong> We won&apos;t
                    discriminate against you for exercising your rights
                  </li>
                </ul>
                <p>
                  To exercise these rights, contact{' '}
                  <a
                    href="mailto:privacy@puzzio.io"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    privacy@puzzio.io
                  </a>
                  .
                </p>
              </section>

              {/* 13. Do Not Track */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  13. Do Not Track
                </h2>
                <p>
                  Some browsers have &quot;Do Not Track&quot; (DNT) features.
                  Currently, there&apos;s no standard for how websites should
                  respond to DNT signals. Puzzio.io does not respond to DNT
                  signals at this time.
                </p>
              </section>

              {/* 14. Contact Us */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  14. Contact Us
                </h2>
                <p>
                  Questions, concerns, or want to exercise your rights?
                </p>
                <div className="mt-4 p-6 bg-slate-800 rounded-lg space-y-3">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a
                      href="mailto:privacy@puzzio.io"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      privacy@puzzio.io
                    </a>
                  </p>
                  <p>
                    <strong>Support:</strong>{' '}
                    <a
                      href="mailto:support@puzzio.io"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      support@puzzio.io
                    </a>
                  </p>
                  <p>
                    <strong>Contact Form:</strong>{' '}
                    <Link
                      href="/contact"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      puzzio.io/contact
                    </Link>
                  </p>
                  <p>
                    <strong>Mail:</strong> Puzzio, 242 Central Park Ave, Virginia
                    Beach, VA 23462, United States
                  </p>
                  <p>
                    <strong>Phone:</strong> +1 757 275 2390
                  </p>
                </div>
              </section>

              {/* 15. Summary (TL;DR) */}
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  15. Summary (TL;DR)
                </h2>
                <p className="mb-4">
                  Don&apos;t want to read the whole thing? Here&apos;s the quick
                  version:
                </p>
                <div className="p-6 bg-gradient-to-br from-purple-900/40 to-slate-800 border border-purple-700/50 rounded-xl space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> You can play
                    games without giving us personal info
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> We collect
                    technical data (IP, browser, usage) to run the site
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> We use cookies for
                    functionality, analytics, and ads
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> We don&apos;t sell
                    your personal information
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> For kids under 13:
                    No personal data collection, only contextual ads
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> You have rights to
                    access, delete, or correct your data
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✅</span> Contact{' '}
                    <a
                      href="mailto:privacy@puzzio.io"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      privacy@puzzio.io
                    </a>{' '}
                    with questions
                  </p>
                </div>
                <p className="mt-4 text-yellow-400 font-semibold">
                  But seriously, read the full policy if you want the details.
                </p>
              </section>

              {/* Footer */}
              <div className="pt-8 border-t border-slate-700">
                <p className="text-center text-gray-500">
                  © 2025 Puzzio.io. All rights reserved.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
