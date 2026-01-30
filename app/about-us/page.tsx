import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Puzzio.io',
  description:
    'Learn more about Puzzio.io, your premier destination for free online games. Fun, free games with no BS. No downloads, no sign-ups, no hidden fees.',
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
          <p className="text-xl text-gray-400 font-semibold">
            Fun, Free Games. No BS.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Who We Are */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Who We Are
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Puzzio.io is run by Puzzio, based in Virginia Beach, United States. We started this thing in January 2025 because we got tired of gaming sites that make you jump through hoops just to play a simple game.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Downloads? Nope. Sign-ups? Only if you want to save your scores. Hidden fees? Get out of here.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Today, millions of people use Puzzio.io to waste time productively. We&apos;ve got thousands of games, and we keep adding more because a static library gets boring fast.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">The team:</strong> Started by Jack Bonser, now a small crew that actually plays the games before putting them up. If it&apos;s buggy or the controls suck, it doesn&apos;t make it on the site. Simple as that.
            </p>
          </section>

          {/* What We Do */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              What We Do
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We host a ton of free browser games on <a href="https://puzzio.io" className="text-purple-400 hover:text-purple-300">puzzio.io</a>. Here&apos;s what we&apos;ve got:
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Action Games
                </h3>
                <p>
                  Fast stuff. Shooters, platformers, things where you die a lot until you figure it out. Good for getting your blood pumping.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Puzzle Games
                </h3>
                <p>
                  Brain teasers for when you want to feel smart. Match-3, logic puzzles, color challenges. Some are easy, some will make you rage-quit.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Casual Games
                </h3>
                <p>
                  Quick games for lunch breaks. Nothing complicated. Just click stuff and relax.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Driving Games
                </h3>
                <p>
                  Racing, parking, crashing into things. No driver&apos;s license needed. Beat lap times or just mess around—both work.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  .io Games
                </h3>
                <p>
                  Real multiplayer. Fight other actual humans. Eat things, grow bigger, don&apos;t die. You know the drill.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Sports Games
                </h3>
                <p>
                  Soccer, basketball, tennis. All the sports without the sweating. Way easier than actual exercise.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Simulation & Strategy
                </h3>
                <p>
                  Build stuff, manage stuff, plan stuff. For when you want to zone out and create things.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  And More
                </h3>
                <p>
                  Clicker games (weirdly addictive), adventure games, beauty games, shooting games. We&apos;ve got categories for days.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">100% Free</strong> – No subscriptions. No &quot;free trial then we charge you&quot; garbage. Actually free to play.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Instant Play</strong> – Click a game, it loads, you&apos;re playing. That&apos;s it.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">No Downloads</strong> – Everything runs in your browser. Chrome, Safari, Firefox, whatever you&apos;ve got.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Cross-Platform</strong> – Desktop, phone, tablet. Doesn&apos;t matter. Games work on all of them.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">No Forced Registration</strong> – Play immediately. Only sign up if you want to save scores or favorite games.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Regular Updates</strong> – New games added weekly because variety matters.
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Our Values (Yeah, We Have Those)
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Accessible:</strong> If you have internet, you can play. No expensive hardware. No paid barriers. Gaming for everyone.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Quality Over Quantity:</strong> We test games before adding them. Broken controls? Doesn&apos;t load? Hard pass. Only stuff that actually works makes it on the site.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">No Unnecessary Complexity:</strong> Other sites make you create accounts, verify emails, download launchers. We think that&apos;s stupid. Click and play. Done.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Community-Driven:</strong> We actually read your comments and ratings. Good suggestions get implemented. Bad games get removed. You tell us what works.
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3 text-xl">•</span>
                <div>
                  <strong className="text-white">Safe & Clean:</strong> Family-friendly environment. We monitor content, block inappropriate stuff, and follow privacy laws (COPPA, GDPR – the boring but important stuff). Age-gates for younger players when needed.
                </div>
              </li>
            </ul>
          </section>

          {/* Our Story */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              The Story
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Puzzio.io started because we noticed something annoying: most gaming platforms required downloads, expensive hardware, or subscriptions that excluded tons of people.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              We thought: &quot;What if you could just... click a game and play it?&quot; Revolutionary, right?
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Turns out, people liked that idea. Since January 2025, we&apos;ve been growing fast, adding thousands of games and serving players from all over the world.
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">What we learned:</strong> Keep it simple. Don&apos;t annoy people. Add good games. Remove bad ones. Listen to feedback. Repeat. That&apos;s our entire strategy, and it seems to work.
            </p>
          </section>

          {/* Safety & Privacy */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Safety & Privacy (The Boring But Important Part)
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We take this seriously even if our tone doesn&apos;t sound like it:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div><strong className="text-white">Age-Appropriate Content</strong> – We monitor games and block anything inappropriate.</div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div><strong className="text-white">Privacy Compliance</strong> – We follow COPPA (for kids) and GDPR (for Europe) because laws exist for a reason.</div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div><strong className="text-white">Third-Party Games</strong> – Most games are made by other developers. We vet them before adding to make sure they&apos;re safe and actually fun.</div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div><strong className="text-white">Data Protection</strong> – We don&apos;t sell your data. We use standard analytics to see which games are popular. That&apos;s about it.</div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div><strong className="text-white">Parental Controls</strong> – Age-gates and content filters available for families.</div>
              </li>
            </ul>
            <p className="text-gray-400 mt-4 text-sm">
              For the full legal stuff, check our <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link> and <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms & Conditions</Link>.
            </p>
          </section>

          {/* Working With Developers */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Working With Game Developers
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We partner with indie developers and studios worldwide to bring you the best browser games.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Got a game?</strong> We might want it. Requirements:
            </p>
            <ul className="text-gray-300 mb-4 space-y-1">
              <li>• Works in browsers (HTML5, WebGL, whatever)</li>
              <li>• Actually fun (we test it)</li>
              <li>• No malware or shady stuff</li>
              <li>• Reasonable file size</li>
            </ul>
            <p className="text-gray-300">
              Interested? Email us at: <a href="mailto:developers@puzzio.io" className="text-purple-400 hover:text-purple-300">developers@puzzio.io</a>
            </p>
          </section>

          {/* Join The Community */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Join The Community
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Millions of people already use Puzzio.io for their daily gaming fix. Whether you&apos;re here for 5 minutes or 5 hours, we&apos;ve got you covered.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-white">Connect with us:</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="https://twitter.com/puzzio" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">Twitter/X</a>
              <a href="https://facebook.com/puzzio" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">Facebook</a>
              <a href="https://instagram.com/puzzio" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">Instagram</a>
              <a href="https://tiktok.com/@puzzio" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">TikTok</a>
              <a href="https://discord.gg/puzzio" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">Discord</a>
              <a href="https://youtube.com/@puzzio" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 transition-colors">YouTube</a>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-white">Community Resources:</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• <strong>Rate & Review</strong> – Every game has ratings. Use them. They help.</li>
              <li>• <strong>Favorites</strong> – Save your favorite games for quick access</li>
              <li>• <strong>Leaderboards</strong> – Compete with players worldwide</li>
            </ul>
          </section>

          {/* Contact Info */}
          <section className="bg-slate-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Get In Touch
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300 mb-4">
              <div><strong className="text-white">General Contact:</strong> <a href="mailto:contact@puzzio.io" className="text-purple-400 hover:text-purple-300">contact@puzzio.io</a></div>
              <div><strong className="text-white">Business Inquiries:</strong> <a href="mailto:business@puzzio.io" className="text-purple-400 hover:text-purple-300">business@puzzio.io</a></div>
              <div><strong className="text-white">Developer Submissions:</strong> <a href="mailto:developers@puzzio.io" className="text-purple-400 hover:text-purple-300">developers@puzzio.io</a></div>
              <div><strong className="text-white">Technical Support:</strong> <a href="mailto:support@puzzio.io" className="text-purple-400 hover:text-purple-300">support@puzzio.io</a></div>
              <div><strong className="text-white">Phone:</strong> +1 757 275 2390</div>
            </div>
          </section>

          {/* Call to Action - Start Playing */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Start Playing</h2>
            <p className="text-lg mb-6">
              Enough reading. Thousands of games are waiting. Click stuff and have fun.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Games
            </Link>
          </section>

          {/* Contact Section */}
          <section className="bg-slate-800 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">
              Got Something to Say?
            </h2>
            <p className="text-gray-300 mb-6">
              Questions? Feedback? Game suggestions? Complaints about how your favorite game got removed? We want to hear it.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Contact Us
            </Link>
          </section>

          {/* Legal Section */}
          <section className="bg-slate-800/50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-400">Legal Stuff</h3>
            <div className="text-gray-400 text-sm space-y-2">
              <p><strong className="text-gray-300">Puzzio.io is operated by:</strong> Puzzio</p>
              <p>242 Central Park Ave, Virginia Beach, VA 23462, United States</p>
              <p>Phone: +1 757 275 2390</p>
              <p className="mt-4"><strong className="text-gray-300">Founded:</strong> January 1, 2025 | <strong className="text-gray-300">Founder:</strong> Jack Bonser</p>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms & Conditions</Link>
                <Link href="/cookies" className="text-purple-400 hover:text-purple-300">Cookie Policy</Link>
                <Link href="/dmca" className="text-purple-400 hover:text-purple-300">DMCA</Link>
              </div>
              <p className="mt-4 text-xs">© 2025 Puzzio.io. All games are property of their respective owners. We just host them so you can play them easily.</p>
            </div>
          </section>

          {/* Fun Fact */}
          <div className="text-center text-gray-500 text-sm italic py-4">
            <p>Fun fact: You just read an entire About page. That&apos;s more commitment than most people give their relationships. Respect. Now go play some games.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
