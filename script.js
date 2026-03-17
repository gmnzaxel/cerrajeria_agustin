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
});
