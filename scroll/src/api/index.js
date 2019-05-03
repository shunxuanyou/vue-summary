import ajax from './ajax'
import fetch from "./fetch/fetch";

// 1、根据经纬度获取位置详情
// /这个接口的经纬度参数是在url路径里的param参数
export const reqAddress=(geohash)=>ajax('/position/'+geohash)
// 2、获取食品分类列表
// 这个接口的经纬度参数是在url路径里?后面的query参数
export const reqCategorys=()=>ajax('/index_category')
// 3、根据经纬度获取商铺列表
export const reqShops=(latitude,longitude)=>ajax('/shops',{latitude,longitude})
// 4、根据经纬度和关键字搜索商铺列表
// 5、获取一次性验证码
// 6、用户名密码登陆
// 7、发送短信验证码
// 8、手机号验证码登陆
// 9、根据会话获取用户信息
// 10、用户登出


