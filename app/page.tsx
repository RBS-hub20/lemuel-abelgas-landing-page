"use client";

import Image from "next/image";
import Lenis from "lenis";
import {
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Contact details: replace each "#connect" with the real link before launch */
/* -------------------------------------------------------------------------- */

const CONTACT = {
  email: "#connect", // "mailto:you@yourdomain.com"
  viber: "#connect", // "viber://chat?number=%2B63XXXXXXXXXX"
  socials: [
    { label: "Facebook", href: "#connect", icon: "facebook" },
    { label: "Instagram", href: "#connect", icon: "instagram" },
    { label: "LinkedIn", href: "#connect", icon: "linkedin" },
  ],
} as const;

const CHAPTERS = [
  { id: "top", label: "Hello" },
  { id: "about", label: "About me" },
  { id: "journey", label: "Where it began" },
  { id: "breakthroughs", label: "Breakthroughs" },
  { id: "empowering", label: "Empowering" },
  { id: "challenges", label: "Challenges" },
  { id: "media", label: "Media" },
  { id: "next", label: "The next phase" },
  { id: "love", label: "Things I love" },
  { id: "connect", label: "Connect" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { stiffness: 140, damping: 18, mass: 0.5 };
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* -------------------------------------------------------------------------- */
/*  Motion primitives                                                         */
/* -------------------------------------------------------------------------- */

function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: true });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}

const riseGroup = (delay = 0, stagger = 0.07) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
const riseWord = {
  hidden: { y: "112%" },
  show: { y: "0%", transition: { duration: 1.15, ease: EASE } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
};

const inView = { once: true, margin: "-12% 0px -6% 0px" };

/** Masked word-by-word rise for headlines. Renders plain words, so it stays readable to screen readers. */
function Rise({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={`block ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={riseGroup(delay)}
    >
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
            <motion.span className="inline-block" variants={riseWord}>
              {word}
            </motion.span>
          </span>{" "}
        </span>
      ))}
    </motion.span>
  );
}

function Hand({
  children,
  className = "",
  delay = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={`font-hand block ${className}`}
      initial={{ opacity: 0, x: -18, rotate: -2 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={inView}
      transition={{ duration: 1.3, ease: EASE, delay }}
    >
      {children}
    </motion.span>
  );
}

function Stagger({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={riseGroup(delay, 0.13)}
    >
      {children}
    </motion.div>
  );
}

function P({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.p variants={fadeUp} className={className}>
      {children}
    </motion.p>
  );
}

function Magnetic({
  children,
  strength = 0.34,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 14, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 170, damping: 14, mass: 0.35 });
  const pull = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const release = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={pull}
      onPointerLeave={release}
    >
      {children}
    </motion.div>
  );
}

function PillCTA({
  href = "#connect",
  children,
  dark = false,
}: {
  href?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <Magnetic>
      <a
        href={href}
        className={`group inline-flex h-[58px] items-center gap-4 rounded-full pr-2 pl-8 text-[15px] font-medium tracking-tight shadow-[0_18px_50px_-12px_rgba(0,0,0,.65)] transition-transform duration-500 hover:scale-[1.03] ${
          dark ? "bg-ink text-white" : "bg-white text-ink"
        }`}
      >
        {children}
        <span
          className={`grid size-[42px] place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${
            dark ? "bg-white text-ink" : "bg-ink text-white"
          }`}
        >
          <ArrowIcon />
        </span>
      </a>
    </Magnetic>
  );
}

/* -------------------------------------------------------------------------- */
/*  Slab: every photo is a physical, tilted object with an edge and a shadow  */
/* -------------------------------------------------------------------------- */

type SlabProps = {
  src: string;
  alt: string;
  aspect: string;
  label?: ReactNode;
  icon?: ReactNode;
  tilt?: [number, number];
  roll?: number;
  drift?: number;
  radius?: number;
  sizes?: string;
  tone?: "dark" | "light";
  swing?: boolean;
  shadow?: boolean;
  className?: string;
};

function Slab({
  src,
  alt,
  aspect,
  label,
  icon,
  tilt = [3, -10],
  roll = 0,
  drift = 44,
  radius = 34,
  sizes = "(min-width:1024px) 40vw, 90vw",
  tone = "dark",
  swing = true,
  shadow = true,
  className = "",
}: SlabProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [drift, -drift],
  );
  const scrollSwing = useTransform(
    scrollYProgress,
    [0, 1],
    reduce || !swing ? [0, 0] : [9, -9],
  );

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const glow = useSpring(hover, { stiffness: 120, damping: 22 });

  const rotateX = useTransform(
    [sy, scrollSwing] as MotionValue<number>[],
    ([p, s]: number[]) => tilt[0] + s - p * 18,
  );
  const rotateY = useTransform(sx, (p) => tilt[1] + p * 22);
  const scale = useTransform(glow, [0, 1], [1, 1.025]);
  const gx = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]);
  const gy = useTransform(sy, [-0.5, 0.5], ["5%", "95%"]);
  const glare = useMotionTemplate`radial-gradient(55% 55% at ${gx} ${gy}, rgba(255,255,255,.34), rgba(255,255,255,0) 72%)`;

  const track = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    hover.set(1);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  const edge =
    tone === "dark"
      ? "linear-gradient(145deg,#6a7482,#20272f 55%,#3a434e)"
      : "linear-gradient(145deg,#ffffff,#b9b3a9 60%,#dcd7ce)";
  const frame =
    tone === "dark"
      ? "linear-gradient(145deg,#7d8795 0%,#262e37 38%,#1a2029 62%,#4a5461 100%)"
      : "linear-gradient(145deg,#ffffff 0%,#ece8e1 45%,#cfc9bf 100%)";

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`relative ${className}`}
      onPointerMove={track}
      onPointerLeave={reset}
    >
      <div className="float-slow">
        <motion.div
          className="relative"
          style={{
            rotateX,
            rotateY,
            rotateZ: roll,
            scale,
            transformPerspective: 1500,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Stacked plates behind the photo read as real thickness once it tilts */}
          {[6, 5, 4, 3, 2, 1].map((i) => (
            <span
              key={i}
              aria-hidden
              className="absolute inset-0"
              style={{
                borderRadius: radius,
                background: edge,
                transform: `translateZ(${-i * 3.5}px)`,
              }}
            />
          ))}
          <div
            className="relative p-[5px]"
            style={{
              borderRadius: radius,
              background: frame,
              boxShadow:
                tone === "dark"
                  ? "0 70px 110px -40px rgba(0,0,0,.85), 0 24px 40px -18px rgba(0,0,0,.6)"
                  : "0 70px 100px -40px rgba(24,28,36,.5), 0 22px 40px -20px rgba(24,28,36,.35)",
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: radius - 5, aspectRatio: aspect }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                quality={90}
                className="object-cover"
                draggable={false}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0"
                style={{ background: glare, opacity: glow }}
              />
              <span
                aria-hidden
                className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,.14),inset_0_1px_0_rgba(255,255,255,.3)]"
                style={{ borderRadius: radius - 5 }}
              />
            </div>
          </div>
          {icon && (
            <span
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md"
              style={{ transform: "translateZ(40px)" }}
            >
              {icon}
            </span>
          )}
          {label && (
            <span
              className="absolute right-4 bottom-4 left-4 flex"
              style={{ transform: "translateZ(46px)" }}
            >
              <span className="rounded-[18px] border border-white/25 bg-black/45 px-4 py-2.5 text-[13px] leading-snug font-medium text-white backdrop-blur-md lg:text-sm">
                {label}
              </span>
            </span>
          )}
        </motion.div>
      </div>
      {shadow && (
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-[12%] -bottom-[10%] -z-10 h-[11%] rounded-[50%] blur-[30px] ${
            tone === "dark" ? "bg-black/85" : "bg-[#1a1f27]/40"
          }`}
        />
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page chrome                                                               */
/* -------------------------------------------------------------------------- */

function FloatingNav() {
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) =>
    setShown(v > window.innerHeight * 0.85),
  );
  return (
    <motion.nav
      aria-label="Page"
      initial={false}
      animate={{ y: shown ? 0 : -90, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-x-0 top-3 z-40 flex justify-center px-3 lg:top-5"
      style={{ pointerEvents: shown ? "auto" : "none" }}
    >
      <div className="flex h-[52px] w-full max-w-[640px] items-center justify-between rounded-full border border-white/15 bg-[#0E1218]/70 pr-1.5 pl-6 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl">
        <a href="#top" className="font-display text-[17px] tracking-tight">
          Lemuel<sup className="ml-px text-[10px]">°</sup>
        </a>
        <div className="hidden items-center gap-6 text-[13px] text-white/65 sm:flex">
          <a className="transition-colors hover:text-white" href="#about">
            About
          </a>
          <a className="transition-colors hover:text-white" href="#journey">
            Journey
          </a>
          <a className="transition-colors hover:text-white" href="#next">
            Next phase
          </a>
        </div>
        <a
          href="#connect"
          className="rounded-full bg-white px-5 py-2.5 text-[13px] font-medium text-ink transition-transform duration-500 hover:scale-[1.04]"
        >
          Let&rsquo;s Collaborate
        </a>
      </div>
    </motion.nav>
  );
}

/** The vertical dot rail from the reference's product view, used as chapter navigation. */
function ChapterDots() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-2.5 z-30 hidden -translate-y-1/2 flex-col gap-1 mix-blend-difference lg:flex"
    >
      {CHAPTERS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={label}
          aria-current={active === id ? "true" : undefined}
          title={label}
          className="grid size-4 place-items-center"
        >
          <span
            className={`block rounded-full transition-all duration-500 ${
              active === id
                ? "size-3 border border-white bg-transparent p-px after:block after:size-full after:rounded-full after:bg-white"
                : "size-1 bg-white/80"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-paper text-ink relative mx-3 rounded-[32px] sm:mx-5 lg:mx-8 lg:rounded-[40px] ${className}`}
    >
      {children}
    </div>
  );
}

function Glow({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(120,136,156,.26),rgba(120,136,156,0))] ${className}`}
    />
  );
}

const bodyDark =
  "text-[17px] leading-[1.68] text-white/72 lg:text-[19px] [&_strong]:font-semibold [&_strong]:text-white";
const bodyLight =
  "text-[17px] leading-[1.68] text-ink/78 lg:text-[19px] [&_strong]:font-semibold [&_strong]:text-ink";

/* -------------------------------------------------------------------------- */
/*  1. Hero                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const wordScroll = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const cutScroll = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const cutScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const wordX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const cutX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);

  const track = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  const word = "Lemuel".split("");

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate px-3 pt-3 sm:px-5 sm:pt-5 lg:px-8 lg:pt-8"
    >
      {/* The two-tone ground the reference's hero card sits across */}
      <span
        aria-hidden
        className="bg-sand absolute inset-x-0 top-0 -z-20 h-[46%]"
      />
      <span
        aria-hidden
        className="bg-ink-2 absolute inset-x-0 top-[34%] bottom-0 -z-10 rounded-t-[32px] lg:rounded-t-[40px]"
      />

      <div
        onPointerMove={track}
        className="hero-card relative isolate flex flex-col overflow-hidden rounded-[32px] border border-white/85 text-white lg:block lg:h-[calc(100svh-4rem)] lg:min-h-[640px] lg:rounded-[40px]"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(52%_62%_at_56%_46%,#46515f_0%,#232b35_46%,#121821_100%)]"
        />

        <header className="relative z-30 flex items-center justify-between px-6 pt-6 lg:px-12 lg:pt-10">
          <a
            href="#top"
            className="font-display text-[19px] tracking-tight lg:text-[21px]"
          >
            Lemuel Abelgas<sup className="ml-px text-[11px]">°</sup>
          </a>
          <nav
            aria-label="Primary"
            className="flex items-center gap-7 text-[13px] text-white/75"
          >
            <a
              className="hidden transition-colors hover:text-white sm:block"
              href="#about"
            >
              About
            </a>
            <a
              className="hidden transition-colors hover:text-white sm:block"
              href="#journey"
            >
              Journey
            </a>
            <a
              className="hidden transition-colors hover:text-white sm:block"
              href="#next"
            >
              Next phase
            </a>
            <a
              href="#connect"
              aria-label="Let's collaborate"
              className="text-ink grid size-9 place-items-center rounded-full bg-white transition-transform duration-500 hover:rotate-45"
            >
              <ArrowIcon />
            </a>
          </nav>
        </header>

        {/* Stage: solid word, then the portrait, then the word again in outline over him */}
        <div className="relative h-[132vw] max-h-[760px] sm:h-[108vw] lg:absolute lg:inset-0 lg:h-auto lg:max-h-none">
          <motion.div
            aria-hidden
            style={{ y: wordScroll, x: wordX }}
            className="font-display absolute inset-x-0 top-[44%] z-0 text-center text-[24vw] leading-none whitespace-nowrap lg:top-[36%] lg:left-[3.4%] lg:text-left lg:text-[17.4vw]"
          >
            {word.map((c, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[.1em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.4,
                    ease: EASE,
                    delay: 0.15 + i * 0.06,
                  }}
                >
                  {c}
                </motion.span>
              </span>
            ))}
          </motion.div>

          <motion.div
            style={{ y: cutScroll, x: cutX, scale: cutScale }}
            className="absolute bottom-0 left-1/2 z-10 h-[100%] -translate-x-1/2 lg:left-[55%] lg:h-[93%]"
          >
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.35 }}
              className="h-full"
            >
              <motion.div
                className="relative aspect-[600/1120] h-full drop-shadow-[0_40px_50px_rgba(0,0,0,.55)]"
                style={{ rotateX, rotateY, transformPerspective: 1200 }}
              >
                <Image
                  src="/photos/portrait-cutout.webp"
                  alt="Lemuel Abelgas in a black shirt and white trousers, hands clasped in front of him"
                  fill
                  preload
                  quality={90}
                  sizes="(min-width:1024px) 34vw, 80vw"
                  className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_58%,transparent_84%)] lg:[mask-image:linear-gradient(to_bottom,#000_82%,transparent_100%)]"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden
            style={{ y: wordScroll, x: wordX }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="text-outline font-display absolute inset-x-0 top-[44%] z-20 text-center text-[24vw] leading-none whitespace-nowrap lg:top-[36%] lg:left-[3.4%] lg:text-left lg:text-[17.4vw]"
          >
            {word.map((c, i) => (
              <span key={i} className="inline-block pb-[.1em]">
                {c}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Left, under the word: rule + roles, as in the reference */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.1 }}
          className="relative z-30 order-3 flex items-center gap-3 px-6 pb-8 text-[13px] text-white/80 lg:gap-5 lg:text-[14px] lg:absolute lg:bottom-[9%] lg:left-[4.4%] lg:p-0"
        >
          <span aria-hidden className="h-px w-8 bg-white/60 xl:w-24" />
          <span>Trading | Entrepreneur | Community Builder</span>
        </motion.p>

        {/* Right column */}
        <div className="relative z-30 order-2 -mt-24 px-6 pb-8 lg:absolute lg:top-1/2 lg:right-[4.2%] lg:mt-0 lg:w-[23.5%] lg:-translate-y-1/2 lg:p-0">
          <h1 className="font-display text-[clamp(32px,8.8vw,52px)] leading-[1.04] tracking-[-0.005em] uppercase lg:text-[clamp(25px,2.42vw,44px)]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.75 }}
            >
              Nice to meet you! I&rsquo;m Lemuel Abelgas &mdash; glad to have
              you here.
            </motion.span>
          </h1>
          <motion.div
            className="mt-7 lg:mt-9"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.95 }}
          >
            <PillCTA>Let&rsquo;s Collaborate</PillCTA>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. About me                                                               */
/* -------------------------------------------------------------------------- */

function About() {
  return (
    <section id="about" className="bg-ink-2 relative pt-28 lg:pt-44">
      <Panel className="px-6 pt-14 pb-16 lg:grid lg:grid-cols-12 lg:gap-x-10 lg:px-20 lg:pt-24 lg:pb-28">
        <div className="lg:col-span-7">
          <h2 className="relative mb-12 lg:mb-20">
            <Rise
              text="ABOUT"
              className="font-display text-[clamp(72px,13vw,220px)] leading-[.86] tracking-[-.01em]"
            />
            <Hand className="-mt-[.08em] ml-1 text-[clamp(72px,12vw,190px)] lg:-mt-[.2em] leading-[.8] -rotate-3">
              ME
            </Hand>
          </h2>
          <Stagger className={`max-w-[62ch] space-y-6 ${bodyLight}`}>
            <P>
              I was born in Cebu City, Philippines, and raised by the most
              loving and selfless people I know &mdash; my adoptive parents.
              Even though they never knew my biological parents, they embraced
              me wholeheartedly, never making me feel like an outsider.
            </P>
            <P>
              From the very beginning, I grew up knowing I was adopted, but
              that never changed the way they treated me. Despite not being
              wealthy or even financially average, they gave me something far
              more valuable &mdash; unwavering love, attention, and a true
              sense of belonging.
            </P>
            <P>
              I grew up happy, content, and deeply grateful for the family that
              chose me. I am proud to call them my parents, not by blood, but
              by the love and care they have given me throughout my life.
            </P>
          </Stagger>
        </div>
        <div className="mt-14 lg:sticky lg:top-24 lg:col-span-5 lg:-mt-[280px] lg:self-start">
          <Slab
            src="/photos/age-3.webp"
            alt="Lemuel at three years old looking over his shoulder beside a Dunkin' Donuts box"
            aspect="766/670"
            label="Me at 3 years old"
            tilt={[5, -16]}
            roll={2.5}
            drift={70}
            tone="dark"
            sizes="(min-width:1024px) 38vw, 90vw"
          />
        </div>
      </Panel>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Where my entrepreneurial journey began                                 */
/* -------------------------------------------------------------------------- */

function Journey() {
  return (
    <section
      id="journey"
      className="bg-ink-2 relative isolate overflow-x-clip px-6 pt-32 pb-28 sm:px-8 lg:px-20 lg:pt-52 lg:pb-44"
    >
      <Glow className="top-[18%] -right-[10%] size-[900px]" />
      <h2 className="font-display relative z-10 text-[11.4vw] leading-[.98] text-white lg:text-[8vw]">
        <Rise text="Where my entrepreneurial" />
        <Hand className="mt-1 text-[15vw] leading-[1] text-white/90 lg:mt-3 lg:text-[9.4vw]">
          journey began.
        </Hand>
      </h2>
      <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        <Stagger className={`space-y-7 lg:col-span-6 ${bodyDark}`}>
          <P className="font-display text-[30px] leading-[1.14] text-white lg:text-[46px]">
            Growing up in poverty never defined me &mdash; it fueled me.
          </P>
          <P>
            I never saw myself as poor, nor did I let my circumstances limit my
            dreams. Instead, they became my motivation to push forward, to
            create a better life for my parents and myself.
          </P>
          <P>
            My dream was simple: to become wealthy. But the path to achieving
            it wasn&rsquo;t clear. I had no business skills, no connections,
            and no money to start. The only things I had were my willingness,
            determination, energy, time, and big dreams.
          </P>
          <P>
            Then one day, everything changed. I attended an event where someone
            saw my potential, something I hadn&rsquo;t even fully recognized in
            myself. That moment became the turning point, and from there, the
            rest is history.
          </P>
        </Stagger>
        <div className="mx-auto w-full max-w-[460px] lg:col-span-5 lg:col-start-8 lg:-mt-20 lg:max-w-none">
          <Slab
            src="/photos/age-20.webp"
            alt="Lemuel at twenty years old in a black tuxedo and bow tie"
            aspect="545/786"
            label="Me at 20 years old"
            tilt={[3, -15]}
            roll={-2}
            drift={80}
            sizes="(min-width:1024px) 36vw, 90vw"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Breakthroughs: pinned rail + stacked gallery                           */
/* -------------------------------------------------------------------------- */

function Breakthroughs() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const WINDOW = [0.36, 0.56];
  const firstDim = useTransform(p, WINDOW, [1, 0.28]);
  const secondDim = useTransform(p, WINDOW, [0.28, 1]);
  const pill = useTransform(p, WINDOW, ["4%", "68%"]);

  const STOPS = [0.34, 0.46, 0.58];
  const aX = useTransform(p, STOPS, ["0%", "-26%", "-7%"]);
  const aY = useTransform(p, STOPS, ["0%", "4%", "-10%"]);
  const aR = useTransform(p, STOPS, [-3, -9, -6]);
  const aS = useTransform(p, STOPS, [1, 0.94, 0.84]);
  const aZ = useTransform(p, (v) => (v < 0.46 ? 2 : 1));
  const bX = useTransform(p, STOPS, ["13%", "30%", "4%"]);
  const bY = useTransform(p, STOPS, ["-18%", "-8%", "10%"]);
  const bR = useTransform(p, STOPS, [6, 8, 3]);
  const bS = useTransform(p, STOPS, [0.8, 0.9, 1]);
  const bZ = useTransform(p, (v) => (v < 0.46 ? 1 : 2));

  return (
    <section
      id="breakthroughs"
      ref={ref}
      className="bg-ink-2 relative px-3 sm:px-5 lg:h-[240vh] lg:px-8"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
        <div className="relative isolate w-full overflow-hidden rounded-[32px] border border-white/70 bg-[radial-gradient(60%_80%_at_76%_50%,#3a4452_0%,#1b222b_55%,#121821_100%)] px-6 py-12 text-white grid grid-cols-1 lg:h-[calc(100svh-4rem)] lg:min-h-[600px] lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:rounded-[40px] lg:px-14 lg:py-12">
            <h2 className="font-display text-[11.4vw] leading-[.96] lg:col-span-6 lg:text-[clamp(52px,6.1vw,104px)]">
              <Rise text="Breakthroughs" />
              <Hand className="mt-1 text-[.92em] leading-[1.05] text-white/90">
                journey began.
              </Hand>
            </h2>

            <div className="grid grid-cols-[1fr] gap-x-6 lg:col-span-6 lg:row-start-2 lg:mt-6 lg:grid-cols-[auto_1fr] lg:self-end">
              <div
                aria-hidden
                className="relative mr-1 hidden w-[9px] lg:block"
              >
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/30" />
                <motion.span
                  style={{ top: pill }}
                  className="absolute left-0 h-[28%] w-[9px] rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,.5)]"
                />
              </div>
              <div className="space-y-8">
                <motion.div
                  className="lg:opacity-[var(--dim)]"
                  style={{ "--dim": firstDim } as MotionStyle}
                >
                  <p className="mb-2 text-[12px] tracking-[.18em] text-white/55 uppercase">
                    Before
                  </p>
                  <p className="text-[17px] leading-[1.62] text-white lg:text-[clamp(15px,1.22vw,19px)]">
                    I never imagined my life would take this path. For the
                    longest time, I despised business &mdash; I hated selling
                    and had never even tried it. The thought of speaking in
                    front of thousands terrified me. In school, whenever my
                    teacher called my name, I would find ways to hide, just to
                    avoid the spotlight.
                  </p>
                </motion.div>
                <motion.div
                  className="lg:opacity-[var(--dim)]"
                  style={{ "--dim": secondDim } as MotionStyle}
                >
                  <p className="mb-2 text-[12px] tracking-[.18em] text-white/55 uppercase">
                    After
                  </p>
                  <p className="text-[17px] leading-[1.62] text-white lg:text-[clamp(15px,1.22vw,19px)]">
                    Yet, life had other plans. I went from someone who feared
                    the stage to achieving milestones I once thought
                    impossible. I earned top company incentives, became the
                    youngest top performer, and joined elite circles at an
                    early age. My journey took me across different countries,
                    opening doors I never knew existed.
                  </p>
                </motion.div>
              </div>
            </div>

          <div className="relative -order-none row-start-2 my-8 h-[86vw] sm:h-[70vw] lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:my-0 lg:h-auto">
            <div className="absolute inset-x-[6%] top-[16%] lg:inset-x-[10%] lg:top-[24%]">
              <motion.div
                className="absolute inset-x-0 top-0"
                style={{ x: bX, y: bY, rotate: bR, scale: bS, zIndex: bZ }}
              >
                <Slab
                  src="/photos/crowd.webp"
                  alt="Lemuel speaking on stage to a seated crowd in a large function hall"
                  aspect="639/425"
                  tilt={[4, -10]}
                  drift={0}
                  swing={false}
                  shadow={false}
                  radius={28}
                  sizes="(min-width:1024px) 38vw, 86vw"
                />
              </motion.div>
              <motion.div
                className="absolute inset-x-0 top-0"
                style={{ x: aX, y: aY, rotate: aR, scale: aS, zIndex: aZ }}
              >
                <Slab
                  src="/photos/award.webp"
                  alt="Lemuel receiving an award on stage alongside three colleagues"
                  aspect="613/536"
                  tilt={[4, -10]}
                  drift={0}
                  swing={false}
                  shadow={false}
                  radius={28}
                  sizes="(min-width:1024px) 38vw, 86vw"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Empowering & People's Franchising                                      */
/* -------------------------------------------------------------------------- */

function Empowering() {
  return (
    <section id="empowering" className="bg-ink-2 relative pt-28 lg:pt-44">
      <Panel className="px-6 pt-14 pb-20 lg:px-20 lg:pt-24 lg:pb-32">
        <p className="mb-6 text-[12px] font-medium tracking-[.18em] text-ink/55 uppercase lg:mb-8">
          Empowering &amp; People&rsquo;s Franchising
        </p>
        <h2 className="font-display max-w-[15ch] text-[12.2vw] leading-[.98] lg:text-[7.2vw]">
          <Rise text="The most fulfilling part of my journey?" />
        </h2>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Stagger className={`space-y-6 lg:col-span-5 ${bodyLight}`}>
            <P>
              Empowering aspiring entrepreneurs &mdash; many of whom are older
              than me and come from diverse backgrounds &mdash; to build their
              own businesses. Despite their experience, they approach me with
              humility, eager to learn with an open mind. They embrace the
              process, commit to growth, and ultimately achieve the life they
              once only dreamed of.
            </P>
            <P>
              Witnessing their transformation is a constant reminder that
              success isn&rsquo;t about age or background, it&rsquo;s about
              having the drive to learn, the flexibility to adapt, the courage
              to embrace your transformation, and the determination to take
              action.
            </P>
          </Stagger>
          <div className="lg:col-span-6 lg:col-start-7 lg:-mt-6">
            <Slab
              src="/photos/teaching.webp"
              alt="Lemuel with a microphone coaching a small group at a table"
              aspect="610/405"
              tilt={[4, -14]}
              roll={2}
              drift={60}
              tone="light"
              sizes="(min-width:1024px) 46vw, 90vw"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-14 lg:mt-36 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <Slab
              src="/photos/store.webp"
              alt="Lemuel leaning on a shelf in a convenience store aisle"
              aspect="595/431"
              tilt={[3, 14]}
              roll={-2}
              drift={50}
              tone="light"
              sizes="(min-width:1024px) 46vw, 90vw"
            />
          </div>
          <Stagger
            className={`order-1 space-y-6 lg:order-2 lg:col-span-5 lg:col-start-8 ${bodyLight}`}
          >
            <P className="font-display text-ink text-[30px] leading-[1.12] lg:text-[46px]">
              For nearly a decade
            </P>
            <P>
              I was part of the People&rsquo;s Franchising Industry, a company
              that became one of the greatest turning points in my life &mdash;
              financially, mentally, socially and spiritually. It was there that
              I gained invaluable lessons far beyond what any school or teacher
              had ever taught me. The experiences, especially the challenges and
              setbacks, tested my resilience in ways I never expected. Yet,
              through every struggle I discovered my true strength.
            </P>
            <P>
              It was in those defining moments that my character was shaped, my
              self-awareness deepened, and I realized the full extent of what I
              am truly capable of.
            </P>
          </Stagger>
        </div>
      </Panel>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Challenges: commissary kitchen wall                                    */
/* -------------------------------------------------------------------------- */

const KITCHEN = [
  {
    src: "kitchen-1",
    alt: "The empty commissary kitchen with black cabinets and steel tables",
    aspect: "1/1",
    span: "col-span-3",
    tilt: [3, 7],
  },
  {
    src: "kitchen-2",
    alt: "The commissary kitchen's preparation floor and steel worktables",
    aspect: "1/1",
    span: "col-span-3",
    tilt: [3, -7],
  },
  {
    src: "food-1",
    alt: "Rows of baked meals in clear containers on a steel table",
    aspect: "2/1",
    span: "col-span-4",
    tilt: [2, 5],
  },
  {
    src: "food-3",
    alt: "Red meal trays with rice and vegetables laid out in rows",
    aspect: "1/1",
    span: "col-span-2",
    tilt: [2, -9],
  },
  {
    src: "food-4",
    alt: "Clear packed meals lined up on a counter",
    aspect: "1/1",
    span: "col-span-2",
    tilt: [-2, 9],
  },
  {
    src: "food-2",
    alt: "Black meal boxes filled and arranged across a large table",
    aspect: "2/1",
    span: "col-span-4",
    tilt: [-2, -5],
  },
] as const;

function Challenges() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const planeX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [22, 3]);
  const planeY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-18, -4]);

  return (
    <section
      id="challenges"
      className="bg-ink-2 relative isolate overflow-x-clip px-6 pt-32 pb-28 sm:px-8 lg:px-20 lg:pt-52 lg:pb-44"
    >
      <Glow className="top-[30%] -left-[12%] size-[900px]" />
      <h2 className="font-display text-[12.2vw] leading-[.98] text-white lg:text-[7.6vw]">
        <Rise text="Challenges that shaped" />
        <Hand className="mt-1 text-[14vw] leading-[1.05] text-white/90 lg:mt-2 lg:text-[8.8vw]">
          my next chapter&hellip;
        </Hand>
      </h2>

      <div className="mt-14 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        <Stagger className={`space-y-7 lg:col-span-5 ${bodyDark}`}>
          <P>
            <strong>In 2019</strong>, our company was forced to close due to
            unforeseen personal circumstances &mdash; challenges beyond my
            control. Determined to start anew, I ventured into a different
            industry just as the COVID-19 pandemic was beginning to unfold.
            Seizing the opportunity amidst uncertainty, we launched a commissary
            kitchen, supplying food to private companies during the lockdown.
          </P>
          <P>
            What started from scratch quickly grew into one of the leading food
            providers in the City. More than just sustaining our business, we
            became a source of hope for those who had lost their jobs during
            the crisis. Our commitment to providing employment, even during such
            challenging times, earned us recognition from various government
            agencies, including DTI, DOST, and DOLE.
          </P>
          <motion.ul variants={fadeUp} className="flex flex-wrap gap-2.5 pt-2">
            {["DTI", "DOST", "DOLE"].map((a) => (
              <li
                key={a}
                className="rounded-full border border-white/15 bg-white/[.05] px-5 py-2 text-[13px] font-medium tracking-[.14em] text-white backdrop-blur-md"
              >
                {a}
              </li>
            ))}
          </motion.ul>
        </Stagger>

        <div
          ref={ref}
          className="lg:col-span-7 lg:-mt-10"
          style={{ perspective: 1800 }}
        >
          <motion.div
            className="grid grid-cols-6 gap-3 lg:gap-4"
            style={{
              rotateY: planeX,
              rotateX: planeY,
              transformStyle: "preserve-3d",
            }}
          >
            {KITCHEN.map((k, i) => (
              <Slab
                key={k.src}
                src={`/photos/${k.src}.webp`}
                alt={k.alt}
                aspect={k.aspect}
                tilt={[k.tilt[0], k.tilt[1]]}
                drift={i % 2 ? 26 : 12}
                swing={false}
                shadow={false}
                radius={20}
                className={k.span}
                sizes={
                  k.span === "col-span-4"
                    ? "(min-width:1024px) 34vw, 62vw"
                    : "(min-width:1024px) 26vw, 46vw"
                }
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Media feature                                                          */
/* -------------------------------------------------------------------------- */

function Media() {
  return (
    <section id="media" className="bg-ink-2 relative pb-28 lg:pb-44">
      <Panel className="px-6 pt-14 pb-16 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:px-20 lg:pt-28 lg:pb-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Slab
              src="/photos/newspaper.webp"
              alt="Hands holding a newspaper page titled Taas nga pangandoy that profiles Lemuel, photographed in a car"
              aspect="682/728"
              tilt={[5, 16]}
              roll={-3}
              drift={50}
              tone="light"
              sizes="(min-width:1024px) 38vw, 90vw"
            />
          </div>
        </div>
        <div className="mt-20 lg:col-span-7 lg:mt-0">
          <p className="mb-6 text-[12px] font-medium tracking-[.18em] text-ink/55 uppercase">
            Media feature
          </p>
          <h2 className="font-display text-[10.5vw] leading-[1] lg:text-[5.2vw]">
            <Rise text="As our impact grew, so did public interest in our story." />
          </h2>
          <Stagger className={`mt-9 space-y-6 ${bodyLight}`}>
            <P>
              I was interviewed by various individuals and media outlets, and
              my journey was even featured in newspapers. Many people from our
              industry and community reached out to us, seeking guidance on how
              we managed to succeed despite the lockdown. They wanted to know
              our strategy, our approach, and the secret behind our resilience
              during such challenging times.
            </P>
            <P>
              The key lessons I carried over from my previous company into this
              industry were simple yet powerful:
            </P>
          </Stagger>

          <motion.div
            className="bg-ink mt-9 rounded-[28px] border border-white/15 p-7 text-white shadow-[0_50px_90px_-40px_rgba(14,18,24,.75),inset_0_1px_0_rgba(255,255,255,.14)] lg:rounded-[36px] lg:p-12"
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <p className="mb-5 text-[12px] font-medium tracking-[.18em] text-white/55 uppercase">
              Key lesson
            </p>
            <p className="font-display text-[29px] leading-[1.1] lg:text-[44px]">
              Build a well-structured system and let the system drive the
              business.
            </p>
            <p className="mt-6 text-[17px] leading-[1.65] text-white/72 lg:text-[18px]">
              A strong system ensures efficiency, consistency, and scalability.
              But more importantly,{" "}
              <strong className="font-semibold text-white">
                invest in people
              </strong>{" "}
              &mdash; develop a team that not only supports the system but
              enhances its effectiveness. When the right people and the right
              system work together, the result is a business that is not just
              functional, but highly efficient, sustainable, and profitable.
            </p>
          </motion.div>
        </div>
      </Panel>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. The next phase                                                         */
/* -------------------------------------------------------------------------- */

function ScrubWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [0.14, 1],
  );
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}

function ScrubLine({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "end 55%"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrubWord
          key={i}
          word={w}
          index={i}
          total={words.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function NextPhase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const cutY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -70]);
  const headY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const track = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && !reduce) {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    }
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      id="next"
      className="bg-ink relative isolate z-10 -mt-10 overflow-x-clip rounded-t-[32px] text-white lg:rounded-t-[40px]"
    >
      <div
        ref={ref}
        onPointerMove={track}
        onPointerLeave={reset}
        className="relative mx-auto grid max-w-[1720px] gap-6 px-6 pt-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-0 lg:px-20 lg:pt-44"
      >
        <motion.div
          style={{ y: cutY }}
          className="relative z-10 order-2 mx-auto mt-10 w-[62%] max-w-[360px] lg:order-1 lg:col-span-4 lg:mx-0 lg:mt-0 lg:w-[min(86%,33svh)] lg:max-w-none"
        >
          {/* Warm light behind the figure lifts the beige suit off the dark ground */}
          <span
            aria-hidden
            className="absolute top-[2%] left-1/2 -z-10 h-[76%] w-[170%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(222,196,160,.3),rgba(222,196,160,0))]"
          />
          <div className="float-slow">
            <motion.div
              className="relative aspect-[573/1454]"
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1300,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Glass plate sits deeper than the figure, so the two separate on tilt */}
              <span
                aria-hidden
                className="absolute inset-x-[-13%] top-[13%] bottom-[-2%] rounded-[32px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.015)_58%)] shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_50px_90px_-40px_rgba(0,0,0,.9)]"
                style={{ transform: "translateZ(-70px)" }}
              />
              <Image
                src="/photos/suit-cutout.webp"
                alt="Lemuel standing in a tailored beige suit, black shirt and black tasselled loafers, one hand at the jacket lapel and the other in a trouser pocket"
                fill
                quality={90}
                sizes="(min-width:1024px) 30vw, 62vw"
                className="object-contain [filter:drop-shadow(0_0_14px_rgba(232,212,184,.2))_drop-shadow(0_34px_44px_rgba(0,0,0,.65))]"
              />
            </motion.div>
          </div>
          <span
            aria-hidden
            className="absolute inset-x-[-4%] -bottom-[2.5%] -z-10 h-[5%] rounded-[50%] bg-[#6b5d4c]/55 blur-[26px]"
          />
          <span
            aria-hidden
            className="absolute inset-x-[14%] -bottom-[1%] h-[2%] rounded-[50%] bg-black blur-[10px]"
          />
        </motion.div>

        <motion.h2
          style={{ y: headY }}
          className="font-display relative order-1 text-[16.4vw] leading-[.92] uppercase lg:order-2 lg:col-span-8 lg:text-[10.2vw]"
        >
          <Rise text="The next" />
          <Rise text="phase" />
          <Rise text="in my" className="text-white/45" />
          <Rise text="journey&hellip;" className="text-white/45" />
        </motion.h2>
      </div>

      <div className="mx-auto grid max-w-[1720px] px-6 pt-24 sm:px-8 lg:grid-cols-12 lg:px-20 lg:pt-44">
        <Stagger className="space-y-8 text-[19px] leading-[1.62] text-white/72 lg:col-span-8 lg:col-start-5 lg:space-y-10 lg:text-[26px] lg:leading-[1.5] [&_strong]:font-semibold [&_strong]:text-white">
          <P>
            As I grow older, I&rsquo;ve started valuing time and health more
            while still pursuing my goals and ambitions.
          </P>
          <P>
            There was a season in my life filled with sleepless nights, late
            hustle hours, constant pressure, and exhaustion from traditional
            business routines. Chasing goals often meant sacrificing rest, peace
            of mind, and sometimes even my own well-being.
          </P>
          <P>
            <strong>Today,</strong> I&rsquo;m in a new chapter through{" "}
            <strong>trading,</strong> a venture I&rsquo;m genuinely grateful for
            and continue to grow in every day 📈
          </P>
          <P>
            Trading gave me a different perspective on success. It didn&rsquo;t
            remove challenges, but it changed the way I live and work. It
            brought more peace of mind, mental clarity, flexibility, and a
            healthier balance while still allowing me to pursue the same goals
            I&rsquo;ve always had.
          </P>
          <P>
            Now, it&rsquo;s me and my charts every day. Learning, improving, and
            showing up consistently. But one of the most meaningful parts of
            this journey isn&rsquo;t only the trading itself, it&rsquo;s the{" "}
            <strong>people.</strong> Little by little, I&rsquo;ve been able to
            build and bring people into a community filled with individuals who
            once had similar struggles and concerns from traditional work and
            business environments.
          </P>
        </Stagger>
      </div>

      <div className="mx-auto max-w-[1720px] px-6 pt-24 sm:px-8 lg:px-20 lg:pt-40">
        <p className="text-[19px] text-white/60 lg:text-[26px]">
          And what makes it special is that
        </p>
        <h3 className="font-display mt-2 text-[17vw] leading-[.96] lg:text-[12vw]">
          <Rise text="we grow together&hellip;" />
        </h3>
        <Stagger className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <P className="text-[19px] leading-[1.62] text-white/72 lg:col-span-6 lg:text-[24px] lg:leading-[1.5]">
            No competition. No pulling each other down. Just people helping
            people, learning together, and supporting one another as we work
            toward our own personal goals in trading.
          </P>
          <P className="text-[19px] leading-[1.62] text-white/72 lg:col-span-6 lg:text-[24px] lg:leading-[1.5]">
            That aligns deeply with my mission, advocacy, and the kind of impact
            I&rsquo;ve always wanted to create in life. And for me, this became
            more than just trading.
          </P>
        </Stagger>
      </div>

      <div className="mx-auto max-w-[1720px] px-6 pt-24 pb-36 sm:px-8 lg:px-20 lg:pt-40 lg:pb-60">
        <ScrubLine
          text="This became the vehicle I had been searching for&hellip;"
          className="font-display text-[12.6vw] leading-[1] lg:text-[8.4vw]"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Things I love                                                          */
/* -------------------------------------------------------------------------- */

const LOVES = [
  {
    src: "love-trading",
    label: "Growing my journey in trading 📈",
    alt: "Lemuel seen from above working on a tablet keyboard at a small table",
    icon: <ChartIcon />,
    tilt: [4, 10],
    roll: -1.5,
    drift: 40,
  },
  {
    src: "love-tennis",
    label: "I’m new to this sport",
    alt: "A tennis racket and black water bottle on a wooden bench",
    icon: <RacketIcon />,
    tilt: [3, 5],
    roll: 1,
    drift: 80,
  },
  {
    src: "love-matcha",
    label: "I enjoy both coffee and matcha",
    alt: "A cup of matcha on a wooden table, seen from above beside a hand and wristwatch",
    icon: <CupIcon />,
    tilt: [3, -5],
    roll: -1,
    drift: 30,
  },
  {
    src: "love-people",
    label: "I love connecting with diverse people",
    alt: "Two people shaking hands over a table in warm window light",
    icon: <HandshakeIcon />,
    tilt: [4, -10],
    roll: 1.5,
    drift: 70,
  },
];

function Love() {
  return (
    <section
      id="love"
      className="bg-ink relative isolate z-20 -mt-10 overflow-x-clip rounded-t-[32px] px-6 pt-28 pb-24 sm:px-8 lg:rounded-t-[40px] lg:px-20 lg:pt-44 lg:pb-52"
    >
      <Glow className="-top-[10%] left-1/4 size-[1000px]" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-display text-[15.5vw] leading-[.94] text-white uppercase lg:text-[9.6vw]">
          <Rise text="Things I love" />
        </h2>
        <Stagger className="max-w-[20ch] lg:pb-4">
          <P className="text-[21px] leading-[1.25] text-white/60 lg:text-[28px]">
            What I love spending my time on these days.
          </P>
        </Stagger>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-y-14 gap-x-5 min-[480px]:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-x-7">
        {LOVES.map((l) => (
          <Slab
            key={l.src}
            src={`/photos/${l.src}.webp`}
            alt={l.alt}
            aspect="421/540"
            label={l.label}
            icon={l.icon}
            tilt={[l.tilt[0], l.tilt[1]]}
            roll={l.roll}
            drift={l.drift}
            radius={30}
            sizes="(min-width:1024px) 24vw, (min-width:480px) 46vw, 90vw"
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Final CTA + footer                                                        */
/* -------------------------------------------------------------------------- */

function Connect() {
  return (
    <section
      id="connect"
      className="relative isolate overflow-hidden px-3 pb-3 sm:px-5 sm:pb-5 lg:px-8 lg:pb-8"
    >
      {/* Closes on the same two-tone ground the page opened with */}
      <span aria-hidden className="bg-ink absolute inset-x-0 top-0 -z-20 h-[72%]" />
      <span
        aria-hidden
        className="bg-sand absolute inset-x-0 top-[60%] bottom-0 -z-10 rounded-t-[32px] lg:rounded-t-[40px]"
      />

      <div className="relative isolate overflow-hidden rounded-[32px] border border-white/85 bg-[radial-gradient(70%_80%_at_50%_30%,#3a4452_0%,#1b222b_55%,#121821_100%)] px-6 pt-16 pb-8 text-white lg:rounded-[40px] lg:px-14 lg:pt-28 lg:pb-12">
        <h2 className="font-display text-[10.4vw] leading-[.98] uppercase lg:text-[8.1vw]">
          <Rise text="I enjoy meaningful connections," />
          <Rise text="let’s see where we can collaborate!" className="text-white/50" delay={0.2} />
        </h2>

        <motion.div
          className="mt-12 lg:mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <PillCTA href={CONTACT.email}>Let&rsquo;s Collaborate</PillCTA>
        </motion.div>

        <Stagger className="mt-14 grid gap-3 md:grid-cols-3 lg:mt-24">
          <motion.a
            variants={fadeUp}
            href={CONTACT.email}
            className="contact-card"
          >
            <span className="contact-icon">
              <MailIcon />
            </span>
            <span>Email Address</span>
          </motion.a>
          <motion.a
            variants={fadeUp}
            href={CONTACT.viber}
            className="contact-card"
          >
            <span className="contact-icon">
              <ViberIcon />
            </span>
            <span>My Viber</span>
          </motion.a>
          <motion.div variants={fadeUp} className="contact-card">
            <span>My Socials</span>
            <span className="ml-auto flex gap-2">
              {CONTACT.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="contact-icon transition-colors hover:bg-white hover:text-ink"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </span>
          </motion.div>
        </Stagger>
      </div>

      <footer className="text-ink/70 relative flex flex-wrap items-center justify-between gap-3 px-3 pt-6 pb-3 text-[13px] lg:px-6">
        <span>&copy; {new Date().getFullYear()} Lemuel Abelgas</span>
        <span>Trading | Entrepreneur | Community Builder</span>
        <a href="#top" className="hover:text-ink transition-colors">
          Back to top &uarr;
        </a>
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden {...stroke}>
      <path d="M2.5 11.5 11.5 2.5M4.5 2.5h7v7" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M3 20h18M6 16l4-5 3 3 6-8" />
    </svg>
  );
}
function RacketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <ellipse cx="14.5" cy="9.5" rx="6" ry="6.5" transform="rotate(38 14.5 9.5)" />
      <path d="M10 14.5 3.5 21" />
      <path d="M11 6l6.5 7M9 9l6 6.5M14.5 4 9.2 12M18.5 7l-5 8" opacity=".55" />
    </svg>
  );
}
function CupIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V9ZM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3c-.8 1 .8 2 0 3M12 3c-.8 1 .8 2 0 3" />
    </svg>
  );
}
function HandshakeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="m2 9 4-3 5 2 2-1 5-1 4 3M2 9v6l3 1 5 4c1 .8 2.4.5 3-.5l3.5-4M22 9v6l-3 1M11 8 8 11c-.7.8 0 2 1.2 1.8L12 12l5 5" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 8 8 5.5L20 8" />
    </svg>
  );
}
function ViberIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M12 3c-5 0-8 2-8 7v2.5c0 3 1.4 4.8 4 5.6V21l3.2-2.6H12c5 0 8-2 8-6.9V10c0-5-3-7-8-7Z" />
      <path d="M9 7.5c-.8.3-1.2 1-1 1.8.7 2.8 2.6 4.8 5.4 5.6.8.2 1.5-.2 1.8-1l-1.9-1.5-1 .6c-1-.5-1.7-1.3-2.1-2.3l.7-1L9 7.5ZM13 6.8c1.8.2 3 1.4 3.2 3.2M13 9c.7.1 1.1.5 1.2 1.2" />
    </svg>
  );
}
function SocialIcon({ name }: { name: "facebook" | "instagram" | "linkedin" }) {
  if (name === "facebook")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
        <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V22h3.4Z" />
      </svg>
    );
  if (name === "instagram")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden {...stroke}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r=".6" fill="currentColor" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M6.9 21H3.4V9.5h3.5V21ZM5.1 7.9a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM21 21h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H10V9.5h3.3V11h.1c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.3 2.3 4.3 5.3V21Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <FloatingNav />
      <ChapterDots />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[.055]"
        style={{ backgroundImage: GRAIN }}
      />
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <Journey />
        <Breakthroughs />
        <Empowering />
        <Challenges />
        <Media />
        <NextPhase />
        <Love />
        <Connect />
      </main>
    </MotionConfig>
  );
}
