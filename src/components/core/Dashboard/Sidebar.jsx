import React, { useEffect, useRef, useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSignOut, VscChevronRight, VscChevronLeft } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

export default function Sidebar() {
  // hooks (always at top)
  const { user, loading: profileLoading } = useSelector((s) => s.profile ?? {});
  const { loading: authLoading } = useSelector((s) => s.auth ?? {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [open, setOpen] = useState(false); // mobile panel open/closed

  const panelRef = useRef(null);
  const arrowRef = useRef(null);

  // close on outside click or ESC
  useEffect(() => {
    function onPointer(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target) && !arrowRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // early return after hooks
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner" />
      </div>
    );
  }

  const askLogout = () =>
    setConfirmationModal({
      text1: "Confirm Logout",
      text2: "Are you sure you want to logout?",
      btn1Text: "Logout",
      btn2Text: "Cancel",
      btn1Handler: () => {
        dispatch(logout(navigate));
        setConfirmationModal(null);
        setOpen(false);
      },
      btn2Handler: () => setConfirmationModal(null),
    });

  return (
    <>
      <aside
        aria-label="Dashboard sidebar"
        className="hidden md:flex flex-col min-w-[220px] border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10 px-4"
      >
        <div className="flex flex-col gap-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
          })}
        </div>

        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className="flex flex-col gap-2">
          <SidebarLink link={{ name: "Settings", path: "/dashboard/settings" }} iconName="VscSettingsGear" />

          <button
            onClick={askLogout}
            className="text-sm font-medium text-richblack-300 text-left"
            aria-label="Logout"
          >
            <div className="flex ml-8 items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}  
      <div className="md:hidden">
        <button
          ref={arrowRef}
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="mobile-sidebar-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          className="fixed left-0 top-20 z-50 -ml-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/20 border border-white/8 backdrop-blur-md shadow-md transition-transform duration-200 hover:scale-105"
        >
          <span className={`text-white text-lg transition-transform duration-200 ${open ? "rotate-270" : "rotate-0"}`}>
            {open ? <VscChevronLeft /> : <VscChevronRight />}
          </span>
        </button>

        <div
          id="mobile-sidebar-panel"
          ref={panelRef}
          className={`fixed left-0 top-0 z-40 h-full p-4 pt-20
                      transform transition-transform duration-220
                      ${open ? "translate-x-0" : "-translate-x-full"}
                      w-[min(86vw,300px)]`}
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px) saturate(120%)",
            WebkitBackdropFilter: "blur(10px) saturate(120%)",
            boxShadow: "0 14px 40px rgba(2,6,23,0.6)",
          }}
        >
          {/* Header inside panel (optional simple) */}
          <div className="mb-4 px-1 text-center">
            <div className="text-lg font-semibold text-richblack-5">Menu</div>
          </div>

          <nav className="flex flex-col gap-2 overflow-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;
              return (
                <div key={link.id} onClick={() => setOpen(false)} className="px-1">
                  <SidebarLink link={link} iconName={link.icon} showLabel={true} />
                </div>
              );
            })}
          </nav>

          <div className="mt-6 h-px w-full bg-white/10" />

          <div className="mt-4 flex flex-col gap-3 px-1">
            <div onClick={() => setOpen(false)}>
              <SidebarLink link={{ name: "Settings", path: "/dashboard/settings" }} iconName="VscSettingsGear" showLabel={true} />
            </div>

            <button
              onClick={() => {
                askLogout();
                setOpen(false);
              }}
              style={{ background: "linear-gradient(90deg,#ef4444,#dc2626)", boxShadow: "0 8px 20px rgba(220,38,38,0.12)" }}
              className="w-full flex items-center gap-3 rounded-md px-4 py-2 bg-white/30 text-white font-semibold hover:bg-white/40 transition"
            >
              <VscSignOut className="text-lg" />
              Logout
            </button>
          </div>
        </div>

        {/* backdrop (closes on click) */}
        <div
          className={`fixed inset-0 z-30 bg-black/30 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />
      </div>

      {/* confirmation modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
