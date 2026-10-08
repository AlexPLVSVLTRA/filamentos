# Vídeo promocional · Llavero NOAH

`llavero-noah-promo.mp4` — 1080×1920 (vertical, 9:16), 30 fps, 14 s, sin audio.

Secuencia: foto de los llaveros → zoom al llavero NOAH → escena 3D (la mano coge las llaves de la mesa) → la mano mete las llaves en el bolsillo del vaquero y el llavero queda colgando por fuera → cierre con «Tu nombre, siempre contigo · 3DREAM».

## Regenerar

`source/promo.html` es una escena three.js que se renderiza fotograma a fotograma con `source/render.mjs` (Playwright + Chromium).

1. En la carpeta de trabajo: `npm install three@0.169.0`, y copia `Inter-Black.otf` y la foto como `photo.webp`.
2. `python3 -m http.server 8123`
3. `node render.mjs all` (genera `frames/`)
4. `ffmpeg -framerate 30 -i frames/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 19 llavero-noah-promo.mp4`
