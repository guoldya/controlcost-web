// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import Cookies from 'js-cookie'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
import 'devextreme/integration/jquery';
import $ from 'jquery'
import viser from 'viser-vue'
window.$=$

/**********devextreme UI***************/
import 'devextreme/ui/data_grid';
import 'devextreme/ui/form';
import 'devextreme/ui/tree_list';
import 'devextreme/ui/text_area';
import 'devextreme/ui/drop_down_box';
import 'devextreme/ui/number_box';
import 'devextreme/ui/toolbar';
import 'devextreme/ui/validator';
import 'devextreme/ui/tag_box';

/**********devextreme Data***************/
import dataquery from 'devextreme/data/query';
import 'devextreme/data/errors';
import 'devextreme/data/local_store';
import 'devextreme/data/data_source';
import 'devextreme/data/array_query';
import 'devextreme/data/store_helper';
import 'devextreme/data/endpoint_selector';
import 'devextreme/data/utils';
import 'devextreme/data/query_adapters';
import customstore from 'devextreme/data/custom_store';
import ArrayStore from 'devextreme/data/array_store';

/**********devextreme Theme***************/
// import 'assets/devextreme/css/generic.light-compact.custom.css';
import '@/assets/devextreme/js/dx.messages.cn.js';


import '@/styles/common.less';

import Enum from '@/comm-data/enum.js';
import Searchpanel from '@/view/my-components/search-panel';
import CommDataSource from '@/comm-data/comm-datasource.js';
import msgHandler from '@/comm-msg/msg-handler.js';
import {post,put,del,patch,get } from '@/api/api';
import DateRange from '@/view/my-components/date-range';
import BadgeStatus from '@/view/my-components/badge-status';
import CommandBtns from '@/view/my-components/command-btns';
import OpCol from '@/view/my-components/opcol';
import diseasePoptip from '@/view/my-components/disease-poptip';
import Transfer from '@/view/my-components/transfer';
//import NoticeWindow from '@/view/my-components/notice-window';
import NoticeWindow from '@/view/my-components/Notice';
import filters from './filter/filter';
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// import '@/mock'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock');

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(viser)
//统一错误处理
Vue.use(msgHandler);
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.component('Searchpanel',Searchpanel);
Vue.component('DateRange',DateRange);
Vue.component('BadgeStatus',BadgeStatus);
Vue.component('CommandBtns',CommandBtns);
Vue.component('OpCol',OpCol);
Vue.component('diseasePoptip',diseasePoptip);
Vue.component('Transfer',Transfer);
Vue.prototype.$config = config;
//Restful API 定义
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$del = del;
Vue.prototype.$patch = patch;
Vue.prototype.$get = get;
Vue.prototype.$NoticeWindow = NoticeWindow;
//公用数据源
Vue.prototype.CommDs = CommDataSource;
//dx自定义数据源
Vue.prototype.customstore = customstore;
Vue.prototype.dataQuery = dataquery;
Vue.prototype.ArrayStore = ArrayStore;
//公用枚举源
Vue.prototype.enum = Enum;


/**
 * 注册指令
 */
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App),
  data: {
    userName:'',
    pendReviewCount: 0,
  },
  mounted() {
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
    if(localStorage.userOrgs){
      this.userName = '(' + Cookies.get('user') + ')'+'-'+JSON.parse(localStorage.userOrgs).post +'-'+ JSON.parse(localStorage.userOrgs).name ;
      this.pendReviewCount = JSON.parse(localStorage.userOrgs).pendReviewCount;
      this.$store.commit('setUserInfo', JSON.parse(localStorage.userOrgs).account);
    }else{
      this.userName = '超级管理员';
    }
    this.$store.commit('setUserName',this.userName);
    this.$store.commit('setPendReviewCount',this.pendReviewCount);

  },
});
