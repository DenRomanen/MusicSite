const accessTokenStorageKey = 'music-room-access-token'

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(accessTokenStorageKey)
}

export const storeAccessToken = (accessToken: string) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(accessTokenStorageKey, accessToken)
}

export const removeStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(accessTokenStorageKey)
}
