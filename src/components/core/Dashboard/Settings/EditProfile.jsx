import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../../../../services/operations/SettingsAPI";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (!user) return;
    setValue("firstName", user.firstName || "");
    setValue("lastName", user.lastName || "");
    setValue("dateOfBirth", user?.additionalDetails?.dateOfBirth || "");
    setValue("gender", user?.additionalDetails?.gender || genders[0]);
    setValue("contactNumber", user?.additionalDetails?.contactNumber || "");
    setValue("about", user?.additionalDetails?.about || "");
  }, [user, setValue]);

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitProfileForm)}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">
            Profile information
          </p>
          <p className="text-[11px] text-white/40">
            Keep your details up to date
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {/* First / Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="First Name"
            id="firstName"
            placeholder="Enter first name"
            register={register}
            errors={errors}
            rules={{ required: "Please enter your first name." }}
          />
          <Field
            label="Last Name"
            id="lastName"
            placeholder="Enter last name"
            register={register}
            errors={errors}
            rules={{ required: "Please enter your last name." }}
          />
        </div>

        {/* DOB / Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            register={register}
            errors={errors}
            rules={{
              required: "Please enter your Date of Birth.",
              max: {
                value: new Date().toISOString().split("T")[0],
                message: "Date of Birth cannot be in the future.",
              },
            }}
          />
          <SelectField
            label="Gender"
            id="gender"
            options={genders}
            register={register}
            errors={errors}
            rules={{ required: "Please select your gender." }}
          />
        </div>

        {/* Contact / About */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Contact Number"
            id="contactNumber"
            type="tel"
            placeholder="Enter contact number"
            register={register}
            errors={errors}
            rules={{
              required: "Please enter your Contact Number.",
              maxLength: { value: 12, message: "Invalid Contact Number" },
              minLength: { value: 10, message: "Invalid Contact Number" },
            }}
          />
          <Field
            label="About"
            id="about"
            placeholder="Enter a short bio"
            register={register}
            errors={errors}
            rules={{ required: "Please enter something about yourself." }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="
            px-4 py-1.5 rounded-full text-xs sm:text-sm
            bg-white/5 text-white/80 
            border border-white/20 
            backdrop-blur-xl
            hover:bg-white/12 hover:border-white/35
            transition-all
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold
            bg-white text-black
            shadow-[0_6px_22px_rgba(255,255,255,0.35)]
            hover:bg-white/90 transition-all
          "
        >
          Update
        </button>
      </div>
    </form>
  );
}

/* ---------- Slim glass field components ---------- */

function Field({
  label,
  id,
  register,
  errors,
  rules = {},
  type = "text",
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium text-white/70"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id, rules)}
        className="
          w-full rounded-lg px-3.5 py-2
          bg-white/5 border border-white/20 
          text-sm text-white
          placeholder:text-white/35
          backdrop-blur-xl
          focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
          transition-all
        "
      />

      {errors[id] && (
        <p className="text-[11px] text-red-300">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  id,
  register,
  errors,
  rules = {},
  options = [],
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium text-white/70"
      >
        {label}
      </label>

      <select
        id={id}
        {...register(id, rules)}
        className="
          w-full rounded-lg px-3.5 py-2
          bg-white/5 border border-white/20 
          text-sm text-white
          backdrop-blur-xl
          focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent
        "
      >
        {options.map((g, i) => (
          <option key={i} value={g} className="text-black">
            {g}
          </option>
        ))}
      </select>

      {errors[id] && (
        <p className="text-[11px] text-red-300">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
}
