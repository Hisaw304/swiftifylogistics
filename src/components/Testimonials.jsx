import React from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  {
    name: "Jane Doe",
    role: "E-commerce Store Owner",
    text: "Swiftify Logistics has transformed how we deliver products. Reliable, fast, and hassle-free.",
  },
  {
    name: "Mark Johnson",
    role: "Regular Customer",
    text: "I can track every parcel in real time. Absolutely love the service.",
  },
  {
    name: "Olivia Brown",
    role: "Business Manager",
    text: "Their speed and communication are unmatched. Never missed a delivery.",
  },
];

export default function Testimonials() {
  return (
    <section className="stus-testimonials py-20" id="testimonials">
      <div className="container-lg">
        {/* Heading */}
        <div className="stus-heading-wrap text-center mb-10">
          <div className="stus-heading-row">
            <span className="shape shape-left" aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="5"
                viewBox="0 0 59 5"
                fill="none"
              >
                <rect
                  width="50"
                  height="5"
                  rx="2.5"
                  fill="var(--light-green)"
                />
                <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
              </svg>
            </span>

            <h2 className="stus-title">
              What Our <span className="stus-highlight">Clients</span> Say
            </h2>

            <span className="shape shape-right" aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="5"
                viewBox="0 0 59 5"
                fill="none"
              >
                <rect
                  width="50"
                  height="5"
                  rx="2.5"
                  fill="var(--light-green)"
                />
                <circle cx="56.5" cy="2.5" r="2.5" fill="var(--light-green)" />
              </svg>
            </span>
          </div>

          <p className="stus-subtext">
            Trusted by businesses and customers who rely on Swiftify Logistics
            for every delivery.
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          spaceBetween={24}
          slidesPerView={1}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56 }}
                viewport={{ once: true }}
                className="stus-card"
                aria-label={`Testimonial from ${t.name}`}
              >
                <div className="stus-card-inner">
                  <Quote className="stus-quote-icon" />
                  <blockquote className="stus-quote">“{t.text}”</blockquote>

                  <div className="stus-meta">
                    <div>
                      <h4 className="stus-name">{t.name}</h4>
                      <div className="stus-role">{t.role}</div>
                    </div>
                    <div className="stus-badge" aria-hidden>
                      Swiftify Logistics
                    </div>
                  </div>
                </div>

                {/* accent bar */}
                <span className="stus-accent" />
              </motion.article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
