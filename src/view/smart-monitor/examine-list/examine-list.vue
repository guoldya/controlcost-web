<style scoped>

</style>

<template>
  <div>
    <Row>
      <Col>
        <Card>
          <Row >
            <Searchpanel ref="searchPanel">
              <div slot="form" class="margin-bottom-10" id="searchForm">
              </div>
              <div slot="control">
                <Button size="small" type="primary" @click="search">查询</Button>
                <Button size="small" @click="resetSearch" class="margin-left-5" >重置</Button>
              </div>
            </Searchpanel>
          </Row>
          <Row class="margin-top-10">
            <div id="window-check" class="margin-top-10"></div>
          </Row>
        </Card>
      </Col>
    </Row>
    <!--<Modal v-model="modal.visible" :mask-closable="false" width="550" title="编辑数据">-->
    <!--<p slot="header">-->
    <!--<span>撤销【{{list.itemName}}+{{list.crName}}】状态</span>-->
    <!--</p>-->
    <!--<Row>-->
    <!--<Col span="24">-->
    <!--<div id="back"></div>-->
    <!--</Col>-->
    <!--</Row>-->
    <!--<div slot="footer">-->
    <!--<Button type="text" @click="backFormCancel">取消</Button>-->
    <!--<Button type="primary" :loading="modal.modal_loading" @click="backFormSubmit">提交</Button>-->
    <!--</div>-->
    <!--</Modal>-->
  </div>
</template>

<script>
  import Vue from 'vue';
  let window_check_url = 'sys/coreRuleExecute/selectSinglePage';
  export default {
    data() {
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        backForm: {},
        backFormData: {},
        infoKey:[],
        list:{},
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
        windowCheckData: new this.customstore({
          load: (loadOptions) => {
            if (loadOptions.searchData == null){
              loadOptions.searchData = {docCode:localStorage.user};
            }
            return this.CommDs.loadPage(loadOptions, window_check_url, this.isLoadData, {}, this.windowCheck);
          },
        }),
      }
    },
    mounted(){
      let _this=this;
      this.searchForm=$("#searchForm").dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
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
            dataField: 'createBy',
            label: {
              alignment: 'right',
              text: '审核时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');
      this.windowCheck=$('#window-check').dxDataGrid({
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
        onSelectionChanged:(selectedItems)=>{
          // console.log(selectedItems);
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
            width:100,
            cellTemplate: (container, options) => {
              //操作列
              container.append('<div id=\'t1\'/>');
              var opcol = new (Vue.component('OpCol'));
              this.list=options.data;
              opcol.items = [{
                text: '查看',
                showtip: false,
                id: {
                  id: options.data.id,
                  ocode: options.data.ocode,
                },
                click: this.look
              },
              ];
              opcol.$mount('#t1');
            },
          },
          {
            caption: '患者姓名',
            dataField: 'empiName',
            alignment:"left",
            width:140,
          },
          {
            caption: '审核结果',
            dataField: 'auditState',
            alignment:"center",
            lookup: {
              dataSource: this.enum.violationAuditState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            cellTemplate(e,o){
              if(o.data.auditState==3) {
                e.append( "<p style='color:red'>"+o.text+"</p>");
              }else {
                e.append( "<p >"+o.text+"</p>");
              }
            },
            width:100,
          },
          {
            caption: '审核意见',
            dataField: 'auditOpinion',
            alignment:"left",
            minWidth:180,
          },
          {
            caption: '审批项目',
            dataField: 'itemName',
            alignment:"left",
            width:140,
          },

          {
            caption: '违反规则',
            dataField: 'crName',
            alignment:"left",
            width:180,
          },
          {
            caption: '审批时间',
            dataField: 'createBy',
            alignment:"left",
            width:140
          },
        ]
      }).dxDataGrid('instance');
    },
    methods: {
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
        ds.loadOptions().searchData.crLevel = 2;
        ds.loadOptions().searchData.dataState = 1;
        ds.loadOptions().searchData.docCode = localStorage.user;
        ds.reload();
      },
      resetSearch: function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.updateDate = '';
        this.searchForm.resetValues();
        this.windowCheck.refresh();
      },
      look: function(data) {
        const route = {
          query: data,
          name: 'examine-list-detail',
          path: 'examine-list-detail',
          component: () => import('@/view/smart-monitor/examine-list/examine-list-detail.vue')
        };
        this.$router.push(route)
      },
    }
  }
</script>
