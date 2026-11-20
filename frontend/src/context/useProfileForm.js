import { useContext } from 'react'
import { ProfileFormContext } from './formContextStore'

export function useProfileForm() {
  const context = useContext(ProfileFormContext)

  if (!context) {
    throw new Error('useProfileForm must be used inside ProfileFormProvider')
  }

  return context
}
