const DEVICE_ID_KEY = 'deviceUserId'

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  
  return deviceId
}

export function getNotesStorageKey(): string {
  return `notes_${getDeviceId()}`
}

export function getZoomStorageKey(): string {
  return `zoom_${getDeviceId()}`
}
