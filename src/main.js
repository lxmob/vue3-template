import App from './App.jsx'
import store from './store'
import { createApp } from 'vue'

const app = createApp(App)

app.use(store).mount('#app')
