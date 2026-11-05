/* =====================================================================
   TEMPORADA DE GRADOS — Gi Garden Bogotá
   ---------------------------------------------------------------------
   (El archivo conserva el nombre promo-semana.js para no tener que tocar
   las etiquetas <script> de las páginas.)

   Incluye:
     · Vitrina animada "Arreglos para Grado" (confeti dorado) debajo del encabezado
     · Flyer flotante con carrusel de los 7 arreglos y el mensaje de que se
       personalizan (aparece una vez por visita)
     · Botón flotante "Arreglos para grado" abajo a la izquierda para reabrirlo
     · Cinta "🎓 Para grado" y borde dorado animado en las tarjetas del
       catálogo y de las landings; estos arreglos se muestran de primeros
   Cuando pasa GRADO_END, todo esto se apaga solo y los productos quedan
   como normales (con los precios nuevos).
   ---------------------------------------------------------------------
   CÓMO CAMBIAR LOS ARREGLOS: editar GRADO_ITEMS (sección 2).
   CÓMO CAMBIAR LA FECHA:     editar GRADO_END (sección 1).
   Si cambias un precio aquí, cámbialo también en catalogo.html y js/landing.js.
   ===================================================================== */
(function () {
    'use strict';

    // ---------------------------------------------------------------
    // 1. CONFIGURACIÓN
    // ---------------------------------------------------------------
    var WA_PHONE = '573145957395';
    var SITE = 'https://bogotafloristeria.dondeseria.com/';

    // Bogotá es UTC-5 todo el año. Fecha en UTC equivalente a 11:59:59 p.m. Bogotá.
    var GRADO_END = Date.UTC(2027, 0, 1, 4, 59, 59);   // jueves 31 de diciembre 2026, 11:59 p.m. Bogotá

    var thisScript = document.currentScript;
    var BASE = (function () {
        if (thisScript && thisScript.src) {
            return thisScript.src.replace(/js\/promo-semana\.js.*$/, '');
        }
        return /\/landing\//.test(location.pathname) ? '../' : '';
    })();

    // ---------------------------------------------------------------
    // 2. ARREGLOS PARA GRADO (en este orden salen en la vitrina y el flyer)
    // ---------------------------------------------------------------
    var GRADO_ITEMS = [
        { key: 'foto38', name: 'Ternura Rosada', price: 78000,
          hook: 'Rosas rosadas en nube de gypsophila: el abrazo que le entregas apenas baje de la tarima.' },
        { key: 'foto69', name: 'Perlas de Sol', price: 78000,
          hook: 'Rosas amarillas con encaje de perlas: luz para el día en que empieza todo lo que viene.' },
        { key: 'foto30', name: 'Suspiro Rosado', price: 95000,
          hook: 'Rosas rosadas con mariposa: hoy despega, y quieres que lo sepa.' },
        { key: 'foto59', name: 'Sol de tu Sonrisa', price: 105000,
          hook: 'Girasoles y rosas que se ven increíbles en la foto del grado. Orgullo con color.' },
        { key: 'foto60', name: 'Latido Fucsia', price: 110000,
          hook: 'Rosas fucsia, perlas y un corazón arriba: para esa persona que te llena de orgullo.' },
        { key: 'foto50', name: 'Girasol Imperial', price: 125000,
          hook: 'Un girasol en negro y dorado, elegante como la toga. El regalo con más carácter del grado.' },
        { key: 'foto45', name: 'Caja Romántica con Chocolates', price: 165000,
          hook: 'Rosas y chocolates finos para celebrar en grande después de la ceremonia.' }
    ];

    GRADO_ITEMS.forEach(function (it, i) {
        it.rank = i + 1;
        it.img = BASE + 'assets/' + it.key + '.webp';
        it.label = 'Precio de grado';
    });
    var MIN_PRICE = Math.min.apply(null, GRADO_ITEMS.map(function (it) { return it.price; }));

    function fmt(n) { return '$' + Number(n).toLocaleString('es-CO'); }
    function isLive() { return Date.now() < GRADO_END; }

    function find(imagePath) {
        if (!isLive() || !imagePath) return null;
        var m = String(imagePath).match(/(foto\d+)\.webp/);
        if (!m) return null;
        for (var i = 0; i < GRADO_ITEMS.length; i++) if (GRADO_ITEMS[i].key === m[1]) return GRADO_ITEMS[i];
        return null;
    }
    function rankOf(product) {
        var it = find(product && product.image);
        return it ? it.rank : 0;
    }

    function waLink(it) {
        var msg = 'Hola Gi Garden 🎓 quiero este arreglo para un grado:\n'
            + it.name + ' — ' + fmt(it.price)
            + '\nFoto: ' + SITE + 'assets/' + it.key + '.webp'
            + '\n\nLo quiero personalizar así:\n- Colores: \n- Nombre del graduado(a): \n- Mensaje de la tarjeta: ';
        return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(msg);
    }
    function waGeneral() {
        var msg = 'Hola Gi Garden 🎓 quiero un arreglo personalizado para un grado.\n'
            + '- Colores del colegio o universidad: \n- Nombre del graduado(a): \n- Presupuesto: ';
        return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(msg);
    }

    // API pública usada por catalogo.html y js/landing.js
    window.PROMO_SEMANA = {
        items: GRADO_ITEMS,
        find: find,
        format: fmt,
        active: isLive,
        rank: rankOf,
        // Sube al tope los arreglos de grado en el orden de GRADO_ITEMS; el resto conserva su orden
        sortToTop: function (list) {
            if (!isLive()) return list;
            var tagged = list.map(function (p, i) { return { p: p, i: i, r: rankOf(p) }; });
            tagged.sort(function (a, b) {
                if (a.r && b.r) return a.r - b.r;
                if (a.r) return -1;
                if (b.r) return 1;
                return a.i - b.i;
            });
            for (var i = 0; i < list.length; i++) list[i] = tagged[i].p;
            return list;
        },
        ribbon: function (it) {
            if (!it) return '';
            return '<span class="pn-ribbon">🎓 Para grado</span><span class="pn-tag">✏️ Personalizable</span>';
        },
        priceBefore: function () { return ''; },
        cardClass: function (it) { return it ? ' pn-card' : ''; },
        open: function () { openFlyer(); }
    };

    // ---------------------------------------------------------------
    // 3. ESTILOS (negro y dorado de Gi Garden)
    // ---------------------------------------------------------------
    var CSS = [
        /* ---------- Tarjetas destacadas ---------- */
        '.pn-card{position:relative;border:2px solid transparent!important;border-radius:16px;overflow:hidden;',
        'background-image:linear-gradient(#fff,#fff),linear-gradient(120deg,#C9A86A,#F6E3B4,#8C6F3A,#E8CF8E,#C9A86A);',
        'background-size:100% 100%,300% 300%;background-origin:border-box;background-clip:padding-box,border-box;',
        'animation:gdBorder 5s linear infinite;box-shadow:0 10px 30px rgba(140,111,58,.25)}',
        '@keyframes gdBorder{0%{background-position:0 0,0% 50%}100%{background-position:0 0,300% 50%}}',
        '.pn-card .product-image-container::after,.pn-card .product-image::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;z-index:3;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-20deg);animation:gdShine 4.5s ease-in-out infinite}',
        '@keyframes gdShine{0%,62%{left:-75%}100%{left:130%}}',
        '.pn-ribbon{position:absolute;top:0;right:0;z-index:4;background:linear-gradient(135deg,#111,#2b2416);color:#F6E3B4;',
        'font-family:Poppins,sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.4px;padding:.45rem .8rem;',
        'border-bottom-left-radius:14px;border-left:2px solid #C9A86A;border-bottom:2px solid #C9A86A;',
        'box-shadow:0 4px 12px rgba(0,0,0,.25);animation:gdPulse 2.6s ease-in-out infinite}',
        '@keyframes gdPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}',
        '.pn-tag{position:absolute;bottom:.7rem;left:.7rem;z-index:4;background:rgba(255,255,255,.95);color:#6b5223;',
        'font-family:Poppins,sans-serif;font-weight:700;font-size:.72rem;padding:.3rem .65rem;border-radius:50px;',
        'box-shadow:0 2px 8px rgba(0,0,0,.15);white-space:nowrap}',
        '.filter-btn[data-filter="grados"]{background:linear-gradient(135deg,#111,#3a2f1a,#111)!important;background-size:200% 200%!important;',
        'color:#F6E3B4!important;border-color:#C9A86A!important;font-weight:600;animation:gdBtn 3s ease infinite}',
        '@keyframes gdBtn{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',

        /* ---------- Vitrina ---------- */
        '.gd-show{position:relative;overflow:hidden;color:#fff;font-family:Poppins,sans-serif;padding:2.4rem 1rem 2.6rem;',
        'background:radial-gradient(ellipse at 15% 0%,rgba(201,168,106,.28),transparent 55%),radial-gradient(ellipse at 90% 100%,rgba(201,168,106,.22),transparent 55%),#0d0b08}',
        '.gd-conf{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}',
        '.gd-bit{position:absolute;top:-24px;width:8px;height:14px;border-radius:2px;opacity:.9;animation:gdFall linear infinite}',
        '@keyframes gdFall{0%{transform:translate3d(0,-24px,0) rotate(0) rotateY(0)}100%{transform:translate3d(40px,680px,0) rotate(600deg) rotateY(720deg);opacity:0}}',
        '.gd-in{position:relative;z-index:1;max-width:1150px;margin:0 auto}',
        '.gd-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 1.5rem;margin-bottom:1.4rem}',
        '.gd-kicker{display:inline-block;font-size:.72rem;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;color:#F6E3B4;',
        'border:1px solid rgba(201,168,106,.6);padding:.3rem .8rem;border-radius:50px;background:rgba(201,168,106,.1)}',
        '.gd-title{font-family:"Playfair Display",Georgia,serif;font-size:2.9rem;font-weight:700;line-height:1.05;margin:.6rem 0 .5rem;',
        'background:linear-gradient(90deg,#C9A86A 0%,#F6E3B4 25%,#fff 50%,#F6E3B4 75%,#C9A86A 100%);background-size:200% auto;',
        '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gdShimmer 4s linear infinite}',
        '@keyframes gdShimmer{to{background-position:200% center}}',
        '.gd-cap{display:inline-block;-webkit-text-fill-color:initial;animation:gdCap 3.2s ease-in-out infinite;transform-origin:50% 80%}',
        '@keyframes gdCap{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-8px) rotate(8deg)}}',
        '.gd-sub{font-size:.95rem;line-height:1.6;max-width:60ch;color:#e9e1cf}',
        '.gd-perso{display:flex;flex-direction:column;gap:.45rem;max-width:330px;background:rgba(201,168,106,.1);',
        'border:1px solid rgba(201,168,106,.45);border-radius:16px;padding:1rem 1.1rem}',
        '.gd-perso b{color:#F6E3B4;font-size:.9rem}',
        '.gd-perso span{font-size:.8rem;color:#e9e1cf;line-height:1.45}',
        '.gd-perso a{align-self:flex-start;margin-top:.2rem;color:#111;background:linear-gradient(135deg,#F6E3B4,#C9A86A);text-decoration:none;',
        'font-weight:700;font-size:.8rem;padding:.5rem .95rem;border-radius:50px}',
        '.gd-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}',
        '.gd-card{position:relative;background:#fff;color:#2c2c2c;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;',
        'box-shadow:0 14px 30px rgba(0,0,0,.45);transition:transform .25s ease,box-shadow .25s ease;animation:gdIn .7s both}',
        '.gd-card:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,.55),0 0 0 2px #C9A86A}',
        '@keyframes gdIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}',
        '.gd-img{position:relative;aspect-ratio:1/1;overflow:hidden;background:#f4efe4}',
        '.gd-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}',
        '.gd-card:hover .gd-img img{transform:scale(1.07)}',
        '.gd-img::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:gdShine 4.5s ease-in-out infinite}',
        '.gd-badge{position:absolute;top:.6rem;left:.6rem;z-index:2;background:#111;color:#F6E3B4;border:1px solid #C9A86A;',
        'font-weight:700;font-size:.68rem;padding:.3rem .6rem;border-radius:50px}',
        '.gd-body{padding:.9rem .95rem 1rem;display:flex;flex-direction:column;gap:.35rem;flex:1}',
        '.gd-name{font-family:"Playfair Display",Georgia,serif;font-size:1.1rem;font-weight:700;color:#111;line-height:1.2}',
        '.gd-hook{font-size:.78rem;color:#6b6252;line-height:1.5;flex:1}',
        '.gd-row{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:.3rem}',
        '.gd-price{font-family:"Playfair Display",Georgia,serif;font-size:1.3rem;font-weight:700;color:#8C6F3A;line-height:1}',
        '.gd-btn{display:inline-flex;align-items:center;gap:.35rem;background:#25D366;color:#fff;text-decoration:none;',
        'font-weight:600;font-size:.76rem;padding:.5rem .85rem;border-radius:50px;white-space:nowrap}',
        '.gd-btn svg{width:14px;height:14px;fill:currentColor}',
        '.gd-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.8rem;margin-top:1.3rem}',
        '.gd-note{font-size:.8rem;color:#cfc4ad}',
        '.gd-all{background:linear-gradient(135deg,#F6E3B4,#C9A86A);color:#111;border:0;cursor:pointer;font-family:inherit;font-weight:700;',
        'font-size:.88rem;padding:.75rem 1.4rem;border-radius:50px;box-shadow:0 6px 18px rgba(0,0,0,.35);transition:transform .18s ease}',
        '.gd-all:hover{transform:translateY(-2px)}',

        /* ---------- Flyer flotante ---------- */
        '.gf-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;',
        'background:rgba(8,6,3,.78);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);opacity:0;visibility:hidden;',
        'transition:opacity .3s ease,visibility .3s ease;font-family:Poppins,sans-serif}',
        '.gf-modal.on{opacity:1;visibility:visible}',
        '.gf-box{position:relative;width:100%;max-width:880px;max-height:92vh;border-radius:22px;padding:3px;',
        'background:linear-gradient(120deg,#C9A86A,#F6E3B4,#8C6F3A,#F6E3B4,#C9A86A);background-size:300% 300%;animation:gdBg 6s linear infinite;',
        'box-shadow:0 30px 80px rgba(0,0,0,.6);transform:translate3d(0,30px,0) scale(.95);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)}',
        '@keyframes gdBg{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
        '.gf-modal.on .gf-box{transform:none}',
        '.gf-in{position:relative;display:flex;flex-direction:column;background:#fff;border-radius:19px;overflow:hidden;max-height:calc(92vh - 6px)}',
        '.gf-head{position:relative;overflow:hidden;background:#0d0b08;color:#fff;padding:1rem 3.2rem 1rem 1.3rem;flex-shrink:0}',
        '.gf-head .gd-conf{opacity:.8}',
        '.gf-kicker{position:relative;font-size:.66rem;letter-spacing:2.4px;text-transform:uppercase;color:#F6E3B4;font-weight:700}',
        '.gf-title{position:relative;font-family:"Playfair Display",Georgia,serif;font-size:1.65rem;font-weight:700;line-height:1.15;margin:.15rem 0 .2rem}',
        '.gf-title em{font-style:normal;color:#F6E3B4}',
        '.gf-desc{position:relative;font-size:.8rem;line-height:1.45;color:#e9e1cf;max-width:64ch}',
        '.gf-body{position:relative;overflow:hidden;flex:1;min-height:0}',
        '.gf-track{display:flex;height:100%;transition:transform .5s cubic-bezier(.25,.8,.3,1);will-change:transform}',
        '.gf-slide{flex:0 0 100%;display:flex;min-width:0}',
        '.gf-fig{flex:0 0 44%;position:relative;background:#f4efe4;overflow:hidden;min-height:300px}',
        '.gf-fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}',
        '.gf-fig::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;z-index:2;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-20deg);animation:gdShine 4s ease-in-out infinite}',
        '.gf-cap{position:absolute;top:.8rem;left:.8rem;z-index:3;width:64px;height:64px;border-radius:50%;display:flex;align-items:center;',
        'justify-content:center;font-size:1.9rem;background:radial-gradient(circle at 30% 30%,#2b2416,#0d0b08);border:2px solid #C9A86A;',
        'box-shadow:0 6px 18px rgba(0,0,0,.4);animation:gdCap 3.2s ease-in-out infinite}',
        '.gf-txt{flex:1;min-width:0;padding:1.2rem 1.4rem;display:flex;flex-direction:column;justify-content:center;gap:.5rem}',
        '.gf-name{font-family:"Playfair Display",Georgia,serif;font-size:1.6rem;font-weight:700;color:#111;line-height:1.1}',
        '.gf-hook{font-size:.9rem;color:#6b6252;line-height:1.5}',
        '.gf-price{font-family:"Playfair Display",Georgia,serif;font-size:2rem;font-weight:700;color:#8C6F3A;line-height:1}',
        '.gf-plabel{font-size:.62rem;letter-spacing:1.6px;text-transform:uppercase;color:#9b8a66;font-weight:700}',
        '.gf-perso{font-size:.78rem;line-height:1.5;color:#4a4232;background:#faf6ec;border:1px dashed #C9A86A;border-radius:12px;padding:.6rem .75rem}',
        '.gf-perso b{color:#8C6F3A}',
        '.gf-cta{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:#25D366;color:#fff;text-decoration:none;',
        'font-weight:700;font-size:.92rem;padding:.75rem 1.15rem;border-radius:50px;align-self:flex-start;animation:gdCta 2.2s ease-in-out infinite}',
        '.gf-cta svg{width:18px;height:18px;fill:currentColor;flex-shrink:0}',
        '@keyframes gdCta{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}50%{box-shadow:0 0 0 12px rgba(37,211,102,0)}}',
        '.gf-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:5;width:38px;height:38px;border-radius:50%;border:0;cursor:pointer;',
        'background:rgba(255,255,255,.94);color:#111;font-size:1.25rem;line-height:1;display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 3px 12px rgba(0,0,0,.25);transition:transform .2s ease}',
        '.gf-arrow:hover{transform:translateY(-50%) scale(1.1)}',
        '.gf-prev{left:10px}.gf-next{right:10px}',
        '.gf-foot{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.7rem 1.1rem;background:#faf6ec;border-top:1px solid rgba(0,0,0,.06)}',
        '.gf-dots{display:flex;gap:.4rem;flex-wrap:wrap}',
        '.gf-dot{width:8px;height:8px;border-radius:50%;border:0;padding:0;cursor:pointer;background:#e3d6b6;transition:transform .2s ease,background .2s ease}',
        '.gf-dot.on{background:#8C6F3A;transform:scale(1.45)}',
        '.gf-all{background:#111;color:#F6E3B4;border:0;cursor:pointer;font-family:inherit;font-weight:600;font-size:.8rem;padding:.55rem 1rem;border-radius:50px}',
        '.gf-x{position:absolute;top:.65rem;right:.7rem;z-index:6;width:34px;height:34px;border-radius:50%;border:0;cursor:pointer;',
        'background:rgba(255,255,255,.16);color:#fff;font-size:1.35rem;line-height:1;display:flex;align-items:center;justify-content:center;transition:transform .2s ease}',
        '.gf-x:hover{transform:rotate(90deg);background:rgba(255,255,255,.3)}',

        /* ---------- Botón flotante ---------- */
        '.gf-pill{position:fixed;left:18px;bottom:22px;z-index:9990;display:flex;align-items:center;gap:.55rem;cursor:pointer;font-family:Poppins,sans-serif;',
        'background:#111;color:#fff;border:2px solid #C9A86A;border-radius:50px;padding:.3rem .95rem .3rem .3rem;text-align:left;',
        'box-shadow:0 8px 24px rgba(0,0,0,.4);transform:translateY(130px);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)}',
        '.gf-pill.on{transform:none;animation:gdFloat 3s ease-in-out infinite .5s}',
        '@keyframes gdFloat{0%,100%{translate:0 0}50%{translate:0 -5px}}',
        '.gf-pill i{width:42px;height:42px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.35rem;',
        'font-style:normal;background:radial-gradient(circle at 30% 30%,#3a2f1a,#0d0b08);border:1px solid #C9A86A}',
        '.gf-pill small{display:block;font-size:.6rem;letter-spacing:1.4px;text-transform:uppercase;color:#F6E3B4;font-weight:600}',
        '.gf-pill b{display:block;font-size:.84rem;line-height:1.2}',
        '.gf-pill-x{position:absolute;top:-8px;right:-8px;width:20px;height:20px;border-radius:50%;background:#C9A86A;color:#111;font-size:.8rem;line-height:20px;text-align:center}',

        /* ---------- Responsive ---------- */
        '@media(max-width:980px){.gd-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}',
        '@media(max-width:720px){',
        '.gd-show{padding:1.8rem 0 2rem}',
        '.gd-head,.gd-foot{padding:0 1rem}',
        '.gd-title{font-size:2rem}',
        '.gd-sub{font-size:.86rem}',
        '.gd-perso{max-width:none}',
        '.gd-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:.8rem;padding:.3rem 1rem .6rem;-webkit-overflow-scrolling:touch}',
        '.gd-card{flex:0 0 70%;scroll-snap-align:start}',
        '.gf-head{padding:.85rem 2.9rem .85rem 1rem}',
        '.gf-title{font-size:1.3rem}.gf-desc{font-size:.74rem}',
        '.gf-body{overflow-y:auto;-webkit-overflow-scrolling:touch}',
        '.gf-slide{flex-direction:column}',
        '.gf-fig{flex:0 0 auto;height:210px;min-height:0}',
        '.gf-txt{padding:.95rem 1rem 1.1rem}',
        '.gf-name{font-size:1.3rem}.gf-price{font-size:1.6rem}',
        '.gf-arrow{width:32px;height:32px;top:105px}',
        '.gf-cap{width:52px;height:52px;font-size:1.5rem}',
        '.gf-pill{left:12px;bottom:16px}',
        '.pn-ribbon{font-size:.7rem;padding:.35rem .6rem}',
        '.pn-tag{font-size:.64rem}',
        '}',
        '@media(prefers-reduced-motion:reduce){',
        '.pn-card,.pn-ribbon,.gd-title,.gd-cap,.gd-card,.gd-bit,.gf-box,.gf-cap,.gf-cta,.gf-pill.on,.filter-btn[data-filter="grados"],',
        '.gd-img::after,.gf-fig::after,.pn-card .product-image-container::after,.pn-card .product-image::after{animation:none!important}',
        '.gd-conf{display:none}.gf-track{transition:none}',
        '}'
    ].join('');

    (function injectCSS() {
        var s = document.createElement('style');
        s.id = 'pn-styles';
        s.textContent = CSS;
        (document.head || document.documentElement).appendChild(s);
    })();

    var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>';

    function confettiHTML(n) {
        var colors = ['#C9A86A', '#F6E3B4', '#8C6F3A', '#ffffff', '#E8CF8E'];
        var out = '';
        for (var i = 0; i < n; i++) {
            var left = (i * 7.7 + (i % 4) * 3) % 100;
            var dur = 6 + (i % 5) * 1.5;
            var delay = -(i * 0.9);
            var w = 6 + (i % 3) * 2;
            out += '<span class="gd-bit" style="left:' + left + '%;width:' + w + 'px;height:' + (w * 1.7) + 'px;'
                + 'background:' + colors[i % colors.length] + ';animation-duration:' + dur + 's;animation-delay:' + delay + 's"></span>';
        }
        return '<div class="gd-conf" aria-hidden="true">' + out + '</div>';
    }

    var PERSO_TXT = 'Lo armamos con <b>los colores de su colegio o universidad</b>, con <b>tarjeta con su nombre</b> y el mensaje que tú quieras.';

    // ---------------------------------------------------------------
    // 4. VITRINA "ARREGLOS PARA GRADO"
    // ---------------------------------------------------------------
    function anchorNode() { return document.querySelector('.catalog-hero') || document.querySelector('.hero'); }
    function insertAfterHero(el) {
        var a = anchorNode();
        if (a && a.parentNode) { a.parentNode.insertBefore(el, a.nextSibling); return; }
        var grid = document.getElementById('products-grid') || document.querySelector('.products-container');
        var host = grid ? (grid.closest('section') || grid.parentNode) : null;
        if (host && host.parentNode) host.parentNode.insertBefore(el, host);
        else document.body.insertBefore(el, document.body.firstChild);
    }

    function buildShow() {
        if (document.getElementById('gd-show')) return;
        var cards = GRADO_ITEMS.map(function (it, i) {
            return '<article class="gd-card" style="animation-delay:' + (i * 0.07) + 's">'
                + '<div class="gd-img"><span class="gd-badge">✏️ Personalizable</span>'
                + '<img src="' + it.img + '" alt="' + it.name + ' — arreglo floral para grado a domicilio en Bogotá" loading="lazy" decoding="async"></div>'
                + '<div class="gd-body">'
                + '<div class="gd-name">' + it.name + '</div>'
                + '<div class="gd-hook">' + it.hook + '</div>'
                + '<div class="gd-row"><span class="gd-price">' + fmt(it.price) + '</span>'
                + '<a class="gd-btn" href="' + waLink(it) + '" target="_blank" rel="noopener">' + WA_SVG + 'Pedir</a></div>'
                + '</div></article>';
        }).join('');
        var hasFilter = !!document.querySelector('.filter-btn[data-filter="grados"]');
        var sec = document.createElement('section');
        sec.id = 'gd-show';
        sec.className = 'gd-show';
        sec.innerHTML = confettiHTML(22)
            + '<div class="gd-in">'
            + '<div class="gd-head"><div>'
            + '<span class="gd-kicker">🎓 Temporada de grados · desde ' + fmt(MIN_PRICE) + '</span>'
            + '<h2 class="gd-title">Se lo ganó. <span class="gd-cap">🎓</span><br>Que lo sienta con flores.</h2>'
            + '<p class="gd-sub">Años de esfuerzo merecen más que un “felicitaciones”. Escogimos 7 arreglos para celebrar el grado de tu hijo, '
            + 'tu pareja o tu mejor amigo, con precio especial de temporada. Te recomendamos pedirlo con anticipación para tenerlo listo antes de la ceremonia.</p>'
            + '</div>'
            + '<div class="gd-perso"><b>✏️ Todos se pueden personalizar</b>'
            + '<span>' + PERSO_TXT + ' Cuéntanos tu idea y lo hacemos a su medida.</span>'
            + '<a href="' + waGeneral() + '" target="_blank" rel="noopener">Personalizar por WhatsApp</a></div>'
            + '</div>'
            + '<div class="gd-grid">' + cards + '</div>'
            + '<div class="gd-foot"><span class="gd-note">Fotos de referencia: cada arreglo se arma en los colores que tú elijas.</span>'
            + (hasFilter ? '<button type="button" class="gd-all" id="gd-all">Ver los arreglos para grado en el catálogo</button>' : '')
            + '</div>'
            + '</div>';
        insertAfterHero(sec);
        var all = document.getElementById('gd-all');
        if (all) all.addEventListener('click', function () { goToFilter('grados'); });
    }

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
    // 5. FLYER FLOTANTE CON CARRUSEL
    // ---------------------------------------------------------------
    var SEEN_KEY = 'gg-grados-flyer-visto';
    var flyer = null;

    function buildFlyer() {
        if (document.getElementById('gf-modal')) return;
        var modal = document.createElement('div');
        modal.id = 'gf-modal';
        modal.className = 'gf-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Arreglos para grado personalizables');
        var slides = GRADO_ITEMS.map(function (it, i) {
            return '<div class="gf-slide">'
                + '<div class="gf-fig"><span class="gf-cap">🎓</span>'
                + '<img alt="' + it.name + ' — arreglo para grado, flores a domicilio en Bogotá" '
                + (i === 0 ? 'src' : 'data-src') + '="' + it.img + '" decoding="async"></div>'
                + '<div class="gf-txt">'
                + '<div class="gf-name">' + it.name + '</div>'
                + '<div class="gf-hook">' + it.hook + '</div>'
                + '<div><div class="gf-plabel">Precio de grado</div><div class="gf-price">' + fmt(it.price) + '</div></div>'
                + '<div class="gf-perso">✏️ <b>Personalízalo:</b> ' + PERSO_TXT + '</div>'
                + '<a class="gf-cta" href="' + waLink(it) + '" target="_blank" rel="noopener">' + WA_SVG + 'Lo quiero para su grado</a>'
                + '</div></div>';
        }).join('');
        modal.innerHTML =
            '<div class="gf-box"><div class="gf-in">'
            + '<button type="button" class="gf-x" id="gf-x" aria-label="Cerrar">&times;</button>'
            + '<div class="gf-head">' + confettiHTML(14)
            + '<div class="gf-kicker">🎓 Temporada de grados</div>'
            + '<div class="gf-title">Arreglos para grado, <em>hechos a su medida</em></div>'
            + '<div class="gf-desc">Desde ' + fmt(MIN_PRICE) + '. Todos se personalizan con los colores de su colegio o universidad y una tarjeta con su nombre.</div>'
            + '</div>'
            + '<div class="gf-body"><div class="gf-track" id="gf-track">' + slides + '</div>'
            + '<button type="button" class="gf-arrow gf-prev" id="gf-prev" aria-label="Anterior">&#10094;</button>'
            + '<button type="button" class="gf-arrow gf-next" id="gf-next" aria-label="Siguiente">&#10095;</button></div>'
            + '<div class="gf-foot"><div class="gf-dots" id="gf-dots">'
            + GRADO_ITEMS.map(function (it, i) {
                return '<button type="button" class="gf-dot' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" aria-label="Ver ' + it.name + '"></button>';
            }).join('')
            + '</div><button type="button" class="gf-all" id="gf-all">Ver los 7 arreglos</button></div>'
            + '</div></div>';
        document.body.appendChild(modal);

        var track = document.getElementById('gf-track');
        var imgs = Array.prototype.slice.call(track.querySelectorAll('img'));
        var dots = Array.prototype.slice.call(modal.querySelectorAll('.gf-dot'));
        var n = GRADO_ITEMS.length, cur = 0, timer = null;

        function load(i) {
            [i, i + 1].forEach(function (k) {
                var im = imgs[(k + n) % n];
                if (im && !im.getAttribute('src')) im.setAttribute('src', im.getAttribute('data-src'));
            });
        }
        function go(i, user) {
            cur = (i + n) % n;
            track.style.transform = 'translate3d(-' + (cur * 100) + '%,0,0)';
            dots.forEach(function (d, k) { d.classList.toggle('on', k === cur); });
            load(cur);
            if (user) restart();
        }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        function restart() { stop(); timer = setInterval(function () { go(cur + 1); }, 4200); }

        dots.forEach(function (d) { d.addEventListener('click', function () { go(+d.getAttribute('data-i'), true); }); });
        document.getElementById('gf-next').addEventListener('click', function () { go(cur + 1, true); });
        document.getElementById('gf-prev').addEventListener('click', function () { go(cur - 1, true); });
        var x0 = null;
        track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1), true); else restart();
            x0 = null;
        }, { passive: true });
        var box = modal.querySelector('.gf-box');
        box.addEventListener('mouseenter', stop);
        box.addEventListener('mouseleave', function () { if (modal.classList.contains('on')) restart(); });

        function close() {
            modal.classList.remove('on');
            stop();
            document.body.style.overflow = '';
            try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { }
            document.removeEventListener('keydown', onKey);
            showPill();
        }
        function onKey(e) {
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') go(cur + 1, true);
            else if (e.key === 'ArrowLeft') go(cur - 1, true);
        }
        document.getElementById('gf-x').addEventListener('click', close);
        modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
        document.getElementById('gf-all').addEventListener('click', function () {
            close();
            var sec = document.getElementById('gd-show');
            if (sec) setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
        });

        flyer = {
            open: function () {
                hidePill();
                modal.classList.add('on');
                document.body.style.overflow = 'hidden';
                document.addEventListener('keydown', onKey);
                restart();
            }
        };
    }

    function openFlyer() { if (!flyer) buildFlyer(); if (flyer) flyer.open(); }

    function buildPill() {
        if (document.getElementById('gf-pill')) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'gf-pill';
        b.className = 'gf-pill';
        b.setAttribute('aria-label', 'Ver arreglos para grado');
        b.innerHTML = '<i>🎓</i><span><small>Arreglos para grado</small><b>Personalizables · desde ' + fmt(MIN_PRICE) + '</b></span>'
            + '<span class="gf-pill-x" data-x="1" aria-label="Ocultar">&times;</span>';
        document.body.appendChild(b);
        b.addEventListener('click', function (e) {
            if (e.target && e.target.getAttribute && e.target.getAttribute('data-x')) {
                e.stopPropagation();
                hidePill();
                try { sessionStorage.setItem('gg-grados-pill-oculto', '1'); } catch (er) { }
                return;
            }
            openFlyer();
        });
    }
    function showPill() {
        try { if (sessionStorage.getItem('gg-grados-pill-oculto') === '1') return; } catch (e) { }
        buildPill();
        var p = document.getElementById('gf-pill');
        if (p) setTimeout(function () { p.classList.add('on'); }, 300);
    }
    function hidePill() { var p = document.getElementById('gf-pill'); if (p) p.classList.remove('on'); }

    function hideFilter() {
        document.querySelectorAll('.filter-btn[data-filter="grados"]').forEach(function (b) { b.style.display = 'none'; });
    }

    // ---------------------------------------------------------------
    // 6. ARRANQUE
    // ---------------------------------------------------------------
    function boot() {
        if (!isLive()) { hideFilter(); return; }
        buildShow();
        buildFlyer();
        var seen = false;
        try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { }
        if (seen) showPill();
        else setTimeout(function () { if (isLive()) openFlyer(); }, 1800);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
