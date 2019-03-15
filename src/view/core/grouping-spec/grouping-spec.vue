<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
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
        <div id="window-grid"></div>
      </Row>
    </Card>
    <Modal v-model="modal.visible" :mask-closable="false" width="650" title="编辑数据">
      <p slot="header">
        <span v-if="modal.isNew">新增数据分组</span>
        <span v-else="modal.isNew">编辑数据分组</span>
      </p>
      <div id="editForm"></div>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modaldetail.visible" :mask-closable="false" width="1000" title="编辑数据">
      <p slot="header">
        <span>数据分组限定项维护</span>
      </p>
      <Row>
        <Col span="11">
          <div id="left-grid" style="height: 300px"></div>
        </Col>
        <Col span="2" style="text-align: center;padding-top: 100px">
          <div style="margin: 0px auto;">
          <Button :disabled="toLeft" @click="moveLeft">左移</Button>
            <div style="padding-top: 25px">
              <Button :disabled="toRight" @click="moveRight">右移</Button>
            </div>
          </div>
        </Col>
        <Col span="11">
          <div id="right-grid" style="height: 300px"></div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" @click="editFormCancel">取消</Button>
        <Button type="primary" :loading="modal.modal_loading" @click="formDetailSubmit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Vue from 'vue';

  let window_grid_url = 'sys/coreGroupingSpec/selectByPage';
  let window_insert_url = 'sys/coreGroupingSpec/updateOrInsert';
  let status_url = 'sys/coreGroupingSpec/updateStatus';
  let edit_form_grid_url = 'sys/coreGroupingSpec/selectBySpecType';
  //医保耗材
  let med_consume_list_url = 'sys/coreBdInsMc/selectListUsing';
  //医保诊断
  let diagnose_list_url = 'sys/coreBdDx/selectListUsing';
  //医保药品
  let med_drug_list_url = 'sys/coreBdInsMed/selectListUsing';
  //医保诊疗
  let med_treat_list_url = 'sys/coreBdInsTreatment/selectListUsing';

  //分组限定保存
  let detail_insert_url = 'sys/coreGroupingSpecDetail/insertMultiId';

  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    data() {
      return {
        // transferData: this.getMockData(),
        // transferTargetKeys: this.getTargetKeys(),
        listStyle: {
          width: '250px',
          height: '300px'
        },
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        projectList: [],
        specTyp: null,
        toLeft: true,
        toRight: true,

        rightGrid: {},
        leftGrid:{},

        leftGridData:[],
        rightGridData:[],

        columns1: [],
        cgsId: null,
        detailsList: [],
        selectData: [],

        specType: null,
        modaldetail:{
          visible: false,
        },
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
          lebtext: "源"
        },
        windowGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, window_grid_url, this.isLoadData, {}, this.windowGrid);
          },
        }),
        userData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(sys_user_select_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(sys_user_select_url);
          }
        }),
      }
    },
    mounted() {
      let _this=this;
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'specName',
            label: {
              alignment: 'right',
              text: '名称'
            },
          },
          {
            dataField: 'specType',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.specType,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '限定类型'
            },
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.status,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
            }
          },
          {
            dataField: 'updateTime',
            label: {
              alignment: 'right',
              text: '修改时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');

      this.editForm = $('#editForm').dxForm({
        colCount: 2,
        formData: this.editFormData,
        items: [
          {
            dataField: 'id',
            //colSpan:2,
            label: {
              alignment: 'right',
              text: '编码'
            },
            editorOptions: {
              placeholder: '<系统自动生成>',
              disabled: true,
            }
          },
          {itemType: "empty"},
          {
            dataField: 'specName',
            colSpan: 2,
            label: {
              alignment: 'right',
              text: '名称'
            },
            editorOptions: {
              //disabled:true,
              maxLength: 32
            },
            validationRules: [{
              type: "required",
              message: "请输入名称"
            }]
          },
          {
            dataField: 'specType',
            editorType: 'dxSelectBox',
            colSpan: 2,
            editorOptions: {
              dataSource: this.enum.specType,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '限定类型'
            },
            validationRules: [{
              type: "required",
              message: "请输入限定类型"
            }]
          },
          {
            dataField: 'status',
            editorType: 'dxSelectBox',
            colSpan: 2,
            editorOptions: {
              dataSource: this.enum.status,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '状态'
            },
            validationRules: [{
              type: "required",
              message: "请选择状态"
            }]
          },
          {
            dataField: 'remark',
            colSpan: 2,
            editorType: 'dxTextArea',
            label: {
              alignment: 'right',
              text: '备注'
            },
            editorOptions: {
              height: 80
            },
          },
        ]
      }).dxForm('instance');

      this.windowGrid = $('#window-grid').dxDataGrid({
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
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          });
        },
        dataSource: {
          store: this.windowGridData
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
              if (options.data.status == 1) {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '停用',
                    color: '#ff9900',
                    showtip: true,
                    tip: '您确认停用吗？',
                    id: {id: options.data.id, status: 0},
                    click: this.UpdateStatus
                  },
                ];
              } else {
                opcol.items = [
                  {text: '编辑', showtip: false, id: options.data, click: this.edit},
                  {
                    text: '启用',
                    color: '#52c41a',
                    showtip: false,
                    // tip: '您确认停用吗？',
                    id: {id: options.data.id, status: 1},
                    click: this.UpdateStatus
                  },
                ];
              }
              opcol.$mount('#t1');
            },
            width: 100,
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width: 80
          },
          {
            caption: '名称',
            dataField: 'specName',
            minWidth: 150
          },
          {
            caption: '限定类型',
            dataField: 'specType',
            alignment:"center",
            width: 100,
            lookup: {
              dataSource: this.enum.specType,
              displayExpr: 'text',
              valueExpr: 'id'
            }
          },
          {
            caption: '限定数量',
            dataField: 'details',
            width: 100,
            alignment:"center",
            cellTemplate: function (container, options) {
              $("<div>").append($("<a>").text("("+options.data.limitNum.length+")")).click(function () {
                _this.rightGridData = [];
                _this.rightGrid.option("dataSource", _this.rightGridData);
                _this.specType = options.data.specType;
                _this.editDetail();
                _this.detailsList  = options.data.limitNum;
                _this.cgsId = options.data.id;
              }).appendTo(container);
            }
          },
          {
            caption: '备注',
            dataField: 'remark',
            width: 400,
          },
          {
            caption: '状态',
            alignment: 'center',
            dataField: 'status',
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
            caption: '创建人',
            dataField: 'createBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width: 100
          },
          {
            caption: '创建时间',
            dataField: 'createTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 110
          },
          {
            caption: '更新人',
            dataField: 'updateBy',
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width: 100
          },
          {
            caption: '更新时间',
            dataField: 'updateTime',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width: 110
          },
        ]
      }).dxDataGrid('instance');

      this.leftGrid = $('#left-grid').dxDataGrid({
        keyExpr:"id",
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        //wordWrapEnabled: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          allowSelectAll: true,
          mode: 'multiple',
          showCheckBoxesMode: 'always'
        },
        onSelectionChanged: (e) => {
          _this.selectData  = e.selectedRowsData;
          if (e.selectedRowKeys.length > 0) {
            this.toRight = false
          }
          else {
            this.toRight = true
          }
        },
        //hoverStateEnabled: true,
        dataSource: {
          store: new this.ArrayStore({
            key: "id",
            data: this.leftGridData,
          })
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
        columns: this.columns1,
      }).dxDataGrid('instance');

      this.rightGrid = $('#right-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          allowSelectAll: true,
          mode: 'multiple',
          showCheckBoxesMode: 'always'
        },
        onSelectionChanged: (e) => {
          if (e.selectedRowKeys.length > 0) {
            this.toLeft = false
          }
          else {
            this.toLeft = true
          }
        },
        hoverStateEnabled: true,
        dataSource: {
          store: this.rightGridData
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
        columns: this.columns1,
      }).dxDataGrid('instance');

      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '新增', type: 'primary', enabled: true, click: this.addWindow},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;


    },
    methods: {
      loadData: function () {
       let url;
        let _this=this;
        if(this.specType ==1)
        {
          this.columns1 = [
            {
            caption: '医保编码',
            dataField: 'insCode',
              alignment:'left',
              width: 200
            },
            {
              caption: '名称',
              dataField: 'itemName',
              width: 100
            },
            {
              caption: '规格',
              dataField: 'spec',
              width: 150
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
              width: 100
            }];
          url = med_drug_list_url;
        }else if (this.specType == 2){
          this.columns1 = [ {
            caption: '医保编码',
            dataField: 'insCode',
            alignment:'left',
            width: 200
          },
            {
              caption: '名称',
              dataField: 'itemName',
              width: 150
            },
            {
              caption: '规格',
              dataField: 'spec',
              width: 100
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
              width: 100
            }]
          url = med_consume_list_url;
        } else if (this.specType == 3){
          this.columns1 = [
            {
            caption: '医保编码',
            dataField: 'insCode',
              alignment:'left',
              width: 200
          },
            {
              caption: '项目名称',
              dataField: 'itemName',
              width: 150
            },
            {
              caption: '规格',
              dataField: 'spec',
              width: 100
            },
            {
              caption: '单位',
              dataField: 'unit',
              alignment: 'center',
              width: 50,
            },]
          url = med_treat_list_url;
        }else if (this.specType == 4){
          this.columns1 = [ {
            caption: '医保编码',
            dataField: 'insCode',
            alignment:'left',
            width: 200
          },
            {
              caption: '项目名称',
              dataField: 'itemName',
              width: 150
            },
            {
              caption: '诊断分类名称',
              dataField: 'insTypeName',
              width: 150
            },
            {
              caption: '险种类別',
              dataField: 'insType',
              width: 100
            },]
          url = diagnose_list_url;
        }
        this.leftGrid.option("columns", this.columns1 );
        this.rightGrid.option("columns", this.columns1 );
        this.$put(url).then(res => {
          if (res.code == '200') {
            _this.leftGridData = res.rows;
            _this.leftGrid.option("dataSource", {
              store: new this.ArrayStore({
                key: "id",
                data: this.leftGridData,
              })
            });
            _this.leftGrid.selectRows(_this.detailsList, false);
            setTimeout(function(){
              _this.autoMoveRight();
            },150);
          }
          else {
            _this.leftGridData = [];
            _this.warn(res.msg);
          }
        }).catch(err => {
          _this.leftGridData = [];
         _this.error(err);
        });
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
        var ds = this.windowGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
      },

      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateTime = '';
        this.searchForm.resetValues();
        this.windowGrid.refresh();
      },
      addWindow: function () {
        this.modal.isNew = true;
        this.editFormData = {};
        this.editFormData.status = 1;
        this.editFormData.specType = 1;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      edit: function (data) {
        let tempData={};
        for (let key in data)
        {
          tempData[key]=data[key];
        }
        this.modal.isNew = false;
        this.editFormData = tempData;
        this.editForm.option('formData', this.editFormData);
        this.modal.visible = true;
      },
      editDetail: function (data) {
        this.loadData();
        this.modaldetail.visible = true;
      },

      UpdateStatus: function (data) {
        this.$post(status_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.windowGrid.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },

      editFormCancel: function () {
        this.modal.visible = false;
        this.modaldetail.visible =false;
      },

      formSubmit: function () {
        //数据还原
        // let SelectedRows = [];
        // this.editFormData.details = [];
        // for (let i = 0; i < this.transferTargetKeys.length; i++) {
        //   let item=  this.projectList.find((e) => (e.id == this.transferTargetKeys[i]))
        //   let row = {
        //     "cgsId": this.editFormData.id,
        //     "colId": item.id,
        //     "specName": item.name,
        //   };
        //   this.editFormData.details.push(row);
        // }
        if (!this.editForm.validate().isValid) {
          this.warn('信息不完整');
          this.modal.modal_loading = false;
          return;
        }
        this.$post(window_insert_url, this.editFormData).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modal.modal_loading = false;
              this.modal.visible = false;
              this.windowGrid.refresh();
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
      },

      moveLeft: function () {
        let selectData = this.rightGrid.getSelectedRowsData();
        for (let i = 0; i < selectData.length; i++) {
          this.leftGridData.unshift(selectData[i]);
          let index = this.rightGridData.indexOf(selectData[i]);
          this.rightGridData.splice(index, 1)
        }
        this.rightGrid.option("dataSource", this.rightGridData);
        this.leftGrid.option("dataSource", this.leftGridData);
        this.rightGrid.deselectAll();
        this.toLeft = true;
      },

      autoMoveRight: function(){
        for (let i = 0; i < this.selectData.length; i++) {
          this.rightGridData.unshift(this.selectData[i]);
          let index = this.leftGridData.indexOf(this.selectData[i]);
          this.leftGridData.splice(index, 1)
        }
        this.rightGrid.option("dataSource", this.rightGridData);
        this.leftGrid.option("dataSource", this.leftGridData);
        this.leftGrid.deselectAll();
      },
      moveRight: function () {
        let selectData = this.leftGrid.getSelectedRowsData();
        for (let i = 0; i < selectData.length; i++) {
          this.rightGridData.unshift(selectData[i]);
          let index = this.leftGridData.indexOf(selectData[i]);
          this.leftGridData.splice(index, 1)
        }
        this.rightGrid.option("dataSource", this.rightGridData);
        this.leftGrid.option("dataSource", this.leftGridData);
        this.leftGrid.deselectAll();
        this.toRight = true;
      },
      //穿梭框数据保存
      formDetailSubmit: function () {
        let params = {};
        let idss =[]
        for (let i = 0; i<this.rightGridData.length; i++) {
          idss[i] = this.rightGridData[i].id;
        };
        params.ids = idss;
        params.insCode = this.cgsId;
        this.$post(detail_insert_url, params).then(res => {
          if (res.code == '200') {
            this.success('保存成功!', () => {
              this.modaldetail.modal_loading = false;
              this.modaldetail.visible = false;
              this.windowGrid.refresh();
            });
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
        this.modaldetail.modal_loading = false;
      }
    }
  }
</script>
