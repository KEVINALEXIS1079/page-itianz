
const showcases = document.querySelectorAll('.portfolio-showcase');
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

showcases.forEach(showcase => {
    const visual = showcase.querySelector('.project-visual');
    if (!visual) return;

    visual.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            visual.click();
        }
    });

    visual.addEventListener('click', () => {
        const type = showcase.getAttribute('data-type');
        const src = showcase.getAttribute('data-src');
        const title = showcase.getAttribute('data-title');
        const desc = showcase.getAttribute('data-desc');
        const category = showcase.querySelector('.card-category')?.textContent || '';

        document.getElementById('modalTitle').textContent = title || 'Sin Título';
        document.getElementById('modalDesc').textContent = desc || '';
        const catEl = document.getElementById('modalCategory');
        if (catEl) catEl.textContent = category;

        modalBody.innerHTML = '';  

        if (type === 'multimedia') {
            const videoSrc = showcase.getAttribute('data-video');
            const img1 = showcase.getAttribute('data-img1');
            const img2 = showcase.getAttribute('data-img2');
            const img3 = showcase.getAttribute('data-img3');

            const imgs = [img1, img2, img3].filter(Boolean);
            const imagesHTML = imgs.length > 0 ? `
                <div class="multimedia-images">
                    ${imgs.map((img, i) => `<img src="${img}" class="multimedia-img" alt="Render ${i+1}" loading="lazy">`).join('')}
                </div>
            ` : '';

            modalBody.innerHTML = `
                <div class="multimedia-container">
                    <div class="multimedia-video">
                        <iframe 
                            src="https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    ${imagesHTML}
                </div>
            `;
        } else if (type === 'video') {
            modalBody.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${src}?autoplay=1&rel=0" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else if (type === 'image') {
            modalBody.innerHTML = `<img src="${src}" alt="Proyecto en alta calidad">`;
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
       
        setTimeout(() => modal.classList.add('active'), 10); 
    });
});

const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; 
    setTimeout(() => {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
    }, 300);
};

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

showcases.forEach((showcase, index) => {
    showcase.style.transitionDelay = `${(index % 2) * 0.15}s`;
    observer.observe(showcase);
});

const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navWrapper = document.getElementById('navWrapper');
const navLinksAnchors = document.querySelectorAll('.nav-links a');

const backToTop = document.getElementById('backToTop');

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
           
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            if (backToTop) {
                if (window.scrollY > 400) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }

            const aboutImg = document.querySelector('.about-image img');
            if (aboutImg) {
                const rect = aboutImg.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    let scrollProgress = 1 - (rect.top / window.innerHeight);
                    let scale = 0.95 + (scrollProgress * 0.2);
                    scale = Math.min(Math.max(scale, 0.95), 1.15);
                    aboutImg.style.transform = `scale(${scale})`;
                }
            }

            showcases.forEach(showcase => {
                const rect = showcase.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.top <= windowHeight && rect.bottom >= 0) {

                    if (rect.bottom < windowHeight * 0.25) {
                        showcase.classList.add('fading-out');
                    } else {
                        showcase.classList.remove('fading-out');
                    }

                    const visualImg = showcase.querySelector('.project-visual img');
                    if (visualImg) {
                       
                        const slideProgress = (rect.top - (windowHeight / 2)) / windowHeight;
                        visualImg.style.transform = `translateY(${slideProgress * 15}%)`;
                    }
                }
            });

            ticking = false;
        });
        ticking = true;
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navWrapper.classList.toggle('menu-active');
    });
}

navLinksAnchors.forEach(link => {
    link.addEventListener('click', () => {
        navWrapper.classList.remove('menu-active');
    });
});

const track = document.querySelector('.carousel-track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-indicators');
    const dots = Array.from(dotsNav.children);
    
    let currentSlideIndex = 0;
    
    const updateCarousel = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[index]) dots[index].classList.add('active');
        currentSlideIndex = index;
    };
    
    const moveToNextSlide = () => {
        let targetIndex = currentSlideIndex + 1;
        if (targetIndex >= slides.length) targetIndex = 0;
        updateCarousel(targetIndex);
    };

    const moveToPrevSlide = () => {
        let targetIndex = currentSlideIndex - 1;
        if (targetIndex < 0) targetIndex = slides.length - 1;
        updateCarousel(targetIndex);
    };

    let autoplayInterval = setInterval(moveToNextSlide, 6000);

    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(moveToNextSlide, 6000);
    });

    if(nextButton) nextButton.addEventListener('click', moveToNextSlide);
    if(prevButton) prevButton.addEventListener('click', moveToPrevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { updateCarousel(index); });
    });
}

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
       
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => preloader.remove(), 600);
        }, 400);
    }
});
