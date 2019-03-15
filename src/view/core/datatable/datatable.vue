<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Card dis-hover>
      <Row class="margin-top-10">
        <Searchpanel ref="searchPanel">
          <div slot="form" class="margin-bottom-3" id="searchForm">
          </div>
          <div slot="control">
            <Button size="small" type="primary" @click="search">查询</Button>
            <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
          </div>
        </Searchpanel>
      </Row>
      <Row class="margin-top-10">
        <div id="window-grid"></div>
      </Row>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增数据窗口</span>
        <span v-else="modal.isNew">编辑数据窗口</span>
      </p>
      <div id="editForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Vue from 'vue';
  let window_grid_url = 'sys/coreDatatable/selectByPage';
  let window_insert_url = 'sys/coreDatatable/updateOrInsert';
  let status_url = 'sys/coreDatatable/updateStatus';
  let db_list_url="sys/coreDbDatasource/selectByList";
  let db_list_detail_url = 'sys/coreDbDatasource/selectByOne';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    data(){
      return{
        isLoadData:true,
        searchForm:{},
        searchFormData:{},
        editForm:{},
        editFormData:{},
        modal:{
          isNew:true,
          visible:false,
          modal_loading:false,
          lebtext:"源"
        },
        windowGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, window_grid_url, this.isLoadData, {}, this.windowGrid);
          },
        }),
        dbListData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(db_list_detail_url, { id: key });
          },
          load: (e) => {
            return this.CommDs.loadList(db_list_url);
          }
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
      }
    },
    mounted(){
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'dtCode',
            label: {
              alignment: 'right',
              text: '编码'
            },
            editorType: 'dxNumberBox',
          },
          {
            dataField: 'dtName',
            label: {
              alignment: 'right',
              text: '名称'
            },
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.status,
              placeholder:'请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
            }
          },
          {
            dataField: 'updateTime',
            label: {
              alignment: 'right',
              text: '更新时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');

      this.editForm = $('#editForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'id',
            //colSpan:2,
            label: {
              alignment: 'right',
              text: '序号'
            },
            editorOptions:{
              placeholder:'<系统自动生成>',
              disabled:true,
            }
          },
          {
            dataField: 'dtCode',
            //colSpan:2,
            label: {
              alignment: 'right',
              text: '编码'
            },
            // editorType:'dxNumberBox',
            editorOptions:{
              maxLength:18,
              placeholder:'<用户自定义输入>',
            },
            validationRules: [
              {
              type: "pattern",
              message: "请输入正确编码",
              pattern: "^[0-9]*$",},
              {
                type: "required",
                message: "请输入编码"
            }]
          },
          {
            dataField: 'dtName',
            label: {
              alignment: 'right',
              text: '名称'
            },
            editorOptions:{
              maxLength:32
            },
            validationRules: [{
              type: "required",
              message: "请输入名称"
            }]
          },
          {
            dataField: 'dbDsId',
            label: {
              alignment: 'right',
              text: '数据源'
            },
            editorType: 'dxSelectBox',
            editorOptions:{
              dataSource:this.dbListData,
              placeholder:'请选择',
              displayExpr:'dsName',
              valueExpr:'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择数据源"
            }]
          },
          {
            dataField: 'sqlText',
            colSpan:2,
            editorType:'dxTextArea',
            label: {
              alignment: 'right',
              text: '内部SQL文本'
            },
            editorOptions:{
              height:80
            },
            validationRules: [{
              type: "required",
              message: "内部SQL文本"
            }]
          },
          {
            dataField: 'dbSqlText',
            colSpan:2,
            editorType:'dxTextArea',
            label: {
              alignment: 'right',
              text: '外部SQL文本'
            },
            editorOptions:{
              height:80
            },
            validationRules: [{
              type: "required",
              message: "请输入外部SQL文本"
            }]
          },
          {
            dataField: 'refresh',
            editorType:'dxNumberBox',
            label: {
              alignment: 'right',
              text: '刷新频率'
            },
            editorOptions: {
              min: 0,
              max: 10000,
            },
            validationRules: [{
              type: "required",
              message: "请输入刷新频率"
            }]
          },
          {
            dataField: 'refreshUnit',
            label: {
              alignment: 'right',
              text: '频率单位'
            },
            editorType: 'dxSelectBox',
            editorOptions:{
              dataSource:this.enum.refreshUnit,
              placeholder:'请选择',
              displayExpr:'text',
              valueExpr:'id',
            },
            validationRules: [{
              type: "required",
              message: "请输入频率单位"
            }]
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.status,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
            },
            validationRules: [{
              type: "required",
              message: "请选择状态"
            }]
          },
        ]
      }).dxForm('instance');

      this.windowGrid = $('#window-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: false,
        allowColumnResizing: true,
        allowColumnReordering: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'
        },
        hoverStateEnabled: true,
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          });
        },
        dataSource: {
          store: this.windowGridData
        },
        remoteOperations: {
          filtering: true,
          sorting: true,
          paging: true
        },
        paging: {
          pageSize: 10
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText:'共{1}页/{2}数据'
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
            allowResizing: false,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: (container, options) => {
              //操作列
              container.append('<div id=\'t1\'/>');

              var opcol = new (Vue.component('OpCol'));
              if(options.data.status == 1){
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认停用吗？',
                    id: {id:options.data.id,status:0},
                    click: this.UpdateStatus
                  },
                ];
              }else{
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    // tip: '您确认停用吗？',
                    id: {id:options.data.id,status:1},
                    click: this.UpdateStatus
                  },
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100,
          },
          {
            caption: '序号',
            dataField: 'id',
            alignment:'right',
            width:80
          },
          {
            caption: '编码',
            dataField: 'dtCode',
            width:130
          },
          {
            caption: '名称',
            dataField: 'dtName',
            minWidth: 130
          },
          {
            caption: '数据源',
            dataField: 'dbDsId',
            alignment: 'center',
            lookup:{
              dataSource:this.dbListData,
              displayExpr:'dsName',
              valueExpr:'id',
            },
            width: 110
          },
          {
            caption: '刷新频率',
            dataField: 'refresh',
            width:100
          },
          {
            caption:'频率单位',
            dataField: 'refreshUnit',
            width:100,
            alignment:'center',
          },
          {
            caption:'状态',
            alignment:'center',
            dataField: 'status',
            cellTemplate: (container, options) => {
              container.append("<div id='badge'/>");
              var badgeStatus = new (Vue.component('BadgeStatus'));
              badgeStatus.dataSource=this.enum.status;
              badgeStatus.displayExpr='text';
              badgeStatus.valueExpr='id';
              badgeStatus.value=options.data.status;
              badgeStatus.$mount('#badge');
            },
            width:80
          },
          {
            caption:'创建人',
            dataField: 'createBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width:130
          },
          {
            caption:'创建时间',
            dataField: 'createTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width:110
          },
          {
            caption:'更新人',
            dataField: 'updateBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width:130
          },
          {
            caption:'更新时间',
            dataField: 'updateTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width:110
          },
        ]
      }).dxDataGrid('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addWindow},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;

      this.database();
    },
    methods:{
      database: function(){

      },
      // 添加搜索时间区段
      addDateRange: function (data, itemElement) {
        itemElement.append('<div id=\'dateRange\'/>');
        var dateRange = new (Vue.component('DateRange'));
        dateRange.field = data;
        dateRange.$mount('#dateRange');
        dateRange.$parent = this;
        this.$refs.dateRange = dateRange;
      },

      search: function () {
        var ds = this.windowGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },

      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateTime = null;
        this.searchForm.resetValues();
        this.windowGrid.refresh();
      },

      addWindow:function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editForm.option('formData',this.editFormData);
        this.modal.visible = true;
      },

      edit:function(data){
        this.modal.isNew = false;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editFormData = tempData;
        this.editForm.option('formData',this.editFormData);
        this.modal.visible = true;
      },

      UpdateStatus:function(data){
        // let params = {};
        // params.id = data.id;
        this.$post(status_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.windowGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      editFormCancel:function () {
        this.modal.visible = false;
      },

      formSubmit:function () {
        //let params = {};
        if(!this.editForm.validate().isValid){
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(window_insert_url,this.editFormData).then(res => {
          if(res.code=='200')
          {
            this.success('保存成功!',()=>{
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.windowGrid.refresh();
            });
          }
          else
          {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err=>
        {
          this.error(err);
        });
        this.modal.modal_loading = false;
      }
    }
  }
</script>
