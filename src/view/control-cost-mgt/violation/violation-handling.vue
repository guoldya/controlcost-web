<style scoped>

</style>

<template>
  <div>
    <Row>
      <Col>
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
      </Col>
    </Row>
    <Modal v-model="modal.visible" :mask-closable="false" width="550" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">批量撤销状态</span>
        <span v-else="modal.isNew">撤销【{{list.itemName}}+{{list.crName}}】状态</span>
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

  let window_violatio_url = 'sys/coreRuleExecute/selectSingleList';
  let all_pass_if_url = 'sys/coreRuleExecute/updateAuditState';
  //科室
  let dept_list_url = 'sys/bdDept/selectList';
  let dept_url = 'sys/bdDept/selectByMap';

  let doc_target_url = 'sys/coreRuleExecute/selectRepeatedDc';
  let doc_detail_url = 'sys/sysUser/selectOne';
  //撤销
  let back_state_url = 'sys/coreRuleExecute/UpdateDataState';
  export default {
    data() {
      return {
        doc: {doc: "doc"},
        isLoadData: true,
        searchForm: {},
        searchFormData: {violateDataState: 1},
        backForm: {},
        backFormData: {},
        infoKey: [],
        list: {},
        singleBackData: {},
        selections: 'multiple',
        allBackData: {},
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        windowViolationData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              loadOptions.searchData = {crLevel: 1, violateDataState: 1,};
            }
            return this.CommDs.loadPage(loadOptions, window_violatio_url, this.isLoadData, {roleType: 0}, this.windowViolation);
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
        docTypeData: new this.customstore({
          key: "docCode",
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
              placeholder: '请选择开单人',
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
              text: '开单人'
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
              searchEnabled: true,
              showClearButton:true,
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
              text: '处理结果'
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
            dataField: 'cancelOpinion',
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text: '撤销原因',
            },
            editorOptions: {
              maxLength: 50
            },
            validationRules: [{
              type: "required",
              message: "请输入撤销原因",
            }],
          },
        ],
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
          mode: this.selections,
          allowSelectAll: true,
          showCheckBoxesMode: 'always'
        },
        hoverStateEnabled: true,
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          });
        },
        dataSource: {
          store: this.windowViolationData
        },
        remoteOperations: {
          filtering: true,
          sorting: true,
          //paging: true
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
              if (options.data.auditState == 1) {
                this.btnPart.items[2].enabled=true;
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
              }else if(options.data.auditState != 1 && options.data.dataState == 2){
                this.btnPart.items[2].enabled=false;
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
                    click: this.tipFun,
                  }
                ];
              }
              else {
                this.btnPart.items[2].enabled=true;
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
                    id: {id: options.data.id, listData: options.data},
                    click: this.singleBack,
                  }
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100,
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
            width: 140,
          },
          {
            caption: '处理结果',
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
            width: 80,
            cellTemplate: (container, options) => {
              if (!options.data.insFee) {
                return;
              }
              let number = Math.floor(options.data.insFee * 100) / 100;
              container.append("<span>" + parseFloat(number) + "</span>");
            }
          },
          {
            caption: '违法规则名称',
            dataField: 'crName',
            alignment: "left",
            width: 220,
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
            caption: '开单人',
            dataField: 'docName',
            alignment: "left",
            width: 100,
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
            width: 100,
          },
        ]
      }).dxDataGrid('instance');
      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '批量通过', type: 'success', enabled: true, click: this.allPass},
        {id: 2, text: '批量不通过', type: 'primary', enabled: true, click: this.allNoPass},
        {id: 3, text: '批量撤销', enabled: true, click: this.allBack},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;
      this.visibles();
      this.jumpFind();

    },
    methods: {
      tipFun:function(){
        this.warn("该数据已被撤销，不能进行操作")
      },
      //页面跳转数据
      jumpFrom: function () {
        if ($.trim(this.$route.query.dateBefore).length > 0) {
          let date = [];
          date[0] = this.$route.query.dateBefore;
          date[1] = this.$route.query.dateAfter;
          this.searchFormData.createBy = date;
        }
        if (this.$route.query.auditState) {
          this.searchFormData.auditState = Number(this.$route.query.auditState);
        }
        this.searchFormData.violateDataState = 1;
        this.searchFormData.crLevel = 1;
      },
      //页面跳转执行
      jumpFind: function () {
        var ds = this.windowViolation.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      //操作权限
      visibles: function () {
        if (localStorage.rolePage !== 'health-care-dept') {
          this.windowViolation.option("onToolbarPreparing",'null');
          this.windowViolation.option("selection.mode", 'single');
          $("#window-violation").dxDataGrid("columnOption", "操作", "visible", false);
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
        var ds = this.windowViolation.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.createBy = '';
        this.searchForm.resetValues();
        this.searchFormData.violateDataState = 1;
        this.searchForm.option('formData', this.searchFormData);
        this.windowViolation.refresh();
      },
      look: function (data) {
        let params = {};
        params.id = data.id;
        params.ocode = data.ocode;
        if (this.$route.query.dateBefore) {
          params.dateBefore = this.$route.query.dateBefore;
          params.dateAfter = this.$route.query.dateAfter;
        }
        const route = {
          name: 'violation-detail',
          path: 'violation-detail',
          query: params,
          component: () => import('@/view/control-cost-mgt/violation/violation-detail.vue')
        };
        this.$router.push(route)
      },
      singleBack: function (data) {
        this.modal.isNew = false;
        this.backFormData.cancelOpinion = null;
        this.backForm.option('formData', this.backFormData);
        this.list = data.listData;
        this.singleBackData.id = data.id;
        this.modal.visible = true;
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
        this.singleBackData.cancelOpinion = this.backFormData.cancelOpinion;
        this.singleBackData.violateDataState = 2;
        this.$put(back_state_url, this.singleBackData).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.modal.visible = false;
              this.windowViolation.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      Pass: function (auditstate) {
        let ruleKeyList = [];
        let itemName=[];
        let Keys = this.windowViolation.getSelectedRowsData();
        if (Keys.length < 1) {
          this.warn('请勾选');
        }
        else {
          for (let Key in Keys) {
            if (Keys[Key].auditState != 1) {
              itemName.push(Keys[Key].itemName);
            }
            ruleKeyList.push(Keys[Key].id);
          }
          if(itemName.length!=0){
            this.warn("【"+itemName+"】" + '项目已被审核');
            return;
          }
          this.$put(all_pass_if_url, {ids: ruleKeyList, auditState: auditstate}).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.windowViolation.refresh();
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
      allPass: function (auditstate) {
        this.Pass(2);
      },
      allNoPass: function () {
        this.Pass(3);
      },
      allBack: function () {
        let ruleKeyList = [];
        let Keys = this.windowViolation.getSelectedRowKeys();
        if (Keys.length < 1) {
          this.warn('请勾选');
        } else {
          for (let Key in Keys) {
            ruleKeyList.push(Keys[Key].id);
            if (Keys[Key].auditState == 1) {
              this.warn("未审核记录不能进行批量撤销操作");
              return;
            }
          }
          this.modal.visible = true;
          this.modal.isNew = true;
          this.backFormData.cancelOpinion = null;
          this.backForm.option('formData', this.backFormData);
          this.singleBackData.ids = ruleKeyList;
          this.singleBackData.id = null;
        }
      },

    }
  }
</script>

