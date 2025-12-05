import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { TbChevronDown } from "react-icons/tb";

const CategorySelect = ({
  name,
  control,
  label = "Category",
  rules,
  options = [],
  loading = false,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const selected = options.find((opt) => opt._id === field.value);

        return (
          <div className="flex flex-col gap-1.5" ref={containerRef}>
            {/* label */}
            <label
              htmlFor={name}
              className="text-xs font-medium uppercase tracking-wide text-richblack-200"
            >
              {label} <sup className="text-pink-300">*</sup>
            </label>

            {/* trigger */}
            <button
              id={name}
              type="button"
              disabled={loading}
              onClick={() => !loading && setOpen((s) => !s)}
              className={`form-style
                w-full rounded-md 
                
                
                text-sm text-richblack-50
                py-2.5 px-3
                flex items-center justify-between
            
                
              `}
            >
              <span
                className={
                  selected ? "truncate" : "truncate text-richblack-400"
                }
              >
                {loading
                  ? "Loading categories..."
                  : selected
                  ? selected.name
                  : "Choose a Category"}
              </span>

              <TbChevronDown
                className={`text-base transition-transform ${
                  open ? "rotate-180" : ""
                } text-richblack-300`}
              />
            </button>

            {/* dropdown */}
            {open && !loading && (
              <ul
                className="
                  mt-1 w-full 
                  rounded-md border border-richblack-700 
                  bg-richblack-900/95 backdrop-blur-xl
                  shadow-[0_18px_40px_rgba(0,0,0,0.85)]
                  max-h-60 overflow-auto z-30
                  animate-in fade-in slide-in-from-top-1
                "
                role="listbox"
              >
                {options.length === 0 && (
                  <li className="px-3 py-2 text-sm text-richblack-300">
                    No categories found
                  </li>
                )}

                {options.map((opt) => {
                  const isSelected = opt._id === field.value;
                  return (
                    <li key={opt._id}>
                      <button
                        type="button"
                        className={`
                          w-full text-left px-3 py-2 text-sm
                          ${
                            isSelected
                              ? "bg-richblack-700 text-richblack-5"
                              : "text-richblack-100 hover:bg-richblack-800/80"
                          }
                        `}
                        onClick={() => {
                          field.onChange(opt._id);
                          setOpen(false);
                        }}
                      >
                        {opt.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* error text */}
            {error && (
              <span className="ml-1 text-xs tracking-wide text-pink-200">
                {error.message || "Category is required"}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default CategorySelect;
