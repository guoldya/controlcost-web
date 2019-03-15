<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Card dis-hover>
      <Row class="margin-top-10">
        <Searchpanel ref="searchPanel">
          <div slot="form" class="margin-bottom-4" id="searchForm">
          </div>
          <div slot="control">
            <Button size="small" type="primary" @click="search">查询</Button>
            <Button size="small" @click="resetSearch" class="margin-left-5">重置</Button>
          </div>
        </Searchpanel>
      </Row>
      <Row class="margin-top-10">
        <div id="med-treat-list"></div>
      </Row>
      <Row class="margin-top-10">
        <div id="med-treat-col"></div>
      </Row>
    </Card>
  </div>
</template>

<script>
  import Vue from 'vue';
  let med_treat_list_url = 'sys/coreBdInsTreatment/selectByPage';
  let med_treat_col_url = 'sys/bdInsTreatment/selectByPage';
  let med_sync_compare_url='sys/coreBdInsTreatment/updateOfSync';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
    data(){
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        editForm: {},
        editFormData: {},
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        medTreatListData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, med_treat_list_url, this.isLoadData, {}, this.medTreatList);
          }
        }),
        medTreatColData:new this.customstore({
          load: (loadOptions) => {
            if(loadOptions.searchData==null)
            {
              var deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0});
            }else {
              return this.CommDs.loadPage(loadOptions, med_treat_col_url, this.isLoadData, {}, this.medTreatCol)
            }
          },
        }),
        sysBdOrgListData: new this.customstore({
          key: "ocode",
          byKey: (key) => {
            return this.CommDs.loadByKey(sys_bdOrg_list_url, {ocode: key,status:1});
          },
          load: (e) =>{
            return this.CommDs.loadList(sys_bdOrg_list_url,{status:1});
          }
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
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'insCode',
            label: {
              alignment: 'right',
              text: '医保编码',
            }
          },
          {
            dataField: 'itemName',
            label: {
              alignment: 'right',
              text: '项目名称',
            }
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
        ]
      }).dxForm('instance');
      this.medTreatList = $('#med-treat-list').dxDataGrid({
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
        selection: {
          mode: 'single',
        },
        dataSource: {
          store:this.medTreatListData,
        },
        onToolbarPreparing: (e) => {
          e.toolbarOptions.items.unshift({
            location: "before",
            template: () => {
              return $('<div id=\'btn\'/>');
            }
          })
        },
        onSelectionChanged:(e)=> {
          if (e.selectedRowsData[0]) {
            var dx = this.medTreatCol.getDataSource();
            dx.loadOptions().searchData = {insCode:e.selectedRowsData[0].insCode ,};
            dx.reload();
          }
        },
        columns: [
          {
            dataField: 'id',
            caption: '编码',
            alignment: 'right',
            width:80,
          },
          {
            dataField: 'insCode',
            caption: '医保编码',
            alignment: 'left',
            width:200,
          },
          {
            dataField: 'itemName',
            caption: '项目名称',
            alignment: 'left',
            minWidth:140
          },
          {
            dataField: 'spec',
            caption: '规格',
            alignment: 'left',
            width:120,
          },
          {
            dataField: 'unit',
            caption: '单位',
            alignment: 'center',
            width:100,
          },
          {
            dataField: 'insFeeType',
            caption: '医保费用类型',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.medInsFeeType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width:120,
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
          {
            dataField: 'createBy',
            caption: '创建人',
            alignment:"left",
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width:100,
          },
          {
            dataField: 'createTime',
            caption: '创建时间',
            alignment: 'left',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width:110,
          },
          {
            dataField: 'updateBy',
            caption: '更新人',
            alignment:"left",
            lookup: {
              dataSource:this.userData,
              displayExpr: 'name',
              valueExpr: 'id',
            },
            width:100,
          },
          {
            dataField: 'updateTime',
            caption: '更新时间',
            alignment: 'left',
            dataType: "datetime",
            format: "yyyy-MM-dd HH:mm",
            width:110,
          },
        ]
      }).dxDataGrid('instance');
      this.medTreatCol = $('#med-treat-col').dxDataGrid({
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
        selection: {
          mode: 'single',
        },
        dataSource: {
          store:this.medTreatColData,
        },
        columns: [
          {
            dataField: 'ocode',
            caption: '医疗机构代码',
            alignment: 'center',
            lookup: {
              dataSource: this.sysBdOrgListData,
              displayExpr: 'oname',
              valueExpr: 'ocode',
            },
            width: 180,
          },
          {
            dataField: 'itemCode',
            caption: '项目编码',
            alignment: 'left',
            width:120
          },
          {
            dataField: 'itemName',
            caption: '项目名称',
            alignment: 'left',
            minWidth:140
          },
          {
            dataField: 'insFeeType',
            caption: '医保费用类型',
            alignment: 'center',
            lookup: {
              dataSource: this.enum.medInsFeeType,
              displayExpr: 'text',
              valueExpr: 'id',
            },
            width:120,
          },
          {
            dataField: 'spec',
            caption: '规格',
            alignment: 'left',
            width:120
          },
          {
            dataField: 'unit',
            caption: '单位',
            alignment: 'center',
            width:80
          },
        ]
      }).dxDataGrid('instance');
      this.btnPart = new (Vue.component('CommandBtns'))();
      this.btnPart.items = [
        {id: 1, text: '同步对照', type: 'primary', enabled: true, click: this.syncCompare},
      ];
      this.btnPart.$mount('#btn');
      this.btnPart.$parent = this;
    },
    methods: {
      search: function () {
        var ds = this.medTreatList.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.reload();
        this.medTreatList.selectRows();
        var dx = this.medTreatCol.getDataSource();
        dx.loadOptions().searchData = null;
        dx.reload();
      },
      resetSearch: function () {
        this.searchFormData.updateTime = '';
        this.searchForm.resetValues();
        this.medTreatList.refresh();
        this.medTreatList.selectRows();
        var dx = this.medTreatCol.getDataSource();
        dx.loadOptions().searchData = null;
        dx.reload();
      },
      syncCompare: function (data) {
        this.$put(med_sync_compare_url, data).then(res => {
          if (res.code == '200') {
            this.success('成功!', () => {
              this.medTreatList.refresh();
            });
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
    },
  }
</script>

