"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// Slider behavior and playback synchronization are adapted from video-compare
// v0.0.7 (MIT). The supplied source and license are retained in /vendor/video-compare.

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
  const shellRef = useRef<HTMLDivElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
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

    const pauseWhenHidden = () => {
      if (document.hidden) {
        left.pause();
        right.pause();
      } else {
        void Promise.allSettled([left.play(), right.play()]);
      }
    };

    const interval = window.setInterval(sync, 1000);
    left.addEventListener("play", sync);
    left.addEventListener("pause", sync);
    document.addEventListener("visibilitychange", pauseWhenHidden);

    return () => {
      window.clearInterval(interval);
      left.removeEventListener("play", sync);
      left.removeEventListener("pause", sync);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [hasVideoPair, nearViewport, leftVideo, rightVideo]);

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
  leftImage: string;
  rightImage: string;
  leftVideo?: string;
  rightVideo?: string;
};

export function SceneComparison({ scenes }: { scenes: ComparisonScene[] }) {
  const [activeId, setActiveId] = useState(scenes[0]?.id ?? "");
  const active = scenes.find((scene) => scene.id === activeId) ?? scenes[0];

  if (!active) return null;

  return (
    <div className="scene-comparison">
      <div className="scene-buttons" role="group" aria-label="Select a scene">
        {scenes.map((scene) => (
          <button
            type="button"
            key={scene.id}
            className={scene.id === active.id ? "active" : undefined}
            aria-pressed={scene.id === active.id}
            onClick={() => setActiveId(scene.id)}
          >
            {scene.name}
          </button>
        ))}
      </div>
      <MediaComparison
        key={active.id}
        leftLabel="FSGS"
        rightLabel="Ours"
        leftImage={active.leftImage}
        rightImage={active.rightImage}
        leftVideo={active.leftVideo}
        rightVideo={active.rightVideo}
        leftPoster={active.leftImage}
        rightPoster={active.rightImage}
      />
      <p className="scene-caption">
        <strong>{active.name}.</strong> Off-trajectory novel view from Figure 9.
      </p>
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
      <button type="button" onClick={copy}>
        {copied ? "Copied" : "Copy BibTeX"}
      </button>
      <pre>
        <code>{value}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {copied ? "BibTeX copied to clipboard" : ""}
      </span>
    </div>
  );
}
