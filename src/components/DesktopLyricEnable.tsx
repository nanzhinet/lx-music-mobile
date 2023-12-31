import { forwardRef, useImperativeHandle, useRef } from 'react'

import ConfirmAlert, { type ConfirmAlertType } from '@/components/common/ConfirmAlert'

import { toast } from '@/utils/tools'

import { useI18n } from '@/lang'
import { checkDesktopLyricOverlayPermission, hideDesktopLyric, openDesktopLyricOverlayPermissionActivity, showDesktopLyric } from '@/core/desktopLyric'
import { updateSetting } from '@/core/common'

export interface DesktopLyricEnableType {
  setEnabled: (enabled: boolean) => void
}

export default forwardRef<DesktopLyricEnableType, {}>((props, ref) => {
  const t = useI18n()
  // const setIsShowDesktopLyric = useDispatch('common', 'setIsShowDesktopLyric')
  const confirmAlertRef = useRef<ConfirmAlertType>(null)

  useImperativeHandle(ref, () => ({
    setEnabled(enabled) {
      void handleChangeEnableDesktopLyric(enabled)
    },
  }))

  const handleChangeEnableDesktopLyric = async(isEnable: boolean) => {
    if (isEnable) {
      try {
        await checkDesktopLyricOverlayPermission()
        await showDesktopLyric()
      } catch (err) {
        console.log(err)
        confirmAlertRef.current?.setVisible(true)
        // return false
      }
    } else await hideDesktopLyric()
    // return true
    updateSetting({ 'desktopLyric.enable': isEnable })
  }

  const handleTipsCancel = () => {
    updateSetting({ 'desktopLyric.enable': false })
    toast(t('disagree_tip'), 'long')
  }
  const handleTipsConfirm = () => {
    confirmAlertRef.current?.setVisible(false)
    void openDesktopLyricOverlayPermissionActivity()
  }

  return (
    <ConfirmAlert
      ref={confirmAlertRef}
      onCancel={handleTipsCancel}
      onConfirm={handleTipsConfirm}
      bgHide={false}
      closeBtn={false}
      cancelText={t('disagree')}
      confirmText={t('agree_go')}
      text={t('setting_lyric_dektop_permission_tip')} />
  )
})
