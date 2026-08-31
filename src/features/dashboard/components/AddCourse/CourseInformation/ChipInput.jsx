import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues, // keeping this if you ever need it later
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [chips, setChips] = useState([]);

  // init chips + register field
  useEffect(() => {
    if (editCourse && course?.tag?.length) {
      setChips(course.tag);
    }

    register(name, {
      required: true,
      validate: (value) => value && value.length > 0,
    });
  }, [editCourse, course, name, register]);

  // sync chips to RHF value
  useEffect(() => {
    setValue(name, chips);
  }, [chips, name, setValue]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      const chipValue = event.target.value.trim();

      if (chipValue && !chips.includes(chipValue)) {
        setChips((prev) => [...prev, chipValue]);
        event.target.value = "";
      }
    }

    // handle backspace to delete last chip when input empty
    if (event.key === "Backspace" && !event.target.value && chips.length) {
      setChips((prev) => prev.slice(0, -1));
    }
  };

  const handleDeleteChip = (chipIndex) => {
    setChips((prev) => prev.filter((_, index) => index !== chipIndex));
  };

  const hasError = Boolean(errors?.[name]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
        htmlFor={name}
      >
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Chips + input in glassy container */}
      <div
        className={`
          flex w-full flex-wrap items-center gap-2
          rounded-xl border 
          bg-richblack-700/60 
          px-3 py-2
          transition-all
          ${
            hasError
              ? "border-pink-400/70 shadow-[0_0_0_1px_rgba(244,114,182,0.45)]"
              : "border-richblack-600 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
          }
          focus-within:border-yellow-300 
          focus-within:shadow-[0_0_0_1px_rgba(250,204,21,0.35)]
        `}
      >
        {chips.map((chip, index) => (
          <div
            key={index}
            className="
              flex items-center gap-1 
              rounded-full 
              bg-yellow-300/90 
              px-2.5 py-1 
              text-[11px] font-semibold 
              text-richblack-900
              shadow-[0_4px_10px_rgba(250,204,21,0.4)]
            "
          >
            <span className="max-w-[140px] truncate">{chip}</span>
            <button
              type="button"
              className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-[10px]" />
            </button>
          </div>
        ))}

        {/* Input */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style"
        />
      </div>

      {/* Error */}
      {hasError && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default ChipInput;
