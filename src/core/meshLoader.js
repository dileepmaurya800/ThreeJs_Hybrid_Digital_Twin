import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { buildProceduralGearbox } from './proceduralGearbox.js';

const CAD_FILES = [
  { url: '/models/engine.glb', type: 'glb' },
  { url: '/models/gearbox.glb', type: 'glb' },
  { url: '/models/engine.stl', type: 'stl' },
  { url: '/models/gearbox.stl', type: 'stl' },
];

export async function loadCADMesh() {
  for (const cadFile of CAD_FILES) {
    try {
      const mesh = await tryLoad(cadFile);
      if (mesh) {
        console.info(`[meshLoader] Loaded CAD mesh from ${cadFile.url}`);
        applyShadowFlags(mesh);
        return mesh;
      }
    } catch (err) {
      console.log(`[meshLoader] Failed to load ${cadFile.url}: ${err.message}`);
    }
  }

  console.warn(
    '[meshLoader] No engine/gearbox STL or GLB found in public/models/. ' +
      'Using a procedurally generated placeholder instead. Add engine.glb ' +
      'or gearbox.glb (or .stl) to public/models/ to swap it for a real mesh.'
  );
  const placeholder = buildProceduralGearbox();
  applyShadowFlags(placeholder);
  return placeholder;
}

function tryLoad({ url, type }) {
  return new Promise((resolve, reject) => {
    const onError = () => reject(new Error(`not found: ${url}`));

    if (type === 'glb') {
      new GLTFLoader().load(url, (gltf) => resolve(gltf.scene), undefined, onError);
    } else {
      new STLLoader().load(
        url,
        (geometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({
            color: 0x9099a3,
            metalness: 0.75,
            roughness: 0.35,
          });
          resolve(new THREE.Mesh(geometry, material));
        },
        undefined,
        onError
      );
    }
  });
}

function applyShadowFlags(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}
