import React, {useLayoutEffect, useRef, useState} from 'react'
import {TouchableOpacity, View} from 'react-native'
import {SvgXml} from 'react-native-svg'
import Tooltip from 'react-native-walkthrough-tooltip'
import styled from 'styled-components/native'

import {Colors, Fonts} from '@/Theme'
import {moderateScale, verticalScale, widthPx} from '@/Theme/Responsive'

interface ListTimerItemProps {
  children: React.ReactNode
  image: string
  title: string
  tooltipText: string
}

export default ({children, tooltipText, image, title}: ListTimerItemProps) => {
  const [isToolTip, setIsToolTip] = useState(false)
  const ref = useRef<View>(null)
  const [offsetX, setOffsetX] = useState(0)

  useLayoutEffect(() => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setOffsetX(pageX + 10)
    })
  }, [])

  return (
    <RowViewParent ref={ref} collapsable={false}>
      <RowView>
        <Tooltip
          backgroundColor={Colors.transparent}
          isVisible={isToolTip}
          content={<ContentText>{tooltipText}</ContentText>}
          placement={'bottom'}
          displayInsets={
            {
              left: offsetX
            } as any
          }
          contentStyle={{
            backgroundColor: Colors.blackShade0F,
            width: widthPx(20)
          }}
          onClose={() => setIsToolTip(false)}
        >
          <TouchableOpacity onPress={() => setIsToolTip(true)}>
            <SvgXml width={verticalScale(18)} height={verticalScale(18)} xml={image} />
          </TouchableOpacity>
        </Tooltip>

        <LabelText>{title}</LabelText>
      </RowView>
      {children}
    </RowViewParent>
  )
}
const RowViewParent = styled.View<{
  ref: React.RefObject<View>
}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-width: 1px;
  border-color: ${Colors.borderColor};
`

const RowView = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
`
const LabelText = styled.Text`
  font-size: ${moderateScale(12.5)}px;
  font-family: ${Fonts.ThemeRegular};
  color: ${Colors.black};
`
const ContentText = styled.Text`
  font-size: ${moderateScale(12.5)}px;
  font-family: ${Fonts.ThemeRegular};
  color: ${Colors.white};
`
