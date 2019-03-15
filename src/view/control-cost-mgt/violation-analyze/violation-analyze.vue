<style lang="less">
  @import "../../disease-mgt/single-disease/single-analyze.less";
</style>
<template>
  <div>
    <Row :gutter="20" style="padding-top: 5px;padding-bottom: 5px;">
      <i-col class="con" span="8" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        <Card class="card-wrapper" dis-hover>
          <div class="content-page" v-on:click="headLook(infor.detailNumber)">
            <div class="left-page" :style="{background:infor.color }">
              <p class="pp">{{infor.text}}</p>
            </div>
            <div class="right-page" :style="{}">
              <p style="padding-top: 20px">{{ infor.title }}</p>
              <count-to :end="infor.count" count-class="count-style"/>
            </div>
          </div>
        </Card>
      </i-col>
    </Row>

    <Card dis-hover>
      <Row>
        <ul class="ulList">
          <li>
            <DatePicker class="dataPicker" type="daterange" :value="dateRangePick" placement="bottom-end" @on-change="handleChange"
           format="yyyy-MM-dd" placeholder="请选择时间段" style="width: 200px;"></DatePicker>
          </li>
          <li v-on:click="thisYear" class="year" tabindex="0" style=" outline:0">全年</li>
          <li v-on:click="season" class="season"  tabindex="0" style=" outline:0">本季度</li>
          <li v-on:click="month" tabindex="0" style=" outline:0">本月</li>
          <li v-on:click="today" class="today" tabindex="0" style=" outline:0">今日</li>
        </ul>
      </Row>
    </Card>

    <Card dis-hover  class="margin-top-5">
      <Row>
          <ul class="pageChange">
            <li @click="all()" tabindex="0" style=" outline:0">全部提醒（{{this.sumNumber.all}}）</li>
            <li @click="check()" tabindex="0" style=" outline:0">审核（{{this.sumNumber.check}}）</li>
            <li @click="warn()" tabindex="0" style=" outline:0">警告（{{this.sumNumber.warn}}）</li>
            <li @click="must()" tabindex="0" style=" outline:0">禁止（{{this.sumNumber.must}}）</li>
          </ul>
      </Row>
    </Card>
    <Row style="padding-top: 5px;">
      <Col span="12">
        <Card dis-hover  style="margin-right: 5px;">
          <p slot="title">全院科室概况</p>
          <v-chart :forceFit="true" :height="deptType.height" :data="deptType.data" :scale="deptType.scalePel" style="width:65%;float: left;height: 400px;" :onClick="clickChange" >
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :vStyle="pieStyle" :label="deptType.labelConfig"/>
            <v-coord type="theta" />
          </v-chart>
          <ul class="cell-grop"  style="width:35%;float: right;">
            <li style="font-weight: bold" v-if="this.deptTitleDisplay==true">科室排行前10</li>
            <li v-for="(item,i) in deptTenType.deptTenData"  v-on:click="deptDetail(item.outCode,item.item)" :id="item.outCode" class="deptTopTen">
              <row v-if="item.count >999">
                <Col span="4">{{i+1}}</Col>
                <Col span="8"  class="fontText">
                  <a style="color: #666666;" :title=item.item>{{item.item}}</a>
                </Col>
                <Col  span="8" class="fontText" style="color:red">
                  <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                </Col>
                <Col span="4"><a  v-on:click="look({outCode:item.outCode,violated:1,crLevel:tenCrLevel})">查看</a></Col>
              </row>
              <row v-else>
                <Col span="4">{{i+1}}</Col>
                <Col span="8"  class="fontText">
                  <a style="color: #666666;" :title=item.item>{{item.item}}</a>
                </Col>
                <Col  span="8" class="fontText">
                  <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                </Col>
                <Col span="4"><a  v-on:click="look({outCode:item.outCode,violated:1,crLevel:tenCrLevel})">查看</a></Col>
              </row>
            </li>
          </ul>
          <div style="clear:both;"></div>
        </Card>
      </Col>
      <Col span="12">
        <Card dis-hover>
          <p slot="title" v-if="this.deptTitle==null">科室规则提醒趋势图</p>
          <p slot="title" v-else>【{{deptTitle}}】规则提醒趋势图</p>
          <v-chart :forceFit="true" :height="height" :data="deptLineType.data" :scale="deptLineType.scale" style="width: 98%;height: 400px;">
            <v-tooltip />
            <v-axis />
            <v-legend />
            <v-line position="time*value" color="city" />
          </v-chart>
        </Card>
      </Col>
    </Row>
    <Row style="padding-top: 5px;">
      <Col span="12">
        <Card dis-hover  style="margin-right: 5px">
          <p slot="title" v-if="this.deptTitle==null">全院医生概况</p>
          <p slot="title" v-else>【{{deptTitle}}】医生概况</p>
          <v-chart :forceFit="true" :height="docType.height" :data="docTenType.docTenData" :scale="docType.scalePel"  style="width:65%;float: left;height: 400px;"
                   :onClick="docChange">
            <v-tooltip  />
            <v-axis/>
            <span>提醒次数</span>
            <v-bar position="name*count" />
          </v-chart>
          <ul class="cell-grop" id="doccell-grop" style="float: right;width: 35%;">
            <li style="font-weight: bold" v-if="this.docTitleDisplay==true">医生排行前10</li>
            <li v-for="(item,i) in docTenType.docTenData" v-on:click="docDetail(item.docCode,item.item)"  :id="item.docCode" class="topTen ">
              <row v-if="i==0" class="color defaultColor">
                <Col span="4">{{i+1}}</Col>
                <Col span="8"  class="fontText">
                  <a style="color: #666666;" :title=item.item>{{item.item}}</a>
                </Col>
                <Col  span="8" class="fontText">
                  <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                </Col>
                <Col span="4"><a v-on:click="look({outCode:outCode,docCode:item.docCode,docName:item.item,violated:1,crLevel:tenCrLevel})">查看</a></Col>
              </row>
              <row v-else-if="item.count>999">
                <Col span="4">{{i+1}}</Col>
                <Col span="8"  class="fontText">
                  <a style="color: #666666;" :title=item.item>{{item.item}}</a>
                </Col>
                <Col  span="8" class="fontText" style="color:red">
                  <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                </Col>
                <Col span="4"><a  v-on:click="look({outCode:outCode,docCode:item.docCode,docName:item.item,violated:1,crLevel:tenCrLevel})">查看</a></Col>
              </row>
              <row v-else>
                <Col span="4">{{i+1}}</Col>
                <Col span="8"  class="fontText">
                  <a style="color: #666666;" :title=item.item>{{item.item}}</a>
                </Col>
                <Col  span="8" class="fontText">
                  <a style="color: #666666;" :title="item.count+'次'">{{item.count}}次</a>
                </Col>
                <Col span="4"><a  v-on:click="look({docCode:item.docCode,docName:item.item,violated:1})">查看</a></Col>
              </row>
            </li>
          </ul>
          <div style="clear:both;"></div>
        </Card>
      </Col>
      <Col span="12" >
        <Card dis-hover>
          <p slot="title" v-if="this.docTitle==null">医生规则提醒趋势图</p>
          <p slot="title" v-else>【{{docTitle}}】规则提醒趋势图</p>
          <v-chart :forceFit="true" :height="height" :data="docLineType.data" :scale="docLineType.scale1" style="height: 400px;" >
            <v-tooltip />
            <v-axis />
            <v-legend />
            <v-line position="time*value" color="city" />
          </v-chart>
        </Card>
      </Col>
    </Row>
  </div>
</template>


<script>
  import DataSet from '@antv/data-set';
  import InforCard from '_c/info-card';
  import CountTo from '_c/count-to';
  import CommonIcon from '_c/common-icon';
  let dept_pie_url= 'sys/coreRuleExecute/selectRepeatDe';
  let doc_column_url= 'sys/coreRuleExecute/selectRepeatDc';
  let core_head_url = 'sys/coreRuleExecute/selectRulePageHead';
  let core_rule_list_url = 'sys/coreRuleExecute/selectViolationLineChart';
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
        deptTitleDisplay:false,
        docTitleDisplay:false,
        docListDisplay:false,
        sumIndex:0,
        totalNum:[],
        sumNumber:{all:0,warn:0,check:0,must:0},
        deptTitle:null,
        docTitle:null,
        outCode:null,
        docCode:null,
        dateRange:false,
        lineCrLevel:1,
        deptParams:{},
        docParams:{},
        tenParams:{},
        tenIndex:1,
        tenCrLevel:null,
        pieIndex:1,
        pieCrLevel:null,
        pieParams:{},
        pageParams:{all:{},warn:1,check:2,must:3},
        dateRangePick:[],
        totalIndex :0,
        foldIndex: 1,
        jumpDateTime:[],
        inforCardData: [
          { title: '今日全院提醒总量/次', text: '审', count: 0, color: '#9A66E4',detailNumber: 2},
          { title: '今日全院提醒总量/次', text: '警', count: 0, color: '#ff9900',detailNumber: 1},
          { title: '今日全院提醒总量/次', text: '禁', count: 0, color: '#ed3f14',detailNumber: 3},
        ],
        deptType:{
          data:[],
          deptData: [],
          height: 400,
          scalePel : [{
            dataKey: 'percent',
            min: 0,
            formatter: '.0%',
          }],
          labelConfig: ['percent', {
            offset: -40,
            textStyle: {
              rotate: 0,
              textAlign: 'center',
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            }
          }],
        },
        deptLineType:{
          data:[],
          deptLineData: [],
          scale :[{
            dataKey: 'time',
            tickCount: 12,
          }],
        },
        docType:{
          data:[],
          docData: [],
          height: 400,
          scalePel : [{
            dataKey: 'count',
            // tickInterval: 10,
          }]
        },
        docLineType:{
          data:[],
          docLineData: [],
          scale1 :[{
            dataKey: 'time',
            tickCount: 12,
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
      };
    },
    mounted(){
      this.month();
      this.date();
      this.row();
      this.deptClick();
      this.docClick();
    },
    methods:{
      date:function(){
        $($(".ulList li").eq(3)).css({"color":"#2c8df1","border-bottom":"2px solid #2c8df1"});
        $(".ulList li").click(function () {
          $(".ulList li").css({"color": "#666666", "border-bottom": "none"});
          $(this).css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
          $($(".ulList li").eq(0)).css({"color":"#666666","border-bottom":"none"});
        });
      },
      row:function(){
        $($(".pageChange li").eq(0)).css({"color":"#2c8df1","border-bottom":"2px solid #2c8df1"});
        $($(".pageChange li:gt(0)")).css({"color": "#666666", "border-bottom": "none"});
        $(".pageChange li").click(function () {
          $(".pageChange li").css({"color": "#666666", "border-bottom": "none"});
          $(this).css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
        })
      },
      deptClick: function () {
        $("body").on("click", ".deptTopTen ", function () {
          $(".deptTopTen").removeClass('defaultColor');
          $(".topTen").removeClass('defaultColor');
          $(".color").addClass("defaultColor");
          $(this).addClass('defaultColor');
        });
      },
      docClick: function () {
        $("body").on("click", ".topTen ", function () {
          $(".color").removeClass("defaultColor");
          $(".topTen").removeClass('defaultColor');
          $(this).addClass('defaultColor');
        });
      },

      //点击饼状图触发事件
      clickChange:function(ev,chart){
        if (ev.data) {
          if (ev.data.point) {
            this.deptTitle = ev.data.point.item;
            this.outCode = ev.data.point.outCode;
            this.deptListData();
            this.docTenFun();
            //this.docPie();
            $(".deptTopTen").removeClass('defaultColor');
            $(".topTen").removeClass('defaultColor');
            $("#" + ev.data.point.outCode).addClass('defaultColor');
            $(".color").addClass("defaultColor");
            console.log($("#" + ev.data.point.outCode));
          }
        }
      },

      docChange: function(ev,chart){
        if (ev.data&&ev.data._origin) {
          let _this = this;
            _this.docTitle=ev.data._origin.item;
            _this.docCode=ev.data._origin.docCode;
          $(".color").removeClass("defaultColor");
          $(".topTen").removeClass('defaultColor');
          $("#doccell-grop"+" "+"#"+_this.docCode).addClass('defaultColor');
          _this.docListData();
        }
      },
      //全部
      deptPie:function() {
        let _this=this;
        _this.deptType.deptData=[];
        _this.pieParams.index = _this.pieIndex;
        _this.pieParams.crLevel=_this.pieCrLevel;
        _this.pieParams.createBy = this.dateRangePick;
        _this.pieParams.outCode = null;
        _this.pieParams.pageSize = null;
        this.$put(dept_pie_url,_this.pieParams).then(res => {
          if (res.code == '200'){
            for (let i=0; i<res.rows.length; i++ )  {
              if(res.rows[i].name==undefined){
                res.rows[i].name="";
              }
              _this.deptType.deptData.push({item:res.rows[i].name,index:res.rows[i].index,count: res.rows[i].countNum,outCode:res.rows[i].outCode});
            }
            let dsv = new DataSet.View().source(_this.deptType.deptData);
            dsv.transform({
              type: 'percent',
              field: 'count',
              dimension: 'item',
              as: 'percent'
            });
            _this.deptType.data=dsv.rows;
          } else{
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      docPie:function() {
        // let _this=this;
        // _this.docType.docData=[];
        // _this.pieParams.outCode = this.outCode;
        // _this.pieParams.pageSize = 10;
        // this.$put(doc_column_url,_this.pieParams).then(res => {
        //   if (res.code == '200'){
        //     for (let i=0; i<res.rows.length; i++ )  {
        //       if(res.rows[i].name==undefined){
        //         _this.docType.docData.push({item:"",name:""+res.rows[i].docCode,index:res.rows[i].index,count: res.rows[i].countNum,docCode:res.rows[i].docCode});
        //       }else
        //         _this.docType.docData.push({item:res.rows[i].name,name:res.rows[i].name+res.rows[i].docCode,index:res.rows[i].index,count: res.rows[i].countNum,docCode:res.rows[i].docCode});
        //     }
        //   } else{
        //     //提示信息
        //     this.warn(res.msg);
        //   }
        // }).catch(err => {
        //   this.error(err);
        // });
      },
      tenType:function() {
        let _this = this;
        _this.tenParams.index = _this.tenIndex;
        _this.tenParams.crLevel=_this.tenCrLevel;
        _this.tenParams.pageSize=10;
        _this.tenParams.createBy = _this.dateRangePick;
        _this.tenParams.outCode = null;
        this.$put(dept_pie_url,_this.tenParams).then(res => {
          if (res.code == '200') {
            _this.deptTenType.deptTenData=[];
            for (let i=0; i<res.rows.length; i++ )  {
                _this.deptTenType.deptTenData.push({item:res.rows[i].name,index:res.rows[i].index,count: res.rows[i].countNum,outCode: res.rows[i].outCode});
            }
            if(res.rows.length<1){
              this.deptTitle=null;
              this.deptTitleDisplay=false;
            }else{
              this.deptTitle!=null;
              this.deptTitleDisplay=true;
            }
          } else {
            //提示信息
            this.warn(res.msg);
          }
        });
      },
      docTenFun:function() {
        let _this = this;
        _this.tenParams.outCode = _this.outCode;
        this.$put(doc_column_url,_this.tenParams).then(res => {
          if (res.code == '200'){
            _this.docTenType.docTenData=[];
            for (let i=0; i<res.rows.length; i++ )  {
              if(res.rows[i].name==undefined){
                res.rows[i].name="";
              }
                _this.docTenType.docTenData.push({item:res.rows[i].name,name:res.rows[i].name+res.rows[i].docCode,index:res.rows[i].index,count: res.rows[i].countNum,docCode: res.rows[i].docCode});
            }
            if(res.rows.length<1){
              _this.docCode=null;
              _this.docTitle=null;
              _this.docListDisplay=false;
              _this.docTitleDisplay=false;
              this.docListData();
            }else{
              _this.docListDisplay=true;
              _this.docTitleDisplay=true;
              _this.docCode=res.rows[0].docCode;
              _this.docTitle=res.rows[0].name;
              this.docListData();
            }
          } else{
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      deptDetail: function(value,name){
        let _this = this;
        _this.deptTitle=name;
        _this.outCode=value;
        this.deptListData();
        this.docTenFun();
        //this.docPie();
      },
      docDetail: function(value,name){
        let _this = this;
        _this.docTitle=name;
        _this.docCode=value;
        this.docListData();
      },
      deptListData: function () {
        let _this = this;
        _this.deptParams.index = this.foldIndex;
        _this.deptParams.dept = 1;
        _this.deptParams.crLevel=_this.lineCrLevel;
        _this.deptParams.outCode=_this.outCode;
        _this.deptParams.createBy = this.dateRangePick;
        this.$put(core_rule_list_url,_this.deptParams).then(res => {
          if (res.code == '200') {
            let nowData = [];
            let oldData =[];
            this.deptLineType.deptLineData=[];
            if(!res.data){nowData=[];oldData=[];return};
            nowData = res.data.nowData;
            oldData = res.data.oldData;
            if (_this.deptParams.index == 1){
              this.deptLineType.scale[0].tickCount=12;
              for (let key in nowData) {
                this.deptLineType.deptLineData.push({time:key+'时',当前:nowData[key],往期: oldData[key]});
              }
            } else if(_this.deptParams.index== 2 || _this.deptParams.index == 3 || _this.deptParams.createBy){
              this.deptLineType.scale[0].tickCount=8;
              for (let key in nowData) {
                this.deptLineType.deptLineData.push({time:key,当前:nowData[key],往期: oldData[key]});
              }
            }else if(_this.deptParams.index== 4){
              this.deptLineType.scale[0].tickCount=12;
              for (let key in nowData) {
                this.deptLineType.deptLineData.push({time:key+'月',当前:nowData[key],往期: oldData[key]});
              }
            }else {
              this.deptLineType.scale[0].tickCount=12;
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
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      docListData: function () {
        let _this = this;
        _this.docParams.index = this.foldIndex;
        _this.docParams.doc = 2;
        _this.docParams.crLevel=_this.lineCrLevel;
        _this.docParams.createBy = this.dateRangePick;
        _this.docParams.docCode=_this.docCode;
        _this.docParams.outCode=_this.outCode;
        this.$put(core_rule_list_url,_this.docParams).then(res => {
          if (res.code == '200') {
            this.docLineType.docLineData=[];
            let nowData = [];
            let oldData =[];
            if(!res.data){nowData=[];oldData=[];return};
            nowData = res.data.nowData;
            oldData = res.data.oldData;
            if (_this.docParams.index == 1){
              this.docLineType.scale1[0].tickCount=12;
              for (let key in nowData) {
                this.docLineType.docLineData.push({time:key+'时',当前:nowData[key],往期: oldData[key]});
              }
            } else if(_this.docParams.index== 2 || _this.docParams.index == 3 || _this.docParams.createBy){
              this.docLineType.scale1[0].tickCount=8;
              for (let key in nowData) {
                this.docLineType.docLineData.push({time:key,当前:nowData[key],往期: oldData[key]});
              }
            }else if(_this.docParams.index== 4){
              this.docLineType.scale1[0].tickCount=12;
              for (let key in nowData) {
                this.docLineType.docLineData.push({time:key+'月',当前:nowData[key],往期: oldData[key]});
              }
            }else {
              this.docLineType.scale1[0].tickCount=12;
              this.docLineType.docLineData.push();
            }
            let dv = new DataSet.View().source(this.docLineType.docLineData);
            dv.transform({
              type: 'fold',
              fields: ['当前', '往期'],
              key: 'city',
              value: 'value',
            });
            _this.docLineType.data = dv.rows;
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      totalNumber: function(){
        let _this=this;
        let coreList = [];
        for (let i=0; i<4; i++){
          coreList.push({countNum:0,crLevel:0,});
          _this.totalNum.push({countNum:0,crLevel:0,});
        }
        let params = {};
        params.createBy = this.dateRangePick;
        this.$put(core_head_url,params).then(res => {
          if (res.code == '200'){
            let i = _this.sumIndex;
            if (i == 4) {
              _this.jumpDateTime = _this.dateRangePick;
            } else {
              _this.jumpDateTime = res.rows[i].timeList;
            }
            for (let i=0; i<res.rows[_this.totalIndex].coreRuleExecuteNewVOS.length; i++){
              if(!res.rows[0].coreRuleExecuteNewVOS){
                _this.inforCardData[0].count = 0;
                _this.inforCardData[1].count = 0;
                _this.inforCardData[2].count = 0;
              }
              else{
              coreList[i].countNum = res.rows[_this.totalIndex].coreRuleExecuteNewVOS[i].countNum;
              coreList[i].crLevel = res.rows[_this.totalIndex].coreRuleExecuteNewVOS[i].crLevel;
              }
            }
            for (let i = 0; i < coreList.length; i++) {
             if (coreList[i].crLevel == 1) {
                _this.inforCardData[1].count = coreList[i].countNum;
              } else if (coreList[i].crLevel == 2) {
                _this.inforCardData[0].count = coreList[i].countNum;
              } else if (coreList[i].crLevel == 3) {
                _this.inforCardData[2].count = coreList[i].countNum;
              }
            };
            _this.sumNumber.warn=0;
            _this.sumNumber.check=0;
            _this.sumNumber.must=0;
            for (let i=0; i<res.rows[_this.sumIndex].coreRuleExecuteNewVOS.length; i++){
              _this.totalNum[i].countNum = res.rows[_this.sumIndex].coreRuleExecuteNewVOS[i].countNum;
              _this.totalNum[i].crLevel = res.rows[_this.sumIndex].coreRuleExecuteNewVOS[i].crLevel;
              if(_this.totalNum[i].crLevel==1){
                _this.sumNumber.warn=_this.totalNum[i].countNum
              }else if(_this.totalNum[i].crLevel==2){
                _this.sumNumber.check=_this.totalNum[i].countNum
              }else if(_this.totalNum[i].crLevel==3){
                _this.sumNumber.must=_this.totalNum[i].countNum
              }
              _this.sumNumber.all=_this.sumNumber.must+_this.sumNumber.check+_this.sumNumber.warn
            }
          } else{
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      handleChange:function(daterange){
          this.dateRangePick = daterange;
          for(let i=0;i<daterange.length;i++){
            if(daterange[i]==""){
              this.foldIndex = 2;
              this.tenIndex = 2;
              this.pieIndex=2;
              this.date();
            }else{
              this.foldIndex = null;
              this.tenIndex = null;
              this.pieIndex=null;
            }
          }
          this.sumIndex = 4;
          this.totalNumber();
          this.all();
      },
      today: function () {
        this.dateRangePick = undefined;
        this.deptTitle=null;
        this.sumIndex = 0;
        this.foldIndex = 1;
        this.tenIndex = 1;
        this.pieIndex=1;
        this.pieCrLevel=null;
        this.totalNumber();
        this.outCode=null;
        this.all();
      },
      month: function () {
        this.deptTitle=null;
        this.sumIndex = 1;
        this.foldIndex = 2;
        this.tenIndex = 2;
        this.pieIndex=2;
        this.pieCrLevel=null;
        this.dateRangePick = undefined;
        this.outCode=null;
        this.docCode=null;
        this.totalNumber();
        this.all();
      },
      season: function () {
        this.deptTitle=null;
        this.sumIndex = 2;
        this.foldIndex = 3;
        this.tenIndex = 3;
        this.pieIndex=3;
        this.pieCrLevel=null;
        this.dateRangePick = undefined;
        this.outCode=null;
        this.docCode=null;
        this.all();
        this.totalNumber();
      },
      thisYear: function () {
        this.deptTitle=null;
        this.sumIndex = 3;
        this.foldIndex = 4;
        this.tenIndex = 4;
        this.pieIndex=4;
        this.pieCrLevel=null;
        this.dateRangePick = undefined;
        this.outCode=null;
        this.docCode=null;
        this.all();
        this.totalNumber();
      },
      all:function(){
        this.deptTitle=null;
        this.lineCrLevel=null;
        this.outCode=null;
        this.docCode=null;
        this.deptListData();
        this.pieCrLevel=null;
        this.tenCrLevel=null;
        this.tenType();
        this.docTenFun();
        this.deptPie();
        this.row();
        this.pieParams.pageSize=null;
        $(".deptTopTen").removeClass('defaultColor');
        $(".topTen").removeClass('defaultColor');
        $($(".topTen").eq(0)).addClass('defaultColor');
      },
      check:function(){
        this.deptTitle=null;
        this.lineCrLevel=2;
        this.outCode=null;
        this.docCode=null;
        this.deptListData();
        this.pieCrLevel=2;
        this.tenCrLevel=2;
        this.tenType();
        this.docTenFun();
        this.deptPie();
        this.row();
        this.pieParams.pageSize=null;
        $(".deptTopTen").removeClass('defaultColor');
        $(".topTen").removeClass('defaultColor');
        $($(".topTen").eq(0)).addClass('defaultColor');
      },
      warn:function(){
        this.deptTitle=null;
        this.lineCrLevel=1;
        this.outCode=null;
        this.docCode=null;
        this.deptListData();
        this.pieCrLevel=1;
        this.tenCrLevel=1;
        this.tenType();
        this.docTenFun();
        this.deptPie();
        this.row();
        this.pieParams.pageSize=null;
        $(".deptTopTen").removeClass('defaultColor');
        $(".topTen").removeClass('defaultColor');
        $($(".topTen").eq(0)).addClass('defaultColor');
      },
      must:function(){
        this.deptTitle=null;
        this.lineCrLevel=3;
        this.outCode=null;
        this.docCode=null;
        this.deptListData();
        this.pieCrLevel=3;
        this.tenCrLevel=3;
        this.tenType();
        this.docTenFun();
        this.deptPie();
        this.row();
        this.pieParams.pageSize=null;
        $(".deptTopTen").removeClass('defaultColor');
        $(".topTen").removeClass('defaultColor');
        $($(".topTen").eq(0)).addClass('defaultColor');
      },
      look: function(data) {
        console.log(data);
        let dateStart= this.jumpDateTime[0];
        let dateEnd = this.jumpDateTime[1];
        let docCode= data.docCode;
        let outCode = data.outCode;
        let violated=data.violated;
        let crLevel=data.crLevel;
        let docName=data.docName;
        let auditState=data.auditState;
        const route = {
          name: 'violation-monitor',
          path: 'violation-monitor',
          query: {
            docCode: docCode,
            outCode: outCode,
            violated:violated,
            dateStart: dateStart,
            dateEnd: dateEnd,
            crLevel: crLevel,
            docName: docName,
            auditState: auditState,
          },
          component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor-detail.vue')
        };
        this.$router.push(route)
      },
      headLook:function(value){
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let day = date.getDate();
        if (month<10){month = '0'+month;}
        if (day<10){day = '0'+(day);}
        let recTime = year + '-'+ month+ '-'+day;
        let dateCrLevel=null;
        let auditState=null;
        if(value==1){dateCrLevel=1;auditState=3}
        else if(value==2){dateCrLevel=2;auditState=3}
        else if(value==3){dateCrLevel=3}
          const route = {
            query: {
              dateStart: recTime,
              dateEnd: recTime,
              violated:1,
              crLevel:dateCrLevel,
              auditState:auditState,
            },
            path: 'violation-monitor',
            name: 'violation-monitor',
            component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor.vue')
          };
          this.$router.push(route)
      },
    },
  };
</script>
