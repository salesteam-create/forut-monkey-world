#!/usr/bin/env python3
"""Generate every spoken line with ElevenLabs and write the files the app plays.

  export ELEVENLABS_API_KEY=...        (set in the environment, never commit it)
  python3 tools/generate_voice.py                  # all lines, both languages
  python3 tools/generate_voice.py --demo           # only the demo lines
  python3 tools/generate_voice.py --lang no        # one language
  python3 tools/generate_voice.py --force          # overwrite existing files

Voices per character are set in tools/voices.json (ElevenLabs voice IDs). Afterwards the
manifest is rebuilt automatically, so the app picks the files up straight away.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import voice  # noqa: E402  (load_lines, manifest)

ROOT = voice.ROOT
API = 'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128'
# multilingual_v2 has no Norwegian and reads Bokmål with a Danish accent, so Norwegian
# uses Flash v2.5 with the language set explicitly.
MODELS = {'no': 'eleven_flash_v2_5', 'en': 'eleven_multilingual_v2'}
LANGUAGE_CODES = {'no': 'no'}

# Slower, steadier delivery for Palaiya; livelier for Monki.
SETTINGS = {
    'Monki': {'stability': 0.4, 'similarity_boost': 0.75, 'style': 0.45, 'use_speaker_boost': True},
    'Palaiya': {'stability': 0.75, 'similarity_boost': 0.75, 'style': 0.15, 'use_speaker_boost': True},
    'default': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3, 'use_speaker_boost': True},
}


def synth(key, voice_id, text, settings, lang):
    payload = {'text': text, 'model_id': MODELS[lang], 'voice_settings': settings}
    if lang in LANGUAGE_CODES:
        payload['language_code'] = LANGUAGE_CODES[lang]
    body = json.dumps(payload).encode()
    req = urllib.request.Request(API.format(voice_id=voice_id), data=body, method='POST', headers={
        'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                time.sleep(2 ** (attempt + 1))
                continue
            raise SystemExit(f'ElevenLabs returned {e.code}: {e.read().decode(errors="replace")[:300]}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lang', choices=['no', 'en'])
    ap.add_argument('--demo', action='store_true')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()

    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        raise SystemExit('Set ELEVENLABS_API_KEY in the environment first.')
    voices = json.loads((ROOT / 'tools' / 'voices.json').read_text())

    lines = [l for l in voice.load_lines() if l['demo'] or not args.demo]
    langs = [args.lang] if args.lang else ['no', 'en']
    made = skipped = chars = 0
    for lang in langs:
        out_dir = voice.VOICE / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        for l in lines:
            out = out_dir / f"{l['file']}.mp3"
            if out.exists() and not args.force:
                skipped += 1
                continue
            voice_id = voices.get(l['char']) or voices['default']
            text = l[lang]
            out.write_bytes(synth(key, voice_id, text, SETTINGS.get(l['char'], SETTINGS['default']), lang))
            made += 1
            chars += len(text)
            print(f'{lang}/{out.name}')
    print(f'Generated {made} files ({chars} characters), skipped {skipped} existing.')
    voice.manifest(credit=True if made else None)


if __name__ == '__main__':
    main()
