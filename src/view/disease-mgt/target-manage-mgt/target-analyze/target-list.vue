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

  let doc_target_url = 'sys/coreBdIndicator/selectRepeatDe';
  let doc_detail_url = 'sys/sysUser/selectOne';
  let window_violatio_url = 'sys/coreBdIndicator/selectByPage';
  let dept_list_url = 'sys/bdDept/selectList';
  let dept_url = 'sys/bdDept/selectByMap';
  let sick_person_url = 'sys/coreRuleExecute/selectEmpiByIndex';
  let cbiId_list_url = 'sys/coreBdIndicator/selectList';
  let cbiId_key_url = 'sys/coreBdIndicator/selectOne';
  export default {
    data() {
      return {
        dateTime: [],
        isLoadData: true,
        violated: 1,
        doc: {doc: "doc"},
        docCode: null,
        outCode: null,
        searchForm: {},
        searchFormData: {},
        infoKey: [],
        iId: null,
        backState: null,
        bizEmpipId: null,
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
            return this.CommDs.loadPage(loadOptions, window_violatio_url, this.isLoadData, {}, this.windowViolation);
          },
        }),
        deptData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(dept_url, {dcode: key});
          },
          load: (e) => {
            return this.CommDs.loadList(dept_list_url);
          }
        }),
        docTypeData: new this.customstore({
          key: "docCode",
          byKey: (key) => {
            return this.CommDs.loadByKey(doc_detail_url, {account: key});
          },
          load: (e) => {
            return this.CommDs.loadList(doc_target_url, this.doc);
          }
        }),
        sickPersonData: new this.customstore({
          load: (e) => {
            return this.CommDs.loadList(sick_person_url);
          }
        }),
        getCbiIdData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(cbiId_key_url, {id: key});
          },
          load: (e) => {
            return this.CommDs.loadList(cbiId_list_url, {status: 1});
          }
        }),
      }
    },
    mounted() {
      let _this = this;
      this.jumpFrom();
      this.searchForm = $("#searchForm").dxForm({
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
              placeholder: '请输入开单医生',
              displayExpr: 'name',
              valueExpr: 'docCode',
            },
            label: {
              alignment: 'right',
              text: '开单医生'
            },
          },
          {
            dataField: 'iId',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.getCbiIdData,
              placeholder: '请选择指标名称',
              displayExpr: 'name',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '指标名称'
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
            dataField: 'auditState',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.handlingResult,
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
            dataField: 'createBy',
            label: {
              alignment: 'right',
              text: '创建时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');
      this.windowViolation = $('#window-violation').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        // wordWrapEnabled: true,
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
            caption: 'ID',
            dataField: 'id',
            alignment: "left",
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
            width: 100,
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
            width: 100
          },
          {
            dataField: 'iId',
            caption: '违反指标名称',
            alignment: 'left',
            lookup: {
              dataSource: this.getCbiIdData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width: 130,
          },
          {
            caption: '违反规则名称',
            dataField: 'crName',
            alignment: "left",
            minWidth: 120
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
            caption: '处理结果',
            dataField: 'auditState',
            alignment: "center",
            width: 80,
            lookup: {
              dataSource: this.enum.violationAuditState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            cellTemplate(e, o) {
              if (o.data.auditState == 3) {
                $(e).html("<p style='color:red'>" + o.text + "</p>");
              } else {
                $(e).text(o.text);
              }
            }
          },
          {
            caption: '创建时间',
            dataField: 'createBy',
            alignment: "left",
            width: 130,
          },
        ]
      }).dxDataGrid('instance');
      var ds = this.windowViolation.getDataSource();
      ds.loadOptions().searchData = this.searchFormData;
      ds.reload();
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
        // console.log(this.searchFormData);
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.createBy = '';
        this.searchForm.resetValues();
        this.windowViolation.refresh();
      },
      jumpFrom:function(){
        let params = {};
        if (this.$route.query.dateStart || this.$route.query.dateEnd) {
          this.dateTime[0] = this.$route.query.dateStart;
          this.dateTime[1] = this.$route.query.dateEnd;
          this.searchFormData.createBy = this.dateTime;
        }
        if (this.$route.query.docCode) {
          this.searchFormData.account = this.$route.query.docCode;
        }
        if (this.$route.query.outCode) {
          this.searchFormData.outCode = this.$route.query.outCode;
        }
        if ($.trim(this.dateTime).length > 0) {
          this.searchFormData.createBy = this.dateTime;
        }
        if (this.$route.query.iId) {
          this.searchFormData.iId = Number(this.$route.query.iId);
        }
        // this.searchFormData.violated = 1;
      },
      look: function (data) {
        let params = {};
        params.id = data.id;
        params.ocode = data.ocode;
        if (this.$route.query.dateStart || this.$route.query.dateEnd) {
          params.dateStart = this.$route.query.dateStart;
          params.dateEnd = this.$route.query.dateEnd;
        }
        if (this.$route.query.docCode) {
          params.account = this.$route.query.docCode;
        }
        if (this.$route.query.outCode) {
          params.outCode = this.$route.query.outCode;
        }
        if (this.$route.query.iId) {
          params.iId = this.$route.query.iId;
        }
        if (this.$route.query.violated) {
          params.violated = this.$route.query.violated;
        }
        const route = {
          name: 'target-detail',
          path: 'target-detail',
          query: params,
          component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-detail.vue')
        };
        this.$router.push(route)
      }
    }
  }
</script>

