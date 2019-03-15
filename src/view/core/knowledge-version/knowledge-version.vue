<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
  <div>
    <Card dis-hover>
      <p slot="title">知识库版本</p>
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
        <div id="knowledge-grid"></div>
      </Row>
    </Card>
  </div>
</template>

<script>
  import Vue from 'vue';
  let core_version_select_url = 'sys/coreVersion/selectByPage';
  //还原
  let core_version_Save_url = 'sys/coreVersion/resolveFileAndSave';
  //备份
  let core_version_dataIntoFile_url = 'sys/coreVersion/selectDataIntoFile';
  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
    export default {
        name: "knowledge-version",
      data() {
          return {
            isLoadData: true,
            searchForm: {},
            searchFormData: {},

            backUpData: [],
            knowledgeGridData: new this.customstore({
              load: (loadOptions) => {
                return this.CommDs.loadPage(loadOptions, core_version_select_url, this.isLoadData, {}, this.knowledgeGrid);
              },
            }),

            sysBdOrgListData: new this.customstore({
              key: "ocode",
              byKey: (key) => {
                return this.CommDs.loadByKey(sys_bdOrg_map_url, {ocode: key,status: 1});
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
          let _this = this;
        this.searchForm = $('#searchForm').dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'version',
              label: {
                alignment: 'right',
                text: '版本号'
              },

            },
            {
              dataField: 'createTime',
              label: {
                alignment: 'right',
                text: '创建时间'
              },
              template: this.addDateRange,
            },
            {
              dataField: 'createName',
              label: {
                alignment: 'right',
                text: '创建人'
              },
            },
          ]
        }).dxForm('instance');
        this.knowledgeGrid = $('#knowledge-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          wordWrapEnabled: true,
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
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true
          },
          paging: {
            pageSize: 10
          },
          dataSource: {
            store: this.knowledgeGridData
          },
          columns: [
            {
              caption: '序号',
              dataField: 'id',
              alignment: 'right',
              width: 80
            },
            {
              caption: '医疗机构名称',
              dataField: 'ocode',
              minWidth: 150,
              lookup: {
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
            },
            {
              caption: '版本号',
              dataField: 'version',
              minWidth: 130
            },
            {
              caption: '创建人',
              dataField: 'createName',
              alignment: 'left',
              width: 200
            },
            {
              caption: '创建时间',
              dataField: 'createTime',
              dataType: "datetime",
              format: "yyyy-MM-dd HH:mm",
              width: 200
            },
            {
              caption: '类型',
              alignment: 'center',
              dataField: 'status',
              lookup: {
                dataSource: this.enum.packageType,
                displayExpr: 'text',
                valueExpr: 'id',
              }
            },
          ]
        }).dxDataGrid('instance');
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '一键备份', type: 'primary', enabled: true, click: this.Backup},
          {id: 2, text: '一键还原', type: 'primary', enabled: true, click: this.reduction},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
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
          var ds = this.knowledgeGrid.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
        },
        resetSearch: function () {
          this.$refs.dateRange.values = null;
          this.searchFormData.createTime = null;
          this.searchForm.resetValues();
          this.knowledgeGrid.refresh();
        },
        //备份
        Backup: function () {
          this.$post(core_version_dataIntoFile_url).then(res => {
            if (res.code == '200') {
              this.success('备份成功!', () => {
                this.knowledgeGrid.refresh();
              });
            }
            else {
              //提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        },
        //还原
        reduction: function () {
          this.$post(core_version_Save_url).then(res => {
            if (res.code == '200') {
              this.success('还原成功!', () => {
                this.knowledgeGrid.refresh();
              });
            }
            else {
              //提示信息
              this.warn(res.msg);
            }
          }).catch(err => {
            this.error(err);
          });
        }
      }
    }
</script>

