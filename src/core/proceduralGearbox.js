import * as THREE from 'three';

export function buildProceduralGearbox() {
  const group = new THREE.Group();
  group.name = 'ProceduralGearboxPlaceholder';

  const metal = new THREE.MeshStandardMaterial({
    color: 0x9099a3,
    metalness: 0.85,
    roughness: 0.32,
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x3c4650,
    metalness: 0.7,
    roughness: 0.45,
  });

  // Central housing block
  const housing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.2), metal);
  group.add(housing);

  // Input/output shaft running through the housing
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 2.4, 24),
    darkMetal
  );
  shaft.rotation.z = Math.PI / 2;
  group.add(shaft);

  // Two gear disks near each end of the shaft
  [-1.05, 1.05].forEach((x, i) => {
    const gear = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.18, 20),
      metal
    );
    gear.rotation.z = Math.PI / 2;
    gear.position.x = x;
    group.add(gear);

    // Knurled teeth ring
    const teeth = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.05, 8, 40),
      darkMetal
    );
    teeth.rotation.y = Math.PI / 2;
    teeth.position.x = x;
    group.add(teeth);
  });

  // Flange bolts around the housing face
  const boltGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.12, 8);
  const boltCount = 8;
  const boltRadius = 0.62;
  for (let i = 0; i < boltCount; i++) {
    const angle = (i / boltCount) * Math.PI * 2;
    const bolt = new THREE.Mesh(boltGeo, darkMetal);
    bolt.position.set(
      0.85,
      Math.sin(angle) * boltRadius * 0.55,
      Math.cos(angle) * boltRadius * 0.6
    );
    bolt.rotation.z = Math.PI / 2;
    group.add(bolt);
  }

  group.scale.setScalar(0.9);
  return group;
}
