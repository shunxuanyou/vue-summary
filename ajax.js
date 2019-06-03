import axios from 'axios'
import  {baseUrl} from './env'//跨域的路径
import { Indicator  } from 'mint-ui';
import router from '../router/index'
/**
 * 向外部暴露一个函数 ajax
 * @param {*} url 请求路径，默认为空
 * @param {*} data 请求参数，默认为空对象
 * @param {*} type 请求方法，默认为GET
 */
axios.create({
  timeout: 500, // 请求超时时间30秒
  withCredentials: true // 全局默认配置设置cookies
});
//  REQUEST 请求异常拦截
axios.interceptors.request.use(config=> {
  //==========  所有请求之前都要执行的操作  ==============

  Indicator.open({
    text: '加载中...',
    spinnerType: 'fading-circle'
  });
  return config;
}, err=> {
  //==================  错误处理  ====================
  console.log(({message: '请求超时!'}));;
  return Promise.resolve(err);
});

/* respone拦截器 ==> 对响应做处理 */
axios.interceptors.response.use(
  response => {
    if (response) {
      Indicator.close();
      return response
    } else {
      console.log(('数据错误，请重试...'));
    }
  }, error => {
    /* 判断error的status代码，并将对应的信息告知用户 */
    let text = ''
    let err = JSON.parse(JSON.stringify(error))
    if (err.response.status) {
      switch (error.response.status) {
        case 400:
          text = '请求错误(400)，请重新申请'
          break
        case 401:
          text = '登录错误(401)，请重新登录'
          return this.$router.replace('/Login')
        case 403:
          text = '拒绝访问(403)'
          break
        case 404:
          text = '请求出错(404)'
          break
        case 408:
          text = '请求超时(408)'
          break
        case 500:
          text = '服务器错误(500)，请重启软件或切换功能页！'
          break
        case 501:
          text = '服务未实现(501)'
          break
        case 502:
          text = '网络错误(502)'
          break
        case 503:
          text = '服务不可用(503)'
          break
        case 504:
          text = '网络超时(504)'
          break
        case 505:
          text = 'HTTP版本不受支持(505)'
          break
        default:
          text = '网络连接出错'
      }
    } else {
      text = '连接服务器失败,请退出重试!'
    }
    console.log((text));
    return Promise.reject(error)
  }
)


export default function ajax(url='',data={},type='GET') {
  // 返回Promise对象（异步返回的数据是response.data，而不是response）
  return new Promise(function (resolve,reject) {
    url = baseUrl + url;
    // （利用axios）异步执行ajax请求
    let promise;// 这个内部的promise用来保存axios的返回值(promise对象)
    if(type==='GET'){
      // 准备 url query 参数数据
      let dataStr=''// 数据拼接字符串，将data连接到url
      Object.keys(data).forEach(key=>{
        dataStr+=key+'='+data[key]+'&'
      })
      if(dataStr!==''){
        dataStr=dataStr.substring(0,dataStr.lastIndexOf('&'))
        url=url+'?'+dataStr
      }
    // 发送 get 请求
      promise= axios.get(url)
    }else {
      // 发送 post 请求
      promise= axios.post(url,data)
    }
    promise.then(response=>{
      // 成功回调resolve()
      resolve(response.data)
    })
      .catch(error=>{
        // 失败回调reject()
        reject(error)
      })
  })



}
