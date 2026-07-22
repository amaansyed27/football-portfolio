import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Sparkles, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { NormalizedModel } from './NormalizedModel'

const clamp = THREE.MathUtils.clamp
const smooth = (a: number, b: number, value: number) => {
  const t = clamp((value - a) / Math.max(b - a, 0.0001), 0, 1)
  return t * t * (3 - 2 * t)
}

function documentProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0
}

function sectionVisibility(id: string) {
  const section = document.getElementById(id)
  if (!section) return 0
  const rect = section.getBoundingClientRect()
  const viewport = window.innerHeight
  const center = rect.top + rect.height / 2
  const distance = Math.abs(center - viewport / 2)
  return clamp(1 - distance / ((rect.height + viewport) * 0.48), 0, 1)
}

function sectionProgress(id: string) {
  const section = document.getElementById(id)
  if (!section) return 0
  const rect = section.getBoundingClientRect()
  return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1)
}

function BallJourney() {
  const ballRef = useRef<THREE.Group>(null)
  const shadowRef = useRef<THREE.Mesh>(null)
  const lastScroll = useRef(0)
  const spinVelocity = useRef(0)
  const { scene } = useGLTF('/models/al-rihla-ball.glb')

  const ball = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const dimensions = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    clone.position.sub(center)
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
    const group = new THREE.Group()
    group.add(clone)
    group.scale.setScalar(1.35 / (Math.max(dimensions.x, dimensions.y, dimensions.z) || 1))
    return group
  }, [scene])

  const path = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.45, -1.2, 0.25),
      new THREE.Vector3(1.45, -1.38, 0.05),
      new THREE.Vector3(-2.25, -1.28, -0.05),
      new THREE.Vector3(2.2, -1.4, -0.28),
      new THREE.Vector3(-1.75, -1.28, -0.2),
      new THREE.Vector3(2.05, -1.42, -0.45),
      new THREE.Vector3(-2.15, -1.3, -0.32),
      new THREE.Vector3(1.55, -1.38, -0.15),
    ], false, 'catmullrom', 0.62),
    [],
  )

  useFrame((_, delta) => {
    if (!ballRef.current || !shadowRef.current) return

    const progress = documentProgress()
    const mobile = window.innerWidth < 760
    const shot = smooth(0.865, 0.988, progress)
    const pathProgress = clamp(progress / 0.875, 0, 1)
    const target = path.getPoint(pathProgress)

    if (mobile) target.x *= 0.48
    target.y += Math.abs(Math.sin(pathProgress * Math.PI * 15)) * 0.2

    if (shot > 0) {
      target.x = THREE.MathUtils.lerp(target.x, 0, shot)
      target.y = THREE.MathUtils.lerp(target.y, -0.48 + Math.sin(shot * Math.PI) * 1.05, shot)
      target.z = THREE.MathUtils.lerp(target.z, -5.4, shot)
    }

    const scrollDelta = window.scrollY - lastScroll.current
    lastScroll.current = window.scrollY
    spinVelocity.current = THREE.MathUtils.lerp(spinVelocity.current, scrollDelta * 0.024, 0.18)

    ballRef.current.position.lerp(target, 1 - Math.pow(0.0004, delta))
    ballRef.current.rotation.x += spinVelocity.current + delta * 0.35
    ballRef.current.rotation.z -= spinVelocity.current * 0.72 + delta * 0.22

    const heroBoost = 1 + (1 - smooth(0, 0.12, progress)) * 0.18
    const shotScale = THREE.MathUtils.lerp(heroBoost, 0.72, shot)
    ballRef.current.scale.lerp(new THREE.Vector3(shotScale, shotScale, shotScale), 0.12)

    shadowRef.current.position.lerp(new THREE.Vector3(target.x, -1.58, target.z + 0.08), 0.16)
    const shadowScale = clamp(1.15 - (target.y + 1.55) * 0.58, 0.45, 1.2)
    shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale)
    const material = shadowRef.current.material as THREE.MeshBasicMaterial
    material.opacity = THREE.MathUtils.lerp(material.opacity, shot > 0.7 ? 0 : 0.28, 0.12)
  })

  return (
    <>
      <group ref={ballRef}>
        <primitive object={ball} />
        <pointLight position={[0, 0.45, 0.8]} intensity={4.2} distance={3.2} color="#fff0ba" />
      </group>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.66, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </>
  )
}

type TrophyStageProps = {
  sectionId: string
  url: string
  side: -1 | 1
  size: number
  accent: string
}

function TrophyStage({ sectionId, url, side, size, accent }: TrophyStageProps) {
  const ref = useRef<THREE.Group>(null)
  const pedestal = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current || !pedestal.current) return
    const visibility = sectionVisibility(sectionId)
    const progress = sectionProgress(sectionId)
    const eased = smooth(0.04, 0.5, visibility)

    ref.current.visible = visibility > 0.025
    ref.current.position.x = THREE.MathUtils.lerp(side * 4.8, side * 2.3, eased)
    ref.current.position.y = THREE.MathUtils.lerp(-1.45, -0.06 + Math.sin(progress * Math.PI) * 0.16, eased)
    ref.current.position.z = THREE.MathUtils.lerp(-2.1, -0.25, eased)
    ref.current.rotation.y += delta * 0.17 * side
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, side * (1 - eased) * 0.16, 0.08)
    ref.current.scale.setScalar(eased * (0.9 + visibility * 0.24))

    const pedestalMaterial = pedestal.current.material as THREE.MeshBasicMaterial
    pedestalMaterial.opacity = eased * 0.38
  })

  return (
    <group ref={ref}>
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.28}>
        <NormalizedModel url={url} size={size} />
      </Float>
      <mesh ref={pedestal} position={[0, -1.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 1.72, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 1.6, 1.4]} intensity={22} distance={6} color={accent} />
      <spotLight position={[side * -2.2, 4.5, 2]} target-position={[0, 0, 0]} angle={0.42} penumbra={0.9} intensity={72} color={accent} />
    </group>
  )
}

function TrophyMoments() {
  return (
    <>
      <TrophyStage sectionId="experience" url="/models/champions-league.glb" side={1} size={4.25} accent="#dce9ff" />
      <TrophyStage sectionId="projects" url="/models/world-cup-trophy.glb" side={-1} size={3.8} accent="#edbb00" />
    </>
  )
}

function FinalGoal() {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    const visibility = sectionVisibility('contact')
    const progress = sectionProgress('contact')
    const appear = smooth(0.02, 0.68, visibility)
    ref.current.visible = appear > 0.02
    ref.current.position.z = THREE.MathUtils.lerp(-9.5, -4.7, appear)
    ref.current.position.y = THREE.MathUtils.lerp(-1.45, -0.86, appear)
    ref.current.scale.setScalar(appear * (0.92 + progress * 0.08))
  })

  return (
    <group ref={ref} position={[0, -0.86, -7.5]} rotation={[0, Math.PI, 0]}>
      <NormalizedModel url="/models/football-goal.glb" size={7.8} />
      <spotLight position={[0, 5, 3]} angle={0.58} penumbra={0.88} intensity={62} color="#dce9ff" />
    </group>
  )
}

function ResponsiveCamera() {
  const { camera } = useThree()

  useEffect(() => {
    const update = () => {
      camera.position.z = window.innerWidth < 760 ? 8.5 : 7.35
      const perspectiveCamera = camera as THREE.PerspectiveCamera
      perspectiveCamera.fov = window.innerWidth < 760 ? 48 : 41
      perspectiveCamera.updateProjectionMatrix()
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
      <ambientLight intensity={0.82} color="#9eb7e8" />
      <hemisphereLight intensity={1.25} color="#f7f1df" groundColor="#071328" />
      <directionalLight position={[4, 7, 5]} intensity={5.4} color="#fff1c2" />
      <spotLight position={[-5, 6, 4]} angle={0.38} penumbra={0.82} intensity={82} color="#edbb00" />
      <spotLight position={[5, 4, 2]} angle={0.42} penumbra={0.9} intensity={66} color="#a50044" />
      <Sparkles count={46} scale={[11, 7, 8]} size={1.25} speed={0.18} color="#edbb00" opacity={0.34} />
      <BallJourney />
      <TrophyMoments />
      <FinalGoal />
      <Environment preset="city" environmentIntensity={0.58} />
    </>
  )
}

export function FootballScene() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.35], fov: 41 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}><SceneContent /></Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/al-rihla-ball.glb')
useGLTF.preload('/models/champions-league.glb')
useGLTF.preload('/models/world-cup-trophy.glb')
useGLTF.preload('/models/football-goal.glb')
