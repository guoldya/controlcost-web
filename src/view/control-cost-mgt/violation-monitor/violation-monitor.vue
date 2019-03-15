<style scoped>

</style>

<template>
  <div>
    <Row>
      <Card>
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
          <div id="window-violation" class="margin-top-10"></div>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';

  let window_violatio_url = 'sys/coreRuleExecute/selectSinglePage';
  let dept_list_url = 'sys/bdDept/selectList';
  let dept_url = 'sys/bdDept/selectByMap';
  let sick_person_url = 'sys/coreRuleExecute/selectEmpiByIndex';
  let doc_target_url = 'sys/coreRuleExecute/selectRepeatedDc';
  let doc_detail_url = 'sys/sysUser/selectOne';
  export default {
    data() {
      return {
        dateTime: [],
        isLoadData: true,
        docCode: "",
        outCode: "",
        violated: "",
        doc: {doc: "doc"},
        backState: null,
        bizEmpipId: null,
        dateCrLevel: null,
        searchForm:{},
        searchFormData:{violated:1},
        infoKey:[],
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        windowViolationData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              loadOptions.searchData = {violated: 1};
            }
            return this.CommDs.loadPage(loadOptions, window_violatio_url, this.isLoadData, {roleType: 0}, this.windowViolation);
          },
        }),
        deptData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(dept_url, {dcode: key});
          },
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              return this.CommDs.loadList(dept_list_url);
            }else {
              return this.CommDs.loadList(dept_list_url,loadOptions.searchData);
            }
          }
        }),
        sickPersonData: new this.customstore({
          load: (e) => {
            return this.CommDs.loadList(sick_person_url);
          }
        }),
        docTypeData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(doc_detail_url, {account: key});
          },
          load: (loadOptions) => {
            if (loadOptions.searchData == null){
              return this.CommDs.loadList(doc_target_url,this.doc);
            } else {
              return this.CommDs.loadList(doc_target_url,loadOptions.searchData);
            }
          }
        }),
      }
    },
    mounted() {
      let _this = this;
      this.jumpFrom();
      this.searchForm=$("#searchForm").dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'outCode',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.deptData,
              placeholder: '请输入处理科室',
              displayExpr: 'dname',
              valueExpr: 'dcode',
              searchEnabled: true,
              showClearButton:true,
              onOptionChanged: function (e) {
                if(e.name == "text"){
                  if(typeof (e.value) == 'string'){
                    e.component.getDataSource().loadOptions().searchData = {dname:e.value};
                  }
                }
              },
              onClosed: function(e){
                e.component.getDataSource().loadOptions().searchData = {};
              },
              // onFocusOut:function (e) {
              //   e.component.getDataSource().loadOptions().searchData = {};
              // }
            },
            label: {
              alignment: 'right',
              text: '科室'
            },
          },
          {
            dataField: 'itemName',
            editorOptions: {
              placeholder: '请输入项目名称',
            },
            label: {
              alignment: 'right',
              text: '项目名称'
            },
          },
          {
            dataField: 'empiName',
            editorOptions: {
              placeholder: '请输入患者姓名',
            },
            label: {
              alignment: 'right',
              text: '患者姓名'
            },
          },
          {
            dataField: 'account',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.docTypeData,
              placeholder: '请选择开单医生',
              displayExpr: 'name',
              valueExpr: 'account',
              searchEnabled: true,
              showClearButton:true,
              onOptionChanged: function (e) {
                if(e.name == "text"){
                  if(typeof (e.value) == 'string'){
                    e.component.getDataSource().loadOptions().searchData = {name:e.value,doc:'doc'};
                  }
                }
              },
              onClosed:function (e) {
                e.component.getDataSource().loadOptions().searchData = {doc:'doc'};
              }
            },
            label: {
              alignment: 'right',
              text: '开单医生'
            },
          },
          {
            dataField: 'crName',
            editorOptions: {
              placeholder: '请输入规则名称',
            },
            label: {
              alignment: 'right',
              text: '规则名称'
            },
          },
          {
            dataField: 'auditState',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.newAuditStatus,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '处理结果'
            },
          },
          {
            dataField: 'crLevel',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.controlState,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '控制方式'
            },
          },
          {
            dataField: 'createBy',
            label: {
              alignment: 'right',
              text: '申请时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');
      this.windowViolation = $('#window-violation').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        //wordWrapEnabled: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single',
        },
        hoverStateEnabled: true,
        dataSource: {
          store: this.windowViolationData
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
              opcol.items = [{
                text: '查看',
                showtip: false,
                id: {
                  id: options.data.id,
                  ocode: options.data.ocode,
                },
                click: this.look
              }];
              opcol.$mount('#t1');
            },
            width: 80,
          },
          {
            dataField: 'id',
            caption: '编码',
            alignment: 'right',
            width: 80,
          },
          {
            dataField: 'deptName',
            caption: '科室',
            alignment: 'left',
            width: 100
          },
          {
            caption: '项目名称',
            dataField: 'itemName',
            alignment: "left",
            minWidth: 100,
          },
          {
            caption: '患者姓名',
            dataField: 'empiName',
            alignment: "left",
            width: 100,
          },
          {
            dataField: 'docName',
            caption: '开单医生',
            alignment: 'left',
            // lookup: {
            //   dataSource: this.docTypeData,
            //   displayExpr: 'name',
            //   valueExpr: 'id',
            // },
            width: 100
          },
          {
            caption: '违反规则名称',
            dataField: 'crName',
            alignment: "left",
            minWidth: 120
          },
          {
            caption: '处理结果',
            dataField: 'auditState',
            alignment:"center",
            lookup: {
              dataSource: this.enum.violationAuditState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            cellTemplate(e,o){
              if(o.data.auditState==3) {
                e.append( "<p style='color:red'>"+o.text+"</p>");
              }else {
                e.append( "<p >"+o.text+"</p>");
              }
            },
            width:80,
          },
          {
            caption: '控制方式',
            dataField: 'crLevel',
            alignment: "center",
            width: 80,
            lookup: {
              dataSource: this.enum.controlState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            cellTemplate(e, o) {
              if (o.data.crLevel == 1) {
                e.append("<p style='color:orange'>" + o.text + "</p>");
              } else if (o.data.crLevel == 2) {
                e.append("<p style='color:purple'>" + o.text + "</p>");
              } else if (o.data.crLevel == 3) {
                e.append("<p style='color:red'>" + o.text + "</p>");
              } else {
                e.append("<p >" + o.text + "</p>");
              }
            }
          },
          {
            caption: '申请时间',
            dataField: 'createBy',
            alignment: "left",
            format: "yyyy-MM-dd HH:mm",
            dataType: "datetime",
            width: 110,
          },
        ]
      }).dxDataGrid('instance');
      this.jumpFind();
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
      search: function () {
        var ds = this.windowViolation.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.loadOptions().searchData.violated = 1;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.createBy = '';
        this.searchForm.resetValues();
        this.windowViolation.refresh();
      },
      //违规分析跳转数据
      jumpFrom: function () {

        //获取时间
        if (this.$route.query.dateStart){
          this.dateTime[0] = this.$route.query.dateStart;
          this.dateTime[1] = this.$route.query.dateEnd;
          this.searchFormData.createBy = this.dateTime;
        } else if (this.$route.query.dateBefore){
          this.dateTime[0] = this.$route.query.dateBefore;
          this.dateTime[1] = this.$route.query.dateAfter;
          this.searchFormData.createBy = this.dateTime;
        }
        //获取紫色规则黄色规则蓝色
        if (this.$route.query.crLevel) {
          this.searchFormData.crLevel = Number(this.$route.query.crLevel);
        }
        //医生编码
        if (this.$route.query.docCode) {
          this.searchFormData.account = this.$route.query.docCode;
        }
        //科室编码
        if (this.$route.query.outCode) {
          this.searchFormData.outCode = this.$route.query.outCode;
        }
        if (this.$route.query.auditState) {
          this.searchFormData.auditState = this.$route.query.auditState;
        }
        this.searchFormData.violateDataState = 1;
        this.searchFormData.violated = 1;
      },
      jumpFind:function() {
        var ds = this.windowViolation.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      look: function (data) {
        let params = data;
        if (this.$route.query.dateBefore) {
          params.dateBefore = this.$route.query.dateBefore;
          params.dateAfter = this.$route.query.dateAfter;
          params.crLevel = Number(this.$route.query.crLevel);
        }
        if (this.$route.query.dateStart) {
          params.dateStart = this.$route.query.dateStart;
          params.dateEnd = this.$route.query.dateEnd;
          if (this.$route.query.crLevel){
            params.crLevel = Number(this.$route.query.crLevel);
          }
          params.violated = this.$route.query.violated;
          params.docCode = this.$route.query.docCode;
          params.docName = this.$route.query.docName;
        }
        const route = {
          query: params,
          name: 'violation-monitor-detail',
          path: 'violation-monitor-detail',
          component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor-detail.vue')
        };
        this.$router.push(route)
      },
    }
  }
</script>

