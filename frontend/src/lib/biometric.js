import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth'

const LOCK_KEY = 'biometric_lock' // 'on' | 'off'

// Чи це застосунок (на вебі біометрії нема)
export function isNative() {
  return Capacitor.isNativePlatform()
}

// Чи підтримує пристрій біометрію (є сканер/обличчя і він налаштований)
export async function isBiometryAvailable() {
  if (!isNative()) return false
  try {
    const result = await BiometricAuth.checkBiometry()
    return !!result.isAvailable
  } catch {
    return false
  }
}

// Чи користувач увімкнув замок
export async function isLockEnabled() {
  if (!isNative()) return false
  try {
    const { value } = await Preferences.get({ key: LOCK_KEY })
    return value === 'on'
  } catch {
    return false
  }
}

// Увімкнути / вимкнути замок
export async function setLockEnabled(enabled) {
  await Preferences.set({ key: LOCK_KEY, value: enabled ? 'on' : 'off' })
}

// Запит біометрії. Повертає true якщо підтверджено, false якщо ні/скасовано.
export async function authenticate(reason = 'Підтвердіть особу, щоб відкрити Aperio') {
  if (!isNative()) return true
  try {
    await BiometricAuth.authenticate({
      reason,
      cancelTitle: 'Скасувати',
      allowDeviceCredential: true, // дозволити PIN/пароль як запасний варіант
      androidTitle: 'Aperio',
      androidSubtitle: 'Розблокування застосунку',
      androidConfirmationRequired: false,
    })
    return true
  } catch {
    return false
  }
}