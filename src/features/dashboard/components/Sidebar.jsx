import React, { useEffect, useRef, useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { logout } from "../../auth/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  VscSignOut,
  VscLayoutSidebarLeft,
  VscClose,
} from "react-icons/vsc";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";

export default function Sidebar() {
  const { user, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const panelRef = useRef(null);

  // Close mobile drawer on outside click or ESC
  useEffect(() => {
    function onPointer(e) {
      if (!mobileOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Lock body scroll on mobile drawer open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  if (loading) {
    return (
      <aside className="hidden md:flex w-[240px] min-h-[calc(100vh-3.5rem)] items-center justify-center border-r border-white/10 bg-richblack-900">
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
        setMobileOpen(false);
      },
      btn2Handler: () => setConfirmationModal(null),
    });

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (CLEAN SHADCN PATTERN WITH ICONS & NAMES) */}
      {/* ========================================================================= */}
      <aside
        aria-label="Dashboard sidebar"
        className="hidden md:flex fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-[240px] flex-col justify-between border-r border-white/10 bg-richblack-900 p-4 z-30 select-none"
      >
        {/* Navigation Sections */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-1">
          {/* Workspace Links */}
          <div className="space-y-1">
            <p className="px-3 py-1 text-[11px] font-semibold text-richblack-400 uppercase tracking-wider">
              Workspace
            </p>
            <div className="space-y-1">
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
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-1 pt-3 border-t border-white/10">
            <p className="px-3 py-1 text-[11px] font-semibold text-richblack-400 uppercase tracking-wider">
              Preferences
            </p>
            <SidebarLink
              link={{ name: "Settings", path: "/dashboard/settings" }}
              iconName="VscSettingsGear"
            />
          </div>
        </div>

        {/* Bottom: Clean Logout Action */}
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={askLogout}
            aria-label="Log out"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-richblack-200 hover:text-red-400 hover:bg-red-500/10 transition active:scale-[0.98]"
          >
            <VscSignOut className="text-base shrink-0 text-richblack-300" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE STICKY SUB-BAR (INTEGRATED, ZERO OVERLAP) */}
      {/* ========================================================================= */}
      <div className="md:hidden">
        {/* Clean Sticky Sub-Header Bar */}
        <div className="fixed top-14 left-0 right-0 z-20 flex h-11 items-center justify-between border-b border-white/10 bg-richblack-900/95 backdrop-blur-md px-4">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar menu"
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-richblack-100 hover:bg-white/10 hover:text-white transition active:scale-95"
          >
            <VscLayoutSidebarLeft className="text-sm text-yellow-50" />
            <span>Menu</span>
          </button>

          <span className="text-xs font-medium text-richblack-400">
            Dashboard
          </span>
        </div>

        {/* Mobile Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden={!mobileOpen}
        />

        {/* Mobile Compact Left Sheet Drawer */}
        <div
          id="mobile-sidebar-panel"
          ref={panelRef}
          className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col justify-between border-r border-white/10 bg-richblack-900 p-5 shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <span className="text-sm font-semibold text-white">Dashboard</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-richblack-300 hover:bg-white/10 hover:text-white transition"
              >
                <VscClose className="text-base" />
              </button>
            </div>

            {/* Links List */}
            <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-180px)]">
              <div className="space-y-1">
                <p className="px-3 py-1 text-[11px] font-semibold text-richblack-400 uppercase tracking-wider">
                  Workspace
                </p>
                <div className="space-y-1">
                  {sidebarLinks.map((link) => {
                    if (link.type && user?.accountType !== link.type) return null;
                    return (
                      <SidebarLink
                        key={link.id}
                        link={link}
                        iconName={link.icon}
                        onClick={() => setMobileOpen(false)}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1 pt-3 border-t border-white/10">
                <p className="px-3 py-1 text-[11px] font-semibold text-richblack-400 uppercase tracking-wider">
                  Preferences
                </p>
                <SidebarLink
                  link={{ name: "Settings", path: "/dashboard/settings" }}
                  iconName="VscSettingsGear"
                  onClick={() => setMobileOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Bottom Logout */}
          <div className="border-t border-white/10 pt-3">
            <button
              onClick={askLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-richblack-200 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <VscSignOut className="text-base shrink-0 text-richblack-300" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
