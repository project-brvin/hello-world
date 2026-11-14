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
