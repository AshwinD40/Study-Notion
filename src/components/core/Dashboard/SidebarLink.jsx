import React from "react";
import * as Icons from "react-icons/vsc";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { resetCourseState } from "../../../slices/courseSlice";
import { useDispatch } from "react-redux";

export default function SidebarLink({ link, iconName, showLabel = false }) {
  const Icon = iconName && Icons[iconName] ? Icons[iconName] : null;
  const location = useLocation();
  const dispatch = useDispatch();

  const matchRoute = (route) => !!matchPath({ path: route }, location.pathname);
  const isActive = matchRoute(link.path);

  const handleClick = () => {
    try { dispatch(resetCourseState()); } catch {}
  };

  if (showLabel) {
    return (
      <NavLink
        to={link.path}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-2 rounded-lg px-3 py-2
          transition-all duration-150 select-none text-white/90
          backdrop-blur-xl border
          ${isActive
            ? "bg-white/20 border-white/40 shadow-[0_4px_12px_rgba(255,255,255,0.12)] text-white"
            : "bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20"
          }
        `}
        style={{
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* icon */}
        <span
          className={`
            w-7 h-7 flex items-center justify-center rounded-md
            ${isActive ? "bg-white/25" : "bg-white/10"}
          `}
        >
          {Icon && (
            <Icon className={`text-base ${isActive ? "text-white" : "text-white/75"}`} />
          )}
        </span>

        {/* label */}
        <span className="text-[13px] font-medium leading-none">
          {link.name}
        </span>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      title={link.name}
      aria-label={link.name}
      className={`
        group relative flex items-center gap-x-3 transition-all duration-180
        rounded-md select-none
        px-0 py-1.5
        w-12 h-12 justify-center
        md:w-auto md:h-auto md:justify-start md:px-3 md:py-2
        ${isActive ? "bg-yellow-800 text-yellow-50" : "text-richblack-300"}
      `}
    >
      {/* Desktop accent bar (unchanged) */}
      <span
        className={`
          hidden md:block absolute left-0 top-1/2 -translate-y-1/2
          h-8 w-[0.15rem] bg-yellow-50 rounded
          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* icon */}
      <span className="flex items-center justify-center flex-shrink-0 rounded-md w-10 h-10 md:w-8 md:h-8">
        {Icon && (
          <Icon
            className={`text-lg md:text-base ${isActive ? "text-yellow-50" : "text-richblack-100"}`}
          />
        )}
      </span>

      {/* label (Desktop only) */}
      <span className="hidden md:inline-block truncate text-sm">
        {link.name}
      </span>
    </NavLink>
  );
}
