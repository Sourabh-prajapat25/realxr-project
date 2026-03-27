// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 12;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("canvas-container").appendChild(renderer.domElement);

// Controls (keep but soften)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = false;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const light = new THREE.PointLight(0x3b82f6, 2);
light.position.set(5, 5, 5);
scene.add(light);

// 🌌 PARTICLES (deep space)
const particlesGeometry = new THREE.BufferGeometry();
const count = 2500;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 80;
}

particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// 🧠 WORDS
const words = [
    "Beyond Reality",
    "Virtual Reality",
    "Augmented Reality",
    "Mixed Reality",
    "Experience",
    "Innovate",
    "Design",
    "Metaverse",
    "Simulation",
    "Explore",
    "Build"
];

const fontLoader = new THREE.FontLoader();
let textMeshes = [];

fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {

        words.forEach((word, i) => {

            const geometry = new THREE.TextGeometry(word, {
                font: font,
                size: 0.6,
                height: 0.15
            });

            const material = new THREE.MeshStandardMaterial({
                color: 0x38bdf8,
                emissive: 0x1e3a8a
            });

            const mesh = new THREE.Mesh(geometry, material);

            geometry.center();

            // Spread in space
            mesh.position.set(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 40
            );

            scene.add(mesh);
            textMeshes.push(mesh);
        });
    }
);

// 🎬 Animation
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // 🎥 Cinematic camera movement
    camera.position.x = Math.sin(time * 0.2) * 2;
    camera.position.y = Math.cos(time * 0.2) * 1;

    // Words animation
    textMeshes.forEach((mesh, i) => {

        // 🔄 Slow rotation
        mesh.rotation.y += 0.001;

        // 🌊 Floating
        mesh.position.y += Math.sin(time + i) * 0.002;

        // 🚀 Z-depth movement (coming forward)
        mesh.position.z += 0.02;

        // Reset when too close
        if (mesh.position.z > 10) {
            mesh.position.z = -30;
        }

        // ✨ Glow pulse
        const glow = (Math.sin(time * 2 + i) + 1) / 2;
        mesh.material.emissive.setRGB(glow * 0.2, glow * 0.4, glow);
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 🎯 Buttons
document.getElementById("colorBtn").addEventListener("click", () => {
    textMeshes.forEach(mesh => {
        mesh.material.color.setHex(Math.random() * 0xffffff);
    });
});

let scaled = false;
document.getElementById("scaleBtn").addEventListener("click", () => {
    const scale = scaled ? 1 : 1.5;

    textMeshes.forEach(mesh => {
        mesh.scale.set(scale, scale, scale);
    });

    scaled = !scaled;
});