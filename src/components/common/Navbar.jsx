import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { useSelector, useDispatch } from "react-redux";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { logout } from "../../services/operations/authAPI";
import ConfirmationModal from "../common/ConfirmationModal";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth?.token ?? null);
  const user = useSelector((state) => state.profile?.user ?? null);
  const totalItems = useSelector((state) => state.cart?.totalItems ?? 0);

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  // popup state + confirm modal
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const panelRef = useRef(null);
  const firstFocusableRef = useRef(null); // focus after open
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

  // close on outside pointerdown or Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointerDown(e) {
      if (!menuOpen) return;
      // if click/pointer is outside panel and outside menu button, close
      if (panelRef.current && !panelRef.current.contains(e.target) && !menuButtonRef.current?.contains(e.target)) {
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

  // manage body overflow & focus
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) {
      setTimeout(() => firstFocusableRef.current?.focus(), 70);
    }
    return () => {
      document.body.style.overflow = prev;
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

  const userDisplayName = () => user?.name || user?.fullName || user?.firstName || "";
  const userInitials = () => {
    const name = userDisplayName();
    if (!name) return "U";
    return name
      .split(" ")
      .map((p) => p?.[0] ?? "")
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div className="flex h-14 items-center justify-center transition-all duration-200 fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/20">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
          </Link>

          {/* Links */}
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div
                        className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[220px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                        aria-hidden
                      >
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          subLinks.filter((s) => s?.courses?.length > 0).map((s, i) => (
                            <Link key={s._id ?? i} to={`/catalog/${s.name.split(" ").join("-").toLowerCase()}`} className="rounded-lg bg-transparent py-2 pl-2 hover:bg-richblack-50 text-sm">
                              {s.name}
                            </Link>
                          ))
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link.path}>
                      <p className={`${matchRoute(link.path) ? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile */}
          <div className="hidden md:flex items-center gap-x-4">
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-yellow-300 text-xs font-bold text-richblack-900">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token == null ? (
              <>
                <Link to="/login">
                  <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileDropdown />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative mr-2">
                <AiOutlineShoppingCart className="text-xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-yellow-500 text-[10px] font-bold text-richblack-900">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <button
              ref={menuButtonRef}
              onPointerDown={(e) => {
                // stop pointer from bubbling to document handler
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="site-menu-panel"
              className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${menuOpen ? "bg-richblack-800/60" : "hover:bg-richblack-800/50"}`}
              title={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className={`transition-transform duration-300 text-richblack-50 ${menuOpen ? "rotate-90 scale-110" : "rotate-0"}`}>
                {menuOpen ? <AiOutlineClose className="text-2xl" /> : <AiOutlineMenu className="text-2xl" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} aria-hidden={!menuOpen} />

      <div
        id="site-menu-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-menu-title"
        className={`fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl p-5 transition-transform duration-180 md:hidden ${menuOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}`}
        // lighter glass styles:
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px) saturate(110%)",
          WebkitBackdropFilter: "blur(10px) saturate(110%)",
          boxShadow: "0 8px 30px rgba(2,6,23,0.45)",
        }}
        onPointerDown={(e) => {
          // prevent outer pointerdown handler from closing when interacting inside
          e.stopPropagation();
        }}
      >
        {/* header */}
        <div className="relative mb-6 w-full flex justify-between items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 max-w-[85%]">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg,#FDE68A,#FB7185)",
                color: "#0b1220",
              }}
            >
              {token ? userInitials() : "SN"}
            </div>

            <h3 id="site-menu-title" className="text-lg font-semibold text-richblack-5 break-words">
              {token ? userDisplayName() || "User" : "StudyNotion"}
            </h3>
          </div>

          {/* Close button */}
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-md px-3 py-1.5 text-richblack-100 bg-richblack-700 text-sm hover:bg-richblack-800/30 transition">
            Close
          </button>
        </div>

        {/* Body */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Explore */}
          <div className="w-full flex flex-col items-center">
            <h4 className="mb-3 text-sm font-medium text-richblack-200">Explore</h4>

            <ul className="flex flex-col gap-3 items-center w-full">
              {NavbarLinks.map((item, idx) => {
                if (item.title === "Catalog") {
                  return (
                    <li key={idx} className="w-full flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setCatalogOpen((s) => !s)}
                        aria-expanded={catalogOpen}
                        aria-controls="catalog-accordion"
                        title="Toggle categories"
                        className="mb-2 flex w-full items-center justify-center max-w-[320px] gap-3 rounded-md px-3 py-2 hover:bg-richblack-800/40 transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <span className="text-sm font-semibold text-richblack-100">Catalog</span>

                        <BsChevronDown className={`transform transition-transform ${catalogOpen ? "rotate-180" : "rotate-0"} text-richblack-200`} aria-hidden="true" />
                      </button>

                      <div id="catalog-accordion" className={`space-y-2 w-full flex flex-col items-center ${catalogOpen ? "" : "hidden"}`}>
                        {loading ? (
                          <div className="text-xs text-richblack-400 px-1">Loading categories...</div>
                        ) : subLinks.length ? (
                          subLinks
                            .filter((c) => c.courses && c.courses.length > 0)
                            .map((c, i) => (
                              <Link
                                key={c._id ?? c.name}
                                to={`/catalog/${c.name.split(" ").join("-").toLowerCase()}`}
                                onClick={() => {
                                  setMenuOpen(false);
                                  setCatalogOpen(false);
                                  setSelectedCat(c.name);
                                }}
                                className="block w-full max-w-[320px] text-center rounded-lg px-4 py-3 text-sm text-richblack-25 hover:bg-richblack-700 transition"
                                ref={i === 0 ? firstFocusableRef : null}
                                style={{
                                  background: "rgba(11,15,20,0.55)",
                                  border: "1px solid rgba(255,255,255,0.03)",
                                  backdropFilter: "blur(4px)",
                                }}
                              >
                                {c.name}
                              </Link>
                            ))
                        ) : (
                          <div className="text-xs text-richblack-400 px-1">No courses found</div>
                        )}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={idx} className="w-full flex justify-center">
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full max-w-[320px] text-center rounded-lg px-4 py-3 text-sm font-medium transition ${matchRoute(item.path) ? "bg-yellow-900 text-yellow-50" : "bg-richblack-800 text-richblack-25 hover:bg-richblack-700"}`}
                      style={{
                        background: "rgba(11,15,20,0.55)",
                        border: "1px solid rgba(255,255,255,0.03)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Account */}
          <div className="w-full flex flex-col items-center gap-3">
            <h4 className="mb-3 text-sm font-medium text-richblack-200">Account</h4>

            {!token ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full flex justify-center">
                  <button ref={firstFocusableRef} className="w-full max-w-[320px] rounded-lg px-4 py-3 text-sm font-semibold text-richblack-900 transition" style={{ background: "linear-gradient(90deg,#FFD54A,#FB7185)", boxShadow: "0 8px 20px rgba(251,113,133,0.12)" }}>
                    Log in
                  </button>
                </Link>

                <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full flex justify-center">
                  <button className="w-full max-w-[320px] rounded-lg px-4 py-3 text-sm font-semibold text-richblack-25 transition" style={{ background: "rgba(11,15,20,0.55)", border: "1px solid rgba(255,255,255,0.03)", backdropFilter: "blur(4px)" }}>
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/my-profile" onClick={() => setMenuOpen(false)} className="w-full flex justify-center ">
                  <button className="w-full max-w-[320px] rounded-lg px-4 py-3 text-sm font-semibold text-richblack-25 transition flex items-center gap-2 justify-center" style={{ background: "rgba(11,15,20,0.55)", border: "1px solid rgba(255,255,255,0.03)", backdropFilter: "blur(4px)" }}>
                    <VscAccount /> My Profile
                  </button>
                </Link>
                <div className="w-full flex justify-center">
                  <button onClick={onLogoutClick} className="w-full max-w-[320px] rounded-lg px-4 py-3 text-sm font-semibold text-white transition" style={{ background: "linear-gradient(90deg,#ef4444,#dc2626)", boxShadow: "0 8px 20px rgba(220,38,38,0.12)" }}>
                    Logout
                  </button>
                </div>
              </>
            )}

            <div className="mt-6 text-xs text-richblack-400 text-center">
              <p>
                Need help?{" "}
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-yellow-300">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default Navbar;
