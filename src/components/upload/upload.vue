<template>
	<div class="upload-container">
		<el-upload class="upload-demo" :action="action" :data="dataParmars" :disabled="disabled" :headers="uploadheaders" :before-upload="beforeAvatarUpload" :on-preview="handlePreview" :on-success="handleSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :multiple="multiple" :limit="limit" :file-list="fileList" :list-type="listType">
			<template v-if="listType==='picture-card'">
				<i class="el-icon-plus"></i>
			</template>
			<template v-else>
				<el-button class="upload-button" size="small" :disabled="disabled" :icon='icon' type="primary">{{title}}</el-button>
			</template>
		</el-upload>
		<el-button v-if="value" class="upload-button" size="small" icon='el-icon-download' @click='download_files(value)' style="left: 110px;position: absolute;top: 0;" type="warning">下载</el-button>
		<!-- 图片查看器 -->
		<viewer v-model="imgVisible" :src="imgurl">
		</viewer>
	</div>
</template>

<script>
import Viewer from '@/components/viewer'
/**
 * 图片上传组件
 * value 图片路径，图片路径可以是多个逗号分隔的字符串
 * limit 图片个数
 * multiple 图片是否多选
 * listType 图片类型有 text picture picture-card 三种 默认为text
 * previewImg 是否预览图片
 * fileType 文件类型有 rar img apk 三种 默认为 img
 * fileSize 文件大小 默认为100MB
 * icon icon小图标 默认为 el-icon-upload2
 * title 组件title 默认为 点击上传
 */
import { downloadFile } from '@/utils/utils'
import { getToken, getUserId } from '@/utils/auth'
export default {
	name: 'SingleImageUpload',
	props: {
		value: { // 图片路径，图片路径可以是多个逗号分隔的字符串
			type: String,
			default: ''
		},
		limit: {
			type: Number,
			default: 1
		},
		multiple: {
			type: Boolean,
			default: false
		},
		listType: {
			type: String,
			default: "text"
		},
		previewImg: {
			type: Boolean,
			default: true
		},
		fileType: {
			type: String,
			default: "img"
		},
		fileSize: {
			type: Number,
			default: 100
		},
		icon: {
			type: String,
			default: "el-icon-upload2"
		},
		title: {
			type: String,
			default: "点击上传"
		},
		disabled: {
			type: Boolean,
			default: false
		},
		isRename: {
			type: Boolean,
			default: true
		}
	},
	components: {
		Viewer
	},
	data() {
		return {
			action: process.env.BASE_API + '/sys/fileUpload', // 上传后台服务器地址
			dataParmars: { // 上传时附加参数
				isRename: this.isRename ? '0' : '1'
			},
			uploadheaders: {
				Authorization: getToken(),
				UserId: getUserId()
			},
			images: [],  // 图片数组
			imgurl: '',  // 图片路径
			imgVisible: false // 图片弹出框
		}
	},
	computed: {
		fileList() { // 图片数组
			var filePath = this.value
			var temp = []
			var fileList = []
			if (filePath) {
				temp = filePath.split(",")
			}
			for (var i = 0; i < temp.length; i++) {
				var index = temp[i].lastIndexOf("/") + 1
				var name = temp[i].substring(index, temp[i].length)
				var baseIndex = temp[i].indexOf(process.env.BASE_API)
				var url = ''
				if (baseIndex >= 0) {
					url = temp[i]
				} else {
					if (temp[i].indexOf('http') >= 0) {
						url = temp[i]
					} else {
						url = process.env.BASE_API + temp[i]
					}

				}
				fileList.push({
					name: name,
					url: url
				})
			}
			return fileList
		}
	},
	created() {
	},
	methods: {
		// 关闭图片弹出框
		closeImages() {
			this.imgVisible = false
			this.images.splice(0) // 清空数组
		},
		handlePreview(file) { // 图片预览
			var item = file.url
			var baseIndex = item.indexOf(process.env.BASE_API)
			if (baseIndex >= 0) {
				item = item.split(process.env.BASE_API)[1]
			}
			var type = item.substring(item.lastIndexOf('.') + 1).toLowerCase()
			item = encodeURIComponent(item)
			if (type == 'jpg' || type == 'png' || type == 'bmp' || type == 'gif' || type == 'jpeg') {
				this.imgVisible = true
				this.imgurl = process.env.BASE_API + '/sys/fileUpload/downloadFile?path=' + item
				this.images.push(this.imgurl)
			} else if (type == 'pdf') {
				var obj = {
					path: item
				}
				this.$store.dispatch('reimClaims_showPdf', obj).then((data) => {
					var url = "/static/pdfjs-2.0.943-dist/web/viewer.html?file=" + encodeURIComponent(data.data.path)
					window.open(url, '_blank')
				})
			} else {
				window.open(process.env.BASE_API + '/sys/fileUpload/downloadFile?path=' + item, '_blank')
			}
		},
		beforeAvatarUploadImg(file) { // 图片类型
			var isDh = file.name.indexOf(",")
			if (isDh >= 0) {
				this.$message({
					message: '文件名称不能包含‘,’符合',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			var imgIndex = file.name.lastIndexOf('.') + 1
			var imgType = file.name.substring(imgIndex, file.name.length)
			const extensionGif = imgType.toLocaleLowerCase() === 'gif'
			const extensionJPG = imgType.toLocaleLowerCase() === 'jpg'
			const extensionPNG = imgType.toLocaleLowerCase() === 'png'
			const extensionBMP = imgType.toLocaleLowerCase() === 'bmp'
			// 限制文件上传大小
			const isLt2M = file.size / 1024 / 1024 < this.fileSize
			if (!extensionGif && !extensionJPG && !extensionPNG && !extensionBMP) {
				this.$message({
					message: '上传图片只能是 gif、jpg、png、bmp等常用格式!',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			if (!isLt2M) {
				this.$message({
					message: `上传图片大小不能超过 ${this.fileSize} MB!`,
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
			}
			return (extensionGif || extensionJPG || extensionPNG || extensionBMP) && isLt2M
		},
		beforeAvatarUploadRar(file) { // rar类型
			var isDh = file.name.indexOf(",")
			if (isDh >= 0) {
				this.$message({
					message: '文件名称不能包含‘,’符合',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			var imgIndex = file.name.lastIndexOf('.') + 1
			var imgType = file.name.substring(imgIndex, file.name.length)
			const extensionRAR = imgType.toLocaleLowerCase() === 'rar'
			const extensionXLS = imgType.toLocaleLowerCase() === 'xls'
			const extensionCSV = imgType.toLocaleLowerCase() === 'csv'
			const extensionXLSX = imgType.toLocaleLowerCase() === 'xlsx'
			// 限制文件上传大小
			const isLt2M = file.size / 1024 / 1024 < this.fileSize
			if (!extensionRAR && !extensionXLS && !extensionCSV && !extensionXLSX) {
				this.$message({
					message: `上传附件只能是 rar、xls、csv、xlsx 等常用格式!`,
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			if (!isLt2M) {
				this.$message({
					message: `上传附件大小不能超过 ${this.fileSize} MB!`,
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
			}
			return (extensionRAR || extensionXLS || extensionCSV || extensionXLSX) && isLt2M
		},
		beforeAvatarUploadApk(file) { // apk类型
			var isDh = file.name.indexOf(",")
			if (isDh >= 0) {
				this.$message({
					message: '文件名称不能包含‘,’符合',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			var imgIndex = file.name.lastIndexOf('.') + 1
			var imgType = file.name.substring(imgIndex, file.name.length)
			const extensionApk = imgType.toLocaleLowerCase() === 'apk'
			// 限制文件上传大小
			const isLt2M = file.size / 1024 / 1024 < this.fileSize
			if (!extensionApk) {
				this.$message({
					message: '上传文件只能是 apk格式!',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			if (!isLt2M) {
				this.$message({
					message: `上传文件大小不能超过 ${this.fileSize} MB!`,
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
			}
			return (extensionApk) && isLt2M
		},
		beforeAvatarUploadFiles(file) { // files类型
			var isDh = file.name.indexOf(",")
			if (isDh >= 0) {
				this.$message({
					message: '文件名称不能包含‘,’符合',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			var imgIndex = file.name.lastIndexOf('.') + 1
			var imgType = file.name.substring(imgIndex, file.name.length)
			const extensionGif = imgType.toLocaleLowerCase() === 'gif'
			const extensionJPG = imgType.toLocaleLowerCase() === 'jpg'
			const extensionPNG = imgType.toLocaleLowerCase() === 'png'
			const extensionBMP = imgType.toLocaleLowerCase() === 'bmp'
			const extensionPDF = imgType.toLocaleLowerCase() === 'pdf'
			// 限制文件上传大小
			const isLt2M = file.size / 1024 / 1024 < this.fileSize
			if (!extensionGif && !extensionJPG && !extensionPNG && !extensionBMP && !extensionPDF) {
				this.$message({
					message: '上传图片只能是 gif、jpg、png、bmp、pdf等常用格式!',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			if (!isLt2M) {
				this.$message({
					message: `上传图片大小不能超过 ${this.fileSize} MB!`,
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
			}
			return (extensionGif || extensionJPG || extensionPNG || extensionBMP || extensionPDF) && isLt2M
		},
		beforeAvatarUploadAll(file) { // all类型
			var isDh = file.name.indexOf(",")
			if (isDh >= 0) {
				this.$message({
					message: '文件名称不能包含‘,’符合',
					showClose: true,
					type: 'warning',
					duration: 3 * 1000
				})
				return false
			}
			return true
		},
		beforeAvatarUpload(file) { // 上传之前的判断
			if (this.fileType === 'img') {
				return this.beforeAvatarUploadImg(file)
			} else if (this.fileType === 'rar') {
				return this.beforeAvatarUploadRar(file)
			} else if (this.fileType === 'apk') {
				return this.beforeAvatarUploadApk(file)
			} else if (this.fileType === 'files') {
				return this.beforeAvatarUploadFiles(file)
			} else if (this.fileType === 'all') {
				return this.beforeAvatarUploadAll(file)
			}
		},
		handleSuccess(response, file, fileList) { // 上传按钮的方法
			if (response.code != '200') {
				this.$message({
					message: response.message,
					type: 'error',
					showClose: true
				});
				return
			}
			var path = ''
			if (this.value) {
				path = this.value + "," + response.data.path
			} else {
				path = response.data.path
			}
			this.emitInput(path)
		},
		handleRemove(file, fileList) { // 移除的方法

			var path = this.arrayToString(fileList, "url")
			this.emitInput(path)
		},
		handleExceed(files, fileList) { // 超过大小限制额方法
			this.$message.warning(`只能上传 ${this.limit} 个文件`);
		},
		emitInput(val) { // 向下传递路径
			this.$emit('input', val)
		},
		download_files(path) {
			if (path == '') { // 判断是否存在附件
				this.$message({
					message: '没有附件可以下载',
					type: 'warning'
				});
				return
			} else {
				var paths = path.split(",")
				if (paths.length > 0) {
					for (var i = 0; i < paths.length; i++) {
						paths[i] = encodeURIComponent(paths[i])
						var url = process.env.BASE_API + '/sys/fileUpload/downloadFile?path=' + paths[i]
						downloadFile(url)
					}
				} else {
					path = encodeURIComponent(path)
					window.open(process.env.BASE_API + '/sys/fileUpload/downloadFile?path=' + path, '_self')
				}

			}
		}
	}
}
</script>
<style>
.upload-container {
  width: 100%;
  position: relative;
}
.upload-container .el-upload {
  width: 30% !important;
}
.upload-container .el-upload .upload-button {
  position: absolute;
  left: 0;
  top: 0;
}
.upload-container .el-dialog .el-dialog__body {
  height: 65vh;
}
</style>
