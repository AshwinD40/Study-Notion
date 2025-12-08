import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";
import { formattedDate } from "../../../utils/dateFormatter";

export default function MyProfile() {
  const { user, loading } = useSelector((state) => state.profile || {});
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/40 border-t-primary-300" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-[200px] place-items-center text-center">
        <p className="text-sm text-richblack-300">Profile not available.</p>
      </div>
    );
  }

  const displayName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Anonymous";
  const avatarSrc = user?.image || "/default-avatar.png";
  const joinedDate = user?.createdAt ? formattedDate(user.createdAt) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8 md:space-y-10">
      {/* Page title */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-richblack-5">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-richblack-400">
            A simple overview of your account.
          </p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <EditButton
            label="Edit Profile"
            onClick={() => navigate("/dashboard/settings")}
            emphasize
          />
        </div>
      </header>

      {/* Identity strip – white glass, smaller avatar */}
      <section className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0 opacity-35 bg-gradient-to-tr from-white/40 via-white/10 to-transparent" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 scale-[1.18] rounded-full blur-xl bg-white/60" />
              <img
                src={avatarSrc}
                alt="profile"
                className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border border-white/70"
              />
            </div>

            <div className="space-y-1">
              <p className="text-base md:text-lg font-medium text-richblack-5">
                {displayName}
              </p>
              <p className="text-xs md:text-sm text-richblack-300">
                {user?.email ?? "No email provided"}
              </p>
              {joinedDate && (
                <p className="text-[11px] text-richblack-400">
                  Joined{" "}
                  <span className="font-medium text-richblack-300">
                    {joinedDate}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-3 text-xs sm:text-[11px] sm:flex-col sm:items-end">
            <p className="uppercase tracking-[0.18em] text-richblack-400">
              Status
            </p>
            <p className="text-richblack-100">Active • Learning in progress</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-richblack-400">
              About
            </p>
          </div>
          <EditButton
            label="Edit"
            onClick={() => navigate("/dashboard/settings")}
          />
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/5 p-4 backdrop-blur-lg">
          <p
            className={`text-sm leading-relaxed ${
              user?.additionalDetails?.about
                ? "text-richblack-5"
                : "italic text-richblack-500"
            }`}
          >
            {user?.additionalDetails?.about ?? "Write something about yourself"}
          </p>
        </div>
      </section>

      {/* Personal details */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-richblack-400">
              Personal Details
            </p>
            <p className="text-xs text-richblack-500">Basic information</p>
          </div>
          <EditButton
            label="Edit"
            onClick={() => navigate("/dashboard/settings")}
          />
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/5 p-4 sm:p-5 backdrop-blur-lg">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <DetailItem
                label="First Name"
                value={user?.firstName}
                placeholder="Add First Name"
              />
              <DetailItem
                label="Email"
                value={user?.email}
                placeholder="Add Email"
              />
              <DetailItem
                label="Gender"
                value={user?.additionalDetails?.gender}
                placeholder="Add Gender"
              />
            </div>
            <div className="space-y-4">
              <DetailItem
                label="Last Name"
                value={user?.lastName}
                placeholder="Add Last Name"
              />
              <DetailItem
                label="Phone Number"
                value={user?.additionalDetails?.contactNumber}
                placeholder="Add Contact Number"
              />
              <DetailItem
                label="Date Of Birth"
                value={
                  user?.additionalDetails?.dateOfBirth
                    ? formattedDate(user.additionalDetails.dateOfBirth)
                    : ""
                }
                placeholder="Add Date Of Birth"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---- Reusable mini components ---- */

function EditButton({ label = "Edit", onClick, emphasize = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-3.5 py-1.5
        text-xs sm:text-[13px] font-medium
        transition-all duration-200
        border backdrop-blur-md
        ${
          emphasize
            ? "bg-white text-richblack-900 border-white/80 hover:bg-white/90 hover:border-white"
            : "bg-white/10 text-richblack-50 border-white/40 hover:bg-white/18 hover:border-white/70"
        }
      `}
    >
      <span>{label}</span>
      <MdEditSquare className="text-[14px]" />
    </button>
  );
}

function DetailItem({ label, value, placeholder }) {
  const hasValue = Boolean(value);

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-richblack-500">
        {label}
      </p>
      <p
        className={`text-sm ${
          hasValue ? "text-richblack-5" : "italic text-richblack-500"
        }`}
      >
        {hasValue ? value : placeholder}
      </p>
      <div className="h-px w-full bg-white/10" />
    </div>
  );
}
