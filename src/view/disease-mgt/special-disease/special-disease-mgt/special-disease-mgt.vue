<style lang="less">
  @import "../../../../styles/common.less";
  .dropDownBtn button {
    float: right;
    margin: 5px;
  }
</style>
<template>
  <div>
    <Row>
      <Card dis-hover>
        <p slot="title">特病管理</p>
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
          <div id="special-grid"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
        <p slot="header">
          <span v-if="modal.isNew">添加特病</span>
          <span v-else="modal.isNew">编辑特病</span>
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
  let special_disease_url = 'sys/coreBdDiseases/selectByPage';
  let special_disease_insert = 'sys/coreBdDiseases/updateOrinsert';
  let special_disease_updateStatus = 'sys/coreBdDiseases/updateStatus';
  let core_db_dx_url = 'sys/coreBdDx/queryList';
  let core_db_key_url = 'sys/coreBdDx/selectById';
  // let core_bd_diseases_list_url = 'sys/coreBdDiseases/queryList';
  // let core_bd_diseases_key_url = 'sys/coreBdDiseases/selectByMap';
  export default {
    name: "special-disease-mgt",
    data() {
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        tag: [],
        modal: {
          visible: false,
          modal_loading: false,
          isNew: true,
        },
        specialGridData: new this.customstore({
          load: (loadOptions) =>{
            if (loadOptions.searchData == null){
              loadOptions.searchData = {dtype: 1};
            }
            return this.CommDs.loadPage(loadOptions, special_disease_url, this.isLoadData, {}, this.slowGrid);
          }
        }),
        listGrid:{},
        listGridData: new this.customstore({
          key: "insCode",
          byKey: (key) => {
            return this.CommDs.loadByKey(core_db_key_url, {insCode: key});
          },
          load: (loadOptions) =>{
            return this.CommDs.loadList(core_db_dx_url,loadOptions.searchData);
          }
        }),
      };
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
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              placeholder: '请选择',
              dataSource: this.enum.status,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
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
              text: '病种编号',
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
              text: '病种名称',
            },
            editorOptions: {
              maxLength:32,
              placeholder: '病种名称',
            },

            validationRules: [{
              type: "required",
              message: "请输入病种名称",
            }],
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
            validationRules: [{
              type: "required",
              message: "请选择险种类別",
            }],
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
              disabled: true,
            },
            validationRules: [{
              type: "required",
              message: "请选择诊断使用来源",
            }],
          },
          {
            dataField: 'insCodes',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '诊断选择'
            },
            editorType: "dxDropDownBox",
            editorOptions: {
              visible:true,
              dropDownOptions: {width: 550, height: 300},
              placeholder: '选择诊断',
              showClearButton: true,
              valueExpr: "insCode",
              displayExpr: function(e){
                return e.insCode+'-'+e.itemName;
              },
              dataSource: this.listGridData ,
              contentTemplate: (e) => {
                let el = $('<div class="dropDownBtn">');
                let value = e.component.option('value');
                let grid = $('<div>').dxDataGrid({
                  showRowLines: true,
                  showBorders: true,
                  columnFixing: {
                    enabled: true
                  },
                  hoverStateEnabled: true,
                  remoteOperations: {
                    filtering: true,
                    sorting: true,
                    // paging: true,
                  },
                  paging: {
                    pageSize: 10,
                  },
                  dataSource: e.component.option('dataSource'),
                  columns: [
                    {
                      caption: '诊断编号',
                      dataField: 'insCode',
                      alignment:'right',
                      width:70
                    },
                    {
                      caption: '诊断',
                      dataField: 'itemName'
                    },
                  ] ,
                  searchPanel: {
                    visible: true,
                    placeholder: '查找',
                    width: '275',
                  },
                  onOptionChanged:function(e){
                    if(e.name == "searchPanel"){
                      if(typeof (e.value) == 'string'){
                        _this.listGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
                      }
                    }
                  },
                  height: 240,
                  selection: {
                    mode: 'multiple',
                    showCheckBoxesMode:"always"
                  },
                  selectedRowKeys: value,
                  // onSelectionChanged: (selectedItems) => {
                  //   let keys = selectedItems.selectedRowKeys;
                  //   e.component.option("value", keys);
                  //   _this.tag = selectedItems.selectedRowsData;
                  // }
                });
                _this.listGrid = grid.dxDataGrid('instance');
                e.component.on("valueChanged", function (args) {
                  _this.listGrid.selectRows(args.value, false);
                });
                el.append(grid);
                el.append('<div class=\'btnPart\' >');

                //添加按钮组件
                let btnPartFrom = new (Vue.component('CommandBtns'))();
                btnPartFrom.items = [
                  {
                    id: 1, text: '添加', type: 'primary', enabled: true, click: function () {
                      let keys = _this.listGrid.getSelectedRowKeys();
                      e.component.option("value", keys);
                      _this.tag = _this.listGrid.getSelectedRowsData();
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
            editorType: "dxTextArea",
            dataField: 'remark',
            label: {
              alignment: 'right',
              text: '备注',
            },
            editorOptions: {
              maxLength:64,
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
            }]
          },
        ],
      }).dxForm('instance');

      this.specialGrid = $('#special-grid').dxDataGrid({
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
              return $('<div id=\'btn\'/>');
            }
          })
        },
        dataSource: {
          store: this.specialGridData,
        },
        columns: [
          {
            caption: '操作',
            alignment: 'center',
            cellTemplate: (container,options) => {
              container.append('<div id="t1"/>');
              var opcol = new (Vue.component('OpCol'));
              if(options.data.status == 1){
                opcol.items = [
                  {text: '编辑', showtip: false, id:options.data, click: this.edit},
                  {text: '停用', color: '#ff9900', showtip: true, tip:'您确定停用吗？', id:{id:options.data.id,status:0}, click: this.updateStatus},
                ];
              }else if(options.data.status == 0 || options.data.status == null){
                opcol.items = [
                  {text: '编辑', showtip: false, id:options.data, click: this.edit},
                  {text: '启用', color: '#52c41a', showtip: false, id:{id:options.data.id,status:1}, click: this.updateStatus},
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100,
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
            minWidth:150
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
            caption: '来源',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.dxScope,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width: 100,
          },
          {
            dataField: 'status',
            caption: '诊断状态',
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
            width: 80,
          },
          {
            dataField: 'remark',
            caption: '备注',
            width: 700
          }
        ]
      }).dxDataGrid('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '添加', type: 'primary', enabled: true, click: this.addSpecial},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;
    },
    methods: {

      dropDownHide: function () {
        this.editForm.getEditor("insCodes").close();
      },
      search: function () {
        var ds = this.specialGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.loadOptions().searchData.dtype = 1;
        ds.reload();
      },
      resetSearch: function () {
        this.searchForm.resetValues();
        this.specialGrid.refresh();
      },
      //编辑病种
      edit: function (data) {
        this.editForm.getEditor('insCodes').reset();
        this.tag=[];
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
      //更新状态
      updateStatus: function (data) {
        this.$post(special_disease_updateStatus, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.specialGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //添加病种
      addSpecial: function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editFormData.dtype = 1;
        this.editFormData.scope = 1;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      //编辑取消
      editFormCancel: function () {
        this.modal.visible = false;
      },
      //编辑提交
      formSubmit: function () {
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        let ids = [];
        for (let i = 0; i<this.tag.length; i++){
          ids.push({dxId: this.tag[i].id,dxName: this.tag[i].itemName} );
        }
        this.editFormData.listDx = ids;
        this.$post(special_disease_insert, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.specialGrid.refresh();
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
      }
    },
  }
</script>

