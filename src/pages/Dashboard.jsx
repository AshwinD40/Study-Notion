import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../features/dashboard/components/Sidebar";

function Dashboard() {
  const { loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-richblack-900">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-richblack-900 flex">
      {/* Sidebar for Desktop & Mobile */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 pt-28 pb-12 md:pt-16 md:ml-[240px] min-h-[calc(100vh-3.5rem)] overflow-x-hidden">
        <div className="mx-auto w-11/12 max-w-[1100px] py-4 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
