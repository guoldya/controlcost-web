<template>
    <div>
      <Row>
        <Col span="8" style="padding-right: 5px">
          <Card dis-hover>
            <p slot="title">患者列表</p>
            <Row class="margin-top-10">
              <div id="patient-grid"></div>
            </Row>
          </Card>
        </Col>
        <Col span="16">
          <Card dis-hover>
            <p slot="title">违规指标</p>
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
              <div id="patient-list-grid"></div>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
</template>

<script>
  import Vue from 'vue';
 let select_patient_url = 'sys/coreRuleExecute/selectEmpiInfo';
 let select_patient_list_url = 'sys/coreRuleExecute/selectByPage';
    export default {
        name: "historical-monitor",
      data() {
          return{
            isLoadData: true,
            searchForm: {},
            searchFormData: {},
            editForm: {},
            editFormData: {},
            list: [],
            patientGrid: {},
            bizEmpipId:null,
            ipNo: null,
            opNo: null,
            patientGridData: new this.customstore({
              load: (loadOptions) =>{
                return this.CommDs.loadList(select_patient_url,{docCode:localStorage.user});
              }
            }),
            patientListGrid: {},
            patientListGridData: new this.customstore({
              load: (loadOptions) =>{
                if (loadOptions.searchData == null){
                  let deferred = $.Deferred();
                  return deferred.resolve([], {totalCount: 0 });
                }else {
                  return this.CommDs.loadPage(loadOptions, select_patient_list_url, this.isLoadData, {}, this.patientListGrid);
                  // return this.CommDs.loadList(select_patient_list_url,loadOptions.searchData);
                }
              }
            }),
          }
      },
      filters: {
        his_type: function (value) {
          if(value=="-1"){
            return "所有类型"
          }else if(value=="1"){
            return "医疗保险"
          }else if(value=="2"){
            return "工伤保险"
          }else if(value=="3"){
            return "生育保险"
          }else{
            return "未知"
          }
        },
        gender_if: function (value) {
          if(value=="1"){
            return "男"
          }else if(value=="2"){
            return "女"
          }else{
            return "未知"
          }
        },
        sourceType: function (value) {
          if(value=="1"){
            return "门诊"
          }else if(value=="2"){
            return "住院"
          }else if(value=="3"){
            return "全部"
          }else{
            return "未知"
          }
        },
        date_time: function (ms) {
          if(!ms){return;};
          let curTime = new Date(ms);
          let year = curTime.getFullYear();
          let month = curTime.getMonth() + 1;
          let day = curTime.getDate();
          let hours = curTime.getHours();
          let minutes = curTime.getMinutes();
          month = month <= 9 ? "0" + month : month;
          day = day <= 9 ? "0" + day : day;
          hours = hours <= 9 ? "0" + hours : hours;
          minutes = minutes <= 9 ? "0" + minutes : minutes;
          return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
        },
        deal_results: function (value) {

          if(value=="1"){
            return "未审核"
          }else if(value=="2"){
            return "通过"
          }else if(value=="3"){
            return "不通过"
          }else{
            return "未知"
          }
        },
        control_rule: function (value) {
          if(value=="1"){
            return "警告"
          }else if(value=="2"){
            return "审核"
          }else if(value=="3"){
            return "禁止"
          }else if(value=="4"){
            return "通过"
          }else{
            return "未知"
          }
        },
      },
      mounted() {
        this.searchForm = $('#searchForm').dxForm({
          colCount: 3,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'itemName',
              label: {
                alignment: 'right',
                text: '药品名称'
              },
            },
            {
              dataField: 'crLevel',
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
            },
            {
              dataField: 'createBy',
              label: {
                alignment: 'right',
                text: '发生时间'
              },
              template: this.addDateRange,
            },
          ]
        }).dxForm('instance');
        this.patientGrid = $('#patient-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          hoverStateEnabled: true,
          columnFixing: {
            enabled: true
          },
          searchPanel: {
            visible: true,
            width: 230,
            placeholder: '输入患者姓名|门诊号',
          },
          selection: {
            mode: 'single',
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
          onContentReady: (e) => {
            e.component.selectRowsByIndexes([0]);
          },
          onSelectionChanged:(e)=>{
            if (e.selectedRowKeys[0]){
              this.bizEmpipId = e.selectedRowKeys[0].bizEmpipId;
              this.ipNo = e.selectedRowKeys[0].ipNo;
              this.opNo = e.selectedRowKeys[0].opNo;
              var ds = this.patientListGrid.getDataSource();
              ds.loadOptions().searchData = {bizEmpipId:e.selectedRowKeys[0].bizEmpipId,ipNo:e.selectedRowKeys[0].ipNo,opNo:e.selectedRowKeys[0].opNo};
              ds.reload();
            }else{
              var ds = this.patientListGrid.getDataSource();
              ds.loadOptions().searchData = null;
              ds.reload();
            }
          },
          onToolbarPreparing: (e) => {
            e.toolbarOptions.items.unshift({
              location: "before",
              template: () => {
                return $('<div id=\'btn\'/>');
              }
            });
          },
          dataSource: {
            store: this.patientGridData,
          },
          columns: [
            {
              caption: '姓名',
              dataField: 'empiName',
              alignment: 'center',
              width:150
            },
            {
              caption: '门诊号',
              dataField: 'opNo',
              minWidth: 150
            },
            {
              caption: '住院号',
              dataField: 'ipNo',
              minWidth: 150
            },
          ]
        }).dxDataGrid('instance');
        this.patientListGrid = $('#patient-list-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          hoverStateEnabled: true,
          columnFixing: {
            enabled: true
          },
          selection: {
            mode: 'single'
          },
          dataSource: {
            store: this.patientListGridData,
          },
          remoteOperations: {
            filtering: true,
            // sorting: true,
            paging: true
          },
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText: '共{1}页/{2}数据',
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
                container.append('<div id=\'tcol1\'/>');
                var opcol = new (Vue.component('OpCol'));
                opcol.items = [
                  {text: '查看', showtip: false, id: options.data, click: this.detailView},
                ];
                opcol.$mount('#tcol1');
              },
              width: 90,
            },
            {
              caption: '药品名称',
              dataField: 'itemName',
              alignment: 'left',
              minWidth: 150,
            },
            {
              caption: '违反规则',
              dataField: 'crName',
              alignment: 'left',
              width: 150,
            },
            {
              caption:'提醒金额',
              dataField: 'insFee',
              alignment: 'left  ',
              width:150,
              cellTemplate: (container,options) => {
                let insF = Math.floor(options.data.insFee * 100) / 100;
                container.append("<span>"+parseFloat(insF)+"</span>");
              },
            },
            {
              caption: '医保办提示',
              dataField: 'crMessage',
              alignment: 'left',
              width: 150,
            },
            {
              dataField: 'crLevel',
              caption: '控制规则',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.controlRule,
                displayExpr: 'text',
                valueExpr: 'id'
              },
              cellTemplate(container,options){
                if(options.data.crLevel==1) {
                  container.append( "<p style='color:orange'>"+options.text+"</p>");
                }else if(options.data.crLevel==2){
                  container.append( "<p style='color:purple'>"+options.text+"</p>");
                } else  if(options.data.crLevel==3){
                  container.append( "<p style='color:red'>"+options.text+"</p>");
                }else{
                  container.append( "<p style='color: #00A854'>"+options.text+"</p>");
                }
              },
              width: 100
            },
            {
              caption: '发生时间',
              dataField: 'createBy',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width: 150,
            },
          ]

        }).dxDataGrid('instance');
      },
      methods: {
        addDateRange: function (data, itemElement) {
          itemElement.append('<div id=\'dateRange\'/>');
          var dateRange = new (Vue.component('DateRange'));
          dateRange.field = data;
          dateRange.$mount('#dateRange');
          dateRange.$parent = this;
          this.$refs.dateRange = dateRange;
        },

        search:function(){
          var ds = this.patientListGrid.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.loadOptions().searchData.bizEmpipId = this.bizEmpipId;
          ds.loadOptions().searchData.ipNo = this.ipNo;
          ds.loadOptions().searchData.opNo = this.opNo;
          ds.reload();
        },
        resetSearch:function () {
          this.searchForm.resetValues();
          this.searchFormData.createBy = "";
          this.patientListGrid.refresh();
        },
        detailView: function (data) {
          // console.log(data,'data');
          const route = {
             query: {
               bizEmpipId:data.bizEmpipId,
               ipNo:data.ipNo,
               opNo:data.opNo,
               id:data.id,
             },
            path: 'historical-detail',
            name: 'historical-detail',
            component: () => import('@/view/smart-monitor/historical-monitor/historical-detail.vue')
          };
          this.$router.push(route)
        }
      }
    }
</script>

<style scoped>

</style>
