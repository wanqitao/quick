<template>
  <el-dialog
  title="分配角色"
  :modal="false"
  :visible.sync="roleDialog"
  width="30%"
  top="10vh"
  :before-close="handleClose">
<el-tree
  class="filter-tree"
  :data="treeData"
  :props="defaultProps"
  :highlight-current='true'
  :default-checked-keys="[5]"
  :filter-node-method="filterNode"
  @node-click="getUserList"
  @current-change="getCurrentOffice"
  ref="tree2">
</el-tree>
<div class="dxUser" style="margin: 10px 0;">
  <span>待选人员:</span><br/>
  <template v-for="(item, index) in officeUserList">
    <span @click="fpUser(item)" :key="index">{{item.userName}}</span><br :key="index" />
  </template>

</div>
<div class="yxUser" style="margin: 10px 0;">
  <span>已选人员:</span><br/>
  <template v-for="(item, index) in userList">
    <span style="color:red;" :key="index">{{item.name}}</span><br :key="index" />
  </template>
  <template v-for="(item, index) in adduserList">
    <span :key="index">{{item.name}}</span><br :key="index" />
  </template>

</div>
  <span slot="footer" class="dialog-footer">
    <span style="float: left;font-size: 12px;">通过选择部门，然后为列出的人员分配角色。</span>
    <el-button type="primary" @click="submit()" size="mini" style="margin-bottom: 10px">确认分配</el-button>
    <el-button type="danger" @click="clear" size="mini">清除已选</el-button>
    <el-button type="warning" @click="toggleRole" size="mini">关 闭</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  data() {
    return {
      filterText: '',
      officeUserList:[],
      adduserList:[],
      office:{
        title:'',
        id:'',
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  props:{
    userList:{
      type:Array
    }
  },
  created () {
    var office={
      type:'',
      extId:''
    }
    this.$store.dispatch('office_getOfficeTree',office)
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  computed:{
    roleDialog(){
      return this.$store.state.dialog.roleDialog
    },
    treeData(){
      // console.log(this.$store.state.menu.menuTree)
      return this.$store.state.office.officeTree
    }
  },
  methods: {
    handleClose(done) {
      this.$store.dispatch('toggleRole')
    },
    submit(){
      var userIds = []
      for(var i=0; i<this.adduserList.length;i++){
        // console.log(this.adduserList[i].id)
        userIds.push(this.adduserList[i].id)
      }
      var objcet = {
        userIds:userIds,
        roleId:this.$route.query.id
      }
      // console.log(objcet)
      this.$confirm('您确定要分配已选人员吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('role_assignRole',objcet)
        .then(() => {
          // var node = getCurrentNode();
          // console.log(this.office)
          this.$emit('assignRoleUser', '100')
          // this.$route.go(0)
          this.$store.dispatch('toggleRole')
        })
      }).catch(() => {
      });
      
    },
    clear(){
      this.$confirm('您确定要清除已选人员吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.adduserList.splice(0)
      }).catch(() => {
      });
      
    },
    toggleRole(){
      this.$store.dispatch('toggleRole')
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    getCurrentOffice(data,node){
      this.office = data
    },
    getUserList(data,node){
      // console.log(node.childNodes.length)
      if(node.childNodes.length === 0){
        var id = data.id
        this.$store.dispatch('role_getUserByOffice',id)
        .then(() => {
          this.officeUserList = this.$store.state.role.officeUserList
        })
      }
    },
    //分配用户
    fpUser(item){
      for(var i=0; i<this.adduserList.length;i++){
        if(this.adduserList[i].id === item.userId){
          return
        }
      }
      this.adduserList.push({
        id:item.userId,
        name:item.userName,
        flag:false
      })
    }
  }
}
</script>

<style type="text/css">
  .yxUser,.dxUser{
    cursor: pointer;
  }
</style>

