<style lang="less">
  @import "../../single-disease/single-analyze.less";
</style>
<template>
  <div>
    <Card>
      <Row class="selectDate">
        <ul class="ulList">
          <li>
            <DatePicker class="dataPicker" type="daterange" :value="dateRangePick" placement="bottom-end" @on-change="handleChange"
                        format="yyyy-MM-dd" placeholder="请选择时间段" style="width: 200px;"></DatePicker>
          </li>
          <li v-on:click="thisYear" class="year" tabindex="0" style=" outline:0">全年</li>
          <li v-on:click="season" class="season"  tabindex="0" style=" outline:0">本季度</li>
          <li v-on:click="month" class="month"  tabindex="0" style=" outline:0">本月</li>
        </ul>
      </Row>
    </Card>
    <Card dis-hover class="margin-top-5">
      <Row class="areaSearch">
        <Col span="24">
            <Searchpanel ref="searchPanel">
              <div slot="form" id="searchForm"></div>
            </Searchpanel>
        </Col>
      </Row>
      <Row style="padding-top:5px;">
        <Col span="12">
          <Card dis-hover style="margin-right: 5px">
            <p slot="title" v-if="this.indText==null">科室指标概况</p>
            <p slot="title" v-else>{{indText}}指标概况</p>
            <v-chart :forceFit="true" :height="height" :data="deptTenType.deptTenData" :scale="deptTargetType.scalePel"
                     style="width:65%;float: left;height: 400px;" :onClick="deptChange">
              <v-tooltip />
              <v-axis />
              <span>提醒次数</span>
              <v-bar position="item*count" />
            </v-chart>
            <ul class="cell-grop"  style="width:35%;float: right;">
              <li style="font-weight: bold" v-if="this.indType==null">科室指标排行前10</li>
              <li style="font-weight: bold" v-else>医生指标排行前10</li>
              <li v-for="(item,i) in deptTenType.deptTenData" class="topTen" :id="item.outCode"
                  v-on:click="deptDetail(item.outCode,item.docCode,item.name)">
                <Row v-if="item.count >999">
                  <Col span="3">{{i+1}}</Col>
                  <Col span="10"  class="fontText">
                    <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                  </Col>
                  <Col  span="6" class="fontText" style="color:red">
                    <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                  </Col>
                  <Col span="4">
                    <a  v-on:click="look({iId:indIndex,cbiName:deptTargetName,diseaseName:item.name,docCode:item.docCode,outCode:item.outCode,violated:1})">查看</a>
                  </Col>
                </Row>
                <Row v-else >
                  <Col span="3">{{i+1}}</Col>
                  <Col span="10"  class="fontText">
                    <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                  </Col>
                  <Col  span="6" class="fontText">
                    <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                  </Col>
                  <Col span="4"><a  v-on:click="look({iId:indIndex,cbiName:deptTargetName,diseaseName:item.name,docCode:item.docCode,outCode:item.outCode,violated:1})">查看</a></Col>
                </Row>
              </li>
            </ul>
            <div style="clear:both;"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card dis-hover>
            <p slot="title" v-if="deptName==null && this.indType==null">
              科室指标提醒趋势图
            </p>
            <p slot="title" v-else-if="deptName==null && this.indType!=null">
              医生指标提醒趋势图
            </p>
            <p slot="title" v-else>
              【{{deptName}}】指标提醒趋势图
            </p>
            <v-chart :forceFit="true" :height="height" :data="deptLineType.data" :scale="deptLineType.scale"
                     style="width: 98%;height: 400px;">
              <v-tooltip />
              <v-axis />
              <v-legend />
              <v-line position="time*value" color="city" />
            </v-chart>
          </Card>
        </Col>
      </Row>
    </Card>
    <Card dis-hover class="margin-top-5">
      <Row class="areaSearch">
        <Col>
          <Searchpanel ref="searchPanel">
            <div slot="form" class="margin-bottom-4" id="deptSearchForm">
            </div>
            <div slot="form" class="margin-bottom-4" id="docSearchForm">
            </div>
          </Searchpanel>
        </Col>
      </Row>
      <Row style="padding-top:5px;">
        <Col span="12">
          <Card dis-hover style="margin-right: 5px">
            <p slot="title">指标概况</p>
            <v-chart :forceFit="true" :height="height" :data="targetTenType.targetTenData"
                     :scale="targetType.scalePel" style="width:65%;float: left;height: 400px;" :onClick="targetChange">
              <v-tooltip />
              <v-axis />
              <span>提醒次数</span>
              <v-bar position="name*count" />
            </v-chart>
            <ul class="cell-grop" style="float: left;width: 35%;">
              <li style="font-weight: bold">指标排行前10</li>
              <li v-for="(item,i) in targetTenType.targetTenData"
                  class="targetTopTen" :id="item.id"
                  v-on:click="targetDetail(item.id,item.name)">
                <row v-if="item.count >999" class="rowWidth">
                  <Col span="3">{{i+1}}</Col>
                  <Col span="10"  class="fontText">
                    <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                  </Col>
                  <Col  span="6" class="fontText" style="color:red">
                    <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                  </Col>
                  <Col span="5"><a  v-on:click="look({iId:item.id,diseaseName:item.name,docCode:account,outCode:dcode,violated:1})">查看</a></Col>
                </row>
                <row v-else >
                  <Col span="3">{{i+1}}</Col>
                  <Col span="10"  class="fontText">
                    <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                  </Col>
                  <Col  span="6" class="fontText">
                    <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                  </Col>
                  <Col span="5"><a  v-on:click="look({iId:item.id,diseaseName:item.name,docCode:account,outCode:dcode,violated:1})">查看</a></Col>
                </row>
              </li>
            </ul>
            <div style="clear:both;"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card dis-hover>
            <p slot="title" v-if="targetName!=null">指标【{{targetName}}】提醒趋势图</p>
            <p slot="title" v-else>指标提醒趋势图</p>
            <v-chart :forceFit="true" :height="height" :data="targetLineType.targetLineData"
                     :scale="deptLineType.scale" style="width: 98%;height: 400px;">
              <v-tooltip />
              <v-axis />
              <v-legend />
              <v-line position="time*value" color="city" />
            </v-chart>
          </Card>
        </Col>
      </Row>
    </Card>
  </div>
</template>


<script>
  import DataSet from '@antv/data-set';
  import InforCard from '_c/info-card';
  import CountTo from '_c/count-to';
  import CommonIcon from '_c/common-icon';
  let dept_target_url= 'sys/coreBdIndicator/selectRepeatDe';
  let dept_detail_url= 'sys/bdDept/selectByMap';
  let doc_detail_url= 'sys/sysUser/selectOne';
  let target_detail_url='sys/coreBdIndicator/selectRepeatIndicator';
  let dept_line_url='sys/coreBdIndicator/selectIndicatorLineChart';
  let target_head_url = 'sys/coreRuleExecute/selectRulePageHead';

  let cbiId_list_url='sys/coreBdIndicator/selectList';
  let target_cbiId_url='sys/coreBdIndicator/selectOne';
  let data = [];
  let scale = [];

  export default {
    components: {
      InforCard,
      CountTo,
      CommonIcon
    },
    data() {
      return {
        jumpDateTime:[],
        deptTargetName:null,
        isIndDisplay:true,
        isDeptDisplay:true,
        indText:null,
        searchForm:{},
        searchFormData:{},
        deptSearchForm:{},
        deptSearchFormData:{},
        docSearchForm:{},
        docSearchFormData:{},
        deptParams:{},
        deptTenParams:{},
        targetIndex:2,
        dateRangePick:[],
        totalIndex :1,
        foldIndex: 2,
        indIndex:null,
        detailIndIndex:null,
        indType:null,
        indParams:{},
        indTenParams:{},
        deptLineParams:{},
        targetLineParams:{},
        clearText:[],
        account:null,
        dcode:null,
        deptName:null,
        targetName:null,
        deptTargetType:{
          data:[],
          deptTargetData: [],
          height: 400,
          scalePel : [{
            dataKey: 'count',
          }]
        },
        docTargetType:{
          data:[],
          docTargetData: [],
          height: 400,
          scalePel : [{
            dataKey: 'count',
          }]
        },
        targetType:{
          data:[],
          targetData: [],
          height: 400,
          scalePel : [{
            dataKey: 'count',
          }]
        },
        deptTenType:{
          data:[],
          deptTenData: [],
        },
        docTenType:{
          data:[],
          docTenData: [],
        },
        targetTenType:{
          data:[],
          targetTenData: [],
        },
        deptLineType:{
          data:[],
          deptLineData: [],
          scale :[{
            tickCount: 12,
            dataKey: 'month',
          }],
        },
        targetLineType:{
          data:[],
          targetLineData: [],
          scale :[{
            tickCount: 12,
            dataKey: 'month',
          }]
        },
        data,
        scale,
        height: 400,
        pieStyle: {
          stroke: "#fff",
          lineWidth: 1
        },
        style: { stroke: '#fff', lineWidth: 1 },
        labelConfig: ['percent', {
          formatter: (val, item) => {
            return item.point.item + ': ' + val;
          }
        }],
        targetData:new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(target_cbiId_url, {id: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(cbiId_list_url,{status:1});
          }
        }),
        deptTypeData:new this.customstore({
          key: "outCode",
          byKey: (key) => {
            return this.CommDs.loadByKey(dept_detail_url, {dcode: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(dept_target_url,this.deptParams);
          }
        }),
        docTypeData:new this.customstore({
          key: "docCode",
          byKey: (key) => {
            return this.CommDs.loadByKey(doc_detail_url, {account: key});
          },
          load: (e) =>{
            return this.CommDs.loadList(dept_target_url,this.deptParams);
          }
        }),
      };
    },
    mounted(){
      this.month();
      this.date();
      this.isDept();
      this.listClick();
      this.targetClick();
    },
    methods:{
      dropDownHide: function () {
        this.editForm.getEditor("name").close();
      },
      date:function(){
        $($(".ulList li").eq(3)).css({"color":"#2c8df1","border-bottom":"2px solid #2c8df1"});
        $(".ulList li").click(function () {
          $(".ulList li").css({"color": "#666666", "border-bottom": "none"});
          $(this).css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
          $($(".ulList li").eq(0)).css({"color":"#666666","border-bottom":"none"});
        });
      },
      listClick: function () {
        $("body").on("click", ".topTen ", function () {
          $(".topTen").removeClass('defaultColor');
          $(this).addClass('defaultColor');
        });
      },
      targetClick: function () {
        $("body").on("click", ".targetTopTen ", function () {
          $(".targetTopTen").removeClass('defaultColor');
          $(this).addClass('defaultColor');
        });
      },
      //科室排行图表chang事件
      deptChange: function(ev){
        if (ev.data&&ev.data._origin) {
          let _this = this;
          _this.deptName=ev.data._origin.name;
          if(!this.indType){
            _this.outCode=ev.data._origin.outCode;
            _this.docCode=null;
          }else{
            _this.docCode=ev.data._origin.docCode;
            _this.outCode=null;
          }
          this.deptLine();
          $(".topTen").removeClass('defaultColor');
          $("#"+ev.data._origin.outCode).addClass("defaultColor");
        }
      },
      //指标概况图表change事件
      targetChange: function(ev){
        if (ev.data&&ev.data._origin) {
          this.targetName=ev.data._origin.name;
          this.detailIndIndex =ev.data._origin.id;
          this.targetLine();
          this.detailIndIndex =null;
          $(".targetTopTen").removeClass('defaultColor');
          // $(".topTen").removeClass('defaultColor');
          $("#"+ev.data._origin.id).addClass("defaultColor");
        }
      },
      //清空科室选择与医生选择
      clearValue:function(){
        if(this.indText=="科室" || this.indText==null){
          this.deptSearchFormData.dname=null;
          this.deptSearchForm.option('formData', this.deptSearchFormData);
        }else if(this.indText=="医生"){
          this.docSearchFormData.name=null;
          this.docSearchForm.option('formData', this.docSearchFormData);
        }
      },
      totalNumber: function(){
        let _this=this;
        this.$put(target_head_url).then(res => {
          if (res.code == '200'){
            let i = _this.totalIndex;
            if (i == 4) {
              _this.jumpDateTime = _this.dateRangePick;
            } else {
              _this.jumpDateTime = res.rows[i].timeList;
            }
          } else{
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //全部
      targetFun:function(){
        // let _this=this;
        // _this.targetType.targetData=[];
        // _this.indParams.doc = _this.indType;
        // _this.indParams.index = _this.targetIndex;
        // _this.indParams.createBy = this.dateRangePick;
        // _this.indParams.iId = _this.indIndex;
        // _this.indParams.outCode = _this.dcode;
        // _this.indParams. docCode= _this.account;
        // _this.indParams.pageSize = 10;
        // this.$put(target_detail_url,_this.indParams).then(res => {
        //   if (res.code == '200'){
        //     for (let i=0; i<res.rows.length; i++ )  {
        //       if(res.rows[i].name==undefined){
        //         _this.targetType.targetData.push({name:"",index:res.rows[i].index,count: res.rows[i].countNum,id:res.rows[i].id});
        //       }else
        //         _this.targetType.targetData.push({name:res.rows[i].name,index:res.rows[i].index,count: res.rows[i].countNum,id:res.rows[i].id});
        //       }
        //   } else{
        //     //提示信息
        //     this.warn(res.msg);
        //   }
        // })
      },
      targetTenFun:function(){
        let _this=this;
        _this.targetTenType.targetTenData=[];
        _this.indTenParams.doc = _this.indType;
        _this.indTenParams.index = _this.targetIndex;
        _this.indTenParams.createBy = this.dateRangePick;
        _this.indTenParams.pageSize = 10;
        _this.indTenParams.iId = _this.indIndex;
        _this.indTenParams.outCode = _this.dcode;
        _this.indTenParams.docCode = _this.account;
        this.$put(target_detail_url,_this.indTenParams).then(res => {
          if (res.code == '200'){
            for (let i=0; i<res.rows.length; i++ )  {
              if(res.rows[i].name==undefined){
                _this.targetTenType.targetTenData.push({name:"",index:res.rows[i].index,count: res.rows[i].countNum,id: res.rows[i].id});
              }else
                _this.targetTenType.targetTenData.push({name:res.rows[i].name,index:res.rows[i].index,count: res.rows[i].countNum,id: res.rows[i].id});
            }
            if(res.rows.length<1){
              this.isIndDisplay=false;
            }else{
              this.isIndDisplay=true;
            }
          } else{
            //提示信息
            this.warn(res.msg);
          }
        })
      },
      deptTenFun:function(){
        let _this=this;
        _this.deptTenType.deptTenData=[];
        _this.deptTenParams.index = _this.targetIndex;
        _this.deptTenParams.iId = _this.indIndex;
        _this.deptTenParams.createBy = _this.dateRangePick;
        _this.deptTenParams.pageSize= 10;
        _this.deptTenParams.doc = _this.indType;
        this.$put(dept_target_url,_this.deptTenParams).then(res => {
          if (res.code == '200'){
            _this.deptTenType.deptTenData=[];
            for (let i=0; i<res.rows.length; i++ )  {
              if(res.rows[i].docCode==undefined){
                res.rows[i].docCode="";
              }
              if(res.rows[i].name==undefined){
                _this.deptTenType.deptTenData.push({name:"",item:""+res.rows[i].docCode,index:res.rows[i].index,count: res.rows[i].countNum,outCode: res.rows[i].outCode,docCode: res.rows[i].docCode});
              }else{
                _this.deptTenType.deptTenData.push({name:res.rows[i].name,item:res.rows[i].name+res.rows[i].docCode,index:res.rows[i].index,count: res.rows[i].countNum,outCode: res.rows[i].outCode,docCode: res.rows[i].docCode});
              }
            }
            if(res.rows.length<1){
              this.isDeptDisplay=false;
            }else{
              this.isDeptDisplay=true;
            }
          } else{
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      deptPie:function() {
        let _this=this;
        _this.deptTargetType.deptTargetData=[];
         _this.deptParams.index = _this.targetIndex;
         _this.deptParams.iId = _this.indIndex;
         _this.deptParams.createBy = _this.dateRangePick;
         _this.deptParams.doc = _this.indType;
        _this.deptParams.pageSize= 10;
        this.$put(dept_target_url,_this.deptParams).then(res => {
          if (res.code == '200'){
            for (let i=0; i<res.rows.length; i++ ){
              if(res.rows[i].name==undefined){
                _this.deptTargetType.deptTargetData.push({name:"",index:res.rows[i].index,count: res.rows[i].countNum,outCode:res.rows[i].outCode,docCode: res.rows[i].docCode});
              }else{
                _this.deptTargetType.deptTargetData.push({name:res.rows[i].name,index:res.rows[i].index,count: res.rows[i].countNum,outCode:res.rows[i].outCode,docCode: res.rows[i].docCode});
              }
            }
          } else{
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        })
      },
      deptLine:function(){
        let _this=this;
        _this.deptLineParams.index=_this.foldIndex;
        _this.deptLineParams.createBy = this.dateRangePick;
        _this.deptLineParams.outCode=_this.outCode;
        _this.deptLineParams.docCode=_this.docCode;
        _this.deptLineParams.doc = _this.indType;
        _this.deptLineParams.cbiId = _this.indIndex;
        this.$put(dept_line_url,_this.deptLineParams).then(res => {
          if (res.code == '200'){
            let nowData = [];
            let oldData =[];
            this.deptLineType.deptLineData=[];
            if(!res.data){nowData=[];oldData=[];return};
            nowData = res.data.nowData;
            oldData = res.data.oldData;
            if (_this.deptLineParams.index == 1){
              for (let key in nowData) {
                this.deptLineType.deptLineData.push({time:key+'时',当前:nowData[key],往期: oldData[key]});
              }
            } else if(_this.deptLineParams.index== 2 || _this.deptLineParams.index == 3 || _this.deptLineParams.createBy){
              for (let key in nowData) {
                this.deptLineType.deptLineData.push({time:key,当前:nowData[key],往期: oldData[key]});
              }
            }else if(_this.deptLineParams.index== 4){
              for (let key in nowData) {
                this.deptLineType.deptLineData.push({time:key+'月',当前:nowData[key],往期: oldData[key]});
              }
            }else {
              this.deptLineType.deptLineData.push();
            }
            let dv = new DataSet.View().source(this.deptLineType.deptLineData);
            dv.transform({
              type: 'fold',
              fields: ['当前', '往期'],
              key: 'city',
              value: 'value',
            });
            _this.deptLineType.data = dv.rows;
          } else{
            //提示信息
            this.warn(res.msg);
          }
        })
      },
      targetLine:function(){
        let _this=this;
        _this.targetLineParams.index=_this.foldIndex;
        _this.targetLineParams.createBy = this.dateRangePick;
        _this.targetLineParams.doc = _this.indType;
        _this.targetLineParams.outCode = _this.dcode;
        _this.targetLineParams.docCode = _this.account;
        if(_this.detailIndIndex==null){
          _this.targetLineParams.cbiId = _this.indIndex;
        }else{
          _this.targetLineParams.cbiId = _this.detailIndIndex;
        }
        this.$put(dept_line_url,_this.targetLineParams).then(res => {
          if (res.code == '200'){
            let nowData = [];
            let oldData =[];
            _this.targetLineType.targetLineData=[];
            if(!res.data){nowData=[];oldData=[];return};
            nowData = res.data.nowData;
            oldData = res.data.oldData;
            if (_this.targetLineParams.index == 1){
              for (let key in nowData) {
                _this.targetLineType.targetLineData.push({time:key+'时',当前:nowData[key],往期: oldData[key]});
              }
            } else if(_this.targetLineParams.index== 2 || _this.targetLineParams.index == 3 || _this.targetLineParams.createBy){
              for (let key in nowData) {
                _this.targetLineType.targetLineData.push({time:key,当前:nowData[key],往期: oldData[key]});
              }
            }else if(_this.targetLineParams.index== 4){
              for (let key in nowData) {
                _this.targetLineType.targetLineData.push({time:key+'月',当前:nowData[key],往期: oldData[key]});
              }
            }else {
              _this.targetLineType.targetLineData.push();
            }
            let dv = new DataSet.View().source(_this.targetLineType.targetLineData);
            dv.transform({
              type: 'fold',
              fields: ['当前', '往期'],
              key: 'city',
              value: 'value',
            });
            _this.targetLineType.targetLineData = dv.rows;
          } else{
            //提示信息
            this.warn(res.msg);
          }
        })
      },
      deptDetail: function(value1,value2,name){
        let _this = this;
        _this.deptName=name;
        if(!this.indType){
          _this.outCode=value1;
          _this.docCode=null;
        }else{
          _this.docCode=value2;
          _this.outCode=null;
        }
        this.deptLine();
      },
      isDept:function(){
        let _this=this;
        _this.deptSearchForm=$('#deptSearchForm').dxForm({
          colCount: 4,
          formData: this.deptSearchFormData,
          items: [
            {
              dataField: 'dname',
              label: {
                alignment: 'right',
                text: '科室选择'
              },
              editorType: "dxDropDownBox",
              editorOptions: {
                dropDownOptions: {width: 260},
                placeholder: '请选择',
                showClearButton: true,
                valueExpr: "dcode",
                displayExpr: "dname",
                dataSource: this.deptTypeData ,
                contentTemplate: (e) => {
                  if(e.component.option()==null){return;}
                  let value = e.component.option('value');
                  let grid = $('<div>').dxDataGrid({
                    showRowLines: true,
                    showBorders: true,
                    //wordWrapEnabled:true,
                    columnFixing: {
                      enabled: true
                    },
                    dataSource: e.component.option('dataSource'),
                    columns: [
                      {
                        caption: '科室名称',
                        dataField: 'name',
                        alignment:'left',
                        width:140
                      },
                      {
                        caption: '违规次数',
                        dataField: 'countNum',
                        alignment:'left',
                        width:90
                      },
                    ] ,
                    paging: {enabled: true, pageSize: 10},
                    searchPanel: {
                      visible: true,
                      placeholder: '查找',
                      width: '140',
                    },
                    height: 380,
                    selection: {
                      mode: 'single',
                    },
                    selectedRowKeys: value,
                    onSelectionChanged: (selectedItems) => {
                      if(!selectedItems.selectedRowsData[0]){
                        this.dcode=null;
                        this.account=null;
                        //this.targetFun();
                        this.targetTenFun();
                        this.targetLine();
                        return;
                      }
                      if(this.indType==null){
                        this.dcode=selectedItems.selectedRowsData[0].outCode;
                      }else{
                        this.account=selectedItems.selectedRowsData[0].docCode;
                      }
                      this.clearText=selectedItems.selectedRowKeys;
                      this.targetTenFun();
                      this.targetLine();
                      let keys = selectedItems.selectedRowKeys;
                      e.component.option("value", keys);
                    }
                  });
                  let instance = grid.dxDataGrid('instance');
                  e.component.on("valueChanged", function (args) {
                    instance.selectRows(args.value, false);
                  });
                  return grid;
                }
              },
            },
          ]
        }).dxForm('instance');
      },
      isDoc:function(){
        let _this=this;
        _this.docSearchForm=$('#docSearchForm').dxForm({
          colCount: 4,
          formData: this.docSearchFormData,
          items: [
            {
              dataField: 'name',
              label: {
                alignment: 'right',
                text: '医生选择'
              },
              editorType: "dxDropDownBox",
              editorOptions: {
                dropDownOptions: {width: 260},
                placeholder: '请选择',
                showClearButton: true,
                valueExpr: "account",
                displayExpr: "name",
                dataSource: this.docTypeData ,
                contentTemplate: (e) => {
                  let value = e.component.option('value');
                  let grid = $('<div>').dxDataGrid({
                    showRowLines: true,
                    showBorders: true,
                    wordWrapEnabled:true,
                    columnFixing: {
                      enabled: true
                    },
                    dataSource: e.component.option('dataSource'),
                    columns: [
                      {
                        caption: '医生名称',
                        dataField: 'name',
                        alignment:'left',
                        width:140
                      },
                      {
                        caption: '违规次数',
                        dataField: 'countNum',
                        alignment:'left',
                        width:90
                      },
                    ] ,
                    paging: {enabled: true, pageSize: 10},
                    searchPanel: {
                      visible: true,
                      placeholder: '查找',
                      width: '140',
                    },
                    height: 380,
                    selection: {
                      mode: 'single',
                    },
                    selectedRowKeys: value,
                    onSelectionChanged: (selectedItems) => {
                      if(!selectedItems.selectedRowsData[0]){
                        this.dcode=null;
                        this.account=null;
                        //this.targetFun();
                        this.targetTenFun();
                        this.targetLine();
                        return;
                      }
                      if(this.indType==null){
                        this.dcode=selectedItems.selectedRowsData[0].outCode;
                      }else{
                        this.account=selectedItems.selectedRowsData[0].docCode;
                      }
                      this.clearText=selectedItems.selectedRowKeys;
                      this.targetTenFun();
                      this.targetLine();
                      let keys = selectedItems.selectedRowKeys;
                      e.component.option("value", keys);
                    }
                  });
                  let instance = grid.dxDataGrid('instance');
                  e.component.on("valueChanged", function (args) {
                    instance.selectRows(args.value, false);
                  });
                  return grid;
                }
              },
            },
          ]
        }).dxForm('instance');
      },
      targetSelect:function(){
        $('#searchForm').dxForm({
          colCount: 4,
          formData: this.searchFormData,
          items: [
            {
              dataField: 'name',
              label: {
                alignment: 'right',
                text: '指标选择'
              },
              editorType: "dxDropDownBox",
              editorOptions: {
                dropDownOptions: {width: 260},
                placeholder: '请选择指标',
                showClearButton: true,
                valueExpr: "id",
                displayExpr: "name",
                dataSource: this.targetData ,
                contentTemplate: (e) => {
                  let value = e.component.option('value');
                  let grid = $('<div>').dxDataGrid({
                    showRowLines: true,
                    showBorders: true,
                    wordWrapEnabled:true,
                    columnFixing: {
                      enabled: true
                    },
                    dataSource: e.component.option('dataSource'),
                    columns: [
                      {
                        caption: '编号',
                        dataField: 'id',
                        alignment:'left',
                        width:70
                      },
                      {
                        caption: '指标名称',
                        dataField: 'name',
                        alignment:'left',
                        minWidth:180
                      },
                    ] ,
                    paging: {enabled: true, pageSize: 10},
                    searchPanel: {
                      visible: true,
                      placeholder: '查找',
                      width: '210',
                    },
                    height: 380,
                    selection: {
                      mode: 'single',
                    },
                    selectedRowKeys: value,
                    onSelectionChanged: (selectedItems) => {
                      if(!selectedItems.selectedRowsData[0]){
                        this.indIndex=undefined;
                        this.outCode=null;
                        this.deptName=null;
                        this.deptTenFun();
                        this.deptLine();
                        this.deptPie();
                        return;
                      }
                      this.indIndex=selectedItems.selectedRowsData[0].id;
                      this.deptTargetName=selectedItems.selectedRowsData[0].name;
                      this.outCode=null;
                      this.deptName=null;
                      this.deptTenFun();
                      this.deptLine();
                      this.deptPie();
                      let keys = selectedItems.selectedRowKeys;
                      e.component.option("value", keys);
                    }
                  });
                  let instance = grid.dxDataGrid('instance');
                  e.component.on("valueChanged", function (args) {
                    instance.selectRows(args.value, false);
                  });
                  return grid;
                }
              },
            },
            {
              dataField: 'xxx',
              editorType: 'dxSelectBox',
              label: {
                alignment: 'right',
                text: '维度选择',
              },
              editorOptions: {
                placeholder: '科室',
                dataSource: this.enum.peopleType,
                displayExpr: 'text',
                valueExpr: 'id',
                onSelectionChanged:(e)=>{
                  if(e.selectedItem==null){return;}
                  this.indText=e.selectedItem.text;
                  this.deptName=null;
                  if(e.selectedItem.text=="科室"){
                    this.indType=null;
                    this.account=null;
                    $('#docSearchForm').empty();
                    this.isDept();
                  }else{
                    this.indType="doc";
                    this.dcode=null;
                    $('#deptSearchForm').empty();
                    this.isDoc();
                  }
                  this.deptTenFun();
                  this.deptLine();
                  this.deptPie();
                }
              },
            },
          ]
        }).dxForm('instance');
      },
      deptOrDocFun:function(){
        if(this.indType==null){
          $('#docSearchForm').empty();
          this.isDept();
        }else{
          $('#deptSearchForm').empty();
          this.isDoc();
        }
      },
      targetDetail: function(value,name){
        let _this = this;
        _this.targetName=name;
        _this.detailIndIndex =value;
        this.targetLine();
        _this.detailIndIndex =null;
      },
      deptNameFun:function(value){
        this.deptName=value;
      },
      targetNameFun:function(value){
        this.targetName=value;
      },
      handleChange:function(daterange){
        this.dateRangePick = daterange;
        for(let i=0;i<daterange.length;i++){
          if(daterange[i]==""){
            this.foldIndex = 2;
            this.targetIndex = 2;
            this.date();
          }else{
            this.foldIndex=null;
            this.targetIndex = null;
          }
        }
        this.clearValue();
        this.totalIndex = 4;
        this.deptName = null;
        this.targetName = null;
        this.pieIndex=null;
        this.outCode=null;
        this.docCode=null;
        this.dcode=null;
        this.account=null;
        //this.targetFun();
        this.targetTenFun();
        this.deptTenFun();
        this.deptLine();
        this.targetLine();
        this.deptPie();
        this.targetSelect();
        this.deptOrDocFun();
        this.totalNumber();
      },
      month: function () {
        if(this.clearText.length==1){
          this.clearValue();
        }
        this.totalIndex = 1;
        this.foldIndex = 2;
        this.targetIndex=2;
        this.pieCrLevel=null;
        this.deptName = null;
        this.targetName = null;
        this.dateRangePick = undefined;
        this.outCode=null;
        this.docCode=null;
        this.dcode=null;
        this.account=null;
        this.targetTenFun();
        this.deptLine();
        this.targetLine();
        this.deptPie();
        //this.targetFun();
        this.deptTenFun();
        this.targetSelect();
        this.deptOrDocFun();
        this.totalNumber();
      },
      season: function () {
        this.clearValue();
        this.totalIndex = 2;
        this.foldIndex = 3;
        this.targetIndex = 3;
        this.pieCrLevel = null;
        this.deptName = null;
        this.targetName = null;
        this.dateRangePick = undefined;
        this.outCode = null;
        this.docCode = null;
        this.dcode=null;
        this.account=null;
        this.targetTenFun();
        this.deptLine();
        this.targetLine();
        this.deptPie();
        //this.targetFun();
        this.deptTenFun();
        this.deptName = null;
        this.targetName = null;
        //this.targetSelect();
        this.deptOrDocFun();
        this.totalNumber();
      },
      thisYear: function () {
        this.clearValue();
        this.totalIndex = 3;
        this.foldIndex = 4;
        this.targetIndex=4;
        this.pieCrLevel=null;
        this.dateRangePick = undefined;
        this.outCode=null;
        this.docCode=null;
        this.dcode=null;
        this.account=null;
        this.deptName = null;
        this.targetName = null;
        this.targetTenFun();
        this.deptLine();
        this.targetLine();
        this.deptPie();
        //this.targetFun();
        this.deptTenFun();
        //this.targetSelect();
        this.deptOrDocFun();
        this.totalNumber();
      },
      look: function(data) {
        let params = {};
        params.dateStart = this.jumpDateTime[0];
        params.dateEnd = this.jumpDateTime[1];
        if (data.docCode) {
          params.docCode = data.docCode;
        }
        if (data.outCode){
          params.outCode =data.outCode;
        }
        if (data.iId) {
          params.iId = data.iId;
        }
        // params.violated = data.violated;
        const route = {
          name: 'target-list',
          path: 'target-list',
          query: params,
          component: () => import('@/view/disease-mgt/target-manage-mgt/target-analyze/target-list.vue')
        };
        this.$router.push(route)
      },
    },
  };
</script>

