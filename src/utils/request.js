import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken,removeToken,setToken,getUserId,setUserID } from '@/utils/auth'
import { setOfficeId,getOfficeId,setOfficeName,getOfficeName,setDuty,getDuty,setRoleEname,getRoleEname,setRealName,getRealName,setUserType,getUserType } from '@/utils/auth'
import router from '@/router'
import { getUserName, setUserName } from './auth';


axios.defaults.withCredentials = true
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  /*transformRequest: [function (data) {
    data = Qs.stringify(data);
    // console.log(data)
    return data;
  }],*/

  // timeout: 5000 // request timeout
})

// http request 拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers.Authorization = store.getters.token // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers.UserId = getUserId()
  }
  // config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
  // config.headers.set('Access-Control-Allow-Origin','*')
  // console.log(config.headers)
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// http response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // console.log(res)
    if(res.status=="error"){
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject()
    }else if(res === '' || res === undefined){
      Message({
        message: '登录失效',
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('user_LogOut').then(() => {
        router.push({ path: '/' })
      }).catch(() => {
        console.log("退出失败")
      })
      // removeToken()
      return
    } else if (res.code === '403') {
      Message({
        message: '没有权限',
        type: 'error',
        duration: 3 * 1000
      })
      router.push({ path: '/403' })
    } else if (res.code === '999' || res.code === '998' ) {
      /* if(getToken()){
        return response;
      }else{ */
        Message({
          message: '登录失效,请重新登录',
          type: 'error',
          duration: 3 * 1000
        })
        store.dispatch('user_LogOut').then(() => {
          router.push({ path: '/' })
        }).catch(() => {
          console.log("退出失败")
        })
        return
      // }
      
    }else{
      var token = store.getters.token
      setToken(token)
      var userId = getUserId()
      setUserID(userId)
      var userName = getUserName()
      setUserName(userName)
      var officeId = getOfficeId()
      setOfficeId(officeId)
      var officeName = getOfficeName()
      setOfficeName(officeName)
      var duty = getDuty()
      setDuty(duty)
      var roleEname = getRoleEname()
      setRoleEname(roleEname)
      var realName = getRealName()
      setRealName(realName)
      var userType = getUserType()
      setUserType(userType)
    }
    return response;

  },
  error => {
    if (error.response) {
      console.log(error.response)
        switch (error.response.status) {
            case 401:
              /*removeToken()
              // 401 清除token信息并跳转到登录页面
              router.replace({
                  path: 'login',
                  query: {redirect: router.currentRoute.fullPath}
              })*/
              store.dispatch('user_LogOut').then(() => {
                router.push({ path: '/' })
              }).catch(() => {
                console.log("退出失败")
              })
              break
            case 403:
              // Message({
              //   message: '操作权限不足',
              //   type: 'error',
              //   showClose: true,
              //   duration: 5 * 1000
              // })
              //removeToken()
              router.push({
                path: '/403'
              })
              break
            case 500:
              // Message({
              //   message: '网络错误',
              //   type: 'error',
              //   showClose: true,
              //   duration: 5 * 1000
              // })
              router.push({
                path: '/500'
              })
              break
            case 504:
              // Message({
              //   message: '请求超时',
              //   type: 'error',
              //   showClose: true,
              //   duration: 5 * 1000
              // })
              router.push({
                path: '/504'
              })
              break
            default:
              Message({
                message: 'url链接错误',
                type: 'error',
                showClose: true,
                duration: 5 * 1000
              })
        }
    }
    
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response)
});

export default service