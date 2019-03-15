<style lang="less">
  @import "../../../../styles/common.less";
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
      <Card dis-hover style="margin-top: 5px">
        <div id="target-manage" ></div>
      </Card>
      <Card dis-hover style="margin-top: 5px">
        <div id="target-rule-manage"></div>
      </Card>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增指标</span>
        <span v-else="modal.isNew">编辑指标</span>
      </p>
      <div id="editForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Vue from 'vue';

  let target_manage_url = 'sys/coreBdIndicator/selectPage';
  let target_rule_manage_url = 'sys/coreRule/selectMultipleList';
  //提交与状态更新
  let target_manage_insert_url = 'sys/coreBdIndicator/insertByEntity';
  //关联规则表
  let relative_rule_url='sys/coreBdIndicator/selectByiIdOrRuleList';
  let insert_rule_url='sys/coreBdIndicatorRules/insertByVo';
    export default {
      data() {
        return {
          isLoadData: true,
          searchForm: {},
          searchFormData: {},
          editForm: {},
          editFormData: {},
          rule:{},
          iId:null,
          modal: {
            visible: false,
            modal_loading: false,
            isNew: true,
          },
          targetManageData: new this.customstore({
            key: "id",
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, target_manage_url, this.isLoadData, {}, this.targetManage);
            },
          }),
          // targetRuleManageData: new this.customstore({
          //   key: "id",
          //   load: (loadOptions) => {
          //     return this.CommDs.loadPage(loadOptions, target_rule_manage_url, this.isLoadData, {}, this.targetRuleManage);
          //   },
          // }),
          targetRuleManageData: new this.customstore({
            key: 'id',
            load: (loadOptions) =>{
              return this.CommDs.loadList(target_rule_manage_url,loadOptions.searchData);
            }
          }),
        }
      },
      mounted(){
        let _this=this;
        this.searchForm = $('#searchForm').dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'name',
              label: {
                alignment: 'right',
                text: '指标名称',
              },
            },
            {
              dataField: 'iteype',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'right',
                text: '指标类型',
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.itype,
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
        this.targetManage = $('#target-manage').dxDataGrid({
          keyExpr:"id",
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
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText: '共{1}页/{2}数据',
          },
          paging: {
            pageSize: 10,
          },
          selection: {
            mode: 'single',
          },
          onSelectionChanged:(e)=>{
            if(e.selectedRowsData[0]==null){return;}
            this.$put(relative_rule_url,{iId:e.selectedRowsData[0].id}).then(res => {
              if (res.code == '200') {
                let rows=[];
                for (let  key in res.rows)
                {
                  if(res.rows[key])
                  {
                    rows.push(res.rows[key].id);
                  }
                }
                this.targetRuleManage.selectRows(rows, false);
              }
              else {this.warn(res.msg);}
            }).catch(err => {this.error(err);});
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
            store: this.targetManageData,
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
                    // {text: '删除', color: '#ff9900', showtip: true, tip:'您确定删除吗？', id:{id:options.data.id,status:0},click:this.del},
                    {
                      text: '停用',
                      color: '#ff9900',
                      showtip: true,
                      tip: '您确认停用吗？',
                      id: {id: options.data.id, status: 0},
                      click: this.UpdateStatus
                    },
                  ];
                }else if(options.data.status == 0 || options.data.status == null){
                  opcol.items = [
                    {text: '编辑', showtip: false, id:options.data, click: this.edit},
                    // {text: '删除', color: '#52c41a', showtip: false, id:{id:options.data.id,status:1},click:this.del},
                    {
                      text: '启用',
                      color: '#52c41a',
                      showtip: false,
                      // tip: '您确认启用吗？',
                      id: {id: options.data.id, status: 1},
                      click: this.UpdateStatus
                    },
                  ];
                }
                opcol.$mount('#t1');
              },
            },
            {
              dataField: 'id',
              caption: '编码',
              width:80,
              alignment: 'right',
            },
            {
              dataField: 'name',
              caption: '指标名称',
              minWidth:150,
              alignment: 'left',
            },
            {
              dataField: 'remark',
              caption: '指标描述',
              alignment: 'left',
              minWidth:150,
            },
            {
              dataField: 'iteype',
              caption: '指标类型',
              alignment: 'center',
              width:80,
              lookup: {
                dataSource: this.enum.itype,
                displayExpr: 'text',
                valueExpr: 'id',
              },
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
            {
              caption: '更新时间',
              dataField: 'updateTime',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width: 110
            },
          ]
        }).dxDataGrid('instance');
        this.targetRuleManage=$('#target-rule-manage').dxDataGrid({
          keyExpr:"id",
          showBorders: true,
          showRowLines: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          hoverStateEnabled: true,
          columnFixing: {
            enabled: true
          },
          remoteOperations: {
            filtering: true,
            // sorting: true,
            //paging: true,
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
          onToolbarPreparing: (e) => {
            e.toolbarOptions.items.unshift({
              location: "before",
              template: () => {
                return $('<div id=\'btnRule\'/>');
              }
            })
          },
          searchPanel: {
            visible: true,
            width: 230,
            placeholder: '查找',
          },
          onOptionChanged:function(e){
            if(e.name = "searchPanel"){
              if(typeof (e.value) == 'string'){
                _this.targetRuleManage.getDataSource().loadOptions().searchData = {keyword:e.value};
              }
            }
          },
          dataSource: {
            store: this.targetRuleManageData,
          },
          selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
          },
          columns: [
            {
              dataField: 'id',
              caption: '规则编码',
              alignment: 'right',
            },
            {
              dataField: 'name',
              caption: '规则名称',
              alignment: 'left',
            },
          ]
        }).dxDataGrid('instance');
        this.editForm = $('#editForm').dxForm({
          colCount: 2,
          formData: this.editFormData,
          items: [
            {
              dataField: 'id',
              label: {
                alignment: 'right',
                text: '指标编码'
              },
              editorOptions: {
                placeholder: '<系统自动生成>',
                disabled: true,
              }
            },
            {
              dataField: 'name',
              label: {
                alignment: 'center',
                text: '指标名称'
              },
              editorOptions: {
                maxLength:32
              },
              validationRules: [{
                type: "required",
                message: "指标名称"
              }]
            },
            {
              dataField: 'iteype',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'center',
                text: '指标类型',
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.itype,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              validationRules: [{
                type: "required",
                message: "指标类型"
              }]
            },
            {
              dataField: 'status',
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder:"请选择",
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
              dataField: 'remark',
              colSpan: 2,
              editorType: 'dxTextArea',
              label: {
                alignment: 'right',
                text: '备注'
              },
              editorOptions: {
                height: 80,
                maxLength:64
              },
            },
          ]
        }).dxForm('instance');
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '新增指标', type: 'primary', enabled: true, click: this.addTarget},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;

        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '关联规则', type: 'primary', enabled: true, click: this.relativeRule},
        ];
        this.btnPart.$mount('#btnRule');
        this.btnPart.$parent = this;
      },
      methods:{
        edit: function (data) {
          this.modal.isNew = false;
          this.editFormData = data;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        search:function(){
          var ds = this.targetManage.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
        },
        resetSearch:function(){
          this.searchFormData.updateDate = '';
          this.searchForm.resetValues();
          this.targetManage.refresh();
        },
        addTarget: function () {
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        //关联规则
        relativeRule:function(){
          let ruleKeyList=[];
          let Keys=this.targetRuleManage.getSelectedRowKeys();
          let  ManageKeys= this.targetManage.getSelectedRowKeys();
          if (Keys.length <1){
            this.modal.visible = false;
            this.warn('请勾选规则');
            return;
          }
          if (ManageKeys.length <1){
            this.modal.visible = false;
            this.warn('请选择指标');

          }
            else {
            for (let key in Keys)
            {
              ruleKeyList .push({
                //iId:ManageKeys[0].id,
                 rulesId:Keys[key]
              });
            }
            this.$put(insert_rule_url,{
              id:ManageKeys[0],
              coreBdIndicatorRules:ruleKeyList
              //coreBdIndicatorRules:Keys
            }).then(res => {
              if (res.code == '200') {
                this.success('保存成功!', () => {
                  this.modal.modal_loading = false;
                  this.modal.visible = false;
                  this.targetRuleManage.refresh();
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
        editFormCancel: function () {
          this.modal.visible = false;
        },
        formSubmit: function () {
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          }
          this.$post(target_manage_insert_url, this.editFormData).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.targetManage.refresh();
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
        UpdateStatus: function (data) {
          // let params = {};
          // params.id = data.id;
          this.$post(target_manage_insert_url, data).then(res => {
            if (res.code == '200') {
              this.success('成功!', () => {
                this.targetManage.refresh();
              });
            } else {
              // 提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        },
        del:function(){},
      }
    }
</script>


