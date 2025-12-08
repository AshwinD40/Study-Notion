import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { changePassword } from "../../../../services/operations/SettingsAPI"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const submitPasswordForm = async (data) => {
    const ok = await changePassword(token, data)
    if (ok) reset()
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)} className="space-y-6">

      {/* Title */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">
          Password Settings
        </p>
        <p className="text-[11px] text-white/40">
          Update your password securely
        </p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        <PasswordField
          id="oldPassword"
          label="Current Password"
          placeholder="Enter current password"
          register={register}
          error={errors.oldPassword}
          show={showOldPassword}
          toggle={() => setShowOldPassword((p) => !p)}
        />

        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="Enter new password"
          register={register}
          error={errors.newPassword}
          show={showNewPassword}
          toggle={() => setShowNewPassword((p) => !p)}
        />

      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="
            px-4 py-1.5 rounded-full text-xs sm:text-sm
            bg-white/5 text-white/70
            border border-white/20 backdrop-blur-xl
            hover:bg-white/10 hover:border-white/35
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
  )
}

function PasswordField({ id, label, placeholder, register, error, show, toggle }) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-medium text-white/70">{label}</label>

      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...register(id, { required: `${label} is required` })}
        className=" w-full rounded-lg px-3.5 py-2 bg-white/5 border border-white/20  text-sm text-white placeholder:text-white/35backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-whitefocus:border-transparent transition-all pr-10 "
      />

      <span
        onClick={toggle}
        className="
          absolute right-3 top-[34px]
          text-white/60 hover:text-white cursor-pointer transition
        "
      >
        {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </span>

      {error && (
        <p className="text-[11px] text-red-300">{error.message}</p>
      )}
    </div>
  )
}
