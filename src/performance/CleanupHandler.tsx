import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { BufferGeometry, Material, Mesh, Texture, MeshStandardMaterial } from 'three'

const CleanUpHandler = () => {
  const { scene, gl } = useThree()

  useEffect(() => {
    return () => {
      console.log('performance => ', 'Starting comprehensive cleanup...')

      // CleanupObjects logic
      for (let i = scene.children.length - 1; i >= 0; i--) {
        const object = scene.children[i]
        if (!object.userData.persistent) {
          // Dispose geometry
          if ('geometry' in object && (object as any).geometry instanceof BufferGeometry) {
            ;(object as any).geometry.dispose()
          }

          // Dispose materials
          if ('material' in object) {
            const materials = Array.isArray((object as any).material)
              ? (object as any).material
              : [(object as any).material]

            materials.forEach((material) => {
              if (material instanceof Material) {
                // Dispose textures
                Object.values(material).forEach((value) => {
                  if (value instanceof Texture) value.dispose()
                })
                material.dispose()
              }
            })
          }

          scene.remove(object)
        }
      }

      // CleanupResources + CleanupTextures combined logic
      scene.traverse((object) => {
        // Mesh resources
        if (object instanceof Mesh) {
          if (object.geometry instanceof BufferGeometry) {
            object.geometry.dispose()
          }

          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material]

            materials.forEach((material) => {
              if (material instanceof MeshStandardMaterial) {
                ;['map', 'normalMap', 'roughnessMap'].forEach((mapType) => {
                  if (material[mapType] instanceof Texture) {
                    material[mapType].dispose()
                  }
                })
              }
              material.dispose()
            })
          }
        }

        // Additional texture cleanup
        if ('material' in object && object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]

          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof Texture) value.dispose()
            })
          })
        }
      })

      // Single WebGL cleanup call
      gl.renderLists.dispose()
      gl.info.reset()
      console.log('performance => ', 'Cleanup completed')
    }
  }, [scene, gl])

  return null
}

export default CleanUpHandler
