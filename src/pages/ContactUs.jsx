import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { VscSend } from "react-icons/vsc";

import { apiConnector } from "../shared/api/client";
import { contactusEndpoint } from "../shared/api/endpoints";
import Footer from "../shared/components/Footer";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    const toastId = toast.loading("Sending message...");
    try {
      setLoading(true);
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      if (!res?.data?.success) {
        throw new Error("Could not send message");
      }
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("CONTACT FORM ERROR", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: "",
        email: "",
        message: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-50">
      {/* Main Section */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28">
        {/* Subtle ambient light */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-b from-[#1FA2FF]/10 via-yellow-500/5 to-transparent blur-[100px] -z-10" />

        <div className="mx-auto w-11/12 max-w-[1100px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading & direct touchpoint */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                We{"'"}d love to hear from you
              </h1>
              <p className="text-sm sm:text-base text-richblack-300">
                We{"'"}re just a message away!
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3 text-sm text-richblack-300">
                <a
                  href="mailto:support@studynotion.com"
                  className="font-medium text-white hover:text-yellow-50 transition"
                >
                  support@studynotion.com
                </a>
                <span className="text-richblack-600">|</span>
                <span className="text-richblack-400">Bengaluru, Karnataka</span>
              </div>
            </div>

            {/* Right Column: TUF-style compact inputs & message box with embedded send */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit(submitContactForm)} className="space-y-3.5 text-left">
                {/* Top row: 2 pill inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full rounded-2xl border border-white/10 bg-[#161a23] px-4 py-3 text-sm text-white placeholder-richblack-400 focus:border-white/30 focus:outline-none transition shadow-inner"
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <span className="text-[11px] text-red-400 mt-1 block pl-2">
                        Name is required
                      </span>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-white/10 bg-[#161a23] px-4 py-3 text-sm text-white placeholder-richblack-400 focus:border-white/30 focus:outline-none transition shadow-inner"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-400 mt-1 block pl-2">
                        Email is required
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom row: Textarea with embedded send button */}
                <div className="relative rounded-2xl border border-white/10 bg-[#161a23] p-4 focus-within:border-white/30 transition shadow-inner">
                  <textarea
                    rows={4}
                    placeholder="How can we help you?..."
                    className="w-full bg-transparent text-sm text-white placeholder-richblack-400 focus:outline-none resize-none pr-12 pb-6"
                    {...register("message", { required: true })}
                  />

                  {/* Embedded Send Action */}
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Send message"
                    className="absolute right-3.5 bottom-3.5 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-richblack-900 transition hover:bg-yellow-100 hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <VscSend className="text-base" />
                  </button>
                </div>
                {errors.message && (
                  <span className="text-[11px] text-red-400 mt-1 block pl-2">
                    Message is required
                  </span>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}