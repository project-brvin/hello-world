# BRɅIN — Neural Network Prototype

This isolated feature ports the visual structure and neural-network experience of [RichardGeorgeDavis/Neural-Network-Prototype](https://github.com/RichardGeorgeDavis/Neural-Network-Prototype) into the `project-brvin/hello-world` repository.

## Default experience

The root route is intentionally styled after the supplied live prototype:

- Full-viewport near-black canvas (`#111113`) with no BRɅIN landing hero or custom HUD.
- Original `dat.GUI` library and Info / Settings folders.
- Original `Stats.js` performance panel.
- Original brain point-cloud vertex dataset.
- White neurons, axons, and traveling signals by default.
- Same settings labels and default values from the prototype's `gui.js`.

The default route is `/` on the dedicated `brain-universal-preview` Worker.

## Neural model and simulation

The original `models/brain_vertex_low.obj` contributes 14,481 3D vertex positions. The Canvas renderer samples every second vertex on desktop and every fourth vertex on mobile. It builds axon links using the original graph constraints:

- Maximum connection distance: 10 model units.
- Maximum connections per neuron: 6.
- Random cubic Bézier control points.
- Signal speed range: 1.75–3.25.
- Maximum active signal count: 3,000 by default.
- Signals propagate between connected neurons and cause further neuron firing.

The graph builder uses a spatial grid to avoid the original all-pairs distance scan. The renderer is Canvas 2D rather than the source project's legacy WebGL runtime, so it does not require WebGL. It retains orbit drag, wheel zoom, and touch pinch zoom.

## Vendor files and attribution

`vendor/neural-network-prototype/` preserves:

- The 14,481-vertex brain point dataset.
- Original `dat.gui.min.js` and `stats.min.js` libraries used by the interface.
- Original axon and neuron GLSL shader files as source references.
- MIT license and third-party notice.

The source repository says it is a modified fork of [nxxcxx/Neural-Network](https://github.com/nxxcxx/Neural-Network); that upstream project is also attributed in the notice. The bundled Three.js r71 runtime is deliberately not loaded because it uses deprecated APIs and would reintroduce the WebGL-only dependency.

See `vendor/neural-network-prototype/NOTICE.md` and `LICENSE`.

## Routes

- `/` — prototype-style Canvas 2D experience.
- `/3d` — separate legacy Three.js study.

## Validation

The renderer was syntax-checked and exercised with mocked Canvas contexts for desktop and mobile profiles. The model/graph test produced:

| Profile | Neurons | Axons |
|---|---:|---:|
| Desktop | 7,241 | 20,608 |
| Mobile | 3,621 | 9,739 |

These are generated graph counts, not measured device-performance guarantees.
