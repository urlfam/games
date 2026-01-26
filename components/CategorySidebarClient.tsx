'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Mail, Info, FileText, Shield, Gamepad, Heart } from 'lucide-react';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { useSidebar } from '@/components/SidebarContext';

interface Category {
  name: string;
  slug: string;
}

interface CategorySidebarClientProps {
  categories: Category[];
}

export default function CategorySidebarClient({
  categories: initialCategories,
}: CategorySidebarClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category')?.toLowerCase() || 'all';
  const [isHovered, setIsHovered] = useState(false);
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Client-side fallback: fetch categories if list is sparse (only default ones)
  // This ensures static pages (which might miss build-time data) still load the full sidebar
  useEffect(() => {
    // There are 3 default categories (Home, New, Popular). If we have these or fewer, assume data missing.
    const hasOnlyDefaults = categories.length <= 3;

    if (hasOnlyDefaults) {
      fetch('/api/categories')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((realCategories: any[]) => {
          if (Array.isArray(realCategories) && realCategories.length > 0) {
            const specialCategories = [
              { name: 'Home', slug: 'all' },
              { name: 'New', slug: 'new' },
              { name: 'Popular Games', slug: 'trending' },
            ];

            const merged = [
              ...specialCategories,
              ...realCategories.map((cat) => ({
                name: cat.name,
                slug: cat.slug,
              })),
            ];
            setCategories(merged);
          }
        })
        .catch((err) =>
          console.error('Error fetching sidebar categories:', err),
        );
    }
  }, [categories]);

  // If sidebar is closed via toggle, it shouldn't show at all or be collapsed?
  // User said "cachet ou pas" (hide or not).
  // If hidden, we return null or apply hidden class.
  // But wait, if it's hidden, how do we access categories?
  // The user screenshot shows a toggle button. Usually this toggles between "icon only" and "full width" OR "visible" and "hidden".
  // Given the current design has hover expansion, maybe the toggle completely hides it?
  // "cachet ou pas cette sidebare" implies visibility.
  // Let's assume it toggles visibility (display: none or translate off-screen).

  if (!isSidebarOpen) return null;

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#1a1d29] flex flex-col py-4 transition-all duration-300 z-[100] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent hidden md:flex ${
        isHovered ? 'w-56' : 'w-16'
      } pt-20`} // Added pt-20 to account for header height (16 * 4 = 64px + padding)
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Categories */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug);
          const isActive =
            activeCategory === category.slug ||
            (category.slug === 'all' && activeCategory === 'all');

          return (
            <Link
              key={category.slug}
              href={
                category.slug === 'all'
                  ? '/'
                  : category.slug === 'new'
                    ? '/new'
                    : category.slug === 'trending'
                      ? '/trending'
                      : `/c/${category.slug}`
              }
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-gray-400 hover:bg-[#252836] hover:text-white'
              }`}
              title={category.name}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Contact Button & Links */}
      <div className="px-2 mt-4 border-t border-gray-700 pt-4">
        {/* Contact Us Button */}
        <Link
          href="/contact"
          className={`flex items-center justify-center mb-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full transition-all duration-200 font-semibold ${
            isHovered ? 'gap-2 px-4 py-3' : 'w-12 h-12 mx-auto'
          }`}
          title="Contact us"
        >
          <Mail size={20} className="flex-shrink-0" />
          {isHovered && <span className="whitespace-nowrap">Contact us</span>}
        </Link>

        {/* Footer Links */}
        <div className="flex flex-col gap-1">
          <Link
            href="/favorites"
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            title="My Favorites"
          >
            <Heart size={18} className="flex-shrink-0 text-pink-500" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              My Favorites
            </span>
          </Link>

          <Link
            href="/about-us"
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            title="About"
          >
            <Info size={18} className="flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              About
            </span>
          </Link>

          <Link
            href="/terms"
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            title="Terms & conditions"
          >
            <FileText size={18} className="flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              Terms & conditions
            </span>
          </Link>

          <Link
            href="/privacy"
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            title="Privacy"
          >
            <Shield size={18} className="flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              Privacy
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            title="All games"
          >
            <Gamepad size={18} className="flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              All games
            </span>
          </Link>
        </div>

        {/* Social Media Icons */}
        <div
          className={`px-3 mt-4 mb-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 hidden'
          }`}
        >
          <div className="flex flex-wrap gap-2 justify-start">
            {/* Discord */}
            <a
              href="https://discord.gg/puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="Discord"
            >
              <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M256 0C114.62 0 0 114.62 0 256s114.62 256 256 256 256-114.62 256-256S397.38 0 256 0zm182.91 350.25c-31.64 23.24-62.3 37.35-92.53 46.7-.48.15-1-.03-1.3-.44-6.98-9.72-13.32-19.97-18.88-30.73-.32-.63-.03-1.39.63-1.64 10.07-3.81 19.65-8.36 28.87-13.74.73-.43.77-1.47.1-1.97-1.95-1.45-3.89-2.98-5.74-4.51a1.14 1.14 0 0 0-1.21-.15c-59.84 27.65-125.39 27.65-185.94 0-.39-.17-.86-.11-1.19.17-1.85 1.52-3.79 3.04-5.73 4.49-.67.5-.62 1.54.11 1.97 9.22 5.28 18.8 9.93 28.86 13.75.66.25.97 1 .64 1.63-5.43 10.78-11.78 21.02-18.89 30.74-.31.4-.82.58-1.3.43-30.09-9.35-60.74-23.46-92.39-46.7-.26-.21-.45-.53-.48-.87-6.44-69.03 6.7-138.92 54.66-210.58.12-.19.29-.34.5-.42a303.91 303.91 0 0 1 75.3-23.36c.48-.07.96.15 1.21.57 3.27 5.79 7 13.2 9.53 19.26 27.85-4.25 56.14-4.25 84.58 0 2.52-5.93 6.12-13.47 9.37-19.26.25-.44.73-.66 1.21-.57a304.855 304.855 0 0 1 75.31 23.36c.21.08.38.23.48.44 41.78 61.45 62.42 130.77 54.7 210.58-.03.34-.2.64-.48.85z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M227.9 270.06c0 20.56-14.73 37.29-33.25 37.29-18.23 0-33.25-16.73-33.25-37.29 0-20.55 14.73-37.29 33.25-37.29 18.66 0 33.54 16.89 33.25 37.29zM350.83 270.06c0 20.56-14.58 37.29-33.25 37.29-18.23 0-33.25-16.73-33.25-37.29 0-20.55 14.73-37.29 33.25-37.29 18.67 0 33.54 16.89 33.25 37.29z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com/puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="Facebook"
            >
              <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256s114.6 256 256 256c1.5 0 3 0 4.5-.1V312.7h-55v-64.1h55v-47.2c0-54.7 33.4-84.5 82.2-84.5 23.4 0 43.5 1.7 49.3 2.5v57.2h-33.6c-26.5 0-31.7 12.6-31.7 31.1v40.8h63.5l-8.3 64.1h-55.2v189.5C433.7 471.4 512 372.9 512 256z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com/puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="Instagram"
            >
              <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M256 0C114.637 0 0 114.637 0 256s114.637 256 256 256 256-114.637 256-256S397.363 0 256 0zm146.113 316.605c-.71 15.649-3.199 26.333-6.832 35.684a75.164 75.164 0 0 1-42.992 42.992c-9.348 3.633-20.035 6.117-35.68 6.832-15.675.715-20.683.887-60.605.887-39.926 0-44.93-.172-60.61-.887-15.644-.715-26.331-3.199-35.68-6.832a72.018 72.018 0 0 1-26.038-16.957 72.044 72.044 0 0 1-16.953-26.035c-3.633-9.348-6.121-20.035-6.832-35.68-.723-15.68-.891-20.687-.891-60.609s.168-44.93.887-60.605c.71-15.649 3.195-26.332 6.828-35.684a72.013 72.013 0 0 1 16.96-26.035 72.003 72.003 0 0 1 26.036-16.957c9.352-3.633 20.035-6.117 35.684-6.832C211.07 109.172 216.078 109 256 109s44.93.172 60.605.89c15.649.712 26.332 3.196 35.684 6.825a72.061 72.061 0 0 1 26.04 16.96 72.027 72.027 0 0 1 16.952 26.036c3.637 9.352 6.121 20.035 6.836 35.684.715 15.675.883 20.683.883 60.605s-.168 44.93-.887 60.605zm0 0"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M305 256c0 27.063-21.938 49-49 49s-49-21.938-49-49 21.938-49 49-49 49 21.938 49 49zm0 0"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M370.594 169.305a45.546 45.546 0 0 0-10.996-16.903 45.514 45.514 0 0 0-16.903-10.996c-5.18-2.011-12.96-4.406-27.293-5.058-15.504-.707-20.152-.86-59.402-.86-39.254 0-43.902.149-59.402.856-14.332.656-22.118 3.05-27.293 5.062a45.483 45.483 0 0 0-16.903 10.996 45.572 45.572 0 0 0-11 16.903c-2.011 5.18-4.406 12.965-5.058 27.297-.707 15.5-.86 20.148-.86 59.402 0 39.25.153 43.898.86 59.402.652 14.332 3.047 22.114 5.058 27.293a45.563 45.563 0 0 0 10.996 16.903 45.514 45.514 0 0 0 16.903 10.996c5.18 2.015 12.965 4.41 27.297 5.062 15.5.707 20.144.856 59.398.856 39.258 0 43.906-.149 59.402-.856 14.332-.652 22.118-3.047 27.297-5.062a48.68 48.68 0 0 0 27.899-27.899c2.011-5.18 4.406-12.96 5.062-27.293.707-15.504.856-20.152.856-59.402 0-39.254-.149-43.902-.856-59.402-.652-14.332-3.047-22.118-5.062-27.297zM256 331.485c-41.691 0-75.488-33.794-75.488-75.485s33.797-75.484 75.488-75.484c41.688 0 75.484 33.793 75.484 75.484S297.688 331.484 256 331.484zm78.469-136.313c-9.742 0-17.64-7.899-17.64-17.64s7.898-17.641 17.64-17.641 17.64 7.898 17.64 17.64c-.004 9.742-7.898 17.64-17.64 17.64zm0 0"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
            {/* Pinterest */}
            <a
              href="https://pinterest.com/puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="Pinterest"
            >
              <svg
                viewBox="0 0 97.75 97.75"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M48.875 0C21.883 0 0 21.882 0 48.875S21.883 97.75 48.875 97.75 97.75 75.868 97.75 48.875 75.867 0 48.875 0zm5.624 65.109c-4.521 0-8.773-2.444-10.229-5.219 0 0-2.432 9.645-2.943 11.506-1.813 6.58-7.146 13.162-7.561 13.701-.289.375-.928.258-.994-.24-.113-.838-1.475-9.139.127-15.909.801-3.4 5.383-22.814 5.383-22.814s-1.334-2.673-1.334-6.625c0-6.205 3.596-10.837 8.074-10.837 3.807 0 5.645 2.859 5.645 6.286 0 3.828-2.436 9.552-3.693 14.856-1.051 4.441 2.225 8.064 6.605 8.064 7.933 0 13.272-10.188 13.272-22.261 0-9.174-6.176-16.044-17.418-16.044-12.697 0-20.615 9.471-20.615 20.052 0 3.646 1.078 6.221 2.764 8.21.773.915.883 1.283.602 2.333-.203.771-.66 2.625-.854 3.358-.279 1.062-1.137 1.44-2.098 1.049-5.846-2.387-8.572-8.793-8.572-15.994 0-11.893 10.029-26.154 29.922-26.154 15.985 0 26.506 11.566 26.506 23.984.001 16.428-9.132 28.698-22.589 28.698z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
            {/* Reddit */}
            <a
              href="https://reddit.com/r/puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="Reddit"
            >
              <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M256 0C114.637 0 0 114.637 0 256s114.637 256 256 256 256-114.637 256-256S397.363 0 256 0zm148.531 290.148c.563 3.688.871 7.426.871 11.215 0 57.446-66.867 103.989-149.351 103.989s-149.352-46.543-149.352-103.989c0-3.84.309-7.629.871-11.316-13.004-5.836-22.066-18.89-22.066-34.047 0-20.582 16.691-37.324 37.324-37.324 10.035 0 19.098 3.941 25.805 10.394 25.906-18.687 61.75-30.62 101.633-31.644 0-.512 18.636-89.293 18.636-89.293a6.57 6.57 0 0 1 2.868-4.196c1.484-.972 3.277-1.28 5.02-.921l62.054 13.207c4.351-8.805 13.308-14.899 23.804-14.899 14.747 0 26.676 11.93 26.676 26.676s-11.93 26.676-26.676 26.676c-14.285 0-25.855-11.266-26.52-25.395l-55.554-11.828-16.996 80.027c39.168 1.38 74.344 13.258 99.84 31.692 6.707-6.5 15.82-10.496 25.906-10.496 20.637 0 37.324 16.691 37.324 37.324 0 15.258-9.164 28.312-22.117 34.148zm0 0"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M309.605 343.348c-11.468 11.468-36.042 15.562-53.554 15.562-17.563 0-42.086-4.094-53.555-15.562a6.887 6.887 0 0 0-9.777 0 6.887 6.887 0 0 0 0 9.777c18.176 18.176 53.094 19.61 63.332 19.61s45.105-1.434 63.336-19.61a6.987 6.987 0 0 0 0-9.777 6.892 6.892 0 0 0-9.782 0zM224 282.676C224 267.98 212.02 256 197.324 256c-14.691 0-26.676 11.98-26.676 26.676 0 14.691 11.985 26.676 26.676 26.676 14.696 0 26.676-11.98 26.676-26.676zm0 0"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M314.676 256C299.98 256 288 267.98 288 282.676c0 14.691 11.98 26.676 26.676 26.676 14.691 0 26.676-11.985 26.676-26.676 0-14.696-11.98-26.676-26.676-26.676zm0 0"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com/@puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="TikTok"
            >
              <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M256 0C114.637 0 0 114.637 0 256s114.637 256 256 256 256-114.637 256-256S397.363 0 256 0zm128.43 195.873v34.663c-16.345.006-32.226-3.197-47.204-9.516a120.587 120.587 0 0 1-26.811-15.636l.246 106.693c-.103 24.025-9.608 46.598-26.811 63.601-14 13.84-31.74 22.641-50.968 25.49a93.951 93.951 0 0 1-13.766 1.012c-20.583 0-40.124-6.668-56.109-18.97a93.08 93.08 0 0 1-8.624-7.532c-18.644-18.427-28.258-43.401-26.639-69.674 1.235-19.999 9.242-39.072 22.59-54.021 17.66-19.782 42.366-30.762 68.782-30.762 4.65 0 9.248.349 13.766 1.018v48.468a43.401 43.401 0 0 0-13.623-2.19c-24.134 0-43.659 19.69-43.298 43.842.229 15.453 8.67 28.961 21.12 36.407a43.023 43.023 0 0 0 19.765 6.062 43.42 43.42 0 0 0 16.036-2.127c17.243-5.696 29.682-21.892 29.682-40.994l.057-71.447V109.82h47.736a74.25 74.25 0 0 0 1.418 13.817c3.603 18.101 13.806 33.805 28.006 44.511 12.382 9.339 27.8 14.875 44.511 14.875.011 0 .149 0 .137-.011v12.861z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
            {/* Twitter / X */}
            <a
              href="https://twitter.com/puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="X (Twitter)"
            >
              <svg
                viewBox="0 0 1227 1227"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill="#1a1d29"
                    d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z"
                    opacity="1"
                  ></path>
                </g>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com/@puzzio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform text-gray-400 hover:text-white"
              title="YouTube"
            >
              <svg
                viewBox="0 0 512 512"
                className="w-8 h-8"
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M256 0C114.637 0 0 114.637 0 256s114.637 256 256 256 256-114.637 256-256S397.363 0 256 0zm159.96 256.262s0 51.918-6.585 76.953c-3.691 13.703-14.496 24.508-28.2 28.195C356.142 368 256 368 256 368s-99.879 0-125.176-6.852c-13.703-3.687-24.508-14.496-28.199-28.199-6.59-24.77-6.59-76.949-6.59-76.949s0-51.914 6.59-76.95c3.688-13.702 14.758-24.773 28.2-28.46C155.858 144 256 144 256 144s100.14 0 125.176 6.852c13.703 3.687 24.508 14.496 28.199 28.199 6.852 25.035 6.586 77.21 6.586 77.21zm0 0"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M224.113 303.96 307.387 256l-83.274-47.96zm0 0"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 px-3">
          <p
            className={`text-gray-500 text-xs transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            © 2025 Puzzio.io
          </p>
        </div>
      </div>
    </aside>
  );
}
