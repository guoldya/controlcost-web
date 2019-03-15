<style lang="less">
  @import "./single-analyze.less";
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
          <li v-on:click="season" class="season" tabindex="0" style=" outline:0">本季度</li>
          <li v-on:click="month" class="month" tabindex="0" style=" outline:0">本月</li>
        </ul>
      </Row>
    </Card>
    <Row class="row">
      <Col class="margin-top-5">
        <Searchpanel ref="searchPanel">
          <div slot="form" class="margin-bottom-4" id="searchForm">
          </div>
        </Searchpanel>
      </Col>
    </Row>
    <Row style="padding-top: 5px;">
      <Col span="12">
        <Card dis-hover style="margin-right: 5px">
          <p slot="title">【{{singleText}}】概况</p>
          <v-chart :forceFit="true" :height="singlePartType.height" :data="singlePartTenType.singlePartTenData"
                   :scale="singlePartType.scalePel"
                   style="width:65%;float: left;height: 400px;"
                    :onClick="singleChange">
            <v-tooltip/>
            <v-axis/>
            <span>超额例数</span>
            <v-bar position="name*count"/>
          </v-chart>
          <ul class="cell-grop" style="width:35%;float: left;">
            <li style="font-weight: bold" v-if="this.isSingleDisplay==true">单病种排行前十</li>
            <li v-for="(item,i) in singlePartTenType.singlePartTenData" v-on:click="singleLineDetail(item.id,item.name)"
                class="topTen" :id="item.id">
              <Row v-if="i==0" class="color defaultColor">
                <Col span="4">{{i+1}}</Col>
                <Col span="10"  class="fontText">
                  <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                </Col>
                <Col  span="6" class="fontText">
                  <a style="color: #666666;" :title="item.count+'例'">{{item.count}}例</a>
                </Col>
                <Col span="4"><a v-on:click="look({cbsId:item.id,diseaseName:item.name,excess:singleExcess})">查看</a></Col>
              </Row>
              <row v-else-if="item.count >999">
                <Col span="4">{{i+1}}</Col>
                <Col span="10" class="fontText">
                  <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                </Col>
                <Col  span="6" class="fontText" style="color:red">
                  <a style="color: #666666;" :title="item.count+'例'">{{item.count}}例</a>
                </Col>
                <Col span="4"><a v-on:click="look({cbsId:item.id,diseaseName:item.name,excess:singleExcess})">查看</a></Col>
              </row>
              <row v-else>
                <Col span="4">{{i+1}}</Col>
                <Col span="10" class="fontText">
                  <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                </Col>
                <Col  span="6" class="fontText">
                  <a style="color: #666666;" :title="item.count+'例'">{{item.count}}例</a>
                </Col>
                <Col span="4"><a v-on:click="look({cbsId:item.id,diseaseName:item.name,excess:singleExcess})">查看</a></Col>
              </row>
            </li>
          </ul>
          <div style="clear:both;"></div>
        </Card>
      </Col>
      <Col span="12">
        <Card dis-hover>
          <p slot="title">病种【{{diseaseName}}】趋势</p>
          <v-chart :forceFit="true" :height="singleLineType.height" :data="singleLineType.data" :scale="singleLineType.scale"
                   style="width: 98%;height: 400px;">
            <v-tooltip/>
            <v-axis/>
            <v-legend/>
            <v-line position="time*value" color="city"/>
          </v-chart>
        </Card>
      </Col>
    </Row>
    <Row style="padding-top: 5px;">
      <Col span="12">
        <Card dis-hover style="margin-right: 5px">
          <p slot="title">病种名称：{{diseaseName}}</p>
          <v-chart :forceFit="true" :height="singleDetailType.height" :data="singleDetailTenType.singleDetailTenData"
                   :scale="singleDetailType.scalePel"
                   style="width:65%;float: left;height: 550px;"
                   :onClick="deptChange">
            <v-tooltip/>
            <v-axis/>
            <span>超额例数</span>
            <v-bar position="name*count"/>
          </v-chart>
          <ul class="cell-grop" style="float: left;width: 35%;">
            <li style="font-weight: bold" v-if="this.isSingleBottomDisplay==true">科室排行前十</li>
            <li v-for="(item,i) in singleDetailTenType.singleDetailTenData"
                v-on:click="singlePieDetail(item.outCode,item.name)" class="deptTopTen" :id="item.outCode">
              <Row v-if="i==0" class="deptColor defaultColor">
                <Col span="4">{{i+1}}</Col>
                <Col span="10"  class="fontText">
                  <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                </Col>
                <Col  span="6" class="fontText">
                  <a style="color: #666666;" :title="item.count+'例'">{{item.count}}例</a>
                </Col>
                <Col span="4"><a  v-on:click="look({cbsId:singleId,outCode:item.outCode,diseaseName:diseaseName,excess:singleExcess})">查看</a></Col>
              </Row>
              <row v-else-if="item.count >999">
                <Col span="4">{{i+1}}</Col>
                <Col span="10" class="fontText">
                  <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                </Col>
                <Col  span="6" class="fontText" style="color:red">
                  <a style="color: #666666;" :title="item.count+'例'">{{item.count}}例</a>
                </Col>
                <Col span="4"><a v-on:click="look({cbsId:singleId,outCode:item.outCode,diseaseName:diseaseName,excess:singleExcess})">查看</a>
                </Col>
              </row>
              <row v-else>
                <Col span="4">{{i+1}}</Col>
                <Col span="10" class="fontText">
                  <a style="color: #666666;" :title=item.name>{{item.name}}</a>
                </Col>
                <Col  span="6" class="fontText">
                  <a style="color: #666666;" :title="item.count+'例'">{{item.count}}例</a>
                </Col>
                <Col span="4"><a v-on:click="look({cbsId:singleId,outCode:item.outCode,diseaseName:diseaseName,excess:singleExcess})">查看</a>
                </Col>
              </row>
            </li>
          </ul>
          <div style="clear:both;"></div>
        </Card>
      </Col>
      <Col span="12">
        <Card dis-hover style="height: 635px">
          <p slot="title">【{{diseaseName}}】项目类别占比</p>
          <div style="width:55%;float: left;">
            <v-chart :forceFit="true" :height="singlePieType.height" :data="singlePieType.data" :scale="singlePieType.scalePel"
                     style="height: 360px;">
              <v-tooltip :showTitle="false" dataKey="item*percent"/>
              <v-axis/>
              <v-legend dataKey="item"/>
              <v-pie position="percent" color="item" :vStyle="pieStyle" :label="labelConfig"/>
              <v-coord type="theta" :radius="0.75" :innerRadius="0.6"/>
            </v-chart>
            <div>
              <ul class="cell-grop">
                <li style="font-weight: bold"><p>费用概况</p></li>
                <li>
                  <span style="font-weight: bold">人数情况：</span>
                  <span>【{{deptPieName}}】正常入径{{pieData.totalNum}}例</span>
                </li>
                <li>
                  <span style="font-weight: bold">费用情况：</span>
                  <span>
                    【{{diseaseName}}】单病种额定值
                      <span  v-if="pieData.averageMoney">{{pieData.planNum|keepTwoNum}}</span>
                      <span  v-else>0</span>
                      元，正常入径例数平均住院费用
                      <span v-if="pieData.averageMoney">{{pieData.averageMoney|keepTwoNum}}</span>
                      <span v-else>0</span>
                    元
                </span>
                  <span v-if="parseFloat('{{pieData.allRatio}}')>10">超额定值{{pieData.allRatio}}</span>
                </li>
                <li>
                  <span style="font-weight: bold">超额情况：</span>
                  <span>
                    正常入径总例数中超额
                    <span v-if="pieData.vctNum">{{pieData.vctNum}}</span>
                    <span v-else>0</span>
                    例，已超例数平均住院费用
                    <span v-if="pieData.vctAverageMoney">{{pieData.vctAverageMoney | keepTwoNum}}</span>
                    <span v-else>0</span>
                    元
                </span>
                  <span v-if="pieData.vctRatio&&parseFloat('{{pieData.vctRatio}}')>10">超额定值{{pieData.vctRatio}}</span>
                </li>
              </ul>
            </div>
          </div>

          <ul class="cell-grop feeGroup">
            <li class="title"><p>费用构成情况</p></li>
            <li style="text-align: right"><p>单位：元</p></li>
            <li v-on:click="" v-for="(item,i) in listData" class="topTen">
              <row>
                <Col span="2">{{i+1}}</Col>
                <Col span="8" class="fontText">
                  <a style="color: #666666;" :title=item.item>{{item.item}}</a>
                </Col>
                <Col span="6">{{item.ratio}} </Col>
                <Col  span="8" class="fontText">
                  <!--:to="/monitor-detail/+item.id"-->
                  <a style="color: #666666;" :title="item.count+'元'">{{item.count}}元</a>
                </Col>
              </row>
            </li>
            <div style="clear:both;"></div>
          </ul>
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

  let single_part_url = 'sys/coreBdSd/selectSingleSdTopTen';
  let single_line_url = 'sys/coreBdSd/selectSingleLineChart';
  let single_dept_ten_url = 'sys/coreBdSd/selectSingleDeTopTen';
  let single_pie_url = 'sys/coreBdSd/selectSingleTotal';
  let single_head_url = 'sys/coreRuleExecute/selectRulePageHead';

  let cbiId_list_url = 'sys/coreBdIndicator/selectList';
  let single_cbiId_url = 'sys/coreBdIndicator/selectOne';
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
        jumpDateTime: [],
        isSingleDisplay: true,
        isSingleBottomDisplay: true,
        searchForm: {},
        searchFormData: {},
        singleParams: {},
        singleTenParams: {},
        lineParams: {},
        singleDetailParams: {},
        singleDetailTenParams: {},
        singlePieParams: {},
        singleIndex: 2,
        dateRangePick: [],
        singleExcess: null,
        singleText: "单病种全部",
        singleId: null,
        diseaseName: null,
        deptPieName: null,
        pieData: {},
        totalIndex: 1,
        indType: null,
        indParams: {},
        costList: [],
        listData: [],
        singleOutCode: null,
        singlePartType: {
          data: [],
          singlePartData: [],
          height: 400,
          scalePel: [{
            dataKey: 'count',
          }]
        },
        singlePartTenType: {
          data: [],
          singlePartTenData: [],
          height: 400,
          scalePel: [{
            dataKey: 'count',
          }]
        },
        singleLineType: {
          data: [],
          singleLineData: [],
          height: 400,
          scale: [{
            tickCount: 12,
            dataKey: 'month',
          }],
        },
        singleDetailType: {
          data: [],
          singleDetailData: [],
          height: 400,
          scalePel: [{
            dataKey: 'count',
          }]
        },
        singleDetailTenType: {
          data: [],
          singleDetailTenData: [],
          height: 400,
          scalePel: [{
            dataKey: 'count',
          }]
        },
        singlePieType: {
          data: [],
          singlePieData: [],
          height: 350,
          scalePel: [{
            dataKey: 'percent',
            min: 0,
            formatter: '.0%',
          }],
        },
        orderCodeList: this.enum.orderCodeList,
        pieStyle: {
          stroke: "#fff",
          lineWidth: 1
        },
        style: {stroke: '#fff', lineWidth: 1},
        labelConfig: ['percent', {
          formatter: (val, item) => {
            return item.point.item + ': ' + val;
          }
        }],
        targetData: new this.customstore({
          key: "id",
          byKey: (key) => {
            return this.CommDs.loadByKey(single_cbiId_url, {id: key});
          },
          load: (e) => {
            return this.CommDs.loadList(cbiId_list_url, {status: 1});
          }
        }),
      };
    },
    mounted() {
      this.searchForm = $('#searchForm').dxForm({
        colCount: 4,
        formData: this.searchFormData,
        items: [
          {
            dataField: 'xxx',
            editorType: 'dxSelectBox',
            label: {
              alignment: 'right',
              text: '维度选择',
            },
            editorOptions: {
              placeholder: '单病种全部',
              dataSource: this.enum.singleType,
              displayExpr: 'text',
              valueExpr: 'id',
              onSelectionChanged: (e) => {
                if (e.selectedItem == null) {
                  return;
                }
                this.singleText = e.selectedItem.text;
                if (e.selectedItem.text == "单病种全部") {
                  this.singleExcess = null;
                } else {
                  this.singleExcess = "1";
                }
                this.singleType();
                this.singleTenType();
              }
            },
          },
        ]
      }).dxForm('instance');
      this.month();
      this.date();
      this.singleClick();
      this.deptClick();
    },
    methods: {
      date: function () {
        $($(".ulList li").eq(3)).css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
        $(".ulList li").click(function () {
          $(".ulList li").css({"color": "#666666", "border-bottom": "none"});
          $(this).css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
          $($(".ulList li").eq(0)).css({"color": "#666666", "border-bottom": "none"});
        });
      },
      singleClick: function () {
        $("body").on("click", ".topTen ", function () {
          $(".color").removeClass("defaultColor");
          $(".topTen").removeClass('defaultColor');
          $(this).addClass('defaultColor');
        });
      },
      deptClick: function () {
        $("body").on("click", ".deptTopTen ", function () {
          $(".deptColor").removeClass("defaultColor");
          $(".deptTopTen").removeClass('defaultColor');
          $(this).addClass('defaultColor');
        });
      },
      singleChange: function(ev,chart){
        if (ev.data&&ev.data._origin) {
          this.singleId = ev.data._origin.id;
          this.diseaseName = ev.data._origin.name;
          this.lineData();
          this.singleBottomType();
          this.singleBottomTenType();
          $(".color").removeClass("defaultColor");
          $(".topTen").removeClass('defaultColor');
          $("#"+this.singleId).addClass("defaultColor");
        }
      },
      deptChange: function(ev){
        if (ev.data&&ev.data._origin) {
          this.deptPieName = ev.data._origin.name;
          this.singleOutCode = ev.data._origin.outCode;
          this.singlePie();
          $(".deptColor").removeClass("defaultColor");
          $(".deptTopTen").removeClass('defaultColor');
          $("#"+this.singleOutCode).addClass("defaultColor");
        }
      },
      totalNumber: function () {
        let _this = this;
        this.$put(single_head_url).then(res => {
          if (res.code == '200') {
            let i = _this.totalIndex;
            if (i == 4) {
              _this.jumpDateTime = _this.dateRangePick;
            } else {
              _this.jumpDateTime = res.rows[i].timeList;
            }
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      singleType: function () {
        // let _this = this;
        // _this.singlePartType.singlePartData = [];
        // _this.singleParams.index = _this.singleIndex;
        // _this.singleParams.excess = _this.singleExcess;
        // _this.singleParams.createBy = _this.dateRangePick;
        // _this.singleParams.pageSize =10;
        // this.$put(single_part_url, _this.singleParams).then(res => {
        //   if (res.code == '200') {
        //     for (let i = 0; i < res.rows.length; i++) {
        //       if (res.rows[i].diseaseName == undefined) {
        //         _this.singlePartType.singlePartData.push({
        //           name: "",
        //           index: res.rows[i].index,
        //           count: res.rows[i].countNum,
        //           id: res.rows[i].id
        //         });
        //       } else {
        //         _this.singlePartType.singlePartData.push({
        //           name: res.rows[i].diseaseName,
        //           index: res.rows[i].index,
        //           count: res.rows[i].countNum,
        //           id: res.rows[i].id
        //         });
        //       }
        //     }
        //   } else {
        //     //提示信息
        //     this.warn(res.msg);
        //   }
        // }).catch(err => {
        //   this.error(err);
        // });
      },
      singleTenType: function () {
        let _this = this;
        _this.singlePartTenType.singlePartTenData = [];
        _this.singlePartType.singlePartData = [];
        _this.singleTenParams.index = _this.singleIndex;
        _this.singleTenParams.excess = _this.singleExcess;
        _this.singleTenParams.pageSize = 10;
        _this.singleTenParams.createBy = _this.dateRangePick;
        this.$put(single_part_url, _this.singleTenParams).then(res => {
          if (res.code == '200') {
            for (let i = 0; i < res.rows.length; i++) {
              if (res.rows[i].diseaseName == undefined) {
                _this.singlePartTenType.singlePartTenData.push({
                  name: "",
                  index: res.rows[i].index,
                  count: res.rows[i].countNum,
                  id: res.rows[i].id
                });
              } else {
                _this.singlePartTenType.singlePartTenData.push({
                  name: res.rows[i].diseaseName,
                  index: res.rows[i].index,
                  count: res.rows[i].countNum,
                  id: res.rows[i].id
                });
              }
              _this.singleId = res.rows[0].id;
            }
            if (res.rows.length < 1) {
              _this.isSingleDisplay = false;
              _this.singleId = null;
              _this.diseaseName = null;
              _this.lineData();
              _this.singleBottomType();
              _this.singleBottomTenType();
            } else {
              _this.isSingleDisplay = true;
              this.singleId = res.rows[0].id;
              this.diseaseName = res.rows[0].diseaseName;
              this.lineData();
              this.singleBottomType();
              this.singleBottomTenType();
            }
          } else {
            //提示信息
            this.warn(res.msg);
          }
        })
      },
      lineData: function () {
        let _this = this;
        _this.lineParams.index = _this.singleIndex;
        _this.lineParams.createBy = _this.dateRangePick;
        _this.lineParams.cbsId = _this.singleId;
        _this.lineParams.excess = _this.singleExcess;
        if (this.singleId == null) {
          return;
        }
        this.$put(single_line_url, _this.lineParams).then(res => {
          if (res.code == '200') {
            this.singleLineType.singleLineData = [];
            let nowData = [];
            let oldData = [];
            if (!res.data) {
              nowData = [];
              oldData = [];
              return
            };
            nowData = res.data.nowData;
            oldData = res.data.oldData;
            if (this.lineParams.index == 4) {
              for (let key in nowData) {
                this.singleLineType.singleLineData.push({time: key + '月', 当前: nowData[key], 往期: oldData[key]});
              }
            } else {
              for (let key in nowData) {
                this.singleLineType.singleLineData.push({time: key, 当前: nowData[key], 往期: oldData[key]});
              }
            }
            let dv = new DataSet.View().source(this.singleLineType.singleLineData);
            dv.transform({
              type: 'fold',
              fields: ['当前', '往期'],
              key: 'city',
              value: 'value',
            });
            _this.singleLineType.data = dv.rows;
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      singleBottomType: function () {
        // let _this = this;
        // _this.singleDetailType.singleDetailData = [];
        // _this.singleDetailParams.index = _this.singleIndex;
        // _this.singleDetailParams.excess = _this.singleExcess;
        // _this.singleDetailParams.cbsId = _this.singleId;
        // _this.singleDetailParams.createBy = _this.dateRangePick;
        // _this.singleDetailParams.pageSize = 10;
        // if (this.singleId == null) {
        //   return;
        // }
        // this.$put(single_dept_ten_url, _this.singleDetailParams).then(res => {
        //   if (res.code == '200') {
        //     for (let i = 0; i < res.rows.length; i++) {
        //       if (res.rows[i].deptName == undefined) {
        //         _this.singleDetailType.singleDetailData.push({
        //           name: "",
        //           index: res.rows[i].index,
        //           count: res.rows[i].countNum,
        //           id: res.rows[i].id,
        //           outCode: res.rows[i].outCode,
        //         });
        //       } else {
        //         _this.singleDetailType.singleDetailData.push({
        //           name: res.rows[i].deptName,
        //           index: res.rows[i].index,
        //           count: res.rows[i].countNum,
        //           id: res.rows[i].id,
        //           outCode: res.rows[i].outCode,
        //         });
        //       }
        //     }
        //   } else {
        //     //提示信息
        //     this.warn(res.msg);
        //   }
        // }).catch(err => {
        //   this.error(err);
        // });
      },
      singleBottomTenType: function () {
        let _this = this;
        _this.singleDetailTenType.singleDetailTenData = [];
        _this.singleDetailType.singleDetailData = [];
        _this.singleDetailTenParams.index = _this.singleIndex;
        _this.singleDetailTenParams.excess = _this.singleExcess;
        _this.singleDetailTenParams.cbsId = _this.singleId;
        _this.singleDetailTenParams.pageSize = 10;
        _this.singleDetailTenParams.createBy = _this.dateRangePick;
        if (this.singleId == null) {
          return;
        }
        this.$put(single_dept_ten_url, _this.singleDetailTenParams).then(res => {
          if (res.code == '200') {
            for (let i = 0; i < res.rows.length; i++) {
              if (res.rows[i].deptName == undefined) {
                _this.singleDetailTenType.singleDetailTenData.push({
                  name: "",
                  index: res.rows[i].index,
                  count: res.rows[i].countNum,
                  outCode: res.rows[i].outCode
                });
              } else {
                _this.singleDetailTenType.singleDetailTenData.push({
                  name: res.rows[i].deptName,
                  index: res.rows[i].index,
                  count: res.rows[i].countNum,
                  outCode: res.rows[i].outCode
                });
              }
            }
            if (res.rows.length < 0) {
              this.isSingleBottomDisplay = false;
              this.deptPieName = null;
              this.singleOutCode = null;
              this.singlePie();
            } else {
              this.isSingleBottomDisplay = true;
              this.deptPieName = res.rows[0].deptName;
              this.singleOutCode = res.rows[0].outCode;
              this.singlePie();
            }
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      singleLineDetail: function (value, name) {
        let _this = this;
        this.singleId = value;
        this.diseaseName = name;
        this.lineData();
        this.singleBottomType();
        this.singleBottomTenType();
      },
      singlePie: function () {
        let _this = this;
        _this.singlePieType.singlePieData = [];
        _this.listData = [];
        _this.singlePieParams.excess = _this.singleExcess;
        _this.singlePieParams.cbsId = _this.singleId;
        _this.singlePieParams.index = _this.singleIndex;
        _this.singlePieParams.createBy = _this.dateRangePick;
        _this.singlePieParams.outCode = _this.singleOutCode;
        if (this.singleId == null) {
          return;
        }
        this.$put(single_pie_url, _this.singlePieParams).then(res => {
          if (res.code == '200') {
            if(res.data.costList){
              _this.costList = res.data.costList;
            }
            _this.pieData.totalNum = res.data.totalNum;
            _this.pieData.vctNum = res.data.vctNum;
            _this.pieData.planNum = res.data.planNum;
            _this.pieData.vctMoney = res.data.vctMoney;
            _this.pieData.averageMoney = res.data.averageMoney;
            _this.pieData.allRatio = res.data.allRatio;
            _this.pieData.vctAverageMoney = res.data.vctAverageMoney;
            _this.pieData.vctRatio = res.data.vctRatio;
            _this.pieData.normal = res.data.totalNum - res.data.vctNum;
            for (let i = 0; i < _this.costList.length; i++) {
              if (_this.costList[i].orderCode) {
                _this.singlePieType.singlePieData.push({
                  item: _this.orderCodeList[_this.costList[i].orderCode].text,
                  ratio: _this.costList[i].ratio,
                  count: _this.costList[i].singleMoney,
                });
                _this.listData.push({
                  item: _this.orderCodeList[_this.costList[i].orderCode].text,
                  ratio: _this.costList[i].ratio,
                  count: _this.costList[i].singleMoney
                });
              } else {
                _this.singlePieType.singlePieData.push({
                  item: "",
                  ratio: _this.costList[i].ratio,
                  count: _this.costList[i].singleMoney,
                });
                _this.listData.push({item: "", ratio: _this.costList[i].ratio, count: _this.costList[i].singleMoney});
              }
              ;
            }

            let dsv = new DataSet.View().source(_this.singlePieType.singlePieData);
            dsv.transform({
              type: 'percent',
              field: 'count',
              dimension: 'item',
              as: 'percent'
            });
            _this.singlePieType.data = dsv.rows;
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      singlePieDetail: function (value, name) {
        this.deptPieName = name;
        this.singleOutCode = value;
        this.singlePie();
      },
      handleChange: function (daterange) {
        this.dateRangePick = daterange;
        for(let i=0;i<daterange.length;i++){
          if(daterange[i]==""){
            this.singleIndex = 2;
            this.date();
          }else{
            this.singleIndex = null;
          }
        }
        this.totalIndex = 4;
        this.tenIndex = null;
        this.singleType();
        this.singleTenType();
        this.totalNumber();
      },
      month: function () {
        this.totalIndex = 1;
        this.singleIndex = 2;
        this.tenIndex = 2;
        this.pieCrLevel = null;
        this.dateRangePick = undefined;
        this.outCode = null;
        this.docCode = null;
        this.singleType();
        this.singleTenType();
        this.totalNumber();
      },
      season: function () {
        this.totalIndex = 2;
        this.tenIndex = 3;
        this.singleIndex = 3;
        this.pieCrLevel = null;
        this.dateRangePick = undefined;
        this.outCode = null;
        this.docCode = null;
        this.singleType();
        this.singleTenType();
        this.totalNumber();
      },
      thisYear: function () {
        this.totalIndex = 3;
        this.tenIndex = 4;
        this.singleIndex = 4;
        this.pieCrLevel = null;
        this.dateRangePick = undefined;
        this.outCode = null;
        this.docCode = null;
        this.singleType();
        this.singleTenType();
        this.totalNumber();
      },
      look: function (data) {
        let params = {};
        if (data.cbsId) {
          params.cbsId = data.cbsId;
        }
        if (this.jumpDateTime[0]) {
          params.dateStart = this.jumpDateTime[0];
          params.dateEnd = this.jumpDateTime[1];
        }
        if (data.diseaseName) {
          params.diseaseName = data.diseaseName;
        }
        if (data.outCode) {
          params.outCode = data.outCode;
        }
        if (data.excess) {
          params.excess = data.excess;
        }
        const route = {
          query: params,
          name: 'single-disease-list',
          path: 'single-disease-list',
          component: () => import('@/view/disease-mgt/single-disease/single-disease-list.vue')
        };
        this.$router.push(route)
      },
    },
  };
</script>

