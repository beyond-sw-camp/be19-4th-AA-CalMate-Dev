<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="phm-overlay" @click.self="close">
        <div class="phm-modal shadow-soft" role="dialog" aria-modal="true">
          <header class="phm-header">
            <h3>포인트 내역</h3>
            <button class="phm-close" @click="close" aria-label="닫기">✕</button>
          </header>

          <!-- 요약 2칸 : '최근 20건' 기준 적립 / 사용 합계 -->
          <div class="phm-summary">
            <div class="phm-chip">
              <p class="phm-chip-label">적립</p>
              <p class="phm-chip-value">
                {{ formatNumber(earnedTotalRecent) }}<span>P</span>
              </p>
            </div>
            <div class="phm-chip">
              <p class="phm-chip-label">사용</p>
              <p class="phm-chip-value">
                {{ formatNumber(usedTotalRecent) }}<span>P</span>
              </p>
            </div>
          </div>
          <p v-if="historyRangeLabel" class="phm-range">
            최근 {{ recent20.length }}건 · {{ historyRangeLabel }}
          </p>

          <!-- 최근 20건 리스트 -->
          <div class="phm-content">
            <template v-if="recent20.length === 0">
              <div class="phm-empty">
                <div class="phm-empty-icon">🕓</div>
                <p class="phm-empty-title">아직 포인트 내역이 없습니다!</p>
                <p class="phm-empty-desc">활동을 기록하고 포인트를 획득해보세요!</p>
              </div>
            </template>

            <template v-else>
              <ul class="phm-list">
                <li v-for="(h, idx) in recent20" :key="idx" class="phm-row">
                  <div class="phm-row-left">
                    <p class="phm-row-title">{{ h.title }}</p>
                    <p class="phm-row-sub">
                      {{ h.type === 'EARN' ? '적립 일시' : '차감 일시' }} · {{ getHistoryDateLabel(h) }}
                    </p>
                  </div>
                  <div :class="['phm-row-amt', h.type === 'EARN' ? 'is-earn' : 'is-use']">
                    {{ h.type === 'EARN' ? '+' : '-' }}{{ formatNumber(h.points) }}P
                  </div>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  /** [{ title, date:'YYYY-MM-DD HH:mm', points:number, type:'EARN'|'USE', occurredAt?: string }] */
  histories: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:open', 'close']);

function close() {
  emit('update:open', false);
  emit('close');
}

const recent20 = computed(() =>
  [...(props.histories || [])]
    .sort((a, b) => (getHistoryTimestamp(b) ?? 0) - (getHistoryTimestamp(a) ?? 0))
    .slice(0, 20)
);

const historyRangeLabel = computed(() => {
  const timestamps = recent20.value
    .map((history) => getHistoryTimestamp(history))
    .filter((value) => typeof value === 'number')
    .sort((a, b) => a - b);

  if (!timestamps.length) return '';
  const start = new Date(timestamps[0]);
  const end = new Date(timestamps[timestamps.length - 1]);

  if (start.toDateString() === end.toDateString()) {
    return `${formatDateLabel(end)} 기록`;
  }
  return `${formatDateLabel(start)} ~ ${formatDateLabel(end)}`;
});

// ✅ 상단 요약도 최근 20건만 합산
const earnedTotalRecent = computed(() =>
  recent20.value.reduce((sum, h) => (h.type === 'EARN' ? sum + (h.points || 0) : sum), 0)
);
const usedTotalRecent = computed(() =>
  recent20.value.reduce((sum, h) => (h.type === 'USE' ? sum + (h.points || 0) : sum), 0)
);

function formatNumber(v) {
  return Number(v || 0).toLocaleString();
}

function formatDateLabel(date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getHistoryTimestamp(history) {
  if (!history) return null;
  return toTimestamp(
    history.occurredAt ??
      history.historyTime ??
      history.history_time ??
      history.date ??
      history.dateLabel ??
      null,
  );
}

function getHistoryDateLabel(history) {
  if (!history) return '-';
  if (typeof history.dateLabel === 'string' && history.dateLabel.trim()) return history.dateLabel;
  if (typeof history.date === 'string' && history.date.trim()) return history.date;

  const timestamp = getHistoryTimestamp(history);
  if (timestamp == null) return '-';
  return formatDateTime(new Date(timestamp));
}

function toTimestamp(value) {
  if (value == null) return null;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : time;
  }
  if (typeof value === 'number') {
    return value > 1e12 ? value : value * 1000;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+$/.test(trimmed)) return toTimestamp(Number(trimmed));
    const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
    const parsed = Date.parse(normalized);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function formatDateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.phm-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); display:flex; align-items:center; justify-content:center; z-index: 60; padding: 1rem; }
.phm-modal { width: 100%; max-width: 560px; border-radius: 16px; background: #fff; border: 1px solid #e2e8f0; overflow: hidden; }
.phm-header { display:flex; align-items:center; justify-content:space-between; padding: 16px 18px; border-bottom: 1px solid #eef2f7; }
.phm-close { border: 0; background: transparent; font-size: 18px; color: #64748b; cursor: pointer; }

.phm-summary { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px; }
.phm-chip { background:#f8fafc; border:1px solid #edf0f7; border-radius: 14px; padding: 22px 14px; text-align:center; }
.phm-chip-label { color:#64748b; font-size:1rem; font-weight: 800; letter-spacing: .02em; }
.phm-chip-value { margin-top:10px; font-weight:800; font-size:2rem; color:#0f172a; }
.phm-chip-value span { margin-left:6px; font-size:1rem; color:#94a3b8; }
.phm-range { padding: 0 16px 8px; font-size: .85rem; color: #64748b; }

.phm-content { padding: 8px 16px 16px; max-height: 56vh; overflow:auto; }

.phm-empty { display:flex; flex-direction:column; align-items:center; gap:6px; padding: 36px 0; color:#94a3b8; }
.phm-empty-icon { font-size: 40px; }
.phm-empty-title { color:#475569; font-weight:700; }
.phm-empty-desc { font-size:.9rem; }

.phm-list { display:flex; flex-direction:column; gap: 8px; }
.phm-row { display:flex; align-items:center; justify-content:space-between; padding: 12px 10px; border:1px solid #eef2f7; border-radius: 12px; background:#fff; }
.phm-row-left { display:flex; flex-direction:column; }
.phm-row-title { font-weight:600; color:#0f172a; }
.phm-row-sub { font-size:.85rem; color:#94a3b8; }
.phm-row-amt { font-weight:800; }
.phm-row-amt.is-earn { color:#10b981; }
.phm-row-amt.is-use { color:#ef4444; }

.shadow-soft { box-shadow: 0 20px 50px rgba(15,23,42,.06); }
</style>
