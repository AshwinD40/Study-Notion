import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const RequirementField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value && value.length > 0,
    });
  }, [name, register]);

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList, name, setValue]);

  const handleAddRequirement = () => {
    const value = requirement.trim();
    if (!value) return;
    setRequirementList((prev) => [...prev, value]);
    setRequirement("");
  };

  const handleRemoveRequirement = (index) => {
    setRequirementList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  const hasError = Boolean(errors?.[name]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label
        htmlFor={name}
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
      >
        {label} <sup className="text-pink-300">*</sup>
      </label>

      {/* Input + Add inside same field */}
      <div className="relative w-full">
        <input
          id={name}
          type="text"
          value={requirement}
          placeholder="Add a requirement and press Enter"
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-style w-full pr-24"
        />

        <button
          type="button"
          onClick={handleAddRequirement}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            rounded-lg px-3 py-1.5 text-[12px] font-semibold
            bg-white/15 text-white
            hover:bg-white/25
            transition
          "
        >
          Add
        </button>
      </div>

      {/* List of requirements */}
      {requirementList.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {requirementList.map((req, index) => (
            <li
              key={index}
              className="
                flex items-center gap-2
                rounded-full px-3 py-1
                bg-white/10 border border-white/15
                text-[12px] text-white
                backdrop-blur-md
              "
            >
              <span className="truncate">{req}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="
                  flex items-center justify-center
                  h-4 w-4 rounded-full bg-black/30
                  hover:bg-black/50 transition
                "
              >
                <MdClose className="text-[10px]" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {hasError && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default RequirementField;
