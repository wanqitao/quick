<template>
  <el-dialog
    title="选择现场管理人员"
    :modal="true"
    :visible.sync="sandPeoManDialog"
    width="30%"
    top="10vh"
    :before-close="handleClose">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      :highlight-current='true'
      :check-on-click-node='selectNode'
      node-key="id"
      :default-checked-keys="checkedKeys"
      default-expand-all
      show-checkbox
      :check-strictly='true'
      :filter-node-method="filterNode"
      @current-change="getCurrentArea"
      ref="tree2">
    </el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitArea()" size="mini">确 定</el-button>
    <el-button type="danger" @click="reset()" size="mini">重 置</el-button>
    <el-button type="warning" @click="toggleArea" size="mini">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        sandFormList:[],
        selectNode:true,
        filterText: '',
        area:{
          name:'',
          id:'',
        },
        defaultProps: {
          children: 'subs',
          label: 'name'
        },
        disIds:[],
        temp:[]
      }
    },
    props:{
      checkedKeys:{
        type:Array
      }
    },
    created () {
      var object = {
        extId : '',
        isAllGrade : true
      }
      this.$store.dispatch('are_getAreTree', object)
      this.$store.dispatch('GetAssignByEname', 'sandManager').then((data) => {
//          console.log(data)
          this.temp = data[0].data.userList

        })
      this.$store.dispatch('GetExistingManager').then( (data) => {
            this.disIds = data.data.managerIdList
        })
    },
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val);
      }
    },
    computed:{
      sandPeoManDialog () {
        return this.$store.state.dialog.sandPeoManDialog
      },
      treeData () {
        if(this.temp !== undefined){
          for(var i=0; i < this.temp.length; i++){    //循环所有已选指标
            var ids = this.disIds
            for(var k = 0; k < ids.length; k++){
              if(this.temp[i].id === ids[k]){   //如果两个相等
                this.$set(this.temp[i], 'disabled', true)
              }
            }
          }
          for(var i=0; i< this.temp.length; i++){  //循环当前已选指标
            var ids = this.checkedKeys
            for(var k = 0; k < ids.length; k++){
              if(this.temp[i].id === ids[k]){   //如果两个相等
                this.temp[i].disabled = false
              }
            }
          }
        }
        return this.$store.state.sandManager.eNameList
      }
    },
    methods: {
      handleClose (done) {
        this.$store.dispatch('sandPeoManDialog')
        var object = {
          extId : '',
          isAllGrade : true
        }
        this.$store.dispatch('are_getAreTree', object)
      },
      // 重置
      reset() {
        this.$refs.tree2.setCheckedKeys([])  // 清空选择元素
        this.$emit('selectArea', this.$refs.tree2.getCheckedNodes())
      },
      submitArea () {
        this.$emit('selectArea', this.$refs.tree2.getCheckedNodes())
        this.$store.dispatch('sandPeoManDialog')
      },
      toggleArea () {
        this.$store.dispatch('sandPeoManDialog')
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getCurrentArea(data, node){
        this.area = data
      }
    }
  }
</script>


