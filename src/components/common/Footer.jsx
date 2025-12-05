import React from "react";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const companyLinks = [
    { title: "About", to: "/about" },
    { title: "Careers", to: "/careers" },
  ];

  const resources = [
    { title: "Blog", to: "/blog" },
    { title: "Docs", to: "/docs" },
  ];

  const support = [
    { title: "Help Center", to: "/help-center" },
    { title: "Contact", to: "/contact" },
  ];

  return (
    <footer
      className="w-full bg-richblack-900/60 border-t border-white/3 py-12"
      role="contentinfo"
    >
      <div className="mx-auto w-11/12 max-w-maxContent">
        {/* Glassy container */}
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px) saturate(110%)",
            WebkitBackdropFilter: "blur(8px) saturate(110%)",
            boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Left: logo + short tagline + socials */}
            <div className="md:w-1/3 flex flex-col gap-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <img src={Logo} alt="StudyNotion" className="h-8 object-contain" />
              </Link>

              <p className="text-sm text-richblack-300 max-w-sm">
                Learn practical skills with focused, project-led courses. Friendly, warm, and built for real learners.
              </p>

              <div className="flex items-center  text-white gap-3">
                <FaFacebook />
                <FaTwitter />
                <FaYoutube />
              </div>
            </div>

            {/* Middle: two tidy columns of links */}
            <div className="md:w-1/3 flex gap-8 justify-between">
              <div>
                <h4 className="text-sm font-semibold text-richblack-50 mb-3">Company</h4>
                <ul className="flex flex-col gap-2">
                  {companyLinks.map((l) => (
                    <li key={l.title}>
                      <Link to={l.to} className="text-sm text-richblack-300 hover:text-white transition">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-richblack-50 mb-3">Resources</h4>
                <ul className="flex flex-col gap-2">
                  {resources.map((l) => (
                    <li key={l.title}>
                      <Link to={l.to} className="text-sm text-richblack-300 hover:text-white transition">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: support & small CTA (kept minimal) */}
            <div className="md:w-1/3 flex flex-col gap-4 items-start">
              <h4 className="text-sm font-semibold text-richblack-50">Support</h4>
              <ul className="flex flex-col gap-2 mb-2">
                {support.map((l) => (
                  <li key={l.title}>
                    <Link to={l.to} className="text-sm text-richblack-300 hover:text-white transition">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Warm accent line */}
              <div
                className="w-full max-w-[160px] h-1 rounded-full"
                style={{ background: "linear-gradient(90deg,#FDE68A,#FB7185)" }}
                aria-hidden
              />
            </div>
          </div>

          {/* bottom row */}
          <div className="mt-8 pt-6 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-richblack-300">
              <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
              <span className="text-richblack-600">•</span>
              <Link to="/terms" className="hover:text-white transition">Terms</Link>
            </div>

            <div className="text-sm text-richblack-300">
              Made with <span aria-hidden className="text-pink-400">♥</span> by Ashwin © {new Date().getFullYear()} StudyNotion
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
