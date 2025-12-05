import React, { useEffect, useRef, useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSignOut, VscChevronRight, VscChevronLeft } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector((s) => s.profile ?? {});
  const { loading: authLoading } = useSelector((s) => s.auth ?? {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);
  const arrowRef = useRef(null);

  // close mobile panel on outside click / ESC
  useEffect(() => {
    function onPointer(e) {
      if (!open) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !arrowRef.current?.contains(e.target)
      ) {
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

  if (profileLoading || authLoading) {
    return (
      <aside className="hidden md:flex min-w-[240px] items-center justify-center border-r border-richblack-700 bg-richblack-900">
        <div className="spinner" />
      </aside>
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
      {/* DESKTOP / LAPTOP SIDEBAR */}
      <aside
        aria-label="Dashboard sidebar"
        className=" hidden md:flex  fixed left-0  top-16 w-[240px] h-[calc(100vh-4rem)] flex-col  bg-white/10  backdrop-blur-xl  border-r border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.8)] px-4 py-6 z-30"
      >
        {/* scrollable links */}
        <div className="flex-1 overflow-y-auto pr-1">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink
                key={link.id}
                link={link}
                iconName={link.icon}
              />
            );
          })}

          <div className="mt-6 mb-4 h-px w-11/12 bg-white/10 mx-auto" />

          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
        </div>

        {/* logout at bottom */}
        <div className="pt-4 border-t border-white/10 mt-2">
          <button
            onClick={askLogout}
            aria-label="Logout"
            className="
              w-full flex items-center justify-center gap-2
              px-3 py-2 rounded-lg
              text-[13px] font-semibold tracking-wide
              bg-gradient-to-r from-red-500/70 to-red-600/70
              text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)]
              border border-red-400/30
              hover:brightness-110 active:scale-[0.97]
              transition-all
            "
          >
            <VscSignOut className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden">
        {/* toggle button */}
        <button
          ref={arrowRef}
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="mobile-sidebar-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          className="fixed left-0 top-20 z-50 w-8 h-8  rounded-full  flex items-center justify-center  bg-white/20  border border-white/20  backdrop-blur-md  shadow-md transition-transform duration-200 hover:scale-105"
        >
          <span className="text-white text-base leading-none  ">
            {open ? <VscChevronLeft /> : <VscChevronRight />}
          </span>
        </button>

        {/* slide-out panel */}
        <div
          id="mobile-sidebar-panel"
          ref={panelRef}
          className={`
            fixed left-0 top-0 z-40 
            h-full 
            p-3 pt-16
            transform transition-transform duration-200
            ${open ? "translate-x-0" : "-translate-x-full"}
            w-[min(80vw,260px)]
          `}
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
            borderRight: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(14px) saturate(130%)",
            WebkitBackdropFilter: "blur(14px) saturate(130%)",
            boxShadow: "0 18px 50px rgba(2,6,23,0.8)",
          }}
        >
          <div className="mb-4 px-1 text-center">
            <div className="text-sm uppercase tracking-[0.2em] text-white/60">
              Dashboard
            </div>
            <div className="text-lg font-semibold text-white">Menu</div>
          </div>

          <nav
            className="flex flex-col gap-2 overflow-auto"
            style={{ maxHeight: "calc(100vh - 260px)" }}
          >
            {sidebarLinks.map((link) => {
              if (link.type && user?.accountType !== link.type) return null;
              return (
                <div
                  key={link.id}
                  onClick={() => setOpen(false)}
                  className="px-1"
                >
                  <SidebarLink
                    link={link}
                    iconName={link.icon}
                    showLabel={true}
                  />
                </div>
              );
            })}

            <div className="mt-4 h-px w-full bg-white/15" />

            <div onClick={() => setOpen(false)} className="px-1 mt-2">
              <SidebarLink
                link={{ name: "Settings", path: "/dashboard/settings" }}
                iconName="VscSettingsGear"
                showLabel={true}
              />
            </div>
          </nav>

          <div className="mt-5 flex flex-col gap-3 px-1">
            <button
              onClick={() => {
                askLogout();
                setOpen(false);
              }}
              className=" w-full  flex items-center gap-3  rounded-xl  px-4 py-2.5  text-sm font-semibold  text-white  bg-gradient-to-r from-red-500 to-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.45)] hover:brightness-110 transition "
            >
              <VscSignOut className="text-lg" />
              Logout
            </button>
          </div>
        </div>

        {/* backdrop */}
        <div
          className={`
            fixed inset-0 z-30 
            bg-black/40 
            transition-opacity
            ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
