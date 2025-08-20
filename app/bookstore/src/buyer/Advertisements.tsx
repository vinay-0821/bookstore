import React, { useEffect, useState } from "react";
import "./css/Advertisements.css";

const img1 = require("../assets/1.png");
const img2 = require("../assets/2.jpg");
const img3 = require("../assets/3.png");
const img4 = require("../assets/4.png");

const images = [img1, img2, img3, img4];

export default function Advertisements() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="advertisements">
      {images.map((img, i) => (
        <div
          key={i}
          className={`slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
          role="img"
          aria-label={`Advertisement ${i + 1}`}
        ></div>
      ))}

      <div className="dots">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
