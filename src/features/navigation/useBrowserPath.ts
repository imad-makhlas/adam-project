import { useCallback, useEffect, useState } from 'react'

export function useBrowserPath() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path)
    setPathname(window.location.pathname)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return { pathname, navigate }
}
