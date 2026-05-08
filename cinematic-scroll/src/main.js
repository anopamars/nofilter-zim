import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createIntroScene } from './scenes/intro.js'
import { createTransitionScene } from './scenes/transition.js'
import { createFinalScene } from './scenes/finale.js'
import '../style.css'

gsap.registerPlugin(ScrollTrigger)

const scene = new THREE.Scene()
scene.fog = new THREE.Fog('#04040a', 4, 18)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0.8, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.domElement.classList.add('webgl-canvas')
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.35)
const directionalLight = new THREE.DirectionalLight('#f9f6ff', 2.2)
directionalLight.position.set(8, 12, 8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(2048, 2048)

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 30

directionalLight.shadow.camera.left = -12

directionalLight.shadow.camera.right = 12

directionalLight.shadow.camera.top = 12

directionalLight.shadow.camera.bottom = -12

const rimLight = new THREE.PointLight(0x4da6ff, 1.8, 20)
rimLight.position.set(-7, 4, 6)

scene.add(ambientLight, directionalLight, rimLight)

const layers = createIntroScene(scene)
const corridor = createTransitionScene(scene)
const finale = createFinalScene(scene)

const sections = document.querySelectorAll('.section')

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', resize)

function createScrollAnimations() {
  gsap.to(camera.position, {
    z: 5,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-one',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(layers.fg.position, {
    y: 1.2,
    z: -1,
    duration: 1,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: '.section-one',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(layers.mg.position, {
    y: 0.45,
    z: -2.5,
    duration: 1,
    scrollTrigger: {
      trigger: '.section-two',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(camera.position, {
    x: 3,
    y: 1.2,
    z: 3.8,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.section-two',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(corridor.group.rotation, {
    y: Math.PI * 0.2,
    duration: 1,
    ease: 'sine.inOut',
    scrollTrigger: {
      trigger: '.section-three',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(camera.position, {
    x: 0,
    y: 2.2,
    z: 2.4,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-four',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(finale.object.rotation, {
    y: Math.PI * 1.2,
    duration: 1,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.section-four',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(camera.position, {
    z: 8,
    y: 3,
    duration: 1,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.section-five',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  gsap.to(finale.cta.material, {
    opacity: 1,
    duration: 1.4,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.section-five',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  })
}

createScrollAnimations()

const clock = new THREE.Clock()
let lastTime = 0

function animate() {
  const elapsed = clock.getElapsedTime()

  layers.particles.rotation.y = elapsed * 0.02
  layers.fg.rotation.z = Math.sin(elapsed * 0.35) * 0.01
  layers.mg.rotation.z = Math.sin(elapsed * 0.18) * 0.008
  corridor.group.rotation.x = Math.sin(elapsed * 0.06) * 0.01
  finale.object.rotation.y += 0.002

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
