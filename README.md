# Hybrid Digital Twin

3D Gaussian Splatting + a functional CAD mesh, synchronized in one
Three.js scene. Vite, vanilla JS, no framework.

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. You'll see a small GUI panel (top right)
and an orbit-controllable view of a mesh sitting inside a point field.


## GUI

Top-right panel (lil-gui):
- CAD Mesh: visibility, wireframe, auto-rotate
- Splat Field: visibility, opacity
- Lighting: sun intensity and position
- Camera: reset view
