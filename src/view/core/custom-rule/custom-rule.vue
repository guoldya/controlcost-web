<template>
  <div>
    <Card dis-hover>
      <Row >
        <Searchpanel ref="searchPanel">
          <div slot="form" class="margin-bottom-3" id="searchForm">
          </div>
          <div slot="control">
            <Button size="small" type="primary" @click="search">查询</Button>
            <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
          </div>
        </Searchpanel>
      </Row>
      <Row>
        <Col class="margin-top-5">
          <Card dis-hover>
            <div id="rule-table"></div>
          </Card>
        </Col>
      </Row>
    </Card>
    <Modal v-model="modalRule.visible" :mask-closable="false" width="850" title="编辑数据">
      <p slot="header">
        <span v-if="modalRule.isNew">新增规则</span>
        <span v-else="modalRule.isNew">编辑【{{this.ruleName}}】-规则</span>
      </p>
      <Row>
        <Col span="24">
          <div id="ruleEditForm"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="ruleEditFormCancel">取消</Button>
        <Button type="primary" :loading="modalRule.modal_loading" @click="ruleFormSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Vue from 'vue';

  let rule_table_url='sys/coreRule/selectSinglePage';
  let rule_insert_url='sys/coreRule/updateOrInsert';
  let status_rule_url='sys/coreRule/updateByStatus';

  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    data(){
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        ruleEditForm: {},
        ruleEditFormData: {},
        ruleName:null,
        modalRule: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        ruleTableData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              loadOptions.searchData = {cfsId:-999};
            }
              return this.CommDs.loadPage(loadOptions, rule_table_url, this.isLoadData, {}, this.ruleTable);
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
    mounted(){
      let _this=this;
      this.searchForm=$("#searchForm").dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'name',
            editorOptions: {
              placeholder: '请输入规则名称',
            },
            label: {
              alignment: 'right',
              text: '规则名称'
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
            dataField: 'createBy',
            label: {
              alignment: 'right',
              text: '创建时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');
      this.ruleTable = $('#rule-table').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        //wordWrapEnabled: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'
        },
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 20, 50],
          showInfo: true,
          infoText: '共{1}页/{2}数据',
        },
        hoverStateEnabled: true,
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btnRule\'/>');
            }
          });
        },
        dataSource: {
          store: this.ruleTableData
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
            caption: '操作',
            alignment: 'center',
            allowResizing: false,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: (container, options) => {
              //操作列
              container.append('<div id=\'t1\'/>');

              var opcol = new (Vue.component('OpCol'));
              if(options.data.status == 1){
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.ruleEdit},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认停用吗？',
                    id: {id:options.data.id,status:0},
                    click: this.UpdateRuleStatus
                  },
                ];
              }else{
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.ruleEdit},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    // tip: '您确认停用吗？',
                    id: {id:options.data.id,status:1},
                    click: this.UpdateRuleStatus
                  },
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100,
          },
          {
            dataField: 'id',
            caption: '编码',
            width:100,
            alignment: 'right',
          },
          {
            dataField: 'name',
            caption: '规则名称',
            width:140,
            alignment: 'left',
          },
          {
            dataField: 'message',
            caption: '提示消息',
            width:220,
            alignment: 'left',
          },
          {
            dataField: 'no',
            caption: '提示顺序',
            width:80,
            alignment: 'right',
          },
          {
            dataField: 'rule',
            caption: '规则',
            width:140,
            alignment: 'left',
          },
          {
            dataField: 'remark',
            caption: '备注',
            minWidth:160,
            alignment: 'left',
          },
          {
            dataField: 'controlState',
            caption: '控制规则',
            alignment: 'center',
            width:100,
            lookup: {
              dataSource: this.enum.controlRule,
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
            caption:'创建人',
            dataField: 'createBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width:80
          },
          {
            caption:'创建时间',
            dataField: 'createTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width:110
          },
          {
            caption:'更新人',
            dataField: 'updateBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width:80
          },
          {
            caption:'更新时间',
            dataField: 'updateTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width:110
          },
        ],
      }).dxDataGrid('instance');
      this.ruleEditForm = $('#ruleEditForm').dxForm({
        colCount: 2,
        formData: this.ruleEditFormData,
        items: [
          {
            dataField:'name',
            label: {
              alignment: 'right',
              text:'规则名称',
            },
            validationRules: [{
              type: "required",
              message: "请选择规则名称"
            }],
            editorOptions:{
              maxLength: 32
            },
          },
          {
            dataField: 'controlState',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'center',
              text: '控制规则',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择控制规则"
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
            dataField:'no',
            editorType: "dxNumberBox",
            label: {
              alignment: 'right',
              text:'提示顺序',
            },
            editorOptions:{
              min:0,
              max: 100
            },
          },
          {
            dataField:'message',
            colSpan:2,
            label: {
              alignment: 'right',
              text:'提示消息',
            },
            editorOptions:{
              maxLength: 64
            },
          },
          {
            dataField:'rule',
            colSpan:2,
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text:'规则',
            },
            editorOptions:{
              height:60
            },
            validationRules: [{
              type: "required",
              message: "请输入规则"
            }],
          },
          {
            dataField:'remark',
            colSpan:2,
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text:'备注',
            },
            editorOptions:{
              maxLength:64,
              height:60
            },
          },
        ],
      }).dxForm('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增规则', type: 'primary', enabled: true, click: this.addRule},
      ];
      this.btnPart.$mount('#btnRule');
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
      search:function(){
        var ds = this.ruleTable.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.loadOptions().searchData.cfsId = -999;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.createBy = '';
        this.searchForm.resetValues();
        this.ruleTable.refresh();
      },
      addRule: function () {
        this.modalRule.isNew = true;
        this.ruleEditFormData={};
        this.ruleEditFormData.status = 1;
        this.ruleEditForm.option('formData', this.ruleEditFormData);
        this.modalRule.visible = true;
      },
      ruleEdit:function(data){
        let _this=this;
        this.modalRule.isNew = false;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.ruleEditFormData = tempData;
        this.ruleName=this.ruleEditFormData.name;
        this.ruleEditForm.option('formData', this.ruleEditFormData);
        this.modalRule.visible = true;
      },
      UpdateRuleStatus: function (data){
        this.$post(status_rule_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.ruleTable.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      ruleEditFormCancel: function () {
        this.modalRule.visible = false;
      },
      ruleFormSubmit: function () {
        if (!this.ruleEditForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalRule.modal_loading = false;
          return;
        }
        this.ruleEditFormData.cfsId=-999;
        this.$post(rule_insert_url, this.ruleEditFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modalRule.modal_loading = false;
              this.modalRule.visible=false;
              this.ruleTable.refresh();
            });
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
    }
  }
</script>

<style scoped>

</style>
