import * as THREE from 'three'

export function createFinalScene(scene) {
  const object = new THREE.Group()

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 2),
    new THREE.MeshStandardMaterial({
      color: '#5f7cff',
      emissive: '#1a2b6a',
      roughness: 0.2,
      metalness: 0.6,
      flatShading: true
    })
  )
  core.castShadow = true
  core.receiveShadow = true

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 1.8, 64),
    new THREE.MeshStandardMaterial({
      color: '#c4e7ff',
      emissive: '#2c6ecc',
      roughness: 0.35,
      metalness: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    })
  )
  ring.rotation.x = Math.PI * 0.35
  ring.position.y = 0.05

  object.add(core, ring)
  object.position.set(0, 0.2, -8)

  const ctaPlane = createCTAPanel()
  ctaPlane.position.set(0, -2.6, -6.2)
  scene.add(object, ctaPlane)

  return { object, cta: ctaPlane }
}

function createCTAPanel() {
  const geometry = new THREE.PlaneGeometry(4.2, 1.2)
  const material = new THREE.MeshBasicMaterial({
    color: '#111f35',
    transparent: true,
    opacity: 0.0
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true

  const textCanvas = document.createElement('canvas')
  textCanvas.width = 1024
  textCanvas.height = 256
  const ctx = textCanvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.font = '72px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Experience the film-like scroll', 512, 128)

  const texture = new THREE.CanvasTexture(textCanvas)
  texture.encoding = THREE.sRGBEncoding
  const textMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  const textMesh = new THREE.Mesh(geometry, textMaterial)
  textMesh.position.z = 0.01
  mesh.add(textMesh)

  return mesh
}
