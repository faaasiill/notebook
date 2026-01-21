import { useEffect } from 'react'

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
    preventDefault?: boolean
  } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrl = false, meta = false, shift = false, preventDefault = true } = options

      const ctrlOrMeta = ctrl || meta
      const isCtrlOrMetaPressed = event.ctrlKey || event.metaKey

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        (!ctrlOrMeta || isCtrlOrMetaPressed) &&
        (!shift || event.shiftKey)
      ) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, options])
}
