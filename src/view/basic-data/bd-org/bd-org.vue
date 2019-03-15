<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Row>
      <Card dis-hover>
        <p slot="title">医疗机构维护</p>
        <Row>
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
          <div id="bd-org-grid"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增医疗机构</span>
          <span v-else="modal.isNew">编辑医疗机构</span>
        </p>
        <div id="editForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';

  let bd_org_grid_url = 'sys/bdOrg/selectByPage';
  let bd_org_update_url = 'sys/bdOrg/updateByModel';
  let bd_org_updateStatus_url = 'sys/bdOrg/updateStatus';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    name: "bd-org",
    data() {
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        modal: {
          visible: false,
          modal_loading: false,
          isNew: true,
        },
        bdOrgGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, bd_org_grid_url, this.isLoadData, {}, this.bdOrgGrid);
          }
        }),
        sysBdOrgListData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(sys_bdOrg_map_url, {id: key, status: 1});
          },
          load: (e) => {
            return this.CommDs.loadList(sys_bdOrg_list_url, {status: 1});
          }
        }),
        userData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(sys_user_select_url, {id: key});
          },
          load: (e) => {
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
            dataField: 'oname',
            label: {
              alignment: 'right',
              text: '医疗机构名称',
            }
          },
          {
            dataField: 'tel',
            label: {
              alignment: 'right',
              text: '联系电话',
            }
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
          },
          {
            dataField: 'updateTime',
            label: {
              alignment: 'right',
              text: '更新时间',
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
              disabled: true,
            }
          },
          {
            dataField: 'contacts',
            label: {
              alignment: 'right',
              text: '联系人',
            },
            editorOptions: {
              maxLength: 32
            },
            validationRules: [{
              type: "required",
              message: "请输入联系人",
            }],
          },
          {
            dataField: 'ocode',
            label: {
              alignment: 'right',
              text: '医疗机构编码',
            },
            editorOptions: {
              maxLength: 4,
            },
            validationRules: [{
              type: "required",
              message: "请输医疗机构编码",
            }],
          },
          {
            dataField: 'oname',
            label: {
              alignment: 'right',
              text: '医疗机构名称',
            },
            editorOptions: {
              maxLength: 32,
            },
            validationRules: [{
              type: "required",
              message: "请输名称",
            }],
          },
          {
            dataField: 'tel',
            label: {
              alignment: 'right',
              text: '联系电话',
            },
            editorOptions: {
              maxLength: 11
            },
            validationRules: [{
              type: "pattern",
              pattern: "^1[3584679]\\d{9}$",
              message: "请输入正确的联系电话!"
            }, {
              type: "required",
              message: "请输入联系电话"
            }]
          },
          {
            dataField: 'level',
            label: {
              alignment: 'right',
              text: '医院等级',
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.hospitalLevel,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择医院等级",
            }],
          },
          {
            dataField: 'addr',
            label: {
              alignment: 'right',
              text: '地址',
            },
            editorOptions: {
              maxLength: 128
            },
            validationRules: [{
              type: "required",
              message: "请输入地址",
            }],
          },
          {
            dataField: 'cls',
            label: {
              alignment: 'right',
              text: '医院分类',
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.hospitalCls,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择医院分类",
            }],
          },
          {
            dataField: 'spellCode',
            editorOptions: {
              maxLength: 32
            },
            label: {
              alignment: 'right',
              text: '拼音码',
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
          {
            colSpan: 2,
            editorType: "dxTextArea",
            dataField: 'remark',
            editorOptions: {
              maxLength: 64
            },
            label: {
              alignment: 'right',
              text: '备注',
            }
          },
        ],
      }).dxForm('instance');

      this.bdOrgGrid = $('#bd-org-grid').dxDataGrid({
        showBorders: true,
        showRowLines: true,
        columnAutoWidth: true,
        hoverStateEnabled: true,
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
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText: '共{1}页/{2}数据',
        },
        selection: {
          mode: 'single',
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          })
        },
        dataSource: {
          store: this.bdOrgGridData,
        },
        columns: [
          // {
          //   caption: '操作',
          //   alignment: 'center',
          //   cellTemplate: (container, options) => {
          //     container.append('<div id="t1"/>');
          //     var opcol = new (Vue.component('OpCol'));
          //     if (options.data.status == 1) {
          //       opcol.items = [
          //         {text: '编辑', showtip: false, id: options.data, click: this.edit},
          //         {
          //           text: '停用',
          //           color: '#ff9900',
          //           showtip: true,
          //           tip: '您确定停用吗？',
          //           id: {id: options.data.id, status: 0},
          //           click: this.updateStatus
          //         },
          //       ];
          //     } else if (options.data.status == 0 || options.data.status == null) {
          //       opcol.items = [
          //         {text: '编辑', showtip: false, id: options.data, click: this.edit},
          //         {
          //           text: '启用',
          //           color: '#52c41a',
          //           showtip: false,
          //           id: {id: options.data.id, status: 1},
          //           click: this.updateStatus
          //         },
          //       ];
          //     }
          //     opcol.$mount('#t1');
          //   },
          //   width: 100
          // },
          {
            dataField: 'id',
            caption: '编码',
            alignment: 'right',
            width: 80
          },
          {
            dataField: 'ocode',
            caption: '医疗机构代码',
            alignment: 'right',
            width: 100
          },
          {
            dataField: 'oname',
            caption: '医疗机构名称',
            minWidth: 130
          },
          {
            dataField: 'contacts',
            caption: '联系人',
            width: 130
          },
          {
            dataField: 'tel',
            caption: '联系电话',
            alignment: 'right',
            width: 100
          },
          {
            dataField: 'addr',
            caption: '联系地址',
            width: 200
          },
          {
            dataField: 'spellCode',
            caption: '拼音码',
            width: 150
          },
          {
            dataField: 'cls',
            caption: '医院分类',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.hospitalCls,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 130
          },
          {
            dataField: 'level',
            caption: '医院等级',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.hospitalLevel,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 100
          },
          {
            dataField: 'remark',
            caption: '备注',
            width: 200
          },
          {
            dataField: 'status',
            caption: '状态',
            alignment: 'center',
            cellTemplate: (container, options) => {
              container.append("<div id='badge'/>");
              var badgeStatus = new (Vue.component('BadgeStatus'));
              badgeStatus.dataSource = this.enum.status;
              badgeStatus.displayExpr = 'text';
              badgeStatus.valueExpr = 'id';
              badgeStatus.value = options.data.status;
              badgeStatus.$mount('#badge');
            },
            width: 50
          },
          {
            dataField: 'createBy',
            caption: '创建人',
            lookup: {
              dataSource: this.userData,
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
              dataSource: this.userData,
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

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        // {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addBdOrg},
        {id: 1, text: '同步', type: 'primary', enabled: true,click: this.addBdOrg},
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
        var ds = this.bdOrgGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateTime = [];
        this.searchForm.resetValues();
        this.bdOrgGrid.refresh();
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
        this.$post(bd_org_updateStatus_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.bdOrgGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //增加医疗机构代字典码
      addBdOrg: function () {
        // this.modal.isNew = true;
        // this.editFormData = {};
        // this.editFormData.status = 1;
        // this.editForm.option('formData', this.editFormData);
        // this.modal.visible = true;
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
        this.$post(bd_org_update_url, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.bdOrgGrid.refresh();
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
    },
  }
</script>

