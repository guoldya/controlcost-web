<style lang="less">
  @import "../../../../styles/common.less";
</style>
<template>
    <div>
        <Card dis-hover style="margin-bottom: 5px; ">
          <p slot="title">慢病患者用药查询</p>
          <Row class="slow-inquire">
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
            <div id="slow-patient-grid"></div>
          </Row>
        </Card>
        <Card dis-hover>
          <p slot="title">用药记录</p>
          <Row class="margin-top-10">
            <div id="inquire-record-grid"></div>
          </Row>
        </Card>
    </div>
</template>

<script>
  import Vue from 'vue';
  let slow_query_list_url = 'sys/coreRuleExecute/selectRuleExecuteVoPage';
  let slow_query_record_url = 'sys/coreRuleExecute/selectMedRecord';
    export default {
        name: "slow-patient-inquire",
      data() {
          return {
            isLoadData: true,
            searchForm: {},
            searchFormData: {},
            recordForm: {},
            recordFormData: {},
            list: {},
            patientNo: true,
            hospitalNo: false,
            insCls:null,
            itemName:null,
            itemCode: null,
            spec:null,
            recTime:'',
            slowPatientGridData: new this.customstore({
              load: (loadOptions) =>{
                if (loadOptions.searchData == null){
                  loadOptions.searchData = {dtype: 2};
                }
                return this.CommDs.loadPage(loadOptions, slow_query_list_url, this.isLoadData, {}, this.slowPatientGrid);
              }
            }),

            inquireRecordGridData: new this.customstore({
              load: (loadOptions) =>{
                if (loadOptions.searchData == null){
                  let deferred = $.Deferred();
                  return deferred.resolve([], {totalCount: 0 });
                }else {
                  return this.CommDs.loadPage(loadOptions, slow_query_record_url, this.isLoadData, {}, this.inquireRecordGrid);
                }
              }
              // load:this.RecordGridData,
            }),
          }
      },
      mounted(){
          let _this = this;
        this.defaultSearch();
        this.searchForm = $('#searchForm').dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'mhdName',
              label: {
                alignment: 'right',
                text: '患者姓名'
              },
              editorOptions: {
                placeholder:'请输入患者姓名搜索'
              },
              validationRules: [{
                type: "required",
                message: "请输入患者姓名"
              }]
            },
            {
              dataField: 'itemName',
              label: {
                alignment: 'right',
                text: '药品名称',
              },
              editorOptions: {
                placeholder: '请输入药品名称搜索',
              },
            },
            {
              dataField: 'scope',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'right',
                text: '来源',
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.dxScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },
            {
              dataField: 'hisType',
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
              dataField: 'slRule',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'right',
                text: '查询规则'
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.queryRules,
                displayExpr: 'text',
                valueExpr: 'id',
                onValueChanged(e) {
                  if (e.value == null){
                    return;
                  }else if (e.value == 1) {
                    _this.searchForm.itemOption('createYear', 'visible', true);
                    _this.searchForm.itemOption('createMonth', 'visible', false);
                    _this.searchFormData.createMonth = null;
                    _this.searchForm.itemOption('createDay', 'visible', false);
                    _this.searchFormData.createDay = null;
                    _this.searchForm.itemOption('createRange', 'visible', false);
                    _this.searchFormData.createRange = null;
                  } else if (e.value == 2) {
                    _this.searchForm.itemOption('createYear', 'visible', false);
                    _this.searchFormData.createYear = null;
                    _this.searchForm.itemOption('createMonth', 'visible', true);
                    _this.searchForm.itemOption('createDay', 'visible', false);
                    _this.searchFormData.createDay = null;
                    _this.searchForm.itemOption('createRange', 'visible', false);
                    _this.searchFormData.createRange = null;
                  } else if (e.value == 3) {
                    _this.searchForm.itemOption('createYear', 'visible', false);
                    _this.searchFormData.createYear = null;
                    _this.searchForm.itemOption('createMonth', 'visible', false);
                    _this.searchFormData.createMonth = null;
                    _this.searchForm.itemOption('createDay', 'visible', true);
                    _this.searchForm.itemOption('createRange', 'visible', false);
                    _this.searchFormData.createRange = null;
                  } else if (e.value ==4) {
                    _this.searchForm.itemOption('createYear', 'visible', false);
                    _this.searchFormData.createYear = null;
                    _this.searchForm.itemOption('createMonth', 'visible', false);
                    _this.searchFormData.createMonth = null;
                    _this.searchForm.itemOption('createDay', 'visible', false);
                    _this.searchFormData.createDay = null;
                    _this.searchForm.itemOption('createRange', 'visible', true);
                  }
                }
              },
            },
            {
              dataField: 'createYear',
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
              dataField: 'createMonth',
              visible:false,
              label: {
                alignment: 'right',
                text: '月份',
              },
              editorType: "dxSelectBox",
              editorOptions: {
                placeholder: '请选择月份',
                dataSource: this.getMonth(),
                valueExpr: 'id',
                displayExpr: 'text',
              },
            },
            {
              dataField: 'createDay',
              visible:false,
              label: {
                alignment: 'right',
                text: '日期',
              },
              editorType: "dxSelectBox",
              editorOptions: {
                placeholder: '请选择日期',
                dataSource: this.getDay(),
                valueExpr: 'id',
                displayExpr: 'text',
              },
            },
            {
              dataField: 'createRange',
              visible:false,
              label: {
                alignment: 'right',
                text: '时间区间',
              },
              template: this.addDateRange,
            },
          ]
        }).dxForm('instance');

        this.slowPatientGrid = $('#slow-patient-grid').dxDataGrid({
          showBorders: true,
          showRowLines: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
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
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText: '共{1}页/{2}数据',
          },
          hoverStateEnabled: true,
          dataSource: {
            store: this.slowPatientGridData,
          },
          onContentReady: (e) => {
            e.component.selectRowsByIndexes([0]);
          },
          onSelectionChanged:(e)=>{
            if (e.selectedRowKeys[0]) {
              this.insCls = e.selectedRowKeys[0].insCls;
              this.itemName = e.selectedRowKeys[0].itemName;
              this.itemCode = e.selectedRowKeys[0].insCode;
              this.spec = e.selectedRowKeys[0].spec;
              var ds = this.inquireRecordGrid.getDataSource();
              ds.loadOptions().searchData = {cbdId:e.selectedRowKeys[0].cbdId,insCode:e.selectedRowKeys[0].insCode,pid:e.selectedRowKeys[0].pid,
                planYears:e.selectedRowKeys[0].planYears,recTime:this.recTime,insCls:e.selectedRowKeys[0].insCls,form:e.selectedRowKeys[0].form,
              spec:e.selectedRowKeys[0].spec,unit:e.selectedRowKeys[0].unit};
              ds.reload();
            }else {
              var ds = this.inquireRecordGrid.getDataSource();
              ds.loadOptions().searchData = null;
              ds.reload();
            }
          },
          columns: [
            {
              dataField: 'opNo',
              caption: '门诊号',
              alignment: 'right',
              width: 100,
            },
            {
              dataField: 'empiName',
              caption: '患者姓名',
              minWidth: 150,
            },
            {
              dataField: 'itemName',
              caption: '药品名称',
              minWidth: 150,
              cellTemplate: (container,options) =>{
                container.append( "<p>"+options.data.itemName+" "+options.data.spec+"</p>");
              }
            },
            {
              dataField: 'name1',
              caption: '病种名称',
              width: 150,
            },
            {
              dataField: 'audit',
              caption: '上次审批情况',
              alignment: 'center',
              cellTemplate: (container,options) => {
                if (options.data.audit == null){
                  return;
                }else{
                  let arr = options.data.audit.split(",");
                  let handlingResult = '';
                  let lastWord = options.data.creUnit;

                  let word = parseInt(arr[1]);
                  let curTime = new Date(options.data.createBy);
                  let createBy = curTime.getFullYear()+'-'+(curTime.getMonth()+1)+'-'+curTime.getDate();
                  let auditTime = new Date(options.data.auditBy);
                  let auditBy = auditTime.getFullYear()+'-'+(auditTime.getMonth()+1)+'-'+auditTime.getDate();
                  container.append('<div id=\'t1\'/>');
                  var diseasePoptip = new (Vue.component('diseasePoptip'));
                  if (arr[0] == 2){
                    handlingResult = '通过';
                    let text = word+lastWord;
                    diseasePoptip.items = [
                      {createBy:createBy,auditBy:auditBy,auditName:options.data.auditUserName,handlingResult:handlingResult,text:text,color:'#00A854'}
                    ];
                  }else if (arr[0] == 1) {
                    handlingResult = '未审核';
                    let text = word+lastWord;
                    diseasePoptip.items = [
                      {createBy:createBy,auditBy:auditBy,auditName:options.data.auditUserName,handlingResult:handlingResult,text:text,color:'orange'}
                    ];
                  }
                  diseasePoptip.$mount('#t1');
                }

              },
              width: 130
            },
            {
              dataField: 'overNumYear',
              caption: '年剩余用量',
              alignment: 'right',
              width: 130,
            },
            {
              dataField: 'realUseYear',
              caption: '年实际用量',
              alignment: 'right',
              width: 130,
            },

            {
              dataField: 'overNumMonth',
              caption: '月剩余用量',
              alignment: 'right',
              visible: false,
              width: 130,
            },
            {
              dataField: 'realUseMonth',
              caption: '月实际用量',
              alignment: 'right',
              visible: false,
              width: 130,
            },

            {
              dataField: 'overNumDay',
              caption: '日剩余用量',
              alignment: 'right',
              visible: false,
              width: 130,
            },
            {
              dataField: 'realUseDay',
              caption: '日实际用量',
              alignment: 'right',
              visible: false,
              width: 130,
            },

            {
              dataField: 'scope',
              caption: '来源',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.dxScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width: 80,
            },
            {
              dataField: 'insCls',
              caption: '险种类別',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.dxInsCls,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              width: 150,
            },
          ]
        }).dxDataGrid('instance');

        this.inquireRecordGrid = $('#inquire-record-grid').dxDataGrid({
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
            infoText: '共{1}页/{2}数据',
          },
          selection: {
            mode: 'single',
          },
          hoverStateEnabled: true,
          // onSelectionChanged:(e)=>{
          //   this.allList = e.selectedRowKeys[0];
          // },
          dataSource: {
            store: this.inquireRecordGridData,
          },
          columns: [
            {
              caption: '操作',
              alignment: 'center',
              cellTemplate: (container,options) => {
                container.append('<div id="t1"/>');
                var opcol = new (Vue.component('OpCol'));
                opcol.items = [
                  {text: '查看详情', showtip: false, id:options.data, click: this.detail},
                ];
                opcol.$mount('#t1');
              },
              width:100
            },
            {
              dataField: 'itemName',
              caption: '药品名称',
              minWidth: 100
            },
            {
              dataField: 'num',
              caption: '数量',
              alignment:'right',
              width:100
            },
            {
              dataField: 'unit',
              caption: '单位',
              alignment: 'center',
              width:100
            },
            {
              dataField: 'insFee',
              caption: '提醒金额',
              alignment:'right',
              width:200
            },
            {
              dataField: 'auditState',
              caption: '审批结果',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.violationAuditState,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              cellTemplate(container,options){
                if(options.data.auditState==1) {
                  container.append( "<p style='color:orange'>"+options.text+"</p>");
                }else if(options.data.auditState==2){
                  container.append( "<p style='color: #00A854'>"+options.text+"</p>");
                }
                else  if(options.data.auditState==3){
                  container.append( "<p style='color:red'>"+options.text+"</p>");
                }
              },
              width:130
            },
            // {
            //   dataField: 'auditUserName',
            //   caption: '审批人',
            //   width:100
            // },
            {
              dataField: 'auditBy',
              caption: '审批时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:200
            },
            {
              dataField: 'billingTime',
              caption: '开单时间',
              alignment: 'left',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width: 200
            },
          ]
        }).dxDataGrid('instance');


      },
      methods: {
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
        getMonth(){
          let date=new Date();
          let year=date.getFullYear();
          let month = [];
          for (let i = 1;i<=12;i++){
            month[i] = i;
          }
          let monthArray=[];
          for(let j=1;j<=month.length;j++){
            let setMonth = null;
            if (j<10){
              setMonth = '0'+j;
            } else {
              setMonth = j;
            }
            monthArray.push({
              "id":j,
              "text":year + '-'+ setMonth,
            });
          }
          return monthArray;
        },
        getDay(){
          let date=new Date;
          let year=date.getFullYear();
          let month=date.getMonth()+1;
          let day = new Date(year, month, 0).getDate();
          let dayArray=[];
          for(let i=day;i>0;i--){
            let setDay = null;
            if (day-i+1<10){
              setDay = '0'+(day-i+1);
            }else {
              setDay = day-i+1;
            }
            dayArray.push({
              "id":day-i+1,
              "text":(year)+'-'+(month)+'-'+setDay,
            });
          }
          return dayArray;
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
        //查询
        search: function () {
          if (!this.searchForm.validate().isValid) {
            this.warn('请输入患者姓名');
            return;
          }
          var ds = this.slowPatientGrid.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.loadOptions().searchData.dtype = 2;
          ds.reload();
          if (this.searchFormData.slRule == 1){
            this.recTime = ''+this.searchFormData.createYear;
            $("#slow-patient-grid").dxDataGrid("columnOption", "年剩余用量", "visible", true);
            $("#slow-patient-grid").dxDataGrid("columnOption", "年实际用量", "visible", true);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "实际用量", "visible", false);
          }else if (this.searchFormData.slRule == 2){
            let date=new Date();
            let year=date.getFullYear();
            let mon = this.searchFormData.createMonth;
            if (mon<10){
              mon = '0'+mon;
            }
            this.recTime = year + '-'+ mon;
            $("#slow-patient-grid").dxDataGrid("columnOption", "年剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "年实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月剩余用量", "visible", true);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月实际用量", "visible", true);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "实际用量", "visible", false);
          } else if (this.searchFormData.slRule == 3){
            let date=new Date();
            let year=date.getFullYear();
            let month=date.getMonth()+1;
            let day = this.searchFormData.createDay;
            if (month<10){
              month = '0'+month;
            };
            if (day<10){
              day = '0'+(day);
            }else {
              day = day;
            }
            this.recTime = year + '-'+ month+ '-'+day;
            $("#slow-patient-grid").dxDataGrid("columnOption", "年剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "年实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日剩余用量", "visible", true);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日实际用量", "visible", true);
            $("#slow-patient-grid").dxDataGrid("columnOption", "实际用量", "visible", false);
          }else if (this.searchFormData.slRule == 4){
            this.recTime = this.searchFormData.createRange.toString();
            $("#slow-patient-grid").dxDataGrid("columnOption", "年剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "年实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "月实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日剩余用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "日实际用量", "visible", false);
            $("#slow-patient-grid").dxDataGrid("columnOption", "实际用量", "visible", true);
          }
        },
        //默认查询
        defaultSearch:function(){
          let date=new Date();
          let year=date.getFullYear();
          this.searchFormData.slRule = 1;
          this.searchFormData.createYear = year;
          this.recTime = ''+year;
        },
        //重置
        resetSearch: function () {
          if (this.$refs.dateRange) {
            this.$refs.dateRange.values = null;
          }
          this.searchFormData.createRange =null;
          this.searchForm.resetValues();
          this.defaultSearch();
           this.slowPatientGrid.refresh();
          $("#slow-patient-grid").dxDataGrid("columnOption", "年剩余用量", "visible", true);
          $("#slow-patient-grid").dxDataGrid("columnOption", "年实际用量", "visible", true);
          $("#slow-patient-grid").dxDataGrid("columnOption", "月剩余用量", "visible", false);
          $("#slow-patient-grid").dxDataGrid("columnOption", "月实际用量", "visible", false);
          $("#slow-patient-grid").dxDataGrid("columnOption", "日剩余用量", "visible", false);
          $("#slow-patient-grid").dxDataGrid("columnOption", "日实际用量", "visible", false);
          $("#slow-patient-grid").dxDataGrid("columnOption", "实际用量", "visible", false);
          this.searchForm.itemOption('createYear', 'visible', true);
          this.searchForm.itemOption('createMonth', 'visible', false);
          this.searchForm.itemOption('createDay', 'visible', false);
          this.searchForm.itemOption('createRange', 'visible', false);
        },
        //点击查看详情
        detail: function (data) {
          // Bus.$emit('val', data);
          data.dtype = 2;
          const route = {
            query: data,
            // query: {
            //   dtype: 2,
            //   // id:data.id,
            //   pid:data.pid,
            //   // insCls : this.insCls,
            //   // itemName :this.itemName,
            //   // itemCode :this.itemCode,
            //   // spec :this.spec,
            // },
            path: 'patient-inquire-detail',
            name: 'patient-inquire-detail',
            component: () => import('@/view/disease-mgt/slow-disease/slow-patient-inquire/patient-inquire-detail.vue')
          };
          this.$router.push(route)
        },
      },
    }
</script>

