/**
 * Tips Video JavaScript
 * Handles autoplay on viewport entry and play/pause controls
 */

(function() {
  'use strict';

  // Initialize all video containers
  function initTipsVideos() {
    const videos = document.querySelectorAll('.tips-video');
    
    videos.forEach(container => {
      const video = container.querySelector('.tips-video__player');
      const playBtn = container.querySelector('.tips-video__play-btn');
      
      if (!video) return;

      // Play button click
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          if (video.paused) {
            video.play();
            container.classList.add('is-playing');
          } else {
            video.pause();
            container.classList.remove('is-playing');
          }
        });
      }

      // Video click to toggle
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          container.classList.add('is-playing');
        } else {
          video.pause();
          container.classList.remove('is-playing');
        }
      });

      // Update state on video events
      video.addEventListener('play', () => container.classList.add('is-playing'));
      video.addEventListener('pause', () => container.classList.remove('is-playing'));
      video.addEventListener('ended', () => container.classList.remove('is-playing'));

      // Viewport autoplay
      if (container.dataset.autoplay === 'true' || video.dataset.autoplay === 'true') {
        setupViewportAutoplay(container, video);
      }
    });
  }

  // Autoplay when scrolled into view
  function setupViewportAutoplay(container, video) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay blocked - user interaction required
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTipsVideos);
  } else {
    initTipsVideos();
  }
})();
