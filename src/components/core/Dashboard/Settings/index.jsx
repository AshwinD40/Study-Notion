import React from "react";
import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteProfile from "./DeleteProfile";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 px-3 sm:px-0">

      {/* Title */}
      <div className="mb-6">
        <h1 className="
          text-3xl font-semibold 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-white to-gray-300
        ">
          Settings
        </h1>

        <p className="text-sm text-white/50 mt-1">
          Manage your account details and preferences
        </p>
      </div>

      {/* Sections */}
      <GlassItem><ChangeProfilePicture /></GlassItem>
      <GlassItem><EditProfile /></GlassItem>
      <GlassItem><UpdatePassword /></GlassItem>
      <GlassItem danger><DeleteProfile /></GlassItem>
    </div>
  );
}

/* ---------- Compact Glass Wrapper ---------- */

function GlassItem({ children, danger }) {
  return (
    <section
      className={`
        rounded-xl backdrop-blur-2xl
        border ${danger ? "border-red-300/30" : "border-white/15"}
        bg-white/5
        shadow-[0_6px_22px_rgba(255,255,255,0.10)]
        
        /* COMPACT MODE */
        py-4 px-5 sm:py-5 sm:px-6

        /* Smooth hover lift (subtle but stylish) */
        transition-all duration-300
        hover:bg-white/10 hover:border-white/30
      `}
    >
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
