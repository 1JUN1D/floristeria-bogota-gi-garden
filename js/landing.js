// ===================================
// LANDING PAGE JS - Gi Garden Bogotá
// Catálogo con prioridad por categoría + Conversiones Google Ads + Día de las Madres
// ===================================

// --- DATOS DEL CATÁLOGO COMPLETO ---
const products = [
    { id: 1, name: "Ternura Rosada", price: 93750, image: "../assets/foto38.webp", description: "Encantador ramo de rosas rosadas con gypsophila y envoltura delicada. Detalle tierno y accesible para cualquier momento.", categories: ["rosas", "bouquets", "precio-bajo"] },
    { id: 2, name: "Suspiro Rosado", price: 118750, image: "../assets/foto30.webp", description: "Tierno ramo de rosas rosadas rematado con una mariposa decorativa. Delicadeza encantadora a un precio accesible.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 3, name: "Girasol Imperial", price: 118750, image: "../assets/foto50.webp", description: "Imponente girasol único enmarcado en envoltura negra y dorada. Minimalismo elegante a precio accesible.", categories: ["girasoles", "bouquets", "precio-medio"] },
    { id: 4, name: "Encanto de Hortensias", price: 137500, image: "../assets/foto36.webp", description: "Romántico ramo de hortensias blancas y siempreviva en tonos suaves. Elegancia natural para ocasiones especiales.", categories: ["bouquets", "precio-medio"] },
    { id: 5, name: "Orgullo del Graduado", price: 143750, image: "../assets/foto21.webp", description: "Ramo de rosas en tonos suaves acompañado de un birrete de graduación. El reconocimiento perfecto para celebrar un logro.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 6, name: "Caja Rubor", price: 143750, image: "../assets/foto24.webp", description: "Caja compacta rebosante de rosas rosadas en tono rubor. Detalle dulce y delicado para enamorar.", categories: ["cajas", "rosas", "precio-medio"] },
    { id: 7, name: "Caja Pasión Roja", price: 147500, image: "../assets/foto4.webp", description: "Elegante caja negra colmada de rosas rojas con gypsophila, lazo a juego y espacio para tu tarjeta. Un clásico atemporal del amor.", categories: ["rosas", "cajas", "precio-medio"] },
    { id: 8, name: "Abrazo Floral", price: 156250, image: "../assets/foto34.webp", description: "Ramo generoso de rosas rosadas y moradas con gypsophila. Un abrazo de color para expresar cariño.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 9, name: "Claveles del Corazón", price: 156250, image: "../assets/foto40.webp", description: "Cálido ramo de claveles rojos y rosados con follaje fino. Clásico lleno de afecto y color.", categories: ["bouquets", "precio-medio"] },
    { id: 10, name: "Rosas de Primavera", price: 156250, image: "../assets/foto41.webp", description: "Fresco ramo de rosas rosadas y blancas que evoca la primavera. Delicadeza y elegancia en cada tallo.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 11, name: "Girasoles de Gala", price: 156250, image: "../assets/foto56.webp", description: "Elegante ramo cuadrado de girasoles; el color de la envoltura se personaliza a tu gusto. Diseño contemporáneo lleno de carácter.", categories: ["girasoles", "bouquets", "precio-medio"] },
    { id: 12, name: "Alegría Campestre", price: 156250, image: "../assets/foto57.webp", description: "Ramo alegre de mini girasoles acompañados de flores variadas. Frescura y color para alegrar cualquier día.", categories: ["girasoles", "bouquets", "precio-medio"] },
    { id: 13, name: "Fiesta de Gerberas", price: 168750, image: "../assets/foto3.webp", description: "Composición vibrante de gerberas multicolor y flores de temporada rematada con un detalle dorado. Alegría pura para sorprender en cualquier ocasión.", categories: ["gerberas", "bouquets", "precio-medio"] },
    { id: 14, name: "Te Amo Encanto", price: 168750, image: "../assets/foto6.webp", description: "Arreglo romántico con rosas rosadas y un globo metálico en forma de corazón con mensaje de amor. Perfecto para declarar lo que sientes.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 15, name: "Graduación Elegante", price: 168750, image: "../assets/foto22.webp", description: "Ramo de rosas rojas con envoltura negra y banda conmemorativa. Sobrio y elegante para honrar a la persona graduada.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 16, name: "Misterio Azul", price: 168750, image: "../assets/foto28.webp", description: "Original ramo de rosas azules con envoltura a tono. Detalle único y sorprendente para quien busca algo diferente.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 17, name: "Clásico Rojo Pasión", price: 168750, image: "../assets/foto42.webp", description: "Compacto ramo redondo de rosas rojas con envoltura traslúcida. El símbolo eterno del amor.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 18, name: "Esplendor de Girasoles", price: 172500, image: "../assets/foto1.webp", description: "Imponente arreglo vertical que combina girasoles radiantes con rosas rojas y follaje tropical sobre base alta. Una pieza llena de energía y calidez ideal para celebraciones memorables.", categories: ["girasoles", "rosas", "bouquets", "precio-medio"] },
    { id: 19, name: "Caja Contraste", price: 181250, image: "../assets/foto9.webp", description: "Refinada caja que combina lirios blancos con rosas rojas en armonía perfecta. Elegancia y contraste en cada detalle.", categories: ["cajas", "rosas", "precio-medio"] },
    { id: 20, name: "Bouquet Pastel Premium", price: 181250, image: "../assets/foto26.webp", description: "Voluminoso ramo en tonos pastel con rosas blancas y moradas y follaje variado. Sofisticación romántica en gran formato.", categories: ["bouquets", "rosas", "precio-medio"] },
    { id: 21, name: "Pureza Blanca", price: 181250, image: "../assets/foto33.webp", description: "Ramo sereno de flores blancas con eucalipto fresco. Sencillez elegante que transmite paz y armonía.", categories: ["bouquets", "precio-medio"] },
    { id: 22, name: "Cosecha de Color", price: 193750, image: "../assets/foto47.webp", description: "Arreglo campestre de rosas naranja y lirios rosados sobre base de madera. Frescura natural con encanto rústico.", categories: ["rosas", "bouquets", "precio-medio"] },
    { id: 23, name: "Campo Vibrante", price: 193750, image: "../assets/foto49.webp", description: "Colorido arreglo de girasoles, rosas y flores moradas. Un pedazo de campo lleno de vitalidad.", categories: ["girasoles", "bouquets", "precio-medio"] },
    { id: 24, name: "Sol y Lirios", price: 193750, image: "../assets/foto53.webp", description: "Radiante arreglo de girasoles y lirios amarillos con verdor fresco, presentado en elegante jarrón. Luz y alegría en cada flor.", categories: ["girasoles", "jarrones", "precio-medio"] },
    { id: 25, name: "Sonrisa de Girasoles", price: 193750, image: "../assets/foto58.webp", description: "Ramo redondo de girasoles con verdor fresco. Pura alegría para sacar sonrisas.", categories: ["girasoles", "bouquets", "precio-medio"] },
    { id: 26, name: "Dulzura Pastel", price: 206250, image: "../assets/foto16.webp", description: "Delicado arreglo en tonos pastel con rosas y flores suaves dispuestas en una caja rosa. Ternura y suavidad en estado puro.", categories: ["bouquets", "cajas", "precio-alto"] },
    { id: 27, name: "Lirios al Sol", price: 206250, image: "../assets/foto39.webp", description: "Luminoso ramo de lirios amarillos y naranjas de pétalos abiertos. Frescura radiante que ilumina el día.", categories: ["bouquets", "precio-alto"] },
    { id: 28, name: "Caja Romántica con Chocolates", price: 206250, image: "../assets/foto45.webp", description: "Caja alargada con rosas rojas y finos chocolates. La combinación perfecta de amor y dulzura.", categories: ["cajas", "rosas", "chocolates", "precio-alto"] },
    { id: 29, name: "Cascada Fucsia", price: 218750, image: "../assets/foto2.webp", description: "Espectacular torre escalonada de rosas fucsia coronada con una hortensia central y verdor exuberante. Diseño de gran formato que impone presencia y romanticismo.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 30, name: "Caja Sorpresa Roja", price: 218750, image: "../assets/foto25.webp", description: "Caja con rosas rojas coronada por un globo decorativo. Sorpresa vibrante que celebra el amor con estilo.", categories: ["cajas", "rosas", "precio-alto"] },
    { id: 31, name: "Atardecer en Jarrón", price: 218750, image: "../assets/foto31.webp", description: "Cálido arreglo de rosas naranja dispuesto en elegante jarrón de vidrio. Listo para iluminar cualquier rincón.", categories: ["rosas", "jarrones", "precio-alto"] },
    { id: 32, name: "Elegancia Marfil", price: 218750, image: "../assets/foto37.webp", description: "Sobrio arreglo de rosas blancas en jarrón de vidrio con follaje verde. La distinción de lo clásico.", categories: ["rosas", "jarrones", "precio-alto"] },
    { id: 33, name: "Elegancia de Calas", price: 218750, image: "../assets/foto46.webp", description: "Sofisticado ramo de calas blancas y rosas rojas con envoltura negra. Distinción y drama en un mismo diseño.", categories: ["bouquets", "rosas", "precio-alto"] },
    { id: 34, name: "Llama Eterna", price: 231250, image: "../assets/foto7.webp", description: "Arreglo vertical de rosas rojas y gladiolos encendidos sobre follaje frondoso. Una declaración de pasión imposible de ignorar.", categories: ["rosas", "bouquets", "precio-alto"] },
    { id: 35, name: "Torre Frutal Durazno", price: 231250, image: "../assets/foto15.webp", description: "Elegante torre de rosas en tono durazno combinada con frutas frescas en canasta. Lujo y sabor en una misma creación.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 36, name: "Lirios Silvestres", price: 231250, image: "../assets/foto23.webp", description: "Elegante ramo compuesto únicamente de lirios y follaje fresco. Naturalidad y distinción para alegrar cualquier espacio.", categories: ["bouquets", "precio-alto"] },
    { id: 37, name: "Tulipanes Encantados", price: 231250, image: "../assets/foto44.webp", description: "Elegante ramo de tulipanes rosados realzado con gypsophila. Suavidad y encanto en perfecta armonía.", categories: ["bouquets", "precio-alto"] },
    { id: 38, name: "Brindis Dorado", price: 231250, image: "../assets/foto51.webp", description: "Festivo arreglo con globo dorado, frutas y flores de temporada. Celebra con estilo y abundancia.", categories: ["bouquets", "premium", "precio-alto"] },
    { id: 39, name: "Canasta Solar Frutal", price: 243750, image: "../assets/foto5.webp", description: "Generosa canasta que reúne girasoles, frutas frescas y un globo decorativo. Detalle completo que combina dulzura, color y abundancia.", categories: ["girasoles", "premium", "precio-alto"] },
    { id: 40, name: "Torre Solar", price: 243750, image: "../assets/foto8.webp", description: "Llamativa torre de girasoles culminada con lirios en su cúspide. Estructura escultural que irradia optimismo y frescura.", categories: ["girasoles", "premium", "precio-alto"] },
    { id: 41, name: "Ramo Algodón de Colores", price: 243750, image: "../assets/foto19.webp", description: "Vistoso ramo de gypsophila multicolor envuelto con lazo. Detalle ligero y encantador que arranca sonrisas.", categories: ["bouquets", "precio-alto"] },
    { id: 42, name: "Romance Clásico", price: 256250, image: "../assets/foto10.webp", description: "Arreglo señorial de rosas rojas y blancas con lirios y verdor sobre base elegante. La esencia del romance tradicional.", categories: ["rosas", "bouquets", "precio-alto"] },
    { id: 43, name: "Canasta Querida Hija", price: 256250, image: "../assets/foto52.webp", description: "Tierna canasta con peluche, globo personalizado y flores en tonos suaves. Un regalo cargado de afecto.", categories: ["bouquets", "premium", "precio-alto"] },
    { id: 44, name: "Torre de Amor", price: 268750, image: "../assets/foto13.webp", description: "Torre de rosas rojas acompañada de globos, con opción de añadir orquídeas si lo solicitas. Detalle completo para conquistar y celebrar el amor.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 45, name: "Tropical Gourmet", price: 268750, image: "../assets/foto27.webp", description: "Arreglo exótico con aves del paraíso, rosas naranja y frutas frescas. Lujo tropical que combina belleza y sabor.", categories: ["bouquets", "premium", "precio-alto"] },
    { id: 46, name: "Festín Solar", price: 268750, image: "../assets/foto35.webp", description: "Arreglo abundante de girasoles, rosas rojas y frutas frescas. Combinación festiva llena de vida y sabor.", categories: ["girasoles", "premium", "precio-alto"] },
    { id: 47, name: "Corona Homenaje Dorado", price: 275000, image: "../assets/foto17.webp", description: "Solemne corona fúnebre en tonos dorados y blancos con acabado clásico. Un homenaje digno y respetuoso de despedida.", categories: ["premium", "precio-alto"] },
    { id: 48, name: "Elegancia Tropical", price: 281250, image: "../assets/foto32.webp", description: "Refinado arreglo de rosas rosadas realzado con aves del paraíso. Elegancia exótica de gran presencia.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 49, name: "Caja Solar Sorpresa", price: 281250, image: "../assets/foto48.webp", description: "Completa caja sorpresa con girasoles, peluche y chocolates. Regalo integral que combina alegría y dulzura.", categories: ["cajas", "girasoles", "chocolates", "precio-alto"] },
    { id: 50, name: "Abrazo de Peluche", price: 293750, image: "../assets/foto43.webp", description: "Ramo de rosas en tonos suaves acompañado de un peluche y envoltura morada. Ternura completa para regalar.", categories: ["rosas", "bouquets", "precio-alto"] },
    { id: 51, name: "Nube Multicolor", price: 306250, image: "../assets/foto12.webp", description: "Esfera espectacular de gypsophila teñida en todos los colores del arcoíris; una flor muy duradera que se conserva por bastante tiempo. Diseño moderno y festivo que enamora a primera vista.", categories: ["bouquets", "premium", "precio-alto"] },
    { id: 52, name: "Corona Paz Blanca", price: 306250, image: "../assets/foto18.webp", description: "Corona fúnebre de lirios y flores blancas que transmite serenidad y respeto. Acompaña con elegancia los momentos de duelo.", categories: ["premium", "precio-alto"] },
    { id: 53, name: "Gran Bouquet Fucsia", price: 312500, image: "../assets/foto54.webp", description: "Exuberante ramo de gran tamaño con rosas fucsia y blancas. Volumen y color para una impresión inolvidable.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 54, name: "Celebración Cumpleañera", price: 331250, image: "../assets/foto14.webp", description: "Festivo arreglo con globo de feliz cumpleaños, peluche y flores en tonos cálidos. La sorpresa perfecta para un día especial.", categories: ["bouquets", "premium", "precio-alto"] },
    { id: 55, name: "Pirámide Floral", price: 343750, image: "../assets/foto29.webp", description: "Escultural arreglo piramidal de gran formato que puede elaborarse con rosas, gerberas y girasoles a tu elección. Pieza premium de diseño espectacular.", categories: ["bouquets", "premium", "rosas", "gerberas", "girasoles", "precio-alto"] },
    { id: 56, name: "Cascada Arcoíris", price: 347500, image: "../assets/foto11.webp", description: "Monumental cascada de rosas en degradado de colores acompañada de globos decorativos. Pieza premium para momentos inolvidables.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 57, name: "Gran Torre Imperial", price: 437500, image: "../assets/foto20.webp", description: "Imponente torre de rosas rojas y lirios de gran formato. Pieza majestuosa para impresionar en las ocasiones más importantes.", categories: ["rosas", "premium", "precio-alto"] },
    { id: 58, name: "Majestad Tropical", price: 812500, image: "../assets/foto55.webp", description: "Arreglo monumental con aves del paraíso, lirios y flores exóticas en canasta de lujo. La máxima expresión de grandeza floral.", categories: ["premium", "bouquets", "precio-alto"] }
];

// --- VARIABLES GLOBALES ---
let currentLandingFilter = 'todos';
let currentSearchQuery = '';
let LANDING_PRIORITY_TAG = '';

// --- GENERAR CÓDIGO DE PRODUCTO ---
function getProductCode(id) {
    return 'COD-' + String(id).padStart(3, '0');
}

// --- QUITAR TILDES para búsqueda ---
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// --- FORMATEO DE PRECIO ---
function formatCOP(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(price);
}

// --- ORDENAR PRODUCTOS: primero los de la categoría de la landing ---
function getSortedProducts(priorityTag) {
    const priority = [];
    const rest = [];
    products.filter(p => !p.hidden).forEach(p => {
        if (p.categories && p.categories.includes(priorityTag)) {
            priority.push(p);
        } else {
            rest.push(p);
        }
    });
    priority.sort((a, b) => a.price - b.price);
    rest.sort((a, b) => a.price - b.price);
    return [...priority, ...rest];
}

// --- ACTUALIZAR CONTADOR DE RESULTADOS ---
function updateResultsCount(count) {
    const counter = document.getElementById('results-count');
    if (counter) counter.textContent = count;
    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = count === 0 ? 'block' : 'none';
}

// --- FUNCIÓN PARA RENDERIZAR PRODUCTOS ---
function renderProducts(filters = [], limit = null) {
    const container = document.querySelector('.products-container');
    if (!container) return;

    // Excluir productos ocultos
    let productsToDisplay = products.filter(p => !p.hidden);

    if (LANDING_PRIORITY_TAG) {
        productsToDisplay = getSortedProducts(LANDING_PRIORITY_TAG);
    }

    // Filtrar por categoría
    if (filters.length > 0 && filters[0] !== 'todos') {
        productsToDisplay = productsToDisplay.filter(p =>
            filters.some(f => p.categories && p.categories.includes(f))
        );
    }

    // Filtrar por búsqueda (sin tildes, incluye código de producto, multi-palabra)
    if (currentSearchQuery) {
        const queryNorm = removeAccents(currentSearchQuery.trim());
        const queryWords = queryNorm.split(/\s+/);
        productsToDisplay = productsToDisplay.filter(p => {
            const text = removeAccents(p.name + ' ' + p.description + ' ' + (p.categories ? p.categories.join(' ') : '') + ' ' + getProductCode(p.id));
            return queryWords.every(word => text.includes(word));
        });
    }

    // Orden estricto de menor a mayor precio: TODOS los productos, sin omitir ninguno
    productsToDisplay.sort((a, b) => a.price - b.price);

    if (limit) {
        productsToDisplay = productsToDisplay.slice(0, limit);
    }

    updateResultsCount(productsToDisplay.length);

    // (Se eliminó el reordenamiento por categoría para respetar el orden por precio)


    container.innerHTML = '';
    productsToDisplay.forEach(product => {
        const escapedName = product.name.replace(/'/g, "\\'");
        const code = getProductCode(product.id);
        const productHTML = `
            <div class="product-item">
                <div class="product-image" style="position:relative;">
                    <span class="product-code-badge" style="position:absolute;top:0.7rem;left:0.7rem;background:rgba(0,0,0,0.65);color:#fff;padding:0.3rem 0.7rem;border-radius:6px;font-size:0.75rem;font-weight:700;letter-spacing:0.5px;z-index:2;font-family:'Poppins',sans-serif;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">${code}</span>
                    <img src="${product.image}" alt="${product.name} - Flores a domicilio Bogotá" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-footer">
                        <span class="price">${formatCOP(product.price)}</span>
                        <button class="btn-order" onclick="orderWA('${code} - ${escapedName}', '${product.price}', '${product.image.replace(/'/g, "\\'")}')">
                            Pedir por WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// --- FUNCIONES DE WHATSAPP ---
function contactWA() {
    const url = 'https://wa.me/573145957395?text=Hola,%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20flores.%20%C2%BFPodr%C3%ADan%20ayudarme%3F';
    try {
        gtag('event', 'conversion', {
            'send_to': 'AW-18191445167/oikaCKmp6rMcEK_ZreJD',
            'value': 1.0,
            'currency': 'COP',
            'event_callback': function () {
                window.open(url, '_blank');
            }
        });
    } catch (e) {
        window.open(url, '_blank');
    }
}

function orderWA(productName, price, image) {
    let message = `Hola, me interesa ${productName} (${formatCOP(parseFloat(price))}). ¿Podrías darme más información?`;
    if (image) {
        const photoUrl = 'https://bogotafloristeria.dondeseria.com/' + String(image).replace('../', '');
        message = `Hola, me interesa el producto: ${productName} - ${formatCOP(parseFloat(price))}\nFoto: ${photoUrl}`;
    }
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/573145957395?text=${encodedMessage}`;
    try {
        gtag('event', 'conversion', {
            'send_to': 'AW-18191445167/oikaCKmp6rMcEK_ZreJD',
            'value': 1.0,
            'currency': 'COP',
            'event_callback': function () {
                window.open(url, '_blank');
            }
        });
    } catch (e) {
        window.open(url, '_blank');
    }
}

// --- FILTRADO DE PRODUCTOS ---
function filterProducts(tag) {
    currentLandingFilter = tag;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === tag) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (tag === 'todos') {
        renderProducts();
    } else {
        renderProducts([tag]);
    }
}

// --- INICIALIZAR CATÁLOGO COMPLETO ---
function initCatalog() {
    window._catalogInitialized = true;
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterProducts(this.getAttribute('data-filter'));
        });
    });

    // Búsqueda
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchQuery = this.value.trim();
            if (searchClear) searchClear.style.display = currentSearchQuery ? 'block' : 'none';
            if (currentLandingFilter === 'todos') {
                renderProducts();
            } else {
                renderProducts([currentLandingFilter]);
            }
        });
    }
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            currentSearchQuery = '';
            this.style.display = 'none';
            if (currentLandingFilter === 'todos') {
                renderProducts();
            } else {
                renderProducts([currentLandingFilter]);
            }
        });
    }

    // Render inicial con todos los productos
    renderProducts();

    // Soporte #dia-madre en URL
    checkHashMadres();
}

// Animación de corazones al activar filtro Día de las Madres
function spawnHearts() {
    let container = document.querySelector('.hearts-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'hearts-container';
        document.body.appendChild(container);
    }
    const hearts = ['♥', '❤', '♡', '❣'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        heart.style.color = ['#e91e63', '#ec407a', '#f06292', '#ff4081', '#ff80ab'][Math.floor(Math.random() * 5)];
        container.appendChild(heart);
        setTimeout(function() { heart.remove(); }, 5000);
    }
}

// Soporte #dia-madre en URL
// SEGURO: Auto-filtro por hash desactivado para que SIEMPRE muestre todos los productos al entrar
function checkHashMadres() {
    // Comportamiento original deshabilitado:
    // if (window.location.hash === '#dia-madre' || window.location.hash === '#dia-madres') {
    //     filterProducts('dia-madres');
    //     spawnHearts();
    //     setTimeout(function() {
    //         var section = document.getElementById('productos');
    //         if (section) section.scrollIntoView({ behavior: 'smooth' });
    //     }, 300);
    // }
    // Agregar lanzamiento de corazones al hacer clic en botón Madres (mantiene el efecto al hacer clic)
    var madresBtn = document.querySelector('.filter-btn-madres');
    if (madresBtn) {
        madresBtn.addEventListener('click', function() {
            spawnHearts();
        });
    }
}

// Inicializar automáticamente si no se define LANDING_PRIORITY_TAG manualmente
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si no hay un script en la página que lo haga
    setTimeout(function() {
        if (!window._catalogInitialized) {
            initCatalog();
        }
    }, 50);
});
