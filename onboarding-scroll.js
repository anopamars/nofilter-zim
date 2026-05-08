(function () {
  if (!window.THREE || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const canvasRoot = document.createElement('div');
  canvasRoot.className = 'onboarding-canvas-root';
  document.body.prepend(canvasRoot);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x04050d, 3, 24);

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.3, 9);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x04050d, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  canvasRoot.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.35);
  const directional = new THREE.DirectionalLight(0xffffff, 1.8);
  directional.position.set(5, 10, 6);
  directional.castShadow = true;
  directional.shadow.camera.near = 1;
  directional.shadow.camera.far = 40;
  directional.shadow.camera.left = -12;
  directional.shadow.camera.right = 12;
  directional.shadow.camera.top = 12;
  directional.shadow.camera.bottom = -12;

  const rim = new THREE.PointLight(0x4da6ff, 1.5, 22);
  rim.position.set(-6, 3.5, 4);

  scene.add(ambient, directional, rim);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x060814, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  ground.receiveShadow = true;
  scene.add(ground);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.16, 24, 120),
    new THREE.MeshStandardMaterial({
      color: 0x5f7cff,
      emissive: 0x1d2c6b,
      roughness: 0.15,
      metalness: 0.7,
      transparent: true,
      opacity: 0.92
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.2, -2);
  ring.castShadow = true;
  scene.add(ring);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.9, 2),
    new THREE.MeshStandardMaterial({
      color: 0x9ab7ff,
      emissive: 0x16254f,
      roughness: 0.18,
      metalness: 0.65,
      flatShading: true
    })
  );
  core.position.set(0, 0.2, -2);
  core.castShadow = true;
  scene.add(core);

  const fogParticles = createParticles();
  scene.add(fogParticles);

  const content = document.querySelector('.content');
  const spacer = document.createElement('div');
  spacer.className = 'onboarding-scroll-spacer';
  spacer.style.height = '380vh';
  document.body.appendChild(spacer);

  function createParticles() {
    const count = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 6 - 0.8;
      positions[i * 3 + 2] = -Math.random() * 18;
      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xdedfff,
      size: 0.045,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });

    return new THREE.Points(geometry, material);
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize);

  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: spacer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      pin: false,
      invalidateOnRefresh: true
    }
  });

  scrollTimeline
    .to(camera.position, { z: 4.2, duration: 1, ease: 'power1.out' }, 0)
    .to(camera.position, { y: 1.9, x: 0.8, duration: 1, ease: 'power1.out' }, 0)
    .to(ring.rotation, { y: Math.PI * 1.7, duration: 1, ease: 'sine.inOut' }, 0)
    .to(core.rotation, { y: Math.PI * 1.3, x: Math.PI * 0.18, duration: 1, ease: 'sine.inOut' }, 0)
    .to(fogParticles.rotation, { y: -Math.PI * 0.2, duration: 1, ease: 'power1.out' }, 0)
    .to(content, { y: -120, opacity: 0.22, ease: 'none' }, 0)
    .to(ring.position, { z: -4.5, duration: 1, ease: 'power1.inOut' }, 0)
    .to(camera.position, { z: 7.5, y: 3.2, duration: 1, ease: 'power2.out' }, 0.7);

  function render() {
    const elapsed = performance.now() * 0.0004;
    fogParticles.rotation.y = elapsed * 0.18;
    core.rotation.x += 0.0015;
    core.rotation.z += 0.0012;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
})();
