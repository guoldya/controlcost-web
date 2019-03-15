<template>
  <div>
      <Col span="8" style="padding-right: 5px">
        <Card dis-hover>
          <p slot="title">政策维护</p>
          <Row class="margin-top-10">
            <div id="policy-grid"></div>
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
          <Row class="margin-top-5">
            <div id="policy-list-grid"></div>
          </Row>
        </Card>
      </Col>
  </div>
</template>

<script>
  import Vue from 'vue';
  let core_bd_policy_url = 'sys/coreBdPolicy/selectPage';
  let core_db_dx_url = 'sys/coreBdIndicator/selectList';
  let core_db_key_url = 'sys/coreBdIndicator/selectOne';
  //根据指标查询比率
  let core_bd_ratio_url = 'sys/coreBdPolicy/selectRatioByCBP';
  export default {
    name: "target-analysis",
    data() {
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        tag: [],
        cbpId: null,
        policyId: null,

        policyGridData: new this.customstore({
          load: (loadOptions) =>{
            return this.CommDs.loadPage(loadOptions, core_bd_policy_url,this.isLoadData, {status:1}, this.policyGrid);
          }
        }),

        policyListGridData: new this.customstore({
          load: (loadOptions) =>{
            if (loadOptions.searchData == null){
              let deferred = $.Deferred();
              return deferred.resolve([], {totalCount: 0 });
            }else {
              return this.CommDs.loadList(core_bd_ratio_url,loadOptions.searchData);
            }
          }
        }),


        listGridData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(core_db_key_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(core_db_dx_url,{status:1});
          }
        }),
      }
    },
    mounted() {
      let _this = this;
      this.searchForm = $('#searchForm').dxForm({
        colCount: 2,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'name',
            label: {
              alignment: 'right',
              text: '指标名称'
            },
          },
        ]
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
        onSelectionChanged:(e)=>{
          if (e.selectedRowKeys[0]){
            this.cbpId = e.selectedRowKeys[0].id;
            var ds = this.policyListGrid.getDataSource();
            ds.loadOptions().searchData = {cbpId:e.selectedRowKeys[0].id};
            ds.reload();
          }else {
            var ds = this.policyListGrid.getDataSource();
            ds.loadOptions().searchData = null;
            ds.reload();
          }
        },
        dataSource: {
          store: this.policyGridData,
        },
        columns: [
          {
            caption: '编码',
            dataField: 'id',
            alignment: 'right',
            width:80
          },
          {
            caption: '政策名称',
            dataField: 'name',
            minWidth: 150
          },
        ]
      }).dxDataGrid('instance');
      this.policyListGrid = $('#policy-list-grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        hoverStateEnabled: true,
        //wordWrapEnabled: true,
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
            caption: '序号',
            dataField: 'id',
            alignment: 'right',
            width: 90,
          },
          {
            caption:'指标名称',
            dataField: 'name',
            alignment: 'left  ',
            minWidth: 150,
          },
          {
            caption: '发生总数',
            dataField: 'countNum',
            alignment: 'right',
            width: 150,
          },
          {
            caption: '违规总数',
            dataField: 'violatedNum',
            alignment: 'right',
            width: 150,
          },
          {
            caption: '违规率',
            dataField: 'ratio',
            width: 150,
          },
        ]

      }).dxDataGrid('instance');
    },
    methods: {
      search: function() {
        var ds = this.policyListGrid.getDataSource();
        ds.loadOptions().searchData = this.searchFormData;
        ds.loadOptions().searchData.cbpId  = this.cbpId;
        ds.reload();
      },
      resetSearch: function() {
        this.searchForm.resetValues();
        this.policyListGrid.refresh();
      },
      detailView: function (data) {
        const route = {
          query:{
            iId:data.id,
          } ,
          path: 'target-list',
          name: 'target-list',
          component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-list.vue')
        };
        this.$router.push(route);
      },
    }
  }
</script>

<style scoped>

</style>
