import React from 'react'
import {View, PressableProps} from 'react-native'

import {useTheme, atoms as a} from '#/alf'
import {H4, P} from '#/components/Typography'
import {Button} from '#/components/Button'

import * as Dialog from '#/components/Dialog'

export {useDialogControl as usePromptControl} from '#/components/Dialog'

const Context = React.createContext<{
  titleId: string
  descriptionId: string
}>({
  titleId: '',
  descriptionId: '',
})

export function Outer({
  children,
  control,
}: React.PropsWithChildren<{
  control: Dialog.DialogOuterProps['control']
}>) {
  const titleId = React.useId()
  const descriptionId = React.useId()

  const context = React.useMemo(
    () => ({titleId, descriptionId}),
    [titleId, descriptionId],
  )

  return (
    <Dialog.Outer control={control}>
      <Context.Provider value={context}>
        <Dialog.Inner
          accessibilityLabelledBy={titleId}
          accessibilityDescribedBy={descriptionId}
          style={{width: 'auto', maxWidth: 400}}>
          <Dialog.Handle />
          {children}
        </Dialog.Inner>
      </Context.Provider>
    </Dialog.Outer>
  )
}

export function Title({children}: React.PropsWithChildren<{}>) {
  const t = useTheme()
  const {titleId} = React.useContext(Context)
  return (
    <H4
      nativeID={titleId}
      style={[a.font_bold, t.atoms.text_contrast_600, a.pb_sm]}>
      {children}
    </H4>
  )
}

export function Description({children}: React.PropsWithChildren<{}>) {
  const t = useTheme()
  const {descriptionId} = React.useContext(Context)
  return (
    <P nativeID={descriptionId} style={[t.atoms.text, a.pb_lg]}>
      {children}
    </P>
  )
}

export function Actions({children}: React.PropsWithChildren<{}>) {
  return (
    <View style={[a.w_full, a.flex_row, a.gap_sm, a.justify_end]}>
      {children}
    </View>
  )
}

export function Cancel({
  children,
}: React.PropsWithChildren<{onPress?: PressableProps['onPress']}>) {
  const {close} = Dialog.useDialogContext()
  return (
    <Button
      variant="solid"
      color="secondary"
      size="small"
      accessibilityLabel="Cancel"
      accessibilityHint="Cancel this action"
      onPress={close}>
      {children}
    </Button>
  )
}

export function Action({
  children,
  onPress,
}: React.PropsWithChildren<{onPress?: () => void}>) {
  const {close} = Dialog.useDialogContext()
  const handleOnPress = React.useCallback(() => {
    close()
    onPress?.()
  }, [close, onPress])
  return (
    <Button
      variant="solid"
      color="primary"
      size="small"
      accessibilityLabel="Confirm"
      accessibilityHint="Confirm this action"
      onPress={handleOnPress}>
      {children}
    </Button>
  )
}
