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

function sectionProgress(id: string) {
  const section = document.getElementById(id)
  if (!section) return 0
  const rect = section.getBoundingClientRect()
  return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1)
}

function sectionFocus(id: string) {
  const progress = sectionProgress(id)
  return smooth(0.025, 0.18, progress) * (1 - smooth(0.74, 0.93, progress))
}

function shotProgress() {
  return smooth(0.68, 0.94, sectionProgress('contact'))
}

function createFooterShotCurve(width: number) {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-width * 0.39, -1.14, 0.12),
      new THREE.Vector3(-width * 0.23, -0.72, 0.02),
      new THREE.Vector3(-width * 0.02, 0.38, -0.08),
      new THREE.Vector3(width * 0.22, -0.08, -0.18),
      new THREE.Vector3(width * 0.39, -0.82, -0.3),
    ],
    false,
    'catmullrom',
    0.44,
  )
}

function BallJourney() {
  const ballRef = useRef<THREE.Group>(null)
  const shadowRef = useRef<THREE.Mesh>(null)
  const lastScroll = useRef(0)
  const spinVelocity = useRef(0)
  const { scene } = useGLTF('/models/al-rihla-ball.glb')
  const { viewport } = useThree()

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
    group.scale.setScalar(1.12 / (Math.max(dimensions.x, dimensions.y, dimensions.z) || 1))
    return group
  }, [scene])

  const dribblePath = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(2.2, -1.18, 0.22),
          new THREE.Vector3(1.35, -1.34, 0.05),
          new THREE.Vector3(-1.95, -1.25, -0.04),
          new THREE.Vector3(1.92, -1.36, -0.2),
          new THREE.Vector3(-1.55, -1.25, -0.18),
          new THREE.Vector3(1.82, -1.35, -0.34),
          new THREE.Vector3(-1.8, -1.27, -0.26),
          new THREE.Vector3(1.55, -1.32, -0.12),
        ],
        false,
        'catmullrom',
        0.6,
      ),
    [],
  )

  const footerShotCurve = useMemo(() => createFooterShotCurve(viewport.width), [viewport.width])

  useFrame((_, delta) => {
    if (!ballRef.current || !shadowRef.current) return

    const progress = documentProgress()
    const contact = sectionProgress('contact')
    const mobile = window.innerWidth < 760
    const setup = smooth(0.03, 0.55, contact)
    const shot = shotProgress()
    const pathProgress = clamp(progress / 0.88, 0, 1)
    const target = dribblePath.getPoint(pathProgress)

    if (mobile) target.x *= 0.48
    target.y += Math.abs(Math.sin(pathProgress * Math.PI * 15)) * 0.16 * (1 - setup)

    const shotStart = footerShotCurve.getPoint(0)
    target.lerp(shotStart, setup)

    const charge = smooth(0.55, 0.68, contact) * (1 - shot)
    target.x -= viewport.width * 0.018 * charge
    target.y -= 0.08 * charge

    if (shot > 0) {
      const easedShot = 1 - Math.pow(1 - shot, 2.4)
      target.copy(footerShotCurve.getPoint(easedShot))
    }

    const scrollDelta = window.scrollY - lastScroll.current
    lastScroll.current = window.scrollY
    spinVelocity.current = THREE.MathUtils.lerp(spinVelocity.current, scrollDelta * 0.022, 0.18)

    ballRef.current.position.lerp(target, 1 - Math.pow(0.0004, delta))
    ballRef.current.rotation.x += spinVelocity.current + delta * (shot > 0 ? 15 + shot * 18 : 0.38)
    ballRef.current.rotation.z -= spinVelocity.current * 0.72 + delta * (shot > 0 ? 11 : 0.24)

    const deviceScale = mobile ? 0.78 : 1
    const heroBoost = 1 + (1 - smooth(0, 0.1, progress)) * 0.1
    const footerScale = THREE.MathUtils.lerp(0.94, 0.7, shot)
    const targetScale = THREE.MathUtils.lerp(heroBoost, footerScale, setup) * deviceScale
    ballRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)

    shadowRef.current.position.lerp(new THREE.Vector3(target.x, -1.56, target.z + 0.08), 0.16)
    const shadowScale = clamp(1.05 - (target.y + 1.5) * 0.6, 0.35, 1.05)
    shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale)
    const shadowMaterial = shadowRef.current.material as THREE.MeshBasicMaterial
    shadowMaterial.opacity = THREE.MathUtils.lerp(shadowMaterial.opacity, shot > 0.12 ? 0 : 0.25, 0.12)
  })

  return (
    <>
      <group ref={ballRef}>
        <primitive object={ball} />
        <pointLight position={[0, 0.42, 0.72]} intensity={4} distance={3} color="#fff0ba" />
      </group>
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </>
  )
}

function ShotTrail() {
  const { viewport } = useThree()
  const curve = useMemo(() => createFooterShotCurve(viewport.width), [viewport.width])
  const primary = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100))
    geometry.setDrawRange(0, 0)
    const material = new THREE.LineBasicMaterial({
      color: '#fff3c0',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geometry, material)
  }, [curve])

  const accent = useMemo(() => {
    const points = curve.getPoints(100).map((point) => point.clone().add(new THREE.Vector3(0, -0.035, 0.02)))
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.setDrawRange(0, 0)
    const material = new THREE.LineBasicMaterial({
      color: '#edbb00',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geometry, material)
  }, [curve])

  useEffect(
    () => () => {
      primary.geometry.dispose()
      ;(primary.material as THREE.Material).dispose()
      accent.geometry.dispose()
      ;(accent.material as THREE.Material).dispose()
    },
    [accent, primary],
  )

  useFrame(() => {
    const shot = shotProgress()
    const visible = shot > 0.012 && shot < 0.998
    const count = Math.max(0, Math.ceil(shot * 101))
    const fade = smooth(0.02, 0.16, shot) * (1 - smooth(0.76, 1, shot))

    primary.visible = visible
    accent.visible = visible
    primary.geometry.setDrawRange(0, count)
    accent.geometry.setDrawRange(0, count)
    ;(primary.material as THREE.LineBasicMaterial).opacity = fade * 0.76
    ;(accent.material as THREE.LineBasicMaterial).opacity = fade * 0.54
  })

  return (
    <group>
      <primitive object={primary} />
      <primitive object={accent} />
    </group>
  )
}

type TrophyStageProps = {
  sectionId: string
  url: string
  side: -1 | 1
  size: number
  accent: string
  modelRotation?: [number, number, number]
}

function TrophyStage({ sectionId, url, side, size, accent, modelRotation = [0, 0, 0] }: TrophyStageProps) {
  const ref = useRef<THREE.Group>(null)
  const pedestal = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current || !pedestal.current) return

    const focus = sectionFocus(sectionId)
    const progress = sectionProgress(sectionId)
    const eased = smooth(0.035, 0.88, focus)
    const mobile = window.innerWidth < 760
    const targetX = side * (mobile ? 0.88 : 2.62)
    const deviceScale = mobile ? 0.68 : 1

    ref.current.visible = focus > 0.012
    ref.current.position.x = THREE.MathUtils.lerp(side * (mobile ? 2.2 : 4.4), targetX, eased)
    ref.current.position.y = THREE.MathUtils.lerp(-1.25, -0.12 + Math.sin(progress * Math.PI) * 0.08, eased)
    ref.current.position.z = THREE.MathUtils.lerp(-2.8, -0.48, eased)
    ref.current.rotation.y = Math.sin(progress * Math.PI * 2) * 0.055 * side
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, side * (1 - eased) * 0.08, 0.08)

    const targetScale = eased * deviceScale
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.pow(0.001, delta))

    const pedestalMaterial = pedestal.current.material as THREE.MeshBasicMaterial
    pedestalMaterial.opacity = eased * 0.32
  })

  return (
    <group ref={ref}>
      <Float speed={0.62} rotationIntensity={0.015} floatIntensity={0.12}>
        <NormalizedModel url={url} size={size} rotation={modelRotation} />
      </Float>
      <mesh ref={pedestal} position={[0, -size * 0.53, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 0.21, size * 0.5, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <pointLight position={[0, size * 0.48, 1.25]} intensity={18} distance={5.5} color={accent} />
      <spotLight
        position={[side * -2.1, 4.2, 2]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.92}
        intensity={58}
        color={accent}
      />
    </group>
  )
}

function TrophyMoments() {
  return (
    <>
      <TrophyStage
        sectionId="experience"
        url="/models/champions-league.glb"
        side={1}
        size={2.72}
        accent="#dce9ff"
        modelRotation={[0, Math.PI, 0]}
      />
      <TrophyStage
        sectionId="projects"
        url="/models/world-cup-trophy.glb"
        side={-1}
        size={2.48}
        accent="#edbb00"
        modelRotation={[0, -0.2, 0]}
      />
    </>
  )
}

function ResponsiveCamera() {
  const { camera } = useThree()

  useEffect(() => {
    const update = () => {
      camera.position.z = window.innerWidth < 760 ? 8.65 : 7.55
      const perspectiveCamera = camera as THREE.PerspectiveCamera
      perspectiveCamera.fov = window.innerWidth < 760 ? 49 : 42
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
      <ambientLight intensity={0.78} color="#9eb7e8" />
      <hemisphereLight intensity={1.1} color="#f7f1df" groundColor="#071328" />
      <directionalLight position={[4, 7, 5]} intensity={4.8} color="#fff1c2" />
      <spotLight position={[-5, 6, 4]} angle={0.38} penumbra={0.82} intensity={74} color="#edbb00" />
      <spotLight position={[5, 4, 2]} angle={0.42} penumbra={0.9} intensity={58} color="#a50044" />
      <Sparkles count={38} scale={[11, 7, 8]} size={1.15} speed={0.16} color="#edbb00" opacity={0.28} />
      <ShotTrail />
      <BallJourney />
      <TrophyMoments />
      <Environment preset="city" environmentIntensity={0.5} />
    </>
  )
}

export function FootballScene() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.55], fov: 42 }}
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/al-rihla-ball.glb')
useGLTF.preload('/models/champions-league.glb')
useGLTF.preload('/models/world-cup-trophy.glb')
