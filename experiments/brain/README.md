# BRɅIN — Living Neural Entity

Standalone interactive graphics experiment, separate from the gogoiTV product.

## Preview

https://brain-entity-preview.projectbrvin.workers.dev

Health check: https://brain-entity-preview.projectbrvin.workers.dev/health

## Experience

- Procedural paired cortical hemispheres with folded geometry, translucent Fresnel / pseudo-SSS shader, breathing and micro-tremor.
- Mid-range white-matter tract bundles and a curved corpus-callosum bridge.
- 1,420 instanced multipolar neuron bodies and 7,100 instanced dendrite / axon segments, revealed progressively as the camera descends.
- Simulated action-potential pulses, synaptic spark bursts, local plasticity and pointer-triggered ripples.
- Orbit, microscope zoom, hover region sensing, click-to-stimulate, and live telemetry.
- Bloom, close-range depth-of-field and subtle chromatic separation.

## Files

- `worker.js`: isolated Cloudflare Worker and asset router.
- `page.js`: document shell.
- `styles.js`: responsive diagnostic HUD and interface.
- `experience.js`: Three.js procedural scene and neural interaction system.

## Technical notes

Uses Three.js `0.187.0` via a pinned jsDelivr ESM import. The neural structures are procedural and generated in the browser; no anatomical model or external 3D asset is downloaded. Neuron somas and processes use `InstancedMesh` and LOD-style distance fades.

This is an artistic, simulated visualization — not a medical or anatomically validated model. Neural firing, neurotransmitter particles, plasticity and cognitive-state labels are visual effects, not neuroscience-grade simulation.


## Compatibility and mobile rendering

The page first attempts the full Three.js WebGL 2 experience. On smaller or lower-memory devices it lowers the pixel ratio, removes the depth-of-field post-process and reduces the number of procedural neural instances. If WebGL 2 is unavailable, the Three.js CDN import fails, or the graphics context is lost, the page switches to a local Canvas 2D renderer with drag rotation, wheel/pinch zoom, hover-region labels, and tap-to-stimulate effects. No GPU renderer is required for the compatibility scene.

Compatibility-only preview (Canvas 2D; bypasses WebGL): https://brain-entity-preview.projectbrvin.workers.dev/?compat=1


## Universal phone-safe preview

A second independent Worker, `brain-universal-preview`, serves the Canvas 2D experience as the default renderer. It intentionally does not import Three.js, request WebGL/WebGPU, or show the WebGL error state. It supports touch drag, pinch zoom, tap stimulation, and responsive HUD rendering.

Preview: https://brain-universal-preview.projectbrvin.workers.dev


## Always-visible artwork layer

The universal preview now includes an independent inline SVG cortical illustration above the Canvas layer. It remains visible if the Canvas animation loop stalls or is interrupted, and scales gently with the macro / connectome / synapse HUD depth. The SVG is self-contained and does not use an image request or WebGL.


## God's Eye-inspired universal scene

The Canvas-only default renderer is now a continuously animated projected mesh rather than a static SVG brain. It builds both hemispheres from a folded parametric surface, depth-sorts the cortical triangles, and applies perspective projection with a slowly orbiting camera. Concentric scanner rings, a rotating sweep, coordinate grid, moving connectome paths, micro-neuron points and action-potential pulses provide the cinematic tracking-system visual language. Drag to orbit, scroll or pinch to descend, and click / Stimulate to send a pulse.

This is a software-projected 3D visualization rendered on Canvas 2D for compatibility; it is not a physically based volumetric medical model.


## Neural-Network-Prototype integration

BRɅIN vendors the 14,481-vertex `brain_vertex_low.obj` point dataset, the four source shader files, and the MIT license/attribution in `vendor/neural-network-prototype/`. The default renderer loads those source vertices as neural-node locations, samples them more lightly on phones, builds a spatially indexed proximity graph (up to six axon connections per neuron), and animates Bézier action potentials across connected nodes with cascade firing and connection-strength feedback.

The adapted concepts correspond to the prototype's `neuralnet.js`, `axon.js`, `neuron.js`, `signal.js`, and `particlePool.js`. The old Three.js r71 runtime is deliberately not bundled because it depends on APIs removed from modern Three.js and still requires WebGL.

Attributions and license: `vendor/neural-network-prototype/NOTICE.md` and `vendor/neural-network-prototype/LICENSE`.


## Faithful prototype-style default interface

The default route at `/` now follows the supplied Neural Network Prototype page structure instead of the previously invented BRɅIN hero/HUD: a full-window `#111113` neural canvas, a compact Stats-style readout at top-left, and a right-side dark `Info` / `Settings` panel styled after the prototype's dat.GUI layout.

The port uses the prototype's settings defaults and controls: 3,000 maximum signals, signal size 0.6, signal speed 1.75–3.25, neuron size multiplier 1.0, neuron opacity 0.75, axon opacity multiplier 0.5, white signal/neuron/axon colors, and `#111113` background. Its graph uses the source OBJ vertices, every-second-vertex sampling on desktop / every-fourth on mobile, a 10-unit connection radius, six connections per neuron, cubic Bézier axons, and pooled travelling signals. The GUI remains collapsible on narrow touch screens.

The old BRɅIN-themed God’s Eye HUD and previous custom experience are no longer the default route. The legacy WebGL experiment remains separately available at `/3d`.


The default page now loads the exact upstream `dat.gui.min.js` and `stats.min.js` libraries from the Neural-Network-Prototype repository, serving them locally at `/dat.gui.js` and `/stats.js`. The original `initGui()` folder names and controller labels are recreated with the original range defaults. The Stats.js panel is mounted in the canvas container. No external CDN is used for the model, controls, or statistics panel.
