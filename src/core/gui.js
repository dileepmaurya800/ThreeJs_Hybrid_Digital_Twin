import GUI from 'lil-gui';

export function setupGUI({ mesh, splat, ambient, dirLight, floor, grid, controls }) {
  const gui = new GUI({ title: 'Hybrid Digital Twin' });

  const meshFolder = gui.addFolder('CAD Mesh');
  const meshState = { visible: true, wireframe: false, autoRotate: false };
  meshFolder.add(meshState, 'visible').onChange((v) => (mesh.visible = v));
  meshFolder.add(meshState, 'wireframe').onChange((v) => {
    mesh.traverse((c) => {
      if (c.isMesh) c.material.wireframe = v;
    });
  });
  meshFolder.add(meshState, 'autoRotate').name('auto-rotate');
  meshFolder.open();

  const splatFolder = gui.addFolder(
    `Splat Field${splat.isMock ? ' (mock)' : ''}`
  );
  const splatState = {
    visible: true,
    opacity: splat.object3D.material?.opacity ?? 1,
  };
  splatFolder.add(splatState, 'visible').onChange((v) => {
    splat.object3D.visible = v;
  });
  if (splat.object3D.material && 'opacity' in splat.object3D.material) {
    splatFolder.add(splatState, 'opacity', 0, 1, 0.01).onChange((v) => {
      splat.object3D.material.opacity = v;
    });
  }
  splatFolder.open();

  const lightFolder = gui.addFolder('Lighting');
  lightFolder.add(dirLight, 'intensity', 0, 3, 0.05).name('sun intensity');
  lightFolder.add(dirLight.position, 'x', -15, 15, 0.1);
  lightFolder.add(dirLight.position, 'y', 0, 20, 0.1);
  lightFolder.add(dirLight.position, 'z', -15, 15, 0.1);

  const floorFolder = gui.addFolder('Ground / Shadow');
  const baseAmbient = ambient.intensity;
  const floorState = {
    visible: true,
    color: `#${floor.material.color.getHexString()}`,
    gridVisible: true,
    shadowContrast: 1,
  };
  floorFolder.add(floorState, 'visible').onChange((v) => (floor.visible = v));
  floorFolder.addColor(floorState, 'color').name('surface tone').onChange((v) => {
    floor.material.color.set(v);
  });
  floorFolder.add(floorState, 'gridVisible').name('grid').onChange((v) => {
    grid.visible = v;
  });
  floorFolder
    .add(floorState, 'shadowContrast', 0.1, 1, 0.01)
    .name('shadow contrast')
    .onChange((v) => {
      // Lower ambient light = darker shadows = higher contrast against the
      // lit ground plane, which is the direct, obvious way to make shadows
      // "read" more clearly without touching shadow-map settings.
      ambient.intensity = baseAmbient * v;
    });
  floorFolder.open();

  const camFolder = gui.addFolder('Camera');
  camFolder.add({ reset: () => controls.reset() }, 'reset').name('reset view');

  return { gui, meshState };
}
