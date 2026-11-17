
/* ==========================================
   DESI TOUCH
   CINEMATIC FOOD EXPERIENCE
   Main JavaScript Engine
   Total Intro: 32 Seconds
========================================== */

import * as THREE from 'three';


// ==========================================
// 1. ELEMENTS
// ==========================================

const intro = document.getElementById('cinematic-intro');
const canvas = document.getElementById('cinematic-canvas');
const mainWebsite = document.getElementById('main-website');

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

const skipButton = document.getElementById('skip-intro');
const progressBar = document.getElementById('progress-bar');
const progressTime = document.getElementById('progress-time');

const scenes = [
  document.getElementById('scene-awakening'),
  document.getElementById('scene-ingredients'),
  document.getElementById('scene-creation'),
  document.getElementById('scene-magic')
];

const brandReveal = document.getElementById('brand-reveal');


// ==========================================
// 2. GLOBAL SETTINGS
// ==========================================

const TOTAL_DURATION = 32;

let introFinished = false;
let introTimeline = null;
let elapsedTime = 0;

const isMobile = window.matchMedia(
  '(max-width: 600px)'
).matches;


// ==========================================
// 3. THREE.JS WORLD
// ==========================================

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
  0x100805,
  0.035
);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 11);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: !isMobile,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;


// ==========================================
// 4. LIGHTING
// ==========================================

const ambientLight = new THREE.AmbientLight(
  0xffbd79,
  1.2
);

scene.add(ambientLight);

const mainLight = new THREE.PointLight(
  0xff8a32,
  150,
  35
);

mainLight.position.set(0, 2, 5);
scene.add(mainLight);

const goldLight = new THREE.PointLight(
  0xffd18b,
  100,
  25
);

goldLight.position.set(-5, 1, 3);
scene.add(goldLight);

const redLight = new THREE.PointLight(
  0xe64b13,
  120,
  30
);

redLight.position.set(5, -2, 2);
scene.add(redLight);


// ==========================================
// 5. 3D OBJECT MATERIALS
// ==========================================

const materials = {
  gold: new THREE.MeshStandardMaterial({
    color: 0xe8a74c,
    metalness: 0.8,
    roughness: 0.25
  }),

  orange: new THREE.MeshStandardMaterial({
    color: 0xe87525,
    metalness: 0.3,
    roughness: 0.4
  }),

  dark: new THREE.MeshStandardMaterial({
    color: 0x291207,
    metalness: 0.7,
    roughness: 0.3
  }),

  cream: new THREE.MeshStandardMaterial({
    color: 0xf5d6a0,
    metalness: 0.15,
    roughness: 0.5
  }),

  red: new THREE.MeshStandardMaterial({
    color: 0x9c2411,
    metalness: 0.2,
    roughness: 0.4
  })
};


// ==========================================
// 6. CREATE PROCEDURAL OBJECTS
// ==========================================

const foodGroup = new THREE.Group();
scene.add(foodGroup);

const floatingObjects = [];

function createObject(
  geometry,
  material,
  x,
  y,
  z,
  scale = 1
) {

  const mesh = new THREE.Mesh(
    geometry,
    material
  );

  mesh.position.set(x, y, z);
  mesh.scale.setScalar(scale);

  mesh.rotation.set(
    Math.random() * 3,
    Math.random() * 3,
    Math.random() * 3
  );

  mesh.userData = {
    originalY: y,
    speed: Math.random() * 1.5 + 0.5,
    rotationSpeed: Math.random() * 0.8 + 0.2
  };

  foodGroup.add(mesh);
  floatingObjects.push(mesh);

  return mesh;
}


// Golden spices
for (let i = 0; i < 15; i++) {

  createObject(
    new THREE.SphereGeometry(
      0.12 + Math.random() * 0.12,
      16,
      16
    ),
    i % 2 === 0 ? materials.gold : materials.orange,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 5,
    0.8 + Math.random() * 1.5
  );

}


// Floating chili-like shapes
for (let i = 0; i < 6; i++) {

  const chili = createObject(
    new THREE.ConeGeometry(0.16, 1.1, 12),
    materials.red,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 7,
    1,
    0.8
  );

  chili.rotation.z = Math.PI / 2;

}


// Decorative rings
for (let i = 0; i < 8; i++) {

  createObject(
    new THREE.TorusGeometry(
      0.35 + Math.random() * 0.3,
      0.035,
      8,
      40
    ),
    materials.gold,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 7,
    -1,
    1
  );

}


// ==========================================
// 7. CINEMATIC COOKING PAN
// ==========================================

const panGroup = new THREE.Group();

const panBody = new THREE.Mesh(
  new THREE.CylinderGeometry(
    1.6,
    1.25,
    0.5,
    64
  ),
  materials.dark
);

panBody.position.y = -0.4;
panGroup.add(panBody);


const panSurface = new THREE.Mesh(
  new THREE.CircleGeometry(1.48, 64),
  new THREE.MeshStandardMaterial({
    color: 0x4b1e0c,
    metalness: 0.8,
    roughness: 0.25
  })
);

panSurface.rotation.x = -Math.PI / 2;
panSurface.position.y = -0.12;
panGroup.add(panSurface);


const panHandle = new THREE.Mesh(
  new THREE.BoxGeometry(2.3, 0.15, 0.2),
  materials.dark
);

panHandle.position.set(2.6, -0.4, 0);
panGroup.add(panHandle);


panGroup.scale.setScalar(0);
panGroup.position.set(0, -0.5, 2);

scene.add(panGroup);


// ==========================================
// 8. FIRE PARTICLES
// ==========================================

const fireCount = isMobile ? 350 : 700;

const fireGeometry = new THREE.BufferGeometry();

const firePositions = new Float32Array(
  fireCount * 3
);

const fireColors = new Float32Array(
  fireCount * 3
);

const fireData = [];

for (let i = 0; i < fireCount; i++) {

  firePositions[i * 3] =
    (Math.random() - 0.5) * 5;

  firePositions[i * 3 + 1] =
    Math.random() * 5 - 2;

  firePositions[i * 3 + 2] =
    Math.random() * 4;

  fireColors[i * 3] = 1;
  fireColors[i * 3 + 1] =
    0.2 + Math.random() * 0.45;

  fireColors[i * 3 + 2] =
    Math.random() * 0.08;

  fireData.push({
    speed: 0.3 + Math.random() * 1.2,
    drift: Math.random() * 0.02
  });

}

fireGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(firePositions, 3)
);

fireGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(fireColors, 3)
);

const fireMaterial = new THREE.PointsMaterial({
  size: 0.075,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const fireParticles = new THREE.Points(
  fireGeometry,
  fireMaterial
);

scene.add(fireParticles);


// ==========================================
// 9. STARDUST PARTICLES
// ==========================================

const dustCount = isMobile ? 700 : 1400;

const dustGeometry = new THREE.BufferGeometry();

const dustPositions = new Float32Array(
  dustCount * 3
);

for (let i = 0; i < dustCount; i++) {

  dustPositions[i * 3] =
    (Math.random() - 0.5) * 24;

  dustPositions[i * 3 + 1] =
    (Math.random() - 0.5) * 14;

  dustPositions[i * 3 + 2] =
    (Math.random() - 0.5) * 12;

}

dustGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(dustPositions, 3)
);

const dustMaterial = new THREE.PointsMaterial({
  color: 0xffc27a,
  size: 0.035,
  transparent: true,
  opacity: 0.7,
  blending: THREE.AdditiveBlending
});

const dust = new THREE.Points(
  dustGeometry,
  dustMaterial
);

scene.add(dust);


// ==========================================
// 10. THREE.JS ANIMATION LOOP
// ==========================================

const clock = new THREE.Clock();

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {

  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;

  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

});


function animateThree() {

  requestAnimationFrame(animateThree);

  const time = clock.getElapsedTime();

  floatingObjects.forEach((obj) => {

    obj.rotation.x +=
      0.003 * obj.userData.rotationSpeed;

    obj.rotation.y +=
      0.005 * obj.userData.rotationSpeed;

    obj.position.y =
      obj.userData.originalY +
      Math.sin(time * obj.userData.speed) * 0.35;

  });


  // Fire motion
  const positions =
    fireGeometry.attributes.position.array;

  for (let i = 0; i < fireCount; i++) {

    const index = i * 3;

    positions[index + 1] +=
      fireData[i].speed * 0.018;

    positions[index] +=
      Math.sin(time + i) * fireData[i].drift;

    if (positions[index + 1] > 4) {

      positions[index + 1] = -2;

      positions[index] =
        (Math.random() - 0.5) * 5;

    }

  }

  fireGeometry.attributes.position.needsUpdate = true;


  // Ambient movement
  dust.rotation.y = time * 0.015;

  camera.position.x +=
    (mouseX * 0.35 - camera.position.x) * 0.015;

  camera.position.y +=
    (-mouseY * 0.25 - camera.position.y) * 0.015;

  camera.lookAt(0, 0, 0);


  mainLight.intensity =
    130 + Math.sin(time * 2) * 25;

  renderer.render(scene, camera);

}

animateThree();


// ==========================================
// 11. GSAP INITIAL SETTINGS
// ==========================================

gsap.registerPlugin(ScrollTrigger);

gsap.set(scenes, {
  autoAlpha: 0
});

gsap.set(brandReveal, {
  autoAlpha: 0
});

gsap.set(mainWebsite, {
  autoAlpha: 0
});


// ==========================================
// 12. CINEMATIC STORY TIMELINE
// ==========================================

function createIntroTimeline() {

  const tl = gsap.timeline({
    paused: true,
    onUpdate: updateProgress,
    onComplete: enterWebsite
  });


  // 00–04 SECONDS
  // THE AWAKENING

  tl.to(scenes[0], {
    autoAlpha: 1,
    duration: 0.8
  }, 0);

  tl.fromTo(
    scenes[0].querySelector('.scene-heading'),
    {
      y: 90,
      opacity: 0,
      scale: 0.85
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: 'power3.out'
    },
    0.5
  );

  tl.fromTo(
    scenes[0].querySelector('.scene-number'),
    {
      y: 20,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1
    },
    0.7
  );

  tl.to(
    scenes[0].querySelector('.scene-line'),
    {
      width: 160,
      duration: 1.2,
      ease: 'power2.inOut'
    },
    1.5
  );

  tl.to(scenes[0], {
    autoAlpha: 0,
    duration: 0.6
  }, 3.4);


  // 04–08 SECONDS
  // THE INGREDIENTS

  tl.to(scenes[1], {
    autoAlpha: 1,
    duration: 0.6
  }, 4);

  tl.fromTo(
    scenes[1].querySelector('.scene-heading'),
    {
      x: -100,
      opacity: 0
    },
    {
      x: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power3.out'
    },
    4.2
  );

  tl.fromTo(
    scenes[1].querySelector('.scene-description'),
    {
      y: 25,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1
    },
    5
  );

  tl.to(foodGroup.rotation, {
    y: Math.PI * 2,
    duration: 4,
    ease: 'power1.inOut'
  }, 4);

  tl.to(scenes[1], {
    autoAlpha: 0,
    duration: 0.5
  }, 7.5);


  // 08–13 SECONDS
  // THE CREATION

  tl.to(scenes[2], {
    autoAlpha: 1,
    duration: 0.5
  }, 8);

  tl.fromTo(
    scenes[2].querySelector('.scene-heading'),
    {
      scale: 1.4,
      y: 50,
      opacity: 0
    },
    {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'power3.out'
    },
    8.2
  );

  tl.fromTo(
    scenes[2].querySelector('.scene-description'),
    {
      opacity: 0,
      y: 20
    },
    {
      opacity: 1,
      y: 0,
      duration: 1
    },
    9
  );

  tl.to(panGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.4,
    ease: 'back.out(1.8)'
  }, 9);

  tl.to(panGroup.rotation, {
    y: Math.PI * 2,
    duration: 3,
    ease: 'power1.inOut'
  }, 9);

  tl.to(scenes[2], {
    autoAlpha: 0,
    duration: 0.6
  }, 12.5);


  // 13–18 SECONDS
  // THE MAGIC

  tl.to(scenes[3], {
    autoAlpha: 1,
    duration: 0.5
  }, 13);

  tl.fromTo(
    scenes[3].querySelector('.scene-heading'),
    {
      y: 100,
      opacity: 0,
      scale: 0.8
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.6,
      ease: 'power4.out'
    },
    13.2
  );

  tl.to(camera.position, {
    z: 7,
    duration: 4,
    ease: 'power2.inOut'
  }, 13);

  tl.to(foodGroup.scale, {
    x: 1.5,
    y: 1.5,
    z: 1.5,
    duration: 3,
    ease: 'power2.out'
  }, 14);

  tl.to(scenes[3], {
    autoAlpha: 0,
    duration: 0.6
  }, 17.5);


  // 18–25 SECONDS
  // BUILD UP BEFORE BRAND REVEAL

  tl.to(foodGroup.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.2,
    ease: 'power3.in'
  }, 18);

  tl.to(panGroup.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1
  }, 18);

  tl.to(camera.position, {
    z: 11,
    x: 0,
    y: 0,
    duration: 2,
    ease: 'power2.inOut'
  }, 19);

  tl.to(mainLight, {
    intensity: 230,
    duration: 2
  }, 20);

  tl.to(fireMaterial, {
    size: 0.12,
    opacity: 1,
    duration: 2
  }, 20);

  tl.to(dustMaterial, {
    size: 0.06,
    opacity: 1,
    duration: 2
  }, 21);

  tl.to(brandReveal, {
    autoAlpha: 1,
    duration: 1
  }, 24);


  // ========================================
  // 25–32 SECONDS
  // EPIC BRAND TITLE REVEAL
  // ========================================

  tl.fromTo(
    '.reveal-ring',
    {
      scale: 0.3,
      opacity: 0
    },
    {
      scale: 1.5,
      opacity: 0.6,
      stagger: 0.2,
      duration: 2.5,
      ease: 'power3.out'
    },
    24.5
  );

  tl.fromTo(
    '.brand-pretitle',
    {
      opacity: 0,
      y: -35,
      letterSpacing: '18px'
    },
    {
      opacity: 1,
      y: 0,
      letterSpacing: '9px',
      duration: 1.5,
      ease: 'power3.out'
    },
    25
  );

  tl.fromTo(
    '#brand-title',
    {
      opacity: 0,
      y: 150,
      scale: 0.65,
      rotationX: 45
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 2.3,
      ease: 'expo.out'
    },
    26
  );

  tl.to(
    '.brand-divider',
    {
      width: '65%',
      duration: 1.5,
      ease: 'power3.inOut'
    },
    27.3
  );

  tl.to(
    '.brand-tagline',
    {
      opacity: 1,
      y: 0,
      duration: 1.3,
      ease: 'power2.out'
    },
    27.7
  );

  tl.to(
    '.reveal-light',
    {
      scale: 1.5,
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut'
    },
    28
  );

  tl.to(
    '#brand-title',
    {
      scale: 1.06,
      duration: 2,
      ease: 'power1.inOut'
    },
    29
  );

  tl.to(
    '.reveal-ring',
    {
      rotation: 180,
      duration: 3,
      stagger: 0.2,
      ease: 'none'
    },
    27
  );

  tl.to(
    '.reveal-flash',
    {
      opacity: 0.75,
      duration: 0.15,
      ease: 'power2.in'
    },
    30.8
  );

  tl.to(
    '.reveal-flash',
    {
      opacity: 0,
      duration: 0.7
    },
    31
  );

  return tl;
}


// ==========================================
// 13. PROGRESS BAR
// ==========================================

function updateProgress() {

  if (!introTimeline) return;

  elapsedTime = introTimeline.time();

  const progress = Math.min(
    elapsedTime / TOTAL_DURATION,
    1
  );

  progressBar.style.width =
    `${progress * 100}%`;

  const seconds = Math.floor(elapsedTime);

  progressTime.textContent =
    `00:${String(seconds).padStart(2, '0')}`;

}


// ==========================================
// 14. ENTER MAIN WEBSITE
// ==========================================

function enterWebsite() {

  if (introFinished) return;

  introFinished = true;

  if (introTimeline && introTimeline.isActive()) {
    introTimeline.pause();
  }

  const entrance = gsap.timeline();

  entrance.to(intro, {
    opacity: 0,
    duration: 1.2,
    ease: 'power2.inOut'
  });

  entrance.set(intro, {
    display: 'none'
  });

  entrance.to(mainWebsite, {
    autoAlpha: 1,
    duration: 1.2,
    ease: 'power2.out'
  }, '-=0.2');

  entrance.from(
    '.main-logo, .main-nav a',
    {
      opacity: 0,
      y: -20,
      stagger: 0.1,
      duration: 0.8
    },
    '-=0.7'
  );

  entrance.from(
    '.hero-content > *',
    {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 1
    },
    '-=0.6'
  );

  document.body.style.overflow = 'auto';

}


// ==========================================
// 15. SKIP INTRO
// ==========================================

function skipIntro() {

  if (introFinished) return;

  if (introTimeline) {
    introTimeline.pause();
  }

  enterWebsite();

}

skipButton.addEventListener(
  'click',
  skipIntro
);


// ==========================================
// 16. CUSTOM CURSOR
// ==========================================

if (!isMobile && cursor && follower) {

  let followerX = 0;
  let followerY = 0;

  window.addEventListener('mousemove', (e) => {

    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1
    });

    followerX = e.clientX;
    followerY = e.clientY;

  });

  gsap.ticker.add(() => {

    gsap.to(follower, {
      x: followerX,
      y: followerY,
      duration: 0.5,
      ease: 'power2.out'
    });

  });

  document.querySelectorAll(
    'a, button'
  ).forEach((element) => {

    element.addEventListener('mouseenter', () => {

      gsap.to(follower, {
        scale: 1.8,
        backgroundColor: 'rgba(232,180,92,0.12)',
        duration: 0.25
      });

    });

    element.addEventListener('mouseleave', () => {

      gsap.to(follower, {
        scale: 1,
        backgroundColor: 'transparent',
        duration: 0.25
      });

    });

  });

}


// ==========================================
// 17. MOBILE MENU
// ==========================================

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {

  menuButton.addEventListener('click', () => {

    const isOpen = nav.classList.toggle('active');

    menuButton.setAttribute(
      'aria-expanded',
      String(isOpen)
    );

  });

  nav.querySelectorAll('a').forEach((link) => {

    link.addEventListener('click', () => {

      nav.classList.remove('active');

      menuButton.setAttribute(
        'aria-expanded',
        'false'
      );

    });

  });

}


// ==========================================
// 18. SCROLL ANIMATIONS
// ==========================================

gsap.utils.toArray(
  '.story-section, .experience-section'
).forEach((section) => {

  gsap.from(section.querySelectorAll('h2, p, .section-label'), {

    opacity: 0,
    y: 55,
    stagger: 0.15,
    duration: 1.2,

    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      once: true
    }

  });

});


// ==========================================
// 19. RESIZE HANDLER
// ==========================================

window.addEventListener('resize', () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      isMobile ? 1.5 : 2
    )
  );

});


// ==========================================
// 20. START CINEMATIC EXPERIENCE
// ==========================================

document.body.style.overflow = 'hidden';

introTimeline = createIntroTimeline();

introTimeline.play();

console.log(
  'DESI TOUCH — Cinematic Experience Started'
);
