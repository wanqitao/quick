<template>
  <div class="tree-continer">
    <template v-if="isButton">
      <el-button type="text" icon="el-icon-plus" @click="toggleDialog" size="small">{{title}}</el-button>
    </template>
    <template v-else>
      <span @click="toggleDialog">
        <el-input :value="treeObject.name" :placeholder="placeholder" suffix-icon="el-icon-search" disabled></el-input>
      </span>
    </template>
    <el-dialog :title="isButton?'请'+title:title" :modal="modal" :visible.sync="officeDialog" class="tree-continer-dialog" width="30%" top="10vh" :before-close="handleClose">
      <el-input class="tree-continer-input" placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>

      <el-tree class="filter-tree" :data="treeData" :props="defaultProps" :highlight-current='true' :expand-on-click-node="false" check-on-click-node :show-checkbox="showCheckbox" :node-key="nodeKey" :default-checked-keys="checkedKeys" 
      :default-expanded-keys="expandedKeys" 
      :filter-node-method="filterNode" @current-change="getCurrentData" ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;">
          <span :class="[{'bg':(data.userStatus && data.userStatus == '1')?true:false}]" :title="node.label">{{ messageSubstring(node.label,36)}}
            <span>{{data.userStatus && data.userStatus == '1' ? '(离职)' : ''}}</span>
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <span v-if="isOfficeUser && dimissionPermission" style="color:#606266;float:left;">
          显示离职人员:&nbsp;&nbsp;<el-switch v-model="leaveShow" @change="showAction" active-text="" inactive-text=""> </el-switch>
        </span>
        <el-button type="primary" @click="submit()" size="mini">确 定</el-button>
        <el-button type="danger" @click="reset()" size="mini">重 置</el-button>
        <el-button type="warning" @click="cancel()" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * value 绑定的值
 * name 要显示的字符串
 * isButton 是否是button模式 默认为false
 * isFilter 是否需要过滤 默认为false
 * filterProperty 需要过滤的字符串
 * filterMessage 过滤后需要提示的信息
 * title 弹出框标题 默认为请选择
 * showCheckbox 是否为多选模式 默认为false
 * modal  是否显示背景阴影 默认为true
 * defaultProps 配置选项
 * treeData tree组件绑定值
 * placeholder input框placeholder
 * 用法实例 
 * 1. import tree from '@/components/tree/tree'
 * 2. <tree :treeData="treeData" v-model="deviceObject.sandIds" title="请选择砂场名称" :showCheckbox="true" :name="deviceObject.sandName" @getTreeCheckName="getTreeCheckName" :defaultProps="defaultProps"></tree>
 * 3. // 获取tree 选中节点node 向下分发node值
    getTreeCheckName(node) {
      this.deviceObject.sandName = node.name
    },
 */
import { messageSubstring } from '@/utils/utils'
export default {
  data() {
    return {
      tempData: [],
      allTempData: [],  // 所有人员
      offTempData: [], // 过滤离职人员
      expandedKeys: [], // 当前展开节点
      isFirst: 1,  // 只执行一次
      dimissionPermission: false, // 是否有离职按钮权限
      leaveShow: false,
      officeDialog: false,  // 弹出框状态
      filterText: '', // 输入过滤的字符串
      leaveText: '',  // 离职人员过滤
      treeObject: {      // 当前绑定对象
        name: '',
        id: '',
        node: '',
        nodes: []
      },
      treeObj: {}
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isOfficeUser: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '请选择'
    },
    modal: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    isButton: {
      type: Boolean,
      default: false
    },
    isFilter: {
      type: Boolean,
      default: false
    },
    filterProperty: {
      type: String,
      default: 'areaId'
    },
    filterMessage: {
      type: String,
      default: '只能选择用户'
    },
    defaultProps: {
      type: Object,
      default: function () {
        return {
          id: 'id',
          children: 'children',
          label: 'name'
        }
      }
    },
    treeData: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  created() {
    this.treeObject.name = this.name
    this.treeObject.id = this.value
    if (this.$refs.tree) this.$refs.tree.setCurrentKey(this.value)
    setTimeout(() => { // 防止父组件异步加载传递的数据无法在子组件created生命周期中获取到  //因为要存储最初的数据 而子组件本身又在不停的改变值，无法用updated 和watch， 暂时没有好的办法
      this.tempData = _.cloneDeep(this.treeData)
      if (this.treeData[0] == undefined) {
        this.expandedKeys = []
      } else {
        this.expandedKeys.push(this.treeData[0].id)
      }
    }, 1000)
    
    this.$store.dispatch('hasPermission', "sys:user:dimission").then(() => {
      this.dimissionPermission = this.$store.state.common.hasPermission
    })
  },
  updated() {  // 预防数据更新不及时
    if (this.$refs.tree && this.isOfficeUser && this.isFirst == 1) {
      this.leaveText = '离职'
      this.$refs.tree.filter('离职');
      this.isFirst = 2
    }
    this.treeObject.name = this.name
    this.treeObject.id = this.value
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    leaveText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    // 是否显示弹出框
    // officeDialog() {
    //   return this.$store.state.dialog.areaNameDialog
    // },
    checkedKeys() {
      if (this.value) return this.value.split(",")
      return []
    },
    nodeKey() {
      return this.defaultProps.id
    },
    label() {
      return this.defaultProps.label
    }
  },
  methods: {
    showAction(val) {  // 如果是机构用户树 递归判断是否显示离职人员
      //  this.$emit('showActionToFather', val)
      /* function showLeave(data) { // 递归函数
        for (let i = 0; i < data.length; i++) {
          if (data[i].userStatus && data[i].userStatus == '1') {
            data.splice(i, 1)
          } else {
            if (data[i].children) {
              showLeave(data[i].children)
            }
          }
        }
        return data
      }
      if (this.offTempData.length == 0) {
        this.offTempData = showLeave(this.treeData)
      }
      if (this.allTempData.length == 0) {
        this.allTempData = _.cloneDeep(this.tempData)
      }
      var tempArray = []
      if (val) {
        tempArray = this.allTempData
      } else {
        tempArray = this.offTempData
      }
      this.$emit('update:treeData', tempArray) // 将数据同步更新到父组件中 */
      if (val) {
        // tempArray = this.allTempData
        this.leaveText = '不离职'
      } else {
        // tempArray = this.offTempData
        this.leaveText = '离职'
      }
    },
    // 切换弹出框
    toggleDialog() {
      // this.$store.dispatch('toggleAreaName')
      this.officeDialog = !this.officeDialog
    },
    // 点击页面其他地方触发事件
    handleClose(done) {
      this.cancel()
    },
    // 确定
    submit() {
      var propertyId = this.nodeKey
      var propertyName = this.label
      if (this.showCheckbox) { // 复选
        var nodes = this.$refs.tree.getCheckedNodes()
        this.treeObject.id = this.arrayToString(nodes, propertyId)
        this.treeObject.name = this.arrayToString(nodes, propertyName)
        this.treeObject.nodes = nodes
        this.emitInput()
        this.toggleDialog()
      } else { // 单选
        var node = this.$refs.tree.getCurrentNode()
        if (node) {
          this.treeObject.id = node[propertyId]
          this.treeObject.name = node[propertyName]
          this.treeObject.node = node
          this.treeObj = node
        } else {
          this.treeObject.id = ''
          this.treeObject.name = ''
          this.treeObject.node = ''
          this.treeObj = {}
        }
        var filterProperty = this.filterProperty
        if (this.isFilter && node && node[filterProperty]) {  // 选择的是部门
          this.$message({
            message: this.filterMessage,
            showClose: true,
            type: 'warning',
            duration: 2 * 1000
          })
        } else {
          this.emitInput()
          this.toggleDialog()
        }
      }
    },
    // 重置
    reset() {
      if (this.showCheckbox) { // 复选
        this.$refs.tree.setCheckedKeys([])  // 清空选择元素
      } else { // 单选
        this.$refs.tree.setCurrentNode({})  // 清空选择元素
      }
      this.treeObject = {
        name: '',
        id: ''
      }
      this.treeObj = {
        name: '',
        id: ''      
      }
    },
    // 取消
    cancel() {
      // this.cancel()
      this.treeObject.id = this.value
      if (this.showCheckbox) { // 复选
        this.$refs.tree.setCheckedKeys(this.checkedKeys)  // 清空本次选择却未保存元素
      } else { // 单选
        if (!this.treeObject.id) {
          this.$refs.tree.setCurrentNode({})  // 清空选择元素
        }
        if (this.$refs.tree) this.$refs.tree.setCurrentKey(this.value)
      }
      this.toggleDialog()
    },
    // 过滤字符串
    filterNode(value, data) {
      // if (!value) return true;
      var propertyName = this.label
      value = this.leaveText
      if (value == '离职') {
        value = this.filterText
        return data.userStatus == '0' && data[propertyName].indexOf(value) !== -1;
      }
      value = this.filterText
      return data[propertyName].indexOf(value) !== -1;
    },
    // 当前行发生变化
    getCurrentData(data, node) {
      var propertyId = this.nodeKey
      this.treeObject.id = data[propertyId]
    },
    // 展开节点
    openExpand(data, node) {
      if (data.children) {
        this.expandedKeys.push(data.id)
      }
    },
    // 关闭节点
    closeExpand(data, node) {
      var len = this.expandedKeys.length
      for (let i = 0; i < len; i++) {
        if (data.id == this.expandedKeys[i]) {
          this.expandedKeys.splice(i, 1)
        }
      }
    },
    // 向下传递值
    emitInput() {
      this.$emit('input', this.treeObject.id)
      if (this.showCheckbox) {
        this.$emit('getTreeCheckName', this.treeObject.nodes)
      } else {
        this.$emit('getTreeCheckName', this.treeObject.node)
      }

    },
    messageSubstring
  }
}
</script>
<style lang="scss">
@import "../../styles/variables.scss";
.tree-continer-input .el-input__inner {
  border-color: #dcdfe6 !important;
}
.tree-continer-input .el-input__inner:focus {
  border-color: $--color-primary !important;
}
.tree-continer .el-checkbox__input {
  width: 18px !important;
}

.bg {
  color: red;
}
</style>


