/* =====================================================================
   PROMO DÍA DE LA NOVIA — "Colección Ella" · Gi Garden Bogotá
   ---------------------------------------------------------------------
   Módulo autocontenido (CSS + JS en un solo archivo, sin librerías).
   Incluye:
     · Flyer flotante con carrusel de los 7 arreglos en promoción
     · Contador regresivo hasta el 1 de agosto, 11:59 p.m. (hora Bogotá)
     · Banner con contador sobre la grilla de productos
     · Estilos de destaque para las 7 tarjetas especiales
   Optimización:
     · 0 dependencias externas, ~1 archivo, sin reflow en animaciones
     · Imágenes del carrusel cargadas bajo demanda (data-src)
     · Animaciones sólo en transform/opacity (compositor GPU)
     · Se pausa cuando la pestaña no está visible
     · Respeta prefers-reduced-motion
   ---------------------------------------------------------------------
   CÓMO APAGAR LA PROMO: borrar la etiqueta <script> de promo-novia.js
   de las páginas, o poner DISCOUNTS_ALWAYS_ON = false más abajo.
   ===================================================================== */
(function () {
    'use strict';

    // ---------------------------------------------------------------
    // 1. CONFIGURACIÓN
    // ---------------------------------------------------------------

    // Fin del contador: 1 de agosto de 2026, 11:59:59 p.m. hora de Bogotá (UTC-5)
    var END_TS = new Date('2026-08-01T23:59:59-05:00').getTime();

    // Los descuentos y el destaque de las 7 tarjetas se mantienen aunque
    // el contador llegue a cero (solo desaparecen el flyer y el contador).
    var DISCOUNTS_ALWAYS_ON = true;

    var WA_PHONE = '573145957395';
    var SITE = 'https://bogotafloristeria.dondeseria.com/';

    // Base de rutas (funciona igual en la raíz y dentro de /landing/)
    var thisScript = document.currentScript;
    var BASE = (function () {
        if (thisScript && thisScript.src) {
            return thisScript.src.replace(/js\/promo-novia\.js.*$/, '');
        }
        return /\/landing\//.test(location.pathname) ? '../' : '';
    })();

    // ---------------------------------------------------------------
    // 2. LOS 7 ARREGLOS EN PROMOCIÓN
    // ---------------------------------------------------------------
    var ITEMS = [
        {
            key: 'foto38',
            name: 'Ternura Rosada',
            hook: 'El "te pienso" más bonito que le puedes mandar un martes cualquiera.',
            desc: 'Rosas rosadas con nube de gypsophila y envoltura delicada. Pequeño en tamaño, enorme en intención.',
            before: 120000, now: 93750
        },
        {
            key: 'foto30',
            name: 'Suspiro Rosado',
            hook: 'Rosas que llegan con mariposa incluida. Ella va a entender el mensaje.',
            desc: 'Ramo de rosas rosadas rematado con una mariposa decorativa. Delicadeza que se roba la mirada apenas abre la puerta.',
            before: 152000, now: 118750
        },
        {
            key: 'foto59',
            name: 'Sol de tu Sonrisa',
            hook: 'Girasoles y rosas en el mismo ramo: alegría y amor sin tener que elegir.',
            desc: 'Girasoles radiantes abrazados por rosas rosadas, mini claveles y pompones blancos sobre envoltura rosa palo. Ilumina el cuarto donde entra.',
            before: 160000, now: 125000
        },
        {
            key: 'foto60',
            name: 'Latido Fucsia',
            hook: 'Rosas fucsia, perlas y un corazón arriba. Imposible de malinterpretar.',
            desc: 'Rosas fucsia encendidas con gypsophila, eucalipto, hilo de perlas y un corazón que corona el ramo. Romántico, directo y con carácter.',
            before: 160000, now: 125000
        },
        {
            key: 'foto56',
            name: 'Girasoles de Gala',
            hook: 'Para la novia que no quiere lo de siempre. Tú eliges el color de la envoltura.',
            desc: 'Ramo cuadrado de girasoles con envoltura personalizable. Diseño contemporáneo, lleno de carácter y de luz.',
            before: 200000, now: 156250
        },
        {
            key: 'foto61',
            name: 'Susurro de Lirios',
            hook: 'Perfuma la casa entera y sigue abriendo flores durante días.',
            desc: 'Lirios rosados de pétalos abiertos con delphinium azul y eucalipto fresco. Elegancia en gran formato que dura y dura.',
            before: 232000, now: 181250
        },
        {
            key: 'foto62',
            name: 'Alas de Amor',
            hook: 'La declaración más grande que puedes enviar sin decir una palabra.',
            desc: 'Ramo XL de rosas rosadas en varios tonos, nube de gypsophila, mariposas doradas y tarjeta dedicada. El gesto que se cuenta durante años.',
            before: 272000, now: 212500
        }
    ];

    var BY_KEY = {};
    ITEMS.forEach(function (it) {
        it.off = Math.round((1 - it.now / it.before) * 100);
        it.img = BASE + 'assets/' + it.key + '.webp';
        BY_KEY[it.key] = it;
    });

    function countdownLive() { return Date.now() < END_TS; }
    function discountsLive() { return DISCOUNTS_ALWAYS_ON || countdownLive(); }

    function fmt(n) {
        return '$' + Number(n).toLocaleString('es-CO');
    }

    // Busca la promo asociada a una ruta de imagen ("assets/foto30.webp",
    // "../assets/foto30.webp", etc.)
    function find(imagePath) {
        if (!discountsLive() || !imagePath) return null;
        var m = String(imagePath).match(/(foto\d+)\.webp/);
        return m ? (BY_KEY[m[1]] || null) : null;
    }

    function waLink(it) {
        var msg = 'Hola Gi Garden, quiero aprovechar la promo del Día de la Novia:\n'
            + it.name + ' — ' + fmt(it.now) + ' (antes ' + fmt(it.before) + ', -' + it.off + '%)'
            + '\nFoto: ' + SITE + 'assets/' + it.key + '.webp';
        return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(msg);
    }

    // API pública usada por catalogo.html y landing.js
    window.PROMO_NOVIA = {
        items: ITEMS,
        find: find,
        format: fmt,
        active: discountsLive,
        countdownActive: countdownLive,
        endTs: END_TS,
        // rank: 1 si el producto está en promo (para subirlo al tope)
        rank: function (product) { return find(product && product.image) ? 1 : 0; },
        // Ordena dejando los 7 destacados arriba conservando el orden previo
        sortToTop: function (list) {
            if (!discountsLive()) return list;
            return list.sort(function (a, b) {
                return (find(b.image) ? 1 : 0) - (find(a.image) ? 1 : 0);
            });
        },
        // Cinta + etiqueta que se pone sobre la foto de la tarjeta
        ribbon: function (it) {
            if (!it) return '';
            return '<span class="pn-ribbon">-' + it.off + '%</span>'
                + '<span class="pn-tag">💗 Día de la Novia</span>';
        },
        // Bloque de precio con el valor original tachado
        priceBefore: function (it) {
            if (!it) return '';
            return '<span class="pn-before">' + fmt(it.before) + '</span>';
        },
        cardClass: function (it) { return it ? ' pn-card' : ''; }
    };

    // ---------------------------------------------------------------
    // 3. ESTILOS (se inyectan al parsear el script, antes del render)
    // ---------------------------------------------------------------
    var CSS = [
        /* ---------- Destaque de las 7 tarjetas ---------- */
        '.pn-card{position:relative;border:2px solid transparent!important;',
        'background-image:linear-gradient(#fff,#fff),linear-gradient(120deg,#E0457B,#C9A86A,#FF8FB8,#E0457B);',
        'background-origin:border-box;background-clip:padding-box,border-box;',
        'box-shadow:0 10px 30px rgba(224,69,123,.18);border-radius:16px;overflow:hidden}',
        '.pn-card::after{content:"";position:absolute;inset:0;border-radius:14px;pointer-events:none;z-index:3;',
        'box-shadow:inset 0 0 0 3px rgba(224,69,123,.25);opacity:0;animation:pnGlow 2.6s ease-in-out infinite}',
        '@keyframes pnGlow{0%,100%{opacity:0}50%{opacity:1}}',
        '.pn-ribbon{position:absolute;top:0;right:0;z-index:4;background:linear-gradient(135deg,#E0457B,#B3255A);',
        'color:#fff;font-family:Poppins,sans-serif;font-weight:700;font-size:.9rem;letter-spacing:.5px;',
        'padding:.45rem .8rem;border-bottom-left-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.22)}',
        '.pn-tag{position:absolute;bottom:.7rem;left:.7rem;z-index:4;background:rgba(255,255,255,.94);',
        'color:#B3255A;font-family:Poppins,sans-serif;font-weight:600;font-size:.72rem;letter-spacing:.3px;',
        'padding:.3rem .65rem;border-radius:50px;box-shadow:0 2px 8px rgba(0,0,0,.15);white-space:nowrap}',
        '.pn-before{display:block;font-size:.85rem;color:#9a9a9a;text-decoration:line-through;line-height:1.2}',
        '.filter-btn-novia,.filter-btn[data-filter="novia"]{background:linear-gradient(135deg,#E0457B,#B3255A)!important;',
        'color:#fff!important;border-color:#B3255A!important;font-weight:600}',
        '.filter-btn-novia:hover,.filter-btn[data-filter="novia"]:hover{filter:brightness(1.08)}',

        /* ---------- Banner con contador ---------- */
        '.pn-strip{position:relative;overflow:hidden;background:linear-gradient(115deg,#2a0716 0%,#6d1338 45%,#B3255A 100%);',
        'color:#fff;padding:1.1rem 1rem;text-align:center;font-family:Poppins,sans-serif}',
        '.pn-strip::before{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at 20% 30%,rgba(255,143,184,.35),transparent 45%),radial-gradient(circle at 80% 70%,rgba(201,168,106,.28),transparent 45%);',
        'animation:pnFloat 9s ease-in-out infinite alternate;pointer-events:none}',
        '@keyframes pnFloat{from{transform:translate3d(-2%,0,0)}to{transform:translate3d(2%,0,0)}}',
        '.pn-strip-in{position:relative;z-index:1;max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;',
        'align-items:center;justify-content:center;gap:.65rem 1.4rem}',
        '.pn-strip-txt{text-align:left}',
        '.pn-strip-kicker{font-size:.72rem;letter-spacing:2.5px;text-transform:uppercase;color:#FFC9DD;font-weight:600}',
        '.pn-strip-title{font-family:"Playfair Display",Georgia,serif;font-size:1.45rem;font-weight:700;line-height:1.2}',
        '.pn-strip-sub{font-size:.82rem;opacity:.88}',
        '.pn-clock{display:flex;gap:.4rem}',
        '.pn-unit{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:10px;',
        'min-width:52px;padding:.35rem .3rem;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}',
        '.pn-num{display:block;font-size:1.3rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}',
        '.pn-lbl{display:block;font-size:.6rem;letter-spacing:1px;text-transform:uppercase;opacity:.75;margin-top:.15rem}',
        '.pn-strip-btn{background:#fff;color:#B3255A;font-weight:700;font-size:.85rem;border:0;cursor:pointer;',
        'padding:.6rem 1.1rem;border-radius:50px;font-family:inherit;transition:transform .18s ease,box-shadow .18s ease;',
        'box-shadow:0 4px 14px rgba(0,0,0,.25)}',
        '.pn-strip-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.32)}',

        /* ---------- Flyer flotante ---------- */
        '.pn-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;',
        'padding:16px;background:rgba(20,4,12,.72);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);',
        'opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;font-family:Poppins,sans-serif}',
        '.pn-modal.on{opacity:1;visibility:visible}',
        '.pn-box{position:relative;width:100%;max-width:860px;max-height:92vh;overflow:hidden;border-radius:20px;',
        'background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.5);transform:translate3d(0,26px,0) scale(.97);',
        'transition:transform .35s cubic-bezier(.2,.8,.3,1);display:flex;flex-direction:column}',
        '.pn-modal.on .pn-box{transform:translate3d(0,0,0) scale(1)}',
        '.pn-head{background:linear-gradient(115deg,#2a0716,#6d1338 55%,#B3255A);color:#fff;padding:1rem 3rem 1rem 1.3rem;flex-shrink:0}',
        '.pn-head-kicker{font-size:.66rem;letter-spacing:2.5px;text-transform:uppercase;color:#FFC9DD;font-weight:600}',
        '.pn-head-title{font-family:"Playfair Display",Georgia,serif;font-size:1.55rem;font-weight:700;line-height:1.15;margin:.1rem 0 .25rem}',
        '.pn-head-desc{font-size:.8rem;line-height:1.45;opacity:.9;max-width:56ch}',
        '.pn-head-clock{display:flex;gap:.35rem;margin-top:.7rem;align-items:center;flex-wrap:wrap}',
        '.pn-head-clock .pn-hint{font-size:.68rem;letter-spacing:1.2px;text-transform:uppercase;opacity:.8;margin-right:.25rem}',
        '.pn-x{position:absolute;top:.6rem;right:.7rem;z-index:6;width:34px;height:34px;border-radius:50%;border:0;',
        'cursor:pointer;background:rgba(255,255,255,.18);color:#fff;font-size:1.35rem;line-height:1;',
        'display:flex;align-items:center;justify-content:center;transition:background .2s ease,transform .2s ease}',
        '.pn-x:hover{background:rgba(255,255,255,.34);transform:rotate(90deg)}',
        '.pn-body{position:relative;overflow:hidden;flex:1;min-height:0}',
        '.pn-track{display:flex;height:100%;transition:transform .45s cubic-bezier(.25,.8,.3,1);will-change:transform}',
        '.pn-slide{flex:0 0 100%;display:flex;gap:0;min-width:0}',
        '.pn-figure{flex:0 0 46%;position:relative;background:#faf6f2;overflow:hidden}',
        '.pn-figure img{width:100%;height:100%;object-fit:cover;display:block}',
        '.pn-off{position:absolute;top:0;left:0;background:linear-gradient(135deg,#E0457B,#B3255A);color:#fff;',
        'font-weight:700;font-size:.95rem;padding:.45rem .8rem;border-bottom-right-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.25)}',
        '.pn-txt{flex:1 1 auto;padding:1.2rem 1.3rem;display:flex;flex-direction:column;justify-content:center;gap:.5rem;min-width:0}',
        '.pn-name{font-family:"Playfair Display",Georgia,serif;font-size:1.5rem;color:#1a1a1a;line-height:1.15;font-weight:700}',
        '.pn-hook{font-size:.92rem;color:#B3255A;font-weight:600;line-height:1.4}',
        '.pn-desc{font-size:.82rem;color:#5c5c5c;line-height:1.55}',
        '.pn-prices{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;margin-top:.15rem}',
        '.pn-old{font-size:.95rem;color:#9a9a9a;text-decoration:line-through}',
        '.pn-new{font-size:1.65rem;font-weight:700;color:#B3255A;font-family:"Playfair Display",Georgia,serif}',
        '.pn-cta{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:#25D366;color:#fff;',
        'font-weight:600;font-size:.9rem;padding:.7rem 1.1rem;border-radius:50px;margin-top:.3rem;align-self:flex-start;',
        'transition:transform .18s ease,box-shadow .18s ease;box-shadow:0 4px 14px rgba(37,211,102,.35);text-decoration:none}',
        '.pn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(37,211,102,.45)}',
        '.pn-cta svg{width:17px;height:17px;fill:currentColor;flex-shrink:0}',
        '.pn-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:5;width:38px;height:38px;border-radius:50%;',
        'border:0;cursor:pointer;background:rgba(255,255,255,.92);color:#B3255A;font-size:1.3rem;line-height:1;',
        'display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.22);transition:transform .2s ease}',
        '.pn-arrow:hover{transform:translateY(-50%) scale(1.1)}',
        '.pn-prev{left:10px}.pn-next{right:10px}',
        '.pn-foot{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:.8rem;',
        'padding:.7rem 1.1rem;background:#faf6f2;border-top:1px solid rgba(0,0,0,.06)}',
        '.pn-dots{display:flex;gap:.38rem}',
        '.pn-dot{width:8px;height:8px;border-radius:50%;border:0;padding:0;cursor:pointer;background:#e0cdd6;',
        'transition:transform .2s ease,background .2s ease}',
        '.pn-dot.on{background:#B3255A;transform:scale(1.45)}',
        '.pn-all{background:linear-gradient(135deg,#E0457B,#B3255A);color:#fff;border:0;cursor:pointer;font-family:inherit;',
        'font-weight:600;font-size:.8rem;padding:.55rem 1rem;border-radius:50px;transition:transform .18s ease}',
        '.pn-all:hover{transform:translateY(-2px)}',

        /* ---------- Responsive ---------- */
        '@media(max-width:720px){',
        '.pn-slide{flex-direction:column}',
        '.pn-figure{flex:0 0 auto;height:190px}',
        '.pn-body{overflow-y:auto;-webkit-overflow-scrolling:touch}',
        '.pn-head{padding:.85rem 2.8rem .85rem 1rem}',
        '.pn-head-title{font-size:1.25rem}.pn-head-desc{font-size:.74rem}',
        '.pn-name{font-size:1.25rem}.pn-new{font-size:1.4rem}',
        '.pn-txt{padding:1rem}',
        '.pn-arrow{width:32px;height:32px;top:95px}',
        '.pn-strip-in{flex-direction:column;gap:.55rem}',
        '.pn-strip-txt{text-align:center}',
        '.pn-strip-title{font-size:1.15rem}',
        '.pn-unit{min-width:46px}.pn-num{font-size:1.1rem}',
        '.pn-ribbon{font-size:.78rem;padding:.35rem .6rem}',
        '.pn-tag{font-size:.65rem}',
        '}',
        '@media(prefers-reduced-motion:reduce){',
        '.pn-card::after,.pn-strip::before{animation:none}',
        '.pn-track,.pn-box{transition:none}',
        '}'
    ].join('');

    (function injectCSS() {
        var s = document.createElement('style');
        s.id = 'pn-styles';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    })();

    // ---------------------------------------------------------------
    // 4. UTILIDADES DE TIEMPO
    // ---------------------------------------------------------------
    function remaining() {
        var ms = END_TS - Date.now();
        if (ms < 0) ms = 0;
        var s = Math.floor(ms / 1000);
        return {
            ms: ms,
            d: Math.floor(s / 86400),
            h: Math.floor((s % 86400) / 3600),
            m: Math.floor((s % 3600) / 60),
            s: s % 60
        };
    }
    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function clockHTML(prefix) {
        return ['d', 'h', 'm', 's'].map(function (u, i) {
            var lbl = ['Días', 'Horas', 'Min', 'Seg'][i];
            return '<div class="pn-unit"><span class="pn-num" id="' + prefix + '-' + u + '">--</span>'
                + '<span class="pn-lbl">' + lbl + '</span></div>';
        }).join('');
    }

    var clockTargets = [];
    var clockTimer = null;

    function tick() {
        var r = remaining();
        clockTargets.forEach(function (t) {
            if (t.d) t.d.textContent = pad(r.d);
            if (t.h) t.h.textContent = pad(r.h);
            if (t.m) t.m.textContent = pad(r.m);
            if (t.s) t.s.textContent = pad(r.s);
        });
        if (r.ms <= 0) {
            clearInterval(clockTimer);
            // Se acabó: quitamos contador y flyer, los descuentos siguen.
            var strip = document.getElementById('pn-strip');
            if (strip) strip.remove();
            var modal = document.getElementById('pn-modal');
            if (modal) modal.remove();
        }
    }

    function startClock() {
        if (clockTimer) return;
        tick();
        clockTimer = setInterval(tick, 1000);
    }

    function registerClock(prefix) {
        clockTargets.push({
            d: document.getElementById(prefix + '-d'),
            h: document.getElementById(prefix + '-h'),
            m: document.getElementById(prefix + '-m'),
            s: document.getElementById(prefix + '-s')
        });
    }

    // ---------------------------------------------------------------
    // 5. BANNER CON CONTADOR
    // ---------------------------------------------------------------
    function buildStrip() {
        if (!countdownLive() || document.getElementById('pn-strip')) return;

        var anchor = document.querySelector('.catalog-hero') || document.querySelector('.hero');
        var strip = document.createElement('section');
        strip.id = 'pn-strip';
        strip.className = 'pn-strip';
        strip.innerHTML =
            '<div class="pn-strip-in">'
            + '<div class="pn-strip-txt">'
            + '<div class="pn-strip-kicker">1 de agosto</div>'
            + '<div class="pn-strip-title">Colección Ella · Día de la Novia</div>'
            + '<div class="pn-strip-sub">7 arreglos con hasta 22% de descuento — solo hasta que el reloj llegue a cero</div>'
            + '</div>'
            + '<div class="pn-clock">' + clockHTML('pns') + '</div>'
            + '<button type="button" class="pn-strip-btn" id="pn-strip-btn">Ver los 7 arreglos</button>'
            + '</div>';

        if (anchor && anchor.parentNode) {
            anchor.parentNode.insertBefore(strip, anchor.nextSibling);
        } else {
            var grid = document.getElementById('products-grid') || document.querySelector('.products-container');
            var host = grid ? (grid.closest('section') || grid.parentNode) : document.body;
            host.parentNode.insertBefore(strip, host);
        }

        registerClock('pns');
        document.getElementById('pn-strip-btn').addEventListener('click', scrollToFirst);
    }

    function scrollToFirst() {
        var el = document.querySelector('.pn-card');
        var target = el || document.getElementById('products-grid') || document.querySelector('.products-container');
        if (target) {
            var y = target.getBoundingClientRect().top + window.pageYOffset - 110;
            window.scrollTo({ top: y < 0 ? 0 : y, behavior: 'smooth' });
        }
    }

    // ---------------------------------------------------------------
    // 6. FLYER FLOTANTE CON CARRUSEL
    // ---------------------------------------------------------------
    var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>';

    var car = { i: 0, timer: null, n: ITEMS.length };

    function buildFlyer() {
        if (!countdownLive()) return;
        try {
            if (sessionStorage.getItem('pn-flyer-seen') === '1') return;
        } catch (e) { /* sessionStorage bloqueado: se muestra igual */ }

        var slides = ITEMS.map(function (it, i) {
            var src = i === 0 ? ' src="' + it.img + '"' : '';
            return '<div class="pn-slide">'
                + '<div class="pn-figure">'
                + '<span class="pn-off">-' + it.off + '%</span>'
                + '<img alt="' + it.name + ' — Día de la Novia, flores a domicilio en Bogotá"'
                + ' data-src="' + it.img + '"' + src + ' decoding="async" fetchpriority="' + (i === 0 ? 'high' : 'low') + '">'
                + '</div>'
                + '<div class="pn-txt">'
                + '<div class="pn-name">' + it.name + '</div>'
                + '<div class="pn-hook">' + it.hook + '</div>'
                + '<div class="pn-desc">' + it.desc + '</div>'
                + '<div class="pn-prices"><span class="pn-old">' + fmt(it.before) + '</span>'
                + '<span class="pn-new">' + fmt(it.now) + '</span></div>'
                + '<a class="pn-cta" href="' + waLink(it) + '" target="_blank" rel="noopener">'
                + WA_SVG + 'Lo quiero para el 1 de agosto</a>'
                + '</div>'
                + '</div>';
        }).join('');

        var dots = ITEMS.map(function (it, i) {
            return '<button type="button" class="pn-dot' + (i === 0 ? ' on' : '') + '" data-i="' + i
                + '" aria-label="Ver ' + it.name + '"></button>';
        }).join('');

        var modal = document.createElement('div');
        modal.id = 'pn-modal';
        modal.className = 'pn-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Promoción Día de la Novia');
        modal.innerHTML =
            '<div class="pn-box">'
            + '<button type="button" class="pn-x" id="pn-x" aria-label="Cerrar">&times;</button>'
            + '<div class="pn-head">'
            + '<div class="pn-head-kicker">1 de agosto · Día de la Novia</div>'
            + '<div class="pn-head-title">Colección Ella</div>'
            + '<div class="pn-head-desc">Siete arreglos escogidos uno por uno para el día de ella. '
            + 'Hasta <strong>22% menos</strong>, solo hasta que el reloj llegue a cero. '
            + 'Ella lo va a recordar; tú solo tienes que elegir cuál.</div>'
            + '<div class="pn-head-clock"><span class="pn-hint">Termina en</span>' + clockHTML('pnm') + '</div>'
            + '</div>'
            + '<div class="pn-body">'
            + '<div class="pn-track" id="pn-track">' + slides + '</div>'
            + '<button type="button" class="pn-arrow pn-prev" id="pn-prev" aria-label="Anterior">&#10094;</button>'
            + '<button type="button" class="pn-arrow pn-next" id="pn-next" aria-label="Siguiente">&#10095;</button>'
            + '</div>'
            + '<div class="pn-foot">'
            + '<div class="pn-dots" id="pn-dots">' + dots + '</div>'
            + '<button type="button" class="pn-all" id="pn-all">Ver los 7 en el catálogo</button>'
            + '</div>'
            + '</div>';

        document.body.appendChild(modal);
        registerClock('pnm');

        var track = document.getElementById('pn-track');
        var dotEls = Array.prototype.slice.call(document.querySelectorAll('#pn-dots .pn-dot'));
        var imgs = Array.prototype.slice.call(track.querySelectorAll('img'));

        function loadNear(i) {
            [i, i + 1, i - 1].forEach(function (k) {
                var idx = (k + car.n) % car.n;
                var img = imgs[idx];
                if (img && !img.getAttribute('src')) {
                    img.setAttribute('src', img.getAttribute('data-src'));
                }
            });
        }

        function go(i, user) {
            car.i = (i + car.n) % car.n;
            track.style.transform = 'translate3d(-' + (car.i * 100) + '%,0,0)';
            dotEls.forEach(function (d, k) { d.classList.toggle('on', k === car.i); });
            loadNear(car.i);
            if (user) restart();
        }

        function auto() { go(car.i + 1); }
        function stop() { if (car.timer) { clearInterval(car.timer); car.timer = null; } }
        function restart() { stop(); car.timer = setInterval(auto, 4200); }

        document.getElementById('pn-next').addEventListener('click', function () { go(car.i + 1, true); });
        document.getElementById('pn-prev').addEventListener('click', function () { go(car.i - 1, true); });
        dotEls.forEach(function (d) {
            d.addEventListener('click', function () { go(parseInt(d.dataset.i, 10), true); });
        });

        // Swipe en móvil
        var x0 = null;
        track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 45) go(car.i + (dx < 0 ? 1 : -1), true); else restart();
            x0 = null;
        }, { passive: true });

        // Pausa al pasar el mouse y cuando la pestaña no está visible
        var box = modal.querySelector('.pn-box');
        box.addEventListener('mouseenter', stop);
        box.addEventListener('mouseleave', function () { if (modal.classList.contains('on')) restart(); });
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else if (modal.classList.contains('on')) restart();
        });

        function close() {
            modal.classList.remove('on');
            stop();
            document.body.style.overflow = '';
            try { sessionStorage.setItem('pn-flyer-seen', '1'); } catch (e) { }
            setTimeout(function () { if (modal.parentNode) modal.remove(); }, 350);
            document.removeEventListener('keydown', onKey);
        }
        function onKey(e) {
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') go(car.i + 1, true);
            else if (e.key === 'ArrowLeft') go(car.i - 1, true);
        }

        document.getElementById('pn-x').addEventListener('click', close);
        modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
        document.getElementById('pn-all').addEventListener('click', function () {
            close();
            setTimeout(scrollToFirst, 260);
        });

        function open() {
            modal.classList.add('on');
            document.body.style.overflow = 'hidden';
            loadNear(0);
            restart();
            document.addEventListener('keydown', onKey);
        }

        // Aparece a los 1.8 s, cuando la página ya cargó lo importante
        setTimeout(open, 1800);
    }

    // ---------------------------------------------------------------
    // 7. ARRANQUE
    // ---------------------------------------------------------------
    function boot() {
        if (countdownLive()) {
            buildStrip();
            buildFlyer();
            startClock();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
