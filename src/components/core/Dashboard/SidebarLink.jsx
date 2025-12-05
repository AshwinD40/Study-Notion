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
    try {
      dispatch(resetCourseState());
    } catch {
      // ignore
    }
  };

  // FULL LABEL VARIANT (mobile sheet / glass list)
  if (showLabel) {
    return (
      <NavLink
        to={link.path}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5
          text-[12px] leading-none select-none
          transition-all duration-150 text-white/90
          border backdrop-blur-xl
          ${
            isActive
              ? "bg-white/20 border-white/40 shadow-[0_3px_10px_rgba(255,255,255,0.18)]"
              : "bg-white/8 border-white/10 hover:bg-white/14 hover:border-white/25"
          }
        `}
        style={{ WebkitBackdropFilter: "blur(10px)" }}
      >
        {/* icon bubble */}
        <span
          className={`
            w-7 h-7 flex items-center justify-center rounded-md flex-shrink-0
            ${isActive ? "bg-white/28" : "bg-white/10"}
          `}
        >
          {Icon && (
            <Icon
              className={`text-[13px] ${
                isActive ? "text-white" : "text-white/80"
              }`}
            />
          )}
        </span>

        {/* label */}
        <span className="truncate font-medium">
          {link.name}
        </span>
      </NavLink>
    );
  }


  // DEFAULT VARIANT (desktop sidebar)
  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      title={link.name}
      aria-label={link.name}
      className={`
        group relative flex items-center gap-x-3 
        rounded-xl px-3 py-2
        transition-all duration-150 select-none
        ${
          isActive
            ? "bg-white/14 text-white shadow-[0_6px_20px_rgba(15,23,42,0.6)]"
            : "text-white/70 hover:bg-white/8 hover:text-white"
        }
      `}
    >
      {/* left accent bar */}
      <span
        className={`
          hidden md:block absolute left-0 top-1/2 -translate-y-1/2
          h-7 w-[3px] rounded-full
          bg-gradient-to-b from-yellow-200 to-yellow-400
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}
          transition-opacity duration-150
        `}
      />

      {/* icon */}
      <span className="flex items-center justify-center flex-shrink-0 rounded-lg w-8 h-8 bg-white/5">
        {Icon && (
          <Icon
            className={`text-base ${
              isActive ? "text-yellow-100" : "text-white/80"
            }`}
          />
        )}
      </span>

      {/* label (desktop only) */}
      <span className="hidden md:inline-block truncate text-sm font-medium">
        {link.name}
      </span>
    </NavLink>
  );
}
