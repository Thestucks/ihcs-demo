import React, { useState, useEffect, useRef } from 'react';

const Carousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Start di index 0
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const contentRef = useRef(null);

  // Auto slide setiap 5 detik (hanya jika ada gambar)
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goNext = () => {
    if (images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    if (images.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handling swipe
  const handleTouchStart = (e) => {
    if (images.length === 0) return; // Prevent jika tidak ada gambar
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (images.length === 0) return; // Prevent jika tidak ada gambar
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (images.length === 0) return;

    const isLeftSwipe = touchStart - touchEnd > 50;
    const isRightSwipe = touchEnd - touchStart > 50;

    if (isLeftSwipe) {
      goNext();
    }
    if (isRightSwipe) {
      goPrev();
    }
  };

  if (images.length === 0) {
    return <div className="carousel-empty">Tidak ada gambar</div>;
  }

  return (
    <div className="carousel-banner" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="carousel-banner-wrapper">
        <button
          className="carousel-banner-btn carousel-banner-btn-prev"
          onClick={goPrev}
          disabled={images.length === 0}
        >
          ❮
        </button>

        <div className="carousel-banner-container">
          <div
            ref={contentRef}
            className="carousel-banner-content"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="carousel-banner-slide" style={{ width: `${100}%` }}>
                <img src={image} alt={`Banner ${index + 1}`} className="carousel-banner-image" />
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-banner-btn carousel-banner-btn-next"
          onClick={goNext}
          disabled={images.length === 0}
        >
          ❯
        </button>

        <div className="carousel-banner-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`carousel-banner-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => images.length > 0 && setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
