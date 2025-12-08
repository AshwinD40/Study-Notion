import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI";

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!loading) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setPreviewSource(reader.result);
    }
  };

  const handleFileUpload = () => {
    if (!imageFile || loading) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("displayPicture", imageFile);
    dispatch(updateDisplayPicture(token, formData)).finally(() =>
      setLoading(false)
    );
  };

  const avatarSrc = previewSource || user?.image;

  return (
    <div className="
      flex flex-col sm:flex-row sm:items-center sm:justify-between
      gap-4 sm:gap-3
    ">
      {/* LEFT → Avatar + text */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 scale-[1.18] rounded-full blur-lg bg-white/40" />
          <img
            src={avatarSrc}
            alt="profile"
            className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border border-white/50"
          />
        </div>

        <div className="space-y-[2px]">
          <p className="text-sm text-white/90 font-medium">Profile picture</p>
          <p className="text-[11px] text-white/40">Choose & upload a new photo</p>
        </div>
      </div>

      {/* RIGHT → Buttons */}
      <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        {/* Select Button */}
        <button
          onClick={handleClick}
          disabled={loading}
          className={`
            px-3 py-1.5 rounded-full text-[11px] sm:text-xs 
            border border-white/25 bg-white/10 text-white/90
            backdrop-blur-xl
            hover:bg-white/20 hover:border-white/40 
            transition-all
            ${loading && "opacity-50 cursor-not-allowed"}
          `}
        >
          {loading ? "Wait…" : "Select"}
        </button>

        {/* Upload Button */}
        <button
          onClick={handleFileUpload}
          disabled={loading || !imageFile}
          className={`
            flex items-center gap-1.5 px-4 py-1.5 rounded-full 
            bg-white text-black text-[11px] sm:text-xs font-medium
            shadow-[0_4px_18px_rgba(255,255,255,0.35)]
            hover:bg-white/90 transition-all
            ${loading || !imageFile ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading ? (
            "Uploading…"
          ) : (
            <>
              Upload
              <FiUpload className="text-[14px]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
