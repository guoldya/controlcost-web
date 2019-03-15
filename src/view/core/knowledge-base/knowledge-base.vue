<style lang="less">
  @import "../../../styles/common.less";
</style>
<template>
    <div>
      <Card dis-hover>
        <p slot="title">知识库</p>
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

        <form  class="imFile" enctype="multipart/form-data"  style="display: none" >
          <input id="" type="submit" value="上传" />
        </form>

        <Row class="margin-top-10">
          <div id="knowledge-grid"></div>
        </Row>
      </Card>
      <Modal v-model="modal.visible" :mask-closable="false" width="650" title="规则 包创建">
        <p slot="header">
          <span>规则 包创建</span>
        </p>
        <div id="editForm"></div>
        <Card dis-hover class="margin-top-10">
          <div id="package-grid" ></div>
        </Card>
        <div slot="footer">
          <Button type="text" @click="editFormCancel">取消</Button>
          <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
  import Vue from 'vue';
  let core_version_create_url = 'sys/coreVersion/createDataToFile';
  let core_version_select_url = 'sys/coreVersion/selectByPage';

  let core_upload_url = 'sys/coreVersion/upload';
  let download_url = '/api/sys/coreVersion/download';
  let upload_url = '/api/sys/coreVersion/upload';

  let sys_bdOrg_list_url = 'sys/bdOrg/selectByList';
  let sys_bdOrg_map_url = 'sys/bdOrg/selectByMap';
  //规则接口
  let rule_table_url='sys/coreRule/selectMultipleList';

  let sys_user_select_url = 'sys/sysUser/selectIdAndName';
    export default {
      name: "knowledge-base",
      data() {
        return {
          isLoadData: true,
          searchForm: {},
          searchFormData: {},
          editForm: {},
          editFormData: {},
          editImportForm: {},
          editImportFormData: {},
          packageImportGrid: {},
          packageImportGridData: [],

          dataParams: null,
          urlUpload: core_upload_url,
          packageListData: [],
          modal: {
            visible: false,
            modal_loading: false,
          },
          modalImport: {
            visible: false,
            modal_loading: false,
          },

          knowledgeGridData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, core_version_select_url, this.isLoadData, {}, this.knowledgeGrid);
            },
          }),

          sysBdOrgListData: new this.customstore({
            key: "ocode",
            byKey: (key) => {
              return this.CommDs.loadByKey(sys_bdOrg_map_url, {ocode: key, status: 1});
            },
            load: (e) => {
              return this.CommDs.loadList(sys_bdOrg_list_url, {status: 1});
            }
          }),

          //规则查
          packageGridData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadList( rule_table_url,loadOptions.searchData);
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
              dataField: 'ocode',
              label: {
                alignment: 'right',
                text: '医疗机构名称'
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择医疗机构名称',
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
            },
            {
              dataField: 'createTime',
              label: {
                alignment: 'right',
                text: '创建时间'
              },
              template: this.dateRange,
            },
          ]
        }).dxForm('instance');

        this.editForm = $('#editForm').dxForm({
          colCount: 2,
          formData: this.editFormData,
          items: [
            {
              dataField: 'version',
              label: {
                alignment: 'right',
                text: '版本号'
              },
              editorOptions: {
                maxLength: 32,
              },
              validationRules: [{
                type: "required",
                message: "请输入"
              }]
            },
            {
              dataField: 'ocode',
              label: {
                alignment: 'right',
                text: '医疗机构名称'
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择医疗机构名称',
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
              validationRules: [{
                type: "required",
                message: "请输入"
              }]
            },
            {
              dataField: 'status',
              editorType: 'dxSelectBox',
              editorOptions: {
                disabled: true,
                dataSource: this.enum.packageType,
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '类型'
              },
              validationRules: [{
                type: "required",
                message: "请选择类型"
              }]
            },
          ]
        }).dxForm('instance');

        this.editImportForm = $('#editImportForm').dxForm({
          colCount: 2,
          formData: this.editImportFormData,
          items: [
            {
              dataField: 'version',
              label: {
                alignment: 'right',
                text: '版本号'
              },
            },
            {
              dataField: 'ocode',
              label: {
                alignment: 'right',
                text: '医疗机构名称'
              },
              editorType: 'dxSelectBox',
              editorOptions: {
                placeholder: '请选择医疗机构名称',
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
            },
          ]
        }).dxForm('instance');

        //创建窗口规则网格
        this.packageGrid = $('#package-grid').dxDataGrid({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          wordWrapEnabled: true,
          //height:360,
          columnFixing: {
            enabled: true
          },
          selection: {
            allowSelectAll: true,
            mode: 'multiple',
            showCheckBoxesMode: 'always'
          },

          remoteOperations: {
            filtering: true,
            sorting: true,
            // paging: true
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
          searchPanel: {
            visible: true,
            width: 200,
            placeholder: "网格自带检索功能",
          },
          onOptionChanged:function(e){
            if(e.name == "searchPanel"){
              if(typeof (e.value) == 'string'){
                _this.packageGrid.getDataSource().loadOptions().searchData = {keyword:e.value};
              }
            }
          },
          dataSource: {
            store: this.packageGridData,
          },
          onSelectionChanged: function (selectedItems) {
            _this.packageListData = selectedItems.selectedRowsData;

          },
          columns: [
            {
              caption: '编码',
              dataField: 'id',
              alignment:'right',
              minWidth: 100
            },
            {
              caption: '规则名称',
              dataField: 'name',
              minWidth: 150
            },
            {
              caption: '备注',
              dataField: 'remark',
              width: 150
            },
            {
              caption: '更新时间',
              dataField: 'updateTime',
              dataType: "datetime",
              format: "yyyyy-MM-dd HH:mm",
              width: 150
            },
          ]
        }).dxDataGrid('instance');
        //知识库网格
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
                return $('<div id=\'btn\'/>')
                  .append(
                    $("<h2 />")
                      .addClass("count")
                      .text("CustomerStoreState"),
                    $("<span />")
                      .addClass("name")
                      .text("Total Count")
                  );
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
          onSelectionChanged: (e) => {
            this.dataParams = e.selectedRowsData[0].version;
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
              alignment: 'left',
              lookup: {
                dataSource: this.sysBdOrgListData,
                displayExpr: 'oname',
                valueExpr: 'ocode',
              },
              minWidth: 200
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
          {id: 1, text: '创建', type: 'primary', enabled: true, click: this.createPackages},
          {id: 2, text: '导入包', enabled: true, click: this.importPackages},
          {id: 3, text: '下载包', enabled: true, click: this.downloadPackages},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods: {

        //添加创建时间搜索
        dateRange: function (data, itemElement) {
          itemElement.append('<div id=\'createDateRange\'/>');
          var dateRange = new (Vue.component('DateRange'));
          dateRange.field = data;
          dateRange.$mount('#createDateRange');
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
        //创建包
        createPackages: function () {
          this.packageGrid.selectRows([], false);
          this.modal.isNew = true;
          this.editFormData = {};
          this.editFormData.status = 1;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;
        },
        editFormCancel: function () {
          this.modal.visible = false;
        },
        formSubmit: function () {
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          }
          let ids = [];
          for (let key in this.packageListData) {
            ids[key] = this.packageListData[key].id;
          }
          this.editFormData.crIds = ids;
          this.$post(core_version_create_url, this.editFormData).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
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
          this.modal.modal_loading = false;
        },
        importPackages: function () {
          let _this = this;
          $(".imFile").empty();
          $(".imFile").append("<input  class=\"File1\"  name=\"file\" type=\"file\" value=\"\"/>");
          $('.File1').on('change', function (e) {
            var fd = new FormData();
            if (this.files[0].name){
              fd.append(this.files[0].name, this.files[0])
            }
            $.ajax({
              url: '/api/sys/coreVersion/upload',
              type: 'POST',
              processData: false,
              contentType: false,
              data: fd,
              success: function (data) {
                if (data.code == '200'){
                  _this.success("上传文件成功");
                  _this.knowledgeGrid.refresh();
                }else {
                  _this.warn("上传文件异常");
                }
              },
              error: function () {
                _this.warn("上传文件异常");
              }
            });
          });
          $('.File1').click();
        },

        format: function(str) {
        var args = arguments, re = new RegExp("%([1-" + args.length + "])", "g");
        return String(str).replace(
          re,
          function($1, $2) {
            return args[$2];
          }
        );
      },
        downloadPackages: function () {
          var self = {};
          let param = {};
          param.version = this.dataParams;
          self.params = {};
          self.params.version = this.dataParams;
          if (self.params.version == null) {
            this.warn('请选择需要下载的包');
            return;
          }
          self.params.action = download_url;
          var downloadHelper = $('<iframe style="display:none;" id="downloadHelper"></iframe>').appendTo('body')[0];
          var doc = downloadHelper.contentWindow.document;
          if (doc) {
            doc.open();
            doc.write('');
            doc.writeln(this.format("<html><body><form id='downloadForm' name='downloadForm' method='get' action='%1'>", self.params.action));
            for (var key in self.params) doc.writeln(this.format("<input type='hidden' name='%1' value='%2'>", key, self.params[key]));
            doc.writeln('<\/form><\/body><\/html>');
            doc.close();
            var form = doc.forms[0];
            if (form) {
              form.submit();
            }
          }
        }
      }
    }
</script>

