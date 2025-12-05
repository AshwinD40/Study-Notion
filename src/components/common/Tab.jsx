import { useRef, useEffect, useState } from "react";

export default function Tab({ tabData, field, setField }) {

  const containerRef = useRef(null);
  const buttonsRef = useRef(new Map());

  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  useEffect(() => {
    const btn = buttonsRef.current.get(field);
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const rect = btn.getBoundingClientRect();

    setIndicatorX(rect.left - containerRect.left);
    setIndicatorWidth(rect.width);
  }, [field]);


  return (
    <div
      ref={containerRef}
      className=" relative flex p-1 gap-x-1 my-6 rounded-full max-w-max  bg-white/10 backdrop-blur-md border border-white/20 shadow-[inset_0_0_8px_rgba(255,255,255,0.15)] "
    >
      {/* Sliding Indicator (glassy pill) */}
      <div
        className=" absolute top-1 bottom-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out"
        
        style={{
          width: indicatorWidth,
          transform: `translateX(${indicatorX}px)`
        }}
      />

      {tabData.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => buttonsRef.current.set(tab.type, el)}
          onClick={() => setField(tab.type)}
          className={`
            relative z-10 py-2 px-8 rounded-full font-medium select-none
            transition-all duration-200
            ${
              field === tab.type
                ? "text-white"
                : "text-white/70 hover:text-white"
            }
          `}
        >
          {tab.tabName}
        </button>
      ))}
    </div>
  );
}