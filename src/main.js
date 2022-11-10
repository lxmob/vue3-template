import App from './App.jsx'
import store from './store'
import router from './routes'
import { createApp } from 'vue'

const app = createApp(App)

app.use(store).use(router).mount('#app')
