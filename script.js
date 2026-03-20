document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    // Scroll Header Background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger?.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });

    // Handle Form Submit: WhatsApp + Email
    const form = document.getElementById('turno-form');
    if (form) {
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
            
            // 1. Prepare WhatsApp Message
            const mensajeWA = `¡Hola Agustín! Quisiera solicitar un turno.%0A%0A*📌 Mis datos:*%0A- *Nombre:* ${nombre}%0A- *Vehículo:* ${marca} ${modelo}%0A- *Servicio:* ${servicio}`;
            const urlWA = `https://wa.me/5492604516569?text=${mensajeWA}`;

            // 2. Send Email via FormSubmit AJAX
            fetch("https://formsubmit.co/ajax/agustinfernandezsuchovsky@gmail.com", {
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
                window.open(urlWA, '_blank');
                form.reset();
            })
            .catch(error => {
                console.error('Error enviando email:', error);
                window.open(urlWA, '_blank');
                form.reset();
            })
            .finally(() => {
                btnSubmit.innerHTML = btnOriginalText;
                btnSubmit.disabled = false;
            });
        });
    }

    // ───── Testimonials Carousel ─────
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (track) {
        const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
        const total = slides.length;
        let current = 0;
        let autoTimer = null;

        // Build dots (1 per slide)
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

            // Assign coverflow classes
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

        // Events
        prevBtn?.addEventListener('click', () => { prev(); startAuto(); });
        nextBtn?.addEventListener('click', () => { next(); startAuto(); });

        track.addEventListener('mouseenter', stopAuto);
        track.addEventListener('mouseleave', startAuto);

        // Click on blurred slides
        slides.forEach(s => {
            s.addEventListener('click', () => {
                if (s.classList.contains('prev')) { prev(); startAuto(); }
                if (s.classList.contains('next')) { next(); startAuto(); }
            });
        });

        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
        });

        // Init
        buildDots();
        goTo(0);
        startAuto();
    }

    // ───── Scroll Reveal ─────
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

    // ───── Active Menu Highlight ─────
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
        threshold: 0.3, // Require 30% of section visible to trigger
        rootMargin: "-20% 0px -60% 0px"
    });

    sections.forEach(sec => navObserver.observe(sec));
});
