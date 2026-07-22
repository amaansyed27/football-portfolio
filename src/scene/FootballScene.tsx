import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Sparkles, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { NormalizedModel } from './NormalizedModel'

const clamp = THREE.MathUtils.clamp
const smooth = (a: number, b: number, value: number) => {
  const t = clamp((value - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function BallJourney() {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/al-rihla-ball.glb')
  const ball = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const dimensions = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    clone.position.sub(center)
    const group = new THREE.Group()
    group.add(clone)
    group.scale.setScalar(0.82 / (Math.max(dimensions.x, dimensions.y, dimensions.z) || 1))
    return group
  }, [scene])

  useFrame((_, delta) => {
    if (!ref.current) return
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    const mobile = window.innerWidth < 760
    let x = mobile ? 0.9 : 1.7
    let y = -1.35
    let z = 0

    if (p > 0.1 && p < 0.83) {
      const q = smooth(0.1, 0.83, p)
      x = (mobile ? 0.92 : 2.1) * Math.sin(q * Math.PI * 5.2)
      y = -1.55 + Math.abs(Math.sin(q * Math.PI * 5.2)) * 0.3
      z = -0.15 + Math.sin(q * Math.PI * 2) * 0.4
    }
    if (p >= 0.83) {
      const shot = smooth(0.86, 0.985, p)
      x = THREE.MathUtils.lerp(mobile ? 0.7 : 1.5, 0, shot)
      y = THREE.MathUtils.lerp(-1.4, -0.65, Math.sin(shot * Math.PI))
      z = THREE.MathUtils.lerp(0, -5.2, shot)
    }

    ref.current.position.lerp(new THREE.Vector3(x, y, z), 1 - Math.pow(0.001, delta))
    ref.current.rotation.x += delta * (1.4 + p * 4)
    ref.current.rotation.z -= delta * (0.8 + p * 3)
  })

  return <primitive ref={ref} object={ball} />
}

function TrophyMoments() {
  const champion = useRef<THREE.Group>(null)
  const world = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    if (champion.current) {
      champion.current.rotation.y += delta * 0.13
      champion.current.visible = p > 0.34 && p < 0.63
      const alpha = Math.sin(smooth(0.34, 0.63, p) * Math.PI)
      champion.current.scale.setScalar(alpha)
    }
    if (world.current) {
      world.current.rotation.y -= delta * 0.1
      world.current.visible = p > 0.62 && p < 0.84
      const alpha = Math.sin(smooth(0.62, 0.84, p) * Math.PI)
      world.current.scale.setScalar(alpha)
    }
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(p * Math.PI * 2) * 0.2, 0.025)
  })
  return (
    <>
      <group ref={champion} position={[2.6, 0, -2]}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
          <NormalizedModel url="/models/champions-league.glb" size={3.2} />
        </Float>
      </group>
      <group ref={world} position={[-2.5, 0.1, -2.4]}>
        <Float speed={1} rotationIntensity={0.12} floatIntensity={0.28}>
          <NormalizedModel url="/models/world-cup-trophy.glb" size={3.1} />
        </Float>
      </group>
    </>
  )
}

function FinalGoal() {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    const appear = smooth(0.82, 0.95, p)
    ref.current.visible = appear > 0.01
    ref.current.position.z = THREE.MathUtils.lerp(-9, -5.9, appear)
  })
  return (
    <group ref={ref} position={[0, -0.85, -7.5]} rotation={[0, Math.PI, 0]}>
      <NormalizedModel url="/models/football-goal.glb" size={6.4} />
    </group>
  )
}

function ResponsiveCamera() {
  const { camera } = useThree()
  useEffect(() => {
    const update = () => {
      camera.position.z = window.innerWidth < 760 ? 8.6 : 7.2
      camera.updateProjectionMatrix()
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [camera])
  return null
}

function SceneContent() {
  return (
    <>
      <ResponsiveCamera />
      <ambientLight intensity={0.55} color="#6a8bc9" />
      <directionalLight position={[4, 6, 4]} intensity={4.2} color="#fff1c2" />
      <spotLight position={[-4, 5, 3]} angle={0.35} penumbra={0.8} intensity={70} color="#edbb00" />
      <spotLight position={[5, 3, 1]} angle={0.4} penumbra={0.9} intensity={55} color="#a50044" />
      <Sparkles count={34} scale={[10, 7, 7]} size={1.2} speed={0.16} color="#edbb00" opacity={0.28} />
      <BallJourney />
      <TrophyMoments />
      <FinalGoal />
      <Environment preset="city" environmentIntensity={0.3} />
    </>
  )
}

export function FootballScene() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7.2], fov: 44 }} dpr={[1, 1.65]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <Suspense fallback={null}><SceneContent /></Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/al-rihla-ball.glb')
