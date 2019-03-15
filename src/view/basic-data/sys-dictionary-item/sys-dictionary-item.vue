<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
    <div>
      <Row>
        <Col span="12" style="padding-right: 5px">
          <Card dis-hover>
            <p slot="title">基础字典数据类型</p>
            <Row class="margin-top-10">
              <div id="dictionary-type-grid"></div>
            </Row>
          </Card>
        </Col>
        <Col span="12">
          <Card dis-hover>
            <p slot="title">基础字典数据表</p>
            <Row class="margin-top-10">
              <div id="dictionary-item-grid"></div>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增基础字典类型</span>
          <span v-else="modal.isNew">编辑基础字典类型</span>
        </p>
        <div id="editForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
        </div>
      </Modal>

      <Modal v-model="modalItem.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modalItem.isNew">新增基础字典</span>
          <span v-else="modalItem.isNew">编辑基础字典</span>
        </p>
        <div id="editItemForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormItemCancel">取消</Button>
          <Button type="primary" :loading="modalItem.modal_loading" @click="formItemSubmit">保存</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import Vue from 'vue';
  let dictionary_type_grid_url = 'sys/sysDictionaryType/selectByPage';
  let dictionary_type_updateStatus_url = 'sys/sysDictionaryType/updateStatus';
  let dictionary_type_update_url = 'sys/sysDictionaryType/updateById';
  let dictionary_item_grid_url = 'sys/sysDictionaryItem/selectByPage';
  let dictionary_item_update_url ='sys/sysDictionaryItem/updateById';
  let dictionary_item_updateStatus_url = 'sys/sysDictionaryItem/updateStatus';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
    export default {
        name: "sys-dictionary-item",
      data() {
          return {
            isLoadData: true,
            searchForm: {},
            searchFormData: {},
            editForm: {},
            editFormData: {},
            editItemForm: {},
            editItemFormData: {},
            modal: {
              isNew: true,
              visible: false,
              modal_loading: false
            },
            modalItem: {
              isNew: true,
              visible: false,
              modal_loading: false,
            },
            dictionaryTypeGridData: new this.customstore({
              load: (loadOptions) =>{
                return this.CommDs.loadPage(loadOptions, dictionary_type_grid_url, this.isLoadData, {}, this.dictionaryTypeGrid);
              }
            }),
            dictionaryItemGridData: new this.customstore({
              load: (loadOptions) =>{
                if (loadOptions.searchData == null){
                  let deferred = $.Deferred();
                 return deferred.resolve([], {totalCount: 0 });
                }else {
                  return this.CommDs.loadPage(loadOptions,dictionary_item_grid_url,this.isLoadData, {},this.dictionaryItemGrid);
                }
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
          this.editForm  = $('#editForm').dxForm({
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
              {
                dataField: 'itemNo',
                label: {
                  alignment: 'right',
                  text: '序号'
                },
                editorType: "dxNumberBox",
                editorOptions: {
                  maxLength: 5
                },
                validationRules: [{
                  type: "required",
                  message: "请输入序号"
                }]
              },
              {
                dataField: 'name',
                label: {
                  alignment: 'right',
                  text: '字典名称'
                },
                editorOptions: {
                  maxLength: 20
                },
                validationRules: [{
                  type: "required",
                  message: "请输入字典名称"
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

          this.editItemForm = $('#editItemForm').dxForm({
            colCount: 2,
            formData: this.editItemFormData,
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
              {
                dataField: 'itemNo',
                label: {
                  alignment: 'right',
                  text: '序号',
                },
                editorOptions: {
                  maxLength: 5
                },
                editorType: "dxNumberBox",
              },
              {
                dataField: 'dataValue',
                label: {
                  alignment: 'right',
                  text: '字典值'
                },
                editorOptions: {
                  maxLength: 32
                },
                validationRules: [{
                  type: "required",
                  message: "请输入字典值"
                }]
              },
              {
                dataField: 'dataName',
                label: {
                  alignment: 'right',
                  text: '字典名称'
                },
                editorOptions: {
                  maxLength: 32
                },
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

          this.dictionaryTypeGrid = $('#dictionary-type-grid').dxDataGrid({
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            hoverStateEnabled: true,
            //wordWrapEnabled: true,
            columnFixing: {
              enabled: true
            },
            selection: {
              mode: 'single'
            },
            onToolbarPreparing: (e) => {
              e.toolbarOptions.items.unshift({
                location: "before",
                template: () => {
                  return $('<div id=\'btn\'/>');
                }
              });
            },
            hoverStateEnabled: true,
            onSelectionChanged:(e)=>{
              if (e.selectedRowKeys[0]) {
                var ds = this.dictionaryItemGrid.getDataSource();
                ds.loadOptions().searchData = {sdtId:e.selectedRowKeys[0].id};
                ds.reload();
              }
            },
            dataSource: {
              store: this.dictionaryTypeGridData,
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
              infoText: '共{1}页/{2}数据',
            },
            searchPanel: {
              visible: true,
              placeholder: '查找',
              width: 200,
            },
            onOptionChanged:function(e){
              if(e.name == "searchPanel"){
                if(typeof (e.value) == 'string'){
                  _this.dictionaryTypeGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
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
              },
              {
                caption: '编码',
                dataField: 'id',
                alignment: 'right',
                width:70
              },
              {
                caption: '序号',
                dataField: 'itemNo',
                alignment: 'right',
                width:70
              },
              {
                caption: '字典名称',
                dataField: 'name',
                minWidth:120
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
                width:80
              },
              {
                caption: '创建时间',
                dataField: 'createTime',
                alignment: 'left',
                dataType: "datetime",
                format: "yyyy-MM-dd HH:mm",
                width:110
              },
              {
                caption: '更新人',
                dataField: 'updateBy',
                lookup: {
                  dataSource:this.userData,
                  displayExpr: 'name',
                  valueExpr: 'id',
                },
                width:80
              },
              {
                caption: '更新时间',
                dataField: 'updateTime',
                alignment: 'left',
                dataType: "datetime",
                format: "yyyy-MM-dd HH:mm",
                width:110
              },

            ]
          }).dxDataGrid('instance');

          this.dictionaryItemGrid = $('#dictionary-item-grid').dxDataGrid({
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            //wordWrapEnabled: true,
            hoverStateEnabled: true,
            columnFixing: {
              enabled: true
            },
            selection: {
              mode: 'single'
            },
            dataSource: {
              store: this.dictionaryItemGridData,
            },
            remoteOperations: {
              filtering: true,
              sorting: true,
              paging: true
            },
            pager: {
              showPageSizeSelector: true,
              allowedPageSizes: [10, 20, 50],
              showInfo: true,
              infoText: '共{1}页/{2}数据',
            },
            paging: {
              pageSize: 10
            },
            onToolbarPreparing: (e) => {
              e.toolbarOptions.items.unshift({
                location: "before",
                template: () => {
                  return $('<div id=\'btnItem\'/>');
                }
              });
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
                      {text: '编辑', showtip: false, id: options.data, click: this.editItem},
                      {
                        text: '停用',
                        color: '#ff9900',
                        showtip: true,
                        tip: '您确认停用吗？',
                        id: {id: options.data.id, status: 0},
                        click: this.UpdateStatusItem
                      },
                    ];
                  } else {
                    opcol.items = [
                      {text: '编辑', showtip: false, id: options.data, click: this.editItem},
                      {
                        text: '启用',
                        color: '#52c41a',
                        showtip: false,
                        // tip: '您确认停用吗？',
                        id: {id: options.data.id, status: 1},
                        click: this.UpdateStatusItem
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
                width: 80,
              },
              {
                caption:'分类编码',
                dataField: 'sdtId',
                alignment: 'right',
                width: 80,
              },
              {
                caption: '序号',
                dataField: 'itemNo',
                width: 70,
              },
              {
                caption: '字典值',
                dataField: 'dataValue',
                alignment: 'left',
              },
              {
                caption: '字典名称',
                dataField: 'dataName',
                minWidth: 130,
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
                width: 100,
              },
              {
                caption: '创建时间',
                dataField: 'createTime',
                alignment: 'left',
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
                width:100
              },
              {
                caption: '更新时间',
                dataField: 'updateTime',
                alignment: 'left',
                dataType: "datetime",
                format: "yyyy-MM-dd HH:mm",
                width: 110,
              },

            ]

          }).dxDataGrid('instance');

        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addDictionaryType},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;

        this.btnPartCol = new (Vue.component('CommandBtns'))();
        this.btnPartCol.items = [
          {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addDictionaryItem},
        ];
        this.btnPartCol.$mount('#btnItem');
        this.btnPartCol.$parent = this;
      },
      methods: {
        //增加字典类型
        addDictionaryType: function () {
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        //字典类型编辑
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
        //字典类型更新状态
        UpdateStatus: function (data) {
          this.$post(dictionary_type_updateStatus_url, data).then(res => {
            if (res.code == '200') {
              this.success('成功!', () => {
                this.dictionaryTypeGrid.refresh();
              });
            } else {
              // 提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        },
        //字典类型编辑取消
        editFormCancel: function(){
          this.modal.visible = false;
        },
        //字典类型提交
        formSubmit: function() {
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          };
          this.$put(dictionary_type_update_url, this.editFormData).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.dictionaryTypeGrid.refresh();
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
        addDictionaryItem: function () {
          if(this.dictionaryTypeGrid.getSelectedRowKeys().length <1)
          {
            this.warn("请选择基础字典数据类型");
            return;
          }
          this.modalItem.isNew = true;
          this.editItemFormData = {};
          this.editItemFormData.status = 1;
          this.editItemFormData.sdtId = this.dictionaryTypeGrid.getSelectedRowKeys()[0].id;
          this.editItemForm.option('formData', this.editItemFormData);
          this.modalItem.visible = true;
        },
        editItem: function (data) {
          this.modalItem.isNew = false;
          let editItemData={};
          for (let key in data)
          {
            editItemData[key]=data[key];
          }
          this.editItemFormData = editItemData;
          this.editItemForm.option('formData', this.editItemFormData);
          this.modalItem.visible = true;
        },
        UpdateStatusItem: function (data) {
          this.$post(dictionary_item_updateStatus_url, data).then(res => {
            if (res.code == '200') {
              this.success('成功!', () => {
                this.dictionaryItemGrid.refresh();
              });
            } else {
              // 提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        },
        editFormItemCancel: function () {
          this.modalItem.visible = false;
        },
        formItemSubmit: function () {
          if (!this.editItemForm.validate().isValid) {
            this.warn('信息不完整');
            this.modalItem.modal_loading = false;
            return;
          };
          this.$put(dictionary_item_update_url, this.editItemFormData).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modalItem.modal_loading = false;
                this.modalItem.visible = false;
                this.dictionaryItemGrid.refresh();
              });
            }
            else {
              //提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
          this.modalItem.modal_loading = false;
        }
      }

    }
</script>
