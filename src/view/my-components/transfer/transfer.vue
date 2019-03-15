<template>
  <div>
    <Col :lg="11">
      <div id="grid"></div>
    </Col>
    <Col :lg="2" style="text-align: center;padding-top: 50px">
      <Button :disabled="toLeft" @click="moveLeft">左移</Button>
      <Button :disabled="toRight" @click="moveRight">右移</Button>
    </Col>
    <Col :lg="11">
      <div id="grid1"></div>
    </Col>
  </div>
</template>
<script>
  import Vue from 'vue';

  let user_list_url = '/sys/sysUser/selectUserList';
  export default {
    name: 'tranfer',
    props: {
      url: {
        type: String,
        default: 'sys/coreBdInsMc/selectByPage',
      },
      columns1: {
        type: Array
      },
      columns2: {
        type: Array
      },
    },
    data() {
      return {
        data1: this.loadData(),
        data2: [],
        toLeft: true,
        toRight: true,
      };
    },
    mounted() {
      this.grid = $('#grid').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        columnFixing: {
          enabled: true
        },
        // selection: {
        //     mode: 'single'
        // },
        selection: {
          allowSelectAll: true,
          mode: 'multiple',
          showCheckBoxesMode: 'always'
        },
        onSelectionChanged: (e) => {
          if (e.selectedRowKeys.length > 0) {
            this.toRight = false
          }
          else {

          }
        },
        hoverStateEnabled: true,
        dataSource: {
          store: this.data1
        },
        remoteOperations: {
          filtering: false,
          sorting: false,
          paging: false
        },
        paging: {
          pageSize: 10
        },
        columns: this.columns1
      }).dxDataGrid('instance');

      this.grid1 = $('#grid1').dxDataGrid({
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        columnFixing: {
          enabled: true
        },
        // selection: {
        //     mode: 'single'
        // },
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

          }
        },
        hoverStateEnabled: true,
        dataSource: {
          store: this.data2
        },
        remoteOperations: {
          filtering: true,
          sorting: true,
          paging: true
        },
        paging: {
          pageSize: 10
        },
        columns: this.columns2
      }).dxDataGrid('instance');
    },
    methods: {
      loadData: function () {
        let params = {};
        this.$put(this.url, params).then(res => {
          if (res.code == '200') {
            this.data1 = res.rows;
            this.grid.option("dataSource", this.data1);
          }
          else {
            this.data1 = [];
            this.warn(res.msg);
          }
        }).catch(err => {
          this.data1 = [];
          this.error(err);
        });
      },
      moveRight: function () {
        let selectData = this.grid.getSelectedRowsData();
        for (let i = 0; i < selectData.length; i++) {
          this.data2.unshift(selectData[i])
          let index = this.data1.indexOf(selectData[i])
          this.data1.splice(index, 1)
        }
        this.grid1.option("dataSource", this.data2);
        this.grid.option("dataSource", this.data1);
        this.grid.deselectAll();
        this.toRight = true;
      },
      moveLeft: function () {
        let selectData = this.grid1.getSelectedRowsData();
        for (let i = 0; i < selectData.length; i++) {
          this.data1.unshift(selectData[i]);
          let index = this.data2.indexOf(selectData[i]);
          this.data2.splice(index, 1)
        }
        this.grid1.option("dataSource", this.data2);
        this.grid.option("dataSource", this.data1);
        this.grid1.deselectAll();
        this.toLeft = true;
      }
    }
  };
</script>
