# Third-party attribution

BRɅIN incorporates an adapted point-cloud brain dataset and neural-network concepts from:

- **Neural Network Prototype** — Richard George Davis  
  https://github.com/RichardGeorgeDavis/Neural-Network-Prototype
- **Neural-Network** — nxxcxx (upstream project identified by the fork's README)  
  https://github.com/nxxcxx/Neural-Network

The prototype README describes a Three.js scene with neuron points, axons, moving signal particles, and a low-resolution brain OBJ. BRɅIN uses the brain vertex data as a source of neural node positions and ports the distance-based axon graph, bounded connection count, Bézier signal travel, particle reuse, and cascading firing concepts into its own browser-compatible renderer.

The original project bundles Three.js revision 71 and uses legacy APIs such as `THREE.Geometry`, `THREE.PointCloud`, and `BufferGeometry.addAttribute`. BRɅIN does not load those legacy vendor bundles. It uses its own implementation and current renderer code.

The original repository and upstream repository both include the MIT License. The license text is preserved in `LICENSE`. The four original shader files are retained alongside this notice for provenance/reference; BRɅIN's compatibility renderer ports their visual intent rather than loading the old shaders.

Original model file: `models/brain_vertex_low.obj` in Neural-Network-Prototype.


The original `js/vendor/dat.gui.min.js` and `js/vendor/stats.min.js` UI libraries are also included and served locally for the prototype-style Info/Settings panel and performance display. Their source headers and copyright notices are retained in the vendored modules.
