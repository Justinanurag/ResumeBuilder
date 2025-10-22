import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-600 border-t border-green-100 mt-40">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-16 flex flex-wrap justify-between gap-12 relative z-10">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4 max-w-xs">
            <a href="#">
              <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
            </a>
            <p className="text-sm text-gray-500 leading-relaxed">
              Making every customer feel valued—no matter the size of your audience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
            <div>
              <p className="text-slate-800 font-semibold mb-3">Product</p>
              <ul className="space-y-2">
                {["Home", "Support", "Pricing", "Affiliate"].map((item) => (
                  <li key={item}>
                    <a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-slate-800 font-semibold mb-3">Resources</p>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-block">Company</a></li>
                <li><a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-block">Blogs</a></li>
                <li><a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-block">Community</a></li>
                <li>
                  <a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-flex items-center">
                    Careers
                    <span className="text-xs text-white bg-green-600 rounded-md ml-2 px-2 py-[2px] font-medium">
                      We’re hiring!
                    </span>
                  </a>
                </li>
                <li><a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-block">About</a></li>
              </ul>
            </div>

            <div>
              <p className="text-slate-800 font-semibold mb-3">Legal</p>
              <ul className="space-y-2">
                {["Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <a href="/" className="hover:text-green-600 transition-all duration-200 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col items-start md:items-end gap-4 text-center md:text-right">
            <div className="flex gap-4 justify-center">
              {[
                {
                  href: "https://dribbble.com/prebuiltui",
                  icon: (
                    <circle cx="12" cy="12" r="10"></circle>
                  ),
                  paths: [
                    "M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94",
                    "M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32",
                    "M8.56 2.75c4.37 6 6 9.42 8 17.72",
                  ],
                },
                {
                  href: "https://www.linkedin.com/company/prebuiltui",
                  paths: [
                    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                    "M2 9h4v12H2z",
                    "M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
                  ],
                },
                {
                  href: "https://x.com/prebuiltui",
                  paths: [
                    "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                  ],
                },
                {
                  href: "https://www.youtube.com/@prebuiltui",
                  paths: [
                    "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
                    "m10 15 5-3-5-3z",
                  ],
                },
              ].map(({ href, paths }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300"
                  >
                    {paths.map((d, j) => (
                      <path key={j} d={d}></path>
                    ))}
                  </svg>
                </motion.a>
              ))}
            </div>
            <p className="text-sm mt-4">
              © 2025 <span className="font-semibold text-green-600">Resume AI</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
