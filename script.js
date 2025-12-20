document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-menu');

    const typeWriter = (element, text, speed = 80, delay = 0) => {
        let i = 0;
        element.innerHTML = '';
        element.style.opacity = 1;
        
        const processChar = () => {
            if (i < text.length) {
                const char = text.charAt(i);
                
                if (char === '<') {
                    // Buscamos si es un enlace completo
                    if (text.substring(i, i + 3) === '<a ') {
                        const closingTagIndex = text.indexOf('</a>', i);
                        if (closingTagIndex !== -1) {
                            const fullLink = text.substring(i, closingTagIndex + 4);
                            element.innerHTML += fullLink;
                            i = closingTagIndex + 4; // Saltamos al final del link
                        }
                    } else {
                        // Para otras etiquetas (como <br> o <span>)
                        const endIndex = text.indexOf('>', i);
                        if (endIndex !== -1) {
                            element.innerHTML += text.substring(i, endIndex + 1);
                            i = endIndex + 1;
                        }
                    }
                } else {
                    element.innerHTML += char;
                    i++;
                }
                setTimeout(processChar, speed);
            }
        };

        setTimeout(processChar, delay);
    };

    const heroElements = document.querySelectorAll('.hero-section .terminal-block .animated-text');
    const terminalAnimation = document.getElementById("code-typing");
    const heroSocialLinks = document.querySelector('.hero-section .social-links');

    let currentDelay = 500;
    heroElements.forEach((element, index) => {
        const speed = 100;
        const textToType = element.dataset.text;
        
        typeWriter(element, textToType, speed, currentDelay);
        currentDelay += (textToType.length * speed) + 500;
    });
    
    if (terminalAnimation) {
        const codeText = ">> [Sistema]: Conexión establecida. Iniciando bitácora de desarrollo...";
        setTimeout(() => typeWriter(terminalAnimation, codeText, 80), currentDelay);
        currentDelay += (codeText.length * 80) + 1000;
    }

    if (heroSocialLinks) {
        setTimeout(() => heroSocialLinks.style.opacity = 1, currentDelay); 
    }


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

    const animatedElements = document.querySelectorAll('.animated-text');
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1
    };

    const textObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('is-visible') && !entry.target.closest('#hero')) {
                const element = entry.target;
                const textToType = element.dataset.text || element.innerHTML;
                const speed = parseInt(element.dataset.textSpeed) || 40;
                
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


    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const contentH3 = item.querySelector('.timeline-content h3');
        
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
        }, 3000);
    });
});

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