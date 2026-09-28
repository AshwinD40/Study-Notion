import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import {
  VscHome,
  VscBook,
  VscInfo,
  VscMail,
  VscDashboard,
  VscSignOut,
  VscChevronRight,
} from "react-icons/vsc";
import { useSelector, useDispatch } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../api/client";
import { categories } from "../api/endpoints";
import ProfileDropdown from "../../features/auth/components/ProfileDropDown";
import { logout } from "../../features/auth/api/auth.api";
import ConfirmationModal from "./ConfirmationModal";

const navIcons = {
  Home: <VscHome className="text-lg" />,
  Catalog: <VscBook className="text-lg" />,
  "About Us": <VscInfo className="text-lg" />,
  "Contact Us": <VscMail className="text-lg" />,
};

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user } = useSelector((state) => state.auth);
  const totalItems = useSelector((state) => state.cart?.totalItems ?? 0);

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const panelRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        if (mounted) setSubLinks(res.data?.data || []);
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const matchRoute = (route) => !!matchPath({ path: route }, location.pathname);

  // Close menu on ESC key or clicking outside
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointerDown(e) {
      if (!menuOpen) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !menuButtonRef.current?.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const onLogoutClick = () => {
    setConfirmationModal({
      text1: "Confirm Logout",
      text2: "Are you sure you want to logout?",
      btn1Text: "Logout",
      btn2Text: "Cancel",
      btn1Handler: () => {
        dispatch(logout(navigate));
        setConfirmationModal(null);
        setMenuOpen(false);
      },
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 z-40 flex h-14 w-full items-center justify-center border-b border-white/10 bg-richblack-900/80 backdrop-blur-md transition-all duration-200">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="StudyNotion Logo" width={150} height={32} loading="lazy" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Courses" || link.title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1.5 transition ${
                        matchRoute("/courses") ||
                        matchRoute("/courses/*") ||
                        matchRoute("/catalog") ||
                        matchRoute("/catalog/*")
                          ? "text-yellow-50 font-semibold"
                          : "text-richblack-25 hover:text-white"
                      }`}
                    >
                      <Link to="/courses" className="hover:text-yellow-50 transition">
                        Courses
                      </Link>
                      <BsChevronDown className="text-xs transition-transform group-hover:rotate-180" />
                      <div
                        className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[250px] translate-x-[-50%] translate-y-[3em] flex-col rounded-xl border border-white/10 bg-richblack-800 p-2.5 text-richblack-50 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[280px]"
                        aria-hidden
                      >
                        <div className="absolute left-[50%] top-0 -z-10 h-4 w-4 translate-x-[-50%] translate-y-[-50%] rotate-45 rounded bg-richblack-800 border-l border-t border-white/10" />
                        <Link
                          to="/courses"
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-yellow-50 hover:bg-white/10 transition flex items-center justify-between border-b border-white/5 mb-1"
                        >
                          <span>All Courses</span>
                          <span className="text-[11px] text-richblack-400 font-normal">View all &rarr;</span>
                        </Link>
                        {loading ? (
                          <p className="text-center text-xs text-richblack-300 py-2">Loading...</p>
                        ) : subLinks.length ? (
                          subLinks
                            .filter((s) => s?.courses?.length > 0)
                            .map((s, i) => (
                              <Link
                                key={s._id ?? i}
                                to={`/courses?category=${s.name.split(" ").join("-").toLowerCase()}`}
                                className="rounded-lg px-3 py-2 text-sm text-richblack-100 hover:bg-white/10 hover:text-yellow-50 transition"
                              >
                                {s.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-center text-xs text-richblack-300 py-2">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link.path}>
                      <p
                        className={`transition ${
                          matchRoute(link.path) ? "text-yellow-50 font-semibold" : "text-richblack-25 hover:text-white"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Auth / Profile Actions */}
          <div className="hidden md:flex items-center gap-x-4">
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative p-1.5 text-richblack-100 hover:text-white transition">
                <AiOutlineShoppingCart className="text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-yellow-50 text-xs font-bold text-richblack-900 shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token == null ? (
              <div className="flex items-center gap-x-3">
                <Link to="/login">
                  <button className="rounded-xl border border-white/20 bg-transparent px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-xl bg-yellow-50 px-4 py-1.5 text-sm font-semibold text-richblack-900 shadow-sm hover:bg-yellow-100 transition">
                    Sign up
                  </button>
                </Link>
              </div>
            ) : (
              <ProfileDropdown />
            )}
          </div>

          {/* Mobile Right Bar (Cart + Hamburger) */}
          <div className="flex md:hidden items-center gap-3">
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative p-1 text-richblack-100 hover:text-white transition" aria-label="Cart">
                <AiOutlineShoppingCart className="text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-yellow-50 text-[10px] font-bold text-richblack-900">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-richblack-800/80 text-richblack-50 hover:bg-richblack-700 transition active:scale-95"
            >
              {menuOpen ? <AiOutlineClose className="text-xl" /> : <AiOutlineMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      />

      {/* Modern Slide-over Drawer */}
      <aside
        id="site-menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[320px] flex-col justify-between border-l border-white/10 bg-richblack-900/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4 bg-richblack-800/40">
          {token && user ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName || "User"}`}
                alt={user?.firstName || "Profile"}
                className="h-10 w-10 rounded-full border border-yellow-50/40 object-cover flex-shrink-0"
              />
              <div className="flex flex-col overflow-hidden text-left">
                <p className="truncate text-sm font-semibold text-richblack-25">
                  {user?.firstName} {user?.lastName}
                </p>
                <span className="text-[11px] font-medium text-yellow-50">
                  {user?.accountType || "Student"}
                </span>
              </div>
            </div>
          ) : (
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <img src={logo} alt="StudyNotion" className="h-7 w-auto object-contain" />
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-richblack-200 hover:bg-white/10 hover:text-white transition active:scale-95"
          >
            <AiOutlineClose className="text-lg" />
          </button>
        </div>

        {/* Drawer Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-richblack-400">
              Menu
            </p>

            {NavbarLinks.map((item, idx) => {
              if (item.title === "Courses" || item.title === "Catalog") {
                return (
                  <div key={idx} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setCatalogOpen((prev) => !prev)}
                      aria-expanded={catalogOpen}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                        catalogOpen ||
                        matchRoute("/courses") ||
                        matchRoute("/courses/*") ||
                        matchRoute("/catalog/*")
                          ? "bg-white/10 text-yellow-50 font-semibold"
                          : "text-richblack-100 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <VscBook className="text-lg text-yellow-50" />
                        <span>Courses</span>
                      </div>
                      <BsChevronDown
                        className={`text-xs transition-transform duration-200 ${
                          catalogOpen ? "rotate-180 text-yellow-50" : "text-richblack-400"
                        }`}
                      />
                    </button>

                    {catalogOpen && (
                      <div className="my-1 ml-5 space-y-1 border-l-2 border-white/10 py-1 pl-4 pr-1">
                        <Link
                          to="/courses"
                          onClick={() => {
                            setMenuOpen(false);
                            setCatalogOpen(false);
                          }}
                          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-yellow-50 hover:bg-white/5 transition"
                        >
                          <span>All Courses</span>
                          <VscChevronRight className="text-[10px] opacity-60" />
                        </Link>
                        {loading ? (
                          <p className="px-2 py-1.5 text-xs text-richblack-400">Loading categories...</p>
                        ) : subLinks.length ? (
                          subLinks
                            .filter((c) => c.courses && c.courses.length > 0)
                            .map((c) => (
                              <Link
                                key={c._id ?? c.name}
                                to={`/courses?category=${c.name.split(" ").join("-").toLowerCase()}`}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setCatalogOpen(false);
                                }}
                                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-richblack-200 hover:bg-white/5 hover:text-yellow-50 transition"
                              >
                                <span>{c.name}</span>
                                <VscChevronRight className="text-[10px] opacity-60" />
                              </Link>
                            ))
                        ) : (
                          <p className="px-2 py-1.5 text-xs text-richblack-400">No courses found</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = matchRoute(item.path);
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "border-l-2 border-yellow-50 bg-yellow-50/10 font-semibold text-yellow-50"
                      : "text-richblack-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={isActive ? "text-yellow-50" : "text-richblack-400"}>
                    {navIcons[item.title] || <VscHome className="text-lg" />}
                  </span>
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Cart item shortcut */}
          {user && user?.accountType !== "Instructor" && (
            <div className="border-t border-white/10 pt-3">
              <Link
                to="/dashboard/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-richblack-100 hover:bg-white/5 hover:text-white transition"
              >
                <div className="flex items-center gap-3">
                  <AiOutlineShoppingCart className="text-lg text-yellow-50" />
                  <span>My Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-bold text-richblack-900">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-white/10 bg-richblack-800/50 p-4 space-y-2.5">
          {token ? (
            <>
              <Link
                to={user?.accountType === "Instructor" ? "/dashboard/instructor" : "/dashboard/enrolled-courses"}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-50 py-2.5 text-sm font-semibold text-richblack-900 shadow-md hover:bg-yellow-100 transition active:scale-[0.98]"
              >
                <VscDashboard className="text-lg" />
                <span>Go to Dashboard</span>
              </Link>

              <button
                onClick={onLogoutClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition active:scale-[0.98]"
              >
                <VscSignOut className="text-lg" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-xl bg-yellow-50 py-2.5 text-center text-sm font-semibold text-richblack-900 shadow-md hover:bg-yellow-100 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default Navbar;
