"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// Slider behavior and playback synchronization are adapted from video-compare
// v0.0.7 (MIT). The supplied source and license are retained in /vendor/video-compare.

const COMPARISON_PLAYBACK_RATE = 0.7;

type MediaComparisonProps = {
  leftLabel: string;
  rightLabel: string;
  leftVideo?: string;
  rightVideo?: string;
  leftImage?: string;
  rightImage?: string;
  leftPoster?: string;
  rightPoster?: string;
  eager?: boolean;
};

export function MediaComparison({
  leftLabel,
  rightLabel,
  leftVideo,
  rightVideo,
  leftImage,
  rightImage,
  leftPoster,
  rightPoster,
  eager = false,
}: MediaComparisonProps) {
  const [position, setPosition] = useState(50);
  const [nearViewport, setNearViewport] = useState(eager);
  const [isPlaying, setIsPlaying] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const rangeId = useId();
  const hasVideoPair = Boolean(leftVideo && rightVideo);

  useEffect(() => {
    if (eager || nearViewport || !shellRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, [eager, nearViewport]);

  useEffect(() => {
    if (!hasVideoPair || !nearViewport) return;
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    left.defaultPlaybackRate = COMPARISON_PLAYBACK_RATE;
    right.defaultPlaybackRate = COMPARISON_PLAYBACK_RATE;
    left.playbackRate = COMPARISON_PLAYBACK_RATE;
    right.playbackRate = COMPARISON_PLAYBACK_RATE;

    const sync = () => {
      if (left.readyState < 2 || right.readyState < 2) return;
      if (Math.abs(left.currentTime - right.currentTime) > 0.08) {
        right.currentTime = left.currentTime;
      }
      if (left.paused !== right.paused) {
        if (left.paused) right.pause();
        else void right.play().catch(() => undefined);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      sync();
    };

    const handlePause = () => {
      setIsPlaying(false);
      sync();
    };

    const pauseWhenHidden = () => {
      if (document.hidden) {
        left.pause();
        right.pause();
      } else if (!userPausedRef.current) {
        void Promise.allSettled([left.play(), right.play()]);
      }
    };

    const interval = window.setInterval(sync, 1000);
    left.addEventListener("play", handlePlay);
    left.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", pauseWhenHidden);

    return () => {
      window.clearInterval(interval);
      left.removeEventListener("play", handlePlay);
      left.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [hasVideoPair, nearViewport, leftVideo, rightVideo]);

  const togglePlayback = useCallback(() => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    if (left.paused || right.paused) {
      userPausedRef.current = false;
      right.currentTime = left.currentTime;
      left.playbackRate = COMPARISON_PLAYBACK_RATE;
      right.playbackRate = COMPARISON_PLAYBACK_RATE;
      void Promise.allSettled([left.play(), right.play()]).then(() => {
        setIsPlaying(!left.paused && !right.paused);
      });
    } else {
      userPausedRef.current = true;
      left.pause();
      right.pause();
      setIsPlaying(false);
    }
  }, []);

  const updateFromPointer = useCallback((event: React.PointerEvent) => {
    const bounds = shellRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const next = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  const renderMedia = (side: "left" | "right") => {
    const video = side === "left" ? leftVideo : rightVideo;
    const image = side === "left" ? leftImage : rightImage;
    const poster = side === "left" ? leftPoster : rightPoster;
    const videoRef = side === "left" ? leftVideoRef : rightVideoRef;
    const label = side === "left" ? leftLabel : rightLabel;

    if (hasVideoPair) {
      return (
        <video
          ref={videoRef}
          src={nearViewport ? video : undefined}
          poster={poster}
          preload="none"
          autoPlay
          muted
          loop
          playsInline
          aria-label={`${label} result video`}
        />
      );
    }

    return image ? (
      <img
        src={image}
        alt={`${label} rendering`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    ) : (
      <div className="media-missing" role="img" aria-label={`${label} media pending`}>
        Result media pending
      </div>
    );
  };

  return (
    <div
      className="comparison-shell"
      ref={shellRef}
      onPointerDown={updateFromPointer}
    >
      <div className="comparison-layer comparison-base">{renderMedia("right")}</div>
      <div
        className="comparison-layer comparison-reveal"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {renderMedia("left")}
      </div>

      <span className="comparison-label comparison-label-left">{leftLabel}</span>
      <span className="comparison-label comparison-label-right">{rightLabel}</span>

      {hasVideoPair ? (
        <button
          type="button"
          className="comparison-playback-button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={togglePlayback}
          aria-label={`${isPlaying ? "Pause" : "Play"} comparison videos`}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m8 5 11 7-11 7z" />
            </svg>
          )}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
      ) : null}

      <div className="comparison-handle" style={{ left: `${position}%` }} aria-hidden>
        <span>‹ ›</span>
      </div>

      <label className="sr-only" htmlFor={rangeId}>
        Reveal position comparing {leftLabel} and {rightLabel}
      </label>
      <input
        id={rangeId}
        className="comparison-range"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${position}% ${leftLabel}, ${100 - position}% ${rightLabel}`}
      />
    </div>
  );
}

export type ComparisonScene = {
  id: string;
  name: string;
  oursVideo: string;
  methods: ComparisonMethod[];
};

export type ComparisonMethod = {
  id: string;
  name: string;
  video: string;
};

export function SceneComparison({ scenes }: { scenes: ComparisonScene[] }) {
  const [activeId, setActiveId] = useState(scenes[0]?.id ?? "");
  const [activeMethodId, setActiveMethodId] = useState(scenes[0]?.methods[0]?.id ?? "");
  const active = scenes.find((scene) => scene.id === activeId) ?? scenes[0];
  const activeMethod = active?.methods.find((method) => method.id === activeMethodId) ?? active?.methods[0];

  if (!active || !activeMethod) return null;

  return (
    <div className="scene-comparison">
      <div className="scene-buttons" role="group" aria-label="Select a scene">
        {scenes.map((scene) => (
          <button
            type="button"
            key={scene.id}
            className={scene.id === active.id ? "active" : undefined}
            aria-pressed={scene.id === active.id}
            onClick={() => {
              setActiveId(scene.id);
              setActiveMethodId(scene.methods[0]?.id ?? "");
            }}
          >
            {scene.name}
          </button>
        ))}
      </div>
      <p className="comparison-control-label">Baseline method</p>
      <div className="scene-buttons method-buttons" role="group" aria-label="Select a baseline method">
        {active.methods.map((method) => (
          <button
            type="button"
            key={method.id}
            className={method.id === activeMethod.id ? "active" : undefined}
            aria-pressed={method.id === activeMethod.id}
            onClick={() => setActiveMethodId(method.id)}
          >
            {method.name}
          </button>
        ))}
      </div>
      <MediaComparison
        key={`${active.id}-${activeMethod.id}`}
        leftLabel={activeMethod.name}
        rightLabel="Ours"
        leftVideo={activeMethod.video}
        rightVideo={active.oursVideo}
      />
    </div>
  );
}

export function CitationBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="citation-block">
      <div className="citation-block-header">
        <h3>BibTeX</h3>
        <button type="button" onClick={copy}>
          <span aria-hidden="true">▣</span>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{value}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copied ? "BibTeX copied to clipboard" : ""}
      </span>
    </div>
  );
}
