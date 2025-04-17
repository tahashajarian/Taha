// useCleanup.ts
import { useEffect } from 'react'
import { Object3D } from 'three'
import { disposeObject } from './dispose'

export function useCleanup<T extends { dispose?: () => void } | Object3D | null>(resource: T) {
  useEffect(() => {
    return () => {
      if (!resource) return

      if (resource instanceof Object3D) {
        disposeObject(resource)
      } else if (typeof resource.dispose === 'function') {
        resource.dispose()
      }
    }
  }, [resource]) // Cleanup when the resource changes
}
