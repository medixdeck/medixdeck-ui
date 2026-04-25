"use client";

import React from "react";
import { useThemeMode } from "../../hooks/useThemeMode";

export type LogoVariant = "blue" | "purple" | "black" | "white";
export type LogoType = "full" | "icon";

export interface LogoProps {
  /**
   * Color variant of the logo.
   * - "blue"   → #0685FF  (primary brand color)
   * - "purple" → #7700CC  (secondary brand color)
   * - "black"  → #111926  (dark)
   * - "white"  → #FFFFFF  (for dark backgrounds)
   * @default "blue"
   */
  variant?: LogoVariant;
  /**
   * "full"  → brand mark + "MedixDeck" wordmark
   * "icon"  → brand mark only
   * @default "full"
   */
  type?: LogoType;
  /**
   * Height of the logo in pixels. Width scales proportionally.
   * @default 32
   */
  height?: number;
  /** Optional className applied to the root <span> */
  className?: string;
  /** Extra inline styles on the root <span> */
  style?: React.CSSProperties;
}

// ─── Color maps ──────────────────────────────────────────────────────────────
const MARK_COLOR: Record<LogoVariant, string> = {
  blue: "#0685FF",
  purple: "#7700CC",
  black: "#111926",
  white: "#FFFFFF",
};

/**
 * Text (wordmark) color.
 * For `blue` and `purple` variants the mark is already coloured, so the
 * wordmark should match the surface text: dark on light bg, white on dark bg.
 * `black` and `white` variants are explicit — always honour them.
 */
const TEXT_COLOR_LIGHT: Record<LogoVariant, string> = {
  blue: "#111926",
  purple: "#111926",
  black: "#111926",
  white: "#FFFFFF",
};

const TEXT_COLOR_DARK: Record<LogoVariant, string> = {
  blue: "#FFFFFF",   // white on dark bg
  purple: "#FFFFFF",   // white on dark bg
  black: "#111926",   // explicit black — unchanged
  white: "#FFFFFF",   // explicit white — unchanged
};


// ─── Brand-mark SVG (icon only) ───────────────────────────────────────────────
//
// Derived from assets/logos/logo-icon-purple.svg (pure single-path vector mark).
// The shape is a rounded square containing the stylised "M" wave.
// Original viewBox: 0 0 2500 2500 — we normalise to 0 0 532 532 for compactness.
// The path below is the single <path> from logo-icon-purple.svg with its
// transform matrix already applied and coordinates rounded to integers.
// Color is injected at runtime via the `fill` prop.

function MedixMark({ color, height }: { color: string; height: number }) {
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 532 532"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/*
        Path reproduced from logo-icon-purple.svg.
        The original coordinate space (2500×2500) is scaled to 532×532.
        Scale factor ≈ 532/2500 = 0.2128.

        Key points from the SVG (after applying the outer transform chain):
          viewBox 0 0 532 532 corresponds to the original 2500×2500 space.

        Instead of re-deriving the path (which risks precision loss), we embed
        the SVG directly scaled via a <g transform="scale(…)"> wrapper so the
        original path coordinates are preserved exactly.
      */}
      <g>
        <path
          d="
            M394.335,2488.823C394.554,2488.998 394.639,2489.292 394.547,2489.557
            C394.454,2489.822 394.204,2490 393.924,2490C375.317,2490 225.88,2490
            225.88,2490C199.437,2490 178,2468.563 178,2442.12L178,2005.88
            C178,1979.437 199.437,1958 225.88,1958L662.12,1958
            C688.563,1958 710,1979.437 710,2005.88L710,2229.103
            C705.9,2213.585 701.763,2198.117 697.603,2182.745
            C695.811,2176.086 692.135,2162.841 690.354,2156.167L686.684,2142.89
            C684.779,2136.191 679.606,2130.414 672.464,2128.176
            C661.192,2124.644 649.192,2130.918 645.661,2142.189
            C645.656,2142.2 640.542,2158.554 640.531,2158.562
            C621.999,2218.218 603.451,2279.044 585.808,2338.903
            C584.671,2342.744 583.273,2347.499 581.74,2352.732
            C581.67,2352.969 581.458,2353.137 581.212,2353.15
            C580.965,2353.163 580.736,2353.019 580.642,2352.79
            C564.661,2314.068 548.29,2275.087 532.023,2237.116
            C528.352,2226.577 513.846,2225.401 508.748,2235.524L500.846,2251.532
            C494.027,2265.509 486.438,2280.793 479.597,2295.008
            C479.597,2295.008 436.069,2383.443 431.51,2392.706
            C431.286,2393.161 431.413,2393.711 431.814,2394.021
            C433.263,2395.142 436.626,2397.742 438.275,2399.017
            C438.515,2399.203 438.824,2399.277 439.123,2399.222
            C439.422,2399.166 439.683,2398.985 439.84,2398.725
            C445.834,2388.818 493.319,2310.326 493.684,2309.731
            C500.84,2297.999 508.653,2285.339 516.051,2273.133
            C516.168,2272.939 516.387,2272.831 516.613,2272.856
            C516.838,2272.881 517.028,2273.034 517.101,2273.248
            C528.203,2306.041 540.617,2341.984 551.933,2374.266
            C556.929,2388.443 561.912,2402.625 566.966,2416.781
            C568.806,2421.847 572.884,2426.143 578.389,2427.989
            C588.248,2431.333 598.92,2425.683 601.835,2415.722L612.744,2383.232
            C630.147,2331.149 647.399,2278.183 664.218,2225.484
            C664.314,2225.186 664.593,2224.985 664.906,2224.99
            C665.219,2224.994 665.493,2225.203 665.579,2225.504
            C668.949,2237.233 672.331,2248.892 675.679,2260.287
            C685.796,2294.879 696.817,2331.451 707.457,2365.829
            C708.016,2368.018 708.889,2369.95 710,2371.619L710,2442.12
            C710,2468.563 688.563,2490 662.12,2490L477.453,2490
            C477.156,2490 476.867,2489.902 476.631,2489.722
            C457.299,2474.985 438.453,2459.752 421.161,2443.298
            C412.607,2435.236 403.479,2425.986 395.548,2417.282
            C379.508,2399.804 364.42,2381.572 352.559,2361.076
            C326.4,2316.618 312.562,2264.49 315.392,2212.886
            C316.216,2200.363 317.83,2187.671 320.751,2175.467
            C321.065,2174.238 321.893,2170.686 322.182,2169.527
            C322.553,2168.204 323.549,2165.048 323.922,2163.655
            C351.204,2075.514 443.187,2010.628 535.637,2015.16
            C561.342,2016.889 586.119,2025.438 609.443,2036.154
            C637.886,2049.35 664.476,2066.31 689.615,2085.03L693.462,2087.898
            L693.505,2087.932C695.324,2089.292 697.896,2089.328 699.78,2087.862
            C702.032,2086.104 702.434,2082.852 700.679,2080.598
            C686.502,2062.447 670.231,2045.755 652.687,2030.749
            C621.192,2004.201 584.741,1981.815 543.918,1973.331
            C465.886,1958.184 383.437,1988.87 327.543,2043.897
            C308.123,2063.018 291.777,2085.124 279.269,2109.433
            C278.071,2111.881 275.685,2116.914 274.502,2119.362
            C272.958,2122.749 271.137,2127.369 269.669,2130.806
            C267.99,2135.574 266.054,2140.322 264.652,2145.186L263.037,2150.496
            L262.236,2153.154L261.556,2155.849C260.836,2159.042 259.531,2163.44
            258.978,2166.617C255.952,2180.668 254.15,2195.197 253.377,2209.543
            C251.4,2248.711 257.554,2288.211 270.508,2325.184
            C282.242,2358.498 299.504,2389.917 321.541,2417.523
            C328.923,2426.794 337.487,2436.055 345.675,2444.555
            C353.486,2452.676 362.788,2461.68 371.226,2469.229
            C378.696,2475.993 386.419,2482.518 394.335,2488.823Z
          "
          fill={color}
          fillRule="evenodd"
          // Translate so the shape is centred in the 2500×2500 cell.
          // The original shape spans roughly x∈[178,710], y∈[1958,2490].
          // We shift it to x∈[0,532], y∈[0,532] via translate(-178,-1958).
          transform="translate(-178,-1958)"
        />
      </g>
    </svg>
  );
}

// ─── Wordmark SVG — "MedixDeck" text ─────────────────────────────────────────
//
// Reproduced from the path data in assets/logos/logo-text-blue.svg.
// The original SVG is 163×32 with the text spanning x∈[44,162], y centred.
// We embed the path verbatim and scale to the requested height.

function MedixWordmark({ color, height }: { color: string; height: number }) {
  // Original dimensions from logo-text-blue.svg
  const origH = 32;
  const origW = 163;    // full width of original SVG
  const textStartX = 44; // text glyphs start at x≈44 (icon occupies 0..32)
  const textW = origW - textStartX; // ≈119 px of text

  const scale = height / origH;
  const displayW = Math.round(textW * scale);

  return (
    <svg
      width={displayW}
      height={height}
      viewBox={`${textStartX} 0 ${textW} ${origH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* Path data from logo-text-blue.svg — the "MedixDeck" glyph paths */}
      <path
        d="
          M46.32 25H44.016V7.648H46.32L52.296 22.24L58.272 7.648H60.624V25H58.32
          V18.136C58.32 14.896 58.344 13.72 58.464 12.496L53.4 25H51.192L46.152
          12.544C46.272 13.384 46.32 15.16 46.32 17.584V25Z

          M69.3444 25.288C65.8884 25.288 63.5124 22.792 63.5124 19.144
          C63.5124 15.472 65.8404 12.928 69.2484 12.928C72.5844 12.928
          74.7684 15.232 74.7684 18.712V19.552L65.6964 19.576
          C65.8644 22.048 67.1604 23.416 69.3924 23.416C71.1444 23.416
          72.2964 22.696 72.6804 21.352H74.7924C74.2164 23.872 72.2484 25.288
          69.3444 25.288ZM69.2484 14.824C67.2804 14.824 66.0324 16 65.7444 18.064
          H72.5124C72.5124 16.12 71.2404 14.824 69.2484 14.824Z

          M81.9922 25.288C78.5843 25.288 76.5203 22.744 76.5203 19.168
          C76.5203 15.568 78.6083 12.928 82.0883 12.928C83.8883 12.928
          85.4003 13.72 86.1923 15.16V7.336H88.4243V25H86.4083L86.2163 22.864
          C85.4483 24.472 83.8643 25.288 81.9922 25.288ZM82.4483 23.248
          C84.7523 23.248 86.1683 21.544 86.1683 19.096C86.1683 16.696
          84.7523 14.968 82.4483 14.968C80.1443 14.968 78.8003 16.696
          78.8003 19.096C78.8003 21.52 80.1443 23.248 82.4483 23.248Z

          M92.7829 10.48C91.9669 10.48 91.2949 9.808 91.2949 8.992
          C91.2949 8.152 91.9669 7.504 92.7829 7.504C93.5989 7.504
          94.2709 8.152 94.2709 8.992C94.2709 9.808 93.5989 10.48 92.7829 10.48Z
          M91.6789 25V13.264H93.9349V25H91.6789Z

          M98.4101 25H95.8181L99.9221 19.192L95.8421 13.264H98.4581L101.434 17.632
          L104.338 13.264H106.906L102.826 19.192L106.834 25H104.218L101.29 20.704
          L98.4101 25Z

          M114.908 25H109.172V7.648H114.812C119.996 7.648 123.5 11.152
          123.5 16.336C123.5 21.496 120.044 25 114.908 25ZM114.644 9.808H111.524
          V22.816H114.74C118.604 22.816 121.052 20.32 121.052 16.336
          C121.052 12.304 118.604 9.808 114.644 9.808Z

          M131.173 25.288C127.717 25.288 125.341 22.792 125.341 19.144
          C125.341 15.472 127.669 12.928 131.077 12.928C134.413 12.928
          136.597 15.232 136.597 18.712V19.552L127.525 19.576
          C127.693 22.048 128.989 23.416 131.221 23.416C132.973 23.416
          134.125 22.696 134.509 21.352H136.621C136.045 23.872 134.077 25.288
          131.173 25.288ZM131.077 14.824C129.109 14.824 127.861 16 127.573 18.064
          H134.341C134.341 16.12 133.069 14.824 131.077 14.824Z

          M138.348 19.144C138.348 15.472 140.676 12.928 144.108 12.928
          C147.06 12.928 149.124 14.608 149.532 17.224H147.276
          C146.892 15.736 145.692 14.944 144.18 14.944C142.044 14.944
          140.58 16.576 140.58 19.12C140.58 21.64 141.948 23.272 144.084 23.272
          C145.692 23.272 146.892 22.432 147.3 21.04H149.556
          C149.1 23.584 146.916 25.288 144.084 25.288C140.628 25.288
          138.348 22.84 138.348 19.144Z

          M154.241 25H151.985V7.336H154.241V18.784L159.449 13.264H162.281
          L157.793 17.944L162.257 25H159.665L156.233 19.576L154.241 21.664V25Z
        "
        fill={color}
      />
    </svg>
  );
}

/**
 * MedixDeck Logo
 *
 * Pure inline-SVG brand logo. Works in **every** consuming project immediately —
 * no image files, no asset pipeline, no CDN hosting required.
 *
 * The mark path is derived from `assets/logos/logo-icon-purple.svg` (the
 * canonical vector-only file for the brand mark).  The wordmark paths are
 * derived from `assets/logos/logo-text-blue.svg`.  Both are embedded as
 * inline SVG so they bundle directly into the library JS.
 *
 * @example
 * ```tsx
 * // Full logo, default blue, 32 px tall
 * <Logo />
 *
 * // Purple icon-only at 48 px
 * <Logo variant="purple" type="icon" height={48} />
 *
 * // White full logo for dark navbars
 * <Logo variant="white" height={28} />
 * ```
 */
export function Logo({
  variant = "blue",
  type = "full",
  height = 32,
  className,
  style,
}: LogoProps) {
  const { mounted, themeMode } = useThemeMode();

  // Safe fallback for SSR: always render light mode text first,
  // then update to dark after mounting if necessary.
  const dark = mounted ? themeMode === "dark" : false;

  const markColor = MARK_COLOR[variant];
  const textColor = dark ? TEXT_COLOR_DARK[variant] : TEXT_COLOR_LIGHT[variant];

  const gap = Math.round(height * 0.3);

  const wrapperStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: `${gap}px`,
    lineHeight: 1,
    ...style,
  };

  return (
    <span
      className={className}
      style={wrapperStyle}
      role="img"
      aria-label="MedixDeck logo"
      suppressHydrationWarning
    >
      <MedixMark color={markColor} height={height} />
      {type === "full" && (
        <MedixWordmark color={textColor} height={height} />
      )}
    </span>
  );
}
