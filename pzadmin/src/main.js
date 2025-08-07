import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useStore } from './store'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//全局使用
import PanelHead from './components/panelHead.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia = createPinia()
// const store = useStore(pinia)
pinia.use(piniaPluginPersistedstate)
//全局注入该组件
app.component('PanelHead', PanelHead)
// const store = useStore(pinia)




for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
const store = useStore()
const localData = localStorage.getItem('asideScale')
if (localData) {
  const routerList = JSON.parse(localData).routerList
  store.dynamicMenu(routerList)
  store.routerList.forEach(item => {
    router.addRoute('main', item)
  })
}

//路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  //非登录页面token还不存在
  if (!token && to.path !== '/login') {
    return '/login'
  }
  //token已经有（即已经登录过了），想要再去登录页面，就去到根目录
  else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
})

app.use(router)

app.mount('#app')



// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
// import router from './router'
// import { createPinia } from 'pinia'
// import { useStore } from './store' // 引入 useStore
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import PanelHead from './components/panelHead.vue'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// const app = createApp(App)
// const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)
// app.component('PanelHead', PanelHead)

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }

// app.use(pinia)

// // 动态路由挂载（确保 pinia 状态已恢复）
// const store = useStore()
// const localData = localStorage.getItem('asideScale')
// if (localData) {
//   const routerList = JSON.parse(localData).routerList
//   if (routerList && routerList.length > 0) {
//     store.dynamicMenu(routerList)
//     store.routerList.forEach(item => {
//       router.addRoute('main', item)
//     })
//   }
// }

// // 路由守卫
// router.beforeEach((to, from) => {
//   const token = localStorage.getItem('pz_token')
//   if (!token && to.path !== '/login') {
//     return '/login'
//   } else if (token && to.path === '/login') {
//     return '/'
//   } else {
//     return true
//   }
// })

// app.use(router)
// app.mount('#app')