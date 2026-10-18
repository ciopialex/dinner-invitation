import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  ForkKnife,
  Sparkle,
  CalendarCheck,
  WhatsappLogo,
  Check,
  ShieldCheck,
  ChatCircleDots,
} from "@phosphor-icons/react";

const SNARKY_REMARKS = [
  "Are you sure? I hear the dessert is unreal.",
  "Don't make me attempt an omelette.",
  "Think of the fire department.",
  "You're smiling right now, aren't you?",
  "Just click the gold button already.",
  "Okay fine, you win.",
];

// Anchors for desktop full 2D perimeter evasion
const DESKTOP_ANCHORS = [
  { x: 125, y: -72 },
  { x: -125, y: 72 },
  { x: 125, y: 72 },
  { x: -125, y: -72 },
  { x: 0, y: 78 },
  { x: 0, y: -78 },
  { x: 135, y: 0 },
];

// Anchors for mobile: strictly vertical to ensure zero edge clipping on narrow phone screens
const MOBILE_ANCHORS = [
  { x: 0, y: -70 },
  { x: 0, y: 70 },
  { x: -15, y: -70 },
  { x: 15, y: 70 },
];

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [snarkText, setSnarkText] = useState("");
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Evasion engine: responsive leaps ensuring zero screen clipping
  const evade = useCallback(() => {
    setNoAttempts((prev) => {
      const nextCount = prev + 1;
      const remarkIndex = Math.min(nextCount - 1, SNARKY_REMARKS.length - 1);
      setSnarkText(SNARKY_REMARKS[remarkIndex]);

      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        const anchor = MOBILE_ANCHORS[(nextCount - 1) % MOBILE_ANCHORS.length];
        setNoPos(anchor);
      } else {
        const anchor = DESKTOP_ANCHORS[(nextCount - 1) % DESKTOP_ANCHORS.length];
        setNoPos(anchor);
      }

      return nextCount;
    });
  }, []);

  // Golden stardust celebration
  const triggerCelebration = () => {
    setAccepted(true);
    const count = 220;
    const defaults = {
      origin: { y: 0.65 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.3, {
      spread: 30,
      startVelocity: 55,
      colors: ["#f59e0b", "#fbbf24", "#ffffff"],
    });
    fire(0.25, {
      spread: 70,
      colors: ["#f59e0b", "#f97316", "#fef08a"],
    });
    fire(0.35, {
      spread: 110,
      decay: 0.92,
      scalar: 0.85,
    });
    fire(0.1, {
      spread: 130,
      startVelocity: 25,
      decay: 0.93,
      scalar: 1.2,
    });
  };

  const handleShare = () => {
    const text = encodeURIComponent("You have a deal. Where are you taking me?");
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("You have a deal. Where are you taking me?");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Subtle grow factor for the gold button as she tries clicking No
  const yesScale = Math.min(1 + noAttempts * 0.04, 1.25);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#09090b]"
    >
      {/* Ambient background glow for intimate bistro atmosphere */}
      <div className="glow-warm w-[500px] h-[500px] bg-amber-500/10 -top-32 -left-32" />
      <div className="glow-warm w-[460px] h-[460px] bg-orange-500/10 -bottom-32 -right-32" />

      {/* Subtle background grain / grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <main className="relative z-10 w-full max-w-[540px]">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="proposition-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bistro-card rounded-2xl p-7 sm:p-10 text-center"
            >
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide mb-6">
                <ForkKnife size={15} weight="fill" className="text-amber-400" />
                <span>URGENT CULINARY PROPOSITION</span>
              </div>

              {/* The Lead Headline */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug mb-5">
                One thing I never did for a girl before in my life is learn how to cook.
              </h1>

              {/* The Supporting Lead */}
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-4">
                So before I try to impress you with my questionable culinary experiments, will you
                let me impress you with something made by somebody who actually knows what they are
                doing?
              </p>

              {/* The Punchline */}
              <div className="inline-flex items-center gap-1.5 text-zinc-400 text-sm font-medium mb-8 pb-1 border-b border-white/5">
                <Sparkle size={15} className="text-amber-400" />
                <span>And yeah, this is me asking you out to eat.</span>
              </div>

              {/* Interactive Button Arena with defined height */}
              <div className="relative min-h-[140px] flex items-center justify-center gap-4 py-2">
                {/* PRIMARY ACCEPTANCE BUTTON */}
                <motion.button
                  animate={{ scale: yesScale }}
                  whileHover={{ scale: yesScale * 1.04 }}
                  whileTap={{ scale: yesScale * 0.97 }}
                  transition={{ type: "spring", stiffness: 450, damping: 26 }}
                  onClick={triggerCelebration}
                  className="relative z-20 px-7 sm:px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-[0_0_30px_-4px_rgba(251,191,36,0.55)] transition-all cursor-pointer flex items-center gap-2 select-none"
                >
                  <Sparkle size={18} weight="fill" className="text-zinc-950" />
                  <span>Yes, absolutely</span>
                </motion.button>

                {/* RUNAWAY "NO" BUTTON (ALWAYS VISIBLE, NEVER SLIPS BEHIND) */}
                <motion.div
                  className="relative z-30"
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: "spring", stiffness: 450, damping: 26 }}
                >
                  {/* Banter bubble docked directly above the button */}
                  <AnimatePresence>
                    {snarkText && (
                      <motion.div
                        key={snarkText}
                        initial={{ opacity: 0, y: 6, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-md bg-zinc-800 text-[11px] font-medium text-amber-300 border border-white/10 shadow-xl pointer-events-none z-40"
                      >
                        {snarkText}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onMouseEnter={evade}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      evade();
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      evade();
                    }}
                    onClick={evade}
                    className="px-5 sm:px-6 py-3.5 rounded-full font-medium text-sm sm:text-base text-zinc-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer select-none active:scale-95 whitespace-nowrap"
                  >
                    {noAttempts >= 6 ? "Fine, you win" : "No"}
                  </button>
                </motion.div>
              </div>

              {/* Sub-counter */}
              {noAttempts > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-zinc-400 mt-4"
                >
                  Dodge counter: {noAttempts}. Physics is on our side.
                </motion.p>
              )}
            </motion.div>
          ) : (
            /* CELEBRATION VIEW */
            <motion.div
              key="celebration-card"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bistro-card rounded-2xl p-7 sm:p-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_32px_rgba(251,191,36,0.3)]">
                <Sparkle size={32} weight="fill" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide mb-3">
                <Check size={14} weight="bold" />
                <span>OFFICIALLY AGREED</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                A Wise Choice.
              </h2>

              <p className="text-zinc-300 text-base leading-relaxed mb-6">
                No burnt pans. No kitchen alarms. Just good food, great drinks, and zero cooking hazards.
              </p>

              {/* Itinerary details */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left mb-6 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <CalendarCheck size={16} className="text-amber-400" />
                    The Plan
                  </span>
                  <span className="text-white font-medium">Table for Two</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-400" />
                    My Promise
                  </span>
                  <span className="text-amber-300 font-medium">I won't touch a single stove</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <ChatCircleDots size={16} className="text-amber-400" />
                    Dress code
                  </span>
                  <span className="text-white font-medium">Whatever makes you feel amazing</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 rounded-full font-semibold text-sm bg-[#25D366] hover:bg-[#20ba59] text-zinc-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  <span>Send Confirmation</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="py-3 px-5 rounded-full font-medium text-sm bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Sparkle size={16} />}
                  <span>{copied ? "Copied to clipboard!" : "Copy message"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
