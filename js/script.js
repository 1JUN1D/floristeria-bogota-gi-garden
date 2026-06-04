// ===================================
// CARGA DE COMPONENTES
// ===================================

// Función para cargar componentes HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Error loading ${componentPath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component: ${error.message}`);
    }
}

// Cargar todos los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar componentes
    loadComponent('navbar-container', 'components/navbar.html');
    loadComponent('footer-container', 'components/footer.html');
    loadComponent('service-areas-container', 'components/service-areas.html');
    loadComponent('contact-info-container', 'components/contact-info.html');
    loadComponent('whatsapp-button-container', 'components/whatsapp-button.html');
    
    // Inicializar funcionalidades
    initSmoothScroll();
    initNavbarScroll();
    initLazyLoading();
});

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
function initNavbarScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// LAZY LOADING DE IMÁGENES
// ===================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// MOBILE MENU TOGGLE
// ===================================
function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if (menu && hamburger) {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
}

// ===================================
// WHATSAPP TRACKING
// ===================================
function trackWhatsAppClick(source) {
    // Aquí puedes agregar tracking de Google Analytics o similar
    console.log(`WhatsApp click from: ${source}`);
    
    // Ejemplo con Google Analytics (descomenta si lo usas)
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'whatsapp_click', {
    //         'event_category': 'engagement',
    //         'event_label': source
    //     });
    // }
}

// ===================================
// ANIMACIÓN DE ENTRADA DE ELEMENTOS
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.category-card, .service-area-item').forEach(el => {
        observer.observe(el);
    });
}

// Inicializar animaciones después de cargar componentes
setTimeout(initScrollAnimations, 1000);

// ===================================
// FORMULARIO DE CONTACTO (si lo agregas)
// ===================================
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Aquí puedes enviar los datos a un servidor o crear un mensaje de WhatsApp
    const message = `Hola, mi nombre es ${data.name}. ${data.message}`;
    const whatsappUrl = `https://wa.me/573145957395?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// ===================================
// UTILIDADES
// ===================================

// Detectar dispositivo móvil
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Formatear número de teléfono
function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('¡Copiado al portapapeles!');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

// Mostrar notificación temporal
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #E91E63;
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// TRACKING DE RENDIMIENTO
// ===================================
window.addEventListener('load', () => {
    // Tiempo de carga de la página
    const loadTime = performance.now();
    console.log(`Página cargada en ${(loadTime / 1000).toFixed(2)} segundos`);
    
    // Puedes enviar esta métrica a Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'timing_complete', {
    //         'name': 'load',
    //         'value': Math.round(loadTime),
    //         'event_category': 'Performance'
    //     });
    // }
});

// ===================================
// PREVENCIÓN DE SPAM EN FORMULARIOS
// ===================================
function addHoneypot() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        form.appendChild(honeypot);
    });
}

// Ejecutar después de cargar componentes
setTimeout(addHoneypot, 1000);
