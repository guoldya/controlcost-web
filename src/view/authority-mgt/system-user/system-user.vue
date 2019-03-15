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
          <div id="system-user-grid"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增系统用户</span>
          <span v-else="modal.isNew">编辑系统用户</span>
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
  let systemUser_grid_url ='sys/sysUser/selectByPage';
  let systemUser_update_url ='sys/sysUser/updateByModel';
  let systemUser_updateStatus_url = 'sys/sysUser/updateByStatus';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  //科室管理
  let bd_dept_url = 'sys/bdDept/selectList';
  let bd_dept_detail_url = 'sys/bdDept/selectByMap';
    export default {
      data() {
        return {
          isLoadData: true,
          searchFrom: {},
          searchFormData: {},
          password:'',
          modal: {
            isNew: true,
            visible: false,
            modal_loading: false,
          },
          systemUserGridData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, systemUser_grid_url, this.isLoadData, {}, this.systemUserGrid);
            }
          }),
          sysBdOrgListData: new this.customstore({
            key: "ocode",
            byKey: (key) => {
              return this.CommDs.loadByKey(sys_bdOrg_map_url, { ocode:  key,status:1 });
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
          //科室
          bdDeptData: new this.customstore({
            key: "id",
            byKey: (key) => {
              return this.CommDs.loadByKey(bd_dept_detail_url, {id: key});
            },
            load: (e) => {
              return this.CommDs.loadList(bd_dept_url);
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
              dataField: 'account',
              label: {
                alignment: 'right',
                text: '账号',
              },
            },
            {
              dataField: 'name',
              label: {
                alignment: 'right',
                text: '姓名',
              }
            },
            {
              dataField: 'mobile',
              label: {
                alignment: 'right',
                text: '手机',
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
        this.systemUserGrid = $('#system-user-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          hoverStateEnabled: true,
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
          dataSource: this.systemUserGridData,
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
              width:80
            },
            {
              dataField: 'id',
              caption: '编码',
              alignment: 'right',
              width: 80
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
              dataField: 'account',
              caption: '账号',
              alignment: 'left',
              width: 130,
            },
            {
              dataField: 'name',
              caption: '姓名',
              alignment: 'left',
              minWidth: 130
            },
            {
              dataField: 'deptId',
              caption: '科室',
              lookup: {
                dataSource: this.bdDeptData,
                displayExpr: 'dname',
                valueExpr: 'id',
              },
              width:100
            },
            {
              dataField: 'post',
              caption: '岗位',
              alignment: 'left',
              width: 130
            },
            {
              dataField: 'job',
              caption: '人员职务',
              alignment: 'left',
              width: 130
            },
            {
              dataField: 'title',
              caption: '人员职称',
              alignment: 'left',
              width: 130
            },
            {
              dataField: 'natureWork',
              caption: '工作性质',
              lookup: {
                dataSource: this.enum.natureWork,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100
            },
            {
              dataField: 'email',
              caption: '邮箱',
              alignment: 'left',
              width: 130
            },
            {
              dataField: 'mobile',
              caption: '手机',
              alignment: 'right',
              width: 100
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
              width:80
            },
            {
              dataField: 'createBy',
              caption: '创建人',
              lookup: {
                dataSource:this.userData,
                displayExpr: 'name',
                valueExpr: 'id',
              },
              width:80
            },
            {
              dataField: 'createTime',
              caption: '创建时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:110
            },
            {
              dataField: 'updateBy',
              caption: '更新人',
              lookup: {
                dataSource:this.userData,
                displayExpr: 'name',
                valueExpr: 'id',
              },
              width:80
            },
            {
              dataField: 'updateTime',
              caption: '更新时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:110
            },
          ],
        }).dxDataGrid('instance');
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
              editorType:'dxSelectBox',
              label: {
                alignment: 'right',
                text: '医疗机构名称'
              },
              editorOptions:{
                dataSource:this.sysBdOrgListData,
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
              dataField: 'account',
              label: {
                alignment: 'right',
                text: '账号',
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [
                {
                type: "required",
                message: "请输入账号",
              },
                {
                  type:'pattern',
                  pattern:'^\\S+$',
                  message:'请输入正确账号'
                },
                {
                  type:'pattern',
                  pattern:'^[^\u4e00-\u9fa5]{0,}$',
                  message:'请输入正确账号'
                }
              ],
            },
            {
              dataField: 'name',
              label: {
                alignment: 'right',
                text: '姓名',
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [{
                type: "required",
                message: "请输入姓名",
              }],
            },
            {
              dataField: 'deptId',
              label: {
                alignment: 'right',
                text: '科室',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                visible: true,
                placeholder: '请选择',
                dataSource: this.bdDeptData,
                displayExpr: 'dname',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请选择科室",
              }],
            },
            {
              dataField: 'post',
              label: {
                alignment: 'right',
                text: '岗位',
              },
              editorOptions: {
                maxLength: 16,
              },
            },
            {
              dataField: 'job',
              label: {
                alignment: 'right',
                text: '人员职务',
              },
              editorOptions: {
                maxLength: 32,
              },
            },
            {
              dataField: 'title',
              label: {
                alignment: 'right',
                text: '人员职称',
              },
              editorOptions: {
                maxLength: 32,
              },
            },
            {
              dataField: 'pass',
              label: {
                alignment: 'right',
                text: '密码',
              },
              editorOptions: {
                maxLength: 32,
                mode: "password"
              },
              validationRules: [{
                type: "required",
                message: "请输入密码",
              }],
            },
            {
              dataField: 'email',
              label: {
                alignment: 'right',
                text: '邮箱',
              },
              editorOptions: {
                maxLength: 32,
              },
            },
            {
              dataField: 'mobile',
             // editorType: "dxNumberBox",
              editorOptions: {
                maxLength: 11,
              },
              label: {
                alignment: 'right',
                text: '手机',
              },
              validationRules: [{
                type: "pattern",
                pattern: "^1[3584679]\\d{9}$",
                message: "请输入正确的手机号!"
              }, {
                type: "required",
                message: "请输入手机号"
              }]
            },
            {
              dataField: 'natureWork',
              label: {
                alignment: 'right',
                text: '工作性质',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.natureWork,
                displayExpr: 'text',
                valueExpr: 'id',
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
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addSystemUser},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods: {
        search: function () {
          var ds = this.systemUserGrid.getDataSource();
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
          this.systemUserGrid.refresh();
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
        edit: function (data) {
          this.password = data.pass;
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
          this.$post(systemUser_updateStatus_url,data).then(res => {
            if (res.code == '200'){
              this.success('成功', () => {
                this.systemUserGrid.refresh();
              })
            } else {
              this.warn(res.msg);
            }
          }).catch( err => {
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
          };
          if (this.password == this.editFormData.pass){
            delete params.pass;
          }
          this.$post(systemUser_update_url,params).then( res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.systemUserGrid.refresh();
              });
            } else {
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
          this.modal.modal_loading = false;
        },
        addSystemUser: function () {
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        }
      }
    }
</script>

