import re, sys, os, glob, io

ROOT = sys.argv[1]
os.chdir(ROOT)

def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s): io.open(p, 'w', encoding='utf-8', newline='').write(s)

def rep(s, a, b, count=1):
    n = s.count(a)
    if n < 1:
        raise SystemExit('NO ENCONTRADO: ' + a[:90])
    return s.replace(a, b, count if count else n)

ROSA = ['foto24', 'foto30', 'foto34', 'foto32', 'foto31', 'foto62']

def add_cat(s, key, multiline):
    # agrega "frenesirosa" a las categorías del producto con esa foto
    if multiline:
        pat = re.compile(r'(image: "assets/' + key + r'\.webp",\s*\n\s*description: "[^"]*",\s*\n\s*categories: \[)')
    else:
        pat = re.compile(r'(image: "\.\./assets/' + key + r'\.webp", description: "[^"]*", categories: \[)')
    s2, n = pat.subn(r'\1"frenesirosa", ', s)
    if n != 1:
        raise SystemExit('categoria %s: %d' % (key, n))
    return s2

FILTER_OLD_RE = re.compile(r'[ \t]*<button class="filter-btn filter-btn-amor" data-filter="amoramistad">💝 Amor y Amistad</button>\r?\n([ \t]*)<button class="filter-btn filter-btn-amarillas" data-filter="amarillas">🌻 Flores Amarillas</button>')
def filters(s):
    s2, n = FILTER_OLD_RE.subn(lambda m: m.group(1) + '<button class="filter-btn filter-btn-frenesi" data-filter="frenesirosa">🌸 Frenesí Rosa</button>', s)
    if n != 1:
        raise SystemExit('filtros: %d' % n)
    return s2

# ------------------------------------------------------------------ catalogo.html
p = 'catalogo.html'
s = rd(p)
s = filters(s)
# Mover "Frenesí Rosa" justo después de "Todos los Productos"
s = rep(s, '''                <button class="filter-btn active" data-filter="todos">Todos los Productos</button>
                <button class="filter-btn filter-btn-frenesi" data-filter="frenesirosa">🌸 Frenesí Rosa</button>''',
        '''                <button class="filter-btn active" data-filter="todos">Todos los Productos</button>
                <button class="filter-btn filter-btn-frenesi" data-filter="frenesirosa">🌸 Frenesí Rosa</button>''')

s = rep(s, '''                name: "Ternura Rosada",
                price: 112500,
                image: "assets/foto38.webp",
                description: "Encantador ramo de rosas rosadas con gypsophila y envoltura delicada. Detalle tierno y accesible para cualquier momento.",
                categories: ["rosas", "bouquets", "amoramistad", "precio-medio"]''',
'''                name: "Ternura Rosada",
                price: 85000,
                image: "assets/foto38.webp",
                description: "Arreglo de la semana. Rosas rosadas con mariposa brillante, nube de gypsophila y envoltura delicada. Escoge el tamaño: 12, 18 o 24 rosas.",
                categories: ["rosas", "bouquets", "frenesirosa", "precio-bajo"],
                variants: [
                    { label: "12 rosas", price: 85000, image: "assets/foto38.webp" },
                    { label: "18 rosas", price: 110000, image: "assets/foto38_1.webp" },
                    { label: "24 rosas", price: 135000, image: "assets/foto38_2.webp" }
                ]''')
for k in ROSA:
    s = add_cat(s, k, True)

# Render: chips de tamaños + precio anterior por foto
s = rep(s, '''                const hasOptions = Array.isArray(product.priceOptions) && product.priceOptions.length > 0;
                const priceLabel = hasOptions ? 'Desde' : 'Precio';''',
'''                const hasOptions = Array.isArray(product.priceOptions) && product.priceOptions.length > 0;
                const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
                const priceLabel = hasVariants ? product.variants[0].label : (hasOptions ? 'Desde' : 'Precio');
                const variantsHtml = hasVariants ? `
                    <div class="variant-chips" role="group" aria-label="Tamaños">
                        ${product.variants.map((v, i) => `<button type="button" class="variant-chip${i === 0 ? ' on' : ''}" data-img="${v.image}" data-price="${v.price}" data-label="${v.label}">${v.label}<strong>${formatPrice(v.price)}</strong></button>`).join('')}
                    </div>
                ` : '';''')
s = rep(s, "const promoBefore = promo ? PN.priceBefore(promo) : '';\n                let anchor",
           "const promoBefore = promo ? PN.priceBefore(promo, product.image) : '';\n                let anchor")
s = rep(s, '''                const waMsg = hasOptions
                    ? `Hola Gi Garden, me interesa: ${code} - ${product.name} (desde ${formatPrice(product.price)}). Quiero ver opciones.`''',
'''                const waMsg = hasVariants
                    ? `Hola Gi Garden, me interesa: ${code} - ${product.name} (${product.variants[0].label}) - ${formatPrice(product.price)}.`
                    : hasOptions
                    ? `Hola Gi Garden, me interesa: ${code} - ${product.name} (desde ${formatPrice(product.price)}). Quiero ver opciones.`''')
s = rep(s, '''<div class="product-card${promoClass}"${anchor} data-categories="${product.categories.join(' ')}">''',
           '''<div class="product-card${promoClass}"${anchor} data-categories="${product.categories.join(' ')}" data-code="${code}" data-name="${product.name}">''')
s = rep(s, '''                        ${optionsHtml}
                        <div class="product-footer">''',
'''                        ${optionsHtml}
                        ${variantsHtml}
                        <div class="product-footer">''')
s = rep(s, '''<span class="price-label">${promo ? (promo.label || priceLabel) : priceLabel}</span>''',
           '''<span class="price-label">${hasVariants ? priceLabel : (promo ? (promo.label || priceLabel) : priceLabel)}</span>''')

# Tarjeta personalizada SIEMPRE de primera; luego Frenesí Rosa (en su orden) y Ternura
s = rep(s, '''            // Los destacados de temporada van de primeros, luego la tarjeta de arreglo
            // personalizado y después el resto del catálogo.
            grid.innerHTML = cards.slice(0, promoCount).join('') + customCard + cards.slice(promoCount).join('');''',
'''            // Primero la tarjeta de arreglo personalizado, luego los destacados
            // (Frenesí Rosa en su orden + Arreglo de la semana) y después el resto.
            grid.innerHTML = customCard + cards.join('');''')
s = rep(s, '''            // AMOR Y AMISTAD + FLORES AMARILLAS: los destacados suben al tope''',
           '''            // FRENESÍ ROSA + ARREGLO DE LA SEMANA: los destacados suben al tope (orden en js/promo-semana.js)''')

# Cambio de tamaño en la tarjeta (Ternura Rosada)
s = rep(s, '''        function formatPrice(price) {
            return '$' + price.toLocaleString('es-CO');
        }''',
'''        function formatPrice(price) {
            return '$' + price.toLocaleString('es-CO');
        }

        // Tamaños de un arreglo (ej. Ternura Rosada 12 / 18 / 24 rosas): cambia foto, precio y mensaje
        window.pickVariant = function (chip) {
            const card = chip.closest('.product-card');
            if (!card) return;
            const img = chip.dataset.img, price = Number(chip.dataset.price), label = chip.dataset.label;
            const name = card.dataset.name, code = card.dataset.code;
            card.querySelectorAll('.variant-chip').forEach(c => c.classList.toggle('on', c === chip));
            const im = card.querySelector('img.product-image');
            if (im) im.src = img;
            const box = card.querySelector('.product-image-container');
            if (box) box.onclick = () => openLightbox(img, name + ' - ' + label, formatPrice(price));
            const pr = card.querySelector('.product-price');
            if (pr) pr.textContent = formatPrice(price);
            const lb = card.querySelector('.price-label');
            if (lb) lb.textContent = label;
            const PN = window.PROMO_SEMANA;
            const before = PN && PN.beforeOf ? PN.beforeOf(img) : 0;
            const old = card.querySelector('.pn-old');
            if (old) { old.textContent = before ? formatPrice(before) : ''; old.style.display = before ? '' : 'none'; }
            const a = card.querySelector('a.btn-order');
            if (a) {
                const msg = `Hola Gi Garden, me interesa: ${code} - ${name} (${label}) - ${formatPrice(price)}.` + '\\nFoto: https://bogotafloristeria.dondeseria.com/' + img;
                a.href = 'https://wa.me/573145957395?text=' + encodeURIComponent(msg);
            }
        };
        document.addEventListener('click', function (e) {
            const chip = e.target.closest && e.target.closest('.variant-chip');
            if (chip) window.pickVariant(chip);
        });''')
wr(p, s)
print('catalogo.html OK')

# ------------------------------------------------------------------ js/landing.js
p = 'js/landing.js'
s = rd(p)
s = rep(s, '''{ id: 1, name: "Ternura Rosada", price: 112500, image: "../assets/foto38.webp", description: "Encantador ramo de rosas rosadas con gypsophila y envoltura delicada. Detalle tierno y accesible para cualquier momento.", categories: ["rosas", "bouquets", "amoramistad", "precio-medio"] },''',
'''{ id: 1, name: "Ternura Rosada", price: 85000, image: "../assets/foto38.webp", description: "Arreglo de la semana. Rosas rosadas con mariposa brillante, nube de gypsophila y envoltura delicada. Escoge el tamaño: 12, 18 o 24 rosas.", categories: ["rosas", "bouquets", "frenesirosa", "precio-bajo"], variants: [{ label: "12 rosas", price: 85000, image: "../assets/foto38.webp" }, { label: "18 rosas", price: 110000, image: "../assets/foto38_1.webp" }, { label: "24 rosas", price: 135000, image: "../assets/foto38_2.webp" }] },''')
for k in ROSA:
    s = add_cat(s, k, False)
s = rep(s, '''    // AMOR Y AMISTAD + FLORES AMARILLAS: los destacados suben al tope conservando el orden por precio''',
           '''    // FRENESÍ ROSA + ARREGLO DE LA SEMANA: los destacados suben al tope (orden en js/promo-semana.js)''')
s = rep(s, "const promoBefore = promo ? PN.priceBefore(promo) : '';",
           "const promoBefore = promo ? PN.priceBefore(promo, product.image) : '';")
s = rep(s, '''        let anchor = '';
        if (promo && !firstPromoMarked) { anchor = ' id="promo-semana-primero"'; firstPromoMarked = true; }

        return `
            <div class="product-item${promoClass}"${anchor}>''',
'''        let anchor = '';
        if (promo && !firstPromoMarked) { anchor = ' id="promo-semana-primero"'; firstPromoMarked = true; }
        const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
        const variantsHtml = hasVariants ? `
                    <div class="variant-chips" role="group" aria-label="Tamaños">
                        ${product.variants.map((v, i) => `<button type="button" class="variant-chip${i === 0 ? ' on' : ''}" data-img="${v.image}" data-price="${v.price}" data-label="${v.label}">${v.label}<strong>${formatCOP(v.price)}</strong></button>`).join('')}
                    </div>` : '';
        const orderName = hasVariants ? `${code} - ${escapedName} (${product.variants[0].label})` : `${code} - ${escapedName}`;

        return `
            <div class="product-item${promoClass}"${anchor} data-code="${code}" data-name="${product.name}">''')
s = rep(s, '''                    <p>${product.description}</p>
                    <div class="product-footer">
                        <span class="price">${promoBefore}${formatCOP(product.price)}</span>
                        <button class="btn-order" onclick="orderWA('${code} - ${escapedName}', '${product.price}', '${product.image.replace(/'/g, "\\\\'")}')">''',
'''                    <p>${product.description}</p>
                    ${variantsHtml}
                    <div class="product-footer">
                        <span class="price">${promoBefore}<span class="pn-now">${formatCOP(product.price)}</span></span>
                        <button class="btn-order" onclick="orderWA('${orderName}', '${product.price}', '${product.image.replace(/'/g, "\\\\'")}')">''')
s = rep(s, '''// --- FUNCIONES DE WHATSAPP ---''',
'''// --- TAMAÑOS DE UN ARREGLO (ej. Ternura Rosada 12 / 18 / 24 rosas) ---
window.pickVariant = function (chip) {
    const card = chip.closest('.product-item');
    if (!card) return;
    const img = chip.dataset.img, price = Number(chip.dataset.price), label = chip.dataset.label;
    const name = card.dataset.name, code = card.dataset.code;
    card.querySelectorAll('.variant-chip').forEach(c => c.classList.toggle('on', c === chip));
    const im = card.querySelector('.product-image img');
    if (im) im.src = img;
    const now = card.querySelector('.pn-now');
    if (now) now.textContent = formatCOP(price);
    const PN = window.PROMO_SEMANA;
    const before = PN && PN.beforeOf ? PN.beforeOf(img) : 0;
    const old = card.querySelector('.pn-old');
    if (old) { old.textContent = before ? formatCOP(before) : ''; old.style.display = before ? '' : 'none'; }
    const btn = card.querySelector('.btn-order');
    if (btn) btn.onclick = function () { orderWA(`${code} - ${name} (${label})`, String(price), img); };
};
document.addEventListener('click', function (e) {
    const chip = e.target.closest && e.target.closest('.variant-chip');
    if (chip) window.pickVariant(chip);
});

// --- FUNCIONES DE WHATSAPP ---''')
wr(p, s)
print('landing.js OK')

# ------------------------------------------------------------------ landing/*.html
for p in sorted(glob.glob('landing/*.html')):
    s = rd(p)
    s = filters(s)
    wr(p, s)
    print(p, 'OK')
