/* =====================================================================
   PROMOCIONES DE OCTUBRE — Gi Garden Bogotá
   ---------------------------------------------------------------------
   (El archivo conserva el nombre promo-semana.js para no tener que tocar
   las etiquetas <script> de las páginas.)

   Dos campañas que cierran solas en PROMO_END (hora de Bogotá):

     1. ⭐ ARREGLO DE LA SEMANA → Ternura Rosada en 3 tamaños
        12 rosas $85.000 · 18 rosas $110.000 · 24 rosas $135.000
        - Flyer flotante (aparece una vez por visita) + botón flotante
          "Arreglo de la semana" abajo a la izquierda para volver a abrirlo.

     2. 🌸 FRENESÍ ROSA → 6 arreglos de rosas rosadas con precio rebajado
        (el precio "antes" es el precio actual + 20 %)
        - Vitrina animada con pétalos cayendo, contador y tarjetas.
        - Cintas y borde animado en las tarjetas del catálogo/landings.
        - Estos arreglos se muestran primero, en el orden de ROSA_ITEMS.

   ---------------------------------------------------------------------
   CÓMO CAMBIAR LA FECHA DE CIERRE: editar PROMO_END y END_TXT (sección 1).
   CÓMO CAMBIAR LOS ARREGLOS / PRECIOS: editar WEEK y ROSA_ITEMS (sección 2).
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
    var PROMO_END = Date.UTC(2026, 9, 19, 4, 59, 59);   // domingo 18 de octubre 2026, 11:59 p.m. Bogotá
    var END_TXT = 'domingo 18 de octubre';

    var thisScript = document.currentScript;
    var BASE = (function () {
        if (thisScript && thisScript.src) {
            return thisScript.src.replace(/js\/promo-semana\.js.*$/, '');
        }
        return /\/landing\//.test(location.pathname) ? '../' : '';
    })();

    // ---------------------------------------------------------------
    // 2. ARREGLOS
    // ---------------------------------------------------------------
    // Arreglo de la semana: Ternura Rosada en 3 tamaños (fotos 38, 38_1, 38_2)
    var WEEK = {
        camp: 'week',
        key: 'foto38',
        name: 'Ternura Rosada',
        hook: 'Rosas rosadas, mariposa brillante y nube de gypsophila. Tú decides qué tan fuerte lo quieres decir.',
        variants: [
            { label: '12 rosas', note: 'Para alegrarle el día', price: 85000, before: 112500, img: 'foto38' },
            { label: '18 rosas', note: 'Para que lo cuente a todo el mundo', price: 110000, before: 145000, img: 'foto38_1' },
            { label: '24 rosas', note: 'Para dejarla sin palabras', price: 135000, before: 178000, img: 'foto38_2', badge: 'Mejor valor' }
        ]
    };

    // Frenesí Rosa: en este orden aparecen de primeros en el catálogo y las landings
    var ROSA_UP = 1.20; // el precio de antes era 20 % más alto
    var ROSA_ITEMS = [
        { key: 'foto24', name: 'Caja Rubor', price: 156250,
          hook: 'Abre la tapa y se le escapa la sonrisa: rosas rubor con perlas en caja blanca.' },
        { key: 'foto30', name: 'Suspiro Rosado', price: 131250,
          hook: 'Rosas rosadas con mariposa y carta: el mensaje se entiende antes de leerlo.' },
        { key: 'foto34', name: 'Abrazo Floral', price: 262500,
          hook: 'Rosas rosadas y lilas en nube de gypsophila. Un abrazo que se puede tocar.' },
        { key: 'foto32', name: 'Elegancia Tropical', price: 281250,
          hook: 'Rosas rosadas con aves del paraíso: presencia de gala que nadie olvida.' },
        { key: 'foto31', name: 'Atardecer en Jarrón', price: 218750,
          hook: 'Llega listo para lucir en su jarrón de vidrio. Solo hay que escogerle el mejor lugar.' },
        { key: 'foto62', name: 'Alas de Amor', price: 228750,
          hook: 'El ramo XL de rosas rosadas con mariposas doradas. La declaración más grande, sin decir una palabra.' }
    ];

    ROSA_ITEMS.forEach(function (it, i) {
        it.camp = 'rosa';
        it.rank = i + 1;
        it.before = Math.round(it.price * ROSA_UP);
        it.img = BASE + 'assets/' + it.key + '.webp';
        it.label = 'Frenesí Rosa';
    });
    WEEK.rank = ROSA_ITEMS.length + 1;
    WEEK.label = 'Arreglo de la semana';
    WEEK.variants.forEach(function (v) { v.src = BASE + 'assets/' + v.img + '.webp'; });

    function fmt(n) { return '$' + Number(n).toLocaleString('es-CO'); }
    function pct(price, before) { return before > price ? Math.round((1 - price / before) * 100) : 0; }
    function isLive() { return Date.now() < PROMO_END; }

    function keyOf(path) {
        var m = String(path || '').match(/(foto\d+(?:_\d+)?)\.webp/);
        return m ? m[1] : null;
    }
    function weekVariant(key) {
        for (var i = 0; i < WEEK.variants.length; i++) if (WEEK.variants[i].img === key) return WEEK.variants[i];
        return null;
    }
    function find(imagePath) {
        if (!isLive()) return null;
        var k = keyOf(imagePath);
        if (!k) return null;
        if (weekVariant(k)) return WEEK;
        for (var i = 0; i < ROSA_ITEMS.length; i++) if (ROSA_ITEMS[i].key === k) return ROSA_ITEMS[i];
        return null;
    }
    // Precio "antes" de una foto concreta (sirve para las 3 versiones de Ternura)
    function beforeOf(imagePath) {
        var it = find(imagePath);
        if (!it) return 0;
        if (it === WEEK) { var v = weekVariant(keyOf(imagePath)); return v ? v.before : 0; }
        return it.before;
    }
    function rankOf(product) {
        var it = find(product && product.image);
        return it ? it.rank : 0;
    }

    var WEEK_MIN = WEEK.variants[0];
    var WEEK_OFF = pct(WEEK_MIN.price, WEEK_MIN.before);

    function waWeek(v) {
        var msg = 'Hola Gi Garden, quiero el Arreglo de la Semana 🌸\n'
            + WEEK.name + ' — ' + v.label + ' — ' + fmt(v.price) + ' (antes ' + fmt(v.before) + ')'
            + '\nFoto: ' + SITE + 'assets/' + v.img + '.webp';
        return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(msg);
    }
    function waRosa(it) {
        var msg = 'Hola Gi Garden, quiero aprovechar el Frenesí Rosa 🌸\n'
            + it.name + ' — ' + fmt(it.price) + ' (antes ' + fmt(it.before) + ')'
            + '\nFoto: ' + SITE + 'assets/' + it.key + '.webp';
        return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(msg);
    }

    // API pública usada por catalogo.html y js/landing.js
    window.PROMO_SEMANA = {
        week: WEEK,
        rosa: ROSA_ITEMS,
        find: find,
        beforeOf: beforeOf,
        format: fmt,
        active: isLive,
        rank: rankOf,
        // Sube al tope los de la promo en el orden definido; el resto conserva su orden
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
        ribbon: function (it, imagePath) {
            if (!it) return '';
            if (it === WEEK) {
                return '<span class="pn-ribbon pn-wk">⭐ Arreglo de la semana</span>'
                    + '<span class="pn-tag pn-wk">-' + WEEK_OFF + '% · desde ' + fmt(WEEK_MIN.price) + '</span>';
            }
            return '<span class="pn-ribbon">🌸 Frenesí Rosa</span>'
                + '<span class="pn-tag">Ahorras ' + fmt(it.before - it.price) + '</span>';
        },
        priceBefore: function (it, imagePath) {
            var b = it ? (imagePath ? beforeOf(imagePath) : (it === WEEK ? WEEK_MIN.before : it.before)) : 0;
            return b ? '<span class="pn-old">' + fmt(b) + '</span> ' : '';
        },
        cardClass: function (it) { return it ? (it === WEEK ? ' pn-card pn-card-wk' : ' pn-card') : ''; },
        openWeek: function () { openFlyer(true); }
    };

    // ---------------------------------------------------------------
    // 3. ESTILOS
    // ---------------------------------------------------------------
    var CSS = [
        /* ---------- Tarjetas destacadas (borde animado + brillo) ---------- */
        '.pn-card{position:relative;border:2px solid transparent!important;border-radius:16px;overflow:hidden;',
        'background-image:linear-gradient(#fff,#fff),linear-gradient(120deg,#FF4F9A,#FFC2DA,#E0457B,#FF8FC0,#FF4F9A);',
        'background-size:100% 100%,300% 300%;background-origin:border-box;background-clip:padding-box,border-box;',
        'animation:pnBorder 5s linear infinite;box-shadow:0 10px 30px rgba(224,69,123,.22)}',
        '.pn-card-wk{background-image:linear-gradient(#fff,#fff),linear-gradient(120deg,#C9A86A,#FFE3A3,#FF4F9A,#C9A86A,#FFE3A3);',
        'box-shadow:0 12px 34px rgba(201,168,106,.35)}',
        '@keyframes pnBorder{0%{background-position:0 0,0% 50%}100%{background-position:0 0,300% 50%}}',
        '.pn-card .product-image-container::after,.pn-card .product-image::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;z-index:3;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:pnShine 4.5s ease-in-out infinite}',
        '@keyframes pnShine{0%,62%{left:-75%}100%{left:130%}}',
        '.pn-ribbon{position:absolute;top:0;right:0;z-index:4;background:linear-gradient(135deg,#FF4F9A,#C2185B);',
        'color:#fff;font-family:Poppins,sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.4px;',
        'padding:.45rem .8rem;border-bottom-left-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.22);animation:pnPulse 2.4s ease-in-out infinite}',
        '.pn-ribbon.pn-wk{background:linear-gradient(135deg,#2a0716,#8E1450 60%,#C9A86A);}',
        '@keyframes pnPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}',
        '.pn-tag{position:absolute;bottom:.7rem;left:.7rem;z-index:4;background:rgba(255,255,255,.95);',
        'color:#C2185B;font-family:Poppins,sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.3px;',
        'padding:.3rem .65rem;border-radius:50px;box-shadow:0 2px 8px rgba(0,0,0,.15);white-space:nowrap}',
        '.pn-tag.pn-wk{color:#8E1450}',
        '.pn-old{color:#9b9b9b;text-decoration:line-through;font-weight:600;font-size:.9rem;margin-right:.35rem}',
        '.filter-btn[data-filter="frenesirosa"]{background:linear-gradient(135deg,#FF4F9A,#C2185B)!important;',
        'color:#fff!important;border-color:#C2185B!important;font-weight:600;background-size:200% 200%!important;animation:pnBtn 3s ease infinite}',
        '@keyframes pnBtn{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',

        /* ---------- Selector de tamaños (Ternura Rosada) ---------- */
        '.variant-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem;padding-top:.7rem;border-top:1px dashed rgba(224,69,123,.35)}',
        '.variant-chip{font-family:Poppins,sans-serif;cursor:pointer;background:#fff5f9;color:#8E1450;border:1px solid #f4bcd3;',
        'padding:.35rem .7rem;border-radius:50px;font-size:.76rem;font-weight:600;line-height:1.2;transition:all .2s ease}',
        '.variant-chip strong{margin-left:.25rem}',
        '.variant-chip:hover{border-color:#E0457B}',
        '.variant-chip.on{background:linear-gradient(135deg,#FF4F9A,#C2185B);color:#fff;border-color:transparent;box-shadow:0 4px 12px rgba(224,69,123,.35)}',

        /* ---------- Vitrina FRENESÍ ROSA ---------- */
        '.fr-show{position:relative;overflow:hidden;color:#fff;font-family:Poppins,sans-serif;padding:2.4rem 1rem 2.6rem;',
        'background:linear-gradient(125deg,#3b0a22,#8E1450,#C2185B,#E0457B,#8E1450);background-size:300% 300%;animation:frBg 14s ease infinite}',
        '@keyframes frBg{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
        '.fr-petals{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}',
        '.fr-petal{position:absolute;top:-30px;width:14px;height:18px;border-radius:70% 0 70% 0;opacity:.85;',
        'background:linear-gradient(135deg,#FFD6E7,#FF8FC0);animation:frFall linear infinite}',
        '@keyframes frFall{0%{transform:translate3d(0,-30px,0) rotate(0)}100%{transform:translate3d(60px,640px,0) rotate(540deg);opacity:0}}',
        '.fr-in{position:relative;z-index:1;max-width:1150px;margin:0 auto}',
        '.fr-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 1.5rem;margin-bottom:1.4rem}',
        '.fr-kicker{display:inline-block;font-size:.72rem;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;',
        'background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);padding:.3rem .8rem;border-radius:50px}',
        '.fr-title{font-family:"Playfair Display",Georgia,serif;font-size:3rem;font-weight:700;line-height:1;margin:.55rem 0 .45rem;',
        'background:linear-gradient(90deg,#fff 0%,#FFD6E7 30%,#fff 50%,#FFC2DA 70%,#fff 100%);background-size:200% auto;',
        '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:frShimmer 3.5s linear infinite;',
        'text-shadow:0 0 30px rgba(255,143,192,.35)}',
        '@keyframes frShimmer{to{background-position:200% center}}',
        '.fr-sub{font-size:.95rem;line-height:1.6;max-width:58ch;opacity:.95}',
        '.fr-side{display:flex;flex-direction:column;align-items:flex-start;gap:.6rem}',
        '.fr-hint{font-size:.66rem;letter-spacing:1.4px;text-transform:uppercase;opacity:.85}',
        '.pn-clock{display:flex;gap:.4rem}',
        '.pn-unit{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);border-radius:10px;min-width:54px;padding:.38rem .3rem;text-align:center}',
        '.pn-num{display:block;font-size:1.35rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}',
        '.pn-lbl{display:block;font-size:.58rem;letter-spacing:1px;text-transform:uppercase;opacity:.8;margin-top:.15rem}',
        '.fr-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.1rem}',
        '.fr-card{position:relative;background:#fff;color:#2c2c2c;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;',
        'box-shadow:0 14px 34px rgba(42,7,22,.35);transition:transform .25s ease,box-shadow .25s ease;animation:frIn .7s both}',
        '.fr-card:hover{transform:translateY(-6px) rotate(-.4deg);box-shadow:0 20px 40px rgba(42,7,22,.45)}',
        '@keyframes frIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}',
        '.fr-img{position:relative;aspect-ratio:1/1;overflow:hidden;background:#fde8f0}',
        '.fr-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}',
        '.fr-card:hover .fr-img img{transform:scale(1.07)}',
        '.fr-img::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.6),transparent);transform:skewX(-20deg);animation:pnShine 4.5s ease-in-out infinite}',
        '.fr-save{position:absolute;top:.7rem;left:.7rem;z-index:2;background:linear-gradient(135deg,#FF4F9A,#C2185B);color:#fff;',
        'font-weight:700;font-size:.74rem;padding:.35rem .7rem;border-radius:50px;box-shadow:0 4px 12px rgba(0,0,0,.25);animation:pnPulse 2.4s ease-in-out infinite}',
        '.fr-body{padding:.95rem 1rem 1.1rem;display:flex;flex-direction:column;gap:.35rem;flex:1}',
        '.fr-name{font-family:"Playfair Display",Georgia,serif;font-size:1.2rem;font-weight:700;color:#2a0716;line-height:1.2}',
        '.fr-hook{font-size:.8rem;color:#6b4a58;line-height:1.5;flex:1}',
        '.fr-row{display:flex;align-items:flex-end;justify-content:space-between;gap:.5rem;margin-top:.35rem}',
        '.fr-price{font-family:"Playfair Display",Georgia,serif;font-size:1.35rem;font-weight:700;color:#C2185B;line-height:1}',
        '.fr-row .pn-old{display:block;font-size:.8rem;margin:0 0 .15rem}',
        '.fr-btn{display:inline-flex;align-items:center;gap:.35rem;background:#25D366;color:#fff;text-decoration:none;',
        'font-weight:600;font-size:.78rem;padding:.55rem .9rem;border-radius:50px;white-space:nowrap;box-shadow:0 4px 12px rgba(37,211,102,.35)}',
        '.fr-btn svg{width:14px;height:14px;fill:currentColor}',
        '.fr-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.8rem;margin-top:1.4rem}',
        '.fr-all{background:#fff;color:#C2185B;border:0;cursor:pointer;font-family:inherit;font-weight:700;font-size:.88rem;',
        'padding:.75rem 1.4rem;border-radius:50px;box-shadow:0 6px 18px rgba(0,0,0,.25);transition:transform .18s ease}',
        '.fr-all:hover{transform:translateY(-2px)}',
        '.fr-wk{display:inline-flex;align-items:center;gap:.6rem;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);',
        'color:#fff;cursor:pointer;font-family:inherit;font-size:.85rem;font-weight:600;padding:.4rem .9rem .4rem .4rem;border-radius:50px;transition:background .2s ease}',
        '.fr-wk:hover{background:rgba(255,255,255,.24)}',
        '.fr-wk img{width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid #fff}',

        /* ---------- Flyer flotante ARREGLO DE LA SEMANA ---------- */
        '.wk-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;',
        'background:rgba(30,4,16,.74);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);opacity:0;visibility:hidden;',
        'transition:opacity .3s ease,visibility .3s ease;font-family:Poppins,sans-serif}',
        '.wk-modal.on{opacity:1;visibility:visible}',
        '.wk-box{position:relative;width:100%;max-width:880px;max-height:92vh;border-radius:22px;padding:3px;',
        'background:linear-gradient(120deg,#FF4F9A,#FFE3A3,#C9A86A,#FF8FC0,#FF4F9A);background-size:300% 300%;animation:frBg 6s linear infinite;',
        'box-shadow:0 30px 80px rgba(0,0,0,.5);transform:translate3d(0,30px,0) scale(.95);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)}',
        '.wk-modal.on .wk-box{transform:none}',
        '.wk-in{display:flex;background:#fff;border-radius:19px;overflow:hidden;max-height:calc(92vh - 6px)}',
        '.wk-fig{position:relative;flex:0 0 46%;background:#fde8f0;overflow:hidden}',
        '.wk-fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.04);transition:opacity .45s ease,transform .8s ease}',
        '.wk-fig img.on{opacity:1;transform:scale(1)}',
        '.wk-fig::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;z-index:2;pointer-events:none;',
        'background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:pnShine 4s ease-in-out infinite}',
        '.wk-off{position:absolute;top:.9rem;left:.9rem;z-index:3;width:74px;height:74px;border-radius:50%;display:flex;flex-direction:column;',
        'align-items:center;justify-content:center;background:radial-gradient(circle at 30% 30%,#FF7FB4,#C2185B);color:#fff;font-weight:800;',
        'font-size:1.25rem;line-height:1;box-shadow:0 6px 18px rgba(194,24,91,.5);animation:wkSpin 3s ease-in-out infinite}',
        '.wk-off small{font-size:.55rem;font-weight:600;letter-spacing:1px;margin-top:.15rem}',
        '@keyframes wkSpin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.08)}}',
        '.wk-txt{flex:1;min-width:0;padding:1.4rem 1.5rem 1.3rem;display:flex;flex-direction:column;gap:.55rem;overflow-y:auto}',
        '.wk-kicker{align-self:flex-start;font-size:.68rem;letter-spacing:2.2px;text-transform:uppercase;font-weight:700;color:#fff;',
        'background:linear-gradient(90deg,#8E1450,#E0457B,#C9A86A,#8E1450);background-size:300% 100%;animation:frBg 5s linear infinite;',
        'padding:.35rem .85rem;border-radius:50px}',
        '.wk-name{font-family:"Playfair Display",Georgia,serif;font-size:2rem;font-weight:700;color:#2a0716;line-height:1.05}',
        '.wk-hook{font-size:.88rem;color:#6b4a58;line-height:1.5}',
        '.wk-opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;margin-top:.2rem}',
        '.wk-opt{position:relative;cursor:pointer;font-family:inherit;text-align:center;background:#fff7fa;border:2px solid #f6c9db;',
        'border-radius:14px;padding:.65rem .35rem .55rem;transition:all .2s ease;color:#2a0716}',
        '.wk-opt:hover{border-color:#E0457B;transform:translateY(-2px)}',
        '.wk-opt.on{border-color:#C2185B;background:linear-gradient(160deg,#fff,#ffe3ee);box-shadow:0 6px 16px rgba(194,24,91,.22)}',
        '.wk-opt b{display:block;font-size:.95rem}',
        '.wk-opt span{display:block;font-family:"Playfair Display",Georgia,serif;font-weight:700;color:#C2185B;font-size:1.05rem;margin-top:.15rem}',
        '.wk-opt i{display:block;font-style:normal;font-size:.68rem;color:#9b9b9b;text-decoration:line-through}',
        '.wk-opt em{position:absolute;top:-.6rem;left:50%;transform:translateX(-50%);white-space:nowrap;font-style:normal;font-size:.56rem;',
        'font-weight:700;letter-spacing:.4px;text-transform:uppercase;background:#C9A86A;color:#fff;padding:.15rem .45rem;border-radius:50px}',
        '.wk-note{font-size:.82rem;color:#8E1450;font-weight:600;min-height:1.2em}',
        '.wk-prices{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap}',
        '.wk-new{font-family:"Playfair Display",Georgia,serif;font-size:2.1rem;font-weight:700;color:#C2185B;line-height:1}',
        '.wk-old{color:#9b9b9b;text-decoration:line-through;font-weight:600;font-size:1rem}',
        '.wk-save{background:#2a0716;color:#FFD6E7;font-weight:700;font-size:.74rem;padding:.25rem .6rem;border-radius:50px}',
        '.wk-cta{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;background:#25D366;color:#fff;text-decoration:none;',
        'font-weight:700;font-size:.95rem;padding:.8rem 1.2rem;border-radius:50px;margin-top:.15rem;animation:wkCta 2.2s ease-in-out infinite;',
        'box-shadow:0 6px 18px rgba(37,211,102,.4)}',
        '.wk-cta svg{width:18px;height:18px;fill:currentColor;flex-shrink:0}',
        '@keyframes wkCta{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}50%{box-shadow:0 0 0 12px rgba(37,211,102,0)}}',
        '.wk-clock{display:flex;align-items:center;gap:.35rem;flex-wrap:wrap;margin-top:.2rem}',
        '.wk-clock .fr-hint{color:#8E1450;opacity:1;font-weight:600;margin-right:.2rem}',
        '.wk-clock .pn-unit{background:#fff0f6;border-color:#f6c9db;color:#2a0716;min-width:48px}',
        '.wk-more{background:none;border:0;padding:0;cursor:pointer;font-family:inherit;color:#C2185B;font-size:.8rem;font-weight:600;text-decoration:underline;align-self:flex-start}',
        '.wk-x{position:absolute;top:-12px;right:-12px;z-index:6;width:38px;height:38px;border-radius:50%;border:0;cursor:pointer;',
        'background:#2a0716;color:#fff;font-size:1.4rem;line-height:1;display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 4px 12px rgba(0,0,0,.35);transition:transform .2s ease}',
        '.wk-x:hover{transform:rotate(90deg)}',

        /* ---------- Botón flotante (reabre el flyer) ---------- */
        '.wk-pill{position:fixed;left:18px;bottom:22px;z-index:9990;display:flex;align-items:center;gap:.55rem;cursor:pointer;',
        'font-family:Poppins,sans-serif;background:linear-gradient(135deg,#FF4F9A,#C2185B);color:#fff;border:0;border-radius:50px;',
        'padding:.35rem .95rem .35rem .35rem;box-shadow:0 8px 24px rgba(194,24,91,.45);transform:translateY(120px);',
        'transition:transform .45s cubic-bezier(.2,.9,.3,1.2);text-align:left}',
        '.wk-pill.on{transform:none;animation:wkFloat 3s ease-in-out infinite .5s}',
        '@keyframes wkFloat{0%,100%{translate:0 0}50%{translate:0 -5px}}',
        '.wk-pill img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #fff;flex-shrink:0}',
        '.wk-pill small{display:block;font-size:.6rem;letter-spacing:1.4px;text-transform:uppercase;opacity:.9;font-weight:600}',
        '.wk-pill b{display:block;font-size:.85rem;line-height:1.2}',
        '.wk-pill-x{position:absolute;top:-7px;right:-7px;width:20px;height:20px;border-radius:50%;background:#2a0716;color:#fff;',
        'font-size:.8rem;line-height:20px;text-align:center}',

        /* ---------- Responsive ---------- */
        '@media(max-width:900px){.fr-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.fr-title{font-size:2.4rem}}',
        '@media(max-width:720px){',
        '.fr-show{padding:1.8rem 0 2rem}',
        '.fr-head,.fr-foot{padding:0 1rem}',
        '.fr-title{font-size:2.1rem}',
        '.fr-sub{font-size:.86rem}',
        '.fr-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:.8rem;padding:.3rem 1rem .6rem;-webkit-overflow-scrolling:touch}',
        '.fr-card{flex:0 0 74%;scroll-snap-align:start}',
        '.pn-unit{min-width:46px}.pn-num{font-size:1.1rem}',
        '.wk-box{max-height:94vh}',
        '.wk-in{flex-direction:column;overflow-y:auto;max-height:calc(94vh - 6px)}',
        '.wk-fig{flex:0 0 auto;height:230px}',
        '.wk-txt{overflow:visible;padding:1rem 1rem 1.1rem}',
        '.wk-name{font-size:1.6rem}.wk-new{font-size:1.8rem}',
        '.wk-off{width:62px;height:62px;font-size:1.05rem}',
        '.wk-x{top:6px;right:6px}',
        '.wk-pill{left:12px;bottom:16px}',
        '.pn-ribbon{font-size:.7rem;padding:.35rem .6rem}',
        '.pn-tag{font-size:.64rem}',
        '}',
        '@media(prefers-reduced-motion:reduce){',
        '.pn-card,.pn-ribbon,.fr-show,.fr-title,.fr-card,.fr-save,.fr-petal,.wk-box,.wk-off,.wk-cta,.wk-kicker,.wk-pill.on,',
        '.filter-btn[data-filter="frenesirosa"],.fr-img::after,.wk-fig::after,.pn-card .product-image-container::after,.pn-card .product-image::after{animation:none!important}',
        '.fr-petals{display:none}',
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
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function clockHTML(prefix) {
        return '<div class="pn-clock">' + ['d', 'h', 'm', 's'].map(function (u, i) {
            return '<div class="pn-unit"><span class="pn-num" data-c="' + prefix + '-' + u + '">--</span>'
                + '<span class="pn-lbl">' + ['Días', 'Horas', 'Min', 'Seg'][i] + '</span></div>';
        }).join('') + '</div>';
    }
    var clockTimer = null;
    function tick() {
        var ms = Math.max(0, PROMO_END - Date.now());
        var s = Math.floor(ms / 1000);
        var v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
        document.querySelectorAll('[data-c]').forEach(function (el) {
            el.textContent = pad(v[el.getAttribute('data-c').split('-')[1]]);
        });
        if (!isLive()) shutdown();
    }
    function startClock() { if (!clockTimer) { tick(); clockTimer = setInterval(tick, 1000); } }
    function shutdown() {
        ['fr-show', 'wk-modal', 'wk-pill'].forEach(function (id) { var el = document.getElementById(id); if (el) el.remove(); });
        hideFilter();
        document.body.style.overflow = '';
        if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    }
    function hideFilter() {
        document.querySelectorAll('.filter-btn[data-filter="frenesirosa"]').forEach(function (b) { b.style.display = 'none'; });
    }

    var WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>';

    // ---------------------------------------------------------------
    // 5. VITRINA FRENESÍ ROSA
    // ---------------------------------------------------------------
    function anchorNode() { return document.querySelector('.catalog-hero') || document.querySelector('.hero'); }
    function insertAfterHero(el) {
        var a = anchorNode();
        if (a && a.parentNode) { a.parentNode.insertBefore(el, a.nextSibling); return; }
        var grid = document.getElementById('products-grid') || document.querySelector('.products-container');
        var host = grid ? (grid.closest('section') || grid.parentNode) : null;
        if (host && host.parentNode) host.parentNode.insertBefore(el, host); else document.body.insertBefore(el, document.body.firstChild);
    }

    function petalsHTML() {
        var out = '';
        for (var i = 0; i < 16; i++) {
            var left = (i * 6.3 + (i % 3) * 2) % 100;
            var dur = 7 + (i % 5) * 1.6;
            var delay = -(i * 1.1);
            var size = 10 + (i % 4) * 3;
            out += '<span class="fr-petal" style="left:' + left + '%;width:' + size + 'px;height:' + Math.round(size * 1.3) + 'px;'
                + 'animation-duration:' + dur + 's;animation-delay:' + delay + 's"></span>';
        }
        return '<div class="fr-petals" aria-hidden="true">' + out + '</div>';
    }

    function buildRosaShow() {
        if (document.getElementById('fr-show')) return;
        var cards = ROSA_ITEMS.map(function (it, i) {
            return '<article class="fr-card" style="animation-delay:' + (i * 0.08) + 's">'
                + '<div class="fr-img"><span class="fr-save">Ahorras ' + fmt(it.before - it.price) + '</span>'
                + '<img src="' + it.img + '" alt="' + it.name + ' — rosas rosadas en promoción, flores a domicilio en Bogotá" loading="lazy" decoding="async"></div>'
                + '<div class="fr-body">'
                + '<div class="fr-name">' + it.name + '</div>'
                + '<div class="fr-hook">' + it.hook + '</div>'
                + '<div class="fr-row"><div><span class="pn-old">Antes ' + fmt(it.before) + '</span>'
                + '<span class="fr-price">' + fmt(it.price) + '</span></div>'
                + '<a class="fr-btn" href="' + waRosa(it) + '" target="_blank" rel="noopener">' + WA_SVG + 'Lo quiero</a></div>'
                + '</div></article>';
        }).join('');
        var sec = document.createElement('section');
        sec.id = 'fr-show';
        sec.className = 'fr-show';
        sec.innerHTML = petalsHTML()
            + '<div class="fr-in">'
            + '<div class="fr-head"><div>'
            + '<span class="fr-kicker">🌸 Precios rebajados · solo hasta el ' + END_TXT + '</span>'
            + '<h2 class="fr-title">Frenesí Rosa</h2>'
            + '<p class="fr-sub">Las rosas rosadas dicen “me encantas” sin que tengas que decir nada. '
            + 'Esta semana nuestros 6 arreglos de rosas rosadas más pedidos bajan de precio: antes costaban un 20&nbsp;% más. '
            + 'Cuando el contador llegue a cero, se acaba.</p>'
            + '</div>'
            + '<div class="fr-side"><span class="fr-hint">La promoción termina en</span>' + clockHTML('fr') + '</div>'
            + '</div>'
            + '<div class="fr-grid">' + cards + '</div>'
            + '<div class="fr-foot">'
            + '<button type="button" class="fr-wk" id="fr-wk"><img src="' + WEEK_MIN.src + '" alt="">'
            + '<span>⭐ Además: <strong>Arreglo de la semana</strong> desde ' + fmt(WEEK_MIN.price) + ' →</span></button>'
            + (document.querySelector('.filter-btn[data-filter="frenesirosa"]')
                ? '<button type="button" class="fr-all" id="fr-all">Ver Frenesí Rosa en el catálogo</button>' : '')
            + '</div>'
            + '</div>';
        insertAfterHero(sec);
        document.getElementById('fr-wk').addEventListener('click', function () { openFlyer(true); });
        var all = document.getElementById('fr-all');
        if (all) all.addEventListener('click', function () { goToFilter('frenesirosa'); });
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
    // 6. FLYER FLOTANTE — ARREGLO DE LA SEMANA (solo Ternura Rosada)
    // ---------------------------------------------------------------
    var SEEN_KEY = 'gg-arreglo-semana-visto';
    var flyer = null;

    function buildFlyer() {
        if (document.getElementById('wk-modal')) return;
        var modal = document.createElement('div');
        modal.id = 'wk-modal';
        modal.className = 'wk-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Arreglo de la semana: Ternura Rosada');
        modal.innerHTML =
            '<div class="wk-box">'
            + '<button type="button" class="wk-x" id="wk-x" aria-label="Cerrar">&times;</button>'
            + '<div class="wk-in">'
            + '<div class="wk-fig"><span class="wk-off">-' + WEEK_OFF + '%<small>OFERTA</small></span>'
            + WEEK.variants.map(function (v, i) {
                return '<img data-i="' + i + '" ' + (i === 0 ? 'class="on" src' : 'data-src') + '="' + v.src + '" alt="Ternura Rosada con ' + v.label + ' — arreglo de la semana, Bogotá" decoding="async">';
            }).join('')
            + '</div>'
            + '<div class="wk-txt">'
            + '<span class="wk-kicker">⭐ Arreglo de la semana</span>'
            + '<div class="wk-name">' + WEEK.name + '</div>'
            + '<div class="wk-hook">' + WEEK.hook + '</div>'
            + '<div class="wk-opts">' + WEEK.variants.map(function (v, i) {
                return '<button type="button" class="wk-opt' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">'
                    + (v.badge ? '<em>' + v.badge + '</em>' : '')
                    + '<b>' + v.label + '</b><span>' + fmt(v.price) + '</span><i>' + fmt(v.before) + '</i></button>';
            }).join('') + '</div>'
            + '<div class="wk-note" id="wk-note"></div>'
            + '<div class="wk-prices"><span class="wk-old" id="wk-old"></span><span class="wk-new" id="wk-new"></span>'
            + '<span class="wk-save" id="wk-save"></span></div>'
            + '<a class="wk-cta" id="wk-cta" href="#" target="_blank" rel="noopener">' + WA_SVG + '<span>Lo quiero — pedir por WhatsApp</span></a>'
            + '<div class="wk-clock"><span class="fr-hint">El precio especial termina en</span>' + clockHTML('wk') + '</div>'
            + (document.getElementById('fr-show') ? '<button type="button" class="wk-more" id="wk-more">Ver también el Frenesí Rosa 🌸</button>' : '')
            + '</div></div></div>';
        document.body.appendChild(modal);

        var imgs = modal.querySelectorAll('.wk-fig img');
        var opts = modal.querySelectorAll('.wk-opt');
        function pick(i) {
            var v = WEEK.variants[i];
            imgs.forEach(function (im) {
                var on = +im.getAttribute('data-i') === i;
                if (on && !im.getAttribute('src')) im.setAttribute('src', im.getAttribute('data-src'));
                im.classList.toggle('on', on);
            });
            opts.forEach(function (o) { o.classList.toggle('on', +o.getAttribute('data-i') === i); });
            document.getElementById('wk-note').textContent = v.label + ' · ' + v.note;
            document.getElementById('wk-old').textContent = fmt(v.before);
            document.getElementById('wk-new').textContent = fmt(v.price);
            document.getElementById('wk-save').textContent = 'Ahorras ' + fmt(v.before - v.price);
            document.getElementById('wk-cta').href = waWeek(v);
        }
        opts.forEach(function (o) { o.addEventListener('click', function () { pick(+o.getAttribute('data-i')); }); });
        pick(0);
        // Precarga las otras dos fotos sin bloquear
        setTimeout(function () {
            imgs.forEach(function (im) { if (!im.getAttribute('src')) im.setAttribute('src', im.getAttribute('data-src')); });
        }, 2500);

        function close() {
            modal.classList.remove('on');
            document.body.style.overflow = '';
            try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { }
            document.removeEventListener('keydown', onKey);
            showPill();
        }
        function onKey(e) { if (e.key === 'Escape') close(); }
        document.getElementById('wk-x').addEventListener('click', close);
        modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
        var more = document.getElementById('wk-more');
        if (more) more.addEventListener('click', function () {
            close();
            var sec = document.getElementById('fr-show');
            if (sec) setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
        });

        flyer = {
            open: function () {
                hidePill();
                modal.classList.add('on');
                document.body.style.overflow = 'hidden';
                document.addEventListener('keydown', onKey);
            }
        };
    }

    function openFlyer() { if (!flyer) buildFlyer(); if (flyer) flyer.open(); }

    function buildPill() {
        if (document.getElementById('wk-pill')) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'wk-pill';
        b.className = 'wk-pill';
        b.setAttribute('aria-label', 'Ver el arreglo de la semana');
        b.innerHTML = '<img src="' + WEEK_MIN.src + '" alt=""><span><small>⭐ Arreglo de la semana</small>'
            + '<b>Ternura Rosada desde ' + fmt(WEEK_MIN.price) + '</b></span>'
            + '<span class="wk-pill-x" id="wk-pill-x" aria-label="Ocultar">&times;</span>';
        document.body.appendChild(b);
        b.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'wk-pill-x') {
                e.stopPropagation();
                hidePill();
                try { sessionStorage.setItem('gg-pill-oculto', '1'); } catch (er) { }
                return;
            }
            openFlyer();
        });
    }
    function showPill() {
        try { if (sessionStorage.getItem('gg-pill-oculto') === '1') return; } catch (e) { }
        buildPill();
        var p = document.getElementById('wk-pill');
        if (p) setTimeout(function () { p.classList.add('on'); }, 300);
    }
    function hidePill() { var p = document.getElementById('wk-pill'); if (p) p.classList.remove('on'); }

    // ---------------------------------------------------------------
    // 7. ARRANQUE
    // ---------------------------------------------------------------
    function boot() {
        if (!isLive()) { hideFilter(); return; }
        buildRosaShow();
        buildFlyer();
        var seen = false;
        try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) { }
        if (seen) showPill();
        else setTimeout(function () { if (isLive()) openFlyer(); }, 1800);
        startClock();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
