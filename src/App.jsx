import { Transition, KeepAlive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const App = defineComponent({
  name: 'App',
  setup() {
    return () => (
      <ElConfigProvider locale={zhCn}>
        <RouterView
          v-slots={{
            default: ({ Component }) => {
              return (
                <>
                  <Transition name="fade" mode="out-in">
                    <KeepAlive>{Component ? <Component /> : null}</KeepAlive>
                  </Transition>
                </>
              )
            }
          }}
        ></RouterView>
      </ElConfigProvider>
    )
  }
})

export default App
