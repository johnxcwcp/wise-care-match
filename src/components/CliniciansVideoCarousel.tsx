import React, { useEffect, useRef, useState } from "react";
import { Play, UserRound, MapPin, Video, CalendarCheck, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Therapist } from "@/types";
import FloatingVideoPlayer from "./FloatingVideoPlayer";

interface CliniciansVideoCarouselProps {
  therapists: Therapist[];
}

const getYouTubeVideoId = (url?: string) => {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
};

const SPEED = 0.35; // px per frame

const CliniciansVideoCarousel: React.FC<CliniciansVideoCarouselProps> = ({ therapists }) => {
  const [playingVideo, setPlayingVideo] = useState<{ videoId: string; therapistName: string } | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<number>();

  const list = therapists.filter(t => t.name);
  const loop = [...list, ...list];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || list.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let pos = el.scrollLeft;

    const style = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      el.querySelectorAll<HTMLElement>("[data-cf]").forEach(card => {
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.max(-1, Math.min(1, (c - center) / (el.clientWidth / 1.6)));
        const a = Math.abs(d);
        card.style.transform = `perspective(1200px) rotateY(${-d * 18}deg) scale(${1 - a * 0.12})`;
        card.style.opacity = `${1 - a * 0.35}`;
        card.style.zIndex = `${Math.round(100 - a * 100)}`;
      });
    };

    const tick = () => {
      const half = el.scrollWidth / 2;
      if (!pausedRef.current && !reduce) {
        pos += SPEED;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
        if (pos >= half) { pos -= half; el.scrollLeft = pos; }
      }
      style();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [list.length]);

  if (list.length === 0) return null;

  const pause = () => { window.clearTimeout(resumeTimer.current); pausedRef.current = true; };
  const resume = (delay = 1500) => {
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => { pausedRef.current = false; }, delay);
  };

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    pause();
    const card = el.querySelector<HTMLElement>("[data-cf]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
    resume(3000);
  };

  const openClinician = (t: Therapist) => {
    const videoId = getYouTubeVideoId(t.introVideoUrl);
    if (videoId) setPlayingVideo({ videoId, therapistName: t.name });
    else if (t.bookingLink) window.open(t.bookingLink, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="w-full max-w-7xl mx-auto py-14 bg-background">
        <div className="flex items-end justify-between gap-4 mb-6 px-4">
          <div>
            <h2 className="text-3xl font-normal text-foreground">Meet Our Clinicians</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Watch a short introduction or visit a clinician's profile.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button aria-label="Previous clinicians" onClick={() => nudge(-1)}
              className="h-9 w-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button aria-label="More clinicians" onClick={() => nudge(1)}
              className="h-9 w-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          onMouseEnter={pause}
          onMouseLeave={() => resume(600)}
          onTouchStart={pause}
          onTouchEnd={() => resume(2500)}
          onWheel={() => { pause(); resume(2000); }}
          className="relative flex gap-5 overflow-x-auto py-6 px-[8%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          {loop.map((t, i) => {
            const videoId = getYouTubeVideoId(t.introVideoUrl);
            const image = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : t.photo;
            const locations = Array.from(new Set([...(t.inPersonLocations ?? [])]));
            const isOnline = (t.onlineLocations ?? []).length > 0;
            return (
              <article
                key={`${t.id}-${i}`}
                data-cf
                aria-hidden={i >= list.length}
                className="shrink-0 w-[260px] sm:w-[300px] will-change-transform"
              >
                <button
                  onClick={() => openClinician(t)}
                  tabIndex={i >= list.length ? -1 : 0}
                  aria-label={videoId ? `Play ${t.name}'s introduction video` : `Open ${t.name}'s profile`}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary border border-border/60">
                    {image ? (
                      <img src={image} alt={t.name} loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <UserRound className="h-12 w-12" strokeWidth={1.25} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/40 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-card/95 backdrop-blur px-3 py-1 text-xs text-foreground shadow-sm">
                      {videoId ? <><Play className="h-3 w-3 fill-current" /> Intro video</> : <><UserRound className="h-3 w-3" /> View profile</>}
                    </span>
                    <span className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-card/95 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                      {videoId ? <Play className="h-4 w-4 fill-current ml-0.5" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                  </div>
                  <div className="pt-3 px-1">
                    <h3 className="text-base text-foreground truncate">{t.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {[t.pronouns, t.designation].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {locations.length > 0 && (
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{locations.join(", ")}</span>
                      )}
                      {isOnline && (
                        <span className="inline-flex items-center gap-1"><Video className="h-3.5 w-3.5" />Online</span>
                      )}
                    </div>
                  </div>
                </button>
                {t.bookingLink && (
                  <a href={t.bookingLink} target="_blank" rel="noopener noreferrer" tabIndex={i >= list.length ? -1 : 0}
                    className="mt-3 mx-1 inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">
                    <CalendarCheck className="h-4 w-4" /> Book appointment
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {playingVideo && (
        <FloatingVideoPlayer videoId={playingVideo.videoId} therapistName={playingVideo.therapistName} onClose={() => setPlayingVideo(null)} />
      )}
    </>
  );
};

export default CliniciansVideoCarousel;
