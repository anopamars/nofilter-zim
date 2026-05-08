import * as THREE from 'three'

export function createTransitionScene(scene) {
  const group = new THREE.Group()
  const corridorMaterial = new THREE.MeshStandardMaterial({
    color: '#101523',
    roughness: 0.85,
    metalness: 0.08,
    opacity: 0.95,
    transparent: true
  })

  for (let i = 0; i < 7; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.4 - i * 0.2, 0.12, 16, 80), corridorMaterial)
    ring.rotation.x = Math.PI * 0.5
    ring.position.z = -6 - i * 1.4
    ring.position.y = Math.sin(i * 0.6) * 0.2
    group.add(ring)
  }

  group.position.z = -4
  scene.add(group)

  return { group }
}
