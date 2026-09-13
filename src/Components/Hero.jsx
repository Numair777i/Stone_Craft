import { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";

const products = [
  "/butterfly.png",
  "/rocket.png",
  "/saturn.png",
  "/rocket-man.png",
  "/car.png",
  "/plane.png",
];

const extended = [...products, products[0]];
const AUTOPLAY_DELAY = 4200;

function Hero() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const clearAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startAutoplay = () => {
    clearAutoplay();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, AUTOPLAY_DELAY);
  };

  useEffect(() => {
    startAutoplay();
    return clearAutoplay;
  }, []);

  // When we land on the duplicate slot (visually identical to slot 0),
  // snap back to the real slot 0 instantly, no transition — invisible reset.
  const handleTransitionEnd = () => {
    if (index === products.length) {
      setIndex(0);
    }
  };

  useEffect(() => {
    startAutoplay();
    return clearAutoplay;
  }, []);

  const activeDot = index % products.length;

  // Clicking a dot jumps straight there and the autoplay clock continues
  const goToSlide = (i) => {
    setIndex(i);
    startAutoplay();
  };

  return (
    <div className="min-w-screen">
      <NavBar />

      <div className="relative w-screen h-screen bg-[#F7F1E6] overflow-hidden">
        {/* Static background type */}
        <h1
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[16vw] font-extrabold tracking-tight leading-none select-none z-0"
          style={{ color: "#234B3B", opacity: 0.9 }}
        >
          Stone Craft
        </h1>

        {/* Soft grounding shadow beneath the product */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 z-5 w-65 h-10 rounded-full"
          style={{
            marginTop: "150px",
            background:
              "radial-gradient(ellipse, rgba(35,75,59,0.25) 0%, rgba(35,75,59,0) 70%)",
            filter: "blur(4px)",
          }}
        />

        {/* Carousel viewport */}
        <div className="absolute inset-0 overflow-hidden z-10">
          <div
            onTransitionEnd={handleTransitionEnd}
            className="flex h-full ease-in-out"
            style={{
              width: `${100 * extended.length}vw`,
              transform: `translateX(-${index * 100}vw)`,
              transitionProperty: "transform",
              transitionDuration: "1400ms",
            }}
          >
            {extended.map((src, i) => (
              <div
                key={i}
                className="flex items-center justify-center shrink-0 h-full"
                style={{ width: "100vw" }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-95 h-95 object-contain"
                  style={{
                    filter: "drop-shadow(0 18px 20px rgba(35,75,59,0.18))",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators — with enlarged clickable padding areas */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 flex gap-1"
          style={{ bottom: "48px" }}
        >
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Show product ${i + 1}`}
              className="flex items-center justify-center p-2.5 cursor-pointer group"
              style={{ background: "transparent", border: "none" }}
            >
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeDot ? "22px" : "9px",
                  height: "8px",
                  backgroundColor:
                    i === activeDot ? "#C1442C" : "rgba(35,75,59,0.25)",
                }}
              />
            </button>
          ))}
        </div>

        {/* CTA — red filled button, with an underline that reveals on hover like the nav links */}
        <div className="absolute bottom-16 left-16 z-20">
          <button
            onClick={() =>
              document
                .getElementById("shop")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group px-6 py-3 rounded-full font-semibold cursor-pointer"
            style={{ backgroundColor: "#C1442C", color: "#F7F1E6" }}
          >
            <span className="border-b-2 border-transparent group-hover:border-white transition-colors duration-200 pb-0.5">
              Shop the kits
            </span>
          </button>
        </div>

        {/* Bottom-right: scroll cue, now targets Shop directly */}
        <div
          onClick={() =>
            document
              .getElementById("shop")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-16 right-16 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-sm" style={{ color: "#2A2118", opacity: 0.6 }}>
            Scroll down
          </span>
          <span
            className="text-xl transition-transform duration-300 group-hover:translate-y-1"
            style={{ color: "#234B3B" }}
          >
            ↓
          </span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
