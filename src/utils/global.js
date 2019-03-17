import $ from 'jquery'
import { getToken } from '@/utils/auth'
import { isEmpty } from '@/utils/utils'

const baseURL = process.env.BASE_API


function install(Vue, options) {
	/**
	 * [substring 截取字符串]
	 * @param  {[type]} message [要截取的字符串]
	 * @param  {[type]} len     [要截取的长度]
	 * @return {[type]}         [截取之后的字符串]
	 * @author [wanqitao]
	 */
	Vue.prototype.substring = function (message, len) {
		if (!isEmpty(message)) {
			if (typeof (message) !== 'string') {
				message = message.toString()
			}
			len = len || message.length
			if (message.length > len) return  `${message.substring(0, len)}...` 
			return message
		} else {
			return '——'
		}
	};
	/**
	 * [reverseMessage 字符串翻转]
	 * @param  {[type]} message [要翻转的字符串]
	 * @return {[type]}         [翻转后的字符串]
	 * @author [wanqitao]
	 */
	Vue.prototype.reverseMessage = function (message) {
		return message.split('').reverse().join('')
	};
	/**
	 * [subLastIndexOf 截取之后的字符串，如：返回文件名]
	 * @param  {[type]} message   [要截取的字符串]
	 * @param  {[type]} separator [指当截取的字符串 如： / ]
	 * @return {[type]}           [截取之后的字符串]
	 * @author [wanqitao]
	 */
	Vue.prototype.subLastIndexOf = function (message, separator) {
		var index = message.lastIndexOf(separator) + 1
		var length = message.length
		return message.substring(index, length)
	}
	/**
	 * [stringreplace 替换之后的字符串]
	 * @param  {[type]} message  [需要被替换字符串]
	 * @param  {[type]} pattern [被替换的字符串符号：如/]
	 * @param  {[type]} patterned [要替换的字符串符号：如\\]
	 * @return {[type]}          [替换之后的字符串]
	 * @author [wanqitao]
	 */
	Vue.prototype.stringreplace = function (message, pattern, patterned) {
		var reg = new RegExp(pattern, "gm")
		return message.replace(reg, patterned)
	}
	/**
	 * [arrayToString 数组转换成字符串 只支持转换一个属性,多个属性请多次调用]
	 * @param  {[array]}  array [数组]
	 * * @param  {[protoName]}  protoName [属性名]
	 * @return {ids}         [转换后的字符串]
	 * @author [wanqitao]
	 */
	Vue.prototype.arrayToString = function (array, protoName) {
		var ids = []
		for (var i = 0; i < array.length; i++) {
			ids.push(array[i][protoName])
		}
		ids = _.join(ids, ",")
		return ids
	}

	/**
 * 判断空值
 * @param {*} key 
 * return boolean
 */
	Vue.prototype.isEmpty = (key) => {
		if (typeof (key) === 'string') {
			return key.toLocaleLowerCase() === 'undefined' || key.toLocaleLowerCase() === 'null'
		} else if (typeof (key) === 'number') {
			return !~key
		}
		return _.isEmpty(key)
	}
	/**
	 * [判断table表格的字段是否为空 并返回相应值]
	 * @param  {[value]}  value 值
	 * @param  {[single]}  single 如果有值为空输出的内容
	 * @param {match}   match    匹配的参数，只有数组和对象
	 * @param {key}   key    匹配参数的key值
	 * @param {label}   label    匹配参数的label值
	 * @return 
	 * @author [jtao]
	 */
	Vue.prototype.tableDisplay = function (value, single, match, key, label) {
		label = label || 'label'
		key = key || 'value'
		single = single || '——'
		if (!isEmpty(value)) { // value 有值
			if (!isEmpty(match)) { // 如果是存在这个匹配参数
				if (_.isArray(match)) {  // 如果是数组
					for (let i = 0; i < match.length; i++) {
						if (value == match[i][key]) {
							return match[i][label]
						} else {
							return single
						}
					}
				} else { // 如果是对象
				}
			} else { // 不存在匹配参数
				return value
			}
		} else {  // value 值为空
			return single
		}
	}

}

export default install;