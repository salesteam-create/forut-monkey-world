# Monkis verden (Monki's World), concept prototype

A clickable v1 concept for FORUT Barneaksjonen's home platform, built for the pitch.
Mobile-first web app, Norwegian by default with an English toggle.

## Live demo

https://salesteam-create.github.io/forut-monkey-world/ (served by GitHub Pages from this branch).

## Run it

No build step. From the repo root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 on a phone (same network) or in a desktop browser (it shows a phone frame).

## The demo flow

The demo starts at 17 of 24 bananas, so three activities walk through every unlock.

1. **Welcome**: the family arrives from the QR code on the kindergarten take-home card.
2. **Jungle hub**: Monki greets the child (tap Monki to hear it again). Activities are grouped into FORUT's three outlets: Play, Feelings and Together.
3. **Dagens oppdrag**: "Monki kommer hjem". The child drags boots, jacket, hat and backpack into place, then does the same at home. Banana 18 unlocks stickers, and a bird moves into the jungle.
4. **Skattejakt** (Play): go outside and find something red, soft, round and a leaf, with an optional photo for Play Day.
5. **Pust med Palaiya** (Feelings): three slow guided breaths with the turtle. Banana 20 unlocks the secret friend's postcard from Nepal.
6. **Følelser** (Feelings): pick a feeling face and get a conversation starter for the grown-up.
7. **Sanger og filmer** (Play): an ad-free list of FORUT content. Each item ends with an off-screen follow-up ("stomp like an elephant"), and only that earns a banana. The Play Day film is the real FORUT link; the others are marked as examples.
8. **Bananatreet**: monthly goal of 24, active-day calendar, rewards, the national banana tree counting down to Play Day (example figures), and a printable fridge chart.
9. **For voksne**: behind a hold-for-3-seconds gate. Weekly summary, screen-time limit (5, 10 or 15 min), photos, settings, and a button to show the goodnight screen.
10. **God natt, Monki**: when the screen-time limit is reached, Monki falls asleep and suggests something to do offline. A grown-up can hold to continue.

**Growing jungle**: the hub gains flowers (6 bananas), butterflies (12), a bird (18) and a waterfall (24), and Monki points out each change.

"Nullstill demo" at the bottom of the parent area resets everything.

## Notes

- Voice: see "Voice recordings" below. Until lines are recorded, Monki speaks through the device's built-in voice, which varies by device. Use the sound button to mute.
- Progress and photos are stored only in the browser (localStorage). Nothing is sent anywhere.
- Character images are cut out of FORUT's briefing deck and are low resolution. Swap in the design team's files in `assets/characters/` using the same file names.
- The hallway, items, faces and banana tree are SVGs in `js/art.js`, drawn to match the character style. The banana tree is the most finished; the rest are placeholders.
- The secret Nepal friend is a silhouette on purpose. FORUT creates the real character.
- The national banana total and the partner idea are example figures for the pitch.
- The fridge chart is drawn on a canvas. "Skriv ut" prints it on a normal web host; inside a claude.ai artifact printing is blocked, so press and hold the image to save it instead.
- All copy is in `js/i18n.js`.

## Voice recordings

Every spoken line can be replaced with a recorded audio file. Lines without a file keep using the device voice, so recordings can be added a few at a time.

1. Open `voice/voice-script.xlsx`. It lists all 43 lines in Norwegian and English with the character, screen, tone and file name. The 21 yellow rows are the ones heard in the pitch walkthrough: record those first. The second tab has recording tips.
2. Save each line as its own file named as in the sheet (for example `hubGreeting.mp3`; `.m4a` from an iPhone voice memo also works). Norwegian goes in `assets/voice/no/`, English in `assets/voice/en/`.
3. Run `python3 tools/voice.py manifest` so the app knows which files exist, then commit.

**Generated voices instead of recordings:** with an ElevenLabs API key in the environment (`ELEVENLABS_API_KEY`) and `api.elevenlabs.io` allowed on the network, set the voice IDs in `tools/voices.json` and run `python3 tools/generate_voice.py` (add `--demo` for just the demo lines). It writes the files and rebuilds the manifest.

If any copy in `js/i18n.js` changes, run `python3 tools/voice.py script` to regenerate the sheet. The list of spoken lines is in `js/voice-lines.js`.

## Structure

```
index.html          page shell
css/app.css         all styles
js/i18n.js          Norwegian and English copy
js/voice-lines.js   every spoken line, with character and tone notes
js/art.js           inline SVG illustrations
js/app.js           screens, game logic, state
assets/characters/  Monki, Yanay, Orbai, Suala, Palaiya
assets/brand/       FORUT logo
```
