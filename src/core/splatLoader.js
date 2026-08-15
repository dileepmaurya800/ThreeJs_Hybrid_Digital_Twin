import * as THREE from 'three';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';


const SPLAT_FILES = [
  '/splats/scene.ksplat',
  '/splats/scene.splat',
  '/splats/scene.ply',
];


export async function loadSplatField() {
  for (const url of SPLAT_FILES) {
    if (!(await looksLikeSplatFile(url))) continue;

    try {
      return await withTimeout(loadRealSplats(url), 8000, `timed out loading ${url}`);
    } catch (err) {
      console.error(`[splatLoader] Failed to load ${url}:`, err);
    }
  }

  console.warn(
    '[splatLoader] No .ksplat/.splat/.ply found in public/splats/. ' +
      'Rendering a mock splat field instead so the depth-occlusion pipeline ' +
      'stays testable. Add a real trained scene to public/splats/ to replace it.'
  );
  return buildMockSplatField();
}

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

async function looksLikeSplatFile(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('text/html')) return false;
    return true;
  } catch {
    return false;
  }
}

async function loadRealSplats(url) {
 
  const dropIn = new GaussianSplats3D.DropInViewer({
    gpuAcceleratedSort: true,
    sharedMemoryForWorkers: false, 
  });

  await dropIn.addSplatScene(url, { showLoadingUI: true });

  return {
    object3D: dropIn,
    isMock: false,
    update: () => {
      if (typeof dropIn.update === 'function') dropIn.update();
    },
  };
}

function buildMockSplatField() {
 
  const count = 6000;
  const radius = 6;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = radius * (0.3 + 0.7 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.2) * 4;

    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;

    const c = 0.5 + Math.random() * 0.5;
    colors[i * 3] = c * 0.6;
    colors[i * 3 + 1] = c * 0.75;
    colors[i * 3 + 2] = c;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
    depthTest: true,
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'MockSplatField';

  return { object3D: points, isMock: true, update: () => {} };
}
