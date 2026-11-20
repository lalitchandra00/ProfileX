import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE_URL } from '../lib/config'
import { ProfileFormContext } from './formContextStore'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  email: '',
  phone1: '',
  phone2: '',
  collegeName: '',
  year: '',
  branch: '',
  bloodGroup: '',
  maritalStatus: '',
  work: '',
  correspondenceAddress: '',
  permanentAddress: '',
}

export function ProfileFormProvider({ children }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const resumeInputRef = useRef(null)

  const reloadProfile = useCallback(async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setForm(EMPTY_FORM)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile?userId=${encodeURIComponent(userId)}`)
      const data = await response.json()

      if (response.ok && data.success && data.data) {
        const next = { ...EMPTY_FORM }

        for (const key of Object.keys(EMPTY_FORM)) {
          if (data.data[key] !== undefined && data.data[key] !== null) {
            next[key] = key === 'dob' ? String(data.data[key]).slice(0, 10) : data.data[key]
          }
        }

        setForm(next)
        setPdfUrl(data.data.resumePdfUrl || '')
      }
    } catch (error) {
      console.error('Could not load profile', error)
    }
  }, [])

  useEffect(() => {
    reloadProfile()
  }, [reloadProfile])

  const setField = useCallback((name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }))
  }, [])

  const setFields = useCallback((fields) => {
    setForm((previous) => ({ ...previous, ...fields }))
  }, [])

  const saveProfile = useCallback(async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      return { success: false, message: 'Not logged in. Please login first.' }
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/home`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...form }),
      })
      return await response.json()
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      setLoading(false)
    }
  }, [form])

  const uploadResume = useCallback(async (file) => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      return { success: false, message: 'Not logged in.' }
    }
    if (!file) {
      return { success: false, message: 'Please select a PDF file first.' }
    }

    const formData = new FormData()
    formData.append('resumePdf', file)
    formData.append('userId', userId)
    setPdfUploading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-pdf`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setPdfUrl(data.pdfUrl)
      }

      return data
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      setPdfUploading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      form,
      loading,
      pdfUploading,
      pdfUrl,
      resumeInputRef,
      setField,
      setFields,
      saveProfile,
      uploadResume,
      reloadProfile,
    }),
    [form, loading, pdfUploading, pdfUrl, setField, setFields, saveProfile, uploadResume, reloadProfile],
  )

  return <ProfileFormContext.Provider value={value}>{children}</ProfileFormContext.Provider>
}
