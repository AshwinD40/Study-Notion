import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";

function Dashboard() {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (authLoading || profileLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-richblack-900">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-richblack-900">
      {/* navbar is sticky above this, height = 4rem (h-16) */}
      <Sidebar />

      {/* main content shifted right on md+ so it doesn't sit under the fixed sidebar */}
      <main className="pt-16 md:ml-[240px]">
        <div className="mx-auto w-11/12 max-w-[1300px] py-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
