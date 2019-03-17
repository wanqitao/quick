import Cookies from 'js-cookie'
import crypto from 'crypto'
const Username = 'ms_username' + '_' + process.env.BASE_API 
const realName_MS = 'ms_realName' + '_' + process.env.BASE_API 
const userId_MS = 'ms_userId' + '_' + process.env.BASE_API 
const officeId_MS = 'ms_officeId' + '_' + process.env.BASE_API 
const officeName_MS = 'ms_officeName' + '_' + process.env.BASE_API 
const duty_MS = 'ms_duty' + '_' + process.env.BASE_API 
const roleEname_MS = 'ms_roleEname' + '_' + process.env.BASE_API 
const TokenKey = 'Auth-Token' + '_' + process.env.BASE_API 
const Salt='SALT_WYJHGDGJ'  //加盐
const userType__MS='ms_userType' + '_' + process.env.BASE_API 
const SlideMenu = 'ms_slideMenu' + '_' + process.env.BASE_API 

export function setSlideMenu(slideMenu) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(SlideMenu, slideMenu,{ expires: exp})
}

export function getSlideMenu() {
  return Cookies.get(SlideMenu)
}

export function removeSlideMenu() {
  return Cookies.remove(SlideMenu)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
	/*var md5 = crypto.createHash("md5");
  md5.update(token+Salt);
  var token = md5.digest('hex');*/

	var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(TokenKey, token,{ expires: exp})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}



export function setUserType(userType) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(userType__MS, userType,{ expires: exp})
}

export function getUserType() {
  return Cookies.get(userType__MS)
}

export function removeUserType() {
  return Cookies.remove(userType__MS)
}


export function setUserName(username) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(Username, username,{ expires: exp})
}

export function getUserName() {
  return Cookies.get(Username)
}

export function removeUserName() {
  return Cookies.remove(Username)
}

export function getRealName() {
  return Cookies.get(realName_MS)
}

export function removeRealName() {
  return Cookies.remove(realName_MS)
}

export function setRealName(realName) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(realName_MS, realName,{ expires: exp})
}

export function setUserID(userId) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(userId_MS, userId,{ expires: exp})
}

export function getUserId() {
  return Cookies.get(userId_MS)
}

export function removeUserId() {
  return Cookies.remove(userId_MS)
}

export function setOfficeId(officeId) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(officeId_MS, officeId,{ expires: exp})
}

export function getOfficeId() {
  return Cookies.get(officeId_MS)
}

export function removeOfficeId() {
  return Cookies.remove(officeId_MS)
}

export function setOfficeName(officeName) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(officeName_MS, officeName,{ expires: exp})
}

export function getOfficeName() {
  return Cookies.get(officeName_MS)
}

export function removeOfficeName() {
  return Cookies.remove(officeName_MS)
}

export function setDuty(duty) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(duty_MS, duty,{ expires: exp})
}

export function getDuty() {
  return Cookies.get(duty_MS)
}

export function removeDuty() {
  return Cookies.remove(duty_MS)
}

export function setRoleEname(roleEname) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 30 * 1000);//过期时间 30分钟
  return Cookies.set(roleEname_MS, roleEname,{ expires: exp})
}

export function getRoleEname() {
  return Cookies.get(roleEname_MS)
}

export function removeRoleEname() {
  return Cookies.remove(roleEname_MS)
}
