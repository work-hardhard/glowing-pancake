import request from '../utils/request'

export default {
  login(data) {
    return request.post('/login', data)
  },
  //首页数据
  index() {
    return request.get('/Index/index')
  },
  //订单界面的图片  订单详情
  h5Companion() {
    return request.get('/h5/companion')
  },
  //订单提交接口
  creatOrder(data) {
    return request.post('/createOrder', data)
  },
  //请求订单列表的数据接口
  orderList(params) {
    return request.get('/order/list', { params })
  },
  //订单详情(进度条渲染位置) 以及不同订单状态显示的订单详情页面
  orderDetail(params) {
    return request.get('/order/detail', { params })
  }


}