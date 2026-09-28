import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiBookOpen, FiChevronRight, FiSearch, FiX } from "react-icons/fi";

import { apiConnector } from "../shared/api/client";
import { categories } from "../shared/api/endpoints";
import { getAllCourses } from "../features/courses/api/courses.api";
import CourseCard from "../features/catalog/components/Course_Card";
import Footer from "../shared/components/Footer";

// Helper to convert category name into URL-friendly slug
const toSlug = (name) =>
  String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function Catalog() {
  const { catalogName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState([]);
  const [allCoursesList, setAllCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch live categories and all published courses in parallel
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const [catsRes, coursesRes] = await Promise.all([
          apiConnector("GET", categories.CATEGORIES_API),
          getAllCourses(),
        ]);

        if (isMounted) {
          if (catsRes?.data?.success && Array.isArray(catsRes.data.data)) {
            setAllCategories(catsRes.data.data);
          }
          if (Array.isArray(coursesRes)) {
            setAllCoursesList(coursesRes);
          }
        }
      } catch (err) {
        console.error("Failed to load catalog data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Compute course count for each category
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const course of allCoursesList) {
      const catId = course?.category?._id || course?.category;
      const catName = course?.category?.name;
      if (catId) counts[catId] = (counts[catId] || 0) + 1;
      if (catName) counts[catName.toLowerCase()] = (counts[catName.toLowerCase()] || 0) + 1;
    }
    return counts;
  }, [allCoursesList]);

  // 3. Resolve active category based on URL param or ?category= query param
  const activeCategory = useMemo(() => {
    const targetParam = catalogName || searchParams.get("category");
    if (!targetParam || targetParam === "all") return null;

    const normalizedParam = targetParam.toLowerCase().replace(/[^a-z0-9]/g, "");

    // a. Exact slug match
    const exact = allCategories.find((cat) => toSlug(cat.name) === targetParam.toLowerCase());
    if (exact) return exact;

    // b. Normalized match
    const normalized = allCategories.find(
      (cat) => cat.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalizedParam
    );
    if (normalized) return normalized;

    // c. ID match
    const byId = allCategories.find((cat) => cat._id === targetParam);
    if (byId) return byId;

    return null;
  }, [allCategories, catalogName, searchParams]);

  // 4. Filter courses based on active category & search query
  const filteredCourses = useMemo(() => {
    return allCoursesList.filter((course) => {
      // Category filter
      if (activeCategory) {
        const courseCatId = course?.category?._id || course?.category;
        const courseCatName = course?.category?.name || "";

        const matchesId = courseCatId && String(courseCatId) === String(activeCategory._id);
        const matchesName =
          courseCatName &&
          courseCatName.trim().toLowerCase() === activeCategory.name.trim().toLowerCase();

        if (!matchesId && !matchesName) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const titleMatch = course?.courseName?.toLowerCase().includes(query);
        const descMatch = course?.courseDescription?.toLowerCase().includes(query);
        const catMatch = course?.category?.name?.toLowerCase().includes(query);
        const instructorMatch = `${course?.instructor?.firstName || ""} ${course?.instructor?.lastName || ""}`
          .toLowerCase()
          .includes(query);

        if (!titleMatch && !descMatch && !catMatch && !instructorMatch) return false;
      }

      return true;
    });
  }, [allCoursesList, activeCategory, searchQuery]);

  // Handle tag selection
  const handleSelectTag = (cat) => {
    if (!cat) {
      navigate("/courses");
    } else {
      navigate(`/courses?category=${toSlug(cat.name)}`);
    }
  };

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-richblack-900/80 pt-24 sm:pt-28 pb-10 sm:pb-12">
        {/* Subtle Ambient Light Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[280px] w-[700px] rounded-full bg-gradient-to-b from-yellow-500/10 via-cyan-500/5 to-transparent blur-[120px] -z-10" />

        <div className="mx-auto w-11/12 max-w-[1240px]">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-richblack-400 mb-4"
          >
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <FiChevronRight className="text-richblack-600" />
            <Link to="/courses" className="hover:text-white transition">
              Courses
            </Link>
            {activeCategory && (
              <>
                <FiChevronRight className="text-richblack-600" />
                <span className="text-yellow-50 font-medium">
                  {activeCategory.name}
                </span>
              </>
            )}
          </nav>

          {/* Heading & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white capitalize">
                {activeCategory ? activeCategory.name : "All Courses"}
              </h1>
              <p className="text-sm sm:text-base text-richblack-300 leading-relaxed">
                {activeCategory?.description ||
                  "Browse live, industry-grade courses with hands-on projects, verified curriculum, and comprehensive roadmaps."}
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-richblack-400 text-sm" />
              <input
                type="text"
                placeholder="Search courses or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-richblack-800/80 pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-richblack-400 focus:border-yellow-50/50 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-white"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tag Pills */}
          <div className="mt-8 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSelectTag(null)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 active:scale-95 ${
                  !activeCategory
                    ? "bg-yellow-50 text-richblack-900 shadow-md shadow-yellow-500/10 font-semibold"
                    : "border border-white/10 bg-richblack-800/60 text-richblack-300 hover:border-white/20 hover:text-white"
                }`}
              >
                All Courses ({allCoursesList.length})
              </button>

              {allCategories.map((cat) => {
                const isSelected = activeCategory?._id === cat._id;
                const count =
                  categoryCounts[cat._id] ||
                  categoryCounts[cat.name.toLowerCase()] ||
                  cat.courses?.length ||
                  0;

                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleSelectTag(cat)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? "bg-yellow-50 text-richblack-900 shadow-md shadow-yellow-500/10 font-semibold"
                        : "border border-white/10 bg-richblack-800/60 text-richblack-300 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat.name}
                    {count > 0 && (
                      <span
                        className={`ml-1.5 text-[11px] ${
                          isSelected ? "text-richblack-800" : "text-richblack-400"
                        }`}
                      >
                        ({count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Grid Section */}
      <main className="mx-auto w-11/12 max-w-[1240px] py-12 sm:py-16">
        {/* Results Counter Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {activeCategory ? activeCategory.name : "All Available Courses"}
            </span>
            <span className="text-xs text-richblack-400">
              ({filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"})
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-yellow-50 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[310px] rounded-2xl border border-white/5 bg-richblack-800/30 p-4 animate-pulse"
              >
                <div className="aspect-video w-full rounded-xl bg-richblack-800" />
                <div className="mt-4 h-4 w-3/4 rounded bg-richblack-800" />
                <div className="mt-2 h-3 w-1/2 rounded bg-richblack-800" />
                <div className="mt-6 h-5 w-1/3 rounded bg-richblack-800" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-richblack-800/20 py-20 px-6 text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-richblack-800 text-richblack-400">
              <FiBookOpen className="text-2xl" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">
                {searchQuery
                  ? `No courses match "${searchQuery}"`
                  : "No courses found in this category"}
              </h3>
              <p className="text-xs sm:text-sm text-richblack-400 max-w-md">
                {searchQuery
                  ? "Try searching for different keywords or clear your query to see all courses."
                  : "We are actively expanding this track. Explore all other courses or check back soon!"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                handleSelectTag(null);
              }}
              className="rounded-full bg-yellow-50 px-5 py-2 text-xs font-semibold text-richblack-900 transition hover:bg-yellow-100 active:scale-95"
            >
              View All Courses
            </button>
          </div>
        )}

        {/* Populated Courses Grid */}
        {!loading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
