"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { QrCode, BarChart3, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Create QR codes in seconds with real-time preview",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Colors, logos, and dot styles to match your brand",
  },
  {
    icon: BarChart3,
    title: "Scan Analytics",
    description: "Track scans with location, device, and time data",
  },
];

export function AuthPageLayout({ children }: { children: React.ReactNode }) {
  const formRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    // Check if Clerk already rendered
    if (el.querySelector("[data-clerk-component]") || el.children.length > 0) {
      setLoaded(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (el.children.length > 0) {
        setLoaded(true);
        observer.disconnect();
      }
    });

    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel — branding & features */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,91,40,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(196,91,40,0.08),transparent_60%)]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Top — Logo & tagline */}
          <div>
            <p className="mt-4 max-w-sm text-lg font-medium leading-relaxed text-gray-300">
              Create, customize, and track QR codes.{" "}
              <span className="text-primary-light">Free for everyone.</span>
            </p>
          </div>

          {/* Middle — Feature cards */}
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex items-start gap-4 rounded-2xl border border-white/6 bg-white/3 p-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-white/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom — decorative note */}
          <div className="flex items-center gap-3 text-gray-500">
            <QrCode className="h-4 w-4 text-primary/40" />
            <span className="text-xs tracking-wide">
              Trusted by thousands of creators worldwide
            </span>
          </div>
        </div>
      </div>

      {/* Right panel — Clerk form */}
      <div className="relative flex flex-1 items-center justify-center bg-gray-950 px-4 py-12 sm:px-8">

        {/* Loading skeleton — shown while Clerk loads */}
        {!loaded && (
          <div className="absolute flex w-full max-w-[400px] flex-col items-center gap-6">
            <div className="auth-skeleton-pulse h-8 w-32 rounded-lg bg-gray-800/60" />
            <div className="auth-skeleton-pulse h-5 w-56 rounded bg-gray-800/40" />
            <div className="mt-2 w-full space-y-4">
              <div className="auth-skeleton-pulse h-11 w-full rounded-xl bg-gray-800/50" />
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-800/40" />
                <div className="auth-skeleton-pulse h-4 w-6 rounded bg-gray-800/30" />
                <div className="h-px flex-1 bg-gray-800/40" />
              </div>
              <div className="auth-skeleton-pulse h-5 w-28 rounded bg-gray-800/40" />
              <div className="auth-skeleton-pulse h-11 w-full rounded-xl bg-gray-800/50" />
              <div className="auth-skeleton-pulse h-11 w-full rounded-xl bg-gray-800/60" />
            </div>
          </div>
        )}

        {/* Clerk component */}
        <div
          ref={formRef}
          className={`relative z-10 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
