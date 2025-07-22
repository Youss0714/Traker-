import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

export function useIsAndroid() {
  const [isAndroid, setIsAndroid] = React.useState(false)

  React.useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const androidCheck = userAgent.includes('android')
    setIsAndroid(androidCheck)
  }, [])

  return isAndroid
}

export function useMobileDevice() {
  const isMobile = useIsMobile()
  const isAndroid = useIsAndroid()
  
  return {
    isMobile,
    isAndroid,
    isMobileDevice: isMobile || isAndroid
  }
}
