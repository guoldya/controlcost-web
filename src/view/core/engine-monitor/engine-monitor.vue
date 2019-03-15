<style lang="less">
  @import "./engine-monitor.less";
</style>
<template>
  <div>

    <!--<Card dis-hover style="margin-bottom: 5px;">-->
      <!--<Row class="select">-->
        <!--<ul class="ulL">-->
          <!--<li class="start"   v-on:click=""><Icon></Icon>启动引擎</li>-->
          <!--<li class="close" v-on:click="">关闭引擎</li>-->
          <!--<li class="restart"  v-on:click="">重启引擎</li>-->
        <!--</ul>-->
      <!--</Row>-->
    <!--</Card>-->

    <Row :gutter="5">
      <i-col span="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
      <Col span="12" class="selectDate">
        <Card  dis-hover style="height: 120px;">
          <Row class="ulL">
            <Col span="8" class="start"   v-on:click=""><Icon type="md-ionitron" />启动引擎</Col>
            <Col span="8" class="start" v-on:click="">关闭引擎</Col>
            <Col span="8" class="start"  v-on:click="">重启引擎</Col>
          </Row>
        </Card>
      </Col>
    </Row>

    <Row  :gutter="5" style="padding-top: 5px;">
      <Col span="12">
        <Card dis-hover>
          <p slot="title">内存表调用趋势图</p>
          <v-chart :forceFit="true" :height="memoryFoldType.height" :data="memoryFoldType.data" :scale="memoryFoldType.scale" style="width: 98%">
            <v-tooltip />
            <v-axis />
            <v-legend />
            <v-line position="month*value" color="city" /></v-chart>
        </Card>
      </Col>
      <Col span="12">
        <Card dis-hover>
          <p slot="title">规则趋势图</p>
          <v-chart :forceFit="true" :height="roleFoldType.height" :data="roleFoldType.data" :scale="roleFoldType.scale" style="width: 98%">
            <v-tooltip />
            <v-axis />
            <v-legend />
            <v-line position="month*value" color="city" />
          </v-chart>
        </Card>
      </Col>
    </Row>

    <Row  :gutter="5" style="padding-top: 5px;">
      <Col span="12">
        <Card dis-hover style="overflow: hidden; zoom: 1; height: 450px;">
          <p slot="title">内存调用分析</p>
          <v-chart :forceFit="true" :height="memoryPieType.height" :data="memoryPieType.data" :scale="memoryPieType.scalePel" style="width: 75%;float:left;">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :vStyle="memoryPieType.pieStyle" :label="memoryPieType.labelConfig" />
            <v-coord type="theta"  />
          </v-chart>
          <ul  v-for="(item, index) in memoryPieListData" class="cell-per">
            <li v-if="index==0" class=""> {{item.itemBzCodeStr+'类'+item.ratio+' '+item.countNum+'次'}}</li>
          </ul>
        </Card>
      </Col>
      <Col span="12">
        <Card dis-hover style="overflow: hidden; zoom: 1; height: 450px;">
          <p slot="title">规则分析</p>
          <v-chart :forceFit="true" :height="rolePieType.height" :data="rolePieType.data" :scale="rolePieType.scalePel" style="width: 75%;float:left;">
            <v-tooltip :showTitle="false" dataKey="item*percent" />
            <v-axis />
            <v-legend dataKey="item" />
            <v-pie position="percent" color="item" :vStyle="rolePieType.pieStyle" :label="rolePieType.labelConfig" />
            <v-coord type="theta"  />
          </v-chart>
          <ul  v-for="(item, index) in rolePieListData" class="cell-per">
            <li v-if="index==0" class="">{{item.itemBzCodeStr+'类'+item.ratio+' '+item.countNum+'次'}}</li>
          </ul>
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

  export default {
    components: {
      InforCard,
      CountTo,
      CommonIcon,
    },
    name: "engine-monitor",
    data() {
      return {
        inforCardData: [
          {title: '数据源数量', icon: 'md-chatbubbles', count: 803, color: '#2d8cf0'},
          {title: '内存表数据量', icon: 'md-locate', count: 23432, color: '#19be6b'},
          {title: '规则数量', icon: 'md-help-circle', count: 142, color: '#ff9900'},
        ],
        memoryFoldType:{
          data:[],
          sourceData: [
            { month: 'Jan', Tokyo: 7.0, London: 3.9 },
            { month: 'Feb', Tokyo: 6.9, London: 4.2 },
            { month: 'Mar', Tokyo: 9.5, London: 5.7 },
            { month: 'Apr', Tokyo: 14.5, London: 8.5 },
            { month: 'May', Tokyo: 18.4, London: 11.9 },
            { month: 'Jun', Tokyo: 21.5, London: 15.2 },
            { month: 'Jul', Tokyo: 25.2, London: 17.0 },
            { month: 'Aug', Tokyo: 26.5, London: 16.6 },
            { month: 'Sep', Tokyo: 23.3, London: 14.2 },
            { month: 'Oct', Tokyo: 18.3, London: 10.3 },
            { month: 'Nov', Tokyo: 13.9, London: 6.6 },
            { month: 'Dec', Tokyo: 9.6, London: 4.8 },
          ],
          scale: [{
            dataKey: 'month',
            min: 0,
            max: 1,
          }],
          height: 300,
          style: { stroke: '#fff', lineWidth: 1 },
        },
        roleFoldType: {
          data:[],
          sourceData: [
            { month: 'Jan', Tokyo: 7.0, London: 3.9 },
            { month: 'Feb', Tokyo: 6.9, London: 4.2 },
            { month: 'Mar', Tokyo: 9.5, London: 5.7 },
            { month: 'Apr', Tokyo: 14.5, London: 8.5 },
            { month: 'May', Tokyo: 18.4, London: 11.9 },
            { month: 'Jun', Tokyo: 21.5, London: 15.2 },
            { month: 'Jul', Tokyo: 25.2, London: 17.0 },
            { month: 'Aug', Tokyo: 26.5, London: 16.6 },
            { month: 'Sep', Tokyo: 23.3, London: 14.2 },
            { month: 'Oct', Tokyo: 18.3, London: 10.3 },
            { month: 'Nov', Tokyo: 13.9, London: 6.6 },
            { month: 'Dec', Tokyo: 9.6, London: 4.8 },
          ],
          scale: [{
            tickCount: 12,
            dataKey: 'month',
            // min: 0,
            // max: 1,
          }],
          forceFit: true,
          height: 300,
          style: { stroke: '#fff', lineWidth: 1 },
        },


        memoryPieType:{
          data:[],
          perData: [
            { item: '事例一', count: 40 },
            { item: '事例二', count: 21 },
            { item: '事例三', count: 17 },
            { item: '事例四', count: 13 },
            { item: '事例五', count: 9 }
          ],
          scalePel : [{
            dataKey: 'percent',
            min: 0,
            formatter: '.0%',
          }],
          pieStyle: {
            stroke: "#fff",
            lineWidth: 1,
          },
          height: 380,
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
        rolePieType:{
          data:[],
          perData: [
            { item: '事例一', count: 40 },
            { item: '事例二', count: 21 },
            { item: '事例三', count: 17 },
            { item: '事例四', count: 13 },
            { item: '事例五', count: 9 }
          ],
          scalePel : [{
            dataKey: 'percent',
            min: 0,
            formatter: '.0%',
          }],
          pieStyle: {
            stroke: "#fff",
            lineWidth: 1,
          },
          height: 380,
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

        memoryPieListData: [
          {
            itemBzCode:1,
            itemBzCodeStr:2,
            ratio:1,
          }
        ],
        rolePieListData: [
          {
            itemBzCode:1,
            itemBzCodeStr:2,
            ratio:1,
          }
        ],

      }
    },
    mounted() {
      this.memoryFoldData();
      this.roleFoldData();
      this.memoryPieData();
      this.rolePieData();
    },
    methods:{
      memoryFoldData: function () {
        let dv = new DataSet.View().source(this.memoryFoldType.sourceData);
        dv.transform({
          type: 'fold',
          fields: ['Tokyo','London'],
          key: 'city',
          value: 'value',
        });
        this.memoryFoldType.data = dv.rows;
      },
      roleFoldData: function () {
        let dv = new DataSet.View().source(this.roleFoldType.sourceData);
        dv.transform({
          type: 'fold',
          fields: ['Tokyo', 'London',],
          key: 'city',
          value: 'value',
        });
        this.roleFoldType.data = dv.rows;
      },
      memoryPieData: function () {
        let dsv = new DataSet.View().source(this.memoryPieType.perData);
        dsv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent'
        });
        this.memoryPieType.data=dsv.rows;
      },
      rolePieData: function () {
        let dsv = new DataSet.View().source(this.rolePieType.perData);
        dsv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent'
        });
        this.rolePieType.data=dsv.rows;
      }

    }
  }
</script>


