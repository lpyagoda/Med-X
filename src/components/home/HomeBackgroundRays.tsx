const homeRays = [
  "hero-ray-1 left-[-8vw] top-[-10vh] h-[120vh] w-[14vw] -rotate-[35deg]",
  "hero-ray-2 left-[8vw] top-[-5vh] h-[110vh] w-[18vw] -rotate-[30deg]",
  "hero-ray-3 left-[28vw] top-[5vh] h-[90vh] w-[12vw] -rotate-[20deg]",
  "hero-ray-4 left-[52vw] top-[-8vh] h-[115vh] w-[16vw] -rotate-[15deg]",
  "hero-ray-5 right-[-4vw] top-[0vh] h-[100vh] w-[20vw] -rotate-[25deg]",
];

type HomeBackgroundRaysProps = {
  visible: boolean;
};

export function HomeBackgroundRays({ visible }: HomeBackgroundRaysProps) {
  return (
    <div
      aria-hidden="true"
      className="home-soft-rays pointer-events-none sticky top-0 z-0 -mb-[100svh] h-svh transition-opacity duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {homeRays.map((rayClass) => (
        <span className={`hero-ray home-ray--soft absolute z-0 ${rayClass}`} key={rayClass} />
      ))}
    </div>
  );
}
