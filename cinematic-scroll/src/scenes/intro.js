import * as THREE from 'three'

export function createIntroScene(scene) {
  const loader = new THREE.TextureLoader()

  const fgMaterial = new THREE.MeshStandardMaterial({
    color: '#1c2840',
    transparent: true,
    opacity: 0.95,
    depthWrite: false
  })
  const mgMaterial = new THREE.MeshStandardMaterial({
    color: '#2b3c5a',
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  })
  const bgMaterial = new THREE.MeshStandardMaterial({
    color: '#0b0f18',
    transparent: true,
    opacity: 0.7,
    depthWrite: false
  })

  const fg = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), fgMaterial)
  fg.position.set(0, -0.8, 0.3)
  fg.scale.set(1.2, 1.2, 1)
  fg.receiveShadow = true
  fg.castShadow = true

  const mg = new THREE.Mesh(new THREE.PlaneGeometry(18, 10), mgMaterial)
  mg.position.set(0, -0.4, -2)
  mg.scale.set(1.05, 1.05, 1)
  mg.receiveShadow = true

  const bg = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), bgMaterial)
  bg.position.set(0, 0.2, -5.6)
  bg.scale.set(1.02, 1.02, 1)
  bg.receiveShadow = true

  const particles = createParticleField()
  scene.add(fg, mg, bg, particles)

  const introLight = new THREE.PointLight(0x72a6ff, 0.9, 18)
  introLight.position.set(3, 4, 4)
  scene.add(introLight)

  return { fg, mg, bg, particles }
}

function createParticleField() {
  const particleCount = 700
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 16
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = -Math.random() * 18
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: '#e7f3ff',
    transparent: true,
    opacity: 0.35
  })

  return new THREE.Points(geometry, material)
}
