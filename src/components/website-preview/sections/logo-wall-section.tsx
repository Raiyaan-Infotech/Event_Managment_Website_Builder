"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ThemeColors } from "./preview-shared";

export interface TeamMember {
  id: string;
  name: string;
  photoUrl: string;
  role?: string;
  href?: string;
}

function LogoWallSectionBase({
  title,
  members,
  theme,
  kind,
  muted = false,
}: {
  title: string;
  members: TeamMember[];
  theme: ThemeColors;
  kind: "clients" | "sponsors";
  muted?: boolean;
}) {
  if (!members.length) return null;

  const loopMembers = [...members, ...members];
  const baseDurationSec = Math.min(Math.max(members.length * 4, 18), 60);
  const durationSec =
    kind === "sponsors"
      ? Math.min(Math.round(baseDurationSec * 1.35 + 5), 86)
      : baseDurationSec;
  const fadeFrom = muted ? "from-slate-50" : "from-white";

  return (
    <section
      className={cn(
        "w-full border-t border-slate-100 py-14 sm:py-16",
        muted ? "bg-slate-50" : "bg-white",
      )}
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-10 text-center">
            <h2
              className="text-[28px] font-black leading-tight tracking-tight sm:text-[36px]"
              style={{ color: theme.primaryText }}
            >
              {title}
            </h2>
            <div
              className="mx-auto mt-3 h-[3px] w-12 rounded-full"
              style={{ backgroundColor: theme.primaryButton }}
            />
          </div>
        )}

        <div className="lw-marquee-wrap group relative overflow-hidden">
          {/* edge fades */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent sm:w-20",
              fadeFrom,
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l to-transparent sm:w-20",
              fadeFrom,
            )}
          />

          <div
            className="lw-marquee-track flex w-max items-start gap-4"
            style={{
              animationName: "lw-marquee",
              animationDuration: `${durationSec}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDirection: kind === "sponsors" ? "reverse" : "normal",
            }}
          >
            {loopMembers.map((member, index) => {
              const linkHref =
                member.href && member.href !== "#" ? member.href : "";
              const Wrapper = linkHref ? "a" : "div";
              const wrapperProps = linkHref
                ? { href: linkHref, target: "_blank", rel: "noopener noreferrer" }
                : {};

              const displayName = member.name || "";

              return (
                <Wrapper
                  key={`${member.id}-${index}`}
                  {...(wrapperProps as React.HTMLAttributes<HTMLElement>)}
                  aria-hidden={index >= members.length || undefined}
                  className="flex h-[160px] w-[240px] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[var(--preview-card-radius)] bg-white p-0 shadow-sm"
                  style={{ border: `1px solid ${theme.primaryButton}1A` }}
                >
                  
                  {/* Logo / photo — fills the curved frame to match the card */}
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[var(--preview-card-radius)]">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={displayName}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lw-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .lw-marquee-wrap:hover .lw-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .lw-marquee-track { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

export const LogoWallSection = React.memo(LogoWallSectionBase);
