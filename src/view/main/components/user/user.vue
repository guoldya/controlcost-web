<template>
  <div class="user-avator-dropdown">
    <span @click="unrevised" style="display: inline-block; width: auto; margin-left: 5px; text-align: center">
      <Badge  style="margin-right: 13px; margin-top: 10px"  :count="pendReviewCount" overflow-count="999" >
        <Icon  size="24" type="ios-notifications" />
      </Badge>
    </span>
    <Dropdown @on-click="handleClick">
        <Avatar :src="userAvator"/>
      <span style="display: inline-block; width: auto; margin-left: 5px; text-align: center">{{userName}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>

  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Cookies from 'js-cookie';
export default {
  name: 'User',
  data() {
    return{
      account: '',
      timeId: null,
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    },
  },
  computed:{
    userName(){
      return this.$store.state.app.userName;
    },
    pendReviewCount() {
      return this.$store.state.app.pendReviewCount;
    }
  },
  mounted(){
   this.timeId = setInterval(()=>{
      this.reviewCount();
    },50000);
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick(name) {
      this.$emit('log-out')

    },
    unrevised() {
      if (this.pendReviewCount == 0){
        return;
      }
      const auditState = 1;
      const route = {
        query: {
          auditState,
        },
        path: 'check-handle',
        name: 'check-handle',
        component: () => import('@/view/control-cost-mgt/check/check-handling.vue')
      };
      this.$router.push(route);
    },
    reviewCount() {
      if (localStorage.user == 'admin'){
        this.$store.state.app.pendReviewCount = 0;
        return;
      }
      this.$put('/sys/sysUser/selectUserByAccount', {account: localStorage.user}).then(res => {
        if (res.code == '200') {
          //获取菜单权限，并放入store
          //保存到store.app下的属性
          this.$store.state.app.pendReviewCount = res.data.pendReviewCount;
        }
        else {
          this.warn(res.msg);
        }
      }).catch(err => {
        this.error(err);
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timeId);
    this.timeId = null;
  }
}
</script>
