<style scoped>

</style>

<template>
  <div>
    <Row>
      <Col>
        <Card>
          <Row>
            <Searchpanel ref="searchPanel">
              <div slot="form" class="margin-bottom-10" id="searchForm">
              </div>
              <div slot="control">
                <Button size="small" type="primary" @click="search">查询</Button>
                <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
              </div>
            </Searchpanel>
          </Row>
          <Row class="margin-top-10">
            <div id="window-check" class="margin-top-10"></div>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modal.visible" :mask-closable="false" width="550" title="编辑数据">
      <p slot="header">
        <span>撤销【{{list.itemName}}+{{list.crName}}】状态</span>
      </p>
      <Row>
        <Col span="24">
          <div id="back"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="backFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="backFormSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Vue from 'vue';

  let window_check_url = 'sys/coreRuleExecute/selectSinglePage';
  let update_back_url = 'sys/coreRuleExecute/UpdateDataState';
  //科室
  let dept_list_url = 'sys/bdDept/selectList';
  let dept_url = 'sys/bdDept/selectByMap';

  let doc_target_url= 'sys/coreRuleExecute/selectRepeatedDc';
  let doc_detail_url= 'sys/sysUser/selectOne';
  export default {
    data() {
      return {
        doc:{
          doc:"doc",
        },
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        backForm: {},
        backFormData: {},
        infoKey: [],
        list: {},
        singleBackData:{},
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        windowCheckData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              loadOptions.searchData = {crLevel: 2, violateDataState: 1};
            }
            return this.CommDs.loadPage(loadOptions, window_check_url, this.isLoadData, {
              roleType: 0,
            }, this.windowCheck);
          },
        }),
        deptData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(dept_url, {outCode: key});
          },
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              return this.CommDs.loadList(dept_list_url);
            }else {
              return this.CommDs.loadList(dept_list_url,loadOptions.searchData);
            }

          }
        }),
        docTypeData:new this.customstore({
          key: "docCode",
          byKey: (key) => {
            return this.CommDs.loadByKey(doc_detail_url, {account: key});
          },
          load: (loadOptions) =>{
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
      this.searchForm = $("#searchForm").dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
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
            dataField: 'createBy',
            label: {
              alignment: 'right',
              text: '申请时间'
            },
            template: this.addDateRange,
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
              placeholder: '请选择申请人姓名',
              displayExpr: 'name',
              valueExpr: 'docCode',
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
              text: '申请人'
            },
          },
          {
            dataField: 'outCode',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.deptData,
              placeholder: '请选择处理科室',
              displayExpr: 'dname',
              valueExpr: 'dcode',
              showClearButton:true,
              searchEnabled: true,
              onOptionChanged: function (e) {
                if(e.name == "text"){
                  if(typeof (e.value) == 'string'){
                    e.component.getDataSource().loadOptions().searchData = {dname:e.value};
                  }
                }
              },
              onClosed:function (e) {
                e.component.getDataSource().loadOptions().searchData = null;
              }
            },
            label: {
              alignment: 'right',
              text: '科室'
            },
          },
          {
            dataField: 'auditState',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.violationAuditState,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
    },
            label: {
              alignment: 'right',
              text: '审核结果'
            },
          },
          {
            dataField: 'violateDataState',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.queryDataState,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '撤销状态'
            },
          },
        ]
      }).dxForm('instance');
      this.backForm = $('#back').dxForm({
        colCount: 1,
        formData: this.backFormData,
        items: [
          {
            dataField:'cancelOpinion',
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text: '撤销原因',
            },
            editorOptions: {
              // maxLength: 64
            },
            validationRules: [{
              type: "required",
              message: "请输入撤销原因",
            }],
          },
        ],
      }).dxForm('instance');
      this.windowCheck = $('#window-check').dxDataGrid({
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
          store: this.windowCheckData
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
        onSelectionChanged: (selectedItems) => {
          let keys = selectedItems.selectedRowKeys;
          _this.infoKey = keys;
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
            allowResizing: false,
            allowFiltering: false,
            allowSorting: false,
            width: 100,
            cellTemplate: (container, options) => {
              //操作列
              container.append('<div id=\'t1\'/>');
              var opcol = new (Vue.component('OpCol'));
              //this.list = options.data;
              if (options.data.auditState == 1) {
                opcol.items = [{
                  text: '处理',
                  showtip: false,
                  id: {
                    id: options.data.id,
                    ocode: options.data.ocode,
                  },
                  click: this.look
                },
                ]
              } else if(options.data.auditState != 1 && options.data.dataState == 2){
                opcol.items = [{
                  text: '查看',
                  showtip: false,
                  id: {
                    id: options.data.id,
                    ocode: options.data.ocode,
                  },
                  click: this.look
                },
                  {
                    text: '撤销',
                    color: '#b0b0b0',
                    showtip: false,
                    //tip: '该数据已被撤销',
                    id: {id: options.data.id,listData:options.data},
                    click: this.tipFun,
                  }
                ];
              } else {
                opcol.items = [{
                  text: '查看',
                  showtip: false,
                  id: {
                    id: options.data.id,
                    ocode: options.data.ocode,
                  },
                  click: this.look
                },
                  {
                    text: '撤销',
                    color: '#ff9900',
                    showtip: false,
                    tip: '您确认撤销吗？',
                    id: {id: options.data.id,listData:options.data},
                    click: this.singleBack,
                  }
                ];
              }
              opcol.$mount('#t1');
            },
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment: "right",
            width: 80,
          },
          {
            caption: '项目名称',
            dataField: 'itemName',
            alignment: "left",
            width: 100,
          },
          {
            caption: '审核结果',
            dataField: 'auditState',
            alignment: "center",
            lookup: {
              dataSource: this.enum.violationAuditState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            width: 100,
          },
          {
            caption: '提醒金额',
            dataField: 'insFee',
            alignment: "right",
            width: 100,
          },
          {
            caption: '违法规则名称',
            dataField: 'crName',
            alignment: "left",
            minWidth: 140
          },
          {
            caption: '违规说明',
            dataField: 'crMessage',
            alignment: "left",
            minWidth: 120
          },
          {
            caption: '申请时间',
            dataField: 'createBy',
            alignment: "left",
            format: "yyyy-MM-dd HH:mm",
            dataType: "datetime",
            width: 110,
          },
          {
            caption: '申请人',
            dataField: 'docName',
            alignment: "left",
            width: 130,
          },
          {
            dataField: 'deptId',
            caption: '开单科室',
            lookup: {
              dataSource: this.deptData,
              displayExpr: 'dname',
              valueExpr: 'id',
            },
            width: 130
          },
          {
            caption: '患者姓名',
            dataField: 'empiName',
            alignment: "left",
            width: 130,
          },
        ]
      }).dxDataGrid('instance');
      this.visibles();
      this.jumpFind();
    },
    methods: {
      tipFun:function(){
        this.warn("该数据已被撤销，不能进行操作")
      },
      //页面跳转数据
      jumpFrom: function() {
        if ($.trim(this.$route.query.dateBefore).length> 0) {
          let date = [];
          date[0] = this.$route.query.dateBefore;
          date[1] = this.$route.query.dateAfter;
          this.searchFormData.createBy = date;
        }
        this.searchFormData.violateDataState = 1;
        this.searchFormData.auditStateMark =1;
        this.searchFormData.crLevel = 2;
        // this.searchFormData.auditState = 0;
        this.searchFormData.auditMark = this.$route.query.auditMark;
        if (this.$route.query.auditState) {
          this.searchFormData.auditState = Number(this.$route.query.auditState);
        }
      },
      //页面跳转执行
      jumpFind: function() {
        var ds = this.windowCheck.getDataSource();
        ds.loadOptions().searchData =  this.searchFormData;
        ds.reload();
      },
      //获取操作权限
      visibles: function () {
        if (localStorage.rolePage != 'health-care-dept') {
          $("#window-check").dxDataGrid("columnOption", "操作", "visible", false);
        }
      },
      addDateRange: function (data, itemElement) {
        itemElement.append('<div id=\'dateRange\'/>');
        var dateRange = new (Vue.component('DateRange'));
        dateRange.field = data;
        dateRange.$mount('#dateRange');
        dateRange.$parent = this;
        this.$refs.dateRange = dateRange;
      },
      search: function () {
        var ds = this.windowCheck.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.createBy = '';
        this.searchForm.resetValues();
        this.searchFormData.violateDataState= 1;
        // this.searchFormData.auditState= 0;
        this.searchForm.option('formData', this.searchFormData);
        this.windowCheck.refresh();
      },
      look: function (data) {
        let params = data;
        if (this.$route.query.dateBefore){
          params.dateBefore = this.$route.query.dateBefore;
          params.dateAfter = this.$route.query.dateAfter;
        };
        if (this.$route.query.auditState) {
          params.auditState = this.$route.query.auditState;
        }
        if (this.$route.query.auditMark) {
          params.auditMark = Number(this.$route.query.auditMark);
        }
        const route = {
          query: params,
          name: 'check-detail',
          path: 'check-detail',
          component: () => import('@/view/control-cost-mgt/check/check-detail.vue')
        };
        this.$router.push(route)
      },
      singleBack: function (data) {
        this.backFormData = {};
        this.backForm.option('formData', this.backFormData);
        this.modal.visible = true;
        this.modal.visible=true;
        this.list=data.listData;
        this.singleBackData.id=data.id;
      },
      backFormCancel: function () {
        this.modal.visible = false;
      },
      backFormSubmit: function () {
        if (!this.backForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.modal.visible=true;
        this.singleBackData.cancelOpinion=this.backFormData.cancelOpinion;
        this.singleBackData.violateDataState=2;
        this.$put(update_back_url,this.singleBackData).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.modal.visible=false;
              this.windowCheck.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
    }
  }
</script>
