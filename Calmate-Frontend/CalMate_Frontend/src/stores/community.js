import { defineStore } from "pinia"
import { fetchCommunityRanking } from "@/api/post"

export const useCommunityStore = defineStore("community", {
  state: () => ({
    ranking: [],        // 커뮤니티 랭킹 데이터
    refreshTrigger: 0,  // 좋아요 반영 트리거
  }),

  actions: {
    async loadRanking() {
      try {
        const { data } = await fetchCommunityRanking()
        this.ranking = data
      } catch (e) {
        console.error("랭킹 조회 오류:", e)
      }
    },

    triggerRefresh() {
      // 값 변경만으로 watch가 반응함
      this.refreshTrigger++
    }
  }
})
