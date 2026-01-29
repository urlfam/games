import Link from 'next/link';

export default function HomepageSeoArticle() {
  return (
    <article className="max-w-5xl mx-auto px-4 md:px-6 py-12 text-gray-300 space-y-10">
      {/* Section 1: Introduction */}
      <section className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Play Free Online Games - Puzzio.io
        </h1>
        <div className="space-y-4 text-base md:text-lg leading-relaxed">
          <p>
            Puzzio.io brings you the best free online games that work on any device. Click a game, and you're playing. Simple as that. We add new stuff regularly and only pick games we'd actually want to play ourselves.
          </p>
          <p>
            Looking for something chill? Our <Link href="/c/casual" className="text-blue-400 hover:text-blue-300 underline">casual games</Link> are perfect for killing time. Want your blood pumping? Try the <Link href="/c/action" className="text-blue-400 hover:text-blue-300 underline">action games</Link>. Brain feeling lazy? Wake it up with our <Link href="/c/puzzle" className="text-blue-400 hover:text-blue-300 underline">puzzle games</Link>. Everything loads fast and the controls won't frustrate you.
          </p>
          <p>
            Play on your laptop, phone, tablet. Whatever. The games adapt automatically. No apps to install, no logins unless you want to save scores. Browse around, try random stuff, see what sticks. We throw in fresh games pretty often.
          </p>
        </div>
      </section>

      {/* Section 2: Categories */}
      <section className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Explore Top Categories of Free Online Games
        </h2>
        <p className="text-base md:text-lg leading-relaxed mb-6">
          We sorted everything into categories so you're not scrolling forever. Here's the breakdown:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/casual" className="hover:text-blue-400 transition-colors">
                Casual Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Quick games for when you've got five minutes. Match-3 stuff, simple tap games, that kind of thing. Good for lunch breaks or waiting rooms. Nothing complicated.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/action" className="hover:text-blue-400 transition-colors">
                Action Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Fast games that'll make your fingers tired. Shooters, platformers, stuff where you die a lot until you figure it out. Leaderboards if you're into that.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/puzzle" className="hover:text-blue-400 transition-colors">
                Puzzle Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Brain teasers for people who like solving things. We've got match games, logic puzzles, color challenges. Some are easy, some will make you Google the solution (we won't judge).
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/clicker" className="hover:text-blue-400 transition-colors">
                Clicker Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Click stuff, numbers go up, upgrades unlock. Weirdly addictive. Great for mindless clicking while watching Netflix or pretending to work.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/driving" className="hover:text-blue-400 transition-colors">
                Driving Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Racing games, parking games, crashing into things games. No driver's license needed. Beat lap times or just mess around. Both work.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/.io" className="hover:text-blue-400 transition-colors">
                .io Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Multiplayer browser games where you fight other real people. Easy to learn, impossible to stop playing. Eat things, grow bigger, don't die. That's basically every .io game ever.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/shooting" className="hover:text-blue-400 transition-colors">
                Shooting Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Shoot zombies, aliens, whatever. First-person, top-down, side view. We've got them all. Your aim probably sucks at first but you'll get better.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/sports" className="hover:text-blue-400 transition-colors">
                Sports Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Soccer, basketball, tennis. All the sports without the sweating. Quick matches, tournaments, high scores. Way easier than actual exercise.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/adventure" className="hover:text-blue-400 transition-colors">
                Adventure Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Explore weird worlds, make choices, see what happens. Some have stories, some are just about finding stuff. Good if you like taking your time.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              <Link href="/c/beauty" className="hover:text-blue-400 transition-colors">
                Beauty Games
              </Link>
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Dress up characters, do makeup, design outfits. Creative stuff for when you want to zone out and make things look pretty.
            </p>
          </div>
        </div>

        <p className="text-sm md:text-base leading-relaxed mt-6">
          <strong className="text-white">Popular Tags:</strong> Looking for something specific? Browse our <Link href="/t/3d" className="text-blue-400 hover:text-blue-300 underline">3D games</Link>, <Link href="/t/mouse" className="text-blue-400 hover:text-blue-300 underline">mouse-controlled games</Link>, <Link href="/t/battle" className="text-blue-400 hover:text-blue-300 underline">battle games</Link>, <Link href="/t/relaxing" className="text-blue-400 hover:text-blue-300 underline">relaxing games</Link>, or <Link href="/t/simulation" className="text-blue-400 hover:text-blue-300 underline">simulation games</Link> for more curated collections.
        </p>
      </section>

      {/* Section 3: What's Hot */}
      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          What's Hot on Puzzio? The Best Free Games Right Now
        </h2>
        <div className="space-y-4 text-base md:text-lg leading-relaxed">
          <p>
            These sections show you what's actually getting played right now, not just what we think is cool:
          </p>
          <p>
            <strong className="text-white"><Link href="/new-games" className="text-blue-400 hover:text-blue-300 underline">New Games</Link>:</strong> Fresh uploads. We add games every week or so. Some blow up, some don't. Get in early and you might find something before it's everywhere.
          </p>
          <p>
            <strong className="text-white"><Link href="/trending" className="text-blue-400 hover:text-blue-300 underline">Popular Games</Link>:</strong> The ones everyone keeps coming back to. High play counts mean people actually like them, not just that we shoved them on the homepage. Safe bets if you want something proven.
          </p>
          <p>
            <strong className="text-white">Featured Titles:</strong> Games climbing fast. Not huge yet but getting there. Your chance to get good before everyone else shows up and crushes you on the leaderboard.
          </p>
          <p>
            Basically, if it's fun and works in a browser, you'll probably find it here.
          </p>
        </div>
      </section>

      {/* Section 4: Why Choose */}
      <section className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Why Choose Puzzio.io for Browser Games?
        </h2>
        <div className="space-y-4 text-base md:text-lg leading-relaxed">
          <p>
            Everything's free. For real. No "free demo then pay" garbage. No subscriptions hiding in the fine print. Click play and you're in.
          </p>
          <p>
            Nothing to download either. Works right in Chrome, Safari, Firefox, whatever browser you've got. Desktop, phone, tablet. Doesn't matter. Games load reasonably fast unless your internet sucks, but that's not really our fault.
          </p>
          <p>
            We keep adding games because a static library gets boring. New <Link href="/c/clicker" className="text-blue-400 hover:text-blue-300 underline">clicker games</Link>, <Link href="/c/puzzle" className="text-blue-400 hover:text-blue-300 underline">puzzles</Link>, whatever seems fun. Sometimes we add stuff people ask for in comments. Sometimes we just find cool games and throw them up.
          </p>
          <p>
            Quality matters more than quantity here. We test games before adding them. Broken controls? Doesn't load? Sketchy ads everywhere? Hard pass. Only stuff that actually works makes it on the site.
          </p>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="space-y-4 border-t border-gray-700 pt-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Start Playing the Best Free Games Online - Right Now!
        </h2>
        <div className="space-y-4 text-base md:text-lg leading-relaxed">
          <p>
            That's it. Pick a game from the <Link href="/" className="text-blue-400 hover:text-blue-300 underline">homepage</Link> and start clicking. No signup forms, no verification emails, none of that.
          </p>
          <p className="text-xl font-semibold">
            Browse everything, check the <Link href="/new-games" className="text-blue-400 hover:text-blue-300 underline">new stuff</Link>, or just hit a random game. Whatever works.
          </p>
        </div>
      </section>
    </article>
  );
}
