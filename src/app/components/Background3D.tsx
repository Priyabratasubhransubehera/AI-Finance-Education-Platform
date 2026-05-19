import { useRef, useMemo, Suspense } from 'react';

// Fallback gradient background
function FallbackBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-40">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-chart-2/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent animate-pulse" />
    </div>
  );
}

// Lazy load Three.js components only when needed
let Canvas: any = null;
let Sphere: any = null;
let MeshDistortMaterial: any = null;
let useFrame: any = null;
let THREE: any = null;

// Dynamic import function
async function loadThreeComponents() {
  try {
    const [fiber, drei, three] = await Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('three'),
    ]);
    Canvas = fiber.Canvas;
    useFrame = fiber.useFrame;
    Sphere = drei.Sphere;
    MeshDistortMaterial = drei.MeshDistortMaterial;
    THREE = three;
    return true;
  } catch (error) {
    console.error('Failed to load Three.js components:', error);
    return false;
  }
}

function AnimatedSphere({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const meshRef = useRef<any>(null);

  if (!useFrame || !THREE) return null;

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.x += 0.001 * speed;
      meshRef.current.rotation.y += 0.002 * speed;
    }
  });

  if (!Sphere || !MeshDistortMaterial) return null;

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<any>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  if (!useFrame) return null;

  useFrame((state: any) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
      
      <AnimatedSphere position={[-3, 0, -2]} color="#00d4ff" speed={0.5} />
      <AnimatedSphere position={[3, -1, -3]} color="#7c3aed" speed={0.7} />
      <AnimatedSphere position={[0, 2, -4]} color="#10b981" speed={0.4} />
      
      <FloatingParticles />
    </>
  );
}

export function Background3D() {
  // Always return fallback for now to avoid dynamic import issues
  // TODO: Re-enable Three.js after fixing build issues
  return <FallbackBackground />;
  
  /* Disabled temporarily
  const [is3DLoaded, setIs3DLoaded] = useState(false);

  useEffect(() => {
    loadThreeComponents().then((loaded) => {
      setIs3DLoaded(loaded);
    });
  }, []);

  if (!is3DLoaded || !Canvas) {
    return <FallbackBackground />;
  }

  try {
    return (
      <div className="fixed inset-0 -z-10 opacity-40">
        <Suspense fallback={<FallbackBackground />}>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <Scene />
          </Canvas>
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading 3D background:', error);
    return <FallbackBackground />;
  }
  */
}