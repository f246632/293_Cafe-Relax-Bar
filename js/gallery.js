/**
 * CAFE RELAX BAR - GALLERY & LIGHTBOX
 * Handles image gallery and lightbox functionality
 */

// ================================================
// LIGHTBOX FUNCTIONALITY
// ================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

// Open lightbox when gallery item is clicked
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-image') || item.querySelector('img')?.src;
        const imgAlt = item.querySelector('img')?.alt || 'Gallery image';

        if (imgSrc) {
            openLightbox(imgSrc, imgAlt);
        }
    });

    // Add keyboard navigation
    item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const imgSrc = item.getAttribute('data-image') || item.querySelector('img')?.src;
            const imgAlt = item.querySelector('img')?.alt || 'Gallery image';

            if (imgSrc) {
                openLightbox(imgSrc, imgAlt);
            }
        }
    });

    // Make gallery items keyboard accessible
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
});

// Open lightbox
function openLightbox(imgSrc, imgAlt) {
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightbox.style.display = 'flex';

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Set focus to close button for accessibility
        lightboxClose?.focus();
    }
}

// Close lightbox
function closeLightbox() {
    if (lightbox) {
        lightbox.style.display = 'none';

        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Close lightbox when clicking close button
lightboxClose?.addEventListener('click', closeLightbox);

// Close lightbox when clicking outside the image
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.style.display === 'flex') {
        closeLightbox();
    }
});

// ================================================
// GALLERY NAVIGATION (if multiple images)
// ================================================
let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-image') || item.querySelector('img')?.src,
    alt: item.querySelector('img')?.alt || 'Gallery image'
}));

// Navigate to next image
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

// Navigate to previous image
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Update lightbox image
function updateLightboxImage() {
    if (lightboxImg && galleryImages[currentImageIndex]) {
        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxImg.alt = galleryImages[currentImageIndex].alt;
    }
}

// Add navigation arrows if there are multiple images
if (galleryImages.length > 1) {
    // Create previous arrow
    const prevArrow = document.createElement('button');
    prevArrow.className = 'lightbox-arrow lightbox-prev';
    prevArrow.innerHTML = '‹';
    prevArrow.setAttribute('aria-label', 'Previous image');
    Object.assign(prevArrow.style, {
        position: 'absolute',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '3rem',
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: '10000'
    });

    // Create next arrow
    const nextArrow = document.createElement('button');
    nextArrow.className = 'lightbox-arrow lightbox-next';
    nextArrow.innerHTML = '›';
    nextArrow.setAttribute('aria-label', 'Next image');
    Object.assign(nextArrow.style, {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '3rem',
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: '10000'
    });

    // Append arrows to lightbox
    lightbox?.appendChild(prevArrow);
    lightbox?.appendChild(nextArrow);

    // Add event listeners
    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    // Hover effects
    [prevArrow, nextArrow].forEach(arrow => {
        arrow.addEventListener('mouseenter', () => {
            arrow.style.background = 'rgba(139, 69, 19, 0.9)';
            arrow.style.transform = 'translateY(-50%) scale(1.1)';
        });

        arrow.addEventListener('mouseleave', () => {
            arrow.style.background = 'rgba(0,0,0,0.5)';
            arrow.style.transform = 'translateY(-50%) scale(1)';
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox?.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        }
    });

    // Update current index when opening lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
        });
    });
}

// ================================================
// TOUCH SWIPE SUPPORT FOR MOBILE
// ================================================
let touchStartX = 0;
let touchEndX = 0;

lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            nextImage();
        } else {
            // Swipe right - previous image
            prevImage();
        }
    }
}

// ================================================
// GALLERY FILTERING (Optional Enhancement)
// ================================================
const galleryFilters = document.querySelectorAll('.gallery-filter');

if (galleryFilters.length > 0) {
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.getAttribute('data-category');

            // Remove active class from all filters
            galleryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Trigger fade-in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ================================================
// IMAGE LOADING ANIMATION
// ================================================
lightboxImg?.addEventListener('load', () => {
    lightboxImg.style.opacity = '1';
});

lightboxImg?.addEventListener('loadstart', () => {
    lightboxImg.style.opacity = '0.5';
});

// ================================================
// ACCESSIBILITY ENHANCEMENTS
// ================================================
// Add ARIA labels and roles
lightbox?.setAttribute('role', 'dialog');
lightbox?.setAttribute('aria-modal', 'true');
lightbox?.setAttribute('aria-label', 'Image gallery lightbox');

// Trap focus within lightbox when open
function trapFocus(element) {
    const focusableElements = element?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element?.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

if (lightbox) {
    trapFocus(lightbox);
}

// ================================================
// PRELOAD ADJACENT IMAGES
// ================================================
function preloadImage(src) {
    if (src) {
        const img = new Image();
        img.src = src;
    }
}

// Preload next and previous images when lightbox opens
function preloadAdjacentImages() {
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;

    preloadImage(galleryImages[nextIndex]?.src);
    preloadImage(galleryImages[prevIndex]?.src);
}

// Call preload when lightbox opens
galleryItems.forEach(item => {
    item.addEventListener('click', preloadAdjacentImages);
});

console.log('Gallery and lightbox initialized! 📸');
