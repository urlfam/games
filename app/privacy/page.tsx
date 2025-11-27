import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | Puzzio.io',
  description:
    'Learn how Puzzio.io collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy', href: '/privacy' },
          ]}
        />

        {/* Content */}
        <article className="mt-8 prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">Last updated: November 6, 2025</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Introduction
              </h2>
              <p>
                Welcome to Puzzio.io ("we," "our," or "us"). We are committed to
                protecting your privacy and ensuring you have a positive
                experience on our website. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide
                when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our contact form</li>
                <li>Create a user account (if applicable)</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p>
                This information may include: name, email address, and any other
                information you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-2 mt-6">
                Automatically Collected Information
              </h3>
              <p>
                When you visit our website, we may automatically collect certain
                information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
                <li>
                  Send you newsletters and marketing communications (with your
                  consent)
                </li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our website and store certain information. Cookies
                are files with a small amount of data that are sent to your
                browser from a website and stored on your device.
              </p>
              <p className="mt-4">
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Third-Party Services
              </h2>
              <p>
                We may use third-party services that collect, monitor, and
                analyze data, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Google Analytics for website analytics</li>
                <li>Advertising partners for targeted advertising</li>
                <li>Email service providers for newsletter delivery</li>
              </ul>
              <p>
                These third parties have their own privacy policies governing
                the use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the internet or electronic storage
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Your Rights
              </h2>
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Access, update, or delete your information</li>
                <li>Object to processing of your information</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Children's Privacy
              </h2>
              <p>
                Our website is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you become aware that a child has provided us with
                personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-none space-y-2 my-4">
                <li>
                  By visiting this page:{' '}
                  <Link
                    href="/contact"
                    className="text-purple-500 hover:text-purple-600"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>By email: privacy@puzzio.io</li>
              </ul>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
