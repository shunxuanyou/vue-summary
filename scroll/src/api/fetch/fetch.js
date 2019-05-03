import { baseUrl } from './env'//跨域的路径

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase();//将字符串转换成大写
  url = baseUrl + url;

  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }

  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include', //# 如果服务端不需要浏览器cookies 的话 ，可以不写， 一般用在登录过就不许要登录，自动登录
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: "cors",
      // mode: "no-cors", // 如果不使世界跨域通过的话， 设置为 no-cors 但是responnse 中是没有值得
      cache: "force-cache"
    }

    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig);
      const responseJson = await response.json();
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
