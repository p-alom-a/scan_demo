import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useRef, useEffect } from 'react'
import { Stage, Center, OrbitControls } from '@react-three/drei'
import { Model } from './Model'
import gsap from 'gsap'

function AnimatedCamera() {
  const { camera } = useThree()

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      const initialZoom = isMobile ? 50 : 70 // Zoom initial ajusté pour mobile
      const finalZoom = isMobile ? 80 : 105 // Zoom final ajusté pour mobile

      // 🔹 Position et zoom de départ
      camera.position.set(0, 0, 10)
      camera.zoom = initialZoom
      camera.updateProjectionMatrix()

      // 🔹 Animation de la caméra (avance + zoom)
      gsap.to(camera.position, {
        z: 6,
        duration: 2.2,
        ease: 'power3.out',
        delay: 0.3,
      })

      gsap.to(camera, {
        zoom: finalZoom,
        duration: 2.2,
        ease: 'power2.out',
        delay: 0.3,
        onUpdate: () => camera.updateProjectionMatrix(),
      })
    }

    handleResize() // Appeler au montage pour définir l'état initial
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [camera])

  return null
}

function AnimatedModel() {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return

    // 🔹 Rotation de départ (en radians)
    // 0 = face, π/2 = profil droit, -π/2 = profil gauche
    // ici, on part légèrement de 3/4 dos
    ref.current.rotation.y = -Math.PI * -1 // ← angle initial à ajuster

    // 🔹 Rotation finale (face caméra)
    gsap.to(ref.current.rotation, {
      y: 1.5, // ← rotation finale
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.3,
    })
  }, [])

  return (
    <Center>
      <group ref={ref}>
        <Model scale={1.8} />
      </group>
    </Center>
  )
}

export function Scene() {
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, 0, 10],
        zoom: 70,
        near: 0.1,
        far: 100,
      }}
    >
      {/* 🔹 Couleur de fond */}
      <color attach="background" args={['#1a1a23']} />

      <Suspense fallback={null}>
        <Stage
          intensity={1}
          preset="soft"
          environment="city"
          contactShadow={{ blur: 2, opacity: 0.4, scale: 8 }}
          adjustCamera={false}
        >
          <AnimatedModel />
        </Stage>

        <AnimatedCamera />
      </Suspense>

      {/* 🔹 Contrôles utilisateur */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minZoom={50}
        maxZoom={120}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  )
}
