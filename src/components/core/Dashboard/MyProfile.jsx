import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { MdEditSquare } from "react-icons/md";
import { formattedDate } from "../../../utils/dateFormatter";

export default function MyProfile() {
  const { user, loading } = useSelector((state) => state.profile || {});
  const navigate = useNavigate();

  // early return while profile loads or is missing
  if (loading) {
    return (
      <div className="grid min-h-[200px] place-items-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    // graceful fallback if profile failed to load
    return (
      <div className="grid min-h-[200px] place-items-center text-center">
        <p className="text-richblack-300">Profile not available.</p>
      </div>
    );
  }

  const displayName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Anonymous";
  const avatarSrc = user?.image || "/default-avatar.png"; // swap to a real default path if you have one

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">My Profile</h1>

      {/* Section 01 */}
      <div>
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <div className="flex items-center gap-x-5">
            <img
              src={avatarSrc}
              alt={`profile-${user?.firstName ?? "profile"}`}
              className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-100">{displayName}</p>
              <p className="text-sm text-richblack-300">{user?.email ?? "No email provided"}</p>
            </div>
          </div>

          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <MdEditSquare />
          </IconBtn>
        </div>
      </div>

      {/* Section 02 */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <MdEditSquare />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write something about yourself"}
        </p>
      </div>

      {/* Personal Details */}
      <div className="flex my-10 flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 justify-between p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <MdEditSquare />
          </IconBtn>
        </div>

        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.firstName ?? "Add First Name"}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">{user?.email ?? "Add Email"}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.lastName ?? "Add Last Name"}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.dateOfBirth
                  ? formattedDate(user.additionalDetails.dateOfBirth)
                  : "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
