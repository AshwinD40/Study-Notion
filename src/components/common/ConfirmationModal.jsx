import React from "react";
import IconBtn from "./IconBtn";

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-md px-4">

      {/* Glass Dialog */}
      <div className="w-full max-w-[330px] rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-6">

        {/* Title */}
        <p className="text-2xl font-bold text-white/95 text-center tracking-wide">
          {modalData?.text1}
        </p>

        {/* Message */}
        <p className="mt-3 mb-6 text-center text-[15px] text-white/70 leading-relaxed">
          {modalData?.text2}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          
          {/* Primary Button (uses your IconBtn with iOS theme) */}
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
            customClasses="!bg-white/80 !text-black hover:!bg-white"
          />

          {/* Cancel Button */}
          <button
            onClick={modalData?.btn2Handler}
            className="rounded-xl bg-white/30  backdrop-blur-lg  text-black font-semibold  px-4 py-2  border border-white/40  hover:bg-white/50 transition"
          >
            {modalData?.btn2Text}
          </button>
        </div>

      </div>
    </div>
  );
}
