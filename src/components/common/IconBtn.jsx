export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
      className={`
        flex items-center justify-center gap-x-2 
        rounded-lg py-2.5 px-6 font-semibold 
        transition-all duration-300 
        backdrop-blur-xl
        ${outline 
          ? `
            bg-white/60 
            border border-white/40
            text-black 
            hover:bg-white/90 hover:border-white/50
          `
          : `
            bg-white/60 
            border border-white/40
            text-black 
            hover:bg-white/90
            shadow-[0_4px_20px_rgba(255,255,255,0.25)]
          `
        }
        ${disabled && "opacity-40 cursor-not-allowed"}
        ${customClasses}
      `}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
