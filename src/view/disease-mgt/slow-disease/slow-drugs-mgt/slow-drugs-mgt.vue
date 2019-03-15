<style lang="less">
  @import "../../../../styles/common.less";
</style>
<template>
  <div>
    <Row>
      <Col span="8" style="padding-right: 5px">
        <Card dis-hover>
          <p slot="title">慢病信息</p>
          <Row class="margin-top-10">
            <div id="slow-grid"></div>
          </Row>
        </Card>
      </Col>
      <Col span="16">
        <Card dis-hover>
          <p slot="title">药品列表</p>
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
            <div id="drug-list-grid"></div>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">添加药品</span>
        <span v-else="modal.isNew">批量管理药品</span>
      </p>
      <div id="editForm"></div>
      <Row class="margin-top-10">
        <div id="all-drug-list-grid"></div>
      </Row>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
      </div>
    </Modal>

    <Modal v-model="modalDrug.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modalDrug.isNew">编辑药品{{this.editDrugFormData.itemName}}</span>
        <span v-else="modalDrug.isNew">批量管理</span>
      </p>
      <div id="editDrugForm"></div>
      <div slot="footer">
        <Button type="text" @click="editDrugCancel">取消</Button>
        <Button type="primary" :loading="modalDrug.modal_loading" @click="DrugSubmit">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Vue from 'vue';
  let slow_disease_url = 'sys/coreBdDiseases/selectByPage';
  let slow_query_list_url = 'sys/coreBdDiseasesDrug/selectByDrugList';

  let slow_insert_batch_url = 'sys/coreBdDiseasesDrug/insertByBatch';

  let slow_update_batch_url = 'sys/coreBdDiseasesDrug/updateByBatch';
  let slow_all_drugs_url = 'sys/coreBdInsMed/selectList';
  let special_status_update_url = 'sys/coreBdDiseasesDrug/updateStatus';
    export default {
        name: "slow-drugs-mgt",
      data() {
          return {
            isLoadData: true,
            searchForm: {},
            searchFormData: {},
            editForm: {},
            editFormData: {},
            editDrugForm: {},
            editDrugFormData: {},
            drugs: [],
            allDrugs: [],
            cbdIdSearch: null,
            modal: {
              isNew: false,
              visible: false,
              modal_loading: false
            },
            modalDrug: {
              isNew: false,
              visible: false,
              modal_loading: false
            },


            slowGridData: new this.customstore({
              load: (loadOptions) =>{
                if (loadOptions.searchData == null){
                  loadOptions.searchData = {dtype: 2};
                }
                return this.CommDs.loadPage(loadOptions, slow_disease_url, this.isLoadData, {}, this.slowGrid);
              }
            }),
            drugListGrid: {},
            drugListGridData: new this.customstore({
              load: (loadOptions) =>{
                if (loadOptions.searchData == null){
                  let deferred = $.Deferred();
                  return deferred.resolve([], {totalCount: 0 });
                }else {
                  // return this.CommDs.loadPage(loadOptions, slow_query_list_url, this.isLoadData, {}, this.drugListGrid);
                  return this.CommDs.loadList(slow_query_list_url,loadOptions.searchData);
                }
              }
            }),
            allDrugListGrid:{},
            allDrugListGridData: new this.customstore({
              load: (loadOptions) =>{
                return this.CommDs.loadList(slow_all_drugs_url,loadOptions.searchData);
              }
            }),
          }
      },
      mounted() {
        let _this=this;
        this.searchForm = $('#searchForm').dxForm({
          colCount: 2,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'itemName',
              label: {
                alignment: 'right',
                text: '药品名称',
              }
            },
            {
              dataField: 'planYears',
              label: {
                alignment: 'right',
                text: '年份',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.getYear(),
                displayExpr: 'text',
                valueExpr: 'id',
              }
            },
          ]
        }).dxForm('instance');

        this.slowGrid = $('#slow-grid').dxDataGrid({
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
          searchPanel: {
            visible: true,
            width: 230,
            placeholder: '支持模糊查询',
          },
          onOptionChanged:function(e){
            if(e.name == "searchPanel"){
              if(typeof (e.value) == 'string'){
                _this.slowGrid.getDataSource().loadOptions().searchData = {keyword:e.value,dtype: 2};
              }
            }
          },
          onSelectionChanged:(e)=>{
            if (e.selectedRowKeys[0]) {
              _this.cbdIdSearch = e.selectedRowKeys[0].id;
              var ds = this.drugListGrid.getDataSource();
              ds.loadOptions().searchData = {cbdId:e.selectedRowKeys[0].id};
              ds.reload();
            }else {
              var ds = this.drugListGrid.getDataSource();
              ds.loadOptions().searchData = null;
              ds.reload();
            }
          },
          dataSource: {
            store: this.slowGridData,
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
              caption: '病种编号',
              dataField: 'id',
              alignment: 'right',
              width:80
            },
            {
              caption: '病种名称',
              dataField: 'name',
              minWidth:150
            },
          ]
        }).dxDataGrid('instance');

        this.drugListGrid = $('#drug-list-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
         // wordWrapEnabled: true,
          hoverStateEnabled: true,
          columnFixing: {
            enabled: true
          },
          selection: {
            mode: 'multiple',
            allowSelectAll: true,
            selectAllMode: 'allPages',
            showCheckBoxesMode: 'always',
          },
          dataSource: {
            store: this.drugListGridData,
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
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
                return $('<div id=\'btn\'/>');
              }
            });
          },
          onSelectionChanged:(selectedItems)=>{
            if (selectedItems){
              let keys = selectedItems.selectedRowKeys;
              _this.drugs = keys;
            }
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
                container.append('<div id=\'tcol1\'/>');

                var opcol = new (Vue.component('OpCol'));

                if (options.data.status == 1) {
                  opcol.items = [
                    {text: '编辑', showtip: false, id: options.data, click: this.edit},
                    {
                      text: '停用',
                      color: '#ff9900',
                      showtip: true,
                      tip: '您确认停用吗？',
                      id: {id: options.data.id, status: 0},
                      click: this.statusUpdate
                    },
                  ];
                } else {
                  opcol.items = [
                    {text: '编辑', showtip: false, id: options.data, click: this.edit},
                    {
                      text: '启用',
                      color: '#52c41a',
                      showtip: false,
                      id: {id: options.data.id, status: 1},
                      click: this.statusUpdate
                    },
                  ];
                }
                opcol.$mount('#tcol1');
              },
              width: 100,
            },
            {
              caption: '编码',
              dataField: 'id',
              alignment: 'right',
              width:80
            },
            {
              caption: '医保编码',
              dataField: 'insCode',
              alignment: 'left',
              width:200
            },
            {
              caption:'药品名称',
              dataField: 'itemName',
              minWidth:130
            },
            {
              caption: '规格',
              dataField: 'spec',
              width:100
            },
            {
              caption: '单位',
              dataField: 'unit',
              alignment: 'center',
              width:100
            },
            {
              caption: '厂商',
              dataField: 'factory',
              width:100
            },
            {
              caption:'年份',
              dataField: 'planYears',
              width:100
            },
            {
              caption: '年计划量/月计划量/日计划量',
              dataField: 'totalPlan',
              alignment: 'right',
              width:200
            },
            {
              caption: '年警示量/月警示量/日警示量',
              dataField: 'totalPlanWarn',
              alignment: 'right',
              width:200
            },
            {
              caption: '年控制规则',
              dataField: 'controlState',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100
            },
            {
              caption: '月控制规则',
              dataField: 'monthControlState',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100
            },
            {
              caption: '日控制规则',
              dataField: 'dayControlState',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width:100
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
              width:80,
            },
          ]
        }).dxDataGrid('instance');

        this.editForm  = $('#editForm').dxForm({
          colCount: 3,
          formData: this.editFormData,
          items: [
            {
              dataField: 'planNum',
              editorType: 'dxNumberBox',
              label: {
                alignment: 'right',
                text: '年计划量'
              },
              editorOptions: {
                max:100000000000,
                min:0,
              },
              validationRules: [{
                type: "required",
                message: "请输入年计划量"
              }]
            },
            {
              dataField: 'planNumWarn',
              editorType: 'dxNumberBox',
              label: {
                alignment: 'right',
                text: '年警示量'
              },
              editorOptions: {
                max:100000000000,
                min:0,
              },
              validationRules: [{
                type: "required",
                message: "请输入年警示量"
              }]
            },
            {
              dataField: 'planYears',
              label: {
                alignment: 'right',
                text: '年份',
              },
              editorType: 'dxSelectBox',
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
                text: '年控制规则'
              },
              validationRules: [{
                type: "required",
                message: "请选择年控制规则"
              }]
            },
            {
              dataField: 'monthControlState',
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '月控制规则'
              },
              validationRules: [{
                type: "required",
                message: "请选择月控制规则"
              }]
            },
            {
              dataField: 'dayControlState',
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '日控制规则'
              },
              validationRules: [{
                type: "required",
                message: "请选择日控制规则"
              }]
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
          ]
        }).dxForm('instance');

        this.editDrugForm  = $('#editDrugForm').dxForm({
          colCount: 2,
          formData: this.editFormData,
          items: [
            {
              dataField: 'planNum',
              editorType: 'dxNumberBox',
              label: {
                alignment: 'right',
                text: '年计划量'
              },
              editorOptions: {
                max:100000000000,
                min:0,
              },
              validationRules: [{
                type: "required",
                message: "请输入年计划量"
              }]
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
                text: '年控制规则'
              },
              validationRules: [{
                type: "required",
                message: "请选择年控制规则"
              }]
            },
            {
              dataField: 'planNumWarn',
              editorType: 'dxNumberBox',
              label: {
                alignment: 'right',
                text: '年警示量'
              },
              editorOptions: {
                max:100000000000,
                min:0,
              },
              validationRules: [{
                type: "required",
                message: "请输入年警示量"
              }]
            },
            {
              dataField: 'monthControlState',
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '月控制规则'
              },
              validationRules: [{
                type: "required",
                message: "请选择月控制规则"
              }]
            },
            {
              dataField: 'planYears',
              label: {
                alignment: 'right',
                text: '年份',
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.getYear(),
                displayExpr: 'text',
                valueExpr: 'id',
              }
            },
            {
              dataField: 'dayControlState',
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '日控制规则'
              },
              validationRules: [{
                type: "required",
                message: "请选择日控制规则"
              }]
            },
          ]
        }).dxForm('instance');

        this.allDrugListGrid = $('#all-drug-list-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          hoverStateEnabled: true,
          columnFixing: {
            enabled: true
          },
          selection: {
            mode: 'multiple',
            allowSelectAll: true,
            showCheckBoxesMode: 'always',
          },
          searchPanel: {
            visible: true,
            width: 230,
            placeholder: '药品名称|医保编码',
          },
          onOptionChanged:function (e) {
            if(e.name == "searchPanel"){
              if(typeof (e.value) == 'string'){
                _this.allDrugListGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
                _this.allDrugListGrid.refresh();
              }
            }
          },
          dataSource: {
            store: this.allDrugListGridData,
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            // paging: true
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
            });
          },
          onSelectionChanged:(selectedItems)=>{
            if (selectedItems){
              let keys = selectedItems.selectedRowKeys;
              _this.allDrugs = keys;
            }
          },
          columns: [
            {
              caption: '医保编码',
              dataField: 'insCode',
              alignment: 'left',
              width:200
            },
            {
              caption:'药品名称',
              dataField: 'itemName',
              width:130
            },
            {
              caption: '规格',
              dataField: 'spec',
              width:100
            },
            {
              caption: '单位',
              dataField: 'unit',
              width:50,
              alignment: 'center'
            },
            {
              caption: '厂商',
              dataField: 'factory',
              width:100
            },

          ]
        }).dxDataGrid('instance');

        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '添加药品', type: 'primary', enabled: true, click: this.addDrug},
          {id: 2, text: '批量编辑', type: 'primary', enabled: true, click: this.batch},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods: {
        getYear(){
          let date=new Date();
          let year=date.getFullYear();
          let yearArray=[];
          for(let i=3;i>0;i--){
            yearArray.push({
              "id":year-i,
              "text":year-i,
            });
          }
          for(let i=0;i<=3;i++){
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
        search: function(){
          if(this.slowGrid.getSelectedRowKeys().length <1)
          {
            this.warn("请选择事件原型");
            return;
          }
          var ds = this.drugListGrid.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.loadOptions().searchData.cbdId =  this.cbdIdSearch;
          ds.reload();
        },
        resetSearch: function() {
          this.searchForm.resetValues();
          this.drugListGrid.refresh();
        },
        editFormCancel: function () {
          this.modal.visible = false;
        },
        //添加药品
        addDrug: function () {
          if(this.slowGrid.getSelectedRowKeys().length <1)
          {
            this.warn("请选择事件原型");
            return;
          }
          this.allDrugListGrid.selectRows([], false);
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        //添加药品
        formSubmit:function () {
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          }
          if (this.editFormData.planNumWarn > this.editFormData.planNum) {
            this.warn('警示额超过计划额');
            this.modal.modal_loading = false;
            return;
          }
          var allIds = [];
          if (this.allDrugs.length == 0){
            this.modal.visible = true;
            this.warn('请勾选药品');
          } else {
            for (let i = 0; i< this.allDrugs.length; i++){
              allIds[i] = this.allDrugs[i].id;
            };
            this.editFormData.drugIds = allIds;
            this.editFormData.cbdId = this.cbdIdSearch;
            this.$post(slow_insert_batch_url, this.editFormData).then(res => {
              if (res.code == '200') {
                this.success('保存成功!', () => {
                  this.modal.modal_loading = false;
                  this.modal.visible = false;
                  this.drugListGrid.refresh();
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
          this.modal.modal_loading = false;
        },
        //状态更新
        statusUpdate: function(data) {
          this.$post(special_status_update_url, data).then(res => {
            if (res.code == '200') {
              this.success('成功!', () => {
                this.drugListGrid.refresh();
              });
            } else {
              // 提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        },
        //批量更改
        batch: function () {
          this.modalDrug.isNew = false;
          if (this.drugs.length == 0){
            this.modalDrug.visible = false;
            this.warn('请勾选药品');
          }  else {
            var ids = [];
            for (let i = 0; i< this.drugs.length; i++){
              ids[i] = this.drugs[i].id;
            }
            this.editDrugFormData = {};
            this.editDrugFormData.ids = ids;
            this.editDrugForm.option('formData', this.editDrugFormData);
            this.modalDrug.visible = true;
          }
        },
        //编辑药品
        edit: function (data) {
          this.modalDrug.isNew = true;
          let tempData={};
          for (let key in data)
          {
            tempData[key]=data[key];
          }
          this.editDrugFormData = tempData;
          this.editDrugForm.option('formData', this.editDrugFormData);
          this.modalDrug.visible = true;
        },
        //编辑取消
        editDrugCancel: function () {
          this.modalDrug.visible = false;
        },
        //编辑保存
        DrugSubmit: function () {
          if (!this.editDrugForm.validate().isValid) {
            this.warn('信息不完整');
            this.modalDrug.modal_loading = false;
            return;
          };
          if (this.editDrugFormData.planNumWarn > this.editDrugFormData.planNum) {
            this.warn('警示额超过计划额');
            this.modalDrug.modal_loading = false;
            return;
          }
            this.$post(slow_update_batch_url, this.editDrugFormData).then(res => {
              if (res.code == '200') {
                this.success('保存成功!', () => {
                  this.modalDrug.modal_loading = false;
                  this.modalDrug.visible = false;
                  this.drugListGrid.refresh();
                });
              }
              else {
                //提示信息
                this.warn(res.msg);
              }
            }).catch(err => {
              this.error(err);
            });
          this.modalDrug.modal_loading = false;
        },
      },
    }
</script>
