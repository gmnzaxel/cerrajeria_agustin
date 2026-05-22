// 1. Configuración Global
const CONFIG = {
    phone: "5492604516569", // Número de WhatsApp y llamadas
    formattedPhone: "+54 9 260 451-6569" // Formato visual para mostrar en la web
};

// 2. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initContactLinks();
    initMobileMenu();
    initScrollHeader();
    initFormSubmit();
    initTestimonials();
    initScrollReveal();
    initActiveMenu();
    initInfiniteMarquee();
    initAboutSlider();
});

// 3. Funciones Modulares

function initContactLinks() {
    const waLinks = document.querySelectorAll('.js-contact-wa');
    waLinks.forEach(link => {
        const text = link.getAttribute('data-wa-text') || '';
        link.href = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(text)}`;
    });

    const telLinks = document.querySelectorAll('.js-contact-tel');
    telLinks.forEach(link => {
        link.href = `tel:+${CONFIG.phone}`;
    });

    const telTexts = document.querySelectorAll('.js-contact-tel-text');
    telTexts.forEach(el => {
        el.textContent = CONFIG.formattedPhone;
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger?.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });
}

function initScrollHeader() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initFormSubmit() {
    const form = document.getElementById('turno-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const btnSubmit = form.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'Enviando...';
        btnSubmit.disabled = true;

        const nombre = document.getElementById('nombre').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const servicio = document.getElementById('servicio').value;
        const honey = document.getElementById('_honey')?.value;

        // Anti-spam honeypot
        if (honey) {
            console.warn('Spam detectado y bloqueado.');
            form.reset();
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.disabled = false;
            return;
        }
        
        const mensajeWA = `¡Hola Agustín! Quisiera solicitar un turno.\n\n*📌 Mis datos:*\n- *Nombre:* ${nombre}\n- *Vehículo:* ${marca} ${modelo}\n- *Servicio:* ${servicio}`;
        const urlWA = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(mensajeWA)}`;

        // Ofuscamos el email
        const targetEmail = "agustinfernandezsuchovsky" + "@" + "gmail.com";
        fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Nombre: nombre,
                Vehículo: `${marca} ${modelo}`,
                Servicio: servicio,
                _subject: "¡Nuevo turno desde la web!"
            })
        })
        .then(response => response.json())
        .then(data => {
            showToast("¡Turno solicitado! Redirigiendo a WhatsApp...");
            setTimeout(() => {
                window.location.href = urlWA;
            }, 2000);
            form.reset();
        })
        .catch(error => {
            console.error('Error enviando email:', error);
            showToast("Error al enviar. Por favor, confírmalo directo en WhatsApp.");
            setTimeout(() => {
                window.location.href = urlWA;
            }, 3000);
            form.reset();
        })
        .finally(() => {
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.disabled = false;
        });
    });
}

function initTestimonials() {
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
    const total = slides.length;
    let current = 0;
    let autoTimer = null;

    const buildDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 't-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Reseña ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    };

    const goTo = (idx) => {
        current = (idx + total) % total;
        const prevIdx = (current - 1 + total) % total;
        const nextIdx = (current + 1) % total;

        slides.forEach((s, i) => {
            s.className = 'testimonial-slide';
            if (i === current) s.classList.add('active');
            else if (i === prevIdx) s.classList.add('prev');
            else if (i === nextIdx) s.classList.add('next');
        });
        
        updateDots();
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAuto = () => {
        stopAuto();
        autoTimer = setInterval(next, 4500);
    };

    const stopAuto = () => {
        if (autoTimer) clearInterval(autoTimer);
    };

    prevBtn?.addEventListener('click', () => { prev(); startAuto(); });
    nextBtn?.addEventListener('click', () => { next(); startAuto(); });

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);

    slides.forEach(s => {
        s.addEventListener('click', () => {
            if (s.classList.contains('prev')) { prev(); startAuto(); }
            if (s.classList.contains('next')) { next(); startAuto(); }
        });
    });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
    });

    buildDots();
    goTo(0);
    startAuto();
}

function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function initActiveMenu() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: "-20% 0px -60% 0px"
    });

    sections.forEach(sec => navObserver.observe(sec));
}

function initInfiniteMarquee() {
    const marquees = document.querySelectorAll('.brands-track');
    marquees.forEach(track => {
        const logos = Array.from(track.children);
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    });
}

function initAboutSlider() {
    const aboutSlider = document.getElementById('about-slider-container');
    if (!aboutSlider) return;

    const slides = Array.from(aboutSlider.querySelectorAll('.about-slide-img'));
    const prevBtn = document.getElementById('about-prev');
    const nextBtn = document.getElementById('about-next');
    const dotsContainer = document.getElementById('about-dots');
    let current = 0;
    let timer = null;
    
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'about-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.about-dot'));
    
    const goTo = (idx) => {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    };
    
    const nextSlide = () => goTo(current + 1);
    const prevSlide = () => goTo(current - 1);
    
    const startTimer = () => {
        stopTimer();
        timer = setInterval(nextSlide, 3500);
    };
    const stopTimer = () => clearInterval(timer);
    
    prevBtn?.addEventListener('click', () => { prevSlide(); startTimer(); });
    nextBtn?.addEventListener('click', () => { nextSlide(); startTimer(); });
    aboutSlider.addEventListener('mouseenter', stopTimer);
    aboutSlider.addEventListener('mouseleave', startTimer);
    
    let touchStartX = 0;
    aboutSlider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    aboutSlider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); startTimer(); }
    });

    startTimer();
}

// ───── Toast Notification ─────
function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
