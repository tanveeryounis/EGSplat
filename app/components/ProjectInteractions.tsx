"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// Slider behavior and playback synchronization are adapted from video-compare
// v0.0.7 (MIT). The supplied source and license are retained in /vendor/video-compare.

const COMPARISON_PLAYBACK_RATE = 0.7;
const MIN_PLAYABLE_READY_STATE = 3;
const SYNC_INTERVAL_MS = 250;
const MAX_DRIFT_SECONDS = 0.06;

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
  const hasVideoPair = Boolean(leftVideo && rightVideo);
  const [position, setPosition] = useState(50);
  const [nearViewport, setNearViewport] = useState(eager);
  const [isVisible, setIsVisible] = useState(eager);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(hasVideoPair);
  const shellRef = useRef<HTMLDivElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const rangeId = useId();

  useEffect(() => {
    if (eager || nearViewport || !shellRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, [eager, nearViewport]);

  useEffect(() => {
    if (!shellRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.05);
      },
      { threshold: [0, 0.05, 0.2] },
    );

    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasVideoPair || !nearViewport) return;
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    let cancelled = false;
    let bufferingPause = false;

    const applyPlaybackRate = () => {
      left.defaultPlaybackRate = COMPARISON_PLAYBACK_RATE;
      right.defaultPlaybackRate = COMPARISON_PLAYBACK_RATE;
      left.playbackRate = COMPARISON_PLAYBACK_RATE;
      right.playbackRate = COMPARISON_PLAYBACK_RATE;
    };

    const pairReady = () =>
      left.readyState >= MIN_PLAYABLE_READY_STATE &&
      right.readyState >= MIN_PLAYABLE_READY_STATE;

    const alignPair = (force = false) => {
      if (left.readyState < 2 || right.readyState < 2) return;
      const drift = Math.abs(left.currentTime - right.currentTime);
      if (force || drift > MAX_DRIFT_SECONDS) {
        right.currentTime = left.currentTime;
      }
    };

    const pauseBoth = () => {
      left.pause();
      right.pause();
    };

    const resumeTogether = async () => {
      if (
        cancelled ||
        userPausedRef.current ||
        document.hidden ||
        !isVisible
      ) {
        return;
      }

      if (!pairReady()) {
        setIsBuffering(true);
        return;
      }

      applyPlaybackRate();
      alignPair(true);

      const results = await Promise.allSettled([left.play(), right.play()]);
      if (cancelled) return;

      const bothPlaying =
        results.every((result) => result.status === "fulfilled") &&
        !left.paused &&
        !right.paused;

      setIsPlaying(bothPlaying);
      setIsBuffering(!bothPlaying);
    };

    const handleBuffering = () => {
      if (userPausedRef.current || document.hidden || !isVisible) return;
      bufferingPause = true;
      setIsBuffering(true);
      pauseBoth();
    };

    const handleReady = () => {
      if (userPausedRef.current || document.hidden || !isVisible) return;
      if (pairReady() && (bufferingPause || left.paused || right.paused)) {
        bufferingPause = false;
        void resumeTogether();
      }
    };

    const handlePlaying = () => {
      if (!left.paused && !right.paused) {
        bufferingPause = false;
        setIsBuffering(false);
        setIsPlaying(true);
      }
    };

    const handleVisibility = () => {
      if (document.hidden || !isVisible) {
        pauseBoth();
        return;
      }
      if (!userPausedRef.current) {
        void resumeTogether();
      }
    };

    const sync = () => {
      if (userPausedRef.current || document.hidden || !isVisible) return;

      if (!pairReady()) {
        handleBuffering();
        return;
      }

      if (left.paused !== right.paused) {
        bufferingPause = true;
        setIsBuffering(true);
        pauseBoth();
        void resumeTogether();
        return;
      }

      if (!left.paused && !right.paused) {
        alignPair();
      }
    };

    applyPlaybackRate();

    const bufferingEvents = ["waiting", "stalled"] as const;
    const readyEvents = ["loadeddata", "canplay", "canplaythrough"] as const;

    bufferingEvents.forEach((eventName) => {
      left.addEventListener(eventName, handleBuffering);
      right.addEventListener(eventName, handleBuffering);
    });
    readyEvents.forEach((eventName) => {
      left.addEventListener(eventName, handleReady);
      right.addEventListener(eventName, handleReady);
    });
    left.addEventListener("playing", handlePlaying);
    right.addEventListener("playing", handlePlaying);
    document.addEventListener("visibilitychange", handleVisibility);

    const interval = window.setInterval(sync, SYNC_INTERVAL_MS);

    if (isVisible) {
      void resumeTogether();
    } else {
      pauseBoth();
    }

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      bufferingEvents.forEach((eventName) => {
        left.removeEventListener(eventName, handleBuffering);
        right.removeEventListener(eventName, handleBuffering);
      });
      readyEvents.forEach((eventName) => {
        left.removeEventListener(eventName, handleReady);
        right.removeEventListener(eventName, handleReady);
      });
      left.removeEventListener("playing", handlePlaying);
      right.removeEventListener("playing", handlePlaying);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [hasVideoPair, nearViewport, isVisible, leftVideo, rightVideo]);

  const togglePlayback = useCallback(() => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    if (left.paused || right.paused) {
      userPausedRef.current = false;
      setIsPlaying(true);
      if (
        left.readyState >= MIN_PLAYABLE_READY_STATE &&
        right.readyState >= MIN_PLAYABLE_READY_STATE
      ) {
        right.currentTime = left.currentTime;
        left.playbackRate = COMPARISON_PLAYBACK_RATE;
        right.playbackRate = COMPARISON_PLAYBACK_RATE;
        void Promise.allSettled([left.play(), right.play()]).then(() => {
          const bothPlaying = !left.paused && !right.paused;
          setIsPlaying(bothPlaying);
          setIsBuffering(!bothPlaying);
        });
      } else {
        setIsBuffering(true);
      }
    } else {
      userPausedRef.current = true;
      left.pause();
      right.pause();
      setIsPlaying(false);
      setIsBuffering(false);
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
          preload="auto"
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
          aria-label={`$${
            isBuffering ? "Buffering" : isPlaying ? "Pause" : "Play"
          } comparison videos`}
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
          <span>{isBuffering ? "Buffering…" : isPlaying ? "Pause" : "Play"}</span>
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
