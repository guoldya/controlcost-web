<style lang="less">
  @import "../../../styles/common.less";
  @import "single-disease";
</style>
<template>
  <div class="single">
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
        <div id="single-grid"></div>
      </Row>
    </Card>
    <Card dis-hover style="margin-top: 5px">
      <tabs value="bd-information">
        <TabPane label="单病种基本信息" name='bd-information'>
          <div class="padding-top-5">
            <Row class="margin-bottom-20">
              <Col span="6">病种编号: {{list.id}}</Col>
              <Col span="6">病种名称: {{list.name}}</Col>
              <Col span="12">诊断:<span style="font-weight: bold;"> {{list.diagnose}}</span></Col>
            </Row>
            <Row class="margin-bottom-20">
              <Col span="6">计划额: {{list.planNum}}元</Col>
              <Col span="6">警示额: {{list.planNumWarn}}元</Col>
              <Col span="6">来源类型: {{list.scope | source_type}}</Col>
              <Col span="6">科室: {{list.dname}}</Col>
            </Row>
            <Row class="margin-bottom-20">
              <Col span="6">险种类別: {{list.insFeeType | insHolderCls_if}}</Col>
              <Col span="6">控制方式: {{list.controlState | control_type}}</Col>
              <Col span="6">状态: {{list.status | status_type}}</Col>

            </Row>
            <Row class="margin-bottom-20">
              <Col span="24">备注: {{list.remark}}</Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="单病种条件信息" name='conditions'>
          <div id="conditions-grid" class="padding-top-5"></div>
        </TabPane>
        <TabPane label="单病种项目信息" name='items' class="tabpanes">
          <Row>
            <Col span="8" style="padding-right: 5px">
              <Card dis-hover>
                <p slot="title">项目分类</p>
                <div id="items-grid"></div>
              </Card>
            </Col>
            <Col span="16">
              <Card dis-hover>
                <p slot="title">{{items | rightItemName}}</p>
                <div id="drugs-grid"></div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </tabs>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增病种</span>
        <span v-else="modal.isNew">编辑病种</span>
      </p>
      <div id="editForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalItem.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modalItem.isNew">新增项目</span>
        <span v-else="modalItem.isNew">编辑项目</span>
      </p>
      <div id="editItemForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormItemCancel">取消</Button>
        <Button type="primary" :loading="modalItem.modal_loading" @click="formItemSubmit">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalDrug.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modalDrug.isNew">新增</span>
        <span v-else="modalDrug.isNew">编辑</span>
      </p>
      <div id="editDrugForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormDrugCancel">取消</Button>
        <Button type="primary" :loading="modalDrug.modal_loading" @click="formDrugSubmit">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalField.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modalField.isNew">新增条件</span>
        <span v-else="modalField.isNew">编辑条件</span>
      </p>
      <Row>
        <Col span="24">
          <div id="editConditionsForm"></div>
          <Card dis-hover style="margin-top: 10px;">
            <div v-show="colField==1" style="margin-top:10px;">
              <Row>
                <Col class="ConditionFormCol" span="5">
                  {{colName}}:
                </Col>
                <Col span="19">
                  <Select class="ConditionFormSelect" v-model="assert.calculate" size="small">
                    <Option v-for="arryitem in calculate" :value="arryitem.id" :key="arryitem.key">{{ arryitem.text }}
                    </Option>
                  </Select>
                  <Input v-model="assert.assertVal" style="width: 300px" size="small"/>
                </Col>
              </Row>
            </div>
            <div v-if="colField==2" style="margin-top:12px;">
              <Row>
                <Col class="ConditionFormCol" span="5">
                  {{colName}}：
                </Col>
                <Col span="19">
                  <Select class="ConditionFormSelect" v-model="assert.calculate" size="small">
                    <Option v-for="item in calculate" :value="item.id" :key="item.key">{{ item.text }}</Option>
                  </Select>
                  <Select v-model="assert.assertVal" style="width:300px; " size="small" v-if="dataArry!=null">
                    <Option v-for="arryItem in dataArry" :value="arryItem.key" :key="arryItem.key">{{ arryItem.value }}
                    </Option>
                  </Select>
                </Col>
              </Row>
            </div>
            <div v-if="colField==3" style="margin-top:12px;">
              <Row>
                <Col class="ConditionFormCol" span="5" >
                  {{colName}}：
                </Col>
                <Col span="19">
                  <Select class="ConditionFormSelect" v-model="assert.calculate" size="small">
                    <Option v-for="arryitem in calculate" :value="arryitem.id" :key="arryitem.key">{{ arryitem.text }}
                    </Option>
                  </Select>
                  <InputNumber v-model="assert.assertVal" style="width:142px" size="small"></InputNumber>
                  ~
                  <InputNumber v-model="assert.assertVal2" style="width:142px" size="small"></InputNumber>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="editConditionsFormCancel">取消</Button>
        <Button type="primary" :loading="modalField.modal_loading" @click="editConditionsFormSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

  import Vue from 'vue';

  let core_bd_sd_url = 'sys/coreBdSd/selectByPage';
  let core_bd_sd_insert_url = 'sys/coreBdSd/updateOrInsert';

  let core_bd_sd_updateStatus_url = 'sys/coreBdSd/updateStatus';
  let core_db_dx_url = 'sys/coreBdDx/queryList';
  let core_db_key_url = 'sys/coreBdDx/selectById';

  let core_bd_sd_drugs_url = 'sys/coreBdSdDrug/selectDrugLeft';

  let core_bd_sd_drugs_select_url = 'sys/coreBdSdDrug/selectDrugRight';

  let core_bd_sd_drugs_insert_url = 'sys/coreBdSdDrug/updateOrInsert';

  let core_bd_sd_drugs_update_url = 'sys/coreBdSdDrug/updateStatus';

  //医保耗材接口
  let med_consume_list_url = 'sys/coreBdInsMc/selectByPage';
  let med_consume_key_url = 'sys/coreBdInsMc/selectByMap';
  //医保药品接口
  let med_drug_list_url = 'sys/coreBdInsMed/selectByPage';
  let med_drug_key_url = 'sys/coreBdInsMed/selectByMap';
  //医保诊疗接口
  let med_treat_list_url = 'sys/coreBdInsTreatment/selectByPage';
  let med_treat_key_url = 'sys/coreBdInsTreatment/selectByMap';

  //事件原型接口
  let core_fact_url = 'sys/coreFact/selectIdNameList';
  let core_fact_detail_url = 'sys/coreFact/selectByMap';
  //字段接口
  let field_word_list_url = 'sys/coreFactCol/selectListByCfId';
  let field_word_url = 'sys/coreFactCol/selectByMap';

  //格式化函数
  let field_format_list_url = 'sys/coreFactColFormat/selectListByCfType';
  let field_format_url = 'sys/coreFactColFormat/selectByMap';

  //断言值数据源
  let field_break_list_url = 'sys/coreRuleDatasource/selectList';
  let field_break_url = 'sys/coreRuleDatasource/selectByMap';

  //
  let field_break_detail_url = 'sys/coreRuleDatasource/multipleDataSource';

  //单病种限定目录接口
  let core_Sd_Rule_Col_Update_url = 'sys/coreSdRuleCol/updateOrInsert';
  let core_sd_rule_col_url = 'sys/coreSdRuleCol/selectByPage';

  //科室管理
  let bd_dept_url = 'sys/bdDept/selectList';
  let bd_dept_detail_url = 'sys/bdDept/selectByMap';

  //条件删除
  let conditions_delete_url = 'sys/coreSdRuleCol/deleteById';
  export default {
    name: "single-disease",
    data() {
      return {
        //单病种id
        cbdIds: null,
        //项目分组编码
        planType: null,
        // isLoadEdit: false,
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        editItemForm: {},
        editItemFormData: {},
        editDrugForm: {},
        editDrugFormData: {},
        editConditionsForm: {},
        editConditionsFormData: {},

        colField: null,
        list: {},
        items: null,
        columns1: [],
        drugs: [],
        factId: null,
        assert: {
          assertVal: '',
          assertVal2: '',
          calculate: '',
        },
        colName: '',
        calculate: this.enum.calculate,
        dataArry: [],
        selectedBreakData: {},
        allItems: [],

        tag: [],
        itemsGrid: {},
        drugsGrid: {},
        //
        breakDetailId: null,

        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        modalItem: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        modalDrug: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        modalField: {
          add: false,
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        singleGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, core_bd_sd_url, this.isLoadData, {}, this.singleGrid);
          }
        }),

        itemsGridData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            } else {
              return this.CommDs.loadList(core_bd_sd_drugs_url, loadOptions.searchData);
            }
          }
        }),

        drugsGridData: new this.customstore({
          load: (loadOptions) => {

            if (loadOptions.searchData == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            } else {
              return this.CommDs.loadList(core_bd_sd_drugs_select_url, loadOptions.searchData);
            }
          }
        }),

        conditionsGridData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            } else {
              return this.CommDs.loadPage(loadOptions, core_sd_rule_col_url, this.isLoadData, {}, this.conditionsGrid);
            }
          }
        }),

        listGrid: {},
        listGridData: new this.customstore({
          key: "id",
          byKey: (key) => {
            if (this.items == 1) {
              return this.CommDs.loadByKey(med_drug_key_url, {id: key});
            } else if (this.items == 2) {
              return this.CommDs.loadByKey(med_consume_key_url, {id: key});
            } else if (this.items == 3) {
              return this.CommDs.loadByKey(med_treat_key_url, {id: key});
            }
            ;
          },
          load: (loadOptions) => {
            if (this.items == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            } else if (this.items == 1) {
              return this.CommDs.loadPage(loadOptions, med_drug_list_url, this.isLoadData, {}, this.listGrid);
            } else if (this.items == 2) {
              return this.CommDs.loadPage(loadOptions, med_consume_list_url, this.isLoadData, {}, this.listGrid);
            } else if (this.items == 3) {
              return this.CommDs.loadPage(loadOptions, med_treat_list_url, this.isLoadData, {}, this.listGrid);
            }
          }
        }),

        //事件原型
        coreFactData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(core_fact_detail_url, {id: key});
          },
          load: (e) => {
            return this.CommDs.loadList(core_fact_url, {status: 1});
          }
        }),
        fieldWordData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(field_word_url, {id: key});
          },
          load: (loadOptions) => {
            if (this.factId == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            }else if (this.factId){
              return this.CommDs.loadList(field_word_list_url, {cfId:this.factId});
            }
          }
        }),
        //条件列表获取字段
        conditionsFieldWordData: new this.customstore({
          key: "id",
          load: (loadOptions) => {
              return this.CommDs.loadList(field_word_list_url, loadOptions.searchData);
          }
        }),
        //格式化函数
        fieldFormatData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(field_format_url, {id: key});
          },
          load: (e) => {
            return this.CommDs.loadList(field_format_list_url);
          }
        }),

        //断言值数据源
        fieldBreakData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(field_break_url, {id: key});
          },
          load: (e) => {
            return this.CommDs.loadList(field_break_list_url);
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
          load: (loadOptions) => {
              return this.deptListData(loadOptions);
          }
        }),

        //诊断
        diagnosisGridData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(core_db_key_url, {id: key});
          },
          load: (e) => {
            return this.CommDs.loadList(core_db_dx_url);
          }
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
              text: '病种名称'
            },
            editorOptions: {
              placeholder: '请输入病种名称'
            },
          },
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
            dataField: 'deptId',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '科室',
            },
            editorOptions: {
              showClearButton: true,
              placeholder: '请选择',
              dataSource: this.bdDeptData,
              displayExpr: 'dname',
              valueExpr: 'id',
              showClearButton:true,
              searchEnabled: true,
              onOptionChanged: function (e) {
                if(e.name == "text"){
                  if(typeof (e.value) == 'string'){
                    e.component.getDataSource().loadOptions().searchData = {dname:e.value};
                  }
                }
              },
              onClosed: function (e) {
                e.component.getDataSource().loadOptions().searchData = null;
              }
            },
          },
          {
            dataField: 'controlState',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '控制方式',
            },
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '状态'
            },
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.status,
              displayExpr: 'text',
              valueExpr: 'id',
            },
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
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '病种名称',
            },
            editorOptions: {
              maxLength: 32,
            },
            validationRules: [{
              type: "required",
              message: "请输入病种名称"
            }],
          },
          {
            dataField: 'insFeeType',
            label: {
              alignment: 'right',
              text: '险种类別',
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.dxInsCls,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择险种类別",
            }],
          },
          {
            dataField: 'scope',
            label: {
              alignment: 'right',
              text: '来源',
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              disabled: true,
              placeholder: '请选择',
              dataSource: this.enum.dxScope,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择来源",
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
              placeholder: '请选择',
              showClearButton: true,
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
            dataField: 'controlState',
            label: {
              alignment: 'right',
              text: '控制方式',
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择控制方式",
            }],
          },
          {
            dataField: 'planNum',
            label: {
              alignment: 'right',
              text: '计划额',
            },
            editorType: 'dxNumberBox',
            editorOptions: {
              min: 0,
              max: 99999999,
            },
            validationRules: [{
              type: "required",
              message: "请输入计划额",
            }],
          },
          {
            dataField: 'planNumWarn',
            label: {
              alignment: 'right',
              text: '警示额',
            },
            editorType: 'dxNumberBox',
            editorOptions: {
              min: 0,
              max: 99999999,
            },
            validationRules: [{
              type: "required",
              message: "请输入警示额",
            }],
          },
          {
            dataField: 'coreBdDxes',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '诊断选择'
            },
            editorType: "dxDropDownBox",
            editorOptions: {
              dropDownOptions: {width: 550, height: 300},
              placeholder: '选择诊断',
              showClearButton: true,
              valueExpr: "id",
              displayExpr: function (e) {
                if (e.insCode || e.itemName) {
                  return e.insCode + '-' + e.itemName;
                }
              },
              dataSource: this.diagnosisGridData,
              contentTemplate: (e) => {
                let el = $('<div class="dropDownBtn">');
                let value = e.component.option('value');
                let grid = $('<div>').dxDataGrid({
                  showRowLines: true,
                  showBorders: true,
                  hoverStateEnabled: true,
                  columnFixing: {
                    enabled: true
                  },
                  dataSource: e.component.option('dataSource'),
                  columns: [
                    {
                      caption: '诊断编码',
                      dataField: 'insCode',
                      alignment: 'left',
                      width: 100
                    },
                    {
                      caption: '诊断',
                      dataField: 'itemName'
                    },
                  ],
                  paging: {enabled: true, pageSize: 10},
                  searchPanel: {
                    visible: true,
                    placeholder: '查找',
                    width: '275',
                  },
                  height: 240,
                  selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: "always"
                  },
                  selectedRowKeys: value,
                  // onSelectionChanged: (selectedItems) => {
                  //   let keys = selectedItems.selectedRowKeys;
                  //   e.component.option("value", keys);
                  //   _this.tag = selectedItems.selectedRowsData;
                  // }
                });
                e.component.on("valueChanged", function (args) {
                  instance.selectRows(args.value, false);
                });
                el.append(grid);
                el.append('<div class=\'btnPart\' >');
                let instance = grid.dxDataGrid('instance');
                //添加按钮组件
                let btnPartFrom = new (Vue.component('CommandBtns'))();
                btnPartFrom.items = [
                  {
                    id: 1, text: '添加', type: 'primary', enabled: true, click: function () {
                      let keys = instance.getSelectedRowKeys();
                      e.component.option("value", keys);
                      _this.tag = instance.getSelectedRowsData();
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
              message: "请选择诊断",
            }],
          },
          {
            colSpan: 2,
            dataField: 'remark',
            editorType: "dxTextArea",
            label: {
              alignment: 'right',
              text: '备注 ',
            },
            editorOptions: {
              maxLength: 64
            }
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

      this.editItemForm = $('#editItemForm').dxForm({
        colCount: 2,
        formData: this.editItemFormData,
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
            dataField: 'planType',
            label: {
              alignment: 'right',
              text: '项目分组',
            },
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.planType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            validationRules: [{
              type: "required",
              message: "请选择项目分组",
            }],
          },
          {
            dataField: 'planNum',
            label: {
              alignment: 'right',
              text: '计划额',
            },
            editorType: 'dxNumberBox',
            editorOptions: {
              min: 0,
              max: 99999999,
            },
            validationRules: [{
              type: "required",
              message: "请输入计划额",
            }],
          },
          {
            dataField: 'planNumWarn',
            label: {
              alignment: 'right',
              text: '警示额',
            },
            editorType: 'dxNumberBox',
            editorOptions: {
              min: 0,
              max: 99999999,
            },
            validationRules: [{
              type: "required",
              message: "请输入警示额",
            }],
          },
          {
            dataField: 'controlState',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '控制方式',
            },
            validationRules: [{
              type: "required",
              message: "请选择控制方式",
            }],
          },
        ],
      }).dxForm('instance');

      this.editDrugForm = $('#editDrugForm').dxForm({
        colCount: 2,
        formData: this.editDrugFormData,
        items: [
          {
            dataField: 'planNum',
            label: {
              alignment: 'right',
              text: '计划额',
            },
            editorType: 'dxNumberBox',
            editorOptions: {
              min: 0,
              max: 99999999,
            },
            validationRules: [{
              type: "required",
              message: "请输入计划额",
            }],
          },
          {
            dataField: 'planNumWarn',
            label: {
              alignment: 'right',
              text: '警示额',
            },
            editorType: 'dxNumberBox',
            editorOptions: {
              min: 0,
              max: 99999999,
            },
            validationRules: [{
              type: "required",
              message: "请输入警示额",
            }],
          },
          {
            dataField: 'drugId',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '请选择'
            },
            validationRules: [{
              type: "required",
              message: "请选择",
            }],
            editorType: "dxDropDownBox",
            editorOptions: {
              dropDownOptions: {width: 550, height: 275},
              placeholder: '请选择',
              showClearButton: true,
              valueExpr: "id",
              displayExpr: "itemName",
              dataSource: this.listGridData,
              contentTemplate: (e) => {
                let value = e.component.option('value');
                let grid = $('<div>').dxDataGrid({
                  showRowLines: true,
                  showBorders: true,
                  hoverStateEnabled: true,
                  columnFixing: {
                    enabled: true
                  },
                  dataSource: e.component.option('dataSource'),
                  columns: this.columns1,
                  paging: {pageSize: 10},
                  remoteOperations: {
                    filtering: true,
                    sorting: true,
                    paging: true
                  },
                  searchPanel: {
                    visible: true,
                    placeholder: '查找',
                    width: '275',
                  },
                  selection: {
                    mode: 'single',
                    showCheckBoxesMode: "always"
                  },
                  height: 249,
                  selectedRowKeys: value,
                  onSelectionChanged: (selectedItems) => {
                    let keys = selectedItems.selectedRowKeys;
                    e.component.option("value", keys);
                    _this.drugs = selectedItems.selectedRowsData;
                  }
                });
                _this.listGrid = grid.dxDataGrid('instance');
                e.component.on("valueChanged", function (args) {
                  _this.listGrid.selectRows(args.value, false);
                });
                return grid;
              }
            },
          },
          {
            dataField: 'controlState',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '控制方式',
            },
            validationRules: [{
              type: "required",
              message: "请选择控制方式",
            }],
          },
        ],
      }).dxForm('instance');

      //规则中新增规则中新增字段
      this.editConditionsForm = $('#editConditionsForm').dxForm({
        colCount: 1,
        formData: this.editConditionsFormData,
        items: [
          {
            dataField: 'factId',
            label: {
              alignment: 'right',
              text: '事件原型',
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择事件原型',
              dataSource: this.coreFactData,
              showClearButton: true,
              valueExpr: 'id',
              displayExpr: 'factName',
              onValueChanged(e) {
                  if (_this.factId != e.value) {
                    _this.colName = null;
                    _this.assert = {};
                    _this.factId = e.value;
                    _this.editConditionsForm.getEditor('colId').reset();
                    let dataSource = _this.editConditionsForm.getEditor('colId').getDataSource();
                    dataSource.loadOptions().searchData = {cfId: _this.factId};
                    dataSource.reload(e);
                  }
              }
            },
            validationRules: [{
              type: "required",
              message: "请选择",
            }],
          },
          {
            dataField: 'colId',
            label: {
              alignment: 'right',
              text: '字段选择',
            },
            visible: true,
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择字段',
              dataSource: this.fieldWordData,
              showClearButton: true,
              valueExpr: 'id',
              displayExpr: 'colName',
              onSelectionChanged: function (e) {
                if (e.selectedItem == null) {
                  return;
                } else {
                  _this.colName = e.selectedItem.colName;
                }
              }
            },
            validationRules: [{
              type: "required",
              message: "请选择",
            }],
          },
          {
            dataField: 'funId',
            label: {
              alignment: 'right',
              text: '格式化函数',
            },
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择格式化函数',
              dataSource: this.fieldFormatData,
              showClearButton: true,
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
              showClearButton: true,
              dataSource: this.enum.assertType,
              displayExpr: 'text',
              valueExpr: 'id',
              onValueChanged: (e) => {
                if (e.value == null) {
                  return;
                }
                else if (e.value == 1) {
                  _this.colField = 1;
                  _this.editConditionsForm.itemOption('assertDs', 'visible', false);
                } else if (e.value == 2) {
                  _this.editConditionsForm.itemOption('assertDs', 'visible', true);
                  _this.colField = 2;
                } else if (e.value == 3) {
                  _this.editConditionsForm.itemOption('assertDs', 'visible', false);
                  _this.assert.assertVal = 1;
                  _this.assert.assertVal2 = 1;
                  _this.colField = 3;
                }
              }
            },
            validationRules: [{
              type: "required",
              message: "请选择",
            }],
          },
          {
            dataField: 'assertDs',
            label: {
              alignment: 'right',
              text: '断言数据源',
            },
            visible: false,
            editorType: "dxSelectBox",
            editorOptions: {
              placeholder: '请选择数据源',
              dataSource: this.fieldBreakData,
              showClearButton: true,
              valueExpr: 'id',
              displayExpr: 'dsName',
              onValueChanged(e) {
                if ($.trim(e.value).length < 1) {
                  return;
                } else {
                  _this.breakDetailId = e.value;
                  _this.dataArrayList();
                }
                ;
              }
            },
            validationRules: [{
              type: "required",
              message: "请选择",
            }],
          },
        ],
      }).dxForm('instance');

      this.singleGrid = $('#single-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: false,
        // wordWrapEnabled:true,
        // allowColumnResizing: true,
        // allowColumnReordering: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'
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
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          })
        },
        dataSource: {
          store: this.singleGridData,
        },
        hoverStateEnabled: true,
        onContentReady: (e) => {
          e.component.selectRowsByIndexes([0]);
        },
        onSelectionChanged: (e) => {
          let diagnose = '';
          if (e.selectedRowsData[0]) {
            this.list = e.selectedRowsData[0];
            if (e.selectedRowsData[0].deptId == -1){
              this.list.dname = '所有科室';
            }
            if (this.list.coreBdDxNames) {
              for (let key in this.list.coreBdDxNames) {
                diagnose += this.list.coreBdDxNames[key].dxId + "-" + this.list.coreBdDxNames[key].itemName + " "
              }
            }
            this.list.planNum =parseFloat(Math.floor(this.list.planNum * 100) / 100);
            this.list.planNumWarn =parseFloat(Math.floor(this.list.planNumWarn * 100) / 100);
            this.list.diagnose = diagnose;
            //cbdIds赋值
            this.cbdIds = e.selectedRowsData[0].id;
            var ds = this.itemsGrid.getDataSource();
            ds.loadOptions().searchData = {cbdId: e.selectedRowKeys[0].id};
            ds.reload();
            var dx = this.conditionsGrid.getDataSource();
            dx.loadOptions().searchData = {cbdId: e.selectedRowKeys[0].id};
            dx.reload();
            var dz = this.drugsGrid.getDataSource();
            dz.loadOptions().searchData = null;
            dz.reload();
          }else {
            var ds = this.itemsGrid.getDataSource();
            ds.loadOptions().searchData = null;
            ds.reload();
            var dx = this.conditionsGrid.getDataSource();
            dx.loadOptions().searchData = null;
            dx.reload();
            var dz = this.drugsGrid.getDataSource();
            dz.loadOptions().searchData = null;
            dz.reload();
          }
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
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
            caption: '病种编号',
            alignment: 'right',
            width: 100,
          },
          {
            dataField: 'name',
            caption: '病种名称',
            minWidth: 130,
          },
          {
            dataField: 'planNum',
            caption: '计划额（元）',
            alignment: 'right',
            width: 100,
            cellTemplate: (container, options) => {
              let number = Math.floor(options.data.planNum * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
          },
          {
            dataField: 'planNumWarn',
            caption: '警示额（元）',
            alignment: 'right',
            width: 100,
            cellTemplate: (container, options) => {
              let number = Math.floor(options.data.planNumWarn * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
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
            width: 100,
          },
          {
            dataField: 'scope',
            caption: '来源类型',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.dxScope,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 80
          },
          {
            dataField: 'deptId',
            caption: '科室',
            lookup: {
              dataSource: this.bdDeptData,
              displayExpr: 'dname',
              valueExpr: 'id',
            },
            width:150,
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
            width:80,
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
            width: 80
          },
          {
            dataField: 'remark',
            caption: '备注',
            width: 250
          },
        ]
      }).dxDataGrid('instance');

      this.conditionsGrid = $('#conditions-grid').dxDataGrid({
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
          sorting: true,
          paging: true,
        },
        paging: {
          pageSize: 10,
        },

        selection: {
          mode: 'single',
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn3\'/>');
            }
          })
        },
        dataSource: {
          store: this.conditionsGridData,
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
            cellTemplate: (container, options) => {
              container.append('<div id="t1"/>');
              var opcol = new (Vue.component('OpCol'));
              opcol.items = [
                {text: '编辑', showtip: false, id: options.data, click: this.editConditions},
                {
                  text: '删除',
                  showtip: true,
                  color: '#ff9900',
                  tip: '您确定删除吗？',
                  id: options.data,
                  click: this.deleteConditions
                },
              ];
              opcol.$mount('#t1');
            },
            width: 100
          },
          {
            dataField: 'colId',
            caption: '条件名称',
            minWidth: 200,
            lookup: {
              dataSource: this.conditionsFieldWordData,
              valueExpr: 'id',
              displayExpr: 'colName',
            }
          },
          {
            dataField: 'calculate',
            caption: '计算方式',
            lookup: {
              dataSource: this.enum.calculate,
              valueExpr: 'id',
              displayExpr: 'text',
            }
          },
          {
            dataField: 'assertVal',
            caption: '条件内容',
            width: 700,
            cellTemplate: function (container, options) {
              let markup = '';
              if (options.data.assertType == 1) {
                markup = "<div class='assertVal'>" +
                  "<p>" + options.data.assertVal + "</p>" +
                  "</div>";
              } else if (options.data.assertType == 2) {
                markup = "<div class='assertVal'>" +
                  "<p>" + options.data.assertVal2 + "</p>" +
                  "</div>";
              } else if (options.data.assertType == 3) {
                  markup = "<div class='assertVal'>" +
                    "<p>" + options.data.assertVal + '~' + options.data.assertVal2 + "</p>" +
                    "</div>";
              }
              container.append(markup);
            }
          },
        ]
      }).dxDataGrid('instance');

      this.itemsGrid = $('#items-grid').dxDataGrid({
        showBorders: true,
        showRowLines: true,
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
        dataSource: {
          store: this.itemsGridData,
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn1\'/>');
            }
          })
        },
        onSelectionChanged: (e) => {
          if (e.selectedRowKeys[0]) {
            this.items = e.selectedRowKeys[0].planType;
            if (this.listGrid.refresh) {
              this.listGrid.refresh();
            }
            var dz = this.drugsGrid.getDataSource();
            dz.loadOptions().searchData = {cbdId: e.selectedRowKeys[0].cbdId, planType: e.selectedRowKeys[0].planType};
            dz.reload();
          }else {
            var dz = this.drugsGrid.getDataSource();
            dz.loadOptions().searchData = null;
            dz.reload();
          }
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
            cellTemplate: (container, options) => {
              container.append('<div id="t1"/>');
              var opcol = new (Vue.component('OpCol'));
              if (options.data.status == 1) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.editItem},
                  {
                    text: '删除', color: '#ff9900', showtip: true, tip: '您确定吗？',
                    id: {id: options.data.id, cbdId: options.data.cbdId, status: 0, planType: options.data.planType},
                    click: this.updateStatusItem
                  },
                ];
              } else if (options.data.status == 0 || options.data.status == null) {
                opcol.items = [];
              }
              opcol.$mount('#t1');
            },
            width: 100
          },
          {
            dataField: 'id',
            caption: '编号',
            alignment: 'right',
            width: 50
          },
          {
            dataField: 'planType',
            alignment: 'center',
            caption: '项目分类',
            lookup: {
              dataSource: this.enum.planType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 130
          },
          {
            dataField: 'controlState',
            caption: '控制方式',
            alignment: 'center',
            width: 130,
            lookup: {
              dataSource: this.enum.controlRule,
              displayExpr: 'text',
              valueExpr: 'id',
            },
          },
          {
            dataField: 'planNum',
            caption: '计划额（元）',
            alignment: 'right',
            width: 100,
            cellTemplate: (container, options) => {
              let number = Math.floor(options.data.planNum * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
          },
          {
            dataField: 'planNumWarn',
            caption: '警示额（元）',
            alignment: 'right',
            width: 100,
            cellTemplate: (container, options) => {
              let number = Math.floor(options.data.planNumWarn * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
          },
        ]
      }).dxDataGrid('instance');

      this.drugsGrid = $('#drugs-grid').dxDataGrid({
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
              return $('<div id=\'btn2\'/>');
            }
          })
        },
        dataSource: {
          store: this.drugsGridData,
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
            cellTemplate: (container, options) => {
              container.append('<div id="t1"/>');
              var opcol = new (Vue.component('OpCol'));
              if (options.data.status == 1) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.editDrug},
                  {
                    text: '删除', color: '#ff9900', showtip: true, tip: '您确定吗？',
                    id: {
                      id: options.data.id,
                      cbdId: this.cbdIds,
                      status: 0,
                      planType: this.items,
                      drugId: options.data.drugId
                    },
                    click: this.updateStatusDrug
                  },
                ];
              } else if (options.data.status == 0 || options.data.status == null) {
                opcol.items = [];
              }
              opcol.$mount('#t1');
            },
            width: 100
          },
          {
            dataField: 'insCode',
            caption: '医保编码',
            alignment: 'left',
            width: 200
          },
          {
            dataField: 'itemName',
            caption: '项目名称',
            minWidth: 100
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
          },
          {
            dataField: 'spec',
            caption: '规格',
            width: 100
          },
          {
            dataField: 'unit',
            caption: '单位',
            alignment: 'center',
            width: 100
          },
          {
            dataField: 'factory',
            caption: '生产厂商',
            width: 100
          },
          {
            dataField: 'planNum',
            caption: '计划额（元）',
            alignment: 'right',
            width: 100,
            cellTemplate: (container, options) => {
              let number = Math.floor(options.data.planNum * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
          },
          {
            dataField: 'planNumWarn',
            caption: '警示额（元）',
            alignment: 'right',
            width: 100,
            cellTemplate: (container, options) => {
              let number = Math.floor(options.data.planNumWarn * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
          },
        ]
      }).dxDataGrid('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '添加', type: 'primary', enabled: true, click: this.addSingle},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;

      this.btnPart1 = new (Vue.component('CommandBtns'))();
      this.btnPart1.items = [
        {id: 1, text: '添加', type: 'primary', enabled: true, click: this.addItem},
      ];
      this.btnPart1.$mount('#btn1');
      this.btnPart1.$parent = this;

      this.btnPart2 = new (Vue.component('CommandBtns'))();
      this.btnPart2.items = [
        {id: 1, text: '添加', type: 'primary', enabled: true, click: this.addDrugs},
      ];
      this.btnPart2.$mount('#btn2');
      this.btnPart2.$parent = this;

      this.btnPart3 = new (Vue.component('CommandBtns'))();
      this.btnPart3.items = [
        {id: 1, text: '添加', type: 'primary', enabled: true, click: this.addConditions},
      ];
      this.btnPart3.$mount('#btn3');
      this.btnPart3.$parent = this;
    },

    // filters: {
    //   his_type: function (value) {
    //     if (value == "-1") {
    //       return "所有类型"
    //     } else if (value == "1") {
    //       return "医疗保险"
    //     } else if (value == "2") {
    //       return "工伤保险"
    //     } else if (value == "3") {
    //       return "生育保险"
    //     } else {
    //       return "未知"
    //     }
    //   },
    //   source_type: function (value) {
    //     if (value == "1") {
    //       return "门诊"
    //     } else if (value == "2") {
    //       return "住院"
    //     } else if (value == "3") {
    //       return "全部"
    //     } else {
    //       return "未知"
    //     }
    //   },
    //   status_type: function (value) {
    //     if (value == "0") {
    //       return "停用"
    //     } else if (value == "1") {
    //       return "启用"
    //     } else {
    //       return "未知"
    //     }
    //   },
    //   insFee_type: function (value) {
    //     if (value == "-1") {
    //       return "所有类型"
    //     } else if (value == "1") {
    //       return "医疗保险"
    //     } else if (value == "2") {
    //       return "工伤保险"
    //     } else if (value == "3") {
    //       return "生育保险"
    //     } else {
    //       return "未知"
    //     }
    //   },
    //   control_type: function (value) {
    //     if (value == "1") {
    //       return "警告"
    //     } else if (value == "2") {
    //       return "审核"
    //     } else if (value == "3") {
    //       return "禁止"
    //     } else {
    //       return "未知"
    //     }
    //   },
    //   rightItemName: function (value) {
    //     if (value == "1") {
    //       return "药品类"
    //     } else if (value == "2") {
    //       return "耗材类"
    //     } else if (value == "3") {
    //       return "诊疗类"
    //     } else {
    //       return ""
    //     }
    //   },
    //   date_time: function (ms) {
    //     if (!ms) {
    //       return;
    //     }
    //     let curTime = new Date(ms);
    //     let year = curTime.getFullYear();
    //     let month = curTime.getMonth() + 1;
    //     let day = curTime.getDate();
    //     let hours = curTime.getHours();
    //     let minutes = curTime.getMinutes();
    //     month = month <= 9 ? "0" + month : month;
    //     day = day <= 9 ? "0" + day : day;
    //     hours = hours <= 9 ? "0" + hours : hours;
    //     minutes = minutes <= 9 ? "0" + minutes : minutes;
    //     return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
    //   },
    // },
    methods: {
      dropDownHide: function () {
        this.editForm.getEditor("coreBdDxes").close();
      },
      //单病种查找
      search: function () {
        var ds = this.singleGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        if (this.searchFormData.deptId == -1) {
          ds.loadOptions().searchData.deptId = null;
        }
        ds.reload();
      },
      //查找重置
      resetSearch: function () {
        this.searchForm.resetValues();
        this.singleGrid.refresh();
      },
      //新增单病种
      addSingle: function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editFormData.scope = 2;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      //编辑单病种
      edit: function (data) {
        let ids = [];
        let tempData={};
        if (data.coreBdDxNames) {
          for (let key in data.coreBdDxNames) {
            ids[key] = data.coreBdDxNames[key].id;
          }
        }
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editFormData = tempData;
        this.editFormData.coreBdDxes = ids;
        this.modal.isNew = false;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      //取消单病种编辑
      editFormCancel: function () {
        this.modal.visible = false;
      },
      //提交单病种新增或修改
      formSubmit: function () {
        let params = this.editFormData;
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        if (params.planNumWarn > params.planNum) {
          this.warn('警示额超过计划额');
          this.modal.modal_loading = false;
          return;
        }
        if (this.tag.length > 0) {
          let ids = [];
          for (let i = 0; i < this.tag.length; i++) {
            ids[i] = this.tag[i].id;
          }
          this.editFormData.coreBdDxes = ids;
        }
        this.$post(core_bd_sd_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.singleGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modal.modal_loading = false;
      },
      //更新单病种状态
      updateStatus: function (data) {
        this.$post(core_bd_sd_updateStatus_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.singleGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      //新增项目
      addItem: function () {
        if (this.singleGrid.getSelectedRowKeys().length < 1) {
          this.warn("请选择病种");
          return;
        }
        this.modalItem.isNew = true;
        this.editItemFormData = {};
        this.editItemFormData.status = 1;
        this.editItemForm.option('formData', this.editItemFormData);
        this.modalItem.visible = true;
      },
      //编辑项目
      editItem: function (data) {
        this.modalItem.isNew = false;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editItemFormData = tempData;
        this.editItemForm.option('formData', this.editItemFormData);
        this.modalItem.visible = true;
      },
      //取消项目编辑
      editFormItemCancel: function () {
        this.modalItem.visible = false;
      },
      //提交项目新增或修改
      formItemSubmit: function () {
        let params = {};
        if (!this.editItemForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalItem.modal_loading = false;
          return;
        }
        params = this.editItemFormData;
        params.cbdId = this.cbdIds;
        if (params.planNumWarn > params.planNum) {
          this.warn('警示额超过计划额');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(core_bd_sd_drugs_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modalItem.modal_loading = false;
              this.modalItem.visible = false;
              this.itemsGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modalItem.modal_loading = false;
      },
      //更新项目状态
      updateStatusItem: function (data) {
        this.$put(core_bd_sd_drugs_update_url, data).then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              this.itemsGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      //药品类listGrid网格列
      drugGridList:function(){
        if (this.items == 1) {
          this.columns1 = [
            {
              caption: '医保编码',
              dataField: 'insCode',
              alignment: 'left',
              minWidth: 200
            },
            {
              caption: '名称',
              dataField: 'itemName',
            },
            {
              caption: '规格',
              dataField: 'spec',
            },
            {
              caption: '单位',
              dataField: 'unit',
              alignment: 'center',
              width: 50,
            },
            {
              caption: '生产厂商',
              dataField: 'factory',
            }];
        } else if (this.items == 2) {
          this.columns1 = [
            {
              caption: '医保编码',
              dataField: 'insCode',
              alignment: 'left',
              minWidth: 200
            },
            {
              caption: '名称',
              dataField: 'itemName',
            },
            {
              caption: '规格',
              dataField: 'spec',
            },
            {
              caption: '单位',
              dataField: 'unit',
              alignment: 'center',
              width: 50,
            },
            {
              caption: '生产厂商',
              dataField: 'factory',
            }]
        } else if (this.items == 3) {
          this.columns1 = [
            {
              caption: '医保编码',
              dataField: 'insCode',
              alignment: 'left',
              minWidth: 200
            },
            {
              caption: '名称',
              dataField: 'itemName',
            },
            {
              caption: '规格',
              dataField: 'spec',
            },
            {
              caption: '单位',
              dataField: 'unit',
              alignment: 'center',
              width: 50,
            },
          ]
        }
      },
      //新增药品
      addDrugs: function () {
        this.drugGridList();
        if (this.itemsGrid.getSelectedRowKeys().length < 1) {
          this.warn("请选择分类");
          return;
        }
        this.modalDrug.isNew = true;
        this.editDrugFormData = {};
        this.editDrugFormData.status = 1;
        this.editDrugForm.option('formData', this.editDrugFormData);
        this.modalDrug.visible = true;
      },
      //药品编辑
      editDrug: function (data) {
        this.drugGridList();
        this.modalDrug.isNew = false;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editDrugFormData = tempData;
        this.editDrugForm.option('formData', this.editDrugFormData);
        this.modalDrug.visible = true;
      },
      //删除药品
      updateStatusDrug: function (data) {
        let params = {};
        params.id = data.id;
        params.status = data.status;
        this.$put(core_bd_sd_drugs_update_url, params).then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              this.drugsGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //取消药品编辑
      editFormDrugCancel: function () {
        this.modalDrug.visible = false;
      },
      //添加药品保存
      formDrugSubmit: function () {
        let params = {};
        if (!this.editDrugForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalDrug.modal_loading = false;
          return;
        }
        params.cbdId = this.cbdIds;
        params.planType = this.items;
        params.planNum = this.editDrugFormData.planNum;
        params.planNumWarn = this.editDrugFormData.planNumWarn;
        params.controlState = this.editDrugFormData.controlState;
        params.status = this.editDrugFormData.status;
        params.id = this.editDrugFormData.id;
        params.controlState = this.editDrugFormData.controlState;
        if (this.editDrugFormData.drugId[0]) {
          params.drugId = this.editDrugFormData.drugId[0];
        } else {
          params.drugId = this.editDrugFormData.drugId;
        }
        if (params.planNumWarn > params.planNum) {
          this.warn('警示额超过计划额');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(core_bd_sd_drugs_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modalDrug.modal_loading = false;
              this.modalDrug.visible = false;
              this.drugsGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modalDrug.modal_loading = false;

      },

      //新增条件
      addConditions: function () {
        if (this.singleGrid.getSelectedRowKeys().length < 1) {
          this.warn("请选择病种");
          return;}
        this.factId = null;
        this.modalField.isNew = true;
        this.breakDetailId = null;
        this.editConditionsFormData = {};
        this.assert = {assertVal: '', assertVal2: '', calculate: '',};
        this.colName = '';
        this.colField = null;
        this.editConditionsForm.option('formData', this.editConditionsFormData);
        this.modalField.visible = true;
      },
      //编辑条件
      editConditions: function (data) {
        let _this = this;
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        _this.factId = tempData.factId;
        _this.modalField.visible = true;
        _this.modalField.isNew = false;
        tempData.funId = parseInt(data.funId);
        _this.editConditionsFormData = tempData;
        if (tempData.assertType == 1) {
          _this.dataArry = null;
          _this.editConditionsForm.itemOption('assertDs', 'visible', false);
          _this.assert.assertVal = tempData.assertVal;
        } else if (tempData.assertType == 2) {
          _this.colField = 1;
          _this.breakDetailId = tempData.assertDs;
          // _this.dataArrayList();
          _this.editConditionsForm.itemOption('assertDs', 'visible', true);
          _this.assert.assertVal = tempData.assertVal;
          _this.colField = 2;
        } else if (tempData.assertType == 3) {
          _this.editConditionsForm.itemOption('assertDs', 'visible', false);
          _this.assert.assertVal = Number(tempData.assertVal);
          _this.assert.assertVal2 = Number(tempData.assertVal2);
          _this.colField = 3;
        }
        _this.assert.calculate = tempData.calculate;

        _this.editConditionsForm.option('formData', this.editConditionsFormData);
      },
      //取消条件编辑
      editConditionsFormCancel: function () {
        this.modalField.visible = false;
      },
      //条件编辑保存
      editConditionsFormSubmit: function () {
        if (!this.editConditionsForm.validate().isValid) {
          this.warn('信息不完整');
          this.modalField.modal_loading = false;
          return;
        }
        if (this.colField == 1) {
          this.editConditionsFormData.assertVal = this.assert.assertVal;
          this.editConditionsFormData.assertVal2 = "";
          this.editConditionsFormData.assertDs = null;
        } else if (this.colField == 2) {
          this.editConditionsFormData.assertVal = this.assert.assertVal;
          for (let key in this.dataArry) {
            let item = this.dataArry[key];
            if (item.key == this.editConditionsFormData.assertVal) {
              this.editConditionsFormData.assertVal2 = item.value;
              break;
            }
          }
        } else if (this.colField == 3) {
          this.editConditionsFormData.assertDs = null;
          if (!this.assert.assertVal) {
            this.editConditionsFormData.assertVal = 1;
          } else {
            this.editConditionsFormData.assertVal = this.assert.assertVal;
          }
          if (!this.assert.assertVal2) {
            this.editConditionsFormData.assertVal2 = 1;
          } else {
            this.editConditionsFormData.assertVal2 = this.assert.assertVal2;
          }
        }
        this.editConditionsFormData.calculate = this.assert.calculate;
        this.editConditionsFormData.cbdId = this.cbdIds;
        this.$post(core_Sd_Rule_Col_Update_url, this.editConditionsFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modalField.modal_loading = false;
              this.modalField.visible = false;
              this.conditionsGrid.refresh();
            });
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modalField.modal_loading = false;
      },
      //删除条件
      deleteConditions: function (data) {
        let params = {};
        params.id = data.id;
        this.$post(conditions_delete_url, params).then(res => {
          if (res.code == '200') {
            this.success('删除成功!', () => {
              this.conditionsGrid.refresh();
            });
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      dataArrayList: function () {
        let _this = this;
        this.$put(field_break_detail_url, {id: _this.breakDetailId}).then(res => {
          if (res.code == '200') {
            _this.dataArry = res.rows;
            _this.$forceUpdate();
          }
          else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      deptListData: function (loadOptions) {
        var deferred = $.Deferred();
        let params = {};
        params = loadOptions.searchData;
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
    }
  }
</script>

