<style scoped>
  @import "../../../styles/common.less";
</style>

<template>
  <div>
    <Row>
      <Col span="8">
        <Card dis-hover style="margin-right: 5px">
          <Row >
            <Searchpanel ref="searchPanel">
              <div slot="form" class="margin-bottom-3" id="searchForm">
              </div>
            </Searchpanel>
          </Row>
          <Row class="margin-top-5">
            <div id="window-spec"></div>
          </Row>
        </Card>
      </Col>
      <Col span="16">
        <Card dis-hover>
          <Row>
            <Col>
              <Card dis-hover>
                <p slot="title">
                  主题
                </p>
                <div id="fact-theme"></div>
              </Card>
            </Col>
            <Col class="margin-top-5">
              <Card dis-hover>
                <p slot="title">
                  规则
                </p>
                <div id="rule-table"></div>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">【{{this.name}}】主题维护</span>
        <span v-else="modal.isNew">编辑【{{this.subName}}】主题</span>
      </p>
      <Row>
        <Col span="24">
          <div id="themeEditForm"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="themeEditFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="themeFormSubmit">提交</Button>
      </div>
    </Modal>
    <Modal v-model="modalRule.visible" @on-cancel="cancel" :mask-closable="false" width="850" title="编辑数据">
      <p slot="header">
        <span v-if="modalRule.isNew">主题【{{this.themeName}}】新增规则</span>
        <span v-else="modalRule.isNew">编辑【{{this.ruleName}}】规则</span>
      </p>
      <Row>
        <Col span="24">
          <div id="ruleEditForm"></div>
          <div v-model="modalField.add" >

            <Card dis-hover style="margin-top: 12px;" :padding=0>
              <p slot="title">限定条件</p>
              <div slot="extra">
                <a  href="#"   @click="addField">新增字段</a>
                <a  href="#"  style="margin-left: 10px;color: #333;" @click="generateRules">生成规则</a>
              </div>
              <Tabs value="name1">
                <TabPane label="限定条件" name="name1">

                  <div v-for="(item,i) in ColFieldArry" style="margin-left: 16px;margin-bottom: 16px;">
                    <div v-if="item.assertType==1" style="margin-top:12px;">
                      <Row>
                        <Col span="6" style="text-align: right;width: 240px;">{{item.name}}：</Col>
                        <Col span="3" >
                          <Select transfer v-model="item.calculate"  style="width:80px;" size="small">
                            <Option v-for="item in calculate" :value="item.id" :key="item.id">{{ item.text }}</Option>
                          </Select>
                        </Col>
                        <Col span="10">
                          <Input v-model="item.assertVal" style="width: 140px" size="small"/>
                        </Col>
                        <Col span="2">
                          <a @click="fieldDel({i})">删除</a>
                        </Col>
                      </Row>
                    </div>
                    <div v-if="item.assertType==2" style="margin-top:12px;">
                      <Row>
                        <Col span="6" style="text-align: right;width: 240px">{{item.name}}：</Col>
                        <Col span="3" >
                          <Select transfer v-model="item.calculate"  style="width:80px" size="small">
                            <Option v-for="item in calculate" :value="item.id" :key="item.id">{{ item.text }}</Option>
                          </Select>
                        </Col>
                        <Col span="10">
                          <Select transfer v-model="item.assertVal" style="width:140px" size="small">
                            <Option v-for="arryitem in item.dataArry" :value="arryitem.key" :key="arryitem.key">{{ arryitem.value }}</Option>
                          </Select>
                        </Col>
                        <Col span="2">
                          <a @click="fieldDel({i})">删除</a>
                        </Col>
                      </Row>
                    </div>
                    <div v-if="item.assertType==3" style="margin-top:12px;">
                      <Row >
                        <Col span="6" style="text-align: right;width: 240px">{{item.name}}：</Col>
                        <Col span="3" >
                          <Select transfer v-model="item.calculate"  style="width:80px" size="small">
                            <Option v-for="item in calculate" :value="item.id" :key="item.id">{{ item.text }}</Option>
                          </Select>
                        </Col>
                        <Col span="10">
                          <InputNumber v-model="item.assertVal" style="width:140px" size="small"  ></InputNumber>
                          ~
                          <InputNumber v-model="item.assertVal2" style="width:140px" size="small"  ></InputNumber>
                        </Col>
                        <Col span="2">
                          <a @click="fieldDel({i})">删除</a>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="规则语句" name="name2">
                  <MonacoEditor
                    height="100"
                    language="sql"
                    theme="vs"
                    :code="code"
                    :editorOptions="options" ref="monacoEditor" >
                  </MonacoEditor>
                </TabPane>
              </Tabs>
            </Card>

          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="ruleEditFormCancel">取消</Button>
        <Button type="primary" :loading="modalRule.modal_loading" @click="ruleFormSubmit">提交</Button>
      </div>
    </Modal>
    <Modal v-model="modalField.visible" @on-cancel="cancel" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span>字段选择</span>
      </p>
      <Row>
        <Col span="24">
          <div id="addFieldForm" ></div>
          <div id="breakSource" class="margin-top-10"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="FieldFormCancel">取消</Button>
        <Button type="primary" :loading="modalRule.modal_loading" @click="FieldFormConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Vue from 'vue';
  import MonacoEditor from 'vue-monaco-editor'

  let window_spec_url = 'sys/coreFact/selectBySubType';
  let fact_theme_url = 'sys/coreFactSubject/selectByPage';
  let rule_table_url='sys/coreRule/selectByPage';
  //模板选择
  let temp_select_url='sys/coreFactSubject/selectOneById';
  let temp_select_list_url='sys/coreFactSubject/selectByTemplate';
  let rule_temp_list_url='sys/coreRule/selectList';
  let rule_temp_url='sys/coreRule/selectByMap';

  let fact_theme_insert_url='sys/coreFactSubject/updateOrInsert';
  let rule_insert_url='sys/coreRule/insertToRuleAndColSpec';
  let rule_activity_url='sys/coreRuleDatasource/multipleDataSource';
  let field_id_url='sys/coreRuleColSpec/selectRuleAndCol';

  let status_theme_url='sys/coreFactSubject/updateByStatus';
  let status_rule_url='sys/coreRule/updateByStatus';

  //事实原型
  let core_fact_list_url='sys/coreFact/selectIdNameList';
  let core_fact_url='sys/coreFact/selectByMap';

  let field_word_list_url='sys/coreFactCol/selectListByCfId';
  let field_word_url='sys/coreFactCol/selectByMap';
  let field_format_list_url='sys/coreFactColFormat/selectListByCfType';
  let field_format_url='sys/coreFactColFormat/selectByMap';
  let field_break_list_url='sys/coreRuleDatasource/selectList';
  let field_break_url='sys/coreRuleDatasource/selectByMap';
  let generate_rules='sys/coreRule/generateRules';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    data(){
      return {
        code: '',
        options: {
          selectOnLineNumbers: false,
          wordWrap: "on",   //自动换行，注意大小写
        },
        addTemplateData:{},
        isLoadData: true,
        themeValue:null,
        ruleValue:null,
        factIds:null,
        searchForm: {},
        searchFormData: {subType:1},
        themeEditForm: {},
        themeEditFormData: {},
        ruleEditForm: {},
        ruleEditFormData: {},
        addFieldForm:{},
        addFieldFormData:{},
        formatType:{},
        ColFieldArry:[],
        name:null,
        subName:null,
        ruleName:null,
        themeName:null,
        selectWord:"",
        dataArry:[],
        defaultData:[],
        compactId:null,
        createType:1,
        calculate: this.enum.calculate,
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        modalRule: {
          isNew: true,
          visible: false,
          modal_loading: false
        },
        modalField:{
          add:false,
          isNew: true,
          visible: false,
          modal_loading: false
        },
        windowSpecData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, window_spec_url, this.isLoadData, {}, this.windowSpec);
          },
        }),
        factThemeData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null){
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0 });
            }else {
              return this.CommDs.loadPage(loadOptions, fact_theme_url, this.isLoadData, {}, this.factTheme);
            }
          }
        }),
        ruleTableData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null){
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0 });
            }else {
              return this.CommDs.loadPage(loadOptions, rule_table_url, this.isLoadData, {}, this.ruleTable);
            }
          },
        }),
        //  编辑中的模板选择
        templateSelectData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(temp_select_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(temp_select_list_url);
          }
        }),
        ruleTempData:new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(rule_temp_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(rule_temp_list_url,{status:1,isTemplate:1});
          }
        }),
        fieldWordData: new this.customstore({
          byKey: (key) => {
            return this.CommDs.loadByKey(field_word_url, {id: key});

          },
          load: (e) =>{
            return this.CommDs.loadList(field_word_list_url, e.searchData);

          }
        }),
        fieldFormatData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(field_format_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(field_format_list_url,e.searchData);
          }
        }),
        fieldBreakData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(field_break_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(field_break_list_url);
          }
        }),
        coreFactData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(core_fact_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(core_fact_list_url,{status:1});
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
    components: {
      MonacoEditor
    },
    mounted(){
      let _this=this;
      this.windowSpec = $('#window-spec').dxDataGrid({
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
        hoverStateEnabled: true,
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
        onSelectionChanged:(e)=>{
          if(e.selectedRowKeys[0]==null){return;}
          var ds = this.factTheme.getDataSource();
          this.name=e.selectedRowKeys[0].name;
          ds.loadOptions().searchData = {
            subSpecId:e.selectedRowKeys[0].id,
            subType:this.searchFormData.subType,
          };
          ds.reload();
          var dsRule = this.ruleTable.getDataSource();
          dsRule.loadOptions().searchData=null;
          dsRule.reload();
        },
        dataSource: {
          store: this.windowSpecData
        },
        columns: [
          {
            caption: '编码',
            dataField: 'id',
            alignment:"right",
            width:80,
          },
          {
            caption: '名称',
            dataField: 'name',
            alignment:"left",
            minWidth:80
          },
          {
            caption: '主题数量',
            dataField: 'subNum',
            alignment:"left",
            width:120,
          },
        ]
      }).dxDataGrid('instance');
      this.factTheme = $('#fact-theme').dxDataGrid({
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
        hoverStateEnabled: true,
        onContentReady: (e) => {
          e.component.selectRowsByIndexes([0]);
        },
        onSelectionChanged:(e)=>{
          if(e.selectedRowsData[0]==null){return;}
          this.themeName=e.selectedRowsData[0].subName;
          var ds = this.ruleTable.getDataSource();
          ds.loadOptions().searchData = {cfsId:e.selectedRowsData[0].id};
          ds.reload();
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btnFact\'/>');
            }
          });
        },
        dataSource: {
          store: this.factThemeData
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
              if(options.data.status == 1){
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.themeEdit},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认停用吗？',
                    id: {id:options.data.id,status:0},
                    click: this.UpdateThemeStatus
                  },
                ];
              }else{
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.themeEdit},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    id: {id:options.data.id,status:1},
                    click: this.UpdateThemeStatus
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
            width:80,
            alignment: 'right',
          },
          {
            dataField: 'subName',
            caption: '主题名称',
            minWidth:120,
            alignment: 'left',
          },
          {
            dataField: 'spliteSql',
            caption: '分流规则',
            alignment: 'left',
            minWidth:120,
          },
          {
            dataField: 'remark',
            caption: '备注',
            width:260,
            alignment: 'left',
          },
          {
            dataField: 'isTemplate',
            caption: '是否提取为模板',
            width:100,
            alignment: 'center',
            lookup: {
              dataSource: this.enum.yesNo,
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
            width:80,
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
            dataField: 'factName',
            caption: '事件原型',
            alignment: 'left',
          },
          {
            dataField: 'remark',
            caption: '备注',
            minWidth:160,
            alignment: 'left',
          },
          {
            dataField: 'isTemplate',
            caption: '是否提取为模板',
            width:100,
            alignment: 'center',
            lookup: {
              dataSource: this.enum.yesNo,
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
      this.searchForm=$("#searchForm").dxForm({
        colCount: 2,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'subType',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '限定类型',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.subType,
              displayExpr: 'text',
              valueExpr: 'id',
              onSelectionChanged:(e)=>{
                this.search()
                this.windowSpec.selectRows([], false);
              }
            },
          },
          {
            dataField:"exists",
            editorType:'dxCheckBox',
            label:{
              alignment:"right",
              text:"是否存在主题"
            },
            editorOptions: {
              onValueChanged:(e)=> {
                this.search();
              }
            },
          },
        ]
      }).dxForm('instance');
      //新增表
      this.themeEditForm = $('#themeEditForm').dxForm({
        colCount: 2,
        formData: this.themeEditFormData,
        items: [
          {
            dataField: 'pid',
            colSpan:2,
            label: {
              alignment: 'left',
              text: '模板选择'
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择模板',
              dataSource: this.templateSelectData,
              showClearButton:true,
              valueExpr: 'id',
              displayExpr: 'subName',
              onValueChanged:(e)=> {
                this.themeValue=e.value;
                this.themeTemplateValue();
                this.themeDisabled();
              }
            },
          },
          {
            dataField: 'subName',
            colSpan:2,
            label: {
              alignment: 'right',
              text: '主题名称'
            },
            validationRules: [{
              type: "required",
              message: "请输入主题名称"
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
            dataField:"isTemplate",
            editorType: 'dxCheckBox',
            label:{
              alignment:"right",
              text:"提取为模板"
            },
            editorOptions:{},
          },
          {
            dataField: 'spliteSql',
            colSpan:2,
            editorType: 'dxTextArea',
            label: {
              alignment: 'left',
              text: '分流规则',
            },
            editorOptions:{},
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
              maxLength: 64
            },
          },
        ],
      }).dxForm('instance');
      this.ruleEditForm = $('#ruleEditForm').dxForm({
        colCount: 2,
        formData: this.ruleEditFormData,
        items: [
          {
            dataField: 'ruleCode',
            colSpan:2,
            label: {
              alignment: 'right',
              text: '规则模板'
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择规则模板',
              dataSource: this.ruleTempData,
              showClearButton:true,
              valueExpr: 'id',
              displayExpr: 'name',
              onValueChanged:(e)=> {
                this.ruleValue=e.value;
                if(e.value==null){
                  this.createType=1;
                }else{
                  this.createType=2;
                }
                this.ruleTemplateValue();
                this.ruleDisabled();
              },
            },
          },
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
            dataField: 'factId',
            label: {
              alignment: 'right',
              text:'事件原型',
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择事件原型',
              dataSource: this.coreFactData,
              showClearButton:true,
              valueExpr: 'id',
              displayExpr: 'factName',
              onSelectionChanged: function (e) {
                if (e.selectedItem){
                  if (_this.factIds != e.selectedItem.id) {
                    _this.ColFieldArry = [];
                  }
                }
              },
            },
            validationRules: [{
              type: "required",
              message: "请选择事件原型"
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
            dataField:"isTemplate",
            editorType: 'dxCheckBox',
            label:{
              alignment:"right",
              text:"提取为模板"
            },
          },
          {
            dataField:'message',
            colSpan:2,
            label: {
              alignment: 'right',
              text:'提示消息',
            },
            editorType: 'dxTextArea',
            editorOptions:{
              maxLength: 64
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
            dataField:'remark',
            colSpan:2,
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text:'备注',
            },
            editorOptions:{
              maxLength:64
            },
          },
        ],
      }).dxForm('instance');
      //规则中新增规则中新增字段
      this.addFieldForm=$('#addFieldForm').dxForm({
        colCount: 1,
        formData: this.addFieldFormData,
        items: [
          {
            dataField: 'colId',
            label: {
              alignment: 'right',
              text:'字段选择',
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择字段',
              dataSource: this.fieldWordData,
              showClearButton:true,
              valueExpr: 'id',
              displayExpr: 'colName',
              onSelectionChanged(e){
                _this.selectWord=e.selectedItem;
                // var ds =this.addFieldForm.getEditor('colId').getDataSource();
                // ds.loadOptions().searchData = {cfId:this.ruleEditFormData.factId};
                // ds.reload();
              }
            },
            validationRules: [{
              type: "required",
              message: "请选择字段"
            }]
          },
          {
            dataField: 'cfType',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '格式化类型',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.cfType,
              displayExpr: 'text',
              valueExpr: 'id',
              onValueChanged(e){
                if(e.value==null){return;}
                let dataSource =  _this.addFieldForm.getEditor('funId').getDataSource();
                dataSource.loadOptions().searchData = {cfType:e.value};
                dataSource.reload();
              }
            },
          },
          {
            dataField: 'funId',
            label: {
              alignment: 'right',
              text:'格式化函数',
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择格式化函数',
              dataSource: this.fieldFormatData,
              showClearButton:true,
              valueExpr: 'id',
              displayExpr: 'cfName',
            },
          },
          {
            dataField: 'assertType',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '断言值类型',
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.assertType,
              displayExpr: 'text',
              valueExpr: 'id',
              onValueChanged: (e) => {
                if(e.value==null) {return; }
                if(e.value==2){
                  this.addFieldForm.itemOption('assertDs','visible',true);
                }else {
                  this.addFieldForm.itemOption('assertDs','visible',false);
                }
              },
            },
            validationRules: [{
              type: "required",
              message: "请选择断言值类型"
            }]
          },
          {
            dataField: 'assertDs',
            visible:false,
            label: {
              alignment: 'right',
              text:'断言数据源',
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择数据源',
              dataSource: this.fieldBreakData,
              showClearButton:true,
              valueExpr: 'id',
              displayExpr: 'dsName',
            },
            validationRules: [{
              type: "required",
              message: "请选择数据源"
            }]
          },
        ],
      }).dxForm('instance');
      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增主题', type: 'primary', enabled: true, click: this.addTheme},
      ];
      this.btnPart.$mount('#btnFact');
      this.btnPart.$parent = this;

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 2, text: '新增规则', type: 'primary', enabled: true, click: this.addRule},
      ];
      this.btnPart.$mount('#btnRule');
      this.btnPart.$parent = this;
      this.search();
    },
    methods:{
      search:function(){
        var ds = this.windowSpec.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
        var dsFact = this.factTheme.getDataSource();
        dsFact.loadOptions().searchData = null;
        dsFact.reload();
        var dsRule = this.ruleTable.getDataSource();
        dsRule.loadOptions().searchData = null;
        dsRule.reload();
      },
      addTheme: function () {
        if(this.windowSpec.getSelectedRowKeys().length <1)
        {
          this.warn("请选择限定项");
          return;
        }
        this.modal.isNew = true;
        this.themeEditFormData = {};
        this.themeEditFormData.subSpecId=this.windowSpec.getSelectedRowKeys()[0].id;
        this.themeEditFormData.subType=this.searchFormData.subType;
        this.themeEditFormData.status = 1;
        this.themeEditForm.option('formData', this.themeEditFormData);
        this.modal.visible = true;
      },
      themeTemplateValue:function(){
        if(this.themeValue!=null) {
          this.$put(temp_select_url, {id: this.themeValue}).then(res => {
            if (res.code == '200') {
                this.themeEditForm.getEditor("subName").option('value', res.data.subName);
                this.themeEditForm.getEditor("spliteSql").option('value', res.data.spliteSql);
                this.themeEditForm.getEditor("remark").option('value', res.data.remark);
                this.themeEditForm.getEditor("pid").option('value', this.themeValue);
              this.modal.visible = true;
            } else {
              // 提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        }
      },
      themeEdit: function (data) {
        this.modal.isNew = false;
        console.log(data)
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.themeEditFormData = tempData;
        this.subName=this.themeEditFormData.subName;
        // this.themeEditForm.getEditor("pid").option('value', tempData.pid);
        // setTimeout(()=>{
        //   this.themeEditForm.getEditor("subName").option('value', tempData.subName);
        //   this.themeEditForm.getEditor("status").option('value', tempData.status);
        //   this.themeEditForm.getEditor("isTemplate").option('value', tempData.isTemplate);
        //   this.themeEditForm.getEditor("spliteSql").option('value', tempData.spliteSql);
        //   this.themeEditForm.getEditor("remark").option('value', tempData.remark);
        // },600);
           this.themeEditForm.option('formData', this.themeEditFormData);
        //this.themeDisabled();
        this.modal.visible = true;
      },
      themeDisabled:function(){
        if(this.themeValue!=null){
          this.themeEditForm.getEditor("subName").option('disabled',true);
          this.themeEditForm.getEditor("spliteSql").option('disabled',true);
          this.themeEditForm.getEditor("remark").option('disabled',true);
        }else{
          this.themeEditForm.getEditor("subName").option('disabled',false);
          this.themeEditForm.getEditor("spliteSql").option('disabled',false);
          this.themeEditForm.getEditor("remark").option('disabled',false);
        }
      },
      addRule: function () {
        let _this=this;
        _this.factIds = null;
        if(this.windowSpec.getSelectedRowKeys().length <1)
        {
          this.warn("请选择限定项");
          return;
        }
        if(this.factTheme.getSelectedRowKeys().length <1)
        {
          this.warn("请选择主题");
          return;
        }
        this.createType=1;
        this.modalField.isNew=false;
        this.modalRule.isNew = true;
        this.ColFieldArry=[];
        this.ruleEditFormData = {coreRuleColSpecVOS:[]};
        this.ruleEditFormData.cfsId=this.factTheme.getSelectedRowKeys()[0].id;
        this.ruleEditFormData.status = 1;
        this.ruleEditFormData.createType = this.createType;
        this.ruleEditForm.option('formData', this.ruleEditFormData);
        this.modalRule.visible = true;
        setTimeout(function () {
          _this.code="";
          _this.$refs.monacoEditor.editor.layout();
          _this.$refs.monacoEditor.editor.setValue(_this.code);
        },100);
      },
      //调用外部控件获取数据
      getFieldData:function(){
        let _this=this;
        for(let key in this.ruleEditFormData.coreRuleColSpecVOS)
        {
          let item=this.ruleEditFormData.coreRuleColSpecVOS[key];
          if(item.assertType==2
            &&(
              item.dataArry==null||
              item.dataArry.length<1
            ))
          {
            this.$put(rule_activity_url, {id:item.assertDs}).then(res => {
              if (res.code == '200'){
                item.dataArry=res.rows;
                _this.ColFieldArry=_this.ruleEditFormData.coreRuleColSpecVOS;
                _this.$forceUpdate()
              }
              else { this.warn(res.msg); }
            }).catch(err => { this.error(err);});
          }
        }
      },
      fieldDel:function(val){
        let index=null;
        for(let key in val){
          index=val[key];
        }
        this.ColFieldArry.splice(index,1);
      },
      ruleEdit:function(data){
        this.factIds = data.factId;
        this.modalRule.isNew = false;
        this.modalRule.visible = true;

        let _this=this;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }

        this.ruleEditFormData = tempData;
        this.ruleName=this.ruleEditFormData.name;
        setTimeout(function () {
          _this.code=_this.ruleEditFormData.rule;
          _this.$refs.monacoEditor.editor.layout();
          _this.$refs.monacoEditor.editor.setValue(_this.code);
        },100);
        for(let key in this.ruleEditFormData.coreRuleColSpecVOS){
          let item=this.ruleEditFormData.coreRuleColSpecVOS[key];
          if(item.assertType==3)
          {
            item.assertVal =Number( item.assertVal);
            item.assertVal2 = Number(item.assertVal2);
          }
          if(item.assertType==2){
            this.getFieldData();
          }else{
            setTimeout(()=>{
              this.ColFieldArry=data.coreRuleColSpecVOS;
            },100);
          }
        };
        // this.ruleEditForm.getEditor("name").option('value', tempData.name);
        // this.ruleEditForm.getEditor("factId").option('value', tempData.factId);
        // this.ruleEditForm.getEditor("no").option('value', tempData.no);
        // this.ruleEditForm.getEditor("message").option('value', tempData.message);
        // this.ruleEditForm.getEditor("controlState").option('value', tempData.controlState);
        // this.ruleEditForm.getEditor("remark").option('value', tempData.remark);
        if(tempData.createType==2){
          this.ruleEditForm.getEditor("ruleCode").option('value', tempData.id);
          this.ruleEditForm.getEditor("name").option('value', tempData.name);
          this.ruleEditForm.getEditor("factId").option('value', tempData.factId);
          this.ruleEditForm.getEditor("no").option('value', tempData.no);
          this.ruleEditForm.getEditor("message").option('value', tempData.message);
          this.ruleEditForm.getEditor("controlState").option('value', tempData.controlState);
          this.ruleEditForm.getEditor("remark").option('value', tempData.remark);
        }else{
          this.ruleEditForm.option('formData', this.ruleEditFormData);
        }
        //_this.$refs.monacoEditor.editor.setValue("");
        var ds =this.ruleEditForm.getEditor('ruleCode').getDataSource();
        ds.reload();
      },
      UpdateThemeStatus: function (data)  {
        this.$post(status_theme_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.factTheme.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
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
      themeEditFormCancel: function () {
        this.modal.visible = false;
      },
      themeFormSubmit: function () {
        if (!this.themeEditForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(fact_theme_insert_url, this.themeEditFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!',()=> {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.factTheme.refresh();
              var ds =this.themeEditForm.getEditor('pid').getDataSource();
              ds.reload();
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
      cancel:function(){
        this.modalRule.visible = false;
        this.ruleTable.refresh();
      },
      ruleEditFormCancel: function () {
        this.modalRule.visible = false;
        this.ruleTable.refresh();
      },
      ruleFormSubmit: function () {
        if (!this.ruleEditForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalRule.modal_loading = false;
          return;
        }
        this.ruleEditFormData.rule=this.$refs.monacoEditor.editor.getValue();
        this.ruleEditFormData.coreRuleColSpecVOS=this.ColFieldArry;
        this.ruleEditFormData.createType=this.createType;
        this.$post(rule_insert_url, this.ruleEditFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.modalRule.visible=false;
              this.ruleTable.refresh();
              var ds =this.ruleEditForm.getEditor('ruleCode').getDataSource();
              ds.reload();
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
      addField:function(){
        this.modalRule.visible = false;
        this.addFieldFormData={};
        this.addFieldForm.option('formData', this.addFieldFormData);
        this.modalField.visible=true;
        setTimeout(()=>{
          var ds =this.addFieldForm.getEditor('colId').getDataSource();
          ds.loadOptions().searchData = {cfId:this.ruleEditFormData.factId};
          ds.reload();
        },100);
      },
      FieldFormCancel:function(){
        this.modalField.visible = false;
        this.modalRule.visible=true;
      },
      //新增字段
      AddColFieldArry:function(){
        this.addFieldFormData.name=this.selectWord.colName;
        this.addFieldFormData.dataArry=this.dataArry;
        this.addFieldFormData.calculate=this.calculate.text;
        if(this.addFieldFormData.assertType==3){
          this.addFieldFormData.assertVal=0;
          this.addFieldFormData.assertVal2=0;
        }
        this.ColFieldArry.push(this.addFieldFormData);
        this.modalField.isNew=true;
        this.modalField.visible=false;
        this.modalRule.visible=true;
      },
      //确定添加字段
      FieldFormConfirm:function(){
        if (!this.addFieldForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalField.modal_loading = false;
          return;
        }
        if(this.addFieldFormData.assertType==2)
        {
          this.$put(rule_activity_url, {id:this.addFieldFormData.assertDs}).then(res => {
            if (res.code == '200'){
              this.dataArry=res.rows;
              this.AddColFieldArry();
            }
            else { this.warn(res.msg); }
          }).catch(err => { this.error(err);});
        }
        else{this.AddColFieldArry();}
      },

      generateRules:function (){
        let _this=this;
        if (!_this.ruleEditForm.validate().isValid) {
          _this.warn('信息不完整');
          _this.modalRule.modal_loading = false;
          return;
        }
        for(let i=0;i<_this.ColFieldArry.length;i++){
          let listArr=_this.ColFieldArry[i];
          if(listArr.assertType==1 || listArr.assertType==2) {
            if (!listArr.assertVal || !listArr.calculate ) {
              _this.warn("请正确填写限定条件");
              return
            }
          } else if(listArr.assertType==3){
            if(listArr.assertVal==null||!listArr.assertVal2==null|| !listArr.calculate ||listArr.assertVal>listArr.assertVal2){
              _this.warn("请正确填写限定条件");
              return
            }
          }
        }
        _this.ruleEditFormData.coreRuleColSpecVOS=_this.ColFieldArry;
        _this.$put(generate_rules, _this.ruleEditFormData).then(res => {
          if (res.code == '200') {
            _this.code=res.data;
            _this.$refs.monacoEditor.editor.layout();
            _this.$refs.monacoEditor.editor.setValue(_this.code);
          }
          else {
            //提示信息
            _this.warn(res.msg);
          }
        }).catch(err => {
          _this.error(err);
        });
      },
      backRuleData:function(){
        let cloneColFieldArry = [];
        for (let i=0; i<this.addTemplateData.length; i++ )  {
          if(this.addTemplateData[i].assertType==3) {
            this.addTemplateData[i].assertVal =Number(this.addTemplateData[i].assertVal);
            this.addTemplateData[i].assertVal2 = Number(this.addTemplateData[i].assertVal2);
            cloneColFieldArry[i]={
              assertDs:this.addTemplateData[i].assertDs,
              assertType:this.addTemplateData[i].assertType,
              assertVal:this.addTemplateData[i].assertVal,
              assertVal2:this.addTemplateData[i].assertVal2,
              calculate:this.addTemplateData[i].calculate,
              colId:this.addTemplateData[i].colId,
              funId:this.addTemplateData[i].funId,
              name:this.addTemplateData[i].colName,
            };
          } else if(this.addTemplateData[i].assertType==2) {
            this.$put(rule_activity_url, {id:this.addTemplateData[i].assertDs}).then(res => {
              if (res.code == '200'){
                this.dataArry=res.rows;
                cloneColFieldArry[i]={
                  assertDs:this.addTemplateData[i].assertDs,
                  assertType:this.addTemplateData[i].assertType,
                  assertVal:this.addTemplateData[i].assertVal,
                  calculate:this.addTemplateData[i].calculate,
                  colId:this.addTemplateData[i].colId,
                  funId:this.addTemplateData[i].funId,
                  dataArry:this.dataArry,
                  name:this.addTemplateData[i].colName,
                };
              }
              else { this.warn(res.msg); }
            }).catch(err => { this.error(err);});
          } else if(this.addTemplateData[i].assertType==1) {
            cloneColFieldArry[i]={
              assertDs:this.addTemplateData[i].assertDs,
              assertType:this.addTemplateData[i].assertType,
              assertVal:this.addTemplateData[i].assertVal,
              calculate:this.addTemplateData[i].calculate,
              colId:this.addTemplateData[i].colId,
              funId:this.addTemplateData[i].funId,
              name:this.addTemplateData[i].colName,
            };
          }else{
            cloneColFieldArry[i]={};
          }
        }
        setTimeout(()=>{
          this.ColFieldArry=cloneColFieldArry;
        },500);
      },
      ruleTemplateValue:function(){
        let _this=this;
        if(this.ruleValue!=null){
          this.$put(field_id_url, {id:this.ruleValue}).then(res => {
            if (res.code == '200') {
              this.addTemplateData=res.rows;
              //this.ruleCompactId=res.rows[0].ruleCode;
              this.ruleEditForm.getEditor("name").option('value', res.rows[0].name);
              this.ruleEditForm.getEditor("factId").option('value', res.rows[0].factId);
              this.ruleEditForm.getEditor("no").option('value', res.rows[0].no);
              this.ruleEditForm.getEditor("message").option('value', res.rows[0].message);
              this.ruleEditForm.getEditor("controlState").option('value', res.rows[0].controlState);
              this.ruleEditForm.getEditor("remark").option('value', res.rows[0].remark);
              this.ruleEditForm.getEditor("ruleCode").option('value', this.ruleValue);
              _this.$refs.monacoEditor.editor.layout();
              this.backRuleData();
              this.getFieldData();
              this.modalRule.visible = true;
            } else {
              // 提示信息
              this.warn(res.msg);
            }
          }).catch(err => {this.error(err);})
        }else{
          this.ColFieldArry=[];
        }
      },
      ruleDisabled:function(){
        let _this=this;
        // if(this.ruleEditFormData.createType!=2){
        //   return;
        // }
        if(this.ruleValue!=null){
          this.ruleEditForm.getEditor("name").option('disabled',true);
          this.ruleEditForm.getEditor("factId").option('disabled',true);
          this.ruleEditForm.getEditor("no").option('disabled',true);
          this.ruleEditForm.getEditor("message").option('disabled',true);
          this.ruleEditForm.getEditor("controlState").option('disabled',true);
          this.ruleEditForm.getEditor("remark").option('disabled',true);
        }else{
          this.ruleEditForm.getEditor("name").option('disabled',false);
          this.ruleEditForm.getEditor("factId").option('disabled',false);
          this.ruleEditForm.getEditor("no").option('disabled',false);
          this.ruleEditForm.getEditor("message").option('disabled',false);
          this.ruleEditForm.getEditor("controlState").option('disabled',false);
          this.ruleEditForm.getEditor("remark").option('disabled',false);
        }
      },
    }
  }
</script>


