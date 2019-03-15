<style scoped>
  @import "../../../styles/common.less";
</style>

<template>
  <div>
    <Row>
      <Col span="9">
        <Card dis-hover>
          <Row >
            <Searchpanel ref="searchPanel">
              <div slot="form" class="margin-bottom-3" id="searchForm">
              </div>
              <div slot="control">
                <Button size="small" type="primary" @click="search">搜索</Button>
              </div>
            </Searchpanel>
          </Row>
          <Row class="margin-top-10">
            <div id="window-spec"></div>
          </Row>
        </Card>
      </Col>
      <Col span="15">
        <Card dis-hover>
          <Row>
            <Col span="12"></Col>
          </Row>
          <Row>
            <div id="window-spec-col"></div>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modal.visible" :mask-closable="false" width="950" title="编辑数据">
      <p slot="header">
        <a @click="editFormCancel" class="margin-right-10">返回</a>
        <span >药品【阿莫西林】主题维护</span>
      </p>
      <Row>
        <Col span="24">
          <div id="editForm"></div>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <!--按钮-->
          <div id="add-spec" class="margin-top-10 margin-right-10"></div>
          <div id="change-spec" class="margin-top-10 margin-right-10"></div>
          <div id="delete-spec" class="margin-top-10"></div>
          <!--编辑左下侧表-->
          <div id="edit-spec" class="margin-top-10"></div>
        </Col>
        <Col span="12">
          <!--编辑右下侧表-->
          <div id="edit-spec-right" class="margin-top-20"></div>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import Vue from 'vue';

  let window_spec_url = 'sys/coreFactSubject/saveByList';
  let window_spec_col_url = 'sys/coreFactSubject/selectBySubSpecId';
  let edit_spec_url = 'sys/coreRuleDatasource/selectByPage';
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
            modal_loading: false
          },
          modalCol: {
            isNew: true,
            visible: false,
            modal_loading: false
          },
          windowSpecData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, window_spec_url, this.isLoadData, {}, this.windowSpec);
            },
          }),
          windowSpecColData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadList(window_spec_col_url,loadOptions.searchData);
            },
          }),
          //编辑左下侧表
          editSpecData: new this.customstore({
            load: (loadOptions) => {
              return this.CommDs.loadPage(loadOptions, edit_spec_url, this.isLoadData, {}, this.editSpec);
            },
          }),
        }
      },
      mounted(){
        let _this=this;
        this.searchForm=$("#searchForm").dxForm({
          colCount: 2,
          formData: this.searchFormData,
          items: [
            {
              editorType: 'dxSelectBox',
              editorOptions: {
                dataSource: this.enum.specType,
                placeholder: '药品组',
                displayExpr: 'text',
                valueExpr: 'id',
              },
            },
            {
              dataField:"",
              editorType: 'dxCheckBox',
              label:{
                alignment:"right",
                text:"是否存在规则"
              }
            },
            {
              caption: '关键字',
              dataField: '',
              alignment:"center"
            },
          ]
        }).dxForm('instance');
        this.windowSpec = $('#window-spec').dxDataGrid({
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
          onSelectionChanged:(e)=>{
            var ds = this.windowSpecCol.getDataSource();
            ds.loadOptions().searchData = {cfId:e.selectedRowKeys[0].id};
            ds.reload();
          },
          dataSource: {
            store: this.windowSpecData
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true
          },
          paging: {
            pageSize: 10
          },
          columns: [
            {
              caption: '编码',
              dataField: 'pid',
              alignment:"right",
            },
            {
              caption: '名称',
              dataField: 'subName',
              alignment:"center",
            },
            {
              caption: '规则主题数量',
              dataField: 'subSpecId',
              alignment:"center",
            },
          ]
        }).dxDataGrid('instance');
        this.windowSpecCol = $('#window-spec-col').dxTreeList({
          showRowLines: true,
          showBorders: true,
          columnAutoWidth: true,
          wordWrapEnabled: true,
          keyExpr: "id",
          parentIdExpr: "pdcode",
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
          dataSource: {
            store: this.windowSpecColData
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true
          },
          paging: {
            pageSize: 10
          },
          columns: [
            {
              caption: '药品【阿莫西林】规则',
              dataField: 'id',
              alignment:"center",
            },
            {
              caption: '最近修改时间',
              dataField: 'factName',
              alignment:"center",
            },
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
                if (options.data.status == 1) {
                  opcol.items = [
                    {id: 1, text: '编辑', type: 'primary', enabled: true, click: this.editCol},
                  ];
                } else {
                  opcol.items = [
                    {id: 1, text: '编辑', type: 'primary', enabled: true, click: this.editCol},
                  ];
                }
                opcol.$mount('#tcol1');
              },
            },
          ],
        }).dxTreeList('instance');
        //编辑表
        this.editForm = $('#editForm').dxForm({
          colCount: 3,
          formData: this.editFormData,
          items: [
            {
              caption: '主题名称',
              dataField: '主题名称',
              alignment:"center"
            },
            {
              dataField:"",
              editorType: 'dxCheckBox',
              label:{
                alignment:"right",
                text:"提取为模板"
              }
            },
            {
              dataField: '',
              editorType: 'dxSelectBox',
              editorOptions: {
                dataSource: this.enum.specType,
                placeholder:"某某医保政策限制",
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '模板选择'
              },
            },
            {
              caption: '分流规则',
              colSpan: 3,
              dataField: '分流规则',
              alignment:"center"
            },
          ],
        }).dxForm('instance');
        //编辑表中增加修改删除按钮
        this.addSpec=$("#add-spec").dxButton({
          text: "增加",
          width: 90,
          onClick: function(e) {}
        });
        this.changeSpec=$("#change-spec").dxButton({
          text: "修改",
          width: 90,
          onClick: function(e) {
          }
        });
        this.deleteSpec=$("#delete-spec").dxButton({
          text: "删除",
          width: 90,
          onClick: function(e) {
          }
        });
        //编辑表的左下侧表
        this.editSpec=$('#edit-spec').dxDataGrid({
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
          onSelectionChanged:(e)=>{
            var ds = this.windowSpecCol.getDataSource();
            ds.loadOptions().searchData = {cfId:e.selectedRowKeys[0].id};
            ds.reload();
          },
          dataSource: {
            store:this.editSpecData
          },
          remoteOperations: {
            filtering: true,
            sorting: true,
            paging: true
          },
          paging: {
            pageSize: 10
          },
          columns: [
            {
              caption: '规则名称',
              dataField: '',
              alignment:"center",
            },
            {
              caption: '版本号',
              dataField: '',
              alignment:"center",
            },
            {
              caption: '动作',
              dataField: '',
              alignment:"center",
            },
          ]
        }).dxDataGrid('instance');
        //编辑表的右下侧表
        this.editSpecRight=$('#edit-spec-right').dxForm({
          colCount: 1,
          // formData: this.searchFormData,
          items: [
            {
              dataField: '',
              editorType: 'dxSelectBox',
              editorOptions: {
                dataSource: this.enum.specType,
                placeholder:"限制${男}性",
                displayExpr: 'text',
                valueExpr: 'id',
              },
              label: {
                alignment: 'right',
                text: '模板选择'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '规则名称'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '提示消息'
              },
            },
            {
              dataField: '',
              editorOptions: {
                placeholder:"999 数组越大越前面",
              },
              label: {
                alignment: 'right',
                text: '提示顺序'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '事件原型'
              },
            },
            {
              dataField: '',
              editorOptions: {
                placeholder:"不填写自定义规则系统自动生成",
              },
              label: {
                alignment: 'right',
                text: '规则'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '备注'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '性别限制'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '限制诊断'
              },
            },
            {
              dataField: '',
              label: {
                alignment: 'right',
                text: '限制年龄',
              },
            },
            {
              dataField:"",
              editorType: 'dxCheckBox',
              label:{
                alignment:"right",
                text:"提取为模板"
              }
            },
          ]
        }).dxForm('instance');
        this.btnPart = new (Vue.component('CommandBtns'))();
        this.btnPart.items = [
          {id: 1, text: '新增', type: 'primary', enabled: true, click: this.edit},
        ];
        this.btnPart.$mount('#btn');
        this.btnPart.$parent = this;
      },
      methods:{
        search:function(){
          var ds = this.windowSpec.getDataSource();
          ds.loadOptions().searchData = this.searchFormData;
          ds.reload();
        },
        edit: function (data) {
          this.modal.isNew = false;
          this.editFormData = data;
          this.editForm.option('formData', this.editFormData);
          this.modal.visible = true;

        },
        formSubmit: function () {
          //let params = {};
          if (!this.editForm.validate().isValid) {
            this.warn('信息不完整');
            this.modal.modal_loading = false;
            return;
          }
          this.$post(window_insert_url, this.editFormData).then(res => {
            if (res.code == '200') {
              this.success('保存成功!', () => {
                this.modal.modal_loading = false;
                this.modal.visible = false;
                this.windowGrid.refresh();
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
        editFormCancel: function () {
          this.modal.visible = false;
        },
      }
    }
</script>


