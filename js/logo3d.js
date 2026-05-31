/* ==========================================================================
   SYNAPTIC TECH - RENDERIZADO LOGO 3D INTERACTIVO (THREE.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const canvas = document.getElementById('logo3d-canvas');
  
  // 1. Inicialización de la Escena, Cámara y Renderizador
  const scene = new THREE.Scene();
  
  // Cámara de perspectiva
  const camera = new THREE.PerspectiveCamera(
    45, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    100
  );
  camera.position.z = 6.5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true, // Fondo transparente
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // 2. Definición del Grafo de la Red Neuronal (Logo de Synaptic Tech)
  // Recreamos la S central con un anillo circular de 10 nodos
  const nodes = [];
  const connections = [];

  // Parámetros de escala
  const scale = 1.3;
  const outerRadius = 1.5 * scale;
  const innerRadius = 0.8 * scale;

  // NODOS PERIMETRALES (10 nodos colocados uniformemente en círculo Z = 0)
  for (let i = 0; i < 10; i++) {
    const angle = (i * 2 * Math.PI) / 10 - Math.PI / 2; // Iniciar desde el sur (-90 deg)
    const x = Math.cos(angle) * outerRadius;
    const y = Math.sin(angle) * outerRadius;
    
    // Leve curvatura en Z para volumen 3D
    const z = (1 - (x*x + y*y) / (outerRadius * outerRadius * 2)) * 0.15;
    
    nodes.push({
      id: i,
      pos: new THREE.Vector3(x, y, z),
      isOuter: true
    });
  }

  // NODOS INTERNOS (Forman la estructura de la "S" y conectores)
  // Reajustados para calzar perfectamente con la geometría simétrica del logotipo original
  const innerConfigs = [
    { id: 10, x: 0.0, y: 0.5, z: 0.25 },     // Terminal Superior de la S
    { id: 11, x: 0.45, y: 0.65, z: 0.25 },   // Codo Superior Derecho
    { id: 12, x: 0.4, y: 0.2, z: 0.3 },      // Codo Medio Derecho
    { id: 13, x: 0.0, y: 0.0, z: 0.35 },     // Nodo del Centro
    { id: 14, x: -0.4, y: -0.2, z: 0.3 },    // Codo Medio Izquierdo
    { id: 15, x: -0.45, y: -0.65, z: 0.25 }, // Codo Inferior Izquierdo
    { id: 16, x: 0.0, y: -0.5, z: 0.25 }     // Terminal Inferior de la S
  ];

  innerConfigs.forEach(cfg => {
    nodes.push({
      id: cfg.id,
      pos: new THREE.Vector3(cfg.x * scale, cfg.y * scale, cfg.z * scale),
      isOuter: false
    });
  });

  // CONEXIONES (Índices de origen y destino)
  // 1. Anillo exterior continuo (Círculo de la marca)
  for (let i = 0; i < 10; i++) {
    connections.push({ from: i, to: (i + 1) % 10 });
  }

  // 2. Trazo continuo de la "S" interna
  connections.push({ from: 10, to: 11 });
  connections.push({ from: 11, to: 12 });
  connections.push({ from: 12, to: 13 });
  connections.push({ from: 13, to: 14 });
  connections.push({ from: 14, to: 15 });
  connections.push({ from: 15, to: 16 });

  // 3. Conexiones radiales de soporte (Spokes) según el diseño original
  connections.push({ from: 0, to: 10 }); // De 12:00 a Terminal Superior S
  connections.push({ from: 1, to: 11 }); // De 1:12 a Codo Superior Derecho
  connections.push({ from: 2, to: 12 }); // De 2:24 a Codo Medio Derecho
  connections.push({ from: 3, to: 12 }); // De 3:36 a Codo Medio Derecho
  connections.push({ from: 5, to: 16 }); // De 6:00 a Terminal Inferior S
  connections.push({ from: 6, to: 15 }); // De 7:12 a Codo Inferior Izquierdo
  connections.push({ from: 7, to: 14 }); // De 8:24 a Codo Medio Izquierdo
  connections.push({ from: 8, to: 14 }); // De 9:36 a Codo Medio Izquierdo
  connections.push({ from: 9, to: 10 }); // De 10:48 a Terminal Superior S

  // 3. Creación de Objetos en el Grupo 3D
  const logoGroup = new THREE.Group();
  scene.add(logoGroup);

  // Materiales Premium
  // Material de los Nodos (Brillante y Emisivo Cian)
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00aaff,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.9,
    flatShading: false
  });

  // Material de las Conexiones (Tuberías metálicas translúcidas/emisivas)
  const connectionMaterial = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    emissive: 0x003355,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85
  });

  // Dibujar Nodos como Anillos (TorusGeometry) coincidiendo con el logotipo real
  // En lugar de esferas simples, creamos anillos metálicos que miran al frente
  const nodeGeometry = new THREE.TorusGeometry(0.09 * scale, 0.025 * scale, 8, 24);
  const outerNodeGeometry = new THREE.TorusGeometry(0.07 * scale, 0.02 * scale, 8, 24);
  
  const nodeMeshes = [];
  nodes.forEach(node => {
    const geom = node.isOuter ? outerNodeGeometry : nodeGeometry;
    const mesh = new THREE.Mesh(geom, nodeMaterial);
    mesh.position.copy(node.pos);
    
    // Leve sombra
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    logoGroup.add(mesh);
    nodeMeshes.push(mesh);
  });

  // Función para crear un cilindro alineado entre dos puntos (tubería de sinapsis)
  function createCylinderBetweenPoints(p1, p2, radius, material) {
    const direction = new THREE.Vector3().subVectors(p2, p1);
    const length = direction.length();
    
    // Geometría del cilindro orientada verticalmente
    const geom = new THREE.CylinderGeometry(radius, radius, length, 12);
    
    // Desplazar el pivote al extremo del cilindro y rotar para alinearlo
    geom.translate(0, length / 2, 0);
    geom.rotateX(Math.PI / 2);
    
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.copy(p1);
    mesh.lookAt(p2);
    
    mesh.castShadow = true;
    
    return mesh;
  }

  // Dibujar Conexiones
  connections.forEach(conn => {
    const startNode = nodes.find(n => n.id === conn.from);
    const endNode = nodes.find(n => n.id === conn.to);
    
    if (startNode && endNode) {
      const radius = 0.022 * scale;
      const mesh = createCylinderBetweenPoints(startNode.pos, endNode.pos, radius, connectionMaterial);
      logoGroup.add(mesh);
    }
  });

  // 4. Campo de Partículas de Datos de Fondo (Data Dust)
  const particleCount = 180;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Generar partículas en un volumen cúbico alrededor del logo
    particlePositions[i] = (Math.random() - 0.5) * 8;     // X
    particlePositions[i + 1] = (Math.random() - 0.5) * 8; // Y
    particlePositions[i + 2] = (Math.random() - 0.5) * 5; // Z
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  // Textura circular simple para partículas en lugar de cuadrados
  const pMaterial = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.035,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeometry, pMaterial);
  scene.add(particleSystem);

  // 5. Iluminación
  // Luz ambiental suave azul
  const ambientLight = new THREE.AmbientLight(0x0a1128, 1.5);
  scene.add(ambientLight);

  // Foco puntual cian principal que ilumina desde el frente-derecha
  const pointLight1 = new THREE.PointLight(0x00f0ff, 15, 10);
  pointLight1.position.set(2, 2, 3);
  pointLight1.castShadow = true;
  scene.add(pointLight1);

  // Foco puntual morado/azul eléctrico desde la izquierda para contraste bicolor
  const pointLight2 = new THREE.PointLight(0x0066ff, 12, 10);
  pointLight2.position.set(-3, -1, 2);
  scene.add(pointLight2);

  // Foco trasero sutil para silueta
  const rimLight = new THREE.PointLight(0xffffff, 5, 8);
  rimLight.position.set(0, 0, -4);
  scene.add(rimLight);

  // 6. Interactividad con el Mouse (Paralaje y Rotación)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  // Escuchar movimiento del mouse
  window.addEventListener('mousemove', (event) => {
    // Coordenadas normalizadas de -1 a 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Limitar el ángulo objetivo
    targetX = mouseX * 0.4;
    targetY = mouseY * 0.3;
  });

  // Efecto de arrastre móvil / touch
  window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      targetX = mouseX * 0.4;
      targetY = mouseY * 0.3;
    }
  });

  // 7. Bucle de Animación (Render Loop)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotación automática continua de fondo
    logoGroup.rotation.y = elapsedTime * 0.15;
    
    // Suavizado de la interactividad del mouse (Interpolación lineal - Lerp)
    logoGroup.rotation.y += (targetX - logoGroup.rotation.y) * 0.08;
    logoGroup.rotation.x += (targetY - logoGroup.rotation.x) * 0.08;
    
    // Efecto de respiración oscilante en los nodos (brillo palpitante)
    const pulse = Math.sin(elapsedTime * 2.5) * 0.15 + 0.85;
    nodeMaterial.emissiveIntensity = pulse;
    
    // Animación muy sutil del campo de partículas (flotación)
    particleSystem.rotation.y = elapsedTime * 0.015;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // 8. Adaptabilidad al redimensionar ventana
  window.addEventListener('resize', () => {
    // Actualizar dimensiones de la cámara
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // Actualizar renderizador
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});
