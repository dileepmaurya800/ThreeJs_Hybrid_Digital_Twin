import './style.css';
import * as THREE from 'three';
import { createScene } from './core/sceneSetup.js';
import { loadCADMesh } from './core/meshLoader.js';
import { loadSplatField } from './core/splatLoader.js';
import { setupGUI } from './core/gui.js';

async function init() {
  const canvas = document.querySelector('#app-canvas');
  const { scene, camera, renderer, controls, ambient, dirLight, floor, grid } =
    createScene(canvas);

  // Load the CAD mesh and the splat field independently, in parallel.
  const [mesh, splat] = await Promise.all([loadCADMesh(), loadSplatField()]);

  mesh.position.set(0, 0.9, 0);
  scene.add(mesh);
  scene.add(splat.object3D);

  const { meshState } = setupGUI({ mesh, splat, ambient, dirLight, floor, grid, controls });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();

    if (meshState.autoRotate) mesh.rotation.y += dt * 0.4;

    splat.update();
    controls.update();
    renderer.render(scene, camera);
  });
}

init();
