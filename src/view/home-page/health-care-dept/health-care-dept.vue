<style lang="less">
  @import "../home-page.less";
</style>
<template>
  <div>
    <Card dis-hover>
      <Row class="RowOne">
        <ul class="ulList">
          <li>
            <DatePicker class="dataPicker" type="daterange" placement="bottom-end" :value="dateRangePick"
                        @on-change="handleChange"
                        format="yyyy-MM-dd"
                        placeholder="请选择时间段"></DatePicker>
          </li>
          <li class="year" tabindex="0" v-on:click="thisYear">全年</li>
          <li class="season" tabindex="0" v-on:click="season">本季度</li>
          <li class="month" tabindex="0" v-on:click="month">本月</li>
          <li class="today" tabindex="0" v-on:click="today">今日</li>
        </ul>
      </Row>
    </Card>
    <Row class="RowTwo" :gutter="20">
      <i-col class="con" span="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`">
        <Card dis-hover class="card-wrapper">
          <div class="content-page" v-if="infor.detailNumber == 1" style="cursor: default">
            <div class="left-page" :style="{background:infor.color }">
              <p class="pp">{{infor.text}}</p>
            </div>
            <div class="right-page" :style="{}">
              <p class="titleP">{{ infor.title }}</p>
              <count-to :end="infor.count" count-class="count-style"/>
            </div>
          </div>
          <div class="content-page" v-else v-on:click="look(infor.detailNumber)">
            <div class="left-page" :style="{background:infor.color }">
              <p class="pp">{{infor.text}}</p>
            </div>
            <div class="right-page" :style="{}">
              <p class="titleP">{{ infor.title }}</p>
              <count-to :end="infor.count" count-class="count-style"/>
            </div>
          </div>
        </Card>
      </i-col>
    </Row>
    <Row class="RowThree">
      <Col span="24">
        <Card dis-hover>
          <p slot="title">规则提醒趋势图</p>
          <v-chart :forceFit="true" :height="foldType.height" :data="foldType.data" :scale="foldType.scale"
                   style="width: 98%">
            <v-tooltip/>
            <v-axis/>
            <v-legend position="bottom"></v-legend>
            <v-line position="time*value" :color="colors"/>
          </v-chart>

          <!--<v-plugin v-if="hackReset">-->
            <!--<v-slider ref="slider" width="auto" :height="26"-->
                      <!--:start="start" :end="end"-->
                      <!--:data="data" x-axis="time" y-axis="value"-->
                      <!--:scales="{time:{type: 'time',tickCount: 10,mask: 'YYYY-MM-DD'}}"-->
                      <!--:background-chart="{ type: 'line'}"-->
                      <!--:on-change="slideChange"/>-->
          <!--</v-plugin>-->
        </Card>
      </Col>
    </Row>
    <Row class="RowFour">
      <Col span="12">
        <Card class="cardScalePel" dis-hover>
          <p slot="title">项目类别占比</p>
          <v-chart class="chartPel" :forceFit="true" height=400 :data="itemType.data" :scale="itemType.scalePel"
                   :onClick="clickChange">
            <v-tooltip :showTitle="false" dataKey="item*percent"/>
            <v-axis/>
            <v-legend dataKey="item"/>
            <v-pie position="percent" color="item" :vStyle="itemType.pieStyle" :label="itemType.labelConfig"/>
            <v-coord type="theta" :radius="0.75" :innerRadius="0.6"/>
          </v-chart>
          <ul v-for="(item, index) in listData" class="cell-list">
            <li v-if="index==0" :id="item.itemBzCode" v-on:click="clickList(item.itemBzCode)"><span class="span-radius"
                                                                                                    :style="{background:item.color}"> </span>{{item.itemBzCodeStr+'类'+item.ratio+''+item.countNum+'次'}}
            </li>
            <li v-else :id="item.itemBzCode" v-on:click="clickList(item.itemBzCode)"><span class="span-radius"
                                                                                           :style="{background:item.color}"> </span>{{item.itemBzCodeStr+'类'+item.ratio+''+item.countNum+'次'}}
            </li>
          </ul>
        </Card>
      </Col>
      <Col span="12" style="padding-left: 5px">
        <Card dis-hover style="height: 425px;">
          <p slot="title">指标排名TOP10 </p>
          <div id="window-grid"></div>
        </Card>
      </Col>
    </Row>
  </div>
</template>


<script>
  import Vue from 'vue';
  import DataSet from '@antv/data-set';
  import InforCard from '_c/info-card';
  import CountTo from '_c/count-to';
  import CommonIcon from '_c/common-icon';
  import index from "../../../store";

  let core_rule_count_ratio_url = 'sys/coreRuleExecute/selectCountAndRatio';
  let core_rule_select_url = 'sys/coreRuleExecute/selectRepeat';
  let core_rule_total_url = 'sys/coreRuleExecute/selectPageHead';
  let core_rule_fold_list_url = 'sys/coreRuleExecute/selectLineChart';

  export default {
    components: {
      InforCard,
      CountTo,
      CommonIcon
    },
    data() {
      return {
        colors: [
          'type', ['#9A66E4',
            '#ff9900',
            '#ed3f14']
        ],
        inforCardData: [
          {title: '全院提醒总量/次', text: '审', count: 0, color: '#9A66E4', detailNumber: 1},
          {title: '全院提醒总量/次', text: '警', count: 0, color: '#ff9900', detailNumber: 2},
          {title: '全院提醒总量/次', text: '禁', count: 0, color: '#ed3f14', detailNumber: 3},
          {title: '全院待审核的总量/次', text: '待', count: 0, color: '#2d8cf0', detailNumber: 4},
        ],
        foldType: {
          data: [],
          sourceData: [],
          scale: [{
            tickCount: 12,
            dataKey: 'time',
          }],
          forceFit: true,
          height: 300,
          style: {stroke: '#fff', lineWidth: 1},
        },
        itemType: {
          data: [],
          perData: [],
          scalePel: [{
            dataKey: 'percent',
            min: 0,
            formatter: '.0%',
          }],
          pieStyle: {
            stroke: "#fff",
            lineWidth: 1,
          },
          height: 400,
          labelConfig: ['percent', {
            formatter: (val, item) => {
              return item.point.item + '类' + ': ' + val;
            }
          }],
        },
        hackReset: false,
        data: [],
        sourceData: [],
        start:null,
        end:null,
        dateTime: [],
        thisItem: null,
        listData: [],
        totalIndex: 1,
        foldIndex: 2,
        dateRangePick: [],
        windowDx: {},
        windowDxData: new this.customstore({
          load: this.detail,
        }),
      };
    },
    created() {
      this.foldListData();
      // this.newSlider();
    },
    mounted() {
      // this.foldListData();
      // this.newSlider();
      this.windowDx = $('#window-grid').dxDataGrid({
        height: 350,
        hoverStateEnabled: true,
        columnFixing: {
          enabled: true
        },
        selection: {
          mode: 'single'//选中一行
        },
        dataSource: {
          store: this.windowDxData
        },
        remoteOperations: {
          filtering: true,
          sorting: true,
        },
        paging: {
          pageSize: 10
        },
        columns: [
          {
            caption: '序号',
            dataField: 'num',
            width: 80,
          },
          {
            caption: '指标名称',
            dataField: 'name',
            width: 300
          },
          {
            caption: '数量/次',
            dataField: 'coreBdIndicatorNum',
            minWidth: 100
          },
        ]
      }).dxDataGrid('instance');
      this.onLood();
      this.totalNumber();
      this.month_focus();
      this.headUlList();
      this.footerList();
    },

    methods: {
      month_focus() {
        $(".month").css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
      },
      headUlList: function () {
        $(".ulList li").click(function () {
          $(".ulList li").css({"color": "#666666", "border-bottom": "none"});
          $(this).css({"color": "#2c8df1", "border-bottom": "2px solid #2c8df1"});
          $($(".ulList li").eq(0)).css({"color": "#666666", "border-bottom": "none"});
        });
      },
      footerList: function () {
        $("body").on("click", ".cell-list li", function () {
          $(".cell-list li").removeClass('cell-listlihover');
          $(this).addClass('cell-listlihover');
        });
      },

      //饼状图点击事件
      clickChange: function (ev, chart) {
        if ($.trim(ev.data).length) {
          if (ev.data.point) {
            this.thisItem = ev.data.point.itemBzCode;
            this.windowDx.refresh();
            $(".cell-list li").removeClass('cell-listlihover');
            $("#" + this.thisItem).addClass('cell-listlihover');
          }
        }
      },
      //项目类别占比排行
      onLood: function () {
        let _this = this;
        let params = {};
        let foldList = [];
        let color = ['#5db1ff', '#36cbcb', '#4ecb73', '#fbd437', '#f04864',];
        _this.listData = [];
        _this.itemType.perData = [];
        for (let key in _this.dateRangePick) {
          foldList[key] = _this.dateRangePick[key];
        }
        if (foldList[0] == "" || foldList[1] == "") {
          _this.dateRangePick = undefined;
          _this.foldIndex = 2;
        }
        params.index = _this.foldIndex;
        params.createBy = _this.dateRangePick;
        this.$put(core_rule_count_ratio_url, params).then(res => {
          if (res.code == '200') {
            for (let i = 0; i < res.rows.length; i++) {
              _this.itemType.perData.push({
                item: res.rows[i].itemBzCodeStr,
                count: res.rows[i].countNum,
                itemBzCode: res.rows[i].itemBzCode
              });
              _this.listData.push({
                itemBzCode: res.rows[i].itemBzCode,
                itemBzCodeStr: res.rows[i].itemBzCodeStr,
                ratio: res.rows[i].ratio,
                countNum: res.rows[i].countNum,
                color: color[i]
              });
            }
            let dsv = new DataSet.View().source(_this.itemType.perData);
            dsv.transform({
              type: 'percent',
              field: 'count',
              dimension: 'item',
              as: 'percent'
            });
            _this.itemType.data = dsv.rows;
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //头数据
      totalNumber: function () {
        let _this = this;
        let coreList = [];
        for (let i = 0; i < 4; i++) {
          coreList.push({countNum: 0, crLevel: i,});
        }
        let params = {};
        params.createBy = this.dateRangePick;
        this.$put(core_rule_total_url, params).then(res => {
          if (res.code == '200') {
            let i = _this.totalIndex;
            if (i == 4) {
              _this.dateTime = _this.dateRangePick;
            } else {
              _this.dateTime = res.rows[i].timeList;
            }
            let totalIn = res.rows[i].coreRuleExecuteNewVOS;
            for (let i = 0; i < totalIn.length; i++) {
              coreList[i].countNum = totalIn[i].countNum;
              coreList[i].crLevel = totalIn[i].crLevel;
            }
            for (let i = 0; i < coreList.length; i++) {
              if (coreList[i].crLevel == 0) {
                _this.inforCardData[3].count = coreList[i].countNum;
              } else if (coreList[i].crLevel == 1) {
                _this.inforCardData[1].count = coreList[i].countNum;
              } else if (coreList[i].crLevel == 2) {
                _this.inforCardData[0].count = coreList[i].countNum;
              } else if (coreList[i].crLevel == 3) {
                _this.inforCardData[2].count = coreList[i].countNum;
              }
            }
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //折线图数据
      foldListData: function () {
        let _this = this;
        let params = {};
        let foldList = [];
        for (let key in _this.dateRangePick) {
          foldList[key] = _this.dateRangePick[key];
        }
        if (foldList[0] == "" || foldList[1] == "") {
          _this.dateRangePick = undefined;
          _this.foldIndex = 2;
        }
        params.index = _this.foldIndex;
        params.createBy = _this.dateRangePick;
        this.$put(core_rule_fold_list_url, params).then(res => {
          if (res.code == '200') {
            this.foldType.sourceData = [];
            if (params.index == 1) {
              for (let key in res.data) {
                this.foldType.sourceData.push({
                  time: key + '时',
                  审核: res.data[key][2],
                  警告: res.data[key][1],
                  禁止: res.data[key][3],
                });
              }
              this.sourceData = this.foldType.sourceData;

            } else if (params.index == 2 || params.index == 3 || params.createBy) {
              for (let key in res.data) {
                this.foldType.sourceData.push({
                  time: key,
                  警告: res.data[key][1],
                  审核: res.data[key][2],
                  禁止: res.data[key][3],
                });
              }
              this.foldType.sourceData = this.sortDataArray(this.foldType.sourceData);
              this.sourceData = this.foldType.sourceData;
              this.start = this.sourceData[0].time;
              this.end = this.sourceData[this.sourceData.length-1].time;
            } else if (params.index == 4) {
              for (let key in res.data) {
                this.foldType.sourceData.push({
                  time: key + '月',
                  警告: res.data[key][1],
                  审核: res.data[key][2],
                  禁止: res.data[key][3],
                });
              }
              this.sourceData = this.foldType.sourceData;
            } else {
              this.foldType.sourceData.push();
            }

            let dv = new DataSet.View().source(this.sourceData);
            dv.transform({
              type: 'fold',
              fields: ['审核', '警告', '禁止',],
              key: 'type',
              value: 'value',
            });
            _this.foldType.data = dv.rows;
            _this.data = _this.foldType.data;
            _this.$nextTick(() => {
              _this.hackReset = true;
            });
          } else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      //点击项目类别占比查看网格数据
      clickList: function (value) {
        this.thisItem = value;
        this.windowDx.refresh();
      },
      //网格获取数据
      detail() {
        var deferred = $.Deferred(),
          params = {};
        if (this.thisItem) {
          params.itemBzCode = this.thisItem;
        }
        params.index = this.foldIndex;
        params.createBy = this.dateRangePick;
        params.pageSize = 10;
        this.$put(core_rule_select_url, params).then(res => {
          if (res.code == '200') {
            let rowsData = [];
            for (let key in res.rows) {
              rowsData.push({
                coreBdIndicatorNum: res.rows[key].coreBdIndicatorNum, id: res.rows[key].id,
                index: res.rows[key].index, name: res.rows[key].name, num: Number(key) + 1
              })
            }
            deferred.resolve(rowsData, {totalCount: res.total});
          }
          else {
            //提示信息
            deferred.resolve([], {totalCount: 0});
            this.warn(res.msg);
            this.windowDx.refresh();
          }
        }).catch(err => {
          deferred.resolve([], {totalCount: 0});
          this.error(err);
        });
        return deferred.promise();
      },
      //点击今日刷新所有
      today: function () {
        let myDate = new Date();
        myDate.toLocaleDateString();
        this.foldIndex = 1;
        this.totalIndex = 0;
        this.dateRangePick = undefined;
        this.totalNumber();
        this.foldListData();
        this.detail();
        this.onLood();
        this.windowDx.refresh();
      },
      month: function () {
        this.foldIndex = 2;
        this.totalIndex = 1;
        this.dateRangePick = undefined;
        this.totalNumber();
        this.foldListData();
        this.detail();
        this.onLood();
        this.windowDx.refresh();
      },
      //三个月
      season: function () {
        this.foldIndex = 3;
        this.totalIndex = 2;
        this.dateRangePick = undefined;
        this.totalNumber();
        this.foldListData();
        this.detail();
        this.onLood();
        this.windowDx.refresh();
      },
      thisYear: function () {
        this.foldIndex = 4;
        this.totalIndex = 3;
        this.dateRangePick = undefined;
        this.totalNumber();
        this.foldListData();
        this.detail();
        this.onLood();
        this.windowDx.refresh();
      },
      //自定义时间范围
      handleChange: function (daterange) {
        this.foldIndex = undefined;
        this.dateRangePick = daterange;
        this.totalIndex = 4;
        this.totalNumber();
        this.foldListData();
        this.detail();
        this.onLood();
        this.windowDx.refresh();
      },
      //点击头部数据查看详情
      look: function (value) {
        let dateBefore = this.dateTime[0];
        let dateAfter = this.dateTime[1];
        let auditState = 1;
        let crLevel = 3;
        if (value == 1) {
          // const route = {
          //   path: 'check-handle',
          //   name: 'check-handle',
          //   query: {
          //     dateBefore: dateBefore,
          //     dateAfter: dateAfter,
          //   },
          //   component: () => import('@/view/control-cost-mgt/check/check-handling.vue')
          // };
          // this.$router.push(route)
        } else if (value == 2) {
          const route = {
            path: 'violation-handling',
            name: 'violation-handling',
            query: {
              dateBefore: dateBefore,
              dateAfter: dateAfter,
            },
            component: () => import('@/view/control-cost-mgt/violation/violation-handling.vue')
          };
          this.$router.push(route)
        } else if (value == 3) {
          const route = {
            path: 'violation-monitor',
            name: 'violation-monitor',
            query: {
              dateBefore: dateBefore,
              dateAfter: dateAfter,
              crLevel: crLevel,
            },
            component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor.vue'),
          };
          this.$router.push(route)
        } else if (value == 4) {
          const route = {
            path: 'check-handle',
            name: 'check-handle',
            query: {
              dateBefore: dateBefore,
              dateAfter: dateAfter,
              auditState: auditState,
              auditMark: 1
            },
            component: () => import('@/view/control-cost-mgt/check/check-handling.vue')
          };
          this.$router.push(route)
        }
      },
      // slideChange: function (opts) {
      //   this.start = opts.startValue;
      //   this.end = opts.endValue;
      //   let sliderData = this.getData();
      //   this.foldType.data = sliderData.viewData;
      //   this.data = sliderData.viewData;
      // },
      //
      // getData() {
      //   const {start, end, sourceData} = this;
      //   const startTime = new Date(start).getTime();
      //   const endTime = new Date(end).getTime();
      //   const ds = new DataSet({
      //     state: {
      //       start,
      //       end,
      //     }
      //   });
      //   const viewData = ds.createView();
      //   viewData.source(sourceData).transform({
      //     type: 'fold',
      //     fields: ['警告', '审核', '禁止',],
      //     key: 'type',
      //     value: 'value',
      //   }).transform({
      //     type: 'filter',
      //     callback(obj) {
      //       const time = new Date(obj.time).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
      //       return time >= startTime && time <= endTime;
      //     }
      //   });
      //   return {viewData};
      // },
      //对数组根据日期进行排序
      sortDataArray(dataArray) {
        return dataArray.sort(function (a, b) {
          return Date.parse(a.time.replace(/-/g, "/")) - Date.parse(b.time.replace(/-/g, "/"));
        });
      }
    },
  };
</script>

