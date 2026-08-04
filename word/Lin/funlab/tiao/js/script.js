(function initHeartScene() {
  const status = document.getElementById('heartStatus');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, .1, 100);
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x07070b);
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    document.body.insertBefore(renderer.domElement, status);
    camera.position.z = innerWidth / innerHeight < .75 ? 4.15 : 2.35;

    const controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.minDistance = 1.35;
    controls.maxDistance = 5.2;
    controls.rotateSpeed = .75;
    controls.zoomSpeed = .75;

    function createRoundedHeartGeometry() {
      const outlineSegments = 128;
      const depthSegments = 32;
      const vertices = [];
      const indices = [];

      for (let depthIndex = 0; depthIndex <= depthSegments; depthIndex += 1) {
        const depthAngle = depthIndex / depthSegments * Math.PI;
        const profile = Math.pow(Math.sin(depthAngle), .72);
        const z = Math.cos(depthAngle) * .52;

        for (let outlineIndex = 0; outlineIndex <= outlineSegments; outlineIndex += 1) {
          const angle = outlineIndex / outlineSegments * Math.PI * 2;
          const x = 16 * Math.pow(Math.sin(angle), 3) / 18;
          const y = (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 18;
          vertices.push(x * profile, y * profile, z);
        }
      }

      const rowSize = outlineSegments + 1;
      for (let depthIndex = 0; depthIndex < depthSegments; depthIndex += 1) {
        for (let outlineIndex = 0; outlineIndex < outlineSegments; outlineIndex += 1) {
          const a = depthIndex * rowSize + outlineIndex;
          const b = a + 1;
          const c = a + rowSize;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    }

    const heartGeometry = createRoundedHeartGeometry();
    const heartMaterial = new THREE.MeshLambertMaterial({
      color: 0xff416c,
      emissive: 0x120004,
      side: THREE.DoubleSide
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    const group = new THREE.Group();
    group.rotation.x = -.08;
    group.add(heart);
    scene.add(group);

    scene.add(new THREE.HemisphereLight(0xffd7e2, 0x130916, .64));
    const keyLight = new THREE.DirectionalLight(0xffeef3, .56);
    keyLight.position.set(2.5, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x89b9ff, .24);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    const sampler = new THREE.MeshSurfaceSampler(heart).build();
    const sample = new THREE.Vector3();
    const spikeCount = reduceMotion ? 1400 : (innerWidth < 768 ? 2600 : 7200);
    const spikeOrigins = new Float32Array(spikeCount * 3);
    const spikeLengths = new Float32Array(spikeCount);
    const linePositions = new Float32Array(spikeCount * 6);

    for (let index = 0; index < spikeCount; index += 1) {
      sampler.sample(sample);
      const offset = index * 3;
      spikeOrigins[offset] = sample.x;
      spikeOrigins[offset + 1] = sample.y;
      spikeOrigins[offset + 2] = sample.z;
      spikeLengths[index] = .009 + Math.random() * .021;
    }

    const lineGeometry = new THREE.BufferGeometry();
    const lineAttribute = new THREE.BufferAttribute(linePositions, 3);
    if (THREE.DynamicDrawUsage) lineAttribute.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute('position', lineAttribute);
    const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0xfff7fa, transparent: true, opacity: .72 }));
    group.add(lines);

    const originHeart = Float32Array.from(heartGeometry.attributes.position.array);
    const heartPositions = heartGeometry.attributes.position.array;
    const simplex = new SimplexNoise();
    const beat = { amount: 0 };

    if (!reduceMotion) {
      gsap.timeline({ repeat: -1, repeatDelay: .28 })
        .to(beat, { amount: 1, duration: .55, ease: 'power2.in' })
        .to(beat, { amount: 0, duration: .7, ease: 'power3.out' });
      gsap.to(group.rotation, { y: Math.PI * 2, duration: 14, ease: 'none', repeat: -1 });
    } else {
      group.rotation.y = -.3;
      beat.amount = .15;
    }

    function render(time) {
      const motion = time * .00045;
      for (let index = 0; index < spikeCount; index += 1) {
        const source = index * 3;
        const target = index * 6;
        const x = spikeOrigins[source];
        const y = spikeOrigins[source + 1];
        const z = spikeOrigins[source + 2];
        const noise = simplex.noise4D(x * 1.6, y * 1.6, z * 1.6, motion) + 1;
        const pulse = 1.01 + noise * .095 * beat.amount;
        const oneX = x * pulse;
        const oneY = y * pulse;
        const oneZ = z * pulse;
        const length = Math.hypot(oneX, oneY, oneZ) || 1;
        const extension = spikeLengths[index] / length;
        linePositions[target] = oneX;
        linePositions[target + 1] = oneY;
        linePositions[target + 2] = oneZ;
        linePositions[target + 3] = oneX + oneX * extension;
        linePositions[target + 4] = oneY + oneY * extension;
        linePositions[target + 5] = oneZ + oneZ * extension;
      }
      lineAttribute.needsUpdate = true;

      for (let index = 0; index < heartPositions.length; index += 3) {
        const x = originHeart[index];
        const y = originHeart[index + 1];
        const z = originHeart[index + 2];
        const noise = simplex.noise4D(x * 1.6, y * 1.6, z * 1.6, motion) + 1;
        const pulse = 1 + noise * .095 * beat.amount;
        heartPositions[index] = x * pulse;
        heartPositions[index + 1] = y * pulse;
        heartPositions[index + 2] = z * pulse;
      }
      heartGeometry.attributes.position.needsUpdate = true;
      controls.update();
      renderer.render(scene, camera);
    }

    function resize() {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    }

    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () {
      renderer.setAnimationLoop(document.hidden ? null : render);
    });
    renderer.setAnimationLoop(render);
    status.hidden = true;
  } catch (error) {
    console.error('3D 心跳初始化失败', error);
    status.textContent = '当前设备无法显示 3D 心跳。';
    if (renderer) renderer.dispose();
  }
}());
