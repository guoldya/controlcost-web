<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Row>
      <Card>
        <Row >
          <Searchpanel ref="searchPanel">
            <div slot="form" class="margin-bottom-3" id="searchForm">
            </div>
            <div slot="control">
              <Button size="small" type="primary" @click="search">查询</Button>
              <Button size="small" @click="resetSearch" class="margin-left-5" >重置</Button>
            </div>
          </Searchpanel>
        </Row>
        <Row class="margin-top-10">
          <div id="single-details-grid" class="margin-top-10"></div>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';
  let core_bd_indicator_url = 'sys/coreBdIndicator/selectDetailPage';
  let dept_list_url='sys/bdDept/selectList';
  let dept_url='sys/bdDept/selectByMap';
  let cbiId_list_url='sys/coreBdIndicator/selectList';
  let cbiId_id_url='sys/coreBdIndicator/selectOne';

  let doc_target_url= 'sys/coreBdIndicator/selectRepeatDe';
  let doc_detail_url= 'sys/sysUser/selectOne';
  export default {
    name: "single-disease-details",
    data() {
      return {
        doc:{doc:"doc"},
        dateTime:[],
        cbsId:null,
        outCode:null,
        diseaseName:null,
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        singleDetailsGrid: {},
        singleGridData: new this.customstore({
          load: (loadOptions) => {
            return this.CommDs.loadPage(loadOptions, core_bd_indicator_url, this.isLoadData, {}, this.singleGrid);
          },
        }),

        deptData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(dept_url, {dcode: key});
          },
          load:this.deptListData,
        }),
        //指标
        getCbiIdData:new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(cbiId_id_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(cbiId_list_url,{status:1});
          }
        }),
        docTypeData:new this.customstore({
          key: "docCode",
          byKey: (key) => {
            return this.CommDs.loadByKey(doc_detail_url, {account: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(doc_target_url,this.doc);
          }
        }),
      }
    },
    mounted(){
      this.jumpFrom();
      this.searchForm=$("#searchForm").dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'outCode',
            editorType: 'dxSelectBox',
            editorOptions: {
              showClearButton:true,
              dataSource: this.deptData,
              placeholder: '请选择处理科室',
              displayExpr: 'dname',
              valueExpr: 'dcode',
            },
            label: {
              alignment: 'right',
              text: '科室'
            },
          },
          {
            dataField: 'diseaseName',
            editorOptions: {
              placeholder: '请输入病种名称',
            },
            label: {
              alignment: 'right',
              text: '病种名称'
            },
          },
          {
            dataField: 'itemName',
            editorOptions: {
              placeholder: '请输入项目名称',
            },
            label: {
              alignment: 'right',
              text: '项目名称'
            },
          },
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
            dataField: 'account',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.docTypeData,
              placeholder: '请选择开单医生',
              displayExpr: 'name',
              valueExpr: 'docCode',
            },
            label: {
              alignment: 'right',
              text: '开单医生'
            },
          },
          // {
          //   dataField: 'iId',
          //   editorType: 'dxSelectBox',
          //   editorOptions: {
          //     dataSource: this.getCbiIdData,
          //     placeholder: '请输入指标名称',
          //     displayExpr: 'name',
          //     valueExpr: 'id',
          //   },
          //   label: {
          //     alignment: 'right',
          //     text: '指标名称'
          //   },
          // },
          {
            dataField: 'crLevel',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.controlState,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '控制方式'
            },
          },
          {
            dataField: 'auditState',
            editorType: 'dxSelectBox',
            editorOptions: {
              dataSource: this.enum.handlingResult,
              placeholder: '请选择',
              displayExpr: 'text',
              valueExpr: 'id',
            },
            label: {
              alignment: 'right',
              text: '处理结果'
            },
          },
          {
            dataField: 'createBy',
            label: {
              alignment: 'right',
              text: '创建时间'
            },
            template: this.addDateRange,
          },
        ]
      }).dxForm('instance');
      this.singleGrid=$('#single-details-grid').dxDataGrid({
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
          store: this.singleGridData
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
              opcol.items = [{
                text: '查看',
                showtip: false,
                id:options.data,
                click: this.look
              }];
              opcol.$mount('#t1');
            },
            width:80,
          },
          {
            caption: '编码',
            dataField: 'id',
            alignment:"right",
            width:80,
          },
          {
            dataField: 'deptName',
            caption: '科室',
            alignment: 'left',
            // lookup: {
            //   dataSource: this.deptData,
            //   displayExpr: 'dname',
            //   valueExpr: 'id',
            // },
            width:100
          },
          {
            caption: '病种名称',
            dataField: 'diseaseName',
            alignment:"left",
            width:100,
          },
          {
            caption: '项目名称',
            dataField: 'itemName',
            alignment:"left",
            width:100,
          },
          {
            caption: '患者姓名',
            dataField: 'empiName',
            alignment:"left",
            width:100,
          },
          {
            caption: '开单医生',
            dataField: 'docCode',
            alignment:"left",
            width:100,
          },
          // {
          //   dataField: 'cbiName',
          //   caption: '违反指标名称',
          //   alignment: 'left',
          //   width: 130,
          // },
          {
            caption: '违反规则名称',
            dataField: 'crName',
            alignment:"left",
            minWidth:120
          },
          {
            caption: '控制方式',
            dataField: 'crLevel',
            alignment:"center",
            width:80,
            lookup: {
              dataSource: this.enum.controlState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            cellTemplate(e,o){
              if(o.data.crLevel==1) {
                e.append( "<p style='color:orange'>"+o.text+"</p>");
              }else if(o.data.crLevel==2){
                e.append( "<p style='color:purple'>"+o.text+"</p>");
              } else  if(o.data.crLevel==3){
                e.append( "<p style='color:red'>"+o.text+"</p>");
              }else{
                e.append( "<p >"+o.text+"</p>");
              }
            }
          },
          {
            caption: '处理结果',
            dataField: 'auditState',
            alignment:"center",
            width:80,
            lookup: {
              dataSource: this.enum.violationAuditState,
              displayExpr: 'text',
              valueExpr: 'id'
            },
            cellTemplate(e,o){
              if(o.data.auditState==3)
              {
                $(e).html( "<p style='color:red'>"+o.text+"</p>");
              }else {
                $(e).text(o.text);
              }
            }
          },
          {
            caption: '创建时间',
            dataField: 'createBy',
            alignment:"left",
            width:130,
          },
        ]
      }).dxDataGrid('instance');
      var ds = this.singleGrid.getDataSource();
      ds.loadOptions().searchData = this.searchFormData;
      ds.reload();
    },
    methods: {
      //时间范围
      addDateRange: function (data, itemElement) {
        itemElement.append('<div id=\'dateRange\'/>');
        var dateRange = new (Vue.component('DateRange'));
        dateRange.field = data;
        dateRange.$mount('#dateRange');
        dateRange.$parent = this;
        this.$refs.dateRange = dateRange;
      },
      search: function () {
        var ds = this.singleGrid.getDataSource();
        this.searchFormData.cbsId=null;
        ds.loadOptions().searchData = this.searchFormData;
        // console.log(this.searchFormData.outCode);
        if (this.searchFormData.outCode == -1){
          ds.loadOptions().searchData.outCode = null;
        }
        ds.reload();
      },
      resetSearch:function () {
        this.$refs.dateRange.values = null;
        this.searchFormData.createBy = [];
        this.searchForm.resetValues();
        this.singleGrid.refresh();
      },
      //查看详情
      look: function(data) {
        let params = {};
        params.id = data.id;
        params.ocode = data.ocode;
        if (this.$route.query.dateStart){
          params.dateStart = this.$route.query.dateStart;
          params.dateEnd = this.$route.query.dateEnd;
        }
        if (this.$route.query.diseaseName){
          params.diseaseName = this.$route.query.diseaseName;
        }
        if (this.$route.query.cbsId){
          params.cbsId = this.$route.query.cbsId;
        }
        if (this.$route.query.outCode){
          params.outCode = this.$route.query.outCode;
        }
        const route = {
          query:params,
          name: 'single-disease-details',
          path: 'single-disease-details',
          component: () => import('@/view/disease-mgt/single-disease/single-disease-details.vue')
        };
        this.$router.push(route)
      },
      jumpFrom:function(){
        if (this.$route.query.dateStart ||this.$route.query.dateEnd ){
          this.dateTime[0] = this.$route.query.dateStart;
          this.dateTime[1] = this.$route.query.dateEnd;
          this.searchFormData.createBy=this.dateTime;
        }
        if (this.$route.query.outCode) {
          this.searchFormData.outCode = this.$route.query.outCode;
        }
        if (this.$route.query.cbsId) {
          this.searchFormData.cbsId = Number(this.$route.query.cbsId);
        }
        if (this.$route.query.diseaseName) {
          this.searchFormData.diseaseName = this.$route.query.diseaseName;
        }
        if (this.$route.query.excess) {
          this.searchFormData.excess = this.$route.query.excess;
        }
      },

      deptListData: function () {
        var deferred = $.Deferred(),
          params = {};
        this.$put(dept_list_url, params).then(res => {
          if (res.code == '200') {
            res.rows.unshift({dcode:-1,dname:"所有科室"});
            deferred.resolve({ data: res.rows, totalCount: res.rows.length } );
          }
          else {
            var msg = getmsg(res);
            //提示信息
            this.warn(res.msg);
            console.warn(msg);
            deferred.resolve([], {
              totalCount: 0
            });
          }
        }).catch(err => {
          deferred.resolve([], {
            totalCount: 0
          });
          this.error(err);
        });
        return deferred.promise();
      }
    }

  }
</script>
