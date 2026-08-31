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
  <div ref={containerRef} className="w-full max-w-full" style={{ maxWidth: '100%' }}>
    {/* Aspect-box: 16:9 frame */}
    <div
      className="relative bg-black rounded-2xl overflow-hidden"
      style={{ paddingTop: '56.25%' }} /* 16:9 */
      onMouseMove={handleMouseMove}
    >
      {/* VIDEO: contain inside 16:9, centered, no hairline */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="absolute inset-0 w-full h-full object-contain bg-black block"
        style={{ objectPosition: 'center center', display: 'block' }}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* CENTER PLAY (same logic) */}
      {!ended && !playing && (
        <button
          onClick={handlePlayPause}
          aria-label="Play"
          className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            h-20 w-20 sm:h-24 sm:w-24 rounded-full
            flex items-center justify-center transition-transform hover:scale-105 active:scale-110 z-30
          "
        >
          {ripple && <span className="absolute inset-0 rounded-full bg-white/20 animate-ripple" />}
          <span className="absolute inset-0 rounded-full bg-white/10 blur-3xl opacity-70" />
          <IoPlay size={32} className="text-white translate-x-[2px]" />
        </button>
      )}

      {/* CONTROLS: ensure inside and above video */}
      {!ended && showControls && (
        <div
          className="
            absolute left-0 right-0 bottom-0 z-40
            px-3 py-2 sm:px-4 sm:py-3
            bg-gradient-to-t from-black/85 via-black/60 to-transparent
            flex flex-col gap-2
          "
        >  
          <div
            onClick={handleSeek}
            className="
              w-full
              h-[2px]                     
              bg-white/25                
              rounded-full
              cursor-pointer
              group
              relative
            "
          >
            {/* Progress Line */}
            <div
              className=" absolute left-0 top-0  h-full  bg-white  rounded-full  transition-[width] duration-150 "
              style={{ width: `${progress}%` }}
            />

            {/* Tiny handle dot (only visible on hover) */}
            <div
              className=" absolute top-1/2 -translate-y-1/2 h-2 w-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 "
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          {/* Row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={handlePlayPause} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <IoPause size={18} className="text-white" /> : <IoPlay size={18} className="text-white translate-x-[1px]" />}
              </button>

              <span className="text-xs text-white/80 tabular-nums">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={toggleMute} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center" aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted || volume === 0 ? <IoVolumeMute className="text-white" /> : <IoVolumeHigh className="text-white" />}
              </button>

              <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={handleVolumeChange} className="hidden sm:block w-20 accent-white cursor-pointer" aria-label="Volume" />

              <button onClick={changePlaybackRate} className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/5 hover:bg-white/15 text-xs" aria-label="Playback speed">
                {playbackRate}x
              </button>

              <button onClick={toggleFullscreen} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                {isFullscreen ? <IoContract className="text-white" /> : <IoExpand className="text-white" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END OVERLAY (same) */}
      {ended && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center gap-6 sm:gap-8 text-white z-40">
          {onPrev && <button onClick={onPrev} className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Previous"><IoPlaySkipBack size={24} /></button>}

          <button onClick={() => { if (!videoRef.current) return; videoRef.current.currentTime = 0; videoRef.current.play(); setEnded(false); setPlaying(true); setShowControls(true); scheduleHideControls(); }} className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center hover:scale-105 transition" aria-label="Replay">
            <span className="absolute inset-0 bg-white/15 rounded-full blur-2xl" />
            <IoPlay size={28} className="translate-x-[2px]" />
          </button>

          {onNext && <button onClick={onNext} className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Next"><IoPlaySkipForward size={24} /></button>}
        </div>
      )}
    </div>
  </div>
);

};

export default CustomPlayer;
