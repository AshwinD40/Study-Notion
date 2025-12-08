import React, { useEffect, useRef, useState } from "react";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHigh,
  IoVolumeMute,
  IoExpand,
  IoContract,
} from "react-icons/io5";

const formatTime = (secs) => {
  if (!secs || Number.isNaN(secs)) return "00:00";
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const CustomPlayer = ({
  src,
  poster,
  autoPlay = false,
  onPrev,
  onNext,
  onComplete,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [ripple, setRipple] = useState(false);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [showControls, setShowControls] = useState(true);

  const triggerRipple = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 500);
  };

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHideControls = () => {
    clearHideTimer();
    if (!playing || ended) return;
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    triggerRipple();

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
      setShowControls(true); // keep visible when paused
      clearHideTimer();
    } else {
      videoRef.current.play();
      setPlaying(true);
      setEnded(false);
      setShowControls(true);
      scheduleHideControls();
    }
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    setCurrentTime(vid.currentTime);
    setDuration(vid.duration || 0);
    setProgress(((vid.currentTime || 0) / (vid.duration || 1)) * 100);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
    setProgress(pct * 100);
  };

  const handleEnded = () => {
    setEnded(true);
    setPlaying(false);
    setShowControls(true);
    clearHideTimer();
    if (onComplete) onComplete();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;

    if (!document.fullscreenElement) {
      el?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      setMuted(v === 0);
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (videoRef.current) videoRef.current.muted = newMuted;
  };

  const changePlaybackRate = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const next =
      speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const handleMouseMove = () => {
    if (ended) return;
    setShowControls(true);
    if (playing) {
      scheduleHideControls();
    } else {
      clearHideTimer();
    }
  };

  useEffect(() => {
    return () => clearHideTimer();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* CENTER WATER-DROP BUTTON: only when paused & not ended */}
      {!ended && !playing && (
        <button
          onClick={handlePlayPause}
          className="
            absolute inset-0 m-auto 
            h-24 w-24 
            rounded-full
            flex items-center justify-center
            transition-transform
            hover:scale-110 active:scale-125
          "
        >
          {ripple && (
            <span
              className="
                absolute inset-0 rounded-full
                bg-white/20 animate-ripple
              "
            />
          )}

          <span
            className="
              absolute inset-0
              rounded-full bg-white/10 
              blur-3xl opacity-70
            "
          />

          <IoPlay size={36} className="text-white translate-x-[2px]" />
        </button>
      )}

      {/* BOTTOM CONTROLS: hide after 2s while playing */}
      {!ended && showControls && (
        <div
          className="
            absolute bottom-0 left-0 right-0
            flex flex-col gap-2
            px-4 py-3
            bg-gradient-to-t from-black/85 via-black/60 to-transparent
          "
        >
          {/* Seek bar */}
          <div
            onClick={handleSeek}
            className="
              w-full h-1.5 
              bg-white/20 rounded-full cursor-pointer group
            "
          >
            <div
              className="h-full bg-white rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <span
                className="
                  absolute -top-1 h-3 w-3 rounded-full bg-white
                  right-0 translate-x-1/2 opacity-0 group-hover:opacity-100
                "
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between text-white">
            {/* LEFT: Play + Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="
                  relative 
                  h-12 w-12 rounded-full
                  bg-transparent
                  flex items-center justify-center
                  hover:scale-110 active:scale-125
                  transition-all
                "
              >
                {playing ? (
                  <IoPause size={20} className="text-white" />
                ) : (
                  <IoPlay
                    size={20}
                    className="text-white translate-x-[1px]"
                  />
                )}
              </button>

              <span className="text-xs text-white/80">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* RIGHT: volume, speed, fullscreen */}
            <div className="flex items-center gap-4">
              {/* Volume */}
              <button
                onClick={toggleMute}
                className="
                  h-8 w-8 rounded-full bg-white/5 hover:bg-white/15
                  flex items-center justify-center
                "
              >
                {muted || volume === 0 ? (
                  <IoVolumeMute className="text-white" />
                ) : (
                  <IoVolumeHigh className="text-white" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 accent-white cursor-pointer"
              />

              {/* Speed */}
              <button
                onClick={changePlaybackRate}
                className="
                  px-3 py-1 rounded-full
                  bg-white/5 hover:bg-white/15 text-xs
                "
              >
                {playbackRate}x
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="
                  h-8 w-8 rounded-full bg-white/5 hover:bg-white/15
                  flex items-center justify-center
                "
              >
                {isFullscreen ? (
                  <IoContract className="text-white" />
                ) : (
                  <IoExpand className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END OVERLAY */}
      {ended && (
        <div
          className="
            absolute inset-0 
            bg-black/75 backdrop-blur-md
            flex items-center justify-center gap-8
            text-white
          "
        >
          {onPrev && (
            <button
              onClick={onPrev}
              className="
                h-16 w-16 rounded-full
                bg-white/10 hover:bg-white/20
                flex items-center justify-center
              "
            >
              <IoPlaySkipBack size={28} />
            </button>
          )}

          <button
            onClick={() => {
              if (!videoRef.current) return;
              videoRef.current.currentTime = 0;
              videoRef.current.play();
              setEnded(false);
              setPlaying(true);
              setShowControls(true);
              scheduleHideControls();
            }}
            className="
              relative
              h-20 w-20 rounded-full
              bg-transparent
              flex items-center justify-center
              hover:scale-110 transition
            "
          >
            <span
              className="
                absolute inset-0 bg-white/15 rounded-full blur-2xl
              "
            />
            <IoPlay size={32} className="translate-x-[2px]" />
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="
                h-16 w-16 rounded-full
                bg-white/10 hover:bg-white/20
                flex items-center justify-center
              "
            >
              <IoPlaySkipForward size={28} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomPlayer;
