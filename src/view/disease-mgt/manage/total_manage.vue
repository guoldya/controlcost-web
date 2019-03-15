<style lang="less">
  @import "../../../styles/common.less";
</style>

<template>
  <div>
    <Row>
      <Card dis-hover>
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
          <div id="total-manage"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增总额</span>
          <span v-else="modal.isNew">编辑</span>
        </p>
        <div id="editForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">提交</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';

  let total_manage_url = 'sys/coreBdLs/selectByPage';
  let total_dept_manage_url = 'sys/coreBdLsDept/selectByPage';
  let manage_insert_url='sys/coreBdLs/updateByModel';
  let manage_status_update_url = 'sys/coreBdLs/updateStatus';
  export default {
    data() {
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        deptStatus:[],
        modal: {
          visible: false,
          modal_loading: false,
          isNew: true,
        },
        totalManage:{},
        totalManageData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, total_manage_url, this.isLoadData, {}, this.totalManage);
          },
        }),
      }
    },
    mounted(){
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'insFeeType',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '险种类別',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.dxInsCls,
              displayExpr: 'text',
              valueExpr: 'id',
            },
          },
          {
            dataField: 'planYears',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '年份',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.getYear(),
              displayExpr: 'text',
              valueExpr: 'id',
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
          },
        ]
      }).dxForm('instance');
      this.totalManage = $('#total-manage').dxDataGrid({
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
          store: this.totalManageData,
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
              }else if(options.data.status == 3){
                opcol.items = [
                  {text: '编辑', showtip: false, id:options.data, click: this.edit},
                ];
              }
              opcol.$mount('#t1');
            },
          },
          {
            dataField: 'insFeeType',
            caption: '险种类別',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.dxInsCls,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width:130,
          },
          {
            dataField: 'planYears',
            caption: '年份',
            width:120,
            alignment: 'left',
          },
          {
            dataField: 'planNum',
            caption: '年计划额',
            alignment: 'right',
            minWidth:120,
            cellTemplate:(container,options) => {
              let number = Math.floor(options.data.planNum * 100) / 100;
              container.append("<span>"+parseFloat(number)+"</span>");
            }
          },

          {
            dataField: 'planNumWarn',
            caption: '年警示额',
            alignment: 'right',
            minWidth:120,
            cellTemplate:(container,options) => {
              let number = Math.floor(options.data.planNumWarn * 100) / 100;
              container.append("<span>"+parseFloat(number)+"</span>");
            }
          },
          {
            dataField: 'planPeople',
            caption: '年度计划人数',
            alignment: 'right',
            minWidth:120,
          },

          {
            dataField: 'planPeopleWarn',
            caption: '年度警示人数',
            alignment: 'right',
            minWidth:120,
          },
          {
            dataField: 'controlState',
            caption: '控制方式',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width:180,
          },
          {
            caption: '状态',
            alignment: 'center',
            dataField: 'status',
            width:80,
            cellTemplate: (container, options) => {
              container.append("<div id='badge'/>");
              var badgeStatus = new (Vue.component('BadgeStatus'));
              badgeStatus.dataSource = this.enum.status;
              badgeStatus.displayExpr = 'text';
              badgeStatus.valueExpr = 'id';
              badgeStatus.value = options.data.status;
              badgeStatus.$mount('#badge');
            },
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
      //添加
      this.editForm = $('#editForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'insFeeType',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'center',
              text: '险种类別',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.dxInsCls,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择险种类別"
            }]
          },
          {
            dataField: 'planYears',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '年份',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.getYear(),
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择年份"
            }]
          },
          {
            dataField: 'planNum',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '年计划额'
            },
            editorOptions: {
              min: 0,
              max: 2147483647
            },
            validationRules: [{
              type: "required",
              message: "请输入年计划额"
            }]
          },
          {
            dataField: 'planNumWarn',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '年警示额'
            },
            editorOptions: {
              min: 0,
              max: 2147483647
            },
            validationRules: [{
              type: "required",
              message: "请输入年警示额"
            }]
          },
          {
            dataField: 'planPeople',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '年计划人数'
            },
            editorOptions: {
              min: 0,
              max: 2147483647
            },
            validationRules: [{
              type: "required",
              message: "请输入年计划人数"
            }]
          },
          {
            dataField: 'planPeopleWarn',
            editorType: 'dxNumberBox',
            label: {
              alignment: 'right',
              text: '年警示人数'
            },
            editorOptions: {
              min: 0,
              max: 2147483647
            },
            validationRules: [{
              type: "required",
              message: "请输入年警示人数"
            }]
          },
          {
            dataField: 'controlState',
            label: {
              alignment: 'center',
              text: '控制方式'
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择控制方式',
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width:160,
            validationRules: [{
              type: "required",
              message: "请选择控制方式"
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
        ]
      }).dxForm('instance');
      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '添加', type: 'primary', enabled: true, click: this.addWindow},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;
    },
    methods:{
      getYear(){
        let date=new Date();
        let year=date.getFullYear();
        let yearArray=[];
        for(let i=7;i>0;i--){
          yearArray.push({
            "id":year-i,
            "text":year-i,
          });
        }
        for(let i=0;i<=7;i++){
          yearArray.push({
            "id":year+i,
            "text":year+i,
          });
        };
        let len = yearArray.length;
        for (let j = 0; j < len; j++) {
          for (let k = 0; k < len - 1 - j; k++) {
            if (yearArray[k] > yearArray[k+1]) {        //相邻元素两两对比
              let temp = arr[k+1];        //元素交换
              yearArray[k+1] = yearArray[k];
              yearArray[k] = temp;
            }
          }
        }
        return yearArray;
      },
      search: function () {
        var ds = this.totalManage.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      resetSearch: function () {
        this.searchFormData.updateDate = '';
        this.searchForm.resetValues();
        this.totalManage.refresh();
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
        this.$post(manage_insert_url, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.totalManage.refresh();
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
        this.$post(manage_status_update_url,data).then(res => {
          if (res.code == '200'){
            this.success('成功', () => {
              this.totalManage.refresh();
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

