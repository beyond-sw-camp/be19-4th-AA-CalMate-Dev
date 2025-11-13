import api from '@/lib/api'

const buildFormData = ({ date, type, memberId, food, files, keepFileIds }) => {
  const formData = new FormData()

  const request = {
    date,
    type,
    memberId,
    food,
    // 부분 수정 안 하는 경우에는 null 로 보내기
    keepFileIds: Array.isArray(keepFileIds) ? keepFileIds : null
  }

  formData.append(
    'request',
    new Blob([JSON.stringify(request)], { type: 'application/json' })
  )

  if (Array.isArray(files) && files.length > 0) {
    files.forEach(file => {
      formData.append('files', file)
    })
  }

  return formData
}

export const createDiet = ({ date, type, memberId, food, files = [] }) => {
  const formData = buildFormData({
    date,
    type,
    memberId,
    food,
    files,
    keepFileIds: null
  })

  return api.post('/diet-management', formData)
}

export const getDietByType = ({ date, type, memberId }) => {
  return api.get('/diet-management/query', {
    params: { date, type, memberId }
  })
}

export const updateDiet = ({
  id,
  date,
  type,
  memberId,
  food,
  files,
  keepFileIds
}) => {
  const formData = buildFormData({
    date,
    type,
    memberId,
    food,
    files,
    keepFileIds
  })

  return api.put(`/diet-management/update/${id}`, formData)
}

export const deleteDiet = id => {
  return api.delete(`/diet-management/delete/${id}`)
}

export const searchFoods = (keyword = '') => {
  return api.get('/diet-management/foods/search', {
    params: { keyword }
  })
}
