import React from "react";
import * as Icons from "react-icons/vsc";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { resetCourseState } from "../../courses/store/course.slice";
import { useDispatch } from "react-redux";

export default function SidebarLink({ link, iconName, onClick }) {
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
    if (onClick) onClick();
  };

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      aria-label={link.name}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors select-none ${
        isActive
          ? "bg-white/10 text-white font-medium shadow-sm"
          : "text-richblack-200 hover:bg-white/5 hover:text-richblack-50"
      }`}
    >
      {Icon && (
        <Icon
          className={`text-base shrink-0 transition-colors ${
            isActive ? "text-yellow-50" : "text-richblack-300 group-hover:text-richblack-50"
          }`}
        />
      )}
      <span className="truncate">{link.name}</span>
    </NavLink>
  );
}
