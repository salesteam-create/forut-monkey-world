# Monkis verden (Monki's World), concept prototype

A clickable v1 concept for FORUT Barneaksjonen's home platform, built for the pitch.
Mobile-first web app, Norwegian by default with an English toggle.

## Run it

No build step. From the repo root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 on a phone (same network) or in a desktop browser (it shows a phone frame).

## The demo flow

1. **Welcome**: the family arrives from the QR code on the kindergarten take-home card.
2. **Jungle hub**: Monki greets the child (tap Monki to hear it again). Tap the friends to hear where they come from.
3. **Dagens oppdrag**: "Monki kommer hjem". The child drags boots, jacket, hat and backpack into place.
4. **Nå er det din tur**: the same mission in real life. The parent confirms, with an optional photo.
5. **Celebration**: a banana for the tree. The demo starts at 17 of 24, so the first mission unlocks the sticker reward.
6. **Følelser**: pick a feeling face, and Monki answers and gives the grown-up a conversation starter (ties to the Nepal 2027/28 feelings theme).
7. **Bananatreet**: monthly goal of 24, a calendar of active days, and rewards (song, colouring sheet, stickers, Cewe photo card). No streaks to lose.
8. **For voksne**: behind a hold-for-3-seconds parent gate. Weekly summary, screen time, photos, settings, and why there are no ads or algorithms.

"Nullstill demo" at the bottom of the parent area resets everything.

## Notes

- Monki speaks through the browser's built-in speech. Quality depends on the device. Safari on iPhone has a decent Norwegian voice; some desktop browsers have none. Use the sound button to mute.
- Progress and photos are stored only in the browser (localStorage). Nothing is sent anywhere.
- Character images are cut out of FORUT's briefing deck and are low resolution. Swap in the design team's files in `assets/characters/` using the same file names.
- The hallway, items, faces and banana tree are placeholder SVGs in `js/art.js`, drawn to match the character style.
- All copy is in `js/i18n.js`.

## Structure

```
index.html          page shell
css/app.css         all styles
js/i18n.js          Norwegian and English copy
js/art.js           inline SVG illustrations
js/app.js           screens, game logic, state
assets/characters/  Monki, Yanay, Orbai, Suala, Palaiya
assets/brand/       FORUT logo
```
