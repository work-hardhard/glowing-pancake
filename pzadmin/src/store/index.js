import { defineStore } from 'pinia'


export const useStore = defineStore('asideScale', {
  state: () => ({
    isCollapse: false,
    selectMenu: [],
    routerList: [],
    menuActive: '1-1'
  }),
  persist: true,

  actions: {
    collapseMenu() {
      this.isCollapse = !this.isCollapse
    },
    addMenu(payload) {
      //对数据进行去重
      if (this.selectMenu.findIndex(item => item.path === payload.path) === -1) {
        this.selectMenu.push(payload)
      }

    },
    closeMenu(payload) {
      //找到点击数据的索引
      const index = this.selectMenu.findIndex(val => val.name === payload.name)
      //通过索引删除数组指定元素
      this.selectMenu.splice(index, 1)
    },


    // store/index.js 的 dynamicMenu 修正：
    dynamicMenu(payload) {
      const modules = import.meta.glob('../views/**/**/*.vue')
      console.log(modules)
      function routerSet(router) {
        router.forEach(route => {

          if (!route.children) {
            const url = `../views${route.meta.path}/index.vue`
            route.component = modules[url]
          } else {
            routerSet(route.children)
          }
        })
      }
      routerSet(payload)
      this.routerList = payload
    },

    updateMenuActive(payload) {
      console.log('更新的menuActive', payload)
      this.menuActive = payload
      // console.log(this.menuActive, 'active')

    }
  },

})

