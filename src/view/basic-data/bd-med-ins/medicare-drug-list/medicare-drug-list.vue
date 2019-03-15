<style lang="less">
  @import "../../../../styles/common.less";
</style>

<template>
  <div>
    <Card dis-hover>
      <Row class="margin-top-10">
        <Searchpanel  ref="searchPanel">
          <div slot="form" class="margin-bottom-3" id="searchForm">
          </div>
          <div slot="control">
            <Button size="small" type="primary" @click="search">查询</Button>
            <Button size="small" @click="resetSearch" class="margin-left-5" >重置</Button>
          </div>
        </Searchpanel>
      </Row>
      <Row class="margin-top-10">
        <div id="window-drug"></div>
      </Row>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增医保药品</span>
        <span v-else="modal.isNew">编辑医保药品</span>
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

  let window_drug_url = 'sys/bdInsMed/selectByPage';
  let window_insert_url = 'sys/bdInsMed/updateByModel';
  let status_url = 'sys/bdInsMed/updateStatus';
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
        windowDrugData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, window_drug_url, this.isLoadData, {}, this.windowDrug);
          },
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
      let _this=this;
      //4表单初始化
      this.searchForm=$("#searchForm").dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField:'insCode',
            label: {
              alignment: 'right',
              text: '医保编码'
            }
          },
          {
            dataField: 'itemName',
            label: {
              alignment: 'right',
              text: '项目名称'
            },
          },
          {
            dataField: 'itemType',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.medItemType,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '类型'
            },
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
              dataSource: this.dbListData,
              displayExpr: 'oname',
              valueExpr: 'ocode',
            },
          },
        ]
      }).dxForm('instance');
      //新增
      this.editForm = $('#editForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'id',
            label: {
              alignment: 'right',
              text: '编码'
            },
            editorOptions: {
              placeholder: '<系统自动生成>',
              disabled: true,
            }
          },
          {itemType: "empty"},
          {
            dataField: 'ocode',
            label: {
              alignment: 'right',
              text: '医疗机构名称'
            },
            editorType: 'dxSelectBox',
            editorOptions:{
              dataSource:this.dbListData,
              placeholder:'请选择',
              displayExpr:'oname',
              valueExpr:'ocode',
            },
            validationRules: [{
              type: "required",
              message: "请选择医疗机构"
            }]
          },
          {
            dataField: 'insCode',
            label: {
              alignment: 'right',
              text: '医保编码'
            },
            validationRules: [{
              type: "required",
              message: "医保编码"
            }],
            editorOptions: {
              maxLength:32
            }
          },
          {
            dataField: 'itemCode',
            label: {
              alignment: 'right',
              text: '项目编码'
            },
            validationRules: [{
              type: "required",
              message: "项目编码"
            }],
            editorOptions: {
              maxLength:32
            }
          },
          {
            dataField: 'feeType',
            label: {
              alignment: 'right',
              text: '费别'
            },
            validationRules: [{
              type: "required",
              message: "费别"
            }],
            editorOptions: {
              maxLength:32
            }
          },
          {
            dataField: 'insFeeType',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.medInsFeeType,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '医保费用类型'
            },
            validationRules: [{
              type: "required",
              message: "医保费用类型"
            }]
          },
          {
            dataField: 'itemId',
            label: {
              alignment: 'right',
              text: '项目id'
            },
            validationRules: [{
              type: "required",
              message: "项目id"
            }],
            editorOptions: {
              maxLength:16
            }
          },
          {
            dataField: 'itemClId',
            label: {
              alignment: 'right',
              text: '项目分类id'
            },
            validationRules: [{
              type: "required",
              message: "项目分类id"
            }],
            editorOptions: {
              maxLength:16
            }
          },
          {
            dataField: 'itemName',
            label: {
              alignment: 'right',
              text: '项目名称'
            },
            validationRules: [{
              type: "required",
              message: "项目名称"
            }],
            editorOptions: {
              maxLength:32
            }
          },
          {
            dataField: 'itemClName',
            label: {
              alignment: 'right',
              text: '项目分类名称'
            },
            validationRules: [{
              type: "required",
              message: "项目分类名称"
            }],
            editorOptions: {
              maxLength:32
            }
          },
          {
            dataField: 'spec',
            label: {
              alignment: 'right',
              text: '规格'
            },
            validationRules: [{
              type: "required",
              message: "规格"
            }],
            editorOptions: {
              maxLength:32
            }
          },
          {
            dataField: 'llevel',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.medLlevel,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '限用级别'
            },
            validationRules: [{
              type: "required",
              message: "限用级别"
            }]
          },
          {
            dataField: 'unit',
            label: {
              alignment: 'right',
              text: '单位'
            },
            validationRules: [{
              type: "required",
              message: "单位"
            }],
            editorOptions: {
              maxLength:16
            }
          },
          {
            dataField: 'itemType',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.medItemType,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '类型'
            },
            validationRules: [{
              type: "required",
              message: "类型"
            }]
          },
          {
            dataField: 'factory',
            label: {
              alignment: 'right',
              text: '生产厂商'
            },
            validationRules: [{
              type: "required",
              message: "生产厂商"
            }],
            editorOptions: {
              maxLength:32
            }
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
      //表栏
      this.windowDrug = $('#window-drug').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
       // wordWrapEnabled: true,
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
          store: this.windowDrugData
        },
        remoteOperations: {
          filtering: true,
          //sorting: true,
          paging: true
        },
        paging: {
          pageSize: 10
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText: '共{1}页/{2}数据',
        },
        columns: [
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width: 80
          },
          {
            caption: '医保编码',
            dataField: 'insCode',
            alignment:"left",
            minWidth: 150
          },
          {
            caption: '项目编码',
            dataField: 'itemCode',
            width: 130
          },
          {
            caption: '项目名称',
            dataField: 'itemName',
            width: 130
          },
          {
            caption: '项目分类名称',
            dataField: 'itemClName',
            width: 130
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
            width: 130,
          },
          {
            caption: '费别',
            dataField: 'feeType',
            alignment: 'center',
            width: 130
          },
          {
            caption: '医保费用类型',
            dataField: 'insFeeType',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.medInsFeeType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 130
          },
          {
            caption: '规格',
            dataField: 'spec',
            width: 130
          },
          {
            caption: '限用级别',
            dataField: 'llevel',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.medLlevel,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            width: 100
          },
          {
            caption: '单位',
            dataField: 'unit',
            alignment: 'center',
            width: 100
          },
          {
            caption: '类型',
            dataField: 'itemType',
            alignment:"center",
            lookup: {
              dataSource: this.enum.medItemType,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            width: 130
          },
          {
            caption: '生产厂商',
            dataField: 'factory',
            minWidth: 130
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
            width: 80
          },
          {
            caption: '创建人',
            dataField: 'createBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width: 100
          },
          {
            caption: '创建时间',
            dataField: 'createTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 110
          },
          {
            caption: '更新人',
            dataField: 'updateBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width: 100
          },
          {
            caption: '更新时间',
            dataField: 'updateTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 110
          },
        ]
      }).dxDataGrid('instance');
      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        // {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addWindow},
        {id: 1, text: '同步', type: 'primary', enabled: true,click: this.addWindow},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;
    },
    methods:{
      addDateRange: function (data, itemElement) {
        itemElement.append('<div id=\'dateRange\'/>');
        var dateRange = new (Vue.component('DateRange'));
        dateRange.field = data;
        dateRange.$mount('#dateRange');
        dateRange.$parent = this;
        this.$refs.dateRange = dateRange;
      },
      search: function () {
        var ds = this.windowDrug.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateTime = [];
        this.searchForm.resetValues();
        this.windowDrug.refresh();
      },
      addWindow: function () {
        // this.modal.isNew = true;
        // this.editFormData = {};
        // this.editFormData.status = 1;
        // this.editForm.option('formData', this.editFormData);
        // this.modal.visible = true;
      },
      edit: function (data) {
        this.modal.isNew = false;
        //this.editFormData = data;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editFormData = tempData;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },

      UpdateStatus: function (data) {
        // let params = {};
        // params.id = data.id;
        this.$post(status_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.windowDrug.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      editFormCancel: function () {
        this.modal.visible = false;
      },

      formSubmit: function () {
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(window_insert_url, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.windowDrug.refresh();
            });
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modal.modal_loading = false;
      }
    }
  }
</script>


