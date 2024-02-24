import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * Create a Particle
 */

// ###### Geometry ######
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
// Create a BufferGeometry()
const particleGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
// ##### Adding different color to particles #####
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

// ####### Material #######
const particleMaterial = new THREE.PointsMaterial();
// change 'size' property to control all particles size and
// the 'sizeAttenuation' to specify if distant particle should be smaller than the closer one
// 'sizeAttenuation' is used for setting the perspective
particleMaterial.size = 0.1;
particleMaterial.sizeAttenuation = true;

// ###### color, map and alphaMap ######
// change color of particles using 'color' property.
// After instantiation we have to use Three.Color class to change the color
particleMaterial.color = new THREE.Color("#ff88cc");
// using 'map' property to put a texture on those particles
// #### using only 'map' property will have affect of hiding the particles behind it when we zoom it. As it will
// be a opaque texture.

// particleMaterial.map = particleTexture;

// ###### For viewing particles behind the particle we have to activate transparency.
// activate the transparency and use the texture on 'alphaMap' property
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;

// The edges of the particles are still visible, That is because the particles are drawn in the same order
// as they are created, and Webgl dosen't really know which one is in front of the other.

// There are multiple of ways of fixing it.

// ####### Using Alpha Test #######
// The alphaTest is a value between 0 and 1 that enable the webGL to know when not to render the pixel
// according to that pixel's transparency.

// Normally, The black part of the texture will be rendered but with the alpha 0.
// With alpha test we will tell the GPU to not even render this black part.

// By default, the value is 0, meaning that the pixel will be rendered anyway.

// particleMaterial.alphaTest = 0.002;

// ####### Using Depth Test #######
// When drawing, the WebGL tests if what's being drawn is closer than what's already drawn.
// This is called depth testing and can be deactivated with 'depthTest'

// particleMaterial.depthTest = false;

// If we add other it mesh to the scene it will create problems for other geometries for

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

// ######## Using Depth Write #######

// The depth of what's being drawn is stored in what we call a depth buffer.
// Instead of not testing if the particle is closer than what's in this depth buffer,
// we can tell the webGL not to write particles in that depth buffer with 'depthWrite'

particleMaterial.depthWrite = false;

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

// ######## Using Blending ########

// The WebGL currently draws pixels one on top of the other pixel.
// With 'blending' property, we can tell the webGL to add the color of the pixel to the color of the other pixel
// already drawn.

particleMaterial.blending = THREE.AdditiveBlending;

// For adding different color to every particle.
particleMaterial.vertexColors = true;
// The main color of the material still affects these vertex colors. To see the effect of only vertexColor we
// have to remove the main color

// ####### Create Points #######
// Instantiate a Points class like we do for Mesh

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
