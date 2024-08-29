import {useEffect, useState} from 'react'
import {Dimensions, ScaledSize} from 'react-native'

export default (): ScaledSize => {
  const [dims, setDims] = useState(() => Dimensions.get('screen'))
  useEffect(() => {
    Dimensions.addEventListener('change', ({screen}) => setDims(screen))
    setDims(Dimensions.get('screen'))
  }, [])
  return dims
}
