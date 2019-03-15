<style scoped>
  @import "../../../../styles/common.less";
  /*行样式*/
  .row {
    border: 1px solid #ddd;
    border-right-style: none;
  }

  .row:not(:last-child) {
    border-bottom-style: none;
  }

  /*列样式*/
  .row > .col {
    border-right: 1px solid #ddd;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

  .row > .col:nth-child(2n) {
    text-align: left;
    padding-left: 5px;
  }

  /*标题文字*/
  p {
    font-weight: bold;
    font-size: 15px;
  }

  .row .font {
    font-weight: bold;
  }

  .back {
    margin: 0 auto;
    width: 56px;
    margin-top: 5px;
  }
</style>
<template>
  <div>
    <p style="font-size: 18px">
      <span>用药详情({{list.crLevel | control_rule}})</span>
    </p>
    <!--基本信息-->
    <div>
      <Card dis-hover style="margin-top: 5px">
        <Row>
          <Col span="2">
            <p class="margin-bottom-10" style="font-size: 18px">
              <Icon type="md-bookmark" size="19"/>
              基本信息
            </p>
          </Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">患者姓名</Col>
          <Col class="col" span="6">{{commonList.empiName}}</Col>
          <Col class="col" span="2">年龄</Col>
          <Col class="col" span="6">{{commonList.age}}</Col>
          <Col class="col" span="2">性别</Col>
          <Col class="col" span="6">{{commonList.gender | gender_if}}</Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">险种类別</Col>
          <Col class="col" span="6">{{list.insCls | his_type}}</Col>
          <Col class="col" span="2" v-if="list.bzType<=3">门诊号</Col>
          <Col class="col" span="14" v-if="list.bzType<=3">{{list.opNo}}</Col>
          <Col class="col" span="2" v-if="list.bzType>=4">住院号</Col>
          <Col class="col" span="14" v-if="list.bzType>=4">{{list.ipNo}}</Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">所属科室</Col>
          <Col class="col" span="6">{{list.deptName}}</Col>
          <Col class="col" span="2">诊断</Col>
          <Col class="col" span="6">{{list.dxName}}</Col>
          <Col class="col" v-if="list.bzType<=3" span="2">就诊时间</Col>
          <Col class="col" v-if="list.bzType<=3" span="6">{{list.dxTime | date_time}}</Col>
          <Col class="col" v-if="list.bzType>=4" span="2">入院时间</Col>
          <Col class="col" v-if="list.bzType>=4" span="6">{{list.visitTimeIn | date_time}}</Col>
        </Row>
      </Card>
    </div>

    <!--基本信息结束-->
    <div>
      <Card dis-hover style="margin-top: 5px">
        <Row >
          <Col  span="2">
            <p class="margin-bottom-10" style="font-size: 18px" v-if="list.crLevel == null">
              <Icon type="md-bookmark" size="19"/>
              项目详情
            </p>
            <p class="margin-bottom-10" style="font-size: 18px" v-if="list.crLevel < 4">
              <Icon type="md-bookmark" size="19"/>
              违规详情
            </p>
          </Col>
        </Row>
        <!--违规行-->
        <Row class="row">
          <Col class="col" span="2" v-if="list.crLevel < 4">违反规则:</Col>
          <Col class="col" span="6" v-if="list.crLevel < 4">{{list.crName}}</Col>
          <Col class="col" span="2">药品名称:</Col>
          <Col class="col font" span="14">
            <span style="margin-right: 24px">{{list.itemName}}</span>
            <!--<span v-if="$route.query.id">X{{list.num}}{{list.unit}}</span>-->
            <span >X{{list.num}}{{list.unit}}</span>
          </Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">项目编号</Col>
          <Col class="col" span="6">{{list.insCode}}</Col>
          <Col class="col" span="2">提醒金额</Col>
          <Col class="col" span="14">￥{{list.insFee}}</Col>
        </Row>
        <Row class="row" v-if="list.crLevel == 1">
          <Col class="col" span="2">开单医生</Col>
          <Col class="col" span="6">{{list.docName}}</Col>
          <Col class="col" span="2">开单时间</Col>
          <Col class="col" span="14">{{list.billingTime}}</Col>
        </Row>
        <Row class="row" v-if="list.crLevel == 2">
          <Col class="col" span="2">申请人</Col>
          <Col class="col" span="6">{{list.docName}}</Col>
          <Col class="col" span="2">申请时间</Col>
          <Col class="col" span="14">{{list.createBy | date_time}}</Col>
        </Row>
        <Row class="row" v-if="list.crLevel == 2">
          <Col class="col" span="2">申请理由</Col>
          <Col class="col" span="22">{{list.why}}</Col>
        </Row>
        <Row class="row" v-if="list.crLevel < 4">
          <Col class="col" span="2">医保办提示</Col>
          <Col class="col" span="22">{{list.crMessage}}</Col>
        </Row>
      </Card>
    </div>

    <!--控制状态：警告 处理-->
    <div v-if="list.crLevel == 1 && list.auditState >=2">
      <Card dis-hover style="margin-top: 5px">
        <Row class="row">
          <Col class="col" span="2">处理人</Col>
          <Col class="col" span="6">{{list.auditUserName}}</Col>
          <Col class="col" span="2">处理科室</Col>
          <Col class="col" span="6">{{list.auditDeptName}}</Col>
          <Col class="col" span="2">处理时间</Col>
          <Col class="col" span="6">{{list.auditBy}}</Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">处理结果</Col>
          <!--<Col class="col" span="6" v-show="!list.auditState">{{list.auditState | deal_results}}</Col>-->
          <Col class="col" style="color: orange" span="6" v-show="list.auditState == 1">{{list.auditState | deal_results}}</Col>
          <Col class="col" style="color: #52c41a; text-align: left;  padding-left: 5px;" span="6" v-show="list.auditState == 2">{{list.auditState |
            deal_results}}
          </Col>
          <Col class="col" style="color: #FF0000; text-align: left;  padding-left: 5px;" span="6" v-show="list.auditState == 3">{{list.auditState |
            deal_results}}
          </Col>
          <Col class="col" span="2">处理意见</Col>
          <Col class="col" span="14">{{list.auditOpinion}}</Col>
        </Row>
      </Card>
    </div>
    <!--控制状态：审核 处理-->
    <div v-show="list.crLevel == 2 && list.auditState >=2">
      <Card dis-hover style="margin-top: 5px">
        <Row class="row">
          <Col class="col" span="2">审批人</Col>
          <Col class="col" span="6">{{list.auditUserName}}</Col>
          <Col class="col" span="2">审批科室</Col>
          <Col class="col" span="6">{{list.auditDeptName}}</Col>
          <Col class="col" span="2">审批时间</Col>
          <Col class="col" span="6">{{list.auditBy}}</Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">审批结果</Col>
          <Col class="col" span="6" v-show="!list.auditState">{{list.auditState | deal_results}}</Col>
          <Col class="col" span="6" v-show="list.auditState == 1">{{list.auditState | deal_results}}</Col>
          <Col class="col" style="color: #52c41a; text-align: left;  padding-left: 5px;" span="6" v-if="list.auditState == 2">{{list.auditState |
            deal_results}}
          </Col>
          <Col class="col" style="color: #FF0000;text-align: left;  padding-left: 5px;" span="6" v-if="list.auditState == 3">{{list.auditState |
            deal_results}}
          </Col>
          <Col class="col" span="2">审批意见</Col>
          <Col class="col" span="14">{{list.auditOpinion}}</Col>
        </Row>
      </Card>
    </div>
    <Card dis-hover style="margin-top: 5px">
      <div class="back">
        <Button @click="detailFormCancel">返回</Button>
      </div>
    </Card>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {mapMutations} from 'vuex';
  let query_detail_url = 'sys/coreRuleExecute/selectMedicateById';
  export default {
    name: "patient-inquire-detail",
    data() {
      return {
        commonList: {},
        list: [],
        dtype: null,
      }
    },
    filters: {
      his_type: function (value) {
        if (value == "-1") {
          return "所有类型"
        } else if (value == "1") {
          return "医疗保险"
        } else if (value == "2") {
          return "工伤保险"
        } else if (value == "3") {
          return "生育保险"
        } else {
          return "未知"
        }
      },
      gender_if: function (value) {
        if (value == "1") {
          return "男"
        } else if (value == "2") {
          return "女"
        } else {
          return "未知"
        }
      },
      sourceType: function (value) {
        if (value == "1") {
          return "门诊"
        } else if (value == "2") {
          return "住院"
        } else if (value == "3") {
          return "全部"
        } else {
          return "未知"
        }
      },
      date_time: function (ms) {
        if(!ms){return;};
        let curTime = new Date(ms);
        let year = curTime.getFullYear();
        let month = curTime.getMonth() + 1;
        let day = curTime.getDate();
        let hours = curTime.getHours();
        let minutes = curTime.getMinutes();
        month = month <= 9 ? "0" + month : month;
        day = day <= 9 ? "0" + day : day;
        hours = hours <= 9 ? "0" + hours : hours;
        minutes = minutes <= 9 ? "0" + minutes : minutes;
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
      },
      deal_results: function (value) {

        if (value == "1") {
          return "未审核"
        } else if (value == "2") {
          return "通过"
        } else if (value == "3") {
          return "不通过"
        } else {
          return "未知"
        }
      },
      control_rule: function (value) {
        if (value == "1") {
          return "警告"
        } else if (value == "2") {
          return "审核"
        } else if (value == "3") {
          return "禁止"
        }  else {
          return "通过"
        }
      },
    },
    mounted() {
      this.excutData();
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      excutData: function () {
        let params = {};
        this.dtype = this.$route.query.dtype;
        // params.id = Number(this.$route.query.id);
        params.pid = this.$route.query.pid;
        this.$put(query_detail_url, params).then(res => {
          if (res.code == '200') {
            this.commonList = res.data;
            this.list = this.$route.query;
            // if (!this.$route.query.id){
            //   this.list.insCls = this.$route.query.insCls;
            //   this.list.itemName = this.$route.query.itemName;
            //   this.list.itemCode = this.$route.query.itemCode;
            //   this.list.spec  = this.$route.query.spec;
            // }
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      detailFormCancel: function () {
        this.closeTag({
          name: 'patient-inquire-detail',
          query: this.$route.query,
          // query: {
          //   // id: this.$route.query.id,
          //   dtype: this.$route.query.dtype,
          //   pid:this.$route.query.pid,
          //   // insCls:this.$route.query.insCls,
          //   // itemName:this.$route.query.itemName,
          //   // itemCode:this.$route.query.itemCode,
          //   // spec: this.$route.query.spec,
          // }
        });
        if (this.dtype == 2) {
          const route = {
            name: 'slow-patient-inquire',
            path: 'slow-patient-inquire',
            component: () => import('@/view/disease-mgt/slow-disease/slow-patient-inquire/slow-patient-inquire.vue')
          };
          this.$router.push(route)
        } else if (this.dtype == 1) {
          const route = {
            name: 'special-patient-inquire',
            path: 'special-patient-inquire',
            component: () => import('@/view/disease-mgt/special-disease/special-patient-inquire/special-patient-inquire.vue')
          };
          this.$router.push(route);
        }
      }
    },
  }
</script>

<style scoped>

</style>
