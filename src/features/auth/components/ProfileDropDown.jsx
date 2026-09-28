import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.auth)

  if (!user) return null

  const dashboardPath =
    user?.accountType === "Instructor"
      ? "/dashboard/instructor"
      : "/dashboard/enrolled-courses"

  return (
    <Link
      to={dashboardPath}
      className="flex items-center gap-x-2 rounded-xl border border-neutral-100/20 bg-richblack-800/60 px-3 py-1.5 text-richblack-50 hover:bg-richblack-800 hover:text-white transition"
    >
      <img
        src={user?.image}
        alt={`profile-${user.firstName}`}
        className="aspect-square w-[26px] rounded-full object-cover"
      />
      <span className="text-sm font-medium">Dashboard</span>
    </Link>
  )
}
