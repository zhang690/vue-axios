import axios from 'axios'
import qs from 'qs'
// 具体封装
// 1：根据环境变量进行接口区分
// process是一个全局变量，NODE_ENV 本来是不存在的，
//  通过设置这个环境变量，可以设置开发环境，用来设置 axios.defaults.baseURL 地址
//      #node中常用的到的环境变量是NODE_ENV，首先查看是否存在 
//       set NODE_ENV 
//      #如果不存在则添加环境变量 
//       set NODE_ENV=production || set NODE_ENV=development || set NODE_ENV=test
//      #环境变量追加值 set 变量名=%变量名%;变量内容 
//       set path=%path%;C:\web;C:\Tools 
//      #某些时候需要删除环境变量 
//       set NODE_ENV=
//  执行命令 yarn serve 时，默认的是 development 环境
//      可以在package.json文件中，配置启动命令，并配置环境变量
//      例如："serve:test": "set NODE_ENV=test&&vue-cli-service serve"
//      例如："serve:production": "set NODE_ENV=production&&vue-cli-service serve"
switch (process.env.NODE_ENV) {
  // 开发环境
  case 'development':
    axios.defaults.baseURL = 'http://192.168.1.198:9501'
    break;
    // 测试环境
  case 'test':
    axios.defaults.baseURL = 'http://196.128.20.15:8080' // 模拟的地址
    break;
    // 生产环境
  case 'production':
    axios.defaults.baseURL = 'http://api.zhengfeng.cn' // 模拟的地址
    break;

  default:
    break;
}
// 2 : 配置超时时间
axios.defaults.timeout = 5000
// 3 : 设置 CORS 跨域允许携带资源凭证
// axios.defaults.withCredentials = true
// 4 : 设置 POST 请求头，告知服务器请求主体的数据格式、
//  一般后台会要求这种格式，x-www-form-urlencoded （要求的其他格式另外处理）
axios.defaults.headers['content-type'] = 'application/x-www-form-urlencoded';
// 5 : 但是post请求传送的数据一般是json格式的对象，
//      通过以下方式转换成后台需要的x - www - form - urlencoded格式
//      这种 transformRequest 只对 post 请求有用
axios.defaults.transformRequest = data => qs.stringify(data)
// 6 : 设置请求拦截器
axios.interceptors.request.use(config => {
  // 添加 TOKEN 验证，可以从本地存储中取值，也可以从 VUEX 中取值，主要看怎么存储的
  // JWT 是 TOKEN 效验的一种经典算法，
  // TOKEN效验：第一次发送请求，服务器会返回一个token，接收到token，将他存储到
  //    vuex或本地存储中，每一次向服务器发送请求，都带上这个token

  // 从本地存储中取出token并带上发送请求
  const token = localStorage.getItem('token')
  // 先看token是否存在，存在则往下走， 
  token && (config.headers.Authorization = token)
  // 在拦截器中改完了，记得要返回这个请求的配置项。
  return config
}, error => {
  return Promise.reject(error)
})
// 7 : 自定义HTTP状态码范围，来判断响应是成功的还是失败的。
//      默认 以 2 开头的状态码是成功的。
//      一般不配置这个，因为接口很少出现以3开头的HTTP状态码
//      除非后台有这个状态码才来配置
axios.defaults.validateStatus = status => {
  // 自定义响应成功的HTTP状态码范围 true则成功响应，false则失败
  return /^(2|3)\d{2}$/.test(status)
}
// 8 : 设置响应拦截器
axios.interceptors.response.use(response => {
  // response 包含了太多的数据，而我们只是需要响应主体，即 data 数据，
  //  可配可不配
  return response.data
}, error => {
  // HTTP状态码如果没配置 axios.defaults.validateStatus 
  // 则除了以 2 开头的状态码之外，其他状态码都走到这里
  if (error.response) {
    switch (error.response.status) {
      // 常用状态码处理，其他要求的另写。
      case 401: // 当前请求需要用户验证，（一般是未登录，看后台）
        // 跳转到登录页面 等等处理
        break;
      case 403: // 服务器已经理解请求，但拒绝执行（一般是token过期，看后台）
        localStorage.removeItem('token') // 移除本地存储的 token
        // 下一步处理是 跳转到登录页面，以便重新获取 token
        break;
      case 404: // 请求失败，请求所希望得到的资源未被在服务器上发现
        // 相应处理
        break;
      default:
        break;
    }
    // 返回这个错误对象
    return Promise.reject(error.response)
  } else {
    // 到这里证明 服务器连结果都没有返回，
    //   第一种情况：服务器崩溃了
    //   第二种情况：客户端断网了
    // 断网处理
    if (!window.navigator.onLine) {
      // 断开网络了，可以让他跳到断网页面
      return;
    }
    return Promise.reject(error)
  }
})
// 全部配置完成之后，再将这个配置好的axios导出，以便外边使用
export default axios 