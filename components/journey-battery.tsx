"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { gsap } from "@/lib/gsap";

/**
 * HUBCHARGE JOURNEY - Premium UX Redesign
 */

const journeySteps = [
  { id: 1, title: "ARRIVE", subtitle: "Attendant greets you" },
  { id: 2, title: "TAP", subtitle: "Quick QR payment" },
  { id: 3, title: "CHARGE & RELAX", subtitle: "Attendant plugs you in" },
  { id: 4, title: "ENJOY", subtitle: "Food & coffee delivered" },
  { id: 5, title: "GO", subtitle: "Attendant unplugs • You're done" },
];

// ============================================
// SVG COMPONENTS — visually refined
// ============================================

function CarSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  // Use unique ID for gradients to avoid conflicts with multiple SVG instances
  const id = useRef(Math.random().toString(36).substring(7)).current;

  return (
    <svg viewBox="0 0 200 70" className={className} style={style}>
      <defs>
        <linearGradient id={`carBody-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <linearGradient id={`glass-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.65" />
        </linearGradient>

        <linearGradient id={`sheen-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`wheel-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="100" cy="64" rx="75" ry="4" fill="#020617" opacity="0.15" />

      {/* main body */}
      <path
        d="M20 46
           C25 36 40 30 55 30
           L135 30
           C150 30 165 36 175 46
           L180 50
           C182 53 180 56 170 56
           L30 56
           C20 56 18 53 20 50Z"
        fill={`url(#carBody-${id})`}
      />

      {/* reflection */}
      <path
        d="M20 46
           C25 36 40 30 55 30
           L135 30
           C150 30 165 36 175 46"
        stroke={`url(#sheen-${id})`}
        strokeWidth="4"
        fill="none"
      />

      {/* roof */}
      <path
        d="M60 30
           C70 16 120 16 130 30
           Z"
        fill={`url(#carBody-${id})`}
      />

      {/* glass */}
      <path
        d="M66 30
           C74 20 116 20 124 30
           Z"
        fill={`url(#glass-${id})`}
      />

      {/* panoramic roof divider */}
      <line
        x1="100"
        y1="21"
        x2="100"
        y2="30"
        stroke="#7dd3fc"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* front wheel */}
      <circle cx="60" cy="54" r="11" fill={`url(#wheel-${id})`} />
      <circle cx="60" cy="54" r="6" fill="#334155" />
      <circle cx="60" cy="54" r="2" fill="#94a3b8" />

      {/* rear wheel */}
      <circle cx="140" cy="54" r="11" fill={`url(#wheel-${id})`} />
      <circle cx="140" cy="54" r="6" fill="#334155" />
      <circle cx="140" cy="54" r="2" fill="#94a3b8" />

      {/* LED headlight */}
      <rect
        x="15"
        y="44"
        width="7"
        height="3"
        rx="1"
        fill="#f8fafc"
        opacity="0.9"
      />

      {/* LED rear light bar */}
      <rect x="178" y="45" width="6" height="3" rx="1" fill="#fb7185" />

      {/* charge port glow */}
      <circle cx="155" cy="36" r="3" fill="#22d3ee" opacity="0.9" />
      <circle cx="155" cy="36" r="6" fill="#22d3ee" opacity="0.12" />
    </svg>
  );
}

function ValetSVG({
  className = "",
  style = {},
  holding = "terminal",
}: {
  className?: string;
  style?: React.CSSProperties;
  holding?: "terminal" | "food" | "cable";
}) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style}>
      <ellipse cx="30" cy="97" rx="11" ry="2" fill="#0f172a" opacity="0.07" />

      {/* Legs */}
      <rect x="22" y="62" width="7" height="33" rx="3.5" fill="#1e293b" />
      <rect x="31" y="62" width="7" height="33" rx="3.5" fill="#1e293b" />

      {/* Uniform body */}
      <path
        d="M17,34 Q17,27 30,27 Q43,27 43,34 L45,62 L15,62 Z"
        fill="#ea580c"
      />
      {/* Uniform chest pocket */}
      <rect
        x="24"
        y="36"
        width="8"
        height="9"
        rx="1.5"
        fill="#fff"
        opacity="0.15"
      />

      {/* Arms and held item */}
      {holding === "terminal" ? (
        <>
          <rect
            x="9"
            y="35"
            width="8"
            height="22"
            rx="4"
            fill="#ea580c"
            transform="rotate(-12, 13, 35)"
          />
          <rect
            x="43"
            y="35"
            width="8"
            height="22"
            rx="4"
            fill="#ea580c"
            transform="rotate(12, 47, 35)"
          />
          {/* Terminal body */}
          <rect x="17" y="50" width="26" height="34" rx="4" fill="#f8fafc" />
          <rect
            x="17"
            y="50"
            width="26"
            height="34"
            rx="4"
            stroke="#e2e8f0"
            strokeWidth="1"
            fill="none"
          />
          {/* Screen */}
          <rect x="20" y="53" width="20" height="16" rx="2" fill="#0f172a" />
          {/* QR grid */}
          <rect
            x="22"
            y="55"
            width="5"
            height="5"
            rx="0.5"
            fill="#f8fafc"
            opacity="0.9"
          />
          <rect
            x="29"
            y="55"
            width="5"
            height="5"
            rx="0.5"
            fill="#f8fafc"
            opacity="0.9"
          />
          <rect
            x="22"
            y="62"
            width="5"
            height="5"
            rx="0.5"
            fill="#f8fafc"
            opacity="0.9"
          />
          <rect
            x="29"
            y="62"
            width="2"
            height="2"
            rx="0.3"
            fill="#f8fafc"
            opacity="0.7"
          />
          <rect
            x="32"
            y="62"
            width="2"
            height="2"
            rx="0.3"
            fill="#f8fafc"
            opacity="0.7"
          />
          {/* Accept button */}
          <rect x="22" y="72" width="16" height="7" rx="3.5" fill="#22c55e" />
          <circle cx="30" cy="75.5" r="1.5" fill="#fff" />
        </>
      ) : holding === "cable" ? (
        <>
          {/* Arms reaching forward with cable plug */}
          <rect
            x="8"
            y="35"
            width="8"
            height="26"
            rx="4"
            fill="#ea580c"
            transform="rotate(-25, 12, 35)"
          />
          <rect
            x="44"
            y="35"
            width="8"
            height="26"
            rx="4"
            fill="#ea580c"
            transform="rotate(25, 48, 35)"
          />
          {/* Cable plug in hands */}
          <rect x="38" y="52" width="14" height="10" rx="3" fill="#475569" />
          <rect x="40" y="54" width="10" height="6" rx="2" fill="#22c55e" />
          <circle cx="45" cy="57" r="2" fill="#4ade80" />
          {/* Cable trailing behind */}
          <path
            d="M38,57 Q25,65 10,60"
            stroke="#475569"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect
            x="7"
            y="35"
            width="8"
            height="24"
            rx="4"
            fill="#ea580c"
            transform="rotate(-18, 11, 35)"
          />
          <rect
            x="45"
            y="35"
            width="8"
            height="24"
            rx="4"
            fill="#ea580c"
            transform="rotate(18, 49, 35)"
          />
          {/* Bag */}
          <path
            d="M15,52 L17,86 Q17,92 30,92 Q43,92 43,86 L45,52 Z"
            fill="#fed7aa"
          />
          <path
            d="M15,52 L17,86 Q17,92 30,92 Q43,92 43,86 L45,52 Z"
            stroke="#fdba74"
            strokeWidth="1"
            fill="none"
          />
          {/* Bag handle */}
          <path
            d="M21,52 L21,43 Q21,35 30,35 Q39,35 39,43 L39,52"
            stroke="#fdba74"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* H logo on bag */}
          <circle cx="30" cy="70" r="9" fill="#ea580c" opacity="0.15" />
          <text
            x="30"
            y="74"
            textAnchor="middle"
            fontSize="11"
            fill="#ea580c"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            H
          </text>
        </>
      )}

      {/* Head */}
      <circle cx="30" cy="17" r="12" fill="#fde3c8" />

      {/* Cap */}
      <path d="M19,14 Q19,5 30,5 Q41,5 41,14" fill="#1e293b" />
      <rect x="17" y="13" width="26" height="3" rx="1.5" fill="#0f172a" />
      <rect x="14" y="15" width="6" height="2" rx="1" fill="#0f172a" />

      {/* Eyes */}
      <circle cx="26" cy="17" r="1.8" fill="#1e293b" />
      <circle cx="34" cy="17" r="1.8" fill="#1e293b" />
      <circle cx="26.7" cy="16.3" r="0.6" fill="#fff" />
      <circle cx="34.7" cy="16.3" r="0.6" fill="#fff" />

      {/* Smile */}
      <path
        d="M27,22 Q30,25 33,22"
        stroke="#c8956a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChargerSVG({
  className = "",
  style = {},
  active = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  return (
    <svg viewBox="0 0 40 80" className={className} style={style}>
      <ellipse cx="20" cy="78" rx="10" ry="2" fill="#0f172a" opacity="0.08" />

      {/* Base */}
      <rect x="8" y="68" width="24" height="10" rx="3" fill="#334155" />
      <rect
        x="8"
        y="68"
        width="24"
        height="3"
        rx="0"
        fill="#475569"
        opacity="0.5"
      />

      {/* Post */}
      <rect x="13" y="16" width="14" height="54" rx="3" fill="#475569" />
      <rect
        x="13"
        y="16"
        width="14"
        height="54"
        rx="3"
        fill="none"
        stroke="#64748b"
        strokeWidth="0.5"
      />

      {/* Screen */}
      <rect
        x="14.5"
        y="22"
        width="11"
        height="14"
        rx="2"
        fill={active ? "#022c22" : "#1e293b"}
      >
        {active && (
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        )}
      </rect>
      {active ? (
        <>
          <text
            x="20"
            y="32"
            textAnchor="middle"
            fontSize="5.5"
            fill="#4ade80"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ⚡
          </text>
          <rect
            x="15.5"
            y="34"
            width="9"
            height="1.5"
            rx="0.75"
            fill="#4ade80"
            opacity="0.6"
          />
        </>
      ) : (
        <rect
          x="15.5"
          y="27"
          width="9"
          height="1.5"
          rx="0.75"
          fill="#475569"
          opacity="0.5"
        />
      )}

      {/* Cable nozzle */}
      <circle cx="20" cy="52" r="6.5" fill={active ? "#14532d" : "#334155"} />
      <circle cx="20" cy="52" r="4.5" fill={active ? "#16a34a" : "#475569"}>
        {active && (
          <animate
            attributeName="fill"
            values="#16a34a;#4ade80;#16a34a"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="20" cy="52" r="2" fill={active ? "#4ade80" : "#64748b"} />

      {/* Top cap */}
      <rect x="11" y="12" width="18" height="6" rx="3" fill="#64748b" />
      <rect x="14" y="10" width="12" height="4" rx="2" fill="#94a3b8" />
    </svg>
  );
}

// function CableSVG({
//   className = "",
//   style = {},
//   active = false,
// }: {
//   className?: string;
//   style?: React.CSSProperties;
//   active?: boolean;
// }) {
//   return (
//     <svg viewBox="0 0 70 25" className={className} style={style}>
//       {/* Cable - curves from left (charger) down and right to car */}
//       <path
//         d="M2,4 Q15,22 35,18 Q55,14 68,10"
//         stroke="#475569"
//         strokeWidth="3"
//         fill="none"
//         strokeLinecap="round"
//       />
//       <path
//         d="M2,4 Q15,22 35,18 Q55,14 68,10"
//         stroke="#64748b"
//         strokeWidth="1.5"
//         fill="none"
//         strokeLinecap="round"
//       />

//       {/* Energy flow */}
//       {active && (
//         <>
//           <path
//             d="M2,4 Q15,22 35,18 Q55,14 68,10"
//             stroke="#4ade80"
//             strokeWidth="2"
//             fill="none"
//             strokeLinecap="round"
//             strokeDasharray="4 8"
//             opacity="0.9"
//           >
//             <animate
//               attributeName="stroke-dashoffset"
//               from="0"
//               to="-24"
//               dur="0.5s"
//               repeatCount="indefinite"
//             />
//           </path>
//           <circle r="2" fill="#4ade80" opacity="0.9">
//             <animateMotion
//               dur="0.6s"
//               repeatCount="indefinite"
//               path="M2,4 Q15,22 35,18 Q55,14 68,10"
//             />
//           </circle>
//         </>
//       )}
//     </svg>
//   );
// }

function CableSVG({
  className = "",
  style = {},
  active = false,
  isMobile = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  isMobile?: boolean;
}) {
  // const path = "M2,4 C10,20 30,26 50,20 C60,16 64,15 68,18";
  const path = isMobile
    ? "M2,5 C10,20 30,26 50,20 C60,18 65,18 70,30"
    : "M2,5 C10,20 30,26 45,20 C50,18 52,18 55,23";

  return (
    <svg viewBox="0 0 70 28" className={className} style={style}>
      {/* Main cable body */}
      <path
        d={path}
        stroke="#334155"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cable highlight */}
      <path
        d={path}
        stroke="#64748b"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Plug head near car */}
      {/* <rect x="66" y="16" width="4" height="4" rx="1" fill="#0f172a" /> */}

      {/* Plug tip */}
      {/* <rect x="69" y="17" width="2" height="2" rx="0.5" fill="#22d3ee" /> */}

      {/* Energy flow animation */}
      {active && (
        <>
          <path
            d={path}
            stroke="#4ade80"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="5 10"
            opacity="0.9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-30"
              dur="0.7s"
              repeatCount="indefinite"
            />
          </path>

          <circle r="2.2" fill="#4ade80">
            <animateMotion dur="0.9s" repeatCount="indefinite" path={path} />
          </circle>
        </>
      )}
    </svg>
  );
}

function MotionSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 30 30" className={className} style={style}>
      <line
        x1="0"
        y1="8"
        x2="18"
        y2="8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.18"
      />
      <line
        x1="3"
        y1="15"
        x2="25"
        y2="15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.32"
      />
      <line
        x1="0"
        y1="22"
        x2="14"
        y2="22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.12"
      />
    </svg>
  );
}

// ============================================
// FLOATING CARD — elevated glass style
// ============================================

function FloatingCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2 ${className}`}
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,255,255,0.8)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ============================================
// SCENE PANELS — unchanged logic, polished markup
// ============================================

function Scene1({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const chargerPosition = isMobile
    ? "absolute left-1 bottom-4"
    : "absolute left-2 bottom-6";
  return (
    <div className="relative w-full h-full">
      {/* Charger */}
      <div className={chargerPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <ChargerSVG className="w-7 h-14" active={progress > 0.7} />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>

      {/* Motion lines */}
      {isActive && progress < 0.6 && (
        <div
          className="absolute left-12 bottom-10"
          style={{ opacity: 0.5 - progress * 0.8 }}
        >
          <MotionSVG className="w-5 text-slate-400" />
        </div>
      )}
    </div>
  );
}

function Scene2({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const valetPosition = isMobile
    ? "absolute left-[25%] bottom-3 transition-all duration-700 z-10"
    : "absolute left-[45%] bottom-4 transition-all duration-700 z-10";

  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";
  return (
    <div className="relative w-full h-full">
      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={false} />
      </div>

      {/* Attendant with terminal */}
      <div
        className={valetPosition}
        style={{
          opacity: isActive ? 1 : 0,
          transform: `translateX(${isActive ? Math.min(progress * 15, 10) : -10}px)`,
        }}
      >
        <ValetSVG className="w-8 h-12" holding="terminal" />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}

function Scene3({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.5;
  const showCable = isActive && progress > 0.4;

  const valetStart = isMobile ? 25 : 30;
  const valetMove = isMobile ? 18 : 25;

  const valetPosition = isActive
    ? Math.min(progress * valetMove, valetMove)
    : 0;

  // const valetPosition = isActive ? Math.min(progress * 25, 18) : 0;

  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  return (
    <div className="relative w-full h-full">
      {/* Floating badge */}
      {showBadge && (
        <FloatingCard
          className="absolute top-8 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-emerald-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-600 tracking-tight">
              Ultra-fast
            </span>
          </div>
        </FloatingCard>
      )}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={showCable} />
      </div>

      {/* Attendant walking with cable */}
      <div
        className="absolute bottom-4 z-20 transition-all duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          left: `calc(17% + ${valetPosition}px)`,
        }}
      >
        <ValetSVG className="w-8 h-12" holding="cable" />
      </div>

      {/* Cable connecting charger to car */}
      <div
        className="absolute bottom-8 left-6 z-10 transition-all duration-300"
        style={{ opacity: showCable ? 1 : 0 }}
      >
        <CableSVG
          className="w-20 lg:w-24"
          active={showCable}
          isMobile={isMobile}
        />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
        {showCable && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-emerald-400 rounded-full blur-md opacity-35" />
        )}
      </div>
    </div>
  );
}

function Scene4({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showNotif = isActive && progress > 0.2;
  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const valetPosition = isMobile
    ? "absolute right-40 bottom-3 transition-all duration-700 z-20"
    : "absolute right-2 bottom-4 transition-all duration-700 z-20";

  return (
    <div className="relative w-full h-full">
      {/* Notification card */}
      {showNotif && (
        <FloatingCard
          className="absolute top-8 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showNotif ? 1 : 0,
            transform: `translateY(${showNotif ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-bold">H</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                Order ready!
              </p>
              <p className="text-[8px] text-gray-400 leading-tight">
                Arriving now
              </p>
            </div>
          </div>
        </FloatingCard>
      )}
      {showNotif && (
        <FloatingCard
          className="absolute top-20 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showNotif ? 1 : 0,
            transform: `translateY(${showNotif ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-bold">H</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                75+ miles added
              </p>
            </div>
          </div>
        </FloatingCard>
      )}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={isActive} />
      </div>

      {/* Cable stays connected */}
      <div
        className="absolute bottom-8 left-6 z-10"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <CableSVG
          className="w-20 lg:w-24"
          active={isActive}
          isMobile={isMobile}
        />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-emerald-400 rounded-full blur-md opacity-30" />
        )}
      </div>

      {/* Attendant with food */}
      <div
        className={valetPosition}
        style={{
          opacity: isActive && progress > 0.3 ? 1 : 0,
        }}
      >
        <ValetSVG className="w-8 h-12" holding="food" />
      </div>
    </div>
  );
}

function Scene5({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress;
  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  return (
    <div className="relative w-full h-full">
      {/* Ready badge */}
      {showBadge && (
        <FloatingCard
          className="absolute top-8 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-600 tracking-tight">
              Ready to go!
            </span>
          </div>
        </FloatingCard>
      )}

      {showBadge && (
        <FloatingCard
          className="absolute top-20 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-600 tracking-tight">
              100 miles added
            </span>
          </div>
        </FloatingCard>
      )}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 0.5 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={false} />
      </div>

      {/* Motion lines */}
      {isActive && progress > 0.3 && (
        <div
          className="absolute left-12 bottom-10"
          style={{ opacity: progress * 0.5 }}
        >
          <MotionSVG className="w-5 text-slate-400" />
        </div>
      )}

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}

const MemoScene1 = memo(Scene1);
const MemoScene2 = memo(Scene2);
const MemoScene3 = memo(Scene3);
const MemoScene4 = memo(Scene4);
const MemoScene5 = memo(Scene5);

// ============================================
// STEP ICON — numbered pill
// ============================================

function StepPill({
  number,
  isActive,
  isCurrent,
}: {
  number: number;
  isActive: boolean;
  isCurrent: boolean;
}) {
  return (
    <div
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold transition-all duration-300"
      style={{
        background: isCurrent
          ? "linear-gradient(135deg,#f97316,#fb923c)"
          : isActive
            ? "#1e293b"
            : "#e2e8f0",
        color: isActive ? "#fff" : "#94a3b8",
        boxShadow: isCurrent ? "0 2px 8px rgba(249,115,22,0.4)" : "none",
      }}
    >
      {number}
    </div>
  );
}

// ============================================
// MAIN COMPONENT — logic untouched
// ============================================

export function JourneyBattery() {
  const sectionRef = useRef<HTMLElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const progressBarsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileActiveCard, setMobileActiveCard] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const scrollProgressRef = useRef(0);
  const lastStepRef = useRef(0);
  const allDoneRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile carousel scroll to update active dot
  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth * 0.85 + 16; // 85vw + gap
      const activeIndex = Math.round(scrollLeft / cardWidth);
      setMobileActiveCard(Math.min(activeIndex, 4));
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const updatePanels = useCallback((progress: number) => {
    if (!panelsRef.current || !progressBarsRef.current || !labelsRef.current)
      return;

    const panels = panelsRef.current.children;
    const bars = progressBarsRef.current.children;
    const labels = labelsRef.current.children;
    const currentStep = Math.min(Math.floor(progress * 5), 4);

    for (let i = 0; i < 5; i++) {
      const stepStart = i / 5;
      const stepEnd = (i + 1) / 5;
      let stepProgress = 0;
      if (progress >= stepEnd) stepProgress = 1;
      else if (progress > stepStart)
        stepProgress = (progress - stepStart) / (stepEnd - stepStart);

      const panel = panels[i] as HTMLElement;
      const bar = bars[i]?.firstChild as HTMLElement;
      const label = labels[i] as HTMLElement;
      const isActive = currentStep >= i;
      const isCurrent = currentStep === i;

      if (panel) {
        panel.style.backgroundColor = isActive
          ? `rgba(255, 237, 213, ${0.25 + stepProgress * 0.35})`
          : "rgba(248, 250, 252, 0.5)";
        const overlay = panel.querySelector("[data-overlay]") as HTMLElement;
        if (overlay) overlay.style.opacity = isActive ? "0" : "0.5";
        const dot = panel.querySelector("[data-dot]") as HTMLElement;
        if (dot) dot.style.display = isCurrent ? "block" : "none";
      }

      if (bar) {
        bar.style.width = isCurrent
          ? `${stepProgress * 100}%`
          : isActive
            ? "100%"
            : "0%";
      }

      if (label) {
        const done = allDoneRef.current;
        const isLarge = isCurrent && !done;

        label.style.opacity = isActive ? "1" : "0.35";

        // Pill sizing
        const pill = label.querySelector("[data-pill]") as HTMLElement;
        if (pill) {
          pill.style.width = isLarge ? "36px" : "20px";
          pill.style.height = isLarge ? "36px" : "20px";
          pill.style.fontSize = isLarge ? "14px" : "9px";
          pill.style.boxShadow =
            isCurrent && !done
              ? "0 4px 14px rgba(249,115,22,0.45)"
              : isCurrent
                ? "0 2px 8px rgba(249,115,22,0.4)"
                : "none";
        }

        // Title sizing
        const title = label.querySelector("[data-title]") as HTMLElement;
        if (title) {
          title.style.fontSize = isLarge ? "20px" : "11px";
          title.style.letterSpacing = isLarge ? "0.12em" : "0.08em";
          title.style.marginBottom = isLarge ? "4px" : "2px";
          title.style.color = isCurrent ? "#f97316" : "#1e293b";
        }

        // Subtitle sizing
        const subtitle = label.querySelector("[data-subtitle]") as HTMLElement;
        if (subtitle) {
          subtitle.style.fontSize = isLarge ? "13px" : "10px";
          subtitle.style.opacity = isActive ? "1" : "0";
        }
      }
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: batteryRef.current,
            start: "top 15%",
            end: "+=200%",
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
              const newStep = Math.min(Math.floor(self.progress * 5), 4);
              if (newStep !== lastStepRef.current) {
                lastStepRef.current = newStep;
                setActiveStep(newStep);
              }
              updatePanels(self.progress);
            },
          },
        },
      );

      gsap.fromTo(
        ".journey-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [updatePanels]);

  const getStepProgress = useCallback((i: number) => {
    const progress = scrollProgressRef.current;
    const start = i / 5,
      end = (i + 1) / 5;
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  }, []);

  const scenes = [MemoScene1, MemoScene2, MemoScene3, MemoScene4, MemoScene5];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-gradient-soft"
    >
      {/* ---- TOP SECTION ---- */}
      <div className="relative py-8 lg:py-12">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header - Mobile only (desktop header is inside pinned container) */}
          <div className="journey-header text-center mb-4 md:hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                The Experience
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Your charging journey
            </h2>
            <p className="text-slate-500 text-sm">Swipe to explore each step</p>
          </div>

          {/* ---- MOBILE HORIZONTAL CAROUSEL ---- */}
          <div className="md:hidden -mx-6">
            {/* Swipeable cards container */}
            <div
              ref={mobileCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-6 gap-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {journeySteps.map((step, i) => {
                const Scene = scenes[i];
                return (
                  <div
                    key={step.id}
                    className="flex-shrink-0 w-[85vw] snap-center rounded-2xl overflow-hidden"
                    style={{
                      background: "#ffffff",
                      boxShadow:
                        "0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Scene visualization - larger for mobile */}
                    <div className="relative ml-20 h-[180px] bg-gradient-to-b from-slate-50 to-white">
                      <Scene progress={1} isActive={true} isMobile={true} />
                    </div>

                    {/* Step content */}
                    <div className="p-5 border-t border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Step number */}
                        <div
                          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            background:
                              "linear-gradient(135deg,#f97316,#fb923c)",
                            color: "#fff",
                            boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
                          }}
                        >
                          {step.id}
                        </div>
                        <div>
                          <p className="text-base font-bold text-orange-500 uppercase tracking-wider">
                            {step.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-2 px-6">
              {journeySteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const carousel = mobileCarouselRef.current;
                    if (carousel) {
                      const cardWidth = carousel.offsetWidth * 0.85 + 16;
                      carousel.scrollTo({
                        left: i * cardWidth,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    mobileActiveCard === i
                      ? "bg-orange-500 w-6"
                      : "bg-slate-300"
                  }`}
                />
              ))}
            </div>

            {/* Step counter */}
            <p className="text-center text-xs text-slate-400 mt-3">
              {mobileActiveCard + 1} of 5
            </p>
          </div>

          {/* ---- DESKTOP BATTERY WIDGET ---- */}
          <div ref={batteryRef} className="hidden md:block">
            {/* Header - Inside pinned container for desktop */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  The Experience
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Your charging journey
              </h2>
              <p className="text-slate-500 max-w-md mx-auto text-base">
                From arrival to adventure. Every minute designed for you.
              </p>
            </div>
            <div className="relative">
              {/* Outer shell — battery casing with subtle depth */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "#f8fafc",
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.05), 0 24px 48px -8px rgba(0,0,0,0.12)",
                }}
              >
                {/* Battery terminal nub */}
                <div
                  className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-20"
                  style={{
                    width: "10px",
                    height: "40px",
                    borderRadius: "0 6px 6px 0",
                    background:
                      "linear-gradient(180deg, #94a3b8 0%, #64748b 50%, #94a3b8 100%)",
                    boxShadow: "2px 0 6px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Inner inset border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                  style={{
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.04)",
                  }}
                />

                {/* Scene panels */}
                <div
                  ref={panelsRef}
                  className="grid grid-cols-5 h-[190px] lg:h-[210px]"
                >
                  {journeySteps.map((step, i) => {
                    const isActive = activeStep >= i;
                    const isCurrent = activeStep === i;
                    const Scene = scenes[i];

                    return (
                      <div
                        key={step.id}
                        className={`relative transition-colors duration-300 ${
                          i < 4 ? "border-r border-slate-100" : ""
                        }`}
                      >
                        <Scene
                          progress={getStepProgress(i)}
                          isActive={isActive}
                          isMobile={isMobile}
                        />

                        {/* Inactive overlay */}
                        <div
                          data-overlay
                          className="absolute inset-0 bg-slate-50/60 pointer-events-none transition-opacity duration-300"
                          style={{ opacity: isActive ? 0 : 0.5 }}
                        />

                        {/* Current step pulse dot */}
                        <div
                          data-dot
                          className="absolute top-2.5 left-1/2 -translate-x-1/2"
                          style={{ display: isCurrent ? "block" : "none" }}
                        >
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress track */}
                <div
                  ref={progressBarsRef}
                  className="h-[3px] flex"
                  style={{ background: "rgba(0,0,0,0.04)" }}
                >
                  {journeySteps.map((_, i) => (
                    <div key={i} className="flex-1 overflow-hidden">
                      <div
                        className="h-full transition-none"
                        style={{
                          background:
                            "linear-gradient(90deg, #f97316, #fbbf24)",
                          width:
                            activeStep === i
                              ? `${getStepProgress(i) * 100}%`
                              : activeStep > i
                                ? "100%"
                                : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step labels */}
              {/* <div ref={labelsRef} className="grid grid-cols-5 mt-5">
                {journeySteps.map((step, i) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-1.5 transition-opacity duration-300"
                    style={{ opacity: activeStep >= i ? 1 : 0.35 }}
                  >
                    <StepPill
                      number={step.id}
                      isActive={activeStep >= i}
                      isCurrent={activeStep === i}
                    />
                    <div className="text-center">
                      <p
                        data-title
                        className={`text-xs font-bold tracking-widest uppercase mb-0.5 transition-colors ${
                          activeStep === i
                            ? "text-orange-500"
                            : "text-slate-700"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div> */}
              <div
                ref={labelsRef}
                className="grid grid-cols-5 mt-5"
                style={{ minHeight: "88px" }}
              >
                {journeySteps.map((step, i) => {
                  const isActive = activeStep >= i;
                  const isCurrent = activeStep === i;
                  const isLarge = isCurrent && !allDone;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center gap-2 transition-opacity duration-300"
                      style={{ opacity: isActive ? 1 : 0.35 }}
                    >
                      {/* Pill */}
                      <div
                        data-pill
                        className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-500"
                        style={{
                          width: isLarge ? "36px" : "20px",
                          height: isLarge ? "36px" : "20px",
                          fontSize: isLarge ? "14px" : "9px",
                          background: isCurrent
                            ? "linear-gradient(135deg,#f97316,#fb923c)"
                            : isActive
                              ? "#1e293b"
                              : "#e2e8f0",
                          color: isActive ? "#fff" : "#94a3b8",
                          boxShadow: isLarge
                            ? "0 4px 14px rgba(249,115,22,0.45)"
                            : isCurrent
                              ? "0 2px 8px rgba(249,115,22,0.4)"
                              : "none",
                        }}
                      >
                        {step.id}
                      </div>

                      <div className="text-center">
                        <p
                          data-title
                          className="font-bold tracking-widest uppercase transition-all duration-500"
                          style={{
                            fontSize: isLarge ? "20px" : "11px",
                            letterSpacing: isLarge ? "0.12em" : "0.08em",
                            marginBottom: isLarge ? "4px" : "2px",
                            color: isCurrent ? "#f97316" : "#1e293b",
                          }}
                        >
                          {step.title}
                        </p>
                        <p
                          data-subtitle
                          className="text-slate-400 leading-snug transition-all duration-500"
                          style={{
                            fontSize: isLarge ? "13px" : "10px",
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- SUMMARY STATS ---- */}
      <div className="relative max-w-5xl mx-auto px-6 pb-10 lg:pb-12">
        <div
          className="rounded-2xl p-6 lg:p-8"
          style={{
            background: "#fff",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.05), 0 8px 32px -4px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1 tracking-tight">
                Your car is your space
              </h3>
              <p className="text-slate-500 text-sm">
                Like home and office. We bring everything to you.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-8 w-full md:w-auto">
              {/* Stat 1 */}
              <div className="flex md:flex-col items-center md:items-center justify-between w-full md:w-auto md:text-center">
                <p className="text-slate-400 text-xs font-medium md:hidden">
                  100 miles
                </p>
                <p
                  className="text-2xl lg:text-3xl font-black tracking-tight"
                  style={{ color: "#f97316" }}
                >
                  10 min
                </p>
                <p className="text-slate-400 text-xs font-medium mt-0.5 hidden md:block">
                  100 miles
                </p>
              </div>

              <div className="w-full h-px md:w-px md:h-10 bg-slate-100" />

              {/* Stat 2 */}
              <div className="flex md:flex-col items-center md:items-center justify-between w-full md:w-auto md:text-center">
                <p className="text-slate-400 text-xs font-medium md:hidden">
                  Plug & unplug
                </p>
                <p
                  className="text-2xl lg:text-3xl font-black tracking-tight"
                  style={{ color: "#10b981" }}
                >
                  Attendant
                </p>
                <p className="text-slate-400 text-xs font-medium mt-0.5 hidden md:block">
                  Plug & unplug
                </p>
              </div>

              <div className="w-full h-px md:w-px md:h-10 bg-slate-100" />

              {/* Stat 3 */}
              <div className="flex md:flex-col items-center md:items-center justify-between w-full md:w-auto md:text-center">
                <p className="text-slate-400 text-xs font-medium md:hidden">
                  Delivered
                </p>
                <p
                  className="text-2xl lg:text-3xl font-black tracking-tight"
                  style={{ color: "#3b82f6" }}
                >
                  Lifestyle
                </p>
                <p className="text-slate-400 text-xs font-medium mt-0.5 hidden md:block">
                  Delivered
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- MEMBERSHIP TEASER ---- */}
      <div className="relative max-w-5xl mx-auto px-6 pb-16 lg:pb-20">
        <div
          className="relative rounded-2xl p-6 lg:p-8 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff7ed 100%)",
            boxShadow:
              "0 0 0 1px rgba(251,146,60,0.15), 0 8px 32px -4px rgba(249,115,22,0.10)",
          }}
        >
          {/* Decorative ring */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#f97316" }}
              >
                Coming Back?
              </p>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">
                Are you a HubCharge Member?
              </h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Members get free charging. Every $ you spend earns rewards.
              </p>
            </div>

            <a href="#membership" className="btn btn-primary shrink-0">
              Learn About Membership
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
