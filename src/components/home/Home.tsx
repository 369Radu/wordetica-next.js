"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { CorePrinciples } from "./CorePrinciples";
import { PageCta } from "@/components/shared/PageCta";
import { TESTIMONIALS } from "@/data/home.data";
import "./home.scss";

const TESTIMONIAL_AUTOPLAY_MS = 6600;

const heroImageSrc = "/assets/poza_home.png?v=20260526a";

function perViewForWidth(): number {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function maxPageIndex(total: number, perView: number): number {
  if (total <= perView) return 0;
  return Math.ceil((total - perView) / perView);
}

export function Home() {
  const testimonials = TESTIMONIALS;

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  const pausedRef = useRef(false);
  const perViewRef = useRef(perView);
  perViewRef.current = perView;

  useEffect(() => {
    const onResize = () => {
      const v = perViewForWidth();
      setPerView(v);
      setTestimonialIndex((i) => Math.min(i, maxPageIndex(testimonials.length, v)));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [testimonials.length]);

  const nextTestimonials = () => {
    const max = maxPageIndex(testimonials.length, perViewRef.current);
    setTestimonialIndex((p) => (p >= max ? 0 : p + 1));
  };

  const prevTestimonials = () => {
    const max = maxPageIndex(testimonials.length, perViewRef.current);
    setTestimonialIndex((p) => (p <= 0 ? max : p - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      nextTestimonials();
    }, TESTIMONIAL_AUTOPLAY_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTestimonialsPaused = (paused: boolean) => {
    pausedRef.current = paused;
  };

  const testimonialStartIndex = () => {
    const maxStart = Math.max(0, testimonials.length - perView);
    return Math.min(testimonialIndex * perView, maxStart);
  };

  const testimonialSlideFlexPercent = () => 100 / testimonials.length;
  const testimonialTrackWidthPercent = () =>
    (testimonials.length / perView) * 100;
  const testimonialOffsetPercent = () =>
    testimonialStartIndex() * testimonialSlideFlexPercent();

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wo-container hero__stack">
          <div className="hero__panel">
            <div className="hero__intro">
              <span className="wo-tag wo-tag--accent">Linguistic expertise · AI augmented</span>
              <h1 id="hero-title" className="hero__title">
                <span className="hero__title-line">
                  Language-driven services, enhanced by{" "}
                  <span className="wo-gradient-text wo-pulse-ai">AI</span>
                </span>
                <span className="hero__title-line">and guided by linguistic expertise and oversight.</span>
              </h1>
            </div>

            <p className="hero__lead">
              Wordetica delivers a progressive AI literacy training series, personalised language and
              communication coaching, and professional translation and interpreting services - combining
              linguistic expertise with responsible AI at every step.
            </p>
          </div>

          <figure className="hero__shell">
            <img
              className="hero__img"
              src={heroImageSrc}
              alt=""
              decoding="async"
              fetchPriority="high"
            />

            <div className="hero__cta">
              <Link href="/services" className="wo-btn wo-btn--accent">Explore Services</Link>
              <Link href="/contact" className="wo-btn wo-btn--ghost">Let&apos;s talk</Link>
            </div>
          </figure>
        </div>
      </section>

      <CorePrinciples />

      <section className="wo-section testimonials" aria-labelledby="testimonials-title">
        <div className="wo-container">
          <header className="section-header wo-center">
            <span className="wo-tag">Testimonials</span>
            <h2 id="testimonials-title">Hear from those we&apos;ve supported</h2>
            <p>Feedback from organizations, professionals, students, and children on our language services.</p>
          </header>

          <div
            className="carousel"
            onMouseEnter={() => setTestimonialsPaused(true)}
            onMouseLeave={() => setTestimonialsPaused(false)}
            onFocus={() => setTestimonialsPaused(true)}
            onBlur={() => setTestimonialsPaused(false)}
          >
            <button
              type="button"
              className="carousel__nav"
              onClick={prevTestimonials}
              aria-label="Previous testimonials"
            >
              ‹
            </button>

            <div className="carousel__viewport" aria-live="polite">
              <ul
                className="carousel__track carousel__track--testimonials"
                style={{
                  width: `${testimonialTrackWidthPercent()}%`,
                  transform: `translateX(-${testimonialOffsetPercent()}%)`,
                }}
              >
                {testimonials.map((t) => (
                  <li
                    key={t.id}
                    className="carousel__slide carousel__slide--testimonial"
                    style={{ flex: `0 0 ${testimonialSlideFlexPercent()}%` }}
                  >
                    <blockquote className="testimonial">
                      <p className="testimonial__quote">“{t.quote}”</p>
                      <footer>
                        <cite className="testimonial__name">{t.name}</cite>
                        <span className="testimonial__role">{t.role}</span>
                      </footer>
                    </blockquote>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="carousel__nav"
              onClick={nextTestimonials}
              aria-label="Next testimonials"
            >
              ›
            </button>
          </div>

          <p className="testimonials__count" aria-hidden="true">
            {testimonialIndex * perView + 1}–
            {Math.min((testimonialIndex + 1) * perView, testimonials.length)}
            {" "}of {testimonials.length}
          </p>
        </div>
      </section>

      <PageCta />
    </>
  );
}
