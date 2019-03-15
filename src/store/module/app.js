import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import {saveErrorLogger} from '@/api/data'
import router from '@/router'
import routers from '@/router/routers'
import {post, put, del, patch, get} from '@/api/api';
import Cookies from 'js-cookie';
import Vue from 'vue';
import {
  Message
} from 'iview';

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
};

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: '',
    userName: "",
    roleType: null,
    rolePage: null,
    pendReviewCount: 0,
    autoRefresh: null,
    rightsMenus: [],
    userOrgs: [],
    menuList: [],
    routers: routers
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setUserName(state, userName) {
     if (userName == 'admin'){
       state.userName = '超级管理员';
     } else {
       state.userName = userName;
     }
    },
    //消息提醒次数
    setPendReviewCount(state, pendReviewCount) {
        state.pendReviewCount = pendReviewCount;
    },
    // 获取服务器权限菜单
    setUserModuleList(state) {
      let _this = this;
      // 获取权限
      put('/sys/sysModule/selectModuleListByUser').then(res => {
        if (res.code == '200') {
          // 获取菜单权限，并放入store
          // 保存到store.app下的Menus属性
          state.rightsMenus = res.rows;
          localStorage.rightsMenus = JSON.stringify(state.rightsMenus);
          _this.commit('updateMenulist');
        }
        else {
          Message.warn(res.data.msg);
        }
      }).catch(err => {
        Message.error(err.data.msg);
      });
    },
    updateMenulist(state) {
      if (localStorage.rightsMenus) {
        state.rightsMenus = JSON.parse(localStorage.rightsMenus);
      } else {
        // Message.warn('该账户尚未获得权限，请联系管理员');
        router.replace({
          path: 'login',
        });
      }
      let menuList = [];
      routers.forEach((router, idx) => {
        let item1 = router;
        var ret1 = state.rightsMenus.find((value, index, arr) => {
          return value.code == item1.name;
        });
        if (ret1) {
          let routerMenu = $.extend(true, {}, item1);
          routerMenu.children = [];
          routerMenu.icon = routerMenu.meta.icon;
          if (item1.children) {
            for (let ii in item1.children) {
              let item2 = item1.children[ii];
              var ret2 = state.rightsMenus.find((value, index, arr) => {
                return value.code == item2.name;
              });
              if (ret2) {
                let sonMenu = $.extend(true, {}, item2);
                sonMenu.children = [];
                sonMenu.icon = sonMenu.meta.icon;
                routerMenu.children.push(sonMenu);
                if (item2.children) {
                  for (let iii in item2.children) {
                    let item3 = item2.children[iii];
                    var ret3 = state.rightsMenus.find((value, index, arr) => {
                      return value.code == item3.name;
                    });
                    if (ret3) {
                      let sonMenu1 = $.extend(true, {}, item3);
                      sonMenu1.children = [];
                      sonMenu1.icon = sonMenu1.meta.icon;
                      sonMenu.children.push(sonMenu1);
                    }
                  }
                }
              }
            }
          }
          menuList.push(routerMenu);
        }
      });
      state.menuList = menuList;
    },

    // 获取当前用户的组织机构等信息
    setUserInfo(state, account) {
      put('/sys/sysUser/selectUserByAccount', {account: account}).then(res => {
        if (res.code == '200') {
          //获取菜单权限，并放入store
          //保存到store.app下的属性
          state.userOrgs = res.data;
          state.pendReviewCount = res.data.pendReviewCount;
          if(res.data.post){
            state.userName = res.data.post + '-' + res.data.name;
          }else {
            state.userName = res.data.name;
          }
          localStorage.userOrgs = JSON.stringify(state.userOrgs);

        }
        else {
          Message.warn(res.msg);
        }
      }).catch(err => {
        Message.error(err);
      });
    },

    setBreadCrumb(state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList(state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag(state, {route, type = 'unshift'}) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') state.tagNavList.push(route)
        else {
          if (route.name === localStorage.rolePage) state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      state.local = lang
    }
  },
}
