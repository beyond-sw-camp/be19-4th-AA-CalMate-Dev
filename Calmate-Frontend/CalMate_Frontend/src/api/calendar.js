// src/api/calendar.js
import api from '@/lib/api'

// 일별 단건 조회
export const getCalendarByDay = ({ memberId, day }) => {
  return api.get('/api/calendar/day', {
    params: { memberId, day }
  })
}

// 월 범위 조회 (1일 ~ 말일)
export const getCalendarByMonth = ({ memberId, year, month }) => {
  const mm = String(month).padStart(2, '0')
  const lastDay = new Date(year, month, 0).getDate()
  const startDate = `${year}-${mm}-01`
  const endDate = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`

  return api.get('/api/calendar', {
    params: { memberId, startDate, endDate }
  })
}

// 캘린더 행 생성
export const createCalendarEntry = ({
  calDay,
  memberId,
  exerciseStatus = 0,
  mealStatus = 0,
  diaryStatus = 0,
  badgeCount = 0
}) => {
  return api.post('/api/calendar', {
    calDay,
    memberId,
    exerciseStatus,
    mealStatus,
    diaryStatus,
    badgeCount
  })
}

// 상태 업데이트
export const updateCalendar = ({
  id,
  exerciseStatus,
  mealStatus,
  diaryStatus,
  badgeCount
}) => {
  const body = {
    exerciseStatus,
    mealStatus,
    diaryStatus,
    badgeCount
  }

  Object.keys(body).forEach((key) => {
    if (body[key] === undefined) {
      delete body[key]
    }
  })

  return api.patch(`/api/calendar/${id}`, body)
}

// 월간 뱃지 개수 조회
export const getMonthlyBadgeCount = ({ memberId, year, month }) => {
  return api.get('/api/calendar/badge-count/monthly', {
    params: { memberId, year, month }
  })
}
