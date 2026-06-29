"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * HUBCHARGE JOURNEY - Premium UX Redesign
 */

const journeySteps = [
  { id: 1, title: "ARRIVE", subtitle: "Pick a charger spot" },
  { id: 2, title: "EASY PAYMENT", subtitle: "Stay in your car" },
  { id: 3, title: "CHARGE", subtitle: "We plug you in" },
  {
    id: 4,
    title: "SELECT SERVICE / ADD MORE TIME",
    subtitle: "Add time or order food",
  },
  { id: 5, title: "FINISH", subtitle: "We unplug • You're done" },
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
      <circle cx="60" cy="54" r="11" fill="none" stroke="#020617" strokeWidth="1" />
      <circle cx="60" cy="54" r="6.6" fill="#1e293b" />
      <g stroke="#94a3b8" strokeWidth="0.9" opacity="0.6" strokeLinecap="round">
        <line x1="60" y1="48.5" x2="60" y2="59.5" />
        <line x1="54.5" y1="54" x2="65.5" y2="54" />
        <line x1="56.2" y1="50.2" x2="63.8" y2="57.8" />
        <line x1="56.2" y1="57.8" x2="63.8" y2="50.2" />
      </g>
      <circle cx="60" cy="54" r="1.7" fill="#cbd5e1" />

      {/* rear wheel */}
      <circle cx="140" cy="54" r="11" fill={`url(#wheel-${id})`} />
      <circle cx="140" cy="54" r="11" fill="none" stroke="#020617" strokeWidth="1" />
      <circle cx="140" cy="54" r="6.6" fill="#1e293b" />
      <g stroke="#94a3b8" strokeWidth="0.9" opacity="0.6" strokeLinecap="round">
        <line x1="140" y1="48.5" x2="140" y2="59.5" />
        <line x1="134.5" y1="54" x2="145.5" y2="54" />
        <line x1="136.2" y1="50.2" x2="143.8" y2="57.8" />
        <line x1="136.2" y1="57.8" x2="143.8" y2="50.2" />
      </g>
      <circle cx="140" cy="54" r="1.7" fill="#cbd5e1" />

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

      {/* charge port glow (brand) */}
      <circle cx="155" cy="36" r="3" fill="#FF7A00" opacity="0.95" />
      <circle cx="155" cy="36" r="7" fill="#FF7A00" opacity="0.18" />
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
        fill="#FF7A00"
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
            fill="#FF7A00"
            transform="rotate(-12, 13, 35)"
          />
          <rect
            x="43"
            y="35"
            width="8"
            height="22"
            rx="4"
            fill="#FF7A00"
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
            fill="#FF7A00"
            transform="rotate(-25, 12, 35)"
          />
          <rect
            x="44"
            y="35"
            width="8"
            height="26"
            rx="4"
            fill="#FF7A00"
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
            fill="#FF7A00"
            transform="rotate(-18, 11, 35)"
          />
          <rect
            x="45"
            y="35"
            width="8"
            height="24"
            rx="4"
            fill="#FF7A00"
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
          <circle cx="30" cy="70" r="9" fill="#FF7A00" opacity="0.15" />
          <text
            x="30"
            y="74"
            textAnchor="middle"
            fontSize="11"
            fill="#FF7A00"
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
      {/* ground shadow */}
      <ellipse cx="20" cy="78" rx="12" ry="2.2" fill="#0f172a" opacity="0.13" />

      {/* base plinth */}
      <rect x="6.5" y="64" width="27" height="13" rx="4" fill="#0f172a" />
      <rect x="6.5" y="64" width="27" height="3" rx="1.5" fill="#334155" opacity="0.6" />

      {/* main body */}
      <rect x="9.5" y="6" width="21" height="62" rx="7" fill="#16233b" />
      <rect x="9.5" y="6" width="21" height="62" rx="7" fill="none" stroke="#0b1220" strokeWidth="0.6" />
      {/* roundness shading */}
      <rect x="11" y="9" width="2.6" height="55" rx="1.3" fill="#3b4d6b" opacity="0.5" />
      <rect x="27" y="9" width="2.6" height="55" rx="1.3" fill="#0b1220" opacity="0.7" />

      {/* front face panel */}
      <rect x="12.5" y="10" width="15" height="45" rx="5" fill="#0c1626" />

      {/* live screen */}
      <rect x="14" y="13.5" width="12" height="15" rx="2.5" fill="#06121f" stroke="#1e293b" strokeWidth="0.5" />
      {/* battery icon */}
      <rect x="15.8" y="16" width="8" height="4.6" rx="1" fill="none" stroke={active ? "#4ade80" : "#3a4a63"} strokeWidth="0.8" />
      <rect x="24" y="17.3" width="1" height="2" rx="0.5" fill={active ? "#4ade80" : "#3a4a63"} />
      {/* battery fill (counts up while charging) */}
      <rect x="16.5" y="16.7" width={active ? "6.6" : "2"} height="3.2" rx="0.5" fill={active ? "#22c55e" : "#26354c"}>
        {active && <animate attributeName="width" values="1.5;6.6;1.5" dur="2.6s" repeatCount="indefinite" />}
      </rect>
      {/* readout bars */}
      <rect x="15.8" y="22.4" width={active ? "8" : "5"} height="1.5" rx="0.75" fill={active ? "#FF7A00" : "#26354c"}>
        {active && <animate attributeName="width" values="2;8;2" dur="2.6s" repeatCount="indefinite" />}
      </rect>
      <rect x="15.8" y="25" width="5.5" height="1.2" rx="0.6" fill="#1c2a40" />

      {/* status LED strip */}
      <rect x="18.4" y="33" width="3.2" height="13" rx="1.6" fill="#0b1220" />
      <rect x="18.8" y="33.4" width="2.4" height="12.2" rx="1.2" fill={active ? "#34d399" : "#FF7A00"}>
        <animate attributeName="opacity" values={active ? "0.55;1;0.55" : "0.5;0.9;0.5"} dur={active ? "1s" : "2.4s"} repeatCount="indefinite" />
      </rect>

      {/* brand wordmark hint */}
      <rect x="14.5" y="49.5" width="11" height="2" rx="1" fill="#FF7A00" opacity="0.85" />
      <rect x="14.5" y="52.4" width="7" height="1.2" rx="0.6" fill="#FF7A00" opacity="0.35" />

      {/* connector holster */}
      <circle cx="20" cy="60" r="5.6" fill="#0b1220" />
      <circle cx="20" cy="60" r="3.7" fill={active ? "#16a34a" : "#2a3a52"}>
        {active && <animate attributeName="fill" values="#16a34a;#4ade80;#16a34a" dur="1.1s" repeatCount="indefinite" />}
      </circle>
      <circle cx="20" cy="60" r="1.6" fill={active ? "#bbf7d0" : "#64748b"} />

      {/* top cap */}
      <rect x="11.5" y="4.5" width="17" height="5" rx="2.5" fill="#0c1626" />
      <rect x="14" y="3" width="12" height="3.6" rx="1.8" fill="#1c2a40" />
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
  const endX = isMobile ? 70 : 55;
  const endY = isMobile ? 30 : 23;
  // staggered begins create a continuous stream of energy
  const particles = [0, 0.3, 0.6, 0.9, 1.2];

  return (
    <svg viewBox="0 0 70 28" className={className} style={style} overflow="visible">
      {/* cable casing */}
      <path d={path} stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d={path} stroke="#334155" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d={path} stroke="#64748b" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" />

      {active && (
        <>
          {/* glowing energy core travelling down the cable */}
          <path d={path} stroke="#FF7A00" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeDasharray="6 9" opacity="0.85">
            <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="0.6s" repeatCount="indefinite" />
          </path>
          <path d={path} stroke="#fbbf24" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="3 12" opacity="0.9">
            <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="0.6s" repeatCount="indefinite" />
          </path>

          {/* flowing energy particles (soft glow + bright core) */}
          {particles.map((begin, i) => (
            <g key={i}>
              <circle r="2.6" fill="#FF7A00" opacity="0.22">
                <animateMotion dur="1.5s" begin={`${begin}s`} repeatCount="indefinite" path={path} />
              </circle>
              <circle r="1.2" fill="#ffe2bd">
                <animateMotion dur="1.5s" begin={`${begin}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          ))}

          {/* connection spark where the plug meets the car */}
          <circle cx={endX} cy={endY} r="3.4" fill="#FF7A00" opacity="0.3">
            <animate attributeName="r" values="2.4;4.4;2.4" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="1s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* plug head at the car end */}
      <g transform={`translate(${endX - 4}, ${endY - 3})`}>
        <rect x="0" y="0" width="7" height="6" rx="2" fill="#0f172a" />
        <rect x="5.5" y="1.6" width="2.5" height="2.8" rx="0.8" fill={active ? "#FF7A00" : "#475569"} />
      </g>
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
  const showBadge = isActive && progress > 0.3;
  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const chargerPosition = isMobile
    ? "absolute left-1 bottom-4"
    : "absolute left-2 bottom-6";
  return (
    <div className="relative w-full h-full">
      {/* Floating card - Pick your spot */}
      {showBadge && (
        <FloatingCard
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                Pick your spot
              </p>
              <p className="text-[8px] text-gray-500 leading-tight font-medium">
                NACS or CCS
              </p>
            </div>
          </div>
        </FloatingCard>
      )}

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
  const showBadge = isActive && progress > 0.2;
  const valetPosition = isMobile
    ? "absolute left-[25%] bottom-3 transition-all duration-700 z-10"
    : "absolute left-[45%] bottom-4 transition-all duration-700 z-10";

  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";
  return (
    <div className="relative w-full h-full">
      {/* Floating card - Stay in your car */}
      {showBadge && (
        <FloatingCard
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                Stay in your car<span className="text-red-500">*</span>
              </p>
              <p className="text-[8px] text-gray-500 leading-tight font-medium">
                We come to you
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
      {/* Floating card - Pick your spot */}
      {showBadge && (
        <FloatingCard
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                Charge 10 minutes
              </p>
            </div>
          </div>
        </FloatingCard>
      )}
      {/* Floating badge */}
      {/* {showBadge && (
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
      )} */}

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
  const showBadge = isActive && progress > 0.5;
  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const valetPosition = isMobile
    ? "absolute right-40 bottom-3 transition-all duration-700 z-20"
    : "absolute right-2 bottom-4 transition-all duration-700 z-20";

  return (
    <div className="relative w-full h-full">
      {/* Notification card */}
      {showBadge && (
        <FloatingCard
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shadow-sm">
              <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                Select your services
              </p>
              <p className="text-[8px] text-gray-500 leading-tight font-medium">
                or add more charging time
              </p>
            </div>
          </div>
        </FloatingCard>
      )}
      {/* {showNotif && (
        <FloatingCard
          className="absolute top-20 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showNotif ? 1 : 0,
            transform: `translateY(${showNotif ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-bold">H</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-800 leading-tight">
                75+ miles added
              </p>
            </div>
          </div>
        </FloatingCard>
      )} */}

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
      {/* {showBadge && (
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
      )} */}

      {/* {showBadge && (
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
      )} */}

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
          ? "linear-gradient(135deg,#FF7A00,#FF9433)"
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
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

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
          ? `rgba(255, 245, 234, ${0.6 + stepProgress * 0.3})`
          : "rgba(248, 250, 252, 0.7)";
        const overlay = panel.querySelector("[data-overlay]") as HTMLElement;
        if (overlay) overlay.style.opacity = isActive ? "0" : "0.3";
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
        label.style.opacity = isActive ? "1" : "0.4";

        // Pill - consistent size, just color changes
        const pill = label.querySelector("[data-pill]") as HTMLElement;
        if (pill) {
          pill.style.background = isCurrent
            ? "linear-gradient(135deg,#FF7A00,#FF9433)"
            : isActive
              ? "#1e293b"
              : "#e2e8f0";
          pill.style.color = isActive ? "#fff" : "#94a3b8";
          pill.style.boxShadow = isCurrent
            ? "0 4px 12px rgba(249,115,22,0.4)"
            : "none";
        }

        // Title - consistent size, just color changes
        const title = label.querySelector("[data-title]") as HTMLElement;
        if (title) {
          title.style.color = isCurrent ? "#FF7A00" : "#1e293b";
        }

        // Subtitle - just opacity change
        const subtitle = label.querySelector("[data-subtitle]") as HTMLElement;
        if (subtitle) {
          subtitle.style.opacity = isActive ? "0.8" : "0";
        }
      }
    }
  }, []);

  // Handle clicking on a step card
  const handleStepClick = useCallback((stepIndex: number) => {
    if (!scrollTriggerRef.current) return;

    const st = scrollTriggerRef.current;
    const targetProgress = (stepIndex + 0.5) / 5; // Center of the step

    // Calculate the scroll position for this progress
    const scrollStart = st.start;
    const scrollEnd = st.end;
    const targetScroll =
      scrollStart + (scrollEnd - scrollStart) * targetProgress;

    // Smooth scroll to that position
    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
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
      });

      // Store the ScrollTrigger instance
      scrollTriggerRef.current = st;

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider text-brand">
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
                    className="flex-shrink-0 w-[85vw] snap-center rounded-2xl overflow-hidden border border-slate-200/60"
                    style={{
                      background:
                        "linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #ffffff 100%)",
                      boxShadow:
                        "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Scene visualization */}
                    <div className="relative h-[170px] overflow-hidden">
                      {/* Scene container with padding to shift content right */}
                      <div className="absolute inset-0 pl-8">
                        <Scene progress={1} isActive={true} isMobile={true} />
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="p-4 bg-white border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #FF7A00, #FF9433)",
                            color: "#fff",
                            boxShadow: "0 2px 6px rgba(249,115,22,0.3)",
                          }}
                        >
                          {step.id}
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800">
                            {step.title}
                          </p>
                          {/* <p className="text-sm text-slate-500">
                            {step.subtitle}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Battery Indicator */}
            <div className="px-6 mt-5">
              <div className="flex items-center justify-center">
                {/* Battery container */}
                <div
                  className="relative flex items-center rounded-2xl px-1.5 py-1.5"
                  style={{
                    background: "linear-gradient(145deg, #1e293b, #0f172a)",
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Inner glow when charging */}
                  {mobileActiveCard >= 2 && mobileActiveCard < 4 && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-30"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(34,197,94,0.4) 0%, transparent 70%)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  {/* Battery cells */}
                  <div className="flex items-center gap-1 relative z-10">
                    {journeySteps.map((_, i) => {
                      const isActive = mobileActiveCard === i;
                      const isCompleted = mobileActiveCard > i;
                      const isFilled = isActive || isCompleted;
                      const isCharging =
                        mobileActiveCard >= 2 && mobileActiveCard < 4;

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            const carousel = mobileCarouselRef.current;
                            if (carousel) {
                              const cardWidth =
                                carousel.offsetWidth * 0.85 + 16;
                              carousel.scrollTo({
                                left: i * cardWidth,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className="relative h-7 rounded-md transition-all duration-400 overflow-hidden"
                          style={{
                            width: isActive ? "20px" : "14px",
                            background: isFilled
                              ? isCharging ||
                                (mobileActiveCard >= 4 && isCompleted)
                                ? "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
                                : "linear-gradient(180deg, #FF9433 0%, #FF7A00 100%)"
                              : "rgba(71,85,105,0.4)",
                            boxShadow: isFilled
                              ? isCharging
                                ? "0 0 8px rgba(74,222,128,0.6), inset 0 1px 0 rgba(255,255,255,0.3)"
                                : "0 0 8px rgba(251,146,60,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"
                              : "inset 0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          {/* Cell shine */}
                          {isFilled && (
                            <div
                              className="absolute inset-x-0 top-0 h-1/3 rounded-t-md"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)",
                              }}
                            />
                          )}
                          {/* Charging pulse */}
                          {isActive && isCharging && (
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                                animation: "pulse 1.5s ease-in-out infinite",
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Battery terminal */}
                  <div
                    className="w-1.5 h-3 rounded-r-sm ml-1"
                    style={{
                      background:
                        "linear-gradient(180deg, #64748b 0%, #475569 100%)",
                    }}
                  />
                </div>

                {/* Status text */}
                <div className="ml-4 text-left">
                  <p
                    className="text-xs font-semibold"
                    style={{
                      color:
                        mobileActiveCard >= 4
                          ? "#22c55e"
                          : mobileActiveCard >= 2
                            ? "#4ade80"
                            : "#94a3b8",
                    }}
                  >
                    {mobileActiveCard >= 4
                      ? "Ready!"
                      : mobileActiveCard >= 2
                        ? "Charging..."
                        : `Step ${mobileActiveCard + 1}`}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {mobileActiveCard + 1} of 5
                  </p>
                </div>
              </div>

              {/* Tap hint */}
              <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-2">
                <span className="w-4 h-px bg-slate-300" />
                Tap battery or swipe
                <span className="w-4 h-px bg-slate-300" />
              </p>
            </div>
          </div>

          {/* ---- DESKTOP BATTERY WIDGET ---- */}
          <div ref={batteryRef} className="hidden md:block">
            {/* Header - Inside pinned container for desktop */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider text-brand">
                  The Experience
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                Your charging journey
              </h2>
              <p className="text-slate-500 max-w-md mx-auto text-base">
                Charging made simple, fast, and effortless.
              </p>
            </div>
            <div className="relative">
              {/* Outer shell — clean premium casing */}
              <div
                className="relative rounded-3xl overflow-hidden border border-slate-200/80"
                style={{
                  background: "#ffffff",
                  boxShadow:
                    "0 1px 2px rgba(16,24,40,0.04), 0 24px 48px -16px rgba(16,24,40,0.16)",
                }}
              >
                {/* Brand accent hairline at the very top */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#FF7A00]/70 to-transparent z-20 pointer-events-none" />

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
                          className="absolute inset-0 bg-slate-50/50 pointer-events-none transition-opacity duration-300"
                          style={{ opacity: isActive ? 0 : 0.3 }}
                        />

                        {/* Current step pulse dot */}
                        <div
                          data-dot
                          className="absolute top-2.5 left-1/2 -translate-x-1/2"
                          style={{ display: isCurrent ? "block" : "none" }}
                        >
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand" />
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
                            "linear-gradient(90deg, #FF7A00, #fbbf24)",
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
                            ? "text-brand"
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
              <div ref={labelsRef} className="grid grid-cols-5 mt-6">
                {journeySteps.map((step, i) => {
                  const isActive = activeStep >= i;
                  const isCurrent = activeStep === i;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(i)}
                      className="flex flex-col items-center gap-2.5 transition-all duration-300 cursor-pointer group py-2"
                      style={{ opacity: isActive ? 1 : 0.4 }}
                    >
                      {/* Pill */}
                      <div
                        data-pill
                        className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 group-hover:scale-110"
                        style={{
                          width: "28px",
                          height: "28px",
                          fontSize: "11px",
                          background: isCurrent
                            ? "linear-gradient(135deg,#FF7A00,#FF9433)"
                            : isActive
                              ? "#1e293b"
                              : "#e2e8f0",
                          color: isActive ? "#fff" : "#94a3b8",
                          boxShadow: isCurrent
                            ? "0 4px 12px rgba(249,115,22,0.4)"
                            : "none",
                        }}
                      >
                        {step.id}
                      </div>

                      <div className="text-center px-1">
                        <p
                          data-title
                          className="font-bold tracking-wide uppercase transition-all duration-300 group-hover:text-brand text-sm lg:text-base"
                          style={{
                            color: isCurrent ? "#FF7A00" : "#1e293b",
                            marginBottom: "2px",
                          }}
                        >
                          {step.title}
                        </p>
                        {/* <p
                          data-subtitle
                          className="text-slate-400 leading-snug transition-all duration-300 text-xs lg:text-sm"
                          style={{
                            opacity: isActive ? 0.8 : 0,
                          }}
                        >
                          {step.subtitle}
                        </p> */}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Scroll/Click indicator */}
              <div className="flex items-center justify-center gap-3 mt-6 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                    />
                  </svg>
                  <span className="text-xs font-medium">Click cards</span>
                </div>
                <span className="text-slate-300">or</span>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
                  <span className="text-xs font-medium">Scroll</span>
                </div>
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
                  style={{ color: "#FF7A00" }}
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
                  style={{ color: "#0F172A" }}
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
                  style={{ color: "#0F172A" }}
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
                style={{ color: "#FF7A00" }}
              >
                Coming Back?
              </p>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">
                Are you a HubCharge® Member?
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
