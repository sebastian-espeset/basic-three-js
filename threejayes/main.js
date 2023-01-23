import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// set up a scene
const scene = new THREE.Scene();

//create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);

//create a material for the sphere
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.88,
});

// create a mesh, combining material and geometry
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// add lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 12);
light.intensity = 1.75;
scene.add(light);

// create a camera
// (field of view, aspect ratio x,x, )
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// renderer
// add a canvas to html. This is what three js will paint onto. grab the html object...
const canvas = document.querySelector(".webgl");

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
// add the renderer
const renderer = new THREE.WebGLRenderer({ canvas });

// how big is our canvas? where to render
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(3);
renderer.render(scene, camera);

// resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
//timeline stuff
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// mouse animation color
let mouseDown = false;
// this will be the color of the sphere based on where the pointer is on the screen
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.width) * 255),
      150,
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    new THREE.Color(`rgb(0,100,150)`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
