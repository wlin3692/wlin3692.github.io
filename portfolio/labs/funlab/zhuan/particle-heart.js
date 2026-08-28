(function initParticleHeart() {
  const canvas = document.getElementById('particleHeartCanvas');
  const context = canvas.getContext('2d', { alpha: false });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heartColors = ['#ff3f87', '#ff5798', '#f82f77', '#ff75aa', '#ffc0da'];
  const heartColorRgb = [[255, 63, 135], [255, 87, 152], [248, 47, 119], [255, 117, 170], [255, 192, 218]];
  const groundColors = ['#e5fbff', '#9ff7ff', '#51e3f4', '#39aeca'];
  const transferCyan = [81, 227, 244];
  const transferWhite = [235, 253, 255];
  const heartVerticalScale = .86;
  const pointer = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let heartSize = 0;
  let centerX = 0;
  let centerY = 0;
  let waterLine = 0;
  let heartParticles = [];
  let orbitParticles = [];
  let groundParticles = [];
  let transferParticles = [];
  let fountainParticles = [];
  let sparks = [];
  let glowSprites = [];
  let auraSprite = null;
  let frame = 0;
  const startTime = performance.now();
  const frameInterval = 1000 / 45;
  let lastDrawTime = 0;
  let animationFrame = 0;
  let resizeTimer = 0;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothStep(value) {
    const amount = clamp(value, 0, 1);
    return amount * amount * (3 - 2 * amount);
  }

  function interpolate(start, end, amount) {
    return start + (end - start) * amount;
  }

  function mixColor(start, end, amount) {
    const progress = smoothStep(amount);
    return 'rgb('
      + Math.round(interpolate(start[0], end[0], progress)) + ', '
      + Math.round(interpolate(start[1], end[1], progress)) + ', '
      + Math.round(interpolate(start[2], end[2], progress)) + ')';
  }

  function sampleHeartPoint() {
    let x;
    let y;
    let z;
    let expression;
    do {
      x = random(-1.22, 1.22);
      y = random(-1.16, 1.25);
      z = random(-.82, .82);
      const base = x * x + 2.25 * z * z + y * y - 1;
      expression = Math.pow(base, 3) - x * x * Math.pow(y, 3) - .1125 * z * z * Math.pow(y, 3);
    } while (expression > 0);
    return { x: x * .9, y: y * .9, z: z * 1.08 };
  }

  function heartExpression(x, y) {
    const base = x * x + y * y - 1;
    return Math.pow(base, 3) - x * x * Math.pow(y, 3);
  }

  function heartHalfWidth(y) {
    let halfWidth = .2;
    for (let x = 0; x <= 1.3; x += .0125) {
      if (heartExpression(x, y) <= 0) halfWidth = x;
    }
    return halfWidth * .9;
  }

  function createGlowSprite(color) {
    const sprite = document.createElement('canvas');
    const spriteContext = sprite.getContext('2d');
    const size = 36;
    sprite.width = size;
    sprite.height = size;
    const gradient = spriteContext.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(.16, color);
    gradient.addColorStop(.5, color + '88');
    gradient.addColorStop(1, color + '00');
    spriteContext.fillStyle = gradient;
    spriteContext.fillRect(0, 0, size, size);
    return sprite;
  }

  function createAuraSprite() {
    const sprite = document.createElement('canvas');
    const size = Math.ceil(heartSize * 3.2);
    sprite.width = size;
    sprite.height = size;
    const spriteContext = sprite.getContext('2d');
    const gradient = spriteContext.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 46, 116, .09)');
    gradient.addColorStop(.45, 'rgba(219, 36, 101, .035)');
    gradient.addColorStop(1, 'rgba(219, 36, 101, 0)');
    spriteContext.fillStyle = gradient;
    spriteContext.fillRect(0, 0, size, size);
    return sprite;
  }

  function targetFor(particle, time) {
    const elapsed = time - startTime;
    const pulse = reduceMotion ? 1 : 1 + Math.sin(elapsed * .0032) * .025 + Math.sin(elapsed * .0064) * .008;
    const rotation = reduceMotion ? .22 : elapsed * .000632;
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const orbitX = particle.normalX * cosine + particle.normalZ * sine;
    const rotatedZ = -particle.normalX * sine + particle.normalZ * cosine;
    const rotatedX = orbitX;
    const perspective = 1 / (1 + rotatedZ * .18);
    return {
      x: centerX + rotatedX * heartSize * pulse * perspective,
      y: centerY - particle.normalY * heartSize * heartVerticalScale * pulse * perspective,
      scale: Math.max(.76, Math.min(1.24, perspective)),
      brightness: Math.max(.76, Math.min(1.12, 1.04 - rotatedZ * .16))
    };
  }

  function orbitTargetFor(particle, time) {
    const elapsed = time - startTime;
    const rotation = reduceMotion ? particle.phase : elapsed * .000632 + particle.phase;
    const cosine = Math.cos(rotation);
    const sine = Math.sin(rotation);
    const x3d = particle.orbitRadius * cosine;
    const z3d = particle.orbitRadius * particle.depthScale * sine;
    const perspective = 1 / (1 + z3d * .2);
    const ripple = reduceMotion ? 0 : Math.sin(rotation * 2 + particle.ripplePhase) * heartSize * .012;
    return {
      x: centerX + x3d * heartSize * perspective,
      y: centerY - particle.normalY * heartSize * heartVerticalScale * perspective + ripple,
      scale: Math.max(.68, Math.min(1.34, perspective)),
      brightness: Math.max(.48, Math.min(1.2, 1 - z3d * .22))
    };
  }

  function buildScene() {
    const area = width * height;
    const heartCount = reduceMotion ? 1000 : Math.max(1600, Math.min(4500, Math.round(area / 160)));
    const orbitCount = reduceMotion ? 180 : Math.max(450, Math.min(1100, Math.round(area / 600)));
    const groundCount = reduceMotion ? 450 : Math.max(800, Math.min(2800, Math.round(area / 220)));
    const transferCount = reduceMotion ? 160 : Math.max(280, Math.min(650, Math.round(area / 850)));
    heartParticles = [];
    orbitParticles = [];
    groundParticles = [];
    transferParticles = [];
    fountainParticles = [];
    sparks = [];

    for (let index = 0; index < heartCount; index += 1) {
      const point = sampleHeartPoint();
      const targetX = centerX + point.x * heartSize;
      const targetY = centerY - point.y * heartSize * heartVerticalScale;
      heartParticles.push({
        normalX: point.x,
        normalY: point.y,
        normalZ: point.z,
        x: reduceMotion ? targetX : targetX + random(-heartSize * .18, heartSize * .18),
        y: reduceMotion ? targetY : targetY + random(-heartSize * .18, heartSize * .18),
        vx: 0,
        vy: 0,
        radius: random(.5, 1.48),
        streak: random(.9, 2.7),
        alpha: random(.5, .98),
        phase: random(0, Math.PI * 2),
        bandPhase: point.y * 3.8 + random(-.18, .18),
        flowAmount: random(.035, .18),
        colorIndex: Math.floor(Math.random() * heartColors.length),
        glow: Math.random() < .024
      });
    }

    for (let index = 0; index < orbitCount; index += 1) {
      const normalY = random(-1.02, .82);
      const ribbon = index % 3;
      const phase = ribbon * Math.PI * 2 / 3 + normalY * 3.35 + random(-.24, .24);
      const orbitRadius = heartHalfWidth(normalY) * random(1.03, 1.18);
      orbitParticles.push({
        normalY,
        orbitRadius,
        depthScale: random(.72, .94),
        phase,
        ripplePhase: random(0, Math.PI * 2),
        x: centerX + random(-heartSize, heartSize),
        y: centerY - normalY * heartSize * heartVerticalScale + random(-heartSize * .06, heartSize * .06),
        vx: 0,
        vy: 0,
        radius: random(.4, 1.1),
        streak: random(1.2, 3),
        alpha: random(.25, .64),
        colorIndex: Math.floor(Math.random() * heartColors.length),
        glow: Math.random() < .018
      });
    }

    for (let index = 0; index < groundCount; index += 1) {
      const angle = random(0, Math.PI * 2);
      const distance = random(.72, 1.05);
      const flowDuration = random(8500, 14000);
      groundParticles.push({
        angle,
        distance,
        flowDuration,
        flowOffset: random(0, flowDuration),
        phase: random(0, Math.PI * 2),
        speed: random(.00008, .00024),
        radialPhase: random(0, Math.PI * 2),
        radialSpeed: random(.00042, .0009),
        wavePhase: random(0, Math.PI * 2),
        radius: random(.45, 1.45),
        alpha: random(.4, .95),
        color: groundColors[Math.floor(Math.random() * groundColors.length)]
      });
    }

    for (let index = 0; index < transferCount; index += 1) {
      const point = sampleHeartPoint();
      const duration = random(7800, 10500);
      transferParticles.push({
        normalX: point.x,
        normalY: point.y,
        normalZ: point.z,
        bandPhase: point.y * 3.8 + random(-.18, .18),
        flowAmount: random(.04, .16),
        duration,
        offset: random(0, duration),
        baseAngle: index / transferCount * Math.PI * 2 + random(-.12, .12),
        spiralTurns: random(1.02, 1.26),
        pillar: index % 3,
        columnJitter: random(-.16, .16),
        columnScale: random(.82, 1.16),
        intakeRadius: random(.12, .3),
        intakeLift: random(.055, .16),
        startDistance: random(.78, 1.04),
        radius: random(.65, 2.15),
        alpha: random(.48, .95),
        colorIndex: Math.floor(Math.random() * heartColors.length),
        previousX: null,
        previousY: null,
        previousPhase: 0,
        glow: Math.random() < .07
      });
    }
  }

  function resize() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    heartSize = Math.min(width * .34, height * .25, 290);
    centerX = width / 2;
    centerY = Math.max(heartSize * 1.16, height * .34);
    waterLine = Math.min(height * .84, centerY + heartSize * 1.93);
    glowSprites = heartColors.map(createGlowSprite);
    auraSprite = createAuraSprite();
    buildScene();
    lastDrawTime = 0;
    draw(performance.now());
  }

  function drawBackground() {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);

    if (auraSprite) context.drawImage(auraSprite, centerX - auraSprite.width / 2, centerY - auraSprite.height / 2);
  }

  function drawGround(time) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    const ellipseWidth = width * .47;
    const ellipseHeight = Math.min(height * .115, 72);
    for (const particle of groundParticles) {
      const elapsed = time - startTime;
      const flowPhase = ((elapsed + particle.flowOffset) % particle.flowDuration) / particle.flowDuration;
      const inwardFlow = smoothStep(flowPhase);
      const angle = particle.angle + elapsed * particle.speed + inwardFlow * Math.PI * 1.35;
      const radialPulse = Math.sin((time - startTime) * particle.radialSpeed + particle.radialPhase) * .035;
      const distance = clamp(interpolate(particle.distance, .08, inwardFlow) + radialPulse, .035, 1.08);
      const normalX = Math.cos(angle) * distance;
      const normalZ = Math.sin(angle) * distance;
      const depth = (normalZ + 1) / 2;
      const wave = Math.sin(time * .0018 + particle.wavePhase + distance * 8);
      const x = centerX + normalX * ellipseWidth + Math.sin(time * .0012 + particle.phase) * (2 + depth * 3) + wave * 1.5;
      const y = waterLine + normalZ * ellipseHeight + wave * (1 + distance * 2.5);
      const flicker = .75 + Math.sin(time * .002 + particle.phase) * .25;
      const flowFade = smoothStep(flowPhase / .045) * (1 - smoothStep((flowPhase - .93) / .07));
      context.globalAlpha = particle.alpha * flicker * flowFade;
      context.fillStyle = particle.color;
      const radius = particle.radius * (.65 + depth * .85);
      context.fillRect(x - radius, y - radius * .45, radius * 2, Math.max(1, radius * .7));
    }
    context.restore();
  }

  function spawnFountain(time) {
    if (reduceMotion || fountainParticles.length > 240) return;
    const burstCount = frame % 7 === 0 ? 4 : 1;
    for (let index = 0; index < burstCount; index += 1) {
      const source = (frame + index) % 3;
      const sourceAngle = (time - startTime) * .00072 + source * Math.PI * 2 / 3 + random(-.3, .3);
      const sourceRadius = heartSize * random(.12, .3);
      fountainParticles.push({
        x: centerX + Math.cos(sourceAngle) * sourceRadius + random(-heartSize * .03, heartSize * .03),
        y: waterLine + Math.sin(sourceAngle) * Math.min(height * .115, 72) * .22 - random(0, heartSize * .09) + random(-3, 7),
        vx: random(-.95, .95),
        vy: random(-3.7, -1),
        gravity: random(.025, .045),
        life: 1,
        decay: random(.009, .019),
        radius: random(.55, 2.5),
        color: Math.random() < .22 ? '#ffffff' : groundColors[Math.floor(Math.random() * groundColors.length)]
      });
    }
  }

  function drawFountain() {
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (let index = fountainParticles.length - 1; index >= 0; index -= 1) {
      const particle = fountainParticles[index];
      particle.vy += particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      if (particle.life <= 0 || particle.y > waterLine + 18) {
        fountainParticles.splice(index, 1);
        continue;
      }
      context.globalAlpha = particle.life * .82;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * (.55 + particle.life * .65), 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function drawTransferParticles(time) {
    const elapsed = time - startTime;
    const ellipseWidth = width * .47;
    const ellipseHeight = Math.min(height * .115, 72);
    const joinY = centerY + heartSize * heartVerticalScale * 1.03;
    context.save();
    context.globalCompositeOperation = 'lighter';

    for (const particle of transferParticles) {
      const phase = reduceMotion ? .88 : ((elapsed + particle.offset) % particle.duration) / particle.duration;
      const heartTarget = targetFor(particle, time);
      const angle = particle.baseAngle + elapsed * .0001 + phase * Math.PI * 2 * particle.spiralTurns;
      let x;
      let y;
      let scale;
      let color;
      let alpha = particle.alpha;

      if (phase < .42) {
        const gather = smoothStep(phase / .42);
        const distance = interpolate(particle.startDistance, .42, gather);
        const normalZ = Math.sin(angle) * distance;
        const depth = (normalZ + 1) / 2;
        const surfaceX = centerX + Math.cos(angle) * ellipseWidth * distance;
        const surfaceY = waterLine + normalZ * ellipseHeight;
        const intakeAngle = elapsed * .00072 + particle.pillar * Math.PI * 2 / 3 + particle.columnJitter;
        const intakeX = centerX + Math.cos(intakeAngle) * heartSize * particle.intakeRadius;
        const intakeY = waterLine + Math.sin(intakeAngle) * ellipseHeight * .22 - heartSize * particle.intakeLift;
        x = interpolate(surfaceX, intakeX, gather);
        y = interpolate(surfaceY, intakeY, gather);
        scale = .78 + depth * .34;
        color = 'rgb(81, 227, 244)';
        alpha *= smoothStep(phase / .045);
      } else if (phase < .72) {
        const rise = smoothStep((phase - .42) / .3);
        const columnAngle = elapsed * .00072 + particle.pillar * Math.PI * 2 / 3 + rise * Math.PI * 2 * .82 + particle.columnJitter;
        const orbitRadius = (interpolate(heartSize * particle.intakeRadius, heartSize * .018, rise) + Math.sin(rise * Math.PI) * heartSize * .1) * particle.columnScale;
        x = centerX + Math.cos(columnAngle) * orbitRadius;
        const columnStartY = waterLine + Math.sin(columnAngle) * ellipseHeight * .22 - heartSize * particle.intakeLift;
        y = interpolate(columnStartY, joinY, rise) + Math.sin(columnAngle * 2) * heartSize * .018 * (1 - rise);
        scale = interpolate(1.18, .84, rise);
        color = mixColor(transferCyan, transferWhite, (rise - .72) / .28);
      } else if (phase < .85) {
        const attach = smoothStep((phase - .72) / .13);
        const joinX = centerX + Math.cos(angle) * heartSize * .025;
        x = interpolate(joinX, heartTarget.x, attach);
        y = interpolate(joinY, heartTarget.y, attach);
        scale = interpolate(.82, heartTarget.scale, attach);
        color = mixColor(transferWhite, heartColorRgb[particle.colorIndex], attach);
      } else {
        x = heartTarget.x;
        y = heartTarget.y;
        scale = heartTarget.scale;
        color = heartColors[particle.colorIndex];
        alpha *= heartTarget.brightness * (1 - smoothStep((phase - .96) / .04));
      }

      if (phase < particle.previousPhase || particle.previousX === null || Math.hypot(x - particle.previousX, y - particle.previousY) > 22) {
        particle.previousX = x;
        particle.previousY = y;
      }

      if (phase < .85) {
        context.globalAlpha = alpha * .34;
        context.strokeStyle = color;
        context.lineWidth = Math.max(1, particle.radius * scale * .72);
        context.beginPath();
        context.moveTo(particle.previousX, particle.previousY);
        context.lineTo(x, y);
        context.stroke();
      }

      const radius = particle.radius * scale;
      if (particle.glow) {
        context.globalAlpha = alpha * .48;
        const glowSize = radius * 8;
        context.drawImage(glowSprites[particle.colorIndex], x - glowSize / 2, y - glowSize / 2, glowSize, glowSize);
      }
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();

      particle.previousX = x;
      particle.previousY = y;
      particle.previousPhase = phase;
    }
    context.restore();
  }

  function spawnSpark(time) {
    if (reduceMotion || frame % 9 !== 0 || sparks.length > 100) return;
    const source = heartParticles[Math.floor(Math.random() * heartParticles.length)];
    if (!source) return;
    sparks.push({
      x: source.x,
      y: source.y,
      vx: random(-.28, .28),
      vy: random(.15, .75),
      gravity: random(.003, .012),
      life: 1,
      decay: random(.004, .009),
      radius: random(.6, 1.7),
      color: heartColors[source.colorIndex],
      phase: time * .001
    });
  }

  function drawSparks() {
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (let index = sparks.length - 1; index >= 0; index -= 1) {
      const spark = sparks[index];
      spark.vy += spark.gravity;
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.life -= spark.decay;
      if (spark.life <= 0 || spark.y > height + 10) {
        sparks.splice(index, 1);
        continue;
      }
      context.globalAlpha = spark.life * .78;
      context.fillStyle = spark.color;
      context.beginPath();
      context.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function updateAndDrawHeart(time) {
    context.save();
    context.globalCompositeOperation = 'lighter';

    for (const particle of heartParticles) {
      const target = targetFor(particle, time);
      const distanceX = target.x - particle.x;
      const distanceY = target.y - particle.y;
      particle.vx += distanceX * .022;
      particle.vy += distanceY * .022;

      if (pointer.active) {
        const pointerX = particle.x - pointer.x;
        const pointerY = particle.y - pointer.y;
        const pointerDistance = Math.hypot(pointerX, pointerY);
        const influence = Math.max(0, 1 - pointerDistance / 115);
        if (influence > 0) {
          const force = influence * .42 / (pointerDistance || 1);
          particle.vx += pointerX * force;
          particle.vy += pointerY * force;
        }
      }

      particle.vx *= .885;
      particle.vy *= .885;
      particle.x += particle.vx;
      particle.y += particle.vy;

      const twinkle = .82 + Math.sin(time * .003 + particle.phase) * .18;
      const alpha = Math.min(1, particle.alpha * twinkle * target.brightness * 1.08);
      const color = heartColors[particle.colorIndex];
      if (particle.glow) {
        const glowSize = particle.radius * 11 * target.scale;
        context.globalAlpha = alpha * .7;
        context.drawImage(glowSprites[particle.colorIndex], particle.x - glowSize / 2, particle.y - glowSize / 2, glowSize, glowSize);
      }
      context.globalAlpha = alpha;
      context.fillStyle = color;
      const radius = particle.radius * target.scale * 1.06;
      const motionTrail = reduceMotion ? 0 : Math.min(9, Math.abs(particle.vx) * 2.4);
      const streakWidth = radius * particle.streak + motionTrail;
      const trailOffset = particle.vx > 0 ? -motionTrail / 2 : motionTrail / 2;
      context.fillRect(particle.x - streakWidth / 2 + trailOffset, particle.y - radius / 2, streakWidth, radius);
    }
    context.restore();
  }

  function updateAndDrawOrbits(time) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (const particle of orbitParticles) {
      const target = orbitTargetFor(particle, time);
      particle.vx += (target.x - particle.x) * .035;
      particle.vy += (target.y - particle.y) * .035;
      particle.vx *= .84;
      particle.vy *= .84;
      particle.x += particle.vx;
      particle.y += particle.vy;

      const alpha = particle.alpha * target.brightness;
      const color = heartColors[particle.colorIndex];
      if (particle.glow) {
        const glowSize = particle.radius * 10 * target.scale;
        context.globalAlpha = alpha * .6;
        context.drawImage(glowSprites[particle.colorIndex], particle.x - glowSize / 2, particle.y - glowSize / 2, glowSize, glowSize);
      }
      context.globalAlpha = alpha;
      context.fillStyle = color;
      const radius = particle.radius * target.scale;
      const motionTrail = reduceMotion ? 0 : Math.min(16, Math.abs(particle.vx) * 4.2);
      const streakWidth = radius * particle.streak + motionTrail;
      const trailOffset = particle.vx > 0 ? -motionTrail / 2 : motionTrail / 2;
      context.fillRect(particle.x - streakWidth / 2 + trailOffset, particle.y - radius / 2, streakWidth, radius);
    }
    context.restore();
  }

  function drawReflection(time) {
    context.save();
    context.globalCompositeOperation = 'lighter';
    for (let index = 0; index < heartParticles.length; index += 9) {
      const particle = heartParticles[index];
      const reflectedY = waterLine + Math.max(0, waterLine - particle.y) * .13;
      if (reflectedY > height) continue;
      context.globalAlpha = particle.alpha * .09 * (1 + Math.sin(time * .002 + particle.phase) * .4);
      context.fillStyle = heartColors[particle.colorIndex];
      context.fillRect(particle.x - 1, reflectedY, 2, 1);
    }
    context.restore();
  }

  function draw(time) {
    if (!reduceMotion && lastDrawTime && time - lastDrawTime < frameInterval) {
      if (!document.hidden) animationFrame = requestAnimationFrame(draw);
      return;
    }
    if (!lastDrawTime || time - lastDrawTime > frameInterval * 3) {
      lastDrawTime = time;
    } else {
      lastDrawTime += frameInterval;
    }
    frame += 1;
    drawBackground();
    drawGround(time);
    spawnFountain(time);
    drawFountain();
    drawTransferParticles(time);
    drawReflection(time);
    updateAndDrawHeart(time);
    updateAndDrawOrbits(time);
    spawnSpark(time);
    drawSparks();

    if (!reduceMotion && !document.hidden) animationFrame = requestAnimationFrame(draw);
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  }

  canvas.addEventListener('pointermove', setPointer, { passive: true });
  canvas.addEventListener('pointerdown', function (event) {
    setPointer(event);
    window.setTimeout(function () { pointer.active = false; }, 620);
  }, { passive: true });
  canvas.addEventListener('pointerleave', function () { pointer.active = false; });
  canvas.addEventListener('pointerup', function () { pointer.active = false; });

  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    cancelAnimationFrame(animationFrame);
    lastDrawTime = 0;
    if (!document.hidden && !reduceMotion) animationFrame = requestAnimationFrame(draw);
  });

  resize();
}());
