import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Box3, Group, Vector3 } from 'three'

type Props = {
  url: string
  size?: number
  rotation?: [number, number, number]
  position?: [number, number, number]
}

export function NormalizedModel({ url, size = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: Props) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => {
    const clone = scene.clone(true)
    const box = new Box3().setFromObject(clone)
    const dimensions = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const max = Math.max(dimensions.x, dimensions.y, dimensions.z) || 1
    clone.position.sub(center)
    const wrapper = new Group()
    wrapper.add(clone)
    wrapper.scale.setScalar(size / max)
    return wrapper
  }, [scene, size])

  return <primitive object={model} rotation={rotation} position={position} />
}
