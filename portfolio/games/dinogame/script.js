(function initDinoGame() {
  "use strict"

  const GROUND_SPEED = 0.05
  const JUMP_SPEED = 0.4
  const JUMP_RELEASE_SPEED = 0.17
  const GRAVITY = 0.00155
  const DINO_FRAME_COUNT = 2
  const DINO_FRAME_TIME = 100
  const DINO_STATIONARY_SRC = "imgs/dino-stationary.png"
  const OBSTACLE_SPEED = 0.05
  const OBSTACLE_INTERVAL_MIN = 850
  const OBSTACLE_INTERVAL_MAX = 1800
  const SPEED_SCALE_INCREASE = 0.00001
  const MAX_FRAME_DELTA = 100
  const HIGH_SCORE_KEY = "xiaolin-dino-high-score"
  const STATS_KEY = "xiaolin-dino-stats"
  const SOUND_KEY = "xiaolin-dino-sound"
  const STAGES = [
    { min: 0, key: "meadow", name: "原野", themeColor: "#f4f7f4" },
    { min: 100, key: "sunset", name: "黄昏", themeColor: "#fff1df" },
    { min: 250, key: "twilight", name: "暮色", themeColor: "#d8c2bf" },
    { min: 450, key: "night", name: "星夜", themeColor: "#182124" },
  ]

  const worldElem = document.querySelector("[data-world]")
  const scoreElem = document.querySelector("[data-score]")
  const highScoreElem = document.querySelector("[data-high-score]")
  const gameMessageElem = document.querySelector("[data-game-message]")
  const messageKickerElem = gameMessageElem.querySelector(".message-kicker")
  const messageTitleElem = document.querySelector("[data-message-title]")
  const finalScoreElem = document.querySelector("[data-final-score]")
  const startButton = document.querySelector("[data-start-button]")
  const jumpButton = document.querySelector("[data-jump-button]")
  const duckButton = document.querySelector("[data-duck-button]")
  const pauseButton = document.querySelector("[data-pause-button]")
  const pauseIconElem = document.querySelector("[data-pause-icon]")
  const soundButton = document.querySelector("[data-sound-button]")
  const milestoneElem = document.querySelector("[data-milestone]")
  const stageLabelElem = document.querySelector("[data-stage-label]")
  const stageProgressElem = document.querySelector("[data-stage-progress]")
  const runTimeElem = document.querySelector("[data-run-time]")
  const runCountElem = document.querySelector("[data-run-count]")
  const bestTimeElem = document.querySelector("[data-best-time]")
  const themeColorElem = document.querySelector('meta[name="theme-color"]')
  const groundElems = document.querySelectorAll("[data-ground]")
  const dinoElem = document.querySelector("[data-dino]")
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  let lastTime = null
  let speedScale = 1
  let score = 0
  let runTime = 0
  let lastStatsRender = 0
  let highScore = readHighScore()
  let stats = readStats()
  let soundEnabled = readSoundPreference()
  let audioContext = null
  let gameState = "idle"
  let isJumping = false
  let isDucking = false
  let dinoFrame = 0
  let currentFrameTime = 0
  let yVelocity = 0
  let nextObstacleTime = OBSTACLE_INTERVAL_MIN
  let currentStageIndex = 0
  let milestoneTimer = null

  renderScore(scoreElem, 0)
  renderScore(highScoreElem, highScore)
  renderStats()
  applyStage(0, false)
  updateSoundButton()
  updatePauseButton()

  document.addEventListener("keydown", handleKeyDown)
  document.addEventListener("keyup", handleKeyUp)
  startButton.addEventListener("click", () => {
    if (gameState === "paused") resumeGame()
    else startGame()
  })
  pauseButton.addEventListener("click", togglePause)
  soundButton.addEventListener("click", toggleSound)
  bindHoldButton(jumpButton, beginJump, cutJump)
  bindHoldButton(duckButton, startDucking, stopDucking)

  worldElem.addEventListener("pointerdown", event => {
    if (event.target.closest("button, a")) return
    event.preventDefault()
    if (gameState === "running") beginJump()
    else if (gameState === "paused") resumeGame()
    else startGame()
  })
  worldElem.addEventListener("pointerup", cutJump)
  worldElem.addEventListener("pointercancel", cutJump)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && gameState === "running") pauseGame(true)
  })

  function bindHoldButton(button, onStart, onEnd) {
    button.addEventListener("pointerdown", event => {
      event.preventDefault()
      event.stopPropagation()
      try {
        button.setPointerCapture?.(event.pointerId)
      } catch (error) {
        // Some embedded browsers expose pointer capture without an active pointer.
      }
      onStart()
    })
    button.addEventListener("pointerup", event => {
      event.preventDefault()
      event.stopPropagation()
      onEnd()
    })
    button.addEventListener("pointercancel", onEnd)
  }

  function update(time) {
    if (gameState !== "running") return

    if (lastTime == null) {
      lastTime = time
      window.requestAnimationFrame(update)
      return
    }

    const delta = Math.min(time - lastTime, MAX_FRAME_DELTA)
    lastTime = time
    runTime += delta

    updateGround(delta)
    updateDino(delta)
    updateObstacles(delta)
    speedScale += delta * SPEED_SCALE_INCREASE
    score += delta * 0.01
    renderScore(scoreElem, score)
    updateStage()

    if (time - lastStatsRender >= 100) {
      renderStats()
      lastStatsRender = time
    }

    if (checkLose()) {
      handleLose()
      return
    }

    window.requestAnimationFrame(update)
  }

  function startGame() {
    if (gameState === "running") return
    if (gameState === "paused") {
      resumeGame()
      return
    }

    lastTime = null
    lastStatsRender = 0
    speedScale = 1
    score = 0
    runTime = 0
    gameState = "running"
    stats.runs += 1
    saveStats()
    setupGround()
    setupDino()
    setupObstacles()
    applyStage(0, false)
    renderScore(scoreElem, score)
    renderStats()
    gameMessageElem.hidden = true
    finalScoreElem.hidden = true
    worldElem.classList.remove("game-paused", "is-hit")
    worldElem.classList.add("game-running")
    pauseButton.disabled = false
    updatePauseButton()
    worldElem.focus({ preventScroll: true })
    playSequence([[330, .06], [440, .08, .05]])
    window.requestAnimationFrame(update)
  }

  function pauseGame(automatic) {
    if (gameState !== "running") return

    gameState = "paused"
    stopDucking()
    worldElem.classList.remove("game-running")
    worldElem.classList.add("game-paused")
    messageKickerElem.textContent = "进度已保存"
    messageTitleElem.textContent = automatic ? "已自动暂停" : "游戏暂停"
    finalScoreElem.textContent = `得分 ${formatScore(score)} · ${formatTime(runTime)}`
    finalScoreElem.hidden = false
    startButton.textContent = "继续游戏"
    gameMessageElem.hidden = false
    updatePauseButton()
  }

  function resumeGame() {
    if (gameState !== "paused") return

    gameState = "running"
    lastTime = null
    gameMessageElem.hidden = true
    finalScoreElem.hidden = true
    worldElem.classList.remove("game-paused")
    worldElem.classList.add("game-running")
    updatePauseButton()
    worldElem.focus({ preventScroll: true })
    window.requestAnimationFrame(update)
  }

  function togglePause() {
    if (gameState === "running") pauseGame(false)
    else if (gameState === "paused") resumeGame()
  }

  function handleLose() {
    gameState = "lost"
    stopDucking()
    dinoElem.src = "imgs/dino-lose.png"
    worldElem.classList.remove("game-running", "game-paused")
    worldElem.classList.add("is-hit")
    window.setTimeout(() => worldElem.classList.remove("is-hit"), 420)

    const finalScore = Math.floor(score)
    const isNewHighScore = finalScore > highScore
    if (isNewHighScore) {
      highScore = finalScore
      saveHighScore(highScore)
      renderScore(highScoreElem, highScore)
    }

    stats.totalScore += finalScore
    stats.bestTime = Math.max(stats.bestTime, runTime)
    saveStats()
    renderStats()
    playTone(125, .22, { type: "sawtooth", volume: .035 })
    vibrate(55)

    messageKickerElem.textContent = isNewHighScore ? "刷新纪录" : "像素冲刺"
    messageTitleElem.textContent = "本局结束"
    finalScoreElem.textContent = `得分 ${formatScore(finalScore)} · ${formatTime(runTime)}`
    finalScoreElem.hidden = false
    startButton.textContent = "再来一次"
    gameMessageElem.hidden = false
    pauseButton.disabled = true
    updatePauseButton()
  }

  function handleKeyDown(event) {
    if (event.code === "Escape") {
      event.preventDefault()
      togglePause()
      return
    }

    if (event.code === "Enter" && gameState !== "running") {
      event.preventDefault()
      if (gameState === "paused") resumeGame()
      else startGame()
      return
    }

    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault()
      if (event.repeat) return
      if (gameState !== "running") startGame()
      beginJump()
      return
    }

    if (event.code === "ArrowDown" && gameState === "running") {
      event.preventDefault()
      startDucking()
    }
  }

  function handleKeyUp(event) {
    if (event.code === "Space" || event.code === "ArrowUp") cutJump()
    if (event.code === "ArrowDown") stopDucking()
  }

  function setupGround() {
    setCustomProperty(groundElems[0], "--left", 0)
    setCustomProperty(groundElems[1], "--left", 300)
  }

  function updateGround(delta) {
    groundElems.forEach(ground => {
      incrementCustomProperty(ground, "--left", delta * speedScale * GROUND_SPEED * -1)
      if (getCustomProperty(ground, "--left") <= -300) {
        incrementCustomProperty(ground, "--left", 600)
      }
    })
  }

  function setupDino() {
    isJumping = false
    isDucking = false
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    dinoElem.classList.remove("is-jumping", "is-ducking")
    dinoElem.src = DINO_STATIONARY_SRC
  }

  function updateDino(delta) {
    if (isJumping) {
      dinoElem.src = DINO_STATIONARY_SRC
    } else {
      if (currentFrameTime >= DINO_FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
        dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
        currentFrameTime -= DINO_FRAME_TIME
      }
      currentFrameTime += delta * speedScale
    }

    if (!isJumping) return

    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
    yVelocity -= GRAVITY * delta
    if (getCustomProperty(dinoElem, "--bottom") <= 0 && yVelocity < 0) {
      setCustomProperty(dinoElem, "--bottom", 0)
      isJumping = false
      dinoElem.classList.remove("is-jumping")
      spawnDust(5)
      playTone(180, .035, { volume: .008 })
    }
  }

  function beginJump() {
    if (isJumping || gameState !== "running") return false

    stopDucking()
    yVelocity = JUMP_SPEED
    isJumping = true
    dinoElem.classList.add("is-jumping")
    playTone(430, .07, { volume: .018 })
    return true
  }

  function cutJump() {
    if (isJumping && yVelocity > JUMP_RELEASE_SPEED) yVelocity = JUMP_RELEASE_SPEED
  }

  function startDucking() {
    if (gameState !== "running" || isJumping || isDucking) return false

    isDucking = true
    dinoElem.classList.add("is-ducking")
    return true
  }

  function stopDucking() {
    isDucking = false
    dinoElem.classList.remove("is-ducking")
  }

  function setupObstacles() {
    nextObstacleTime = 700
    worldElem.querySelectorAll("[data-obstacle]").forEach(obstacle => obstacle.remove())
  }

  function updateObstacles(delta) {
    worldElem.querySelectorAll("[data-obstacle]").forEach(obstacle => {
      incrementCustomProperty(obstacle, "--left", delta * speedScale * OBSTACLE_SPEED * -1)
      if (getCustomProperty(obstacle, "--left") <= -20) obstacle.remove()
    })

    if (nextObstacleTime <= 0) {
      createObstacle()
      const baseInterval = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX)
      nextObstacleTime = Math.max(680, baseInterval / Math.min(speedScale, 1.55))
    }
    nextObstacleTime -= delta
  }

  function createObstacle() {
    const flying = currentStageIndex >= 1 && Math.random() < .42
    const obstacle = document.createElement("img")
    obstacle.dataset.obstacle = flying ? "ptero" : "cactus"
    obstacle.src = flying ? "imgs/ptero.svg" : "imgs/cactus.png"
    obstacle.alt = ""
    obstacle.draggable = false
    obstacle.className = flying ? "obstacle flying-obstacle" : "obstacle cactus"
    setCustomProperty(obstacle, "--left", 100)
    worldElem.append(obstacle)
  }

  function checkLose() {
    const dinoRect = shrinkRect(dinoElem.getBoundingClientRect(), .12, .08)

    return [...worldElem.querySelectorAll("[data-obstacle]")].some(obstacle => {
      const obstacleRect = shrinkRect(
        obstacle.getBoundingClientRect(),
        obstacle.dataset.obstacle === "ptero" ? .16 : .12,
        obstacle.dataset.obstacle === "ptero" ? .18 : .08
      )
      return (
        obstacleRect.left < dinoRect.right &&
        obstacleRect.top < dinoRect.bottom &&
        obstacleRect.right > dinoRect.left &&
        obstacleRect.bottom > dinoRect.top
      )
    })
  }

  function shrinkRect(rect, horizontalRatio, verticalRatio) {
    const horizontal = rect.width * horizontalRatio
    const vertical = rect.height * verticalRatio
    return {
      left: rect.left + horizontal,
      right: rect.right - horizontal,
      top: rect.top + vertical,
      bottom: rect.bottom - vertical,
    }
  }

  function updateStage() {
    let nextIndex = 0
    for (let index = STAGES.length - 1; index >= 0; index -= 1) {
      if (score >= STAGES[index].min) {
        nextIndex = index
        break
      }
    }
    if (nextIndex !== currentStageIndex) applyStage(nextIndex, true)

    const currentStage = STAGES[currentStageIndex]
    const nextStage = STAGES[currentStageIndex + 1]
    const ratio = nextStage
      ? (score - currentStage.min) / (nextStage.min - currentStage.min)
      : 1
    stageProgressElem.style.transform = `scaleX(${Math.max(0, Math.min(ratio, 1))})`
  }

  function applyStage(index, announce) {
    currentStageIndex = index
    const stage = STAGES[index]
    worldElem.dataset.stage = stage.key
    stageLabelElem.textContent = `${index + 1} · ${stage.name}`
    themeColorElem?.setAttribute("content", stage.themeColor)

    if (!announce) {
      stageProgressElem.style.transform = "scaleX(0)"
      return
    }

    milestoneElem.textContent = `阶段 ${index + 1} · ${stage.name}`
    milestoneElem.classList.remove("show")
    void milestoneElem.offsetWidth
    milestoneElem.classList.add("show")
    window.clearTimeout(milestoneTimer)
    milestoneTimer = window.setTimeout(() => milestoneElem.classList.remove("show"), 1800)
    playSequence([[620, .08], [820, .1, .09]])
    vibrate(22)
  }

  function spawnDust(count) {
    if (reduceMotion) return
    const worldRect = worldElem.getBoundingClientRect()
    const dinoRect = dinoElem.getBoundingClientRect()
    const originX = dinoRect.left - worldRect.left + dinoRect.width * .35
    const originY = dinoRect.bottom - worldRect.top - 3

    for (let index = 0; index < count; index += 1) {
      const dust = document.createElement("span")
      dust.className = "dust-pixel"
      dust.style.left = `${originX}px`
      dust.style.top = `${originY}px`
      dust.style.setProperty("--dust-x", `${-12 - index * 8}px`)
      dust.style.setProperty("--dust-y", `${-5 - (index % 3) * 5}px`)
      dust.style.animationDelay = `${index * 18}ms`
      worldElem.append(dust)
      dust.addEventListener("animationend", () => dust.remove(), { once: true })
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled
    try {
      localStorage.setItem(SOUND_KEY, String(soundEnabled))
    } catch (error) {
      // The setting still applies for the current page.
    }
    updateSoundButton()
    if (soundEnabled) playTone(520, .08, { volume: .018 })
  }

  function updateSoundButton() {
    soundButton.classList.toggle("is-muted", !soundEnabled)
    soundButton.setAttribute("aria-pressed", String(!soundEnabled))
    soundButton.setAttribute("aria-label", soundEnabled ? "关闭音效" : "开启音效")
    soundButton.title = soundButton.getAttribute("aria-label")
  }

  function updatePauseButton() {
    const paused = gameState === "paused"
    pauseIconElem.textContent = paused ? "▶" : "Ⅱ"
    pauseButton.setAttribute("aria-label", paused ? "继续游戏" : "暂停游戏")
    pauseButton.title = pauseButton.getAttribute("aria-label")
  }

  function getAudioContext() {
    if (audioContext) return audioContext
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    audioContext = new AudioContextClass()
    return audioContext
  }

  function playTone(frequency, duration, options = {}) {
    if (!soundEnabled) return

    const context = getAudioContext()
    if (!context) return
    if (context.state === "suspended") context.resume().catch(() => {})

    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const startAt = context.currentTime + (options.delay || 0)
    const volume = options.volume || .02
    oscillator.type = options.type || "square"
    oscillator.frequency.setValueAtTime(frequency, startAt)
    gain.gain.setValueAtTime(.0001, startAt)
    gain.gain.exponentialRampToValueAtTime(volume, startAt + .012)
    gain.gain.exponentialRampToValueAtTime(.0001, startAt + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + duration + .02)
  }

  function playSequence(notes) {
    notes.forEach(([frequency, duration, delay = 0]) => {
      playTone(frequency, duration, { delay, volume: .016 })
    })
  }

  function vibrate(duration) {
    try {
      navigator.vibrate?.(duration)
    } catch (error) {
      // Vibration is an optional enhancement.
    }
  }

  function getCustomProperty(element, property) {
    return Number.parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0
  }

  function setCustomProperty(element, property, value) {
    element.style.setProperty(property, value)
  }

  function incrementCustomProperty(element, property, increment) {
    setCustomProperty(element, property, getCustomProperty(element, property) + increment)
  }

  function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function formatScore(value) {
    return String(Math.floor(value)).padStart(5, "0")
  }

  function renderScore(element, value) {
    element.textContent = formatScore(value)
  }

  function formatTime(milliseconds) {
    const seconds = Math.max(0, milliseconds) / 1000
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`
  }

  function renderStats() {
    runTimeElem.textContent = formatTime(runTime)
    runCountElem.textContent = String(stats.runs)
    bestTimeElem.textContent = formatTime(stats.bestTime)
  }

  function readHighScore() {
    try {
      const value = Number.parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0", 10)
      return Number.isFinite(value) && value > 0 ? value : 0
    } catch (error) {
      return 0
    }
  }

  function saveHighScore(value) {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(value))
    } catch (error) {
      // The current game remains playable when storage is unavailable.
    }
  }

  function readStats() {
    try {
      const saved = JSON.parse(localStorage.getItem(STATS_KEY) || "{}")
      return {
        runs: Number.isFinite(saved.runs) ? Math.max(0, saved.runs) : 0,
        totalScore: Number.isFinite(saved.totalScore) ? Math.max(0, saved.totalScore) : 0,
        bestTime: Number.isFinite(saved.bestTime) ? Math.max(0, saved.bestTime) : 0,
      }
    } catch (error) {
      return { runs: 0, totalScore: 0, bestTime: 0 }
    }
  }

  function saveStats() {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats))
    } catch (error) {
      // Statistics remain available until the page closes.
    }
  }

  function readSoundPreference() {
    try {
      return localStorage.getItem(SOUND_KEY) !== "false"
    } catch (error) {
      return true
    }
  }
})()
