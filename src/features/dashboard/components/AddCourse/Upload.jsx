import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

import "video-react/dist/video-react.css";
import { Player } from "video-react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const inputRef = useRef(null);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    register(name, { required: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register]);

  useEffect(() => {
    setValue(name, selectedFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue]);

  const hasError = Boolean(errors?.[name]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* label */}
      <label
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
        htmlFor={name}
      >
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* course info */}
      {course?.courseName && (
        <p className="mb-1 text-[11px] text-richblack-300">
          Uploading for course:{" "}
          <span className="font-medium text-yellow-50">
            {course.courseName}
          </span>
        </p>
      )}

      {/* drop zone */}
      <div
        {...getRootProps({
          onClick: () => {
            if (!viewData) inputRef.current?.click();
          },
          className: `
            relative flex min-h-[230px] w-full cursor-pointer items-center justify-center
            rounded-2xl
            border border-white/20 
            backdrop-blur-xl
            bg-white/5 
            bg-gradient-to-br from-white/10 via-white/5 to-white/[0.03]
            
            shadow-[0_0_30px_rgba(255,255,255,0.18)]
            hover:shadow-[0_0_45px_rgba(255,255,255,0.28)]
            hover:border-white/30

            transition-all duration-300
            ${isDragActive ? "scale-[1.02] border-white/30" : ""}
          `
        })}
      >
        <input {...getInputProps()} ref={inputRef} />

        {previewSource ? (
          <div className="flex w-full flex-col rounded-2xl bg-white/[0.04] border border-white/10 p-4 shadow-[inset_0_0_25px_rgba(255,255,255,0.06)]">
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.15)]">
              {!video ? (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.01]"
                />
              ) : (
                <Player aspectRatio="16:9" playsInline src={previewSource} />
              )}
            </div>

            {!viewData && (
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewSource("");
                    setSelectedFile(null);
                    setValue(name, null);
                  }}
                  className="text-xs text-richblack-200 hover:text-pink-300 transition"
                >
                  Remove file
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="
                    rounded-lg px-3 py-1.5 text-xs font-medium 
                    bg-white/10 border border-white/20 
                    text-richblack-50
                    hover:bg-white/20
                    transition
                  "
                >
                  Change file
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center text-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.18)]">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>

            <p className="mt-3 max-w-[260px] text-xs text-richblack-200">
              Drag & drop a {video ? "video" : "thumbnail image"}, or{" "}
              <span
                className="text-yellow-50 font-semibold hover:text-yellow-100 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                browse
              </span>{" "}
              to upload
            </p>

            <div className="mt-5 flex flex-col items-center gap-1 text-[11px] text-richblack-300 md:flex-row md:gap-6">
              <span>Aspect ratio 16:9</span>
              {!video && <span>Recommended 1024×576</span>}
            </div>
          </div>
        )}
      </div>


      {/* error */}
      {hasError && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
