<style lang="less">
  @import "../../../styles/common.less";

  .dropDownBtn button {
    float: right;
    margin: 5px;
  }
</style>
<template>
  <div>
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
          <div id="role-mgt-grid"></div>
        </Row>
      </Card>
      <Card dis-hover style="margin-top: 5px">
        <Row class="margin-top-10">
          <Tabs value="name1">
            <TabPane label="账户分配" name="name1">
              <div id="account-grid"></div>
            </TabPane>
            <TabPane label="权限分配" name="name2">
              <div id="authority-grid"></div>
            </TabPane>
          </Tabs>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑角色">
        <p slot="header">
          <span v-if="modal.isNew">新增角色</span>
          <span v-else="modal.isNew">编辑角色</span>
        </p>
        <div id="editForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
        </div>
      </Modal>
      <Modal v-model="modalAc.visible" :mask-closable="false" width="455" title="分配账号">
        <p slot="header">
          <span v-if="modalAc.isNew">分配账号</span>
        </p>
        <div id="accountForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormAcCancel">取消</Button>
          <Button type="primary" :loading="modalAc.modal_loading" @click="formAcSubmit">保存</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  let role_mgt_grid_url = 'sys/sysRole/selectByPage';
  let role_mgt_insert_url = 'sys/sysRole/saveByRole';
  let role_mgt_status_update_url = 'sys/sysRole/updateByStatus';
  let role_user_grid_url = 'sys/sysUserRole/selectByRoleOfUsers';

  let all_user_grid_url = 'sys/sysUser/selectList';
  let all_user_key_url = 'sys/sysUser/selectById';
  let all_user_insert_url = 'sys/sysUserRole/insertByRoleOfUser';

  let role_module_grid_url = 'sys/sysRoleModule/selectByRoleOfModule';

  let role_module_insert_url = 'sys/sysRoleModule/insertByRoleOfModule';

  let all_user_status_url = 'sys/sysUserRole/unBind';
  //科室管理
  let bd_dept_url = 'sys/bdDept/selectList';
  let bd_dept_detail_url = 'sys/bdDept/selectByMap';
  export default {
    name: "role-mgt",
    data() {
      return {
        isLoadData: {},
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        accountForm: {},
        accountFormData: {},
        acList: [],
        roleIds: null,
        moduleIds: [],

        modal: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        modalAc: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        roleMgtGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, role_mgt_grid_url, this.isLoadData, {}, this.roleMgtGrid);
          }
        }),
        authorityGrid: {},
        authorityGridData: new this.customstore({
          key: 'id',
          load: (loadOptions) => {
            return this.CommDs.loadList(role_module_grid_url,loadOptions.searchData);
          }
        }),

        accountGridData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            } else {
              return this.CommDs.loadPage(loadOptions, role_user_grid_url, this.isLoadData, {}, this.accountGrid);
            }
          }
        }),
        allUserGrid:{},
        allUserGridData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(all_user_key_url, {id: key});
          },
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              return this.CommDs.loadList(all_user_grid_url,{unallocated: 1, status: 1});
            }else{
              return this.CommDs.loadList(all_user_grid_url,loadOptions.searchData);
            }

          }
        }),

        //科室
        bdDeptData: new this.customstore({
          key: "id",
          byKey: (key) => {
            if (key == -1) {
              let deferred = $.Deferred();
              deferred.resolve({id: -1, dname: "所有科室"});
              return deferred.promise();
            } else {
              return this.CommDs.loadByKey(bd_dept_detail_url, {id: key});
            }
          },
          load: this.deptListData,
        }),
      }
    },
    mounted() {
      let _this = this;
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '角色名称',
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
              text: '角色编码'
            },
            editorOptions: {
              placeholder: '<系统自动生成>',
              disabled: true,
            }
          },
          {
            dataField: 'roleType',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.roleType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '角色类型'
            },
            validationRules: [{
              type: "required",
              message: "请选择状态"
            }]
          },
          {
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '角色名称'
            },
            editorOptions: {
              maxLength: 32
            },
            validationRules: [{
              type: "required",
              message: "请输入角色名称"
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
            colSpan: 2,
            rowSpan: 2,
            dataField: 'remark',
            label: {
              alignment: 'right',
              text: '备注',
            },
            editorOptions: {
              maxLength: 64,
            }
          }
        ]
      }).dxForm('instance');

      this.accountForm = $('#accountForm').dxForm({
        colCount: 1,
        formData: this.accountFormData,
        items: [
          {
            dataField: 'UserIds',
            label: {
              alignment: 'right',
              text: '选择账号'
            },
            editorType: "dxDropDownBox",
            editorOptions: {
              dropDownOptions: {width: 365, height: 300},
              placeholder: '选择账号',
              showClearButton: true,
              valueExpr: "id",
              displayExpr: "name",
              dataSource: this.allUserGridData,
              contentTemplate: (e) => {
                let el = $("<div class='dropDownBtn'>");
                let value = e.component.option('value');
                let grid = $('<div>').dxDataGrid({
                  keyExpr: "id",
                  showRowLines: true,
                  showBorders: true,
                  // wordWrapEnabled: true,
                  columnFixing: {
                    enabled: true
                  },
                  hoverStateEnabled: true,
                  remoteOperations: {
                    filtering: true,
                    sorting: true,
                    // paging: true,
                  },
                  paging: {
                    pageSize: 10,
                  },
                  dataSource: e.component.option('dataSource'),
                  columns: [
                    {
                      caption: '账号',
                      dataField: 'account',
                      width: 70
                    },
                    {
                      caption: '姓名',
                      dataField: 'name'
                    },
                    {
                      dataField: 'post',
                      caption: '岗位',
                      alignment: 'left',
                    },
                    {
                      caption: '科室',
                      dataField: 'deptId',
                      lookup: {
                        dataSource: this.bdDeptData,
                        displayExpr: 'dname',
                        valueExpr: 'id',
                      },
                    },
                  ],
                  searchPanel: {
                    visible: true,
                    placeholder: '查找',
                    width: '275',
                  },
                  onOptionChanged:function(e){
                    if(e.name == "searchPanel"){
                      if(typeof (e.value) == 'string'){
                        _this.allUserGrid.getDataSource().loadOptions().searchData = {keyword:e.value,unallocated: 1, status: 1};
                      }
                    }
                  },
                  selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: "always"
                  },
                  height:240,
                  selectedRowKeys: value,
                  // onSelectionChanged: (selectedItems) => {
                  //   let keys = selectedItems.selectedRowKeys;
                  //   _this.acList = keys;
                  //   e.component.option("value", keys);
                  // }
                });
                _this.allUserGrid = grid.dxDataGrid('instance');
                e.component.on("valueChanged", function (args) {
                  _this.allUserGrid.selectRows(args.value, false);
                });
                //追加网格和div
                el.append(grid);
                el.append('<div class=\'btnPart\' >');
                // let instance = grid.dxDataGrid('instance');
                //添加按钮组件
                let btnPartFrom = new (Vue.component('CommandBtns'))();
                btnPartFrom.items = [
                  {
                    id: 1, text: '添加', type: 'primary', enabled: true, click: function () {
                      let keys = _this.allUserGrid.getSelectedRowKeys();
                      e.component.option("value", keys);
                      _this.tag = _this.allUserGrid.getSelectedRowsData();
                      _this.dropDownHide();
                    }
                  },
                  {id: 2, text: '取消', type: 'text', enabled: true, click: this.dropDownHide},
                ];
                //延时挂载
                setTimeout(function () {
                  btnPartFrom.$mount('.btnPart');
                }, 100);
                return el;
              }
            },
            validationRules: [{
              type: "required",
              message: "请选择账号"
            }]
          },
        ]
      }).dxForm('instance');

      this.roleMgtGrid = $('#role-mgt-grid').dxDataGrid({
        showBorders: true,
        showRowLines: true,
        columnAutoWidth: true,
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
        onSelectionChanged: (e) => {
          if (e.selectedRowKeys[0]) {
            var ds = this.accountGrid.getDataSource();
            ds.loadOptions().searchData = {roleId: e.selectedRowKeys[0].id};
            _this.roleIds = e.selectedRowKeys[0].id;
            ds.reload();

            this.$put(role_module_grid_url, {roleId: e.selectedRowsData[0].id,}).then(res => {
              if (res.code == '200') {
                let ids = [];
                for (let key in res.rows) {
                  ids.push(res.rows[key].id);
                }
                this.authorityGrid.selectRows(ids, false);
              }
              else {
                this.warn(res.msg);
              }
            }).catch(err => {
              this.error(err);
            });
          }
        },
        dataSource: {
          store: this.roleMgtGridData,
        },
        columns: [
          {
            alignment: 'center',
            caption: '操作',
            cellTemplate: (container, options) => {
              container.append('<div id="t1"/>');
              var opcol = new (Vue.component('OpCol'));
              if (options.data.status == 1) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确定停用吗？',
                    id: {id: options.data.id, status: 0},
                    click: this.updateStatus
                  },
                ];
              } else if (options.data.status == 0 || options.data.status == null) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    id: {id: options.data.id, status: 1},
                    click: this.updateStatus
                  },
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100
          },
          {
            dataField: 'id',
            caption: '编码',
            alignment: 'right',
            width: 100,
          },
          {
            dataField: 'name',
            caption: '角色名称',
            alignment: 'left',
            minWidth: 130,
          },
          {
            dataField: 'roleType',
            caption: '角色类型',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.roleType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 100,
          },
          {
            dataField: 'createTime',
            caption: '创建时间',
            alignment: 'left',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 130
          },
          {
            dataField: 'updateTime',
            caption: '更新时间',
            alignment: 'left',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 130
          },
          {
            dataField: 'status',
            caption: '启用状态',
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
            width: 100,
          },
          {
            dataField: 'remark',
            caption: '备注',
            alignment: 'left',
          },
        ]
      }).dxDataGrid('instance');

      this.accountGrid = $('#account-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        //columnAutoWidth: true,
        wordWrapEnabled: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'
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
              _this.accountGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
            }
          }
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btnAccount\'/>');
            }
          })
        },
        dataSource: {
          store: this.accountGridData,
        },
        columns: [
          {
            alignment: 'center',
            caption: '操作',
            width: 80,
            cellTemplate: (container, options) => {
              container.append('<div id="t1"/>');
              var opcol = new (Vue.component('OpCol'));
              opcol.items = [
                {
                  text: '解绑',
                  color: '#ff9900',
                  showtip: true,
                  tip: '您确定解绑吗？',
                  id: {id: options.data.id, status: 0},
                  click: this.accountStatus
                },
              ];
              opcol.$mount('#t1');
            },
          },
          {
            dataField: 'account',
            caption: '账号',
            alignment: 'right',
            width: 130,
          },
          {
            dataField: 'name',
            caption: '账户姓名',
            alignment: 'left',
            minWidth: 130,
          },
          {
            dataField: 'post',
            caption: '岗位',
            alignment: 'left',
            width: 200,
          },
          {
            dataField: 'deptId',
            caption: '科室',
            width: 200,
            lookup: {
              dataSource: this.bdDeptData,
              displayExpr: 'dname',
              valueExpr: 'id',
            },
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
            width: 100,
          },

        ]
      }).dxDataGrid('instance');

      this.authorityGrid = $('#authority-grid').dxDataGrid({
        keyExpr: 'id',
        showBorders: true,
        showRowLines: true,
        columnAutoWidth: true,
        //wordWrapEnabled: true,
        columnFixing: {
          enabled: true
        },
        dataSource: {
          store: this.authorityGridData,
        },
        remoteOperations: {
          filtering: true,
          sorting: true,
          //paging: true,
        },
        paging: {
          pageSize: 10,
        },
        hoverStateEnabled: true,
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText: '共{1}页/{2}数据',
        },
        selection: {
          mode: 'multiple',
          showCheckBoxesMode: "always"
        },
        searchPanel: {
          visible: true,
          placeholder: '查找',
          width: 200,
        },
        onOptionChanged:function(e){
          if(e.name == "searchPanel"){
            if(typeof (e.value) == 'string'){
              _this.authorityGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
            }
          }
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btnSave\'/>');
            }
          })
        },

        onSelectionChanged: (selectedItems) => {
          let keys = selectedItems.selectedRowKeys;
          _this.moduleIds = keys;
        },
        columns: [
          {
            dataField: 'code',
            caption: '模块编码',
            alignment: 'left',
          },
          {
            dataField: 'name',
            caption: '模块名称',
            alignment: 'left',
          },
        ]
      }).dxDataGrid('instance');
      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增角色', type: 'primary', enabled: true, click: this.addRole},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;

      this.btnPartAc = new (Vue.component('CommandBtns'))();
      this.btnPartAc.items = [
        {id: 1, text: '分配账号', type: 'primary', enabled: true, click: this.accounts},
      ];
      this.btnPartAc.$mount('#btnAccount');
      this.btnPartAc.$parent = this;

      this.btnPartSave = new (Vue.component('CommandBtns'))();
      this.btnPartSave.items = [
        {id: 1, text: '保存权限', type: 'primary', enabled: true, click: this.save},
      ];
      this.btnPartSave.$mount('#btnSave');
      this.btnPartSave.$parent = this;
    },
    methods: {
      dropDownHide: function () {
        this.accountForm.getEditor("UserIds").close();
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
      //查找
      search: function () {
        var ds = this.roleMgtGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      //重置
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateTime = null;
        this.searchForm.resetValues();
        this.roleMgtGrid.refresh();
      },
      //更改角色状态
      updateStatus: function (data) {
        this.$post(role_mgt_status_update_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.roleMgtGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      accountStatus: function (data) {
        let params = {};
        params.id = data.id;
        this.$post(all_user_status_url, params).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.accountGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //编辑
      edit: function (data) {
        this.modal.isNew = true;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editFormData = tempData;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      //新增角色
      addRole: function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      //取消保存编辑或新增
      editFormCancel: function () {
        this.modal.visible = false;
      },
      //保存编辑或新增
      formSubmit: function () {
        let params = this.editFormData;
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        };
        this.$post(role_mgt_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.roleMgtGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modal.modal_loading = false;
      },

      //分配账号
      accounts: function () {
        if (this.roleMgtGrid.getSelectedRowKeys().length < 1) {
          this.warn("请选择角色");
          return;
        }
        if (this.allUserGrid.refresh) {
          this.allUserGrid.refresh();
        }
        this.modalAc.isNew = true;
        this.accountFormData = {};
        this.accountFormData.id = this.roleIds;
        this.accountForm.option('formData', this.accountFormData);
        this.modalAc.visible = true;
      },
      //取消分配账号
      editFormAcCancel: function () {
        this.modalAc.visible = false;
      },
      //保存分配账号
      formAcSubmit: function () {
        let params = this.accountFormData;
        this.$put(all_user_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modalAc.modal_loading = false;
              this.modalAc.visible = false;
              this.accountGrid.refresh();
            });
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modalAc.modal_loading = false;
      },
      //保存权限
      save: function () {
        let params = {};
        if (this.roleIds == null) {
          this.warn('请选择角色');
        } else {
          params.moduleIds = this.moduleIds;
          params.id = this.roleIds;
          this.$put(role_module_insert_url, params).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.authorityGrid.refresh();
              });
            }
            else {
              //提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        }
      },

      deptListData: function () {
        var deferred = $.Deferred(),
          params = {};
        this.$put(bd_dept_url, params).then(res => {
          if (res.code == '200') {
            res.rows.unshift({id: -1, dname: "所有科室"});
            deferred.resolve({data: res.rows, totalCount: res.rows.length});
          }
          else {
            var msg = getmsg(res);
            //提示信息
            this.warn(res.msg);
            console.warn(msg);
            deferred.resolve([], {
              totalCount: 0
            });
          }
        }).catch(err => {
          deferred.resolve([], {
            totalCount: 0
          });
          this.error(err);
        });
        return deferred.promise();
      },
    },
  }
</script>

<style scoped>

</style>
