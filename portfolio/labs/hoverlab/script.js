const scenes = [
  { id: 'sceneOne', image1: 'assets/ny.jpg', image2: 'assets/ny-info.jpg', displacementImage: 'assets/fluid.jpg', ratio: 1 },
  { id: 'sceneTwo', image1: 'assets/ice.jpg', image2: 'assets/ice2.jpg', displacementImage: 'assets/dot.jpg', ratio: 1 },
  { id: 'sceneThree', image1: 'assets/hover.jpg', image2: 'assets/hover.jpg', displacementImage: 'assets/heightMap.png', ratio: 1 }
];
let intensity = .12;
let instances = [];

function renderScenes() {
  scenes.forEach((scene) => { document.getElementById(scene.id).innerHTML = ''; });
  instances = scenes.map((scene) => new hoverEffect({ parent: document.getElementById(scene.id), image1: scene.image1, image2: scene.image2, displacementImage: scene.displacementImage, imagesRatio: scene.ratio, intensity1: intensity, intensity2: intensity, speedIn: .8, speedOut: .8 }));
}

document.querySelectorAll('[data-intensity]').forEach((button) => button.addEventListener('click', () => {
  intensity = button.dataset.intensity === 'strong' ? .28 : .12;
  document.querySelectorAll('[data-intensity]').forEach((item) => item.classList.toggle('active', item === button));
  document.getElementById('status').textContent = (intensity > .2 ? '强烈' : '柔和') + '模式 · 3 个实验场景';
  renderScenes();
}));
renderScenes();
