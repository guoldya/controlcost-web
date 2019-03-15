<style lang="less">
  @import "../../../styles/common.less";
  .ivu-card-body{
    margin:0px !important;
  }
  #dept-bottom .ivu-card-body{
    padding: 0px;
  }
</style>

<template>
  <Card dis-hover>
    <!--<Row class="margin-top-10">-->
      <!--<Searchpanel  ref="searchPanel">-->
        <!--<div slot="form" class="margin-bottom-3" id="searchForm">-->
        <!--</div>-->
        <!--<div slot="control">-->
          <!--<Button size="small" type="primary" @click="search">查询</Button>-->
          <!--<Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>-->
        <!--</div>-->
      <!--</Searchpanel>-->
    <!--</Row>-->
    <Row class="margin-top-10">
      <div id="window-dept"></div>
    </Row>
    <div id="dept-bottom">
      <Row class="margin-top-10" >
        <Col span="12">
          <Card dis-hover class="margin-right-10">
            <p slot="title">
              科室对应病区
            </p>
            <div id="window-dept-ward"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card dis-hover>
            <p slot="title">
              科室对应诊室
            </p>
            <div id="window-dept-room"></div>
          </Card>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
  import Vue from 'vue';

  let window_dept_url = 'sys/bdDept/selectList';
  let window_dept_ward_url = 'sys/bdDept/selectByWard';
  let window_dept_room_url= 'sys/bdDept/selectByRoom';
  let status_url='sys/bdDept/updateByStatus';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
    export default {
       data(){
         return {
           isLoadData: true,
           // searchForm: {},
           // searchFormData: {},
           dname:null,
           windowDeptData: new this.customstore({
             key: 'id',
             load: (loadOptions) => {
               return this.CommDs.loadList(window_dept_url,loadOptions.searchData);
             },
           }),
           windowDeptWardData: new this.customstore({
             load: (loadOptions) => {
               return this.CommDs.loadList(window_dept_ward_url,loadOptions.searchData);
             },
           }),
           windowDeptRoomData: new this.customstore({
             load: (loadOptions) => {
               return this.CommDs.loadList(window_dept_room_url,loadOptions.searchData);
             },
           }),
           userData: new this.customstore({
             key: "id",
             byKey: (key) => {
               return this.CommDs.loadByKey(sys_user_select_url, {id: key});
             },
             load: (e) =>{
               return this.CommDs.loadList(sys_user_select_url);
             }
           }),
           dbListData: new this.customstore({
             key: "ocode",
             byKey: (key) => {
               return this.CommDs.loadByKey(sys_bdOrg_map_url, { ocode: key,status:1});
             },
             load: (e) => {
               return this.CommDs.loadList(sys_bdOrg_list_url,{status:1});
             }
           }),
         }
       },
       mounted(){
        let _this=this;
        //4表单初始化
        // this.searchForm=$("#searchForm").dxForm({
        //   colCount: 4,
        //   formData: this.searchFormData,
        //   items: [
        //     {
        //       dataField: 'dname',
        //       label: {
        //         alignment: 'right',
        //         text: '名称'
        //       },
        //     },
        //   ]
        // }).dxForm('instance');
        //科室表
        this.windowDept = $('#window-dept').dxTreeList({
          keyExpr:"id",
          autoExpandAll: true,
          columnAutoWidth: true,
          scrolling: {
            mode: "standard"
          },
          showRowLines: true,
          showBorders: true,
          //wordWrapEnabled: true,
          parentIdExpr: "pdcode",
          columnFixing: {
           enabled: true
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            //paging: true
          },
          paging: {
            enabled: true,
            pageSize: 10
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText: '共{1}页/{2}数据',
          },
          selection: {
            mode: 'single'
          },
          hoverStateEnabled: true,
          onSelectionChanged:(e)=>{
            var ds = this.windowDeptWard.getDataSource();
            ds.loadOptions().searchData = {
              did:e.selectedRowsData[0].id,
              ocode:e.selectedRowsData[0].ocode,
            };
            _this.dname = e.selectedRowsData[0].dname;
            ds.reload();
            var ds1 = this.windowDeptRoom.getDataSource();
            ds1.loadOptions().searchData = {
              did:e.selectedRowsData[0].id,
              ocode:e.selectedRowsData[0].ocode,
            };
            ds1.reload();
          },
          searchPanel: {
            visible: true,
            placeholder: '查找',
            width: '275',
          },
          onOptionChanged:function(e){
            if(e.name == "searchPanel"){
              if(typeof (e.value) == 'string'){
                _this.search();
              }
            }
          },
          dataSource: this.windowDeptData,
          columns: [
                {
                  caption: '编码',
                  dataField: 'id',
                  alignment:"center",
                  width:80,
                },
                {
                  caption: '名称',
                  dataField: 'dname',
                  alignment:"left",
                  width:160,
                },
                {
                  dataField: 'ocode',
                  caption: '医疗机构名称',
                  alignment: 'left',
                  lookup: {
                    dataSource: this.dbListData,
                    displayExpr: 'oname',
                    valueExpr: 'ocode',
                  },
                  minWidth: 130,
                },
                {
                  caption: '科室类型',
                  dataField: 'dtype',
                  alignment:"center",
                  lookup: {
                    dataSource: this.enum.deptDtype,
                    displayExpr: 'text',
                    valueExpr: 'id'
                  },
                  width:160,
                },
                {
                  caption: '科室服务对象',
                  dataField: 'so',
                  alignment:"center",
                  lookup: {
                    dataSource: this.enum.deptSo,
                    displayExpr: 'text',
                    valueExpr: 'id'
                  },
                  minWidth:160,
                },
                {
                  caption: '状态',
                  alignment: 'center',
                  dataField: 'status',
                  cellTemplate: (container, options) => {
                    container.append("<div id='badge'/>");
                    var badgeStatus = new (Vue.component('BadgeStatus'));
                    badgeStatus.dataSource = this.enum.status;
                    badgeStatus.displayExpr = 'text';
                    badgeStatus.valueExpr = 'id';
                    badgeStatus.value = options.data.status;
                    badgeStatus.$mount('#badge');
                  },
                  width:80,
                },
                {
                  caption: '创建人',
                  dataField: 'createBy',
                  alignment:"left",
                  lookup: {
                    dataSource:this.userData,
                    displayExpr: 'name',
                    valueExpr: 'id',
                  },
                  width:120,
                },
                {
                  caption: '创建时间',
                  dataField: 'createTime',
                  dataType: "datetime",
                  format: "yyyy-MM-dd HH:mm",
                  alignment:"left",
                  width:110,
                },
                {
                  caption: '更新人',
                  dataField: 'updateBy',
                  alignment:"left",
                  lookup: {
                    dataSource:this.userData,
                    displayExpr: 'name',
                    valueExpr: 'id',
                  },
                  width:120,
                },
                {
                  caption: '更新时间',
                  dataField: 'updateTime',
                  dataType: "datetime",
                  format: "yyyy-MM-dd HH:mm",
                  alignment:"left",
                  width:110,
                },
          ],
        }).dxTreeList('instance');
         //科室病区
         this.windowDeptWard = $('#window-dept-ward').dxDataGrid({
           showRowLines: true,
           showBorders: true,
           columnAutoWidth: true,
           wordWrapEnabled: true,
           columnFixing: {
             enabled: true
           },
           selection: {
             mode: 'single'
           },
           hoverStateEnabled: true,
           dataSource: {
             store: this.windowDeptWardData
           },
           remoteOperations: {
             filtering: true,
             sorting: true,
             paging: true
           },
           paging: {
             pageSize: 10
           },
           columns: [
             {
               caption: '名称',
               dataField: 'wname',
               alignment:"left"
             }
           ]
         }).dxDataGrid('instance');
         //科室诊室
         this.windowDeptRoom = $('#window-dept-room').dxDataGrid({
           showRowLines: true,
           showBorders: true,
           columnAutoWidth: true,
           wordWrapEnabled: true,
           columnFixing: {
             enabled: true
           },
           selection: {
             mode: 'single'
           },
           hoverStateEnabled: true,
           // onToolbarPreparing: (e) => {
           //   e.toolbarOptions.items.unshift({
           //     location: "before",
           //     template: () => {
           //       return $('<div id=\'btnCol\'/>');
           //     }
           //   });
           // },
           dataSource: {
             store: this.windowDeptRoomData
           },
           remoteOperations: {
             filtering: true,
             sorting: true,
             paging: true
           },
           paging: {
             pageSize: 10
           },
           columns: [
             {
               caption: '名称',
               dataField: 'rname',
               alignment:"left"
             }
           ]
         }).dxDataGrid('instance');
      },
       methods:{
         search: function () {
           // var ds = this.windowDept.getDataSource();
           // ds.loadOptions().searchData = this.searchFormData;
           // ds.reload();
           var dw = this.windowDeptWard.getDataSource();
           dw.loadOptions().searchData = {};
           dw.reload();
           var dr = this.windowDeptRoom.getDataSource();
           dr.loadOptions().searchData = {};
           dr.reload();
         },
         // resetSearch: function () {
         //   this.searchForm.resetValues();
         //   this.windowDept.refresh();
         // },
       }
    }
</script>


