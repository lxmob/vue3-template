import piniaStore from '@/store'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    title: 'pinia-vue3'
  }),
  actions: {
    updateTitle(title) {
      this.title = title
    }
  },
  persist: {
    key: 'app',
    storage: localStorage,
    paths: ['app']
  }
})

export function useAppOutsideStore() {
  return useAppStore(piniaStore)
}
