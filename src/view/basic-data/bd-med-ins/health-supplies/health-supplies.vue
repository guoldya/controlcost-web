<style lang="less">
  @import "../../../../styles/common.less";
</style>
<template>
    <div>
      <Card dis-hover>
        <Row class="margin-top-10">
          <Searchpanel ref="searchPanel">
            <div slot="form" class="margin-bottom-4" id="searchForm">
            </div>
            <div slot="control">
              <Button size="small" type="primary" @click="search">查询</Button>
              <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
            </div>
          </Searchpanel>
        </Row>
        <Row class="margin-top-10">
          <div id="health-care-grid"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增医保耗材</span>
          <span v-else="modal.isNew">编辑医保耗材</span>
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
  let health_care_grid_url = 'sys/bdInsMc/selectByPage';
  let health_care_updatestatus_url = 'sys/bdInsMc/updateStatus';
  let health_care_update_url = 'sys/bdInsMc/updateByModel';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
    export default {
      data(){
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
          healthCareGridData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, health_care_grid_url, this.isLoadData, {}, this.healthCareGrid);
            }
          }),
          sysBdOrgListData: new this.customstore({
            key: "ocode",
            byKey: (key) => {
              return this.CommDs.loadByKey(sys_bdOrg_map_url, {ocode: key,status:1});
            },
            load: (e) =>{
              return this.CommDs.loadList(sys_bdOrg_list_url,{status:1});
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
      mounted() {
        this.searchForm = $('#searchForm').dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'insCode',
              label: {
                alignment: 'right',
                text: '医保编码',
              }
            },
            {
              dataField: 'itemName',
              label: {
                alignment: 'right',
                text: '项目名称',
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
                text: '修改时间'
              },
              template: this.addDateRange,
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
            },
          ]
        }).dxForm('instance');
        this.healthCareGrid = $('#health-care-grid').dxDataGrid({
          showBorders: true,
          showRowLines: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          columnFixing: {
            enabled: true
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true,
          },
          paging: {
            pageSize: 10,
          },
          hoverStateEnabled: true,
          selection: {
            mode: 'single',
          },
          dataSource: {
            store:this.healthCareGridData,
          },
          onToolbarPreparing: (e) => {
            e.toolbarOptions.items.unshift({
              location: "before",
              template: () => {
                return $('<div id=\'btn\'/>');
              }
            })
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText: '共{1}页/{2}数据',
          },
          columns: [
            {
              dataField: 'insCode',
              caption: '医保编码',
              alignment: 'left',
              width: 200
            },
            {
              dataField: 'itemCode',
              caption: '项目编码',
              alignment: 'left',
              width: 100
            },

            {
              dataField: 'itemId',
              caption: '项目ID',
              alignment: 'left',
              width: 100
            },
            {
              dataField: 'itemName',
              caption: '项目名称',
              minWidth: 150
            },
            {
              dataField: 'itemClId',
              caption: '项目分类ID',
              alignment: 'left',
              width: 130
            },
            {
              dataField: 'itemClName',
              caption: '项目分类名称',
              width:100
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
              width: 130
            },
            {
              dataField: 'feeType',
              caption: '费别',
              alignment: 'center',
              width: 100
            },
            {
              dataField: 'insFeeType',
              caption: '医保费用类型',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.medInsFeeType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width: 130
            },
            {
              dataField: 'factory',
              caption: '生产厂商',
              width: 130
            },
            {
              dataField: 'itemType',
              caption: '类型',
              alignment: 'center',
              lookup: {
                dataSource:this.enum.itemType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width: 100
            },
            {
              dataField: 'spec',
              caption: '规格',
              width: 130
            },

            {
              dataField: 'unit',
              caption: '单位',
              width: 80,
              alignment: 'center',
            },
            {
              dataField: 'status',
              caption: '状态',
              alignment: 'center',
              cellTemplate: (container,options) => {
                container.append("<div id='badge'/>");
                var badgeStatus = new (Vue.component('BadgeStatus'));
                badgeStatus.dataSource = this.enum.status;
                badgeStatus.displayExpr = 'text';
                badgeStatus.valueExpr = 'id';
                badgeStatus.value = options.data.status;
                badgeStatus.$mount('#badge');
              },
              width: 80
            },
            {
              dataField: 'createBy',
              caption: '创建人',
              lookup: {
                dataSource:this.userData,
                displayExpr: 'name',
                valueExpr: 'id',
              },
              width: 80
            },
            {
              dataField: 'createTime',
              caption: '创建时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width: 110
            },
            {
              dataField: 'updateBy',
              caption: '更新人',
              lookup: {
                dataSource:this.userData,
                displayExpr: 'name',
                valueExpr: 'id',
              },
              width: 80
            },
            {
              dataField: 'updateTime',
              caption: '更新时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width: 110
            },
          ]
        }).dxDataGrid('instance');
        this.editForm = $('#editForm').dxForm({
          colCount: 2,
          formData: this.editFormData,
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
              },
              validationRules: [{
                type: "required",
                message: "请选择"
              }],
            },
            {
              dataField: 'insCode',
              label: {
                alignment: 'right',
                text: '医保编码',
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [{
                type: "required",
                message: "请输医保编码",
              }],
            },
            {
              dataField: 'itemCode',
              label: {
                alignment: 'right',
                text: '项目编码',
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [{
                type: "required",
                message: "请输入项目编码",
              }],
            },
            {
              dataField: 'feeType',
              label: {
                alignment: 'right',
                text: '费别',
              },
              editorOptions: {
                maxLength: 32,
              },
            },
            {
              dataField: 'insFeeType',
              label: {
                alignment: 'right',
                text: '医保费用类型',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.medInsFeeType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请输医保费用类型",
              }],
            },
            {
              dataField: 'itemId',
              label: {
                alignment: 'right',
                text: '项目id',
              },
              editorOptions: {
                maxLength: 16,
              },
              validationRules: [{
                type: "required",
                message: "请输入项目id"
              }],
            },
            {
              dataField: 'itemName',
              label: {
                alignment: 'right',
                text: '项目名称',
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [{
                type: "required",
                message: "请输入项目名称"
              }],
            },
            {
              dataField: 'itemClId',
              label: {
                alignment: 'right',
                text: '项目分类id',
              },
              editorOptions: {
                maxLength: 16,
              },
              validationRules: [{
                type: "required",
                message: "请输入项目分类id"
              }],
            },
            {
              dataField: 'itemClName',
              label: {
                alignment: 'right',
                text: '项目分类名称',
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [{
                type: "required",
                message: "请输入项目分类名称"
              }],
            },
            {
              dataField: 'factory',
              label: {
                alignment: 'right',
                text: '生产厂商',
              },
              editorOptions: {
                maxLength: 32,
              },
            },
            {
              dataField: 'spec',
              label: {
                alignment: 'right',
                text: '规格',
              },
              editorOptions: {
                maxLength: 32,
              },
            },
            {
              dataField: 'itemType',
              label: {
                alignment: 'right',
                text: '类型',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.itemType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请选择类型"
              }],
            },
            {
              dataField: 'unit',
              label: {
                alignment: 'right',
                text: '单位',
              },
              editorOptions: {
                maxLength: 16,
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
              }]
            },
          ],
        }).dxForm('instance');
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          // {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addHealthCare},
          {id: 1, text: '同步', type: 'primary', enabled: true,click: this.addHealthCare},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods: {
        search: function () {

          var ds = this.healthCareGrid.getDataSource();
          if ($.trim(this.searchFormData.ocode).length >0) {
            this.searchFormData.ocode +="";
          }
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
        },
        resetSearch: function () {
          this.$refs.dateRange.values = null;
          this.searchFormData.updateTime = '';
          this.searchForm.resetValues();
          this.healthCareGrid.refresh();
        },
        addHealthCare: function () {
          // this.modal.isNew = true;
          // this.editFormData = {};
          // this.editFormData.status = 1;
          // this.editForm.option('formData', this.editFormData);
          // this.modal.visible = true;
        },
        edit: function (data) {
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
        updateStatus: function (data) {
          // var params = {};
          // params.id = data.id;
          this.$post(health_care_updatestatus_url,data).then(res => {
            if (res.code == '200'){
              this.success('成功!',() => {
                this.healthCareGrid.refresh();
              });
            } else{
              this.warn(res.msg);
            }
          }).catch( err => {
            this.error(err);
          });
        },
        editFormCancel: function(){
          this.modal.visible = false;
        },
        formSubmit: function(){
          let params = this.editFormData;
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          };
          this.$post(health_care_update_url,params).then( res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.healthCareGrid.refresh();
              });
            } else {
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
          this.modal.modal_loading = false;
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
      },
    }
</script>

