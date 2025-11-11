// src/api/exerciseRecords.js
import api from '@/lib/api'

export function fetchExerciseRecords({ memberId, date }) {
  return api.get('/exercise-records', { params: { memberId, date } })
}

export function createExerciseRecord({ memberId, date, type, category, minutes, kcal, files }) {
  const formData = new FormData()
  const requestBody = { date, type, category, min: minutes, burnedKcal: kcal, memberId }

  formData.append('request', new Blob([JSON.stringify(requestBody)], { type: 'application/json' }))
  if (files && files.length) files.forEach((file) => formData.append('files', file))

  return api.post('/exercise-records', formData)
}

export function updateExerciseRecord(recordId, { memberId, date, type, category, minutes, kcal, files, keepFileIds }) {
    const formData = new FormData()
    const requestBody = { 
      date, 
      type, 
      category, 
      min: minutes, 
      burnedKcal: kcal, 
      memberId,
      keepFileIds, 
    }
  
    formData.append(
      'request',
      new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
    )
  
    if (files && files.length) {
      files.forEach((file) => formData.append('files', file))
    }
  
    return api.put(`/exercise-records/update/${recordId}`, formData)
  }
  

export function deleteExerciseRecord(recordId) {
  return api.delete(`/exercise-records/delete/${recordId}`)
}
