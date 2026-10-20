/* =====================================================================
   TEMPORADA DE SEPTIEMBRE — Gi Garden Bogotá
   ---------------------------------------------------------------------
   (El archivo conserva el nombre promo-semana.js para no tener que tocar
   las etiquetas <script> de las páginas.)

   Dos campañas con fecha de cierre automática (hora de Bogotá):
     1. 💝 OFERTA DE AMOR Y AMISTAD  → hasta el sábado 19 de septiembre, 11:59 p.m.
     2. 🌻 FLORES AMARILLAS          → hasta el lunes 21 de septiembre, 11:59 p.m.
        (Amor y Amistad + el 21 de septiembre, día de regalar flores amarillas)

   Incluye:
     · Flyer flotante con carrusel y pestañas (Amor y Amistad / Flores Amarillas)
     · Banner con contador regresivo hasta el 19 de septiembre
     · Vitrina "Flores Amarillas" con los arreglos amarillos destacados
     · Cintas y bordes de destaque en las tarjetas del catálogo
   Cuando pasa cada fecha, esa campaña se apaga sola (cintas, banner,
   flyer y botón de filtro) y los productos quedan como normales.
   ---------------------------------------------------------------------
   CÓMO CAMBIAR LOS ARREGLOS: editar AMOR_ITEMS o YELLOW_ITEMS (sección 2).
   CÓMO CAMBIAR LAS FECHAS:  editar AMOR_END / YELLOW_END (sección 1).
   Los PRECIOS se toman del catálogo (catalogo.html y js/landing.js).
   ===================================================================== */
(function () {
    'use strict';

    // ---------------------------------------------------------------
    // 1. CONFIGURACIÓN
    // ---------------------------------------------------------------
    var WA_PHONE = '573145957395';
    var SITE = 'https://bogotafloristeria.dondeseria.com/';

    // Bogotá es UTC-5 todo el año. Fechas en UTC equivalentes a 11:59:59 p.m. Bogotá.
    var AMOR_END   = Date.UTC(2026, 8, 20, 4, 59, 59);  // sáb 19 sep 2026, 11:59 p.m. Bogotá
    var YELLOW_END = Date.UTC(2026, 8, 22, 4, 59, 59);  // lun 21 sep 2026, 11:59 p.m. Bogotá

    // Base de rutas (funciona igual en la raíz y dentro de /landing/)
    var thisScript = document.currentScript;
    var BASE = (function () {
        if (thisScript && thisScript.src) {
            return thisScript.src.replace(/js\/promo-semana\.js.*$/, '');
        }
        return /\/landing\//.test(location.pathname) ? '../' : '';
    })();

    // ---------------------------------------------------------------
    // 2. ARREGLOS DE CADA CAMPAÑA
    // ---------------------------------------------------------------
    var AMOR_ITEMS = [
        { key: 'foto38', name: 'Ternura Rosada', price: 112500,
          hook: 'El detalle perfecto para esa amistad que siempre está.',
          desc: 'Rosas rosadas con nube de gypsophila y envoltura delicada. Pequeño en tamaño, enorme en intención.' },
        { key: 'foto30', name: 'Suspiro Rosado', price: 131250,
          hook: 'Rosas que llegan con mariposa incluida. El mensaje se entiende solo.',
          desc: 'Ramo de rosas rosadas rematado con una mariposa decorativa. Delicadeza que se roba la mirada apenas abre la puerta.' },
        { key: 'foto59', name: 'Sol de tu Sonrisa', price: 143750,
          hook: 'Girasoles y rosas en el mismo ramo: amor y amistad sin tener que elegir.',
          desc: 'Girasoles radiantes abrazados por rosas rosadas, mini claveles y pompones blancos sobre envoltura rosa palo.' },
        { key: 'foto60', name: 'Latido Fucsia', price: 143750,
          hook: 'Rosas fucsia, perlas y un corazón arriba. Imposible de malinterpretar.',
          desc: 'Rosas fucsia encendidas con gypsophila, eucalipto, hilo de perlas y un corazón que corona el ramo.' },
        { key: 'foto50', name: 'Girasol Imperial', price: 162500,
          hook: 'Un solo girasol, todo el protagonismo. Elegante y diferente.',
          desc: 'Imponente girasol enmarcado en envoltura negra y dorada. Minimalismo con carácter para sorprender.' },
        { key: 'foto41', name: 'Rosas de Primavera', price: 175000,
          hook: 'Rosas rosadas y blancas: el clásico que nunca falla en septiembre.',
          desc: 'Fresco ramo de rosas rosadas y blancas que evoca la primavera. Delicadeza y elegancia en cada tallo.' },
        { key: 'foto61', name: 'Susurro de Lirios', price: 193750,
          hook: 'Perfuma la casa entera y sigue abriendo flores durante días.',
          desc: 'Lirios rosados de pétalos abiertos con delphinium azul y eucalipto fresco. Elegancia en gran formato.' },
        { key: 'foto45', name: 'Caja Romántica de Chocolates', price: 218750,
          hook: 'Rosas rojas y chocolates: el combo más pedido en Amor y Amistad.',
          desc: 'Caja alargada con rosas rojas y finos chocolates. La combinación perfecta de amor y dulzura.' },
        { key: 'foto44', name: 'Tulipanes Encantados', price: 247000, before: 300000,
          hook: 'Tulipanes con descuento real: antes $300.000, ahora $247.000.',
          desc: 'Elegante ramo de tulipanes rosados realzado con gypsophila. Flor de importación, temporada corta: solo mientras dure la oferta.' }
    ];

    var YELLOW_ITEMS = [
        { key: 'foto69', name: 'Perlas de Sol', price: 125000,
          hook: 'Rosas amarillas con encaje de perlas: luz pura en un ramo.',
          desc: 'Rosas amarillas con nube de gypsophila, encaje de perlas y envoltura con borde amarillo.' },
        { key: 'foto70', name: 'Abrazo de Sol', price: 137500,
          hook: 'Un girasol al centro y un día soleado alrededor.',
          desc: 'Girasol rodeado de rosas amarillas, crisantemos amarillos y margaritas blancas con follaje fresco.' },
        { key: 'foto71', name: 'Jardín Dorado', price: 168750,
          hook: 'Más volumen, más color y un toque silvestre que enamora.',
          desc: 'Girasol central con rosas amarillas, margaritas blancas, solidago y eucalipto sobre envoltura amarilla.' },
        { key: 'foto56', name: 'Girasoles de Gala', price: 193750,
          hook: 'El ramo de girasoles más elegante. Tú eliges el color de la envoltura.',
          desc: 'Ramo cuadrado de girasoles con envoltura personalizable. Diseño contemporáneo, lleno de carácter y de luz.' }
    ];

    function fmt(n) { return '$' + Number(n).toLocaleString('es-CO'); }
    function offPct(it) {
        if (!it || !it.before || it.before <= it.price) return 0;
        return Math.round((1 - it.price / it.before) * 100);
    }

    var CAMPAIGNS = {
        amor: {
            id: 'amor', end: AMOR_END, items: AMOR_ITEMS,
            tab: '💝 Amor y Amistad',
            kicker: 'Hasta el sábado 19 de septiembre',
            title: 'Oferta de Amor y Amistad',
            desc: 'Nueve arreglos escogidos para celebrar con tu pareja, tus amigos o esa persona que te alegra los días. '
                + 'La oferta termina el <strong>19 de septiembre a medianoche</strong>.',
            cta: 'Lo quiero para Amor y Amistad',
            tag: '💝 Amor y Amistad', ribbon: 'Oferta', label: 'Amor y Amistad',
            waIntro: 'Hola Gi Garden, quiero aprovechar la Oferta de Amor y Amistad:'
        },
        yellow: {
            id: 'yellow', end: YELLOW_END, items: YELLOW_ITEMS,
            tab: '🌻 Flores Amarillas',
            kicker: 'Amor y Amistad · 21 de septiembre',
            title: 'Flores Amarillas',
            desc: 'Los mejores arreglos amarillos para esta temporada: rosas, girasoles y margaritas que dicen '
                + '“me alegras la vida”. Ideales para Amor y Amistad y para el <strong>21 de septiembre</strong>.',
            cta: 'Quiero flores amarillas',
            tag: '🌻 Flores Amarillas', ribbon: '🌻', label: 'Flores Amarillas',
            waIntro: 'Hola Gi Garden, quiero estas flores amarillas:'
        }
    };

    Object.keys(CAMPAIGNS).forEach(function (k) {
        CAMPAIGNS[k].items.forEach(function (it) {
            it.camp = CAMPAIGNS[k];
            it.img = BASE + 'assets/' + it.key + '.webp';
            it.label = CAMPAIGNS[k].label;
        });
    });

    function isLive(c) { return Date.now() < c.end; }
    function liveCampaigns() {
        return ['amor', 'yellow'].map(function (k) { return CAMPAIGNS[k]; }).filter(isLive);
    }

    // Índice por foto (Amor y Amistad tiene prioridad si una foto está en ambas)
    function lookup(key) {
        if (isLive(CAMPAIGNS.amor)) {
            for (var i = 0; i < AMOR_ITEMS.length; i++) if (AMOR_ITEMS[i].key === key) return AMOR_ITEMS[i];
        }
        if (isLive(CAMPAIGNS.yellow)) {
            for (var j = 0; j < YELLOW_ITEMS.length; j++) if (YELLOW_ITEMS[j].key === key) return YELLOW_ITEMS[j];
        }
        return null;
    }

    function find(imagePath) {
        if (!imagePath) return null;
        var m = String(imagePath).match(/(foto\d+)\.webp/);
        return m ? lookup(m[1]) : null;
    }

    function rankOf(product) {
        var it = find(product && product.image);
        if (!it) return 0;
        return it.camp.id === 'amor' ? 2 : 1;
    }

    function waLink(it) {
        var msg = it.camp.waIntro + '\n' + it.name + ' — ' + fmt(it.price)
            + (it.before ? ' (antes ' + fmt(it.before) + ')' : '')
            + '\nFoto: ' + SITE + 'assets/' + it.key + '.webp';
        return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(msg);
    }

    // API pública usada por catalogo.html y landing.js
    window.PROMO_SEMANA = {
        campaigns: CAMPAIGNS,
        find: find,
        format: fmt,
        active: function () { return liveCampaigns().length > 0; },
        rank: rankOf,
        // Sube al tope: primero Amor y Amistad, luego Flores Amarillas (conserva el orden por precio)
        sortToTop: function (list) {
            if (!liveCampaigns().length) return list;
            return list.sort(function (a, b) { return rankOf(b) - rankOf(a); });
        },
        ribbon: function (it) {
            if (!it) return '';
            var y = it.camp.id === 'yellow' ? ' pn-y' : '';
            return '<span class="pn-ribbon' + y + '">' + it.camp.ribbon + '</span>'
                + '<span class="pn-tag' + y + '">' + it.camp.tag + '</span>';
        },
        priceBefore: function (it) {
            return (it && it.before) ? '<span class="pn-old">' + fmt(it.before) + '</span> ' : '';
        },
        cardClass: function (it) { return it ? (it.camp.id === 'yellow' ? ' pn-card pn-card-y' : ' pn-card') : ''; }
    };


    // ---------------------------------------------------------------
    // 3. ESTILOS
    // ---------------------------------------------------------------
    var CSS = [
        /* ---------- Destaque de tarjetas ---------- */
        '.pn-card{position:relative;border:2px solid transparent!important;',
        'background-image:linear-gradient(#fff,#fff),linear-gradient(120deg,#E0457B,#C9A86A,#FF8FB8,#E0457B);',
        'background-origin:border-box;background-clip:padding-box,border-box;',
        'box-shadow:0 10px 30px rgba(224,69,123,.18);border-radius:16px;overflow:hidden}',
        '.pn-card-y{background-image:linear-gradient(#fff,#fff),linear-gradient(120deg,#F5B700,#FFE27A,#E89B00,#F5B700);',
        'box-shadow:0 10px 30px rgba(232,155,0,.2)}',
        '.pn-ribbon{position:absolute;top:0;right:0;z-index:4;background:linear-gradient(135deg,#E0457B,#B3255A);',
        'color:#fff;font-family:Poppins,sans-serif;font-weight:700;font-size:.85rem;letter-spacing:.5px;',
        'padding:.45rem .8rem;border-bottom-left-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.22)}',
        '.pn-ribbon.pn-y{background:linear-gradient(135deg,#FFD23F,#E89B00);font-size:1rem;padding:.35rem .7rem}',
        '.pn-tag{position:absolute;bottom:.7rem;left:.7rem;z-index:4;background:rgba(255,255,255,.94);',
        'color:#B3255A;font-family:Poppins,sans-serif;font-weight:600;font-size:.72rem;letter-spacing:.3px;',
        'padding:.3rem .65rem;border-radius:50px;box-shadow:0 2px 8px rgba(0,0,0,.15);white-space:nowrap}',
        '.pn-tag.pn-y{color:#8a5a00}',
        '.filter-btn-amor,.filter-btn[data-filter="amoramistad"]{background:linear-gradient(135deg,#E0457B,#B3255A)!important;',
        'color:#fff!important;border-color:#B3255A!important;font-weight:600}',
        '.filter-btn-amarillas,.filter-btn[data-filter="amarillas"]{background:linear-gradient(135deg,#FFD23F,#E89B00)!important;',
        'color:#3b2600!important;border-color:#E89B00!important;font-weight:600}',
        '.filter-btn-amor:hover,.filter-btn-amarillas:hover{filter:brightness(1.06)}',

        /* ---------- Banner Amor y Amistad con contador ---------- */
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
        'min-width:52px;padding:.35rem .3rem}',
        '.pn-num{display:block;font-size:1.3rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}',
        '.pn-lbl{display:block;font-size:.6rem;letter-spacing:1px;text-transform:uppercase;opacity:.75;margin-top:.15rem}',
        '.pn-strip-btn{background:#fff;color:#B3255A;font-weight:700;font-size:.85rem;border:0;cursor:pointer;',
        'padding:.6rem 1.1rem;border-radius:50px;font-family:inherit;transition:transform .18s ease,box-shadow .18s ease;',
        'box-shadow:0 4px 14px rgba(0,0,0,.25)}',
        '.pn-strip-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.32)}',

        /* ---------- Vitrina Flores Amarillas ---------- */
        '.yf-show{position:relative;overflow:hidden;background:linear-gradient(160deg,#FFF8DC 0%,#FFEFB0 55%,#FFE08A 100%);',
        'padding:2rem 1rem 2.2rem;font-family:Poppins,sans-serif;color:#3b2600}',
        '.yf-show::before{content:"";position:absolute;width:420px;height:420px;right:-140px;top:-160px;border-radius:50%;',
        'background:radial-gradient(circle,rgba(255,210,63,.55),transparent 65%);pointer-events:none}',
        '.yf-in{position:relative;max-width:1100px;margin:0 auto}',
        '.yf-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:.8rem 1.5rem;margin-bottom:1.2rem}',
        '.yf-kicker{font-size:.72rem;letter-spacing:2.5px;text-transform:uppercase;color:#B77800;font-weight:700}',
        '.yf-title{font-family:"Playfair Display",Georgia,serif;font-size:1.9rem;font-weight:700;line-height:1.15;margin:.15rem 0 .35rem;color:#2b1c00}',
        '.yf-sub{font-size:.88rem;line-height:1.55;max-width:60ch;color:#5a4410}',
        '.yf-all{background:#2b1c00;color:#FFD23F;border:0;cursor:pointer;font-family:inherit;font-weight:600;font-size:.85rem;',
        'padding:.65rem 1.2rem;border-radius:50px;white-space:nowrap;transition:transform .18s ease}',
        '.yf-all:hover{transform:translateY(-2px)}',
        '.yf-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}',
        '.yf-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(183,120,0,.16);',
        'display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease}',
        '.yf-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(183,120,0,.24)}',
        '.yf-img{position:relative;aspect-ratio:1/1;background:#fff6d6;overflow:hidden}',
        '.yf-img img{width:100%;height:100%;object-fit:cover;display:block}',
        '.yf-body{padding:.85rem .9rem 1rem;display:flex;flex-direction:column;gap:.35rem;flex:1}',
        '.yf-name{font-family:"Playfair Display",Georgia,serif;font-size:1.1rem;font-weight:700;color:#2b1c00;line-height:1.2}',
        '.yf-hook{font-size:.78rem;color:#6b5418;line-height:1.45;flex:1}',
        '.yf-row{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:.3rem}',
        '.yf-price{font-family:"Playfair Display",Georgia,serif;font-size:1.2rem;font-weight:700;color:#B77800}',
        '.yf-btn{display:inline-flex;align-items:center;gap:.35rem;background:#25D366;color:#fff;text-decoration:none;',
        'font-weight:600;font-size:.76rem;padding:.5rem .8rem;border-radius:50px;white-space:nowrap}',
        '.yf-btn svg{width:14px;height:14px;fill:currentColor}',

        /* ---------- Flyer flotante ---------- */
        '.pn-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;',
        'padding:16px;background:rgba(20,4,12,.72);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);',
        'opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;font-family:Poppins,sans-serif}',
        '.pn-modal.on{opacity:1;visibility:visible}',
        '.pn-box{position:relative;width:100%;max-width:860px;max-height:92vh;overflow:hidden;border-radius:20px;',
        'background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.5);transform:translate3d(0,26px,0) scale(.97);',
        'transition:transform .35s cubic-bezier(.2,.8,.3,1);display:flex;flex-direction:column}',
        '.pn-modal.on .pn-box{transform:translate3d(0,0,0) scale(1)}',
        '.pn-head{background:linear-gradient(115deg,#2a0716,#6d1338 55%,#B3255A);color:#fff;padding:1rem 3rem 1rem 1.3rem;flex-shrink:0;transition:background .3s ease}',
        '.pn-box.y .pn-head{background:linear-gradient(115deg,#6b4200,#B77800 50%,#F5B700);}',
        '.pn-head-kicker{font-size:.66rem;letter-spacing:2.5px;text-transform:uppercase;color:#FFC9DD;font-weight:600}',
        '.pn-box.y .pn-head-kicker{color:#FFF1B8}',
        '.pn-head-title{font-family:"Playfair Display",Georgia,serif;font-size:1.55rem;font-weight:700;line-height:1.15;margin:.1rem 0 .25rem}',
        '.pn-head-desc{font-size:.8rem;line-height:1.45;opacity:.92;max-width:60ch}',
        '.pn-head-clock{display:flex;gap:.35rem;margin-top:.7rem;align-items:center;flex-wrap:wrap}',
        '.pn-head-clock .pn-hint{font-size:.68rem;letter-spacing:1.2px;text-transform:uppercase;opacity:.8;margin-right:.25rem}',
        '.pn-tabs{display:flex;gap:.4rem;margin-top:.8rem;flex-wrap:wrap}',
        '.pn-tabbtn{border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.1);color:#fff;cursor:pointer;',
        'font-family:inherit;font-weight:600;font-size:.78rem;padding:.4rem .85rem;border-radius:50px;transition:background .2s ease}',
        '.pn-tabbtn.on{background:#fff;color:#B3255A}',
        '.pn-box.y .pn-tabbtn.on{color:#8a5a00}',
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
        'font-weight:700;font-size:.8rem;padding:.45rem .8rem;border-bottom-right-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.25)}',
        '.pn-box.y .pn-off{background:linear-gradient(135deg,#FFD23F,#E89B00);color:#3b2600}',
        '.pn-txt{flex:1 1 auto;padding:1.2rem 1.3rem;display:flex;flex-direction:column;justify-content:center;gap:.5rem;min-width:0}',
        '.pn-name{font-family:"Playfair Display",Georgia,serif;font-size:1.5rem;color:#1a1a1a;line-height:1.15;font-weight:700}',
        '.pn-hook{font-size:.92rem;color:#B3255A;font-weight:600;line-height:1.4}',
        '.pn-box.y .pn-hook{color:#9a6400}',
        '.pn-desc{font-size:.82rem;color:#5c5c5c;line-height:1.55}',
        '.pn-prices{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;margin-top:.15rem}',
        '.pn-new{font-size:1.65rem;font-weight:700;color:#B3255A;font-family:"Playfair Display",Georgia,serif}',
        '.pn-old{color:#9b9b9b;text-decoration:line-through;font-weight:600;font-size:.95rem;margin-right:.35rem}',
        '.pn-save{background:#E0457B;color:#fff;font-weight:700;font-size:.75rem;padding:.2rem .55rem;border-radius:50px;letter-spacing:.3px}',
        '.pn-box.y .pn-new{color:#B77800}',
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
        '.pn-dots{display:flex;gap:.38rem;flex-wrap:wrap}',
        '.pn-dot{width:8px;height:8px;border-radius:50%;border:0;padding:0;cursor:pointer;background:#e0cdd6;',
        'transition:transform .2s ease,background .2s ease}',
        '.pn-dot.on{background:#B3255A;transform:scale(1.45)}',
        '.pn-box.y .pn-dot{background:#f1dfa6}.pn-box.y .pn-dot.on{background:#E89B00}',
        '.pn-all{background:linear-gradient(135deg,#E0457B,#B3255A);color:#fff;border:0;cursor:pointer;font-family:inherit;',
        'font-weight:600;font-size:.8rem;padding:.55rem 1rem;border-radius:50px;transition:transform .18s ease}',
        '.pn-box.y .pn-all{background:linear-gradient(135deg,#FFD23F,#E89B00);color:#3b2600}',
        '.pn-all:hover{transform:translateY(-2px)}',

        /* ---------- Responsive ---------- */
        '@media(max-width:900px){.yf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}',
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
        '.pn-ribbon{font-size:.75rem;padding:.35rem .6rem}',
        '.pn-tag{font-size:.65rem}',
        '.yf-show{padding:1.5rem 0 1.7rem}',
        '.yf-head{padding:0 1rem}',
        '.yf-title{font-size:1.45rem}',
        '.yf-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:.8rem;padding:0 1rem .4rem;-webkit-overflow-scrolling:touch}',
        '.yf-card{flex:0 0 72%;scroll-snap-align:start}',
        '}',
        '@media(prefers-reduced-motion:reduce){',
        '.pn-strip::before{animation:none}',
        '.pn-track,.pn-box,.yf-card{transition:none}',
        '}'
    ].join('');

    (function injectCSS() {
        var s = document.createElement('style');
        s.id = 'pn-styles';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    })();

    // ---------------------------------------------------------------
    // 4. CONTADOR
    // ---------------------------------------------------------------
    function remaining(end) {
        var ms = end - Date.now();
        if (ms < 0) ms = 0;
        var s = Math.floor(ms / 1000);
        return { ms: ms, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
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
        clockTargets.forEach(function (t) {
            var r = remaining(t.end());
            if (t.d) t.d.textContent = pad(r.d);
            if (t.h) t.h.textContent = pad(r.h);
            if (t.m) t.m.textContent = pad(r.m);
            if (t.s) t.s.textContent = pad(r.s);
        });
        // Al llegar a cero, la campaña se apaga sola
        var strip = document.getElementById('pn-strip');
        if (strip && !isLive(CAMPAIGNS.amor)) { strip.remove(); hideFilter('amoramistad'); }
        var show = document.getElementById('yf-show');
        if (show && !isLive(CAMPAIGNS.yellow)) { show.remove(); hideFilter('amarillas'); }
    }

    function startClock() {
        if (clockTimer) return;
        tick();
        clockTimer = setInterval(tick, 1000);
    }

    function registerClock(prefix, endFn) {
        clockTargets.push({
            end: endFn,
            d: document.getElementById(prefix + '-d'),
            h: document.getElementById(prefix + '-h'),
            m: document.getElementById(prefix + '-m'),
            s: document.getElementById(prefix + '-s')
        });
    }

    function hideFilter(tag) {
        document.querySelectorAll('.filter-btn[data-filter="' + tag + '"]').forEach(function (b) { b.style.display = 'none'; });
    }

    // ---------------------------------------------------------------
    // 5. BANNER AMOR Y AMISTAD + VITRINA FLORES AMARILLAS
    // ---------------------------------------------------------------
    var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>';

    function anchorNode() {
        return document.querySelector('.catalog-hero') || document.querySelector('.hero');
    }
    function insertAfterHero(el, afterEl) {
        var a = afterEl || anchorNode();
        if (a && a.parentNode) { a.parentNode.insertBefore(el, a.nextSibling); return; }
        var grid = document.getElementById('products-grid') || document.querySelector('.products-container');
        var host = grid ? (grid.closest('section') || grid.parentNode) : document.body;
        host.parentNode.insertBefore(el, host);
    }

    function buildStrip() {
        if (!isLive(CAMPAIGNS.amor) || document.getElementById('pn-strip')) return null;
        var strip = document.createElement('section');
        strip.id = 'pn-strip';
        strip.className = 'pn-strip';
        strip.innerHTML =
            '<div class="pn-strip-in">'
            + '<div class="pn-strip-txt">'
            + '<div class="pn-strip-kicker">Hasta el sábado 19 de septiembre</div>'
            + '<div class="pn-strip-title">💝 Oferta de Amor y Amistad</div>'
            + '<div class="pn-strip-sub">9 arreglos escogidos para celebrar el amor y la amistad — la oferta se cierra el 19 a medianoche</div>'
            + '</div>'
            + '<div class="pn-clock">' + clockHTML('pns') + '</div>'
            + '<button type="button" class="pn-strip-btn" id="pn-strip-btn">Ver los 9 arreglos</button>'
            + '</div>';
        insertAfterHero(strip);
        registerClock('pns', function () { return AMOR_END; });
        document.getElementById('pn-strip-btn').addEventListener('click', function () { goToFilter('amoramistad'); });
        return strip;
    }

    function buildYellowShow(after) {
        if (!isLive(CAMPAIGNS.yellow) || document.getElementById('yf-show')) return;
        var cards = YELLOW_ITEMS.map(function (it) {
            return '<article class="yf-card">'
                + '<div class="yf-img"><img src="' + it.img + '" alt="' + it.name + ' — flores amarillas a domicilio en Bogotá" loading="lazy" decoding="async"></div>'
                + '<div class="yf-body">'
                + '<div class="yf-name">' + it.name + '</div>'
                + '<div class="yf-hook">' + it.hook + '</div>'
                + '<div class="yf-row"><span class="yf-price">' + fmt(it.price) + '</span>'
                + '<a class="yf-btn" href="' + waLink(it) + '" target="_blank" rel="noopener">' + WA_SVG + 'Pedir</a></div>'
                + '</div></article>';
        }).join('');
        var sec = document.createElement('section');
        sec.id = 'yf-show';
        sec.className = 'yf-show';
        sec.innerHTML =
            '<div class="yf-in">'
            + '<div class="yf-head"><div>'
            + '<div class="yf-kicker">🌻 Amor y Amistad · 21 de septiembre</div>'
            + '<h2 class="yf-title">Los mejores arreglos de flores amarillas</h2>'
            + '<p class="yf-sub">Rosas, girasoles y margaritas para decir “me alegras la vida”. Nuestra selección amarilla para Amor y Amistad '
            + 'y para el 21 de septiembre, el día de regalar flores amarillas. Te recomendamos pedir con anticipación.</p>'
            + '</div><button type="button" class="yf-all" id="yf-all">Ver todas las flores amarillas</button></div>'
            + '<div class="yf-grid">' + cards + '</div>'
            + '</div>';
        insertAfterHero(sec, after);
        document.getElementById('yf-all').addEventListener('click', function () { goToFilter('amarillas'); });
    }

    // Activa el filtro correspondiente del catálogo y baja hasta los productos
    function goToFilter(tag) {
        var btn = document.querySelector('.filter-btn[data-filter="' + tag + '"]');
        if (btn) btn.click();
        setTimeout(function () {
            var target = document.getElementById('products-grid') || document.querySelector('.products-container');
            if (target) {
                var y = target.getBoundingClientRect().top + window.pageYOffset - 120;
                window.scrollTo({ top: y < 0 ? 0 : y, behavior: 'smooth' });
            }
        }, 120);
    }

    // ---------------------------------------------------------------
    // 6. FLYER FLOTANTE CON PESTAÑAS Y CARRUSEL
    // ---------------------------------------------------------------
    var car = { i: 0, timer: null, n: 0, camp: null };

    function buildFlyer() {
        var live = liveCampaigns();
        if (!live.length) return;
        try {
            if (sessionStorage.getItem('aa-flyer-seen') === '1') return;
        } catch (e) { /* sessionStorage bloqueado: se muestra igual */ }

        var tabs = live.length > 1
            ? '<div class="pn-tabs" role="tablist">' + live.map(function (c, i) {
                return '<button type="button" class="pn-tabbtn' + (i === 0 ? ' on' : '') + '" data-c="' + c.id + '" role="tab">' + c.tab + '</button>';
            }).join('') + '</div>'
            : '';

        var modal = document.createElement('div');
        modal.id = 'pn-modal';
        modal.className = 'pn-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Amor y Amistad y Flores Amarillas');
        modal.innerHTML =
            '<div class="pn-box" id="pn-box">'
            + '<button type="button" class="pn-x" id="pn-x" aria-label="Cerrar">&times;</button>'
            + '<div class="pn-head">'
            + '<div class="pn-head-kicker" id="pn-kicker"></div>'
            + '<div class="pn-head-title" id="pn-title"></div>'
            + '<div class="pn-head-desc" id="pn-desc"></div>'
            + '<div class="pn-head-clock"><span class="pn-hint">Termina en</span>' + clockHTML('pnm') + '</div>'
            + tabs
            + '</div>'
            + '<div class="pn-body">'
            + '<div class="pn-track" id="pn-track"></div>'
            + '<button type="button" class="pn-arrow pn-prev" id="pn-prev" aria-label="Anterior">&#10094;</button>'
            + '<button type="button" class="pn-arrow pn-next" id="pn-next" aria-label="Siguiente">&#10095;</button>'
            + '</div>'
            + '<div class="pn-foot">'
            + '<div class="pn-dots" id="pn-dots"></div>'
            + '<button type="button" class="pn-all" id="pn-all"></button>'
            + '</div>'
            + '</div>';

        document.body.appendChild(modal);
        registerClock('pnm', function () { return car.camp ? car.camp.end : AMOR_END; });

        var box = document.getElementById('pn-box');
        var track = document.getElementById('pn-track');
        var dotsWrap = document.getElementById('pn-dots');
        var imgs = [], dotEls = [];

        function setCampaign(c) {
            car.camp = c; car.i = 0; car.n = c.items.length;
            box.classList.toggle('y', c.id === 'yellow');
            document.getElementById('pn-kicker').textContent = c.kicker;
            document.getElementById('pn-title').textContent = c.title;
            document.getElementById('pn-desc').innerHTML = c.desc;
            document.getElementById('pn-all').textContent = c.id === 'yellow' ? 'Ver flores amarillas' : 'Ver los 9 en el catálogo';
            track.style.transition = 'none';
            track.style.transform = 'translate3d(0,0,0)';
            track.innerHTML = c.items.map(function (it, i) {
                return '<div class="pn-slide">'
                    + '<div class="pn-figure"><span class="pn-off">' + c.tag + '</span>'
                    + '<img alt="' + it.name + ' — ' + c.title + ', flores a domicilio en Bogotá" data-src="' + it.img + '"'
                    + (i === 0 ? ' src="' + it.img + '"' : '') + ' decoding="async"></div>'
                    + '<div class="pn-txt">'
                    + '<div class="pn-name">' + it.name + '</div>'
                    + '<div class="pn-hook">' + it.hook + '</div>'
                    + '<div class="pn-desc">' + it.desc + '</div>'
                    + '<div class="pn-prices">'
                    + (it.before ? '<span class="pn-old">' + fmt(it.before) + '</span>' : '')
                    + '<span class="pn-new">' + fmt(it.price) + '</span>'
                    + (offPct(it) ? '<span class="pn-save">-' + offPct(it) + '%</span>' : '')
                    + '</div>'
                    + '<a class="pn-cta" href="' + waLink(it) + '" target="_blank" rel="noopener">' + WA_SVG + c.cta + '</a>'
                    + '</div></div>';
            }).join('');
            dotsWrap.innerHTML = c.items.map(function (it, i) {
                return '<button type="button" class="pn-dot' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" aria-label="Ver ' + it.name + '"></button>';
            }).join('');
            imgs = Array.prototype.slice.call(track.querySelectorAll('img'));
            dotEls = Array.prototype.slice.call(dotsWrap.querySelectorAll('.pn-dot'));
            dotEls.forEach(function (d) {
                d.addEventListener('click', function () { go(parseInt(d.dataset.i, 10), true); });
            });
            modal.querySelectorAll('.pn-tabbtn').forEach(function (b) { b.classList.toggle('on', b.dataset.c === c.id); });
            void track.offsetWidth;
            track.style.transition = '';
            loadNear(0);
            tick();
        }

        function loadNear(i) {
            [i, i + 1, i - 1].forEach(function (k) {
                var img = imgs[(k + car.n) % car.n];
                if (img && !img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
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

        modal.querySelectorAll('.pn-tabbtn').forEach(function (b) {
            b.addEventListener('click', function () { setCampaign(CAMPAIGNS[b.dataset.c]); restart(); });
        });
        document.getElementById('pn-next').addEventListener('click', function () { go(car.i + 1, true); });
        document.getElementById('pn-prev').addEventListener('click', function () { go(car.i - 1, true); });

        var x0 = null;
        track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 45) go(car.i + (dx < 0 ? 1 : -1), true); else restart();
            x0 = null;
        }, { passive: true });

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
            try { sessionStorage.setItem('aa-flyer-seen', '1'); } catch (e) { }
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
            var tag = car.camp.id === 'yellow' ? 'amarillas' : 'amoramistad';
            close();
            setTimeout(function () { goToFilter(tag); }, 260);
        });

        setCampaign(live[0]);

        function open() {
            modal.classList.add('on');
            document.body.style.overflow = 'hidden';
            restart();
            document.addEventListener('keydown', onKey);
        }
        setTimeout(open, 1800);
    }

    // ---------------------------------------------------------------
    // 7. ARRANQUE
    // ---------------------------------------------------------------
    function boot() {
        if (!isLive(CAMPAIGNS.amor)) hideFilter('amoramistad');
        if (!isLive(CAMPAIGNS.yellow)) hideFilter('amarillas');
        var strip = buildStrip();
        buildYellowShow(strip);
        buildFlyer();
        startClock();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
