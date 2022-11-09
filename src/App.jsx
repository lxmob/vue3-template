import { defineComponent } from 'vue'
import { useAppStore } from '@/store'

const App = defineComponent({
  name: 'App',
  setup() {
    const appStore = useAppStore()

    const hanldeClick = () => {
      appStore.updateTitle('appStore')
    }

    return () => (
      <div>
        <el-header>
          <el-button type="primary">按钮</el-button>
          <span onClick={hanldeClick}>{appStore.title}</span>
        </el-header>
      </div>
    )
  }
})

export default App
