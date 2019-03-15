<style lang="less">
  @import "../../../styles/common.less";
  #total-query{
    padding:0px;
  }
</style>

<template>
  <div>
      <Row>
        <Col span="12" style="padding-right: 5px">
          <Card dis-hover>
            <p slot="title">总额查询</p>
            <Searchpanel ref="searchPanel">
              <div slot="form" id="searchForm">
              </div>
              <div slot="control">
                <Button size="small" type="primary" @click="totalSearch">查询</Button>
                <Button size="small" @click="totalResetSearch" class="margin-left-5">重置</Button>
              </div>
            </Searchpanel>
            <div id="total-query"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card dis-hover>
            <p slot="title">科室查询</p>
            <Row class="margin-top-10">
              <Searchpanel ref="searchPanel">
                <div slot="form" id="deptSearchForm">
                </div>
                <div slot="control">
                  <Button size="small" type="primary" @click="deptSearch">查询</Button>
                  <Button size="small" @click="deptResetSearch" class="margin-left-5">重置</Button>
                </div>
              </Searchpanel>
            </Row>
            <Row class="margin-top-5">
              <div id="dept-query"></div>
            </Row>
          </Card>
        </Col>
      </Row>
  </div>
</template>

<script>
  import Vue from 'vue';

  let total_query_url = 'sys/coreBdLs/selectByAllLimit';
  let dept_query_url = 'sys/coreBdLsDept/selectByAllLimit';
  let dept_list_url='sys/bdDept/selectList';
  let dept_url='sys/bdDept/selectByMap';
    export default {
      data() {
        return {
          isLoadData: true,
          searchForm: {},
          searchFormData: {},
          deptSearchForm: {},
          deptSearchFormData: {},
          editForm: {},
          editFormData: {},
          lsId: null,
          modal: {
            visible: false,
            modal_loading: false,
            isNew: true,
          },
          totalQueryData: new this.customstore({
            load: (loadOptions) => {
                return this.CommDs.loadPage(loadOptions, total_query_url, this.isLoadData, {}, this.totalQuery);
            },
          }),
          deptQueryData: new this.customstore({
            load: (loadOptions) => {
              if(loadOptions.searchData==null)
              {
                var deferred = $.Deferred();
                return deferred.resolve([], {totalCount: 0});
              }else {
                return this.CommDs.loadPage(loadOptions, dept_query_url, this.isLoadData, {}, this.deptQuery);
              }
            },
          }),
          deptData: new this.customstore({
            key: "dcode",
            byKey: (key) => {
              return this.CommDs.loadByKey(dept_url, {deptId: parseInt(key)});
            },
            load: (e) =>{
              return this.CommDs.loadList(dept_list_url);
            }
          }),
        }
      },
      mounted(){
        let _this = this;
        this.searchForm = $('#searchForm').dxForm({
          colCount: 2,
          formData: this.searchFormData,
          items: [
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
              dataField: 'planYears',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'right',
                text: '年份',
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.getYear(),
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },
          ]
        }).dxForm('instance');
        this.totalQuery = $('#total-query').dxDataGrid({
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
          onSelectionChanged:(e)=>{
            var ds = this.deptQuery.getDataSource();
            ds.loadOptions().searchData = {
              lsId:e.selectedRowsData[0].id,
            };
            _this.lsId = e.selectedRowsData[0].id;
            ds.reload();
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
            store: this.totalQueryData,
          },
          columns: [
            {
              dataField: 'type',
              caption: '险种类别',
              alignment: 'center',
              lookup: {
                dataSource: this.enum.dxInsCls,
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },
            {
              dataField: 'year',
              caption: '年份',
              width:100,
              alignment: 'left',
            },
            {
              dataField: 'yearRealLimit',
              caption: '年度实际额度',
              alignment: 'right',
              width:120,
              cellTemplate(e,o){
                // if(!o.data.yearRealLimit){return;}
                let number = Math.floor(o.data.yearRealLimit * 100) / 100;
                e.append("<span>"+parseFloat(number)+"</span>");
                if(number>o.data.planNumWarn)
                {
                  $(e).html( "<p style='color:red'>"+number+"</p>");
                }else {
                  $(e).text(number);
                }
              }
            },
            {
              dataField: 'yearRealEnt',
              caption: '年度实际人数',
              alignment: 'right',
              width:120,
              cellTemplate(e,o){
                if(o.data.yearRealEnt>o.data.planPeopleWarn)
                {
                  $(e).html( "<p style='color:red'>"+o.data.yearRealEnt+"</p>");
                }else {
                  $(e).text(o.data.yearRealEnt);
                }
              }
            },
          ]
        }).dxDataGrid('instance');
        //科室查询
        this.deptSearchForm = $('#deptSearchForm').dxForm({
          colCount: 2,
          formData: this.deptSearchFormData,
          items: [
            {
              dataField: 'deptId',
              editorType: 'dxSelectBox',
              editorOptions: {
                dataSource: this.deptData,
                placeholder: '请输入处理科室',
                displayExpr: 'dname',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '科室'
              },
            },
            {
              dataField: 'scope',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'center',
                text: '来源',
              },
              editorOptions: {
                placeholder: '请选择',
                dataSource: this.enum.dxScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },
          ]
        }).dxForm('instance');
        this.deptQuery=$('#dept-query').dxDataGrid({
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
          pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            infoText:"共{1}页/{2}条数据"
          },
          paging: {
            pageSize: 10,
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
            store: this.deptQueryData,
          },
          columns: [
            {
              dataField: 'deptId',
              caption: '科室',
              lookup: {
                dataSource: this.deptData,
                displayExpr: 'dname',
                valueExpr: 'id',
              },
            },
            {
              dataField: 'scope',
              caption: '来源',
              alignment: 'center',
              width:100,
              lookup: {
                dataSource: this.enum.dxScope,
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },
            {
              dataField: 'yearRealLimit',
              caption: '年度实际额度',
              alignment: 'right',
              width:120,
              cellTemplate(e,o){
                // if(!o.data.yearRealLimit){return;}
                let number = Math.floor(o.data.yearRealLimit * 100) / 100;
                e.append("<span>"+parseFloat(number)+"</span>");
                if(number>o.data.planNumWarn)
                {
                  $(e).html( "<p style='color:red'>"+number+"</p>");
                }else {
                  $(e).text(number);
                }
              }
            },
            {
              dataField: 'yearRealEnT',
              caption: '年度实际人数',
              alignment: 'right',
              width:120,
              cellTemplate(e,o){
                if(o.data.yearRealEnT>o.data.planPeopleWarn)
                {
                  $(e).html( "<p style='color:red'>"+o.data.yearRealEnT+"</p>");
                }else {
                  $(e).text(o.data.yearRealEnT);
                }
              }
            },
          ]
        }).dxDataGrid('instance');
      },
      methods:{
        getYear(){
          let date=new Date();
          let year=date.getFullYear();
          let yearArray=[];
          for(let i=7;i>0;i--){
            yearArray.push({
              "id":year-i,
              "text":year-i,
            });
          }
          for(let i=0;i<=7;i++){
            yearArray.push({
              "id":year+i,
              "text":year+i,
            });
          };
          let len = yearArray.length;
          for (let j = 0; j < len; j++) {
            for (let k = 0; k < len - 1 - j; k++) {
              if (yearArray[k] > yearArray[k+1]) {        //相邻元素两两对比
                let temp = arr[k+1];        //元素交换
                yearArray[k+1] = yearArray[k];
                yearArray[k] = temp;
              }
            }
          }
          return yearArray;
        },
        totalSearch:function(){
          var ds = this.totalQuery.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
          var ds1 = this.deptQuery.getDataSource();
          ds1.loadOptions().searchData = null;
          ds1.reload();
        },
        totalResetSearch:function(){
          this.searchForm.resetValues();
          this.totalQuery.refresh();
        },
        deptSearch:function(){
          if(this.lsId==null){
            this.warn("请选择总额");
            return;
          }
          var ds = this.deptQuery.getDataSource();
          ds.loadOptions().searchData = this.deptSearchFormData;
          ds.loadOptions().searchData.lsId = this.lsId;
          ds.reload();
        },
        deptResetSearch:function(){
          this.deptSearchForm.resetValues();
          this.deptQuery.refresh();
        },
      }
    }
</script>


