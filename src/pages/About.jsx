import React from "react";
import { Link } from "react-router-dom";
import Footer from "../shared/components/Footer";
import ReviewSlider from "../shared/components/ReviewSlider";
import {
  VscBook,
  VscCheck,
  VscGlobe,
  VscMortarBoard,
  VscOrganization,
  VscShield,
} from "react-icons/vsc";

const stats = [
  { count: "5K+", label: "Active students" },
  { count: "10+", label: "Mentors & educators" },
  { count: "200+", label: "Quality courses" },
  { count: "50+", label: "Awards & recognitions" },
];

const values = [
  {
    icon: VscBook,
    title: "Curriculum tailored for industry",
    description:
      "Every module is designed alongside active engineers and instructors to reflect real-world tech stacks.",
  },
  {
    icon: VscMortarBoard,
    title: "Project-based learning",
    description:
      "Learn by building production-grade web apps, databases, and microservices instead of passive theory.",
  },
  {
    icon: VscGlobe,
    title: "Global peer community",
    description:
      "Connect with thousands of fellow developers, exchange reviews, and collaborate across time zones.",
  },
  {
    icon: VscShield,
    title: "Verified certifications",
    description:
      "Earn industry-recognized proof of completion to share directly on your portfolio and LinkedIn.",
  },
  {
    icon: VscOrganization,
    title: "Mentorship on demand",
    description:
      "Get unstuck faster with direct guidance from experienced professionals in dedicated discussion threads.",
  },
  {
    icon: VscCheck,
    title: "Affordable & flexible",
    description:
      "Lifetime access to all enrolled materials so you can learn at your own pace without subscriptions.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-50">
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24 text-center">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[320px] w-[550px] rounded-full bg-gradient-to-b from-[#1FA2FF]/10 to-transparent blur-3xl" />

        <div className="relative mx-auto w-11/12 max-w-[1000px]">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Empowering the next generation of{" "}
            <span className="bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent">
              developers & creators
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-richblack-300 leading-relaxed max-w-2xl mx-auto">
            We are dedicated to shaping accessible, high-impact tech education through interactive courses, emerging technologies, and a thriving global community.
          </p>
        </div>
      </section>

      <section className="mx-auto w-11/12 max-w-[1100px] -mt-8 sm:-mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-white/10 bg-richblack-800/90 p-6 sm:p-8 backdrop-blur-md shadow-xl">
          {stats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center p-2">
              <span className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                {item.count}
              </span>
              <span className="mt-1 text-xs sm:text-sm text-richblack-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-11/12 max-w-[1100px] py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-richblack-800/40 p-6 sm:p-8 hover:border-white/20 transition group">
            <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-yellow-50 to-amber-500 mb-6 opacity-80" />
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Our founding story
            </h2>
            <p className="mt-4 text-sm sm:text-base text-richblack-300 leading-relaxed">
              StudyNotion started with a simple belief: high quality computer science education shouldn{"'"}t be locked behind expensive bootcamps or rigid university schedules.
            </p>
            <p className="mt-3 text-sm sm:text-base text-richblack-300 leading-relaxed">
              A collective of educators and software engineers teamed up to build an intuitive, flexible learning environment where anyone with an internet connection can master modern tools.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-richblack-800/40 p-6 sm:p-8 hover:border-white/20 transition group">
            <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1FA2FF] to-[#12D8FA] mb-6 opacity-80" />
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Our mission & vision
            </h2>
            <p className="mt-4 text-sm sm:text-base text-richblack-300 leading-relaxed">
              Our mission is to bridge the divide between theoretical knowledge and practical workplace requirements, helping learners turn curiosity into dependable careers.
            </p>
            <p className="mt-3 text-sm sm:text-base text-richblack-300 leading-relaxed">
              We envision a global platform where knowledge is shared openly, code is reviewed transparently, and students learn continuously at their own rhythm.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.01] py-16 sm:py-24">
        <div className="mx-auto w-11/12 max-w-[1100px]">
          <div className="max-w-xl mb-12 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Built around modern learning principles
            </h2>
            <p className="mt-2 text-sm sm:text-base text-richblack-300">
              Everything we create focuses on practical outcomes, speed, and real mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl border border-white/10 bg-richblack-800/40 p-6 hover:border-white/20 transition"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-cyan-400 group-hover:text-yellow-50 group-hover:border-yellow-50/30 transition">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-richblack-300 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-11/12 max-w-[1100px] py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-richblack-800/70 to-richblack-900/90 p-8 sm:p-14 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to advance your technical skills?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-richblack-300 max-w-xl mx-auto">
              Explore our curated catalog of software engineering and development courses today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/catalog/all"
                className="rounded-xl bg-yellow-50 px-6 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition shadow-[0_1px_15px_rgba(255,214,10,0.15)] active:scale-95"
              >
                Explore courses
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition active:scale-95"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto w-11/12 max-w-[1100px]">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-white mb-10">
            Reviews from other learners
          </h2>
          <ReviewSlider />
        </div>
      </section>

      <Footer />
    </div>
  );
}