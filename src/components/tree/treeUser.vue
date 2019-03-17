<template>
  <div class="tree-continer">
    <span @click="toggleDialog">
      <el-input :value="treeObject.name" :placeholder="placeholder" suffix-icon="el-icon-search" disabled></el-input>
    </span>
    <el-dialog :title="title" :modal="true" :visible.sync="officeDialog" class="tree-continer-dialog" width="30%" top="10vh" :before-close="handleClose">
      <el-input class="tree-continer-input" placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>

      <el-tree class="filter-tree" 
        :data="treeData" 
        :props="defaultProps" 
        :highlight-current='true' 
        :expand-on-click-node="false" 
        check-on-click-node
        :show-checkbox="showCheckbox"
        :node-key="nodeKey" 
        :default-checked-keys="checkedKeys"
        :default-expanded-keys="[this.treeData[0] === undefined ? '' : this.treeData[0].id]" 
        :filter-node-method="filterNode" 
        @current-change="getCurrentData" ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;">
          <span :title="node.label">{{ messageSubstring(node.label,36) }}</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
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
 * isObject 是否下发对象
 * title 弹出框标题 默认为请选择
 * showCheckbox 是否为多选模式 默认为false
 * defaultProps 配置选项
 * treeData tree组件绑定值
 * placeholder input框placeholder
 * 用法实例 
 * 1. import tree from '@/components/tree/tree'
 * 2. <tree :treeData="treeData" v-model="deviceObject.sandIds" title="请选择砂场名称" :showCheckbox="true" :name="deviceObject.sandName" @getTreeCheckUserName="getTreeCheckUserName" :defaultProps="defaultProps"></tree>
 * 3. // 获取tree 选中节点name 向下分发name值
    getTreeCheckUserName(name) {
      this.deviceObject.sandName = name
    },
 */
import { messageSubstring } from '@/utils/utils'
export default {
  data() {
    return {
      officeDialog: false,  // 弹出框状态
      filterText: '', // 输入过滤的字符串
      treeObject: {      // 当前绑定对象
        name: '',
        id: '',
        node: ''
      },
      treeObj:{}
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    isObject: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '请选择'
    },
    showCheckbox: {
      type: Boolean,
      default: false
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
      type:Array,
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
  },
  updated() {  // 预防数据更新不及时
    this.treeObject.name = this.name
    this.treeObject.id = this.value
  },
  watch: {
    filterText(val) {
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
         this.treeObj=nodes
        this.emitInput()
        this.toggleDialog()
      } else { // 单选
        var node = this.$refs.tree.getCurrentNode()
        if (node) {
          this.treeObject.id = node[propertyId]
          this.treeObject.name = node[propertyName]
          this.treeObject.node = node
          this.treeObj=node
        } else {
          this.treeObject.id = ''
          this.treeObject.name = ''
          this.treeObject.node = ''
           this.treeObj={}
        }
        if (node && node.areaId) {  // 选择的是部门
          this.$message({
            message: "只能选择用户",
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
      this.treeObj={
        name: '',
        id: ''}
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
      if (!value) return true;
      var propertyName = this.label
      return data[propertyName].indexOf(value) !== -1;
    },
    // 当前行发生变化
    getCurrentData(data, node) {
      var propertyId = this.nodeKey
      this.treeObject.id = data[propertyId]
    },
    // 向下传递值
    emitInput() {
      this.$emit('input', this.treeObject.id)
      if (this.isObject) {
        this.$emit('getTreeCheckUserName', this.treeObject.node)
        this.$emit('getTreeObject', this.treeObj)
      } else {
        this.$emit('getTreeCheckUserName', this.treeObject.name)
      }
      
    },
    messageSubstring
  }
}
</script>
<style lang="scss">
@import '../../styles/variables.scss';
.tree-continer-input .el-input__inner{
  border-color: #dcdfe6 !important;
}
.tree-continer-input .el-input__inner:focus{
  border-color: $--color-primary !important;
}
.tree-continer .el-checkbox__input {
  width: 18px !important;
}
</style>


