<style lang="less">
  @import "../../../styles/common.less";
</style>

<template>
  <div>
    <Card dis-hover>
      <Row>
        <Col span="8">
          <Card dis-hover style="margin-right: 5px">
            <p slot="title">总额信息</p>
            <Row class="margin-top-5">
              <div id="total-info"></div>
            </Row>
          </Card>
        </Col>
        <Col span="16">
          <Card dis-hover>
            <p slot="title">科室总额管理</p>
            <Row class="margin-top-5">
              <div id="total-info-manage"></div>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">添加{{list.insFeeType | insFeeType_if}}科室总额</span>
          <span v-else="modal.isNew">科室总额编辑({{list.insFeeType | insFeeType_if}}+{{list.planYears}}年)</span>
        </p>
        <div id="editForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import Vue from 'vue';
  import qs from 'qs';

  let total_info_url = 'sys/coreBdLs/selectByPage';
  let total_info_manage_url = 'sys/coreBdLsDept/selectByPage';
  let total_update_status_url = 'sys/coreBdLsDept/updateStatus';
  let dept_insert_url='sys/coreBdLsDept/updateByModel';
  let dept_list_url='sys/bdDept/selectList';
  let dept_url='sys/bdDept/selectByMap';
    export default {
      data() {
        return {
          isLoadData: true,
          editForm: {},
          editFormData: {},
          insFeeType:this.insFeeType,
          list:{},
          modal: {
            isNew: false,
            visible: false,
            modal_loading: false
          },
          totalInfoData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions,total_info_url,this.isLoadData, {}, this.totalInfo);
            },
          }),
          totalInfoManageData: new this.customstore({
            load: (loadOptions) => {
              if(loadOptions.searchData==null)
              {
                var deferred = $.Deferred();
                return deferred.resolve([], {totalCount: 0});
              }else {
                return this.CommDs.loadPage(loadOptions, total_info_manage_url, this.isLoadData, {}, this.totalInfoManage);
              }
            },
          }),
          deptData: new this.customstore({
            key: "id",
            byKey: (key) => {
              return this.CommDs.loadByKey(dept_url, {id: key});
            },
            load: (e) =>{
              return this.CommDs.loadList(dept_list_url);
            }
          }),
        }
      },
      filters: {
        //  险种类別
        insFeeType_if:function(value){
          if(value=="-1"){
            return "所有类型"
          }else if(value=="1"){
            return "医疗保险"
          }else if(value=="2"){
            return "工伤保险"
          }else if(value=="3"){
            return "生育保险"
          }
        }
      },
      mounted(){
        let _this = this;
        this.totalInfo= $('#total-info').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          columnFixing: {
            enabled: true
          },
          searchPanel: {
            visible: true,
            width: 230,
            placeholder: '险种类別|年份',
          },
          onOptionChanged:function(e){
            if(e.name =="searchPanel"){
              if(typeof (e.value) == 'string'){
                _this.totalInfo.getDataSource().loadOptions().searchData = {keyword:e.value};
                // _this.allUserGrid.refresh();
              }
            }
          },
          selection: {
            mode: 'single'
          },
          hoverStateEnabled: true,
          onSelectionChanged:(e)=>{
            var ds = this.totalInfoManage.getDataSource();
            ds.loadOptions().searchData = {lsId:e.selectedRowKeys[0].id};
            this.list=e.selectedRowsData[0];
            ds.reload();
          },
          dataSource: {
            store: this.totalInfoData,
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true
          },
          paging: {
            pageSize: 10
          },
          columns: [
            {
              dataField: 'insFeeType',
              caption: '险种类別',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.dxInsCls,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              minWidth:120
            },
            {
              dataField: 'planYears',
              caption: '年份',
              alignment: 'left',
              width:140,
            },
          ]
        }).dxDataGrid('instance');
        this.totalInfoManage = $('#total-info-manage').dxDataGrid({
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
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText:"共{1}页/{2}条数据",
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
            store: this.totalInfoManageData,
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
              dataField: 'deptId',
              caption: '科室',
              lookup: {
                dataSource: this.deptData,
                displayExpr: 'dname',
                valueExpr: 'id',
              },
              minWidth:100
            },
            {
              dataField: 'scope',
              caption: '来源类型',
              alignment:"center",
              lookup: {
                dataSource: this.enum.dxScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100,
            },
            {
              dataField: 'planNum',
              caption: '年计划额',
              alignment: 'right',
              width:120,
              cellTemplate:(container,options) => {
                let number = Math.floor(options.data.planNum * 100) / 100;
                container.append("<span>"+parseFloat(number)+"</span>");
              }
            },
            {
              dataField: 'planNumWarn',
              caption: '年警示额',
              alignment: 'right',
              width:120,
              cellTemplate:(container,options) => {
                let number = Math.floor(options.data.planNumWarn * 100) / 100;
                container.append("<span>"+parseFloat(number)+"</span>");
              }
            },
            {
              dataField: 'planPeople',
              caption: '年计划人数',
              alignment: 'right',
              width:120,
            },
            {
              dataField: 'planPeopleWarn',
              caption: '年度警示人数',
              alignment: 'right',
              width:120,
            },
            {
              dataField: 'controlState',
              caption: '控制方式',
              alignment:"center",
              lookup: {
                dataSource: this.enum.controlState,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100,
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
              width:80,
            },
            // {
            //   dataField: 'remark',
            //   caption: '备注',
            //   alignment:"left",
            //   editorType: 'dxTextArea',
            //   minWidth:140,
            //   editorOptions: {
            //     height: 80,
            //     maxLength:64
            //   },
            // },
          ]
        }).dxDataGrid('instance');
        this.editForm = $('#editForm').dxForm({
          colCount: 2,
          formData: this.editFormData,
          items: [
            {
              dataField: 'scope',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'center',
                text: '来源类型',
              },
              editorOptions: {
                placeholder: '请选择来源类型',
                dataSource: this.enum.dxScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请选择来源类型"
              }]
            },
            {
              dataField: 'deptId',
              label: {
                alignment: 'right',
                text:'科室',
              },
              editorType: "dxSelectBox",
              editorOptions: {
                placeholder: '请选择科室',
                dataSource: this.deptData,
                valueExpr: 'id',
                displayExpr: 'dname',
              },
              validationRules: [{
                type: "required",
                message: "请选择科室"
              }]
            },
            {
              dataField: 'planNum',
              label: {
                alignment: 'right',
                text: '年计划额'
              },
              editorType: 'dxNumberBox',
              editorOptions: {
                min: 0,
                max: 100000000000
              },
              validationRules: [{
                type: "required",
                message: "请输入年计划额"
              }]
            },
            {
              dataField: 'planNumWarn',
              label: {
                alignment: 'right',
                text: '年警示额'
              },
              editorType: 'dxNumberBox',
              editorOptions: {
                min: 0,
                max: 100000000000
              },
              validationRules: [{
                type: "required",
                message: "请输入年警示额"
              }]
            },
            {
              dataField: 'planPeople',
              label: {
                alignment: 'right',
                text: '年计划人数'
              },
              editorType: 'dxNumberBox',
              editorOptions: {
                min: 0,
                max: 100000000000
              },
              validationRules: [{
                type: "required",
                message: "请输入年计划人数"
              }]
            },
            {
              dataField: 'planPeopleWarn',
              label: {
                alignment: 'right',
                text: '年警示人数'
              },
              editorType: 'dxNumberBox',
              editorOptions: {
                min: 0,
                max: 100000000000
              },
              validationRules: [{
                type: "required",
                message: "请输入年警示人数"
              }]
            },
            {
              dataField: 'controlState',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'center',
                text: '控制方式',
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.controlState,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "请输入控制方式"
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
            },
            // {
            //   dataField: 'remark',
            //   colSpan: 2,
            //   editorType: 'dxTextArea',
            //   label: {
            //     alignment: 'right',
            //     text: '备注'
            //   },
            //   editorOptions: {
            //     height: 80,
            //     maxLength:64
            //   },
            // },
          ]
        }).dxForm('instance');
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '添加科室', type: 'primary', enabled: true, click: this.addWindow},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods:{
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
        addWindow: function () {
          if(this.totalInfo.getSelectedRowKeys().length <1)
          {
            this.warn("请选择险种类別");
            return;
          }
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          //this.editFormData.lsId = this.totalInfo.getSelectedRowKeys()[0].id;
          this.editFormData.lsId = this.totalInfo.getSelectedRowKeys()[0].id;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
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
          this.$post(dept_insert_url, this.editFormData).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.totalInfoManage.refresh();
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
        updateStatus: function (data) {
          this.$post(total_update_status_url,data).then(res => {
            if (res.code == '200'){
              this.success('成功', () => {
                this.totalInfoManage.refresh();
              })
            } else {
              this.warn(res.msg);
            }
          }).catch( err => {
            this.error(err);
          });
        },
    }
    }
</script>


