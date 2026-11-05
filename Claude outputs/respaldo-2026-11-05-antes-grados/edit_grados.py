import re, sys, os, glob, io

os.chdir(sys.argv[1])

def rd(p): return io.open(p, encoding='utf-8').read()
def wr(p, s): io.open(p, 'w', encoding='utf-8', newline='').write(s)

# foto -> (precio nuevo, rango de precio)
NEW = {
    'foto38': 78000,   # Ternura Rosada
    'foto69': 78000,   # Perlas de Sol
    'foto30': 95000,   # Suspiro Rosado
    'foto59': 105000,  # Sol de tu Sonrisa
    'foto60': 110000,  # Latido Fucsia
    'foto50': 125000,  # Girasol Imperial
    'foto45': 165000,  # Caja Romántica con Chocolates
}
def bucket(p):
    return 'precio-bajo' if p < 100000 else ('precio-medio' if p <= 200000 else 'precio-alto')

def fix_cats(cats_src, price):
    cats = [c.strip().strip('"') for c in cats_src.split(',') if c.strip()]
    cats = [c for c in cats if not c.startswith('precio-') and c != 'grados']
    cats = ['grados'] + cats + [bucket(price)]
    return ', '.join('"%s"' % c for c in cats)

def apply_products(s, prefix):
    for key, price in NEW.items():
        pat = re.compile(
            r'(price:\s*)(\d+)(,\s*image:\s*"' + re.escape(prefix) + key + r'\.webp",\s*description:\s*"[^"]*",\s*categories:\s*\[)([^\]]*)(\])')
        s, n = pat.subn(lambda m: m.group(1) + str(price) + m.group(3) + fix_cats(m.group(4), price) + m.group(5), s)
        if n != 1:
            raise SystemExit('%s: %d coincidencias' % (key, n))
    return s

FILTER_RE = re.compile(r'[ \t]*<button class="filter-btn filter-btn-amor" data-filter="amoramistad">💝 Amor y Amistad</button>\r?\n([ \t]*)<button class="filter-btn filter-btn-amarillas" data-filter="amarillas">🌻 Flores Amarillas</button>')
def filters(s, p):
    s, n = FILTER_RE.subn(lambda m: m.group(1) + '<button class="filter-btn filter-btn-grados" data-filter="grados">🎓 Para Grado</button>', s)
    if n != 1:
        raise SystemExit('filtros %s: %d' % (p, n))
    return s

s = rd('catalogo.html')
s = apply_products(s, 'assets/')
s = filters(s, 'catalogo.html')
s = s.replace('// AMOR Y AMISTAD + FLORES AMARILLAS: los destacados suben al tope',
              '// ARREGLOS PARA GRADO: los destacados suben al tope (orden en js/promo-semana.js)')
wr('catalogo.html', s); print('catalogo.html OK')

s = rd('js/landing.js')
s = apply_products(s, '../assets/')
s = s.replace('// AMOR Y AMISTAD + FLORES AMARILLAS: los destacados suben al tope conservando el orden por precio',
              '// ARREGLOS PARA GRADO: los destacados suben al tope (orden en js/promo-semana.js)')
s = s.replace('// ¿Está este producto en Amor y Amistad o en Flores Amarillas?', '// ¿Es uno de los arreglos para grado?')
wr('js/landing.js', s); print('landing.js OK')

for p in sorted(glob.glob('landing/*.html')):
    wr(p, filters(rd(p), p)); print(p, 'OK')
