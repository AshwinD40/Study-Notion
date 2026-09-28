import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Courses",
      links: [
        { name: "All Courses", path: "/courses" },
        { name: "Web Development", path: "/courses?category=web-dev" },
        { name: "Cloud Computing", path: "/courses?category=cloud-computing" },
        { name: "Data Science", path: "/courses?category=data-science" },
        { name: "Artificial Intelligence", path: "/courses?category=artificial-intelligence" },
        { name: "Cybersecurity", path: "/courses?category=cybersecurity" },
      ],
    },
    {
      title: "Students",
      links: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Enrolled Courses", path: "/dashboard/enrolled-courses" },
        { name: "My Profile", path: "/dashboard/my-profile" },
        { name: "Cart", path: "/dashboard/cart" },
      ],
    },
    {
      title: "Instructors",
      links: [
        { name: "Teach on StudyNotion", path: "/signup" },
        { name: "Instructor Dashboard", path: "/dashboard/instructor" },
        { name: "Create Course", path: "/dashboard/add-course" },
        { name: "My Courses", path: "/dashboard/my-courses" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Settings", path: "/dashboard/settings" },
      ],
    },
  ];

  return (
    <footer
      className="relative w-full overflow-hidden bg-richblack-900 text-richblack-50 pt-16 sm:pt-20 pb-14 sm:pb-8 border-t border-richblack-800/80"
      role="contentinfo"
    >
      {/* Subtle Warm Brand Ambient Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[220px] w-[650px] rounded-full bg-gradient-to-b from-yellow-500/5 via-cyan-500/5 to-transparent blur-[120px] -z-10" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-11/12 max-w-[1240px]">
        {/* Top Grid: 4 Live Navigation Columns + 1 Action Column */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
          {footerSections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="text-xs font-semibold text-richblack-400 mb-4 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="flex flex-col space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      className="text-sm font-medium text-richblack-100 hover:text-yellow-50 transition duration-150 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex flex-col items-start pt-2 lg:pt-0">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-full bg-yellow-50 px-6 py-2.5 text-sm font-semibold text-richblack-900 shadow-md shadow-yellow-500/10 hover:bg-yellow-100 hover:scale-[1.02] active:scale-95 transition text-center"
            >
              Explore Courses
            </Link>

            <Link
              to="/dashboard"
              className="mt-3 inline-flex items-center justify-center rounded-full border border-richblack-700 bg-richblack-800/50 px-6 py-2 text-sm font-medium text-richblack-200 hover:border-yellow-50/40 hover:text-yellow-50 active:scale-95 transition text-center"
            >
              Go to dashboard
            </Link>

            <p className="mt-4 text-xs text-richblack-400 leading-relaxed max-w-[210px]">
              © {new Date().getFullYear()} StudyNotion. All rights reserved.
            </p>
          </div>
        </div>

      </div>

      <div className="pointer-events-none absolute -bottom-6 sm:-bottom-10 md:-bottom-10 left-0 right-0 w-full overflow-hidden select-none flex justify-center items-end leading-none z-0">
        <span className="text-[13vw] font-black tracking-tight text-white/10 select-none whitespace-nowrap">
          studynotion
        </span>
      </div>
    </footer>
  );
};

export default Footer;
