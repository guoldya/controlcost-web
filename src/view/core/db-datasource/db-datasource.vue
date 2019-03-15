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
        <div id="source-grid"></div>
      </Row>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增数据源定义</span>
        <span v-else="modal.isNew">编辑数据源定义</span>
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
  import {Message} from 'iview';

  let source_grid_url = 'sys/coreDbDatasource/selectByPage';
  let source_insert_url = 'sys/coreDbDatasource/updateOrInsert';
  let status_url = 'sys/coreDbDatasource/updateStatus';
  let db_test_url = 'sys/coreDbDatasource/checkByClassDriverNameOrId';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
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
          modal_loading: false
        },
        sourceGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, source_grid_url, this.isLoadData, {}, this.sourceGrid);
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
      }
    },
    mounted() {
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'dsName',
            label: {
              alignment: 'right',
              text: '数据源名称'
            },
            editorOptions: {
              maxLength:20
            }
          },
          {
            dataField: 'driverClass',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.driverClassName,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '驱动名称'
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
              text: '编码'
            },
            editorOptions: {
              placeholder: '<系统自动生成>',
              disabled: true,
            }
          },
          {itemType:"empty"},

          {
            dataField: 'dsName',
            label: {
              alignment: 'right',
              text: '名称'
            },
            editorOptions: {
              maxLength: 10,
              onValueChanged:(e)=>{
              }
            },
            validationRules: [{
              type: "required",
              message: "请输入名称",
            }]
          },
          {
            dataField: 'driverClass',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '驱动名称'
            },
            editorOptions: {
              dataSource: this.enum.driverClassName,
              displayExpr: 'text',
              valueExpr: 'id',
              placeholder:"请选择驱动名称",
            },
            validationRules: [{
              type: "required",
              message: "请选择驱动名称"
            }]
          },
          {
            dataField: 'url',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '数据库连接'
            },
            editorOptions: {
              maxLength: 128
            },
            validationRules: [{
              type: "required",
              message: "请输入数据库连接"
            }]
          },
          {
            dataField: 'username',
            label: {
              alignment: 'right',
              text: '账号'
            },
            editorOptions: {
              maxLength: 16
            },
            validationRules: [{
              type: "required",
              message: "请输入账号"
            },{
              type: "pattern",
              message: "请输入正确名称",
              pattern: "^\\S+$",}]
          },
          {
            dataField: 'password',
            label: {
              alignment: 'right',
              text: '密码'
            },
            // editorOptions: {
            //   maxLength: 16
            // },
            editorOptions:{
              maxLength: 16,
              mode: "password"
            },
            validationRules: [{
              type: "required",
              message: "请输入密码"
            }]
          },
          {
            dataField: 'initialsize',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '初始大小'
            },
            editorOptions: {
              min: 0,
              max: 10000
            },
            validationRules: [{
              type: "required",
              message: "请输入初始大小"
            }]
          },
          {
            dataField: 'maxactive',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '最大活跃'
            },
            editorOptions: {
              min: 0,
              max: 10000
            },
            validationRules: [{
              type: "required",
              message: "请输入最大活跃"
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
          {
            dataField: 'testSql',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '验证查询'
            },
            editorOptions: {
              maxLength: 50
            },
            validationRules: [{
              type: "required",
              message: "请输入验证查询"
            }]
          },
        ]
      }).dxForm('instance');

      this.sourceGrid = $('#source-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        //wordWrapEnabled: true,
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
          store: this.sourceGridData
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
                  {text: '测试', showtip: false, id: options.data, click: this.dbtest},
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
                  {text: '测试', showtip: false, id: options.data, click: this.dbtest},
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
            width: 130,
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width: 80
          },
          {
            caption: '名称',
            dataField: 'dsName',
            width:100
          },
          {
            caption: '驱动名称',
            dataField: 'driverClass',
            minWidth: 130
          },
          // {
          //   caption: '数据库连接',
          //   dataField: 'url',
          // },
          // {
          //   caption: '密码',
          //   dataField: 'password',
          //   width:80
          // },
          {
            caption: '初始大小',
            dataField: 'initialsize',
            width: 80
          },
          {
            caption: '最大活跃',
            dataField: 'maxactive',
            width: 80
          },
          {
            caption: '验证查询',
            dataField: 'testSql',
            width:230
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
            width:100
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
        {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addSource},
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
        var ds = this.sourceGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },

      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateTime = [];
        this.searchForm.resetValues();
        this.sourceGrid.refresh();
      },

      addSource: function () {
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
        // this.editFormData = data;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      dbtest: function (data) {
        this.$put(db_test_url, data).then(res => {
          if (res.code == '200') {
            // this.success('成功!', () => {
            //   this.sourceGrid.refresh();
            // });
            this.success(res.msg);
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          Message.error({content: this.getMsg(err), duration: 5});
        });
      },
      getMsg: function (e) {
        var msg = '';
        if (e.hasOwnProperty("message")) {
          msg = e.message;
        }
        else if (e.hasOwnProperty('data')) {
          msg = e.data.msg;
        }
        else
          msg = e;
        return msg;
      },
      UpdateStatus: function (data) {
        // let params = {};
        // params.id = data.id;
        this.$post(status_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.sourceGrid.refresh();
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
        let params = this.editFormData;
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(source_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.sourceGrid.refresh();
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
