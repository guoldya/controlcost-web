<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
    <div>
      <Card dis-hover>
        <Row class="margin-top-10">
          <Searchpanel ref="searchPanel">
            <div slot="form" class="margin-bottom-3" id="searchForm"></div>
            <div slot="control">
              <Button size="small" type="primary" @click="search">查询</Button>
              <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
            </div>
          </Searchpanel>
        </Row>
        <Row class="margin-top-10">
          <div id="sys-params-grid"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增系统参数</span>
          <span v-else="modal.isNew">编辑系统参数</span>
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
  let sys_params_grid_url = 'sys/sysParams/selectByPage';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  let sys_params_update_url = 'sys/sysParams/updateByModel';
  let sys_params_updateStatus_url ='sys/sysParams/updateStatus';
    export default {
        name: "sys-params",
      data() {
          return {
            isLoadData: true,
            searchForm: {},
            searchFormData: {},
            editForm: {},
            editFormData: {},
            modal: {
              isNew: true,
              visible: false,
              modal_loading: false,
            },
            sysParamsGridData: new this.customstore({
              load: (loadOptions) => {
                return this.CommDs.loadPage(loadOptions, sys_params_grid_url, this.isLoadData, {}, this.sysParamsGrid);
              }
            }),
            sysBdOrgListData: new this.customstore({
              key: "ocode",
              byKey: (key) => {
                return this.CommDs.loadByKey(sys_bdOrg_map_url, {ocode: key,status:1});
              },
              load: (loadOptions) =>{
                  return this.CommDs.loadList(sys_bdOrg_list_url,loadOptions.searchData={status:1});
              }
            }),
          }
      },
      mounted() {
        this.searchForm = $('#searchForm').dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'ocode',
              label: {
                alignment: 'right',
                text: '医疗机构名称',
              },
              editorType: 'dxSelectBox',
              editorOptions:{
                placeholder: '请选择',
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              }
            },
            {
              dataField: 'status',
              editorType: 'dxSelectBox',
              editorOptions: {
                dataSource: this.enum.status,
                placeholder: '请选择',
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
              label: {
                alignment: 'right',
                text: '编码',
              },
              editorOptions: {
                placeholder: '<系统自动生成>',
                disabled:true,
              }
            },
            {
              dataField: 'ocode',
              label: {
                alignment: 'right',
                text: '医疗机构名称',
              },
              editorType: 'dxSelectBox',
              editorOptions:{
                placeholder: '请选择',
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
              validationRules: [{
                type: "required",
                message: "请选择"
              }],
            },
            {
              dataField: 'dataType',
              label: {
                alignment: 'right',
                text: '数据类型',
              },
              editorType: 'dxSelectBox',
              editorOptions:{
                placeholder: '请选择',
                dataSource: this.enum.sysDataType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },

            {
              dataField: 'dataClass',
              label: {
                alignment: 'right',
                text: '参数作用域',
              },
              editorType: 'dxSelectBox',
              editorOptions:{
                placeholder: '请选择',
                dataSource: this.enum.paramsScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请选择参数作用域",
              }],
            },
            {
              dataField: 'unit',
              label: {
                alignment: 'right',
                text: '单位',
              },
              editorOptions: {
                maxLength:8
              },
            },
            {
              dataField: 'name',
              label: {
                alignment: 'right',
                text: '系统参数名称',
              },
              editorOptions:{
                maxLength:32,
              },
              validationRules: [{
                type: "required",
                message: "请输入系统参数名称",
              }],
            },
            {
              colSpan:2,
              dataField: 'dataValue',
              editorType: 'dxTextArea',
              label: {
                alignment: 'right',
                text: '数据值',
              },
              editorOptions: {
                height: 80,
              },
              validationRules: [{
                type: "required",
                message: "请输入数据值",
              }],
            },
            {
              colSpan:2,
              dataField: 'remark',
              editorType: "dxTextArea",
              label: {
                alignment: 'right',
                text: '备注 ',
              },
              editorOptions: {
                maxLength:64
              },
            },
            {
              dataField: 'status',
              label: {
                alignment: 'right',
                text: '状态',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.status,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请选择状态"
              }],
            },
          ],
        }).dxForm('instance');

        this.sysParamsGrid = $('#sys-params-grid').dxDataGrid({
           showRowLines: true,
         showBorders: true,
           columnAutoWidth: true,
          //wordWrapEnabled: true,
          allowColumnResizing: true,
          allowColumnReordering: true,
          columnFixing: {
            enabled: true
          },
          hoverStateEnabled: true,
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true,
          },
          paging: {
            pageSize: 10,
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText: '共{1}页/{2}数据',
          },
          selection: {
            mode: 'single',
          },
          dataSource:{
            store: this.sysParamsGridData,
          },
          onToolbarPreparing: (e) => {
            e.toolbarOptions.items.unshift({
              location: "before",
              template: () => {
                return $('<div id=\'btn\'/>');
              }
            })
          },
          columns: [
            {
              caption: '操作',
              alignment: 'center',
              width:100,
              cellTemplate: (container,options) => {
                container.append('<div id="t1"/>');
                var opcol = new (Vue.component('OpCol'));
                if(options.data.status == 1){
                  opcol.items = [
                    {text: '编辑', showtip: false, id:options.data, click: this.edit},
                    {text: '停用', color: '#ff9900', showtip: true, tip:'您确定停用吗？', id:{id:options.data.id,status:0}, click: this.updateStatus},
                  ];
                }else if(options.data.status == 0 || options.data.status == null){
                  opcol.items = [
                    {text: '编辑', showtip: false, id:options.data, click: this.edit},
                    {text: '启用', color: '#52c41a', showtip: false, id:{id:options.data.id,status:1}, click: this.updateStatus},
                  ];
                }
                opcol.$mount('#t1');
              },
            },
            {
              dataField: 'id',
              caption: '编码',
              alignment: 'right',
              width:80,
            },
            {
              dataField: 'ocode',
              caption: '医疗机构名称',
              alignment: 'left',
              lookup: {
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
              minWidth:130
            },
            {
              dataField: 'name',
              caption: '系统参数名称',
              alignment: 'left',
              minWidth:130
            },
            {
              dataField: 'dataType',
              caption: '数据类型',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.sysDataType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100,
            },
            {
              dataField: 'dataValue',
              caption: '数据值',
              alignment: 'left',
              width:250,
            },
            {
              dataField: 'dataClass',
              caption: '作用域',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.paramsScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100
            },
            {
              dataField: 'remark',
              caption: '备注',
              width:300
            },
            {
              dataField: 'status',
              caption: '状态',
              alignment: 'center',
              width:80,
              cellTemplate: (container,options) => {
                container.append("<div id='badge'/>");
                var badgeStatus = new (Vue.component('BadgeStatus'));
                badgeStatus.dataSource = this.enum.status;
                badgeStatus.displayExpr = 'text';
                badgeStatus.valueExpr = 'id';
                badgeStatus.value = options.data.status;
                badgeStatus.$mount('#badge');
              }
            },
            {
              dataField: 'createTime',
              caption: '创建时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:110,
            },
            {
              dataField: 'updateTime',
              caption: '更新时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:110,
            },
          ],
        }).dxDataGrid('instance');
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addParams},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods: {
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
          var ds = this.sysParamsGrid.getDataSource();
          if ($.trim(this.searchFormData.ocode).length >0) {
            this.searchFormData.ocode +="";
          }
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
        },
        resetSearch: function () {
          this.$refs.dateRange.values = null;
          this.searchFormData.updateTime =[];
          this.searchForm.resetValues();
          this.sysParamsGrid.refresh();
        },
        //编辑系统参数
        edit: function(data){
          this.modal.isNew = false;
          let tempData={};
          for (let key in data)
          {
            tempData[key]=data[key];
          }
          this.editFormData = tempData;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        //新增系统参数
        addParams: function () {
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        //取消编辑或增加
        editFormCancel: function () {
          this.modal.visible = false;
        },
        //提交编辑或增加
        formSubmit: function () {
          let params = this.editFormData;
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          };
          this.$post(sys_params_update_url,params).then( res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.sysParamsGrid.refresh();
              });
            } else {
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
          this.modal.modal_loading = false;
        },
        //改变状态
        updateStatus: function (data) {
          this.$post(sys_params_updateStatus_url,data).then(res => {
            if (res.code == '200'){
              this.success('成功', () => {
                this.sysParamsGrid.refresh();
              })
            } else {
              this.warn(res.msg);
            }
          }).catch( err => {
            this.error(err);
          });
        },
      },
    }
</script>

