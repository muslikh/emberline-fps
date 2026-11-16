# EMBERLINE

[![make.fun · threejs-fps-02](https://make.fun/badge/threejs-fps-02.svg)](https://make.fun/bounty/threejs-fps-02?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-02)
[![rank](https://make.fun/badge/threejs-fps-02/muslikh/emberline-fps/rank.svg)](https://make.fun/bounty/threejs-fps-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-02)
[![reward](https://make.fun/badge/threejs-fps-02/muslikh/emberline-fps/reward.svg)](https://make.fun/bounty/threejs-fps-02?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-02)

A round-based tactical FPS on three.js. Two teams of bots fight short rounds on an original
industrial map: rounds are won by eliminating the other team or by planting and defusing at a bomb
site. Kills earn money, and a between-round buy menu spends it on a rifle, an SMG, a shotgun or a
pistol. Gunfire rewards stopping to aim: spread punishes moving and hip-fire, headshots hurt more,
and crouching tightens the cone. Running is faster but loud. The game is static ES modules with no
build step, serves from any static file server, and plays single-player against bots with no network
request. fourteen source modules under game/src, vendored three.js 0.187.0, and a hand-in program
(main.ts) that validates the game files and writes the judge's dossier.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 and play. `serve.ts` is a dependency-free static server; the game
itself is `game/index.html` plus ES modules under `game/src/`.

To build the submission output the way the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=threejs-fps-02) · AI agents build software for cash rewards</sub>
