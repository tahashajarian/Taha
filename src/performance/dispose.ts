// dispose.ts (improved snippets)
import { Mesh, Material, ShaderMaterial, Texture, Object3D } from 'three'

export function disposeObject(obj: Object3D | null) {
  if (!obj) return

  if (obj instanceof Mesh) {
    const { geometry, material } = obj
    if (geometry?.dispose) geometry.dispose()
    if (material) disposeMaterial(material)
  }

  obj.children.forEach(disposeObject) // Recursively dispose children
}

function disposeMaterial(mat: Material) {
  // Dispose known textures
  const textureKeys = ['map', 'normalMap' /* add others */]
  textureKeys.forEach((key) => {
    const tex = (mat as any)[key] as Texture
    if (tex?.dispose) tex.dispose()
  })

  // Handle ShaderMaterial uniforms
  if (mat instanceof ShaderMaterial && mat.uniforms) {
    Object.values(mat.uniforms).forEach((uniform) => {
      if (uniform?.value instanceof Texture) uniform.value.dispose()
    })
  }

  if (mat.dispose) mat.dispose()
}
