import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Button } from "@/components/ui/button";
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

const CliniciansVideoCarousel: React.FC<CliniciansVideoCarouselProps> = ({ therapists }) => {
  const [playingVideo, setPlayingVideo] = useState<{ videoId: string; therapistName: string } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const list = useMemo(() => therapists.filter(t => t.name), [therapists]);
  const autoScroll = useMemo(() => AutoScroll({
    speed: 0.35,
    startDelay: 1500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    stopOnFocusIn: true,
    playOnInit: !reducedMotion,
  }), [reducedMotion]);
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, align: "center", watchSlides: true }, reducedMotion ? [] : [autoScroll]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const updateCoverflow = useCallback(() => {
    if (!carousel) return;
    const engine = carousel.internalEngine();
    const width = engine.containerRect.width;
    const position = engine.location.get();
    carousel.slideNodes().forEach((slide, index) => {
      const face = slide.querySelector<HTMLElement>("[data-cf]");
      const rect = engine.slideRects[index];
      if (!face || !rect) return;
      const loopOffset = engine.slideLooper.loopPoints.find(point => point.index === index)?.target() ?? 0;
      const center = rect.left - engine.containerRect.left + rect.width / 2 + position + loopOffset;
      const distance = Math.max(-1, Math.min(1, (center - width / 2) / (width / 1.6)));
      face.style.transform = reducedMotion ? "none" : `perspective(1200px) rotateY(${-distance * 18}deg) scale(${1 - Math.abs(distance) * 0.12})`;
    });
  }, [carousel, reducedMotion]);
  useEffect(() => {
    if (!carousel) return;
    updateCoverflow();
    carousel.on("scroll", updateCoverflow).on("reInit", updateCoverflow);
    return () => { carousel.off("scroll", updateCoverflow).off("reInit", updateCoverflow); };
  }, [carousel, updateCoverflow]);
  const nudge = (dir: 1 | -1) => {
    if (!carousel) return;
    autoScroll.stop();
    if (dir === 1) carousel.scrollNext();
    else carousel.scrollPrev();
  };

  const openClinician = (t: Therapist) => {
    const videoId = getYouTubeVideoId(t.introVideoUrl);
    if (videoId) setPlayingVideo({ videoId, therapistName: t.name });
    else if (t.bookingLink) window.open(t.bookingLink, "_blank", "noopener,noreferrer");
  };

  if (list.length === 0) return null;

  return (
    <>
      <section className="w-full max-w-7xl mx-auto py-14 bg-background">
        <div className="relative mb-6 px-4 text-center">
          <div className="sm:px-24">
            <h2 className="text-3xl font-normal text-foreground">Meet Our Clinicians</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Watch a short introduction or visit a clinician's profile.
            </p>
          </div>
          <div className="hidden sm:flex gap-2 absolute right-4 bottom-0">
            <Button variant="outline" size="icon" aria-label="Previous clinicians" title="Previous clinicians" onClick={() => nudge(-1)}
              className="h-9 w-9 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="More clinicians" title="More clinicians" onClick={() => nudge(1)}
              className="h-9 w-9 rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={viewportRef}
          aria-label="Clinicians"
          className="overflow-hidden touch-pan-y"
        >
          <div className="relative flex py-6 [backface-visibility:hidden] will-change-transform">
          {list.map((t) => {
            const videoId = getYouTubeVideoId(t.introVideoUrl);
            const image = t.photo;
            const locations = Array.from(new Set([...(t.inPersonLocations ?? [])]));
            const isOnline = (t.onlineLocations ?? []).length > 0;
            return (
              <article
                key={t.id}
                className="relative shrink-0 grow-0 basis-[280px] sm:basis-[320px] min-w-0 overflow-hidden px-2.5"
              >
                <div data-cf className="will-change-transform [backface-visibility:hidden]">
                <Button asChild variant="ghost"
                  onClick={() => openClinician(t)}
                  aria-label={videoId ? `Play ${t.name}'s introduction video` : `Open ${t.name}'s profile`}
                  className="group block h-auto w-full p-0 text-left whitespace-normal hover:bg-transparent"
                >
                  <button type="button">
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
                </Button>
                {t.bookingLink && (
                  <a href={t.bookingLink} target="_blank" rel="noopener noreferrer"
                    className="mt-3 mx-1 inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">
                    <CalendarCheck className="h-4 w-4" /> Book appointment
                  </a>
                )}
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </section>

      {playingVideo && (
        <FloatingVideoPlayer videoId={playingVideo.videoId} therapistName={playingVideo.therapistName} onClose={() => setPlayingVideo(null)} />
      )}
    </>
  );
};

export default CliniciansVideoCarousel;
