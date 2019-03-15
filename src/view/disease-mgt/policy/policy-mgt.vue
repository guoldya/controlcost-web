<style lang="less">
  @import "../../../styles/common.less";

  .dropDownBtn button {
    float: right;
    margin: 5px;
  }
</style>
<template>
  <div>
    <Row>
      <Col span="14" style="padding-right: 5px">
        <Card dis-hover>
          <p slot="title">政策维护</p>
          <Row class="margin-top-10">
            <div id="policy-grid"></div>
          </Row>
        </Card>
      </Col>
      <Col span="10">
        <Card dis-hover>
          <p slot="title">关联的指标</p>
          <Row class="margin-top-10">
            <div id="policy-list-grid"></div>
          </Row>
        </Card>
      </Col>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">新增政策</span>
          <span v-else="modal.isNew">编辑政策</span>
        </p>
        <div id="editForm"></div>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
        </div>
      </Modal>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';

  let core_bd_policy_url = 'sys/coreBdPolicy/selectPage';
  let core_bd_policy_status_url = 'sys/coreBdPolicy/updateOrInsert';
  let core_bd_policy_insert_url = 'sys/coreBdPolicy/insertToPolicyAndIndicator';
  let core_db_dx_url = 'sys/coreBdIndicator/selectList';
  let core_db_key_url = 'sys/coreBdIndicator/selectOne';
  //根据指标查询比率
  let core_bd_ratio_url = 'sys/coreBdPolicy/selectIndicatorByCBP';
  export default {
    name: "target-analysis",
    data() {
      return {
        isLoadData: true,
        editForm: {},
        editFormData: {},
        modal: {
          visible: false,
          modal_loading: false,
          isNew: true,
        },

        tag: [],
        policyId: null,

        cbiIdListGrid:{},
        policyGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, core_bd_policy_url, this.isLoadData, {}, this.policyGrid);
          }
        }),

        policyListGridData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null) {
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            } else {
              return this.CommDs.loadList(core_bd_ratio_url, loadOptions.searchData);
            }
          }
        }),


        listGridData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(core_db_key_url, {id: key});
          },
          load: (loadOptions) => {
            if (loadOptions == null){
              return this.CommDs.loadList(core_db_dx_url, {status: 1});
            } else {
              return this.CommDs.loadList(core_db_dx_url, loadOptions.searchData);
            }
          }
        }),
      }
    },
    mounted() {
      let _this = this;
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
              placeholder: '<系统给自动录入>',
              readOnly: true,
            }
          },
          {
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '政策名称',
            },
            editorOptions: {
              maxLength: 32,
              placeholder: '政策名称',
            },
            validationRules: [{
              type: "required",
              message: "请输入政策名称",
            }],
          },
          {
            dataField: 'cbiIdList',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '指标关联'
            },
            editorType: "dxDropDownBox",
            editorOptions: {
              dropDownOptions: {width: 550, height: 300},
              placeholder: '指标关联',
              showClearButton: true,
              valueExpr: "id",
              displayExpr: "name",
              dataSource: this.listGridData,
              contentTemplate: (e) => {
                let el = $('<div class="dropDownBtn">');
                let value = e.component.option('value');
                let grid = $('<div>').dxDataGrid({
                  showRowLines: true,
                  showBorders: true,
                  columnFixing: {
                    enabled: true
                  },
                  dataSource: e.component.option('dataSource'),
                  columns: [
                    {
                      caption: '指标编码',
                      dataField: 'id',
                      alignment: 'right',
                      width: 100
                    },
                    {
                      caption: '指标名称',
                      dataField: 'name'
                    },
                  ],
                  remoteOperations: {
                    filtering: true,
                    sorting: true,
                    // paging: true,
                  },
                  height: 240,
                  paging: {enabled: true, pageSize: 10},
                  searchPanel: {
                    visible: true,
                    placeholder: '查找',
                    width: '275',
                  },
                  onOptionChanged:function(e){
                    if(e.name == "searchPanel"){
                      if(typeof (e.value) == 'string'){
                        _this.cbiIdListGrid.getDataSource().loadOptions().searchData = {keyword:e.value,status:1};
                      }
                    }
                  },
                  selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: "always"
                  },
                  selectedRowKeys: value,
                });
                e.component.on("valueChanged", function (args) {
                  instance.selectRows(args.value, false);
                });
                el.append(grid);
                el.append('<div class=\'btnPart\' >');
                let instance = grid.dxDataGrid('instance');
                _this.cbiIdListGrid = grid.dxDataGrid('instance');
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
              message: "请选择指标",
            }],
          },
          {
            colSpan: 2,
            editorType: "dxTextArea",
            dataField: 'instructions',
            label: {
              alignment: 'right',
              text: '政策说明',
            },
            editorOptions: {
              maxLength: 64,
            },
            validationRules: [{
              type: "required",
              message: "请输入政策说明",
            }],
          },
          {
            colSpan: 2,
            editorType: "dxTextArea",
            dataField: 'remark',
            label: {
              alignment: 'right',
              text: '备注',
            },
            editorOptions: {
              maxLength: 64,
            }
          },
        ],
      }).dxForm('instance');
      this.policyGrid = $('#policy-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        //wordWrapEnabled: true,
        columnFixing: {
          enabled: true
        },
        searchPanel: {
          visible: true,
          width: 230,
          placeholder: '查找........',
        },
        onOptionChanged:function(e){
          if(e.name == "searchPanel"){
            if(typeof (e.value) == 'string'){
              _this.policyGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
              // _this.allUserGrid.refresh();
            }
          }
        },
        selection: {
          mode: 'single',
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
        hoverStateEnabled: true,
        onContentReady: (e) => {
          e.component.selectRowsByIndexes([0]);
        },
        onSelectionChanged: (e) => {
          var ds = this.policyListGrid.getDataSource();
          if (e.selectedRowKeys[0]) {
            ds.loadOptions().searchData = {cbpId: e.selectedRowKeys[0].id};
            ds.reload();
          }else {
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
          store: this.policyGridData,
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
            width: 90,
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width: 80
          },
          {
            caption: '政策名称',
            dataField: 'name',
            minWidth: 150
          },
          {
            caption: '政策说明',
            dataField: 'instructions',
            width: 200
          },
          {
            caption: '更新时间',
            dataField: 'updateTime',
            alignment: 'left',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 130
          },
          {
            dataField: 'remark',
            caption: '备注',
            width: 200
          }
        ]
      }).dxDataGrid('instance');

      this.policyListGrid = $('#policy-list-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'
        },
        dataSource: {
          store: this.policyListGridData,
        },
        remoteOperations: {
          filtering: true,
          // sorting: true,
          // paging: true
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
            caption: '序号',
            dataField: 'id',
            alignment: 'right',
            width: 90,
          },
          {
            caption: '指标名称',
            dataField: 'name',
            alignment: 'left  ',
            minWidth: 150,
          },
        ]

      }).dxDataGrid('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增政策', type: 'primary', enabled: true, click: this.addPolicy},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;

    },
    methods: {
      dropDownHide: function () {
        this.editForm.getEditor("cbiIdList").close();
      },
      // 添加搜索时间区段
      addPolicy: function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      detailView: function (data) {
        const route = {
          params: data,
          path: 'target-list',
          name: 'target-list',
          component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-list.vue')
        };
        this.$router.push(route);
      },
      //编辑政策
      edit: function (data) {
        this.editForm.getEditor('cbiIdList').reset();
        this.tag = [];
        this.modal.isNew = false;
        let tempData={};

        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.editFormData = tempData;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      //取消保存
      editFormCancel: function () {
        this.modal.visible = false;
      },
      //保存新政策
      formSubmit: function () {
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        ;
        if (this.tag) {
          let ids = [];
          for (let i = 0; i < this.tag.length; i++) {
            ids[i] = this.tag[i].id;
          }
          this.editFormData.cbiIdList = ids;
        }
        this.$post(core_bd_policy_insert_url, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.policyGrid.refresh();
              this.policyListGrid.refresh();
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

      statusUpdate: function (data) {
        this.$post(core_bd_policy_status_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功', () => {
              this.policyGrid.refresh();
            })
          } else {
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      }
    }
  }
</script>

<style scoped>

</style>
