import {useEffect, useRef, useState} from 'react'

export default () => {
  const [now, setNow] = useState(new Date())
  const intervalId = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    intervalId.current = setInterval(() => setNow(new Date()), 1000)
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
    }
  }, [setNow])

  return now
}
