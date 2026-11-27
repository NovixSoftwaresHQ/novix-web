# About-page character: source and changes

`interactive-character-follow.original.riv` is the unmodified public runtime file from the Rive marketplace listing
(downloaded 26 November 2026, SHA-256 f064f4cfa73bcabaff7a6970cf0032792018c4b7a237f1f320822bc09066e030).
It is **not** the editable Rive source: "Remix in Rive" needs a Rive account, which was not available.

`public/mascot/novix-character.riv` was made by rewriting values inside a copy of that file. Size, objects and
structure are identical; 38 values differ (checked property by property):

| Change | Count |
|---|---|
| Hair fills to jade `#7BC6A4` (components 16, 23, 30, 37, 46, 55, 212, 219 of artboard `Artboard`) | part of 35 |
| Face, ear, nose and neck fills to ivory `#F0EBDD` | part of 35 |
| Outlines, glasses, eyes and mouth to forest `#183A2C` | part of 35 |
| Translucent black shadows to `#64A5A1` at 30% (equals sage `#C6D6CB` over ivory) | part of 35 |
| `Blinking` animation: loop to play once | 1 |
| Left/right state transitions: 500 ms to 300 ms | 2 |

## What the file contains

- Artboards: `Main artboard` (1600 x 1200, includes the white preview panel; not used) and `Artboard`
  (1000 x 1000, transparent; used). State machine in both: `State Machine 1`.
- Inputs of `Artboard`: booleans `Heade hover` (spelled this way; no transition uses it) and `Right left`.
  There are no pointer-position inputs. One view model with no bound properties is present.
- Listeners: pointer move aligns a hidden target (drives a joystick and an IK head constraint); two zones set
  `Right left`; head enter/exit set `Heade hover`.
- Leaving the canvas does not reset the pose. Neutral = pointer at artboard point (482.5, 142.5).
- Three embedded greyscale PNGs of the original artwork are not drawn by `Artboard`; they were left in place.

## The still poster

`public/mascot/character-neutral.png` is the square at x 275, y 200, 500 units wide, of `Artboard`, rendered at
480 x 480 with `@rive-app/canvas-lite` once the one-time blink has finished. `.mascot-canvas` in `src/index.css` shows
the same square. Keep x and y at multiples of 25, so that the crop falls on whole pixels at both slot sizes (120 and
140 px). Otherwise the figure shifts slightly when the live canvas replaces the poster.

## If you export from the editor instead

Remix the listing, apply the same colours, export, and replace `public/mascot/novix-character.riv`. Keep the
artboard and state machine names, or update `AboutCharacterRive.jsx`. Re-render the poster from the new file and
re-check the crop (`.mascot-canvas`) and ranges (`src/lib/mascot/follow.js`). Exports from Rive's free plan show
a Rive splash screen.
