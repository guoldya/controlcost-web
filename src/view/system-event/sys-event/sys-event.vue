<style scoped>
  @import "../../../styles/common.less";
</style>
<template>
  <div>
  <Card dis-hover>
    <Row class="margin-top-10">
      <Searchpanel  ref="searchPanel">
        <div slot="form" class="margin-bottom-3" id="searchForm">
        </div>
        <div slot="control">
          <Button size="small" type="primary" @click="search">查询</Button>
          <Button size="small"  @click="resetSearch" class="margin-left-5" >重置</Button>
        </div>
      </Searchpanel>
    </Row>
    <Row class="margin-top-10">
      <div id="sys-event-grid"></div>
    </Row>
  </Card>
    <Card dis-hover class="margin-top-5">
      <Col class="margin-top-10 margin-bottom-10">
        <!--<textarea  rows="4" style="width:99.99%;padding: 10px; height: 400px" v-model="parameters" readonly="true" ></textarea>-->
        <div>{{parameters}}</div>
      </Col>
    </Card>
  </div>
</template>

<script>
  import Vue from 'vue';
  let sys_event_url = 'sys/sysEvent/selectPage';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
  export default {
        name: "system-event",
      data() {
        return{
          isLoadData:true,
          searchForm:{},
          searchFormData:{},
          parameters: '',
          sysEventGridData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, sys_event_url, this.isLoadData, {}, this.sysEventGrid);
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
        this.searchForm=$("#searchForm").dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'id',
              editorType: 'dxNumberBox',
              label: {
                alignment: 'right',
                text: '编码'
              },
            },
            {
              dataField: 'clientHost',
              label: {
                alignment: 'right',
                text: '客户端IP'
              },
            },
            {
              dataField: 'createTime',
              label: {
                alignment: 'right',
                text: '新建时间'
              },
              template: this.addDateRange,
            },
          ]
        }).dxForm('instance');
        this.sysEventGrid = $('#sys-event-grid').dxDataGrid({
          keyExpr: "id",
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          //wordWrapEnabled: true,
          //配置是否允许固定列
          columnFixing: {
            enabled: true
          },
          selection: {
            mode: 'single'//选中一行
          },
          hoverStateEnabled: true,
          dataSource: {
            store: this.sysEventGridData
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
          onSelectionChanged:(e)=> {
            if (e.selectedRowsData[0]) {
              let params = e.selectedRowsData[0].parameters;
              this.parameters = JSON.parse(params);
            }
          },
          columns: [
            {
              caption: '编码',
              dataField: 'id',
              alignment: 'right',
              width: 80,
            },
            {
              dataField: 'title',
              caption: '标题',
              alignment: 'left',
              minWidth: 130
            },
            {
              caption: '接口名称',
              dataField: 'requestUri',
              minWidth: 130
            },
            {
              caption: '系统参数',
              dataField: 'parameters',
              width: 130
            },
            {
              caption: '请求方式',
              dataField: 'method',
              width: 80
            },
            {
              caption: '客户端IP',
              dataField: 'clientHost',
              width:100
            },
            {
              caption: ' 浏览器标识',
              dataField: 'userAgent',
              width: 150
            },
            {
              caption: '状态',
              dataField: 'status',
              width: 80
            },
            {
              caption: '备注',
              dataField: 'remark',
              width:150
            },
            {
              dataField: 'createBy',
              caption: '创建人',
              lookup: {
                dataSource:this.userData,
                displayExpr: 'name',
                valueExpr: 'id',
              },
              width:80
            },
            {
              caption: '创建时间',
              dataField: 'createTime',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:110
            },
            {
              dataField: 'updateBy',
              caption: '更新人',
              lookup: {
                dataSource:this.userData,
                displayExpr: 'name',
                valueExpr: 'id',
              },
              width:80
            },
            {
              caption: '更新时间',
              dataField: 'updateTime',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width:110
            },
          ]
        }).dxDataGrid('instance');

      },
      methods: {
        // 添加搜索时间区段
        addDateRange: function (data, itemElement) {
          itemElement.append('<div id=\'dateRange\'/>');
          var dateRange = new (Vue.component('DateRange'));
          dateRange.field = data;
          dateRange.$mount('#dateRange');
          dateRange.$parent = this;
          this.$refs.dateRange = dateRange;
        },
        search: function () {
          var ds = this.sysEventGrid.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
          this.parameters = '';
        },
        resetSearch: function () {
          this.$refs.dateRange.values = null;
          this.searchFormData.createTime = [];
          this.searchForm.resetValues();
          this.sysEventGrid.refresh();
          this.parameters = '';
        }
      }


    }
</script>

<style scoped>

</style>
