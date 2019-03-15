<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div class="margin-top-5">
    <Row>
      <Col span="12">
      <Card dis-hover>
        <p slot="title">
          事件原型
        </p>
        <Row class="margin-top-10">
          <div id="window-grid"></div>
        </Row>
      </Card>
      </Col>
      <Col span="12" style="padding-left: 5px">
      <Card dis-hover>
        <p slot="title">
          事件原型列
        </p>
        <Row class="margin-top-10">
          <Searchpanel ref="searchPanel">
            <div slot="form" class="margin-bottom-3" id="searchColForm">
            </div>
            <div slot="control">
              <Button size="small" type="primary" @click="colSearch">查询</Button>
              <Button size="small" @click="colResetSearch" class="margin-left-5">重置</Button>
            </div>
          </Searchpanel>
        </Row>
        <Row class="margin-top-10">
          <div id="grid-col"></div>
        </Row>
      </Card>
      </Col>
    </Row>
    <Modal v-model="modal.visible" :mask-closable="false" width="900" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增事件原型</span>
        <span v-else="modal.isNew">编辑事件原型</span>
      </p>
      <div id="editForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalCol.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modalCol.isNew">新增事件原型列</span>
        <span v-else="modalCol.isNew">编辑事件原型列</span>
      </p>
      <div id="editColForm"></div>
      <div slot="footer">
        <Button type="text" @click="editColFormCancel">取消</Button>
        <Button type="primary" :loading="modalCol.modal_loading" @click="formSubmitCol">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import Vue from 'vue';

  let window_grid_url = 'sys/coreFact/selectByPage';
  let window_grid_col_url = 'sys/coreFactCol/selectByPage';
  let window_insert_url = 'sys/coreFact/updateOrInsert';
  let window_insert_col_url = 'sys/coreFactCol/updateOrInsert';
  let status_col_url = 'sys/coreFactCol/updateStatus';
  let status_url = 'sys/coreFact/updateStatus';
  let db_list_url = "sys/coreDbDatasource/selectByList";
  let db_list_detail_url = 'sys/coreDbDatasource/selectByOne';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    data() {
      return {
        isLoadData: true,
        editForm: {},
        editFormData: {},

        searchColForm: {},
        searchColFormData: {},

        cfId: null,
        editColForm: {},
        editColFormData: {},
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        modalCol: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        windowGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, window_grid_url, this.isLoadData, {}, this.windowGrid);
            },
        }),

        windowGridColData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadList(window_grid_col_url,loadOptions.searchData);
          },
        }),
        dbListData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(db_list_detail_url, {id: key});
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
    mounted() {
      let _this = this;

      this.editForm = $('#editForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'id',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '序号'
            },
            editorOptions: {
              placeholder: '<系统自动生成>',
              disabled: true,
            }
          },
          {
            dataField: 'factName',
            //colSpan:2,
            label: {
              alignment: 'right',
              text: '名称'
            },
            editorOptions: {
              maxLength:32
            },
            validationRules: [{
              type: "pattern",
              message: "请输入正确名称",
              pattern: "^[a-zA-Z]+$",},
              {
                type: "required",
                message: "请输入名称"
            }]
          },
          {
            dataField: 'dsId',
            label: {
              alignment: 'right',
              text: '数据源'
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.dbListData,
              placeholder: '请选择',
              displayExpr: 'dsName',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请输入"
            }]
          },
          {
            dataField: 'tparam',
            label: {
              alignment: 'right',
              text: '交易参数',
            },
            editorOptions: {
              maxLength:32
            },
            validationRules: [{
              type: "required",
              message: "请输入交易参数"
            }]
          },
          {
            itemType: 'empty',
          },
          {
            colSpan: 2,
            dataField: 'tcodeTage',
            label: {
              alignment: 'right',
              text: '交易代码'
            },
            editorType: 'dxTagBox',
            editorOptions: {
              dataSource: this.enum.tcode,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
              showClearButton: true,
            },
            validationRules: [{
              type: "required",
              message: "请选择交易代码"
            }]
          },
          {
            dataField: 'dsSqlText',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '数据源SQL'
            },
            editorOptions: {
              height: 150
            },
            editorType: 'dxTextArea',
            validationRules: [{
              type: "required",
              message: "请输入"
            }]
          },
          {
            dataField: 'remark',
            colSpan: 2,
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text: '备注'
            },
            editorOptions: {
              height: 50,
              maxLength: 64
            },
            validationRules: [{
              type: "required",
              message: "请输入备注"
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

      this.editColForm = $('#editColForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'id',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '编码'
            },
            editorOptions: {
              placeholder: '<系统自动生成>',
              disabled: true,
            }
          },
          {
            dataField: 'colName',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '列名称'
            },
            editorOptions: {
              maxLength:32
            },
            validationRules: [{
              type: "required",
              message: "请输列名称"
            }]
          },
          {
            dataField: 'colCode',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '列编码'
            },
            editorOptions: {
              maxLength:32
            },
            validationRules: [{
              type: "required",
              message: "请输列编码"
            }]
          },
          {
            dataField: 'colType',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.colType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '列类型'
            },
            validationRules: [{
              type: "required",
              message: "请选择"
            }]
          },
          {
            dataField: 'colNo',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '显示顺序'
            },
            editorOptions: {
              min: 0,
              max:1000000000
            },
            validationRules: [{
              type: "required",
              message: "请输显示顺序"
            }]
          },
          {
            dataField: 'subType',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.subType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '引擎限定类型'
            },
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
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

      this.searchColForm = $('#searchColForm').dxForm({
        colCount: 2,
        formData: this.searchColFormData,
        items: [
          {
            dataField: 'colName',
            label: {
              alignment: 'right',
              text: '名称'
            }
          },
          {
            dataField: 'colCode',
            label: {
              alignment: 'right',
              text: '列编码'
            },
          },
        ]
      }).dxForm('instance');

      this.GridCol = $('#grid-col').dxDataGrid({
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
              return $('<div id=\'btnCol\'/>');
            }
          });
        },
        dataSource: {
          store: this.windowGridColData
        },
        remoteOperations: {
          filtering: true,
         //sorting: true,
          //paging: true
        },
        paging: {
          pageSize: 50
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText: '共{1}页/{2}数据',
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
              container.append('<div id=\'tcol1\'/>');

              var opcol = new (Vue.component('OpCol'));
              if (options.data.status == 1) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.editCol},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认停用吗？',
                    id: {id: options.data.id, status: 0},
                    click: this.UpdateStatusCol
                  },
                ];
              } else {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.editCol},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    // tip: '您确认停用吗？',
                    id: {id: options.data.id, status: 1},
                    click: this.UpdateStatusCol
                  },
                ];
              }
              opcol.$mount('#tcol1');
            },
            width: 100,
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width: 80
          },
          {
            caption: '名称',
            dataField: 'colName',
            minWidth: 150
          },
          {
            caption: '列编码',
            dataField: 'colCode',
            width: 120
          },
          {
            caption: '列类型',
            dataField: 'colType',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.colType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 80
          },
          {
            caption: '显示顺序',
            dataField: 'colNo',
            minWidth: 50
          },
          {
            caption: '引擎限定类型',
            dataField: 'subType',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.subType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width:120,
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
            width: 80
          },
          {
            caption: '创建时间',
            dataField: 'createTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 110,
          },
          {
            caption: '更新人',
            dataField: 'updateBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width: 80
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

      this.windowGrid = $('#window-grid').dxDataGrid({
        keyExpr: "id",
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
        onSelectionChanged:(e)=>{
          if (e.selectedRowKeys[0]){
            var ds = this.GridCol.getDataSource();
            _this.cfId = e.selectedRowKeys[0].id;
            ds.loadOptions().searchData = {cfId:e.selectedRowKeys[0].id};
            ds.reload();
          }
        },
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
          pageSize: 50
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText: '共{1}页/{2}数据',
        },
        searchPanel: {
          visible: true,
          placeholder: '查找',
          width: 200,
        },
        onOptionChanged:function(e){
          if(e.fullName == "searchPanel.text"){
            if(typeof (e.value) == 'string'){
              _this.windowGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
            }
          }
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
              if (options.data.status == 1) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认停用吗？',
                    id: {id: options.data.id, status: 0},
                    click: this.UpdateStatus
                  },
                ];
              } else {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    // tip: '您确认停用吗？',
                    id: {id: options.data.id, status: 1},
                    click: this.UpdateStatus
                  },
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100,
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width: 80
          },
          {
            caption: '名称',
            dataField: 'factName',
            minWidth: 100
          },
          {
            caption: '数据源',
            dataField: 'dsId',
            alignment: 'center',
            width: 100,
            lookup: {
              dataSource: this.dbListData,
              displayExpr: 'dsName',
              valueExpr: 'id'
            }
          },
          {
            caption: '交易参数',
            dataField: 'tparam',
            width: 80,
          },
          {
            caption: '交易代码',
            dataField: 'tcode',
            alignment: 'left',
            width: 180,
            // lookup: {
            //   dataSource: this.enum.tcode,
            //   displayExpr: 'text',
            //   valueExpr: 'id'
            // },
            cellTemplate: (container, options) => {
              let sss = `<p style=" max-width: 14em;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">`;
              try {
                if (!options.data.tcode) {
                  return;
                }
                for (let key in options.data.tcode) {
                  if (options.data.tcode[key] == 1) {
                    sss += `门诊挂号`
                  } else if (options.data.tcode[key] == ',') {
                    sss += `,`
                  } else if (options.data.tcode[key] == 2) {
                    sss += `门诊医嘱`
                  } else if (options.data.tcode[key] == 3) {
                    sss += `门诊结算`
                  } else if (options.data.tcode[key] == 4) {
                    sss += `住院登记`
                  } else if (options.data.tcode[key] == 5) {
                    sss += `住院医嘱`
                  } else if (options.data.tcode[key] == 6) {
                    sss += `住院结算`
                  }
                }
                sss += '</p>';
                let picText = "<div>" + sss + "</div>";
                container.append(picText);
              }
              catch (err) {
                alert(err) // 可执行
              }
            }
          },
          {
            caption: '备注',
            dataField: 'remark',
            width: 200
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
            width: 80
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
            width: 80
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
        {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addWindow},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;

      this.btnPartCol = new (Vue.component('CommandBtns'))();
      this.btnPartCol.items = [
        {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addWindowCol},
      ];
      this.btnPartCol.$mount('#btnCol');
      this.btnPartCol.$parent = this;
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

      addWindow: function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },

      edit: function (data) {
        this.modal.isNew = false;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editFormData = tempData;
        this.editFormData.tcodeTage = [];
        let tcodeTage = [];
        tcodeTage=this.editFormData.tcode.split(',');
        for (let key in tcodeTage) {
          this.editFormData.tcodeTage.push(Number(tcodeTage[key]));
        }
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      addWindowCol: function () {
        let _this = this;
        if(_this.windowGrid.getSelectedRowKeys().length <1)
        {
          _this.warn("请选择事件原型");
          return;
        }
        _this.modalCol.isNew = true;
        _this.editColFormData = {};
        _this.editColFormData.status = 1;
        _this.editColFormData.cfId = _this.windowGrid.getSelectedRowKeys()[0].id;
        _this.editColForm.option('formData', _this.editColFormData);
        _this.modalCol.visible = true;
      },

      editCol: function (data) {
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editColFormData = tempData;
        this.modalCol.isNew = false;
        this.editColForm.option('formData', this.editColFormData);
        this.modalCol.visible = true;
      },
      UpdateStatus: function (data) {
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
      UpdateStatusCol: function (data) {
        // let params = {};
        // params.id = data.id;
        this.$post(status_col_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.GridCol.refresh();
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

      editColFormCancel: function () {
        this.modalCol.visible = false;
      },
      formSubmit: function () {
        //let params = {};
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.editFormData.tcode=this.editFormData.tcodeTage.join(',');

        this.$post(window_insert_url, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.windowGrid.refresh();
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
      },

      formSubmitCol: function () {
        //let params = {};
        if (!this.editColForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalCol.modal_loading = false;
          return;
        }
        this.$post(window_insert_col_url, this.editColFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modalCol.modal_loading = false;
              this.modalCol.visible = false;
              this.GridCol.refresh();
            });
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modalCol.modal_loading = false;
      },

      //事件原型对象列查找
      colSearch: function () {
        var ds = this.GridCol.getDataSource();
        ds.loadOptions().searchData = this.searchColFormData;
        ds.loadOptions().searchData.cfId = this.cfId;
        ds.reload();
      },
      colResetSearch: function () {
        this.searchColForm.resetValues();
        this.GridCol.refresh();
      }
    }
  }
</script>
