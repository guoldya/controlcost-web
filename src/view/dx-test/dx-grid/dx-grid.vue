<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Row>
      <Card>
        <Row>
          <Searchpanel ref="searchPanel">
            <div slot="form" class="margin-bottom-3" id="searchFrom">
            </div>
            <div slot="control">
              <Button type="primary" @click="">查询</Button>
              <Button @click="">重置</Button>
            </div>
          </Searchpanel>
        </Row>
        <Row class="margin-top-10">
          <div id="grid"></div>
        </Row>
      </Card>
    </Row>
  </div>
</template>
<script>
  import {getGridData} from '@/api/data'
  let role_grid_data_url = '/sys/sysRole/read/page';
  export default {
    data() {
      return {
        searchFrom: {},
        searchFromData: {},
        isLoadData:true,
        gridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, role_grid_data_url, this.isLoadData, {}, this.grid);
          },
        }),
      }
    },
    mounted() {
      this.searchFrom = $('#searchFrom').dxForm({
        colCount: 4,
        formData: this.searchFromData,
        items: [
          {
            dataField: "name",
            label: {
              alignment: "right",
              text: "姓名"
            },
          },
          {
            dataField: "sex",
            editorType: "dxSelectBox",
            editorOptions: {
              dataSource: this.enum.sex,
              displayExpr: "text",
              valueExpr: 'id',
            },
            label: {
              alignment: "right",
              text: "性别"
            }
          },
        ]
      }).dxForm("instance");

      this.grid = $("#grid").dxDataGrid({
        // keyExpr: "id",
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: "single"
        },
        hoverStateEnabled: true,
        dataSource: {
          store: this.gridData
        },
        remoteOperations: {
          filtering: false,
          sorting: false,
          paging: false
        },
        paging: {
          pageSize: 10
        },
        columns: [
          {
            caption: "姓名",
            dataField: "name",
          },
          {
            caption: "性别",
            dataField: "sex",
            // editorOptions:{
            //   dataSource:this.enum.sex,
            //   displayExpr:'text',
            //   valueExpr:'id'
            // }
          },
          {
            caption: "邮箱",
            dataField: "email",

          },
          {
            caption: "时间",
            dataField: "createTime",
          },
        ]
      }).dxDataGrid("instance");

    },
    methods: {

    }
  }
</script>
