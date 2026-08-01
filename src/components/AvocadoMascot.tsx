import clsx from "clsx";

type Mood = "idle" | "focused" | "resting";

// Deliberately simple, flat-line-art avocado — cute through shape and
// expression, not through gloss/gradients. Three expressions:
//   idle    -> soft round eyes, gentle smile (nothing running)
//   focused -> squinting/determined eyes (work session running)
//   resting -> closed, sleepy eyes (break session running)
export function AvocadoMascot({
  mood,
  size = 72,
  className,
}: {
  mood: Mood;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={clsx(mood === "focused" && "animate-pulse-soft", className)}
    >
      {/* body */}
      <path
        d="M50 8 C72 8 82 34 82 56 C82 78 68 92 50 92 C32 92 18 78 18 56 C18 34 28 8 50 8 Z"
        fill="#6F8A57"
      />
      <path
        d="M50 16 C67 16 75 36 75 55 C75 74 64 85 50 85 C36 85 25 74 25 55 C25 36 33 16 50 16 Z"
        fill="#A9CC85"
      />
      {/* pit */}
      <ellipse cx="50" cy="58" rx="17" ry="19" fill="#8B5E3C" />
      <ellipse cx="50" cy="58" rx="17" ry="19" fill="#6F8A57" opacity="0.12" />

      {/* face, positioned on the light flesh area above the pit */}
      {mood === "idle" && (
        <g>
          <circle cx="40" cy="38" r="3.2" fill="#14151A" />
          <circle cx="60" cy="38" r="3.2" fill="#14151A" />
          <path
            d="M42 47 Q50 52 58 47"
            stroke="#14151A"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {mood === "focused" && (
        <g>
          <path d="M36 37 L44 39" stroke="#14151A" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M64 37 L56 39" stroke="#14151A" strokeWidth="2.4" strokeLinecap="round" />
          <path
            d="M43 48 Q50 46 57 48"
            stroke="#14151A"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {mood === "resting" && (
        <g>
          <path d="M36 38 Q40 41 44 38" stroke="#14151A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M56 38 Q60 41 64 38" stroke="#14151A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="49" r="1.6" fill="#14151A" />
        </g>
      )}
    </svg>
  );
}
