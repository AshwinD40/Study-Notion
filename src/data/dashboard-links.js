import { ACCOUNT_TYPE } from "../utils/constants";

export const sidebarLinks = [
  // Instructor Content Links (Top Priority for Instructors)
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard/instructor",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscDashboard",
  },
  {
    id: 2,
    name: "My Courses",
    path: "/dashboard/my-courses",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscVm",
  },
  {
    id: 3,
    name: "Add Course",
    path: "/dashboard/add-course",
    type: ACCOUNT_TYPE.INSTRUCTOR,
    icon: "VscAdd",
  },

  // Student Content Links (Top Priority for Students)
  {
    id: 4,
    name: "Enrolled Courses",
    path: "/dashboard/enrolled-courses",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscNotebook",
  },
  {
    id: 5,
    name: "Wishlist",
    path: "/dashboard/cart",
    type: ACCOUNT_TYPE.STUDENT,
    icon: "VscBookmark",
  },

  // Common Profile/Info Link (After content)
  {
    id: 6,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
];
