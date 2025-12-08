import React from "react";
import ReactDOM from "react-dom";

export default function ConfirmationModal({ modalData }) {
  if (typeof document === "undefined") return null;

  const danger = modalData?.danger === true;

  return ReactDOM.createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/70 backdrop-blur-xl
        animate-[fadeIn_0.25s_ease-out]
        px-4
      "
    >
      <div
        className={`
          w-full max-w-[360px] p-6 text-center rounded-2xl backdrop-blur-2xl
          ${danger
            ? "bg-red-900/20 border border-red-500/40 shadow-[0_0_40px_rgba(255,0,0,0.5)] animate-[shake_0.35s_ease-in-out_infinite]"
            : "bg-white/15 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
          }
        `}
      >
        {/* Warning Banner for Delete Mode */}
        {danger && (
          <div className="
            w-full py-2 mb-3
            bg-red-500/20 rounded-lg
            border border-red-500/40
            text-red-300 text-xs font-semibold
          ">
            This action is permanent and irreversible.
          </div>
        )}

        {/* Title */}
        <p
          className={`
            text-2xl font-bold mb-2
            ${danger
              ? "bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-200"
              : "text-white"
            }
          `}
        >
          {modalData?.text1}
        </p>

        {/* Description */}
        <p
          className={`
            text-sm leading-relaxed mb-6
            ${danger ? "text-red-100/80" : "text-white/70"}
          `}
        >
          {modalData?.text2}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {/* Confirm */}
          <button
            onClick={modalData?.btn1Handler}
            className={`
              px-5 py-2 rounded-full font-bold text-sm
              transition-all
              ${danger
                ? "bg-red-500 text-black shadow-[0_0_30px_rgba(255,0,0,0.7)] hover:bg-red-400"
                : "bg-white/90 text-black hover:bg-white shadow-[0_4px_16px_rgba(255,255,255,0.35)]"
              }
            `}
          >
            {modalData?.btn1Text}
          </button>

          {/* Cancel */}
          <button
            onClick={modalData?.btn2Handler}
            className="
              px-4 py-2 rounded-full font-semibold text-sm
              bg-white/10 text-white/80 border border-white/20
              hover:bg-white/20 transition
            "
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
