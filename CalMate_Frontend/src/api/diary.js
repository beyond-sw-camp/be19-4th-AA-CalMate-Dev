// src/api/diary.js
import api from '@/lib/api'

export const DIARY_MOOD_MAP = {
  great: '아주좋음',
  good: '좋음',
  okay: '보통',
  bad: '나쁨',
  terrible: '아주나쁨'
}

export const toDiaryServerMood = (moodKey) => {
  return DIARY_MOOD_MAP[moodKey] || moodKey || '보통'
}

export const toDiaryClientMood = (serverMood) => {
  const found = Object.entries(DIARY_MOOD_MAP).find(([, value]) => value === serverMood)
  return found ? found[0] : 'good'
}

const buildDiaryFormData = ({
  mood,
  weight,
  condition,
  memo,
  memberId,
  day,
  deleteFileIds,
  files
}) => {
  const formData = new FormData()

  const diaryJson = {
    ...(day ? { day } : {}),
    ...(memberId != null ? { memberId } : {}),
    ...(weight != null && weight !== '' ? { weight: parseInt(weight, 10) } : {}),
    ...(mood != null ? { mood: toDiaryServerMood(mood) } : {}),
    ...(condition != null && condition !== undefined && condition !== false ? { condition } : {}),
    ...(memo != null && memo !== undefined && memo !== false ? { memo } : {})
  }

  // deleteFileIds는 배열이면 항상 포함 (빈 배열이어도 OK)
  if (Array.isArray(deleteFileIds)) {
    diaryJson.deleteFileIds = deleteFileIds
  }

  formData.append('diary', new Blob([JSON.stringify(diaryJson)], { type: 'application/json' }))

  if (Array.isArray(files) && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  return formData
}

// POST /api/diaries (multipart)
export const createDiary = ({
  memberId,
  date,
  mood,
  weight,
  condition,
  memo,
  files = []
}) => {
  const formData = new FormData()
  const diaryJson = {
    day: date,
    memberId,
    weight: Number.isFinite(parseInt(weight, 10)) ? parseInt(weight, 10) : 0,
    mood: toDiaryServerMood(mood),
    condition: condition ?? '',
    memo: memo ?? ''
  }
  formData.append('diary', new Blob([JSON.stringify(diaryJson)], { type: 'application/json' }))
  if (Array.isArray(files) && files.length > 0) {
    files.forEach((file) => formData.append('files', file))
  }
  return api.post('/api/diaries', formData)
}

// GET /api/diaries/day?memberId=&day=
export const getDiaryByDate = ({ memberId, date }) => {
  return api.get('/api/diaries/day', {
    params: { memberId, day: date }
  })
}

// PATCH /api/diaries/{id} (multipart)
export const updateDiary = ({ id, mood, weight, condition, memo, files = [], deleteFileIds }) => {
  console.log('🔧 updateDiary 함수 호출:', { id, deleteFileIds, filesCount: files.length })

  const formData = buildDiaryFormData({
    mood,
    weight,
    condition,
    memo,
    files,
    deleteFileIds
  })

  // FormData 내용 확인
  const diaryBlob = formData.get('diary')
  if (diaryBlob) {
    diaryBlob.text().then(text => {
      console.log('📦 전송할 diary JSON:', JSON.parse(text))
    })
  }

  return api.patch(`/api/diaries/${id}`, formData)
}

// DELETE /api/diaries/{id}
export const deleteDiary = (id) => api.delete(`/api/diaries/${id}`)

// GET /api/diaries/{id}
export const getDiaryDetail = (id, memberId) => api.get(`/api/diaries/${id}`, { params: { memberId } })
``