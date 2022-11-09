import { createPinia } from 'pinia'
import { useAppStore } from './modules/app'

// https://github.com/prazdevs/pinia-plugin-persistedstate
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export { useAppStore }
export default store
