# super-radical-tapper

## Overview
This is just a little game I built for fun and to serve as a way to practice my game design and development skills. Play as Edgar, the familar to renown wizard Trizolam. One day, while his master stepped out of the Summoning Chamber to use the chamber pot, Edgar decided to redecorate the desk and knocked over several vials. The concoctions crashed about, mixing and creating several small portals to another dimension. Suddenly, out of the portals start pouring numerous tiny fae creatures known as Radicals. Edgar must beat back the hordes and close the portals before his master returns. 

## Game Design
While mechanically the game is similar to Whack-a-mole, it's actually based on the Serial Reaction Task used in psychological testing. Gameplay start with the player running through a repeating pattern of cues. After the pattern has repeated a number of times, the presentation mode changes to a purely random sequence for an equal amount of time before going back. Missing an input, either via incorrect input or by missing the response window causes health to deplete. Once health reaches 0, gameplay ends. Scores are based on response time. As the number of correct inputs increases, the response collection window decress reguarly until a floor is reached.

## Development
- NPM scripts:
  - `npm dev`: runs the vite bundler in watcher mode
  - `npm run dev:server`: Runs a local server
  - Use two terminals: one running `dev` and one running `dev:server` to enable continuous build/deploy while working locally
- CI/CD utilizing GitHub Actions
  - build-deploy: Runs a build and test on any PRs to `main` and on commits to `main`; deployment to GitHub Pages run on commits to `main`

## Credits:
- Font - [Clarity](https://gossamore.itch.io/clarity) by Gossamore on itch.io
- Srites:
  - Characters - [Bit Bonanza](https://v3x3d.itch.io/bit-bonanza) by VEXED on itch.io
  - Background - [Stonelands RPG Assets](https://chasersgaming.itch.io/rpg-assets-tile-set-stonelands-nes) by chasersgaming on itch.io
  - Portal Sprites [32x32 2D Portal Asset Pack](https://actuallykron.itch.io/32x32-2d-portal-asset-pack) by PixelZoink & actuallyKron on itch.io
- UI - RPG UI pack from [Kenney](https://kenney.nl)
- Sound:
  - Effects [Retro Game Weapons Sound Effects](https://happysoulmusic.com/retro-game-weapons-sound-effects/) on Happy Soul Music
  - Background Music:
    - Game - [Dark Dragon](https://fatalexit.itch.io/dark-dragon-royalty-free-cca-chiptune-music-for-games) by [Fatal Exit](https://cilliancreates.itch.io/) on itch.io
