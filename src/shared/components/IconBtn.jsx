export default function IconBtn({
  text,
  onclick,
  children,
  disabled = false,
  outline = false,
  customClasses = "",
  type = "button",
}) {
  const baseStyle = `
    relative inline-flex items-center justify-center gap-2
    rounded-xl px-5 py-2.5 text-sm font-semibold tracking-[-0.01em]
    transition-all duration-300 backdrop-blur-xl
    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0
  `;

  const filledStyle = `
    bg-white/80 text-richblack-900 border border-white/70
    shadow-[0_10px_30px_rgba(0,0,0,0.35)]
    hover:bg-white hover:border-white hover:-translate-y-[1px]
    active:translate-y-0 active:scale-[0.97]
  `;

  const outlineStyle = `
    bg-white/10 text-white border border-white/40
    hover:bg-white/18 hover:border-white/60 hover:-translate-y-[1px]
    active:translate-y-0 active:scale-[0.97]
  `;

  const disabledStyle = `
    opacity-50 cursor-not-allowed hover:translate-y-0 hover:scale-100
    hover:bg-inherit hover:border-inherit
  `;

  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
      className={`
        group
        ${baseStyle}
        ${outline ? outlineStyle : filledStyle}
        ${disabled ? disabledStyle : ""}
        ${customClasses}
      `}
    >
      {/* glow layer */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-xl opacity-0
          group-hover:opacity-40 blur-xl
          bg-gradient-to-r from-white/70 via-white/30 to-white/70
          transition-all duration-500
        "
      />

      {/* icon (if any) */}
      {children && (
        <span className="relative flex items-center text-base">
          {children}
        </span>
      )}

      {/* text */}
      {text && (
        <span className="relative">
          {text}
        </span>
      )}
    </button>
  );
}
