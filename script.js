document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-menu');

    // --- Funció d'Escriptura (Typewriter Effect) ---
    const typeWriter = (element, text, speed = 80, delay = 0) => {
        let i = 0;
        element.innerHTML = ''; // Limpiar el elemento antes de escribir
        element.style.opacity = 1; // Hacerlo visible
        
        // Función auxiliar para manejar HTML/Text
        const processChar = () => {
            if (i < text.length) {
                const char = text.charAt(i);
                
                // Si encontramos una etiqueta de inicio HTML (como <a> o <span>)
                if (char === '<') {
                    const endIndex = text.indexOf('>', i);
                    if (endIndex !== -1) {
                        // Insertar la etiqueta HTML completa
                        element.innerHTML += text.substring(i, endIndex + 1);
                        i = endIndex + 1;
                    } else {
                        element.innerHTML += char;
                        i++;
                    }
                } else {
                    // Insertar carácter normal
                    element.innerHTML += char;
                    i++;
                }
                setTimeout(processChar, speed);
            }
        };

        setTimeout(processChar, delay);
    };

    // --- Animación Hero Section (Nom, ROL, STATUS) ---
    const heroElements = document.querySelectorAll('.hero-section .terminal-block .animated-text');
    const terminalAnimation = document.getElementById("code-typing");
    const heroSocialLinks = document.querySelector('.hero-section .social-links');

    // Animación de los 3 campos clave en secuencia
    let currentDelay = 500;
    heroElements.forEach((element, index) => {
        const speed = 100;
        const textToType = element.dataset.text;
        
        typeWriter(element, textToType, speed, currentDelay);
        currentDelay += (textToType.length * speed) + 500; // Aumentar el retraso para la siguiente línea
    });
    
    // Animación de la línea de código final
    if (terminalAnimation) {
        const codeText = ">> [Sistema]: Conexión establecida. Iniciando bitácora de desarrollo...";
        setTimeout(() => typeWriter(terminalAnimation, codeText, 80), currentDelay);
        currentDelay += (codeText.length * 80) + 1000;
    }

    // Fade-in de los links sociales
    if (heroSocialLinks) {
        setTimeout(() => heroSocialLinks.style.opacity = 1, currentDelay); 
    }


    // --- Lógica para el Menú de Navegación Móvil ---
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // --- Intersection Observer para animar elementos en Scroll ---
    const animatedElements = document.querySelectorAll('.animated-text');
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };

    const textObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // No animar si ya es visible o si es parte de la sección Hero (que se anima al inicio)
            if (entry.isIntersecting && !entry.target.classList.contains('is-visible') && !entry.target.closest('#hero')) {
                const element = entry.target;
                const textToType = element.dataset.text || element.innerHTML;
                const speed = parseInt(element.dataset.textSpeed) || 40; // Un poco más rápido para el cuerpo
                
                // Guardar contenido original si lo hay y limpiarlo
                if (!element.dataset.text) { 
                    element.dataset.text = element.innerHTML; 
                    element.innerHTML = '';
                }

                typeWriter(element, textToType, speed);
                element.classList.add('is-visible'); 
                observer.unobserve(element); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        textObserver.observe(element);
    });

    // Para contenedores (cards, grids, etc.) que no son texto
    const fadeInElements = document.querySelectorAll('.animate-on-scroll');
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1; 
                entry.target.style.transition = 'opacity 1s ease-out';
                observer.unobserve(entry.target); 
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.2 });

    fadeInElements.forEach(element => {
        element.style.opacity = 0; 
        fadeInObserver.observe(element);
    });


    // Lógica interactiva para el CV (Mostrar título en hover)
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const contentH3 = item.querySelector('.timeline-content h3');
        
        // Esperamos a que la animación de texto termine para asegurar el contenido inicial
        setTimeout(() => {
            const originalText = contentH3.textContent; 
            const hoverText = item.getAttribute('data-title');

            item.addEventListener('mouseenter', () => {
                contentH3.textContent = hoverText;
                contentH3.style.color = 'var(--color-accent)';
            });

            item.addEventListener('mouseleave', () => {
                contentH3.textContent = originalText;
                contentH3.style.color = 'var(--color-primary)';
            });
        }, 3000); // 3 segundos para asegurar que el texto se ha escrito
    });
});

// Lógica para el formulario de contacto con Formspree
document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const data = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('>> [Sistema]: OK. Mensaje transferido a riutordjaume@gmail.com.');
            form.reset();
        } else {
            const result = await response.json();
            if (result.errors) {
                alert('>> [ERROR]: Fallo en la transferencia. Verifica los campos e inténtalo de nuevo.');
            } else {
                alert('>> [ERROR]: Algo ha fallado. Por favor, contacta directamente por email.');
            }
        }
    } catch (error) {
        alert('>> [ERROR]: Fallo de red. El sistema no pudo alcanzar el servidor.');
    }
});