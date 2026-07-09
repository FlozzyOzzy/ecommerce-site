import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import heroOne from "../assets/artem-beliaikin-pPzQP35zh4o-unsplash.jpg"
import heroTwo from "../assets/tamanna-rumee-lpGm415q9JA-unsplash.jpg"
import heroThree from "../assets/growtika-mlpsHpUUCHY-unsplash.jpg"

const HERO_SLIDES = [
  { src: heroOne, alt: "Colorful shopping bags on display" },
  { src: heroTwo, alt: "Fashion and lifestyle products" },
  { src: heroThree, alt: "Curated products ready to shop" },
]

const AUTO_PLAY_MS = 5000

const Landingpage = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length)
    }, AUTO_PLAY_MS)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setActiveSlide((index + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 18,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 18,
    })
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gray-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="landing-blob absolute -left-24 top-32 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="landing-blob-delayed absolute right-0 top-40 h-80 w-80 rounded-full bg-gray-200/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <section
        className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-16"
        onMouseMove={handleMouseMove}
      >
        <div className="text-left">
          <span className="inline-flex items-center rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            New season collection is live
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Discover products you&apos;ll love, delivered with ease.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-800 sm:text-lg">
            Browse trending items, compare top picks, and shop smarter. From everyday essentials to
            statement pieces — everything is one click away.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/getproducts"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Shop Now
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-lg"
          style={{
            transform: `perspective(1000px) rotateY(${mouse.x * 0.15}deg) rotateX(${-mouse.y * 0.15}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-amber-100/60 via-white to-gray-100/80 blur-xl" />
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gray-100">
              {HERO_SLIDES.map((slide, index) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              <button
                type="button"
                onClick={() => goToSlide(activeSlide - 1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md transition hover:bg-white"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeSlide + 1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md transition hover:bg-white"
              >
                ›
              </button>

              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeSlide ? "w-7 bg-amber-500" : "w-2.5 bg-white/80 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes landing-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
        }
        .landing-blob {
          animation: landing-float 8s ease-in-out infinite;
        }
        .landing-blob-delayed {
          animation: landing-float 10s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  )
}

export default Landingpage
