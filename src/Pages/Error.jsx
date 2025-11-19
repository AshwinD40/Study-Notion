import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

export default function ErrorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-richblack-900 p-4">
      
      {/* Glassy container */}
      <div
        className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-10 py-12 max-w-sm w-full  shadow-[0_0_50px_rgba(255,255,255,0.08)] flex flex-col items-center text-center select-none"
      >
        {/* 404 text */}
        <h1 className="text-6xl font-extrabold tracking-widest text-white/80 drop-shadow mb-4">
          404
        </h1>

        {/* Divider line */}
        <div className="w-12 h-[2px] bg-white/20 mb-6"></div>

        {/* Subtitle */}
        <p className="text-white/60 text-sm leading-relaxed mb-10 px-3">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Home button */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2  bg-white/10 border border-white/20  text-white/80 font-medium  px-6 py-3 rounded-xl text-sm w-full hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-xl"
        >
          <AiOutlineHome className="text-lg" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
