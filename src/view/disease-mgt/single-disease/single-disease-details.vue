<style scoped>
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
  }
</style>

<template>
  <div>
    <Row>
      <Col>
        <div>
          <Card dis-hover>
            <Row>
              <Col span="2">
                <p class="margin-bottom-10">
                  <Icon type="md-bookmark" size="19"/>
                  基本信息
                </p>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">患者姓名</Col>
              <Col class="col" span="6">{{list.empiName}}</Col>
              <Col class="col" span="2">性别</Col>
              <Col class="col" span="6">{{list.gender | gender_if}}</Col>
              <Col class="col" span="2">年龄</Col>
              <Col class="col" span="6">{{list.age}}</Col>
            </Row>
            <Row class="row" v-if="this.iszhuyuan==false">
              <Col class="col" span="2">所属科室</Col>
              <Col class="col" span="6">{{list.ownDeptName}}</Col>
              <Col class="col" span="2">门诊号</Col>
              <Col class="col" span="6">{{list.opNo}}</Col>
              <Col class="col" span="2">门诊医生</Col>
              <Col class="col" span="6">{{list.diagName}}</Col>
            </Row>
            <Row class="row" v-if="this.iszhuyuan==false">
              <Col class="col" span="2">门诊诊断</Col>
              <Col class="col" span="6">{{list.dxName}}</Col>
              <Col class="col" span="2">就诊时间</Col>
              <Col class="col" span="6">{{list.visitTime}}</Col>
              <Col class="col" span="2">险种类別</Col>
              <Col class="col" span="6">{{list.insCls | insHolderCls_if}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">所属科室</Col>
              <Col class="col" span="6">{{list.ownDeptName}}</Col>
              <Col class="col" span="2">住院号</Col>
              <Col class="col" span="6">{{list.ipNo}}</Col>
              <Col class="col" span="2">入院诊断</Col>
              <Col class="col" span="6">{{list.dxNameIn}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">出院诊断</Col>
              <Col class="col" span="6">{{list.dxNameOut}}</Col>
              <Col class="col" span="2">入院时间</Col>
              <Col class="col" span="6">{{list.visitTimeIn | date_time}}</Col>
              <Col class="col" span="2">主治医师</Col>
              <Col class="col" span="6">{{list.diagName}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">住院次数</Col>
              <Col class="col" span="6">{{list.inCount}}</Col>
              <Col class="col" span="2">出院时间</Col>
              <Col class="col" span="6">{{list.visitTimeOut | date_time}}</Col>
              <Col class="col" span="2">住院天数</Col>
              <Col class="col" span="6">{{list.opDays}}</Col>
            </Row>
          </Card>
        </div>
        <div class="margin-top-5">
          <Card dis-hover>
            <Row>
              <Col span="2">
                <p class="margin-bottom-10">
                  <Icon type="md-bookmark" size="19"/>
                  违规信息
                </p>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col font" span="2">违反规则</Col>
              <Col class="col font" span="6">{{list.crName}}</Col>
              <Col class="col font" span="2">项目名称</Col>
              <Col class="col font" span="14">
                <span style="margin-right: 24px">{{list.itemName}}</span>
                <span>X{{list.num}}{{list.unit}}</span>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">编码</Col>
              <Col class="col" span="6">{{list.id}}</Col>
              <Col class="col" span="2">医保编码</Col>
              <Col class="col" span="6">{{list.itemCode}}</Col>
              <Col class="col" span="2">申请时间</Col>
              <Col class="col" span="6">{{list.createBy | date_time}}</Col>
            </Row>
            <Row class="row" v-if="this.list.crLevel==2">
              <Col class="col" span="2">申请人</Col>
              <Col class="col" span="6">{{list.docName}}</Col>
              <Col class="col" span="2">申请科室</Col>
              <Col class="col" span="6">{{list.deptName}}</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1">审核时间</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.auditBy | date_time}}</Col>
            </Row>
            <Row class="row" v-else>
              <Col class="col" span="2">开单人</Col>
              <Col class="col" span="6">{{list.docName}}</Col>
              <Col class="col" span="2">开单科室</Col>
              <Col class="col" span="6">{{list.deptName}}</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1">处理时间</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.auditBy | date_time}}</Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">提醒金额</Col>
              <Col class="col" span="6">￥{{list.insFee|keepTwoNum}}</Col>
              <Col class="col" span="2">规则详细说明</Col>
              <Col class="col" span="14">{{list.crMessage}}</Col>
            </Row>
            <Row class="row" v-if="this.list.auditState!=1 && this.list.crLevel==2">
              <Col class="col" span="2">审核人</Col>
              <Col class="col" span="6">{{list.auditName}}</Col>
              <Col class="col" span="2">审核结果</Col>
              <Col class="col color" span="14">{{list.auditState | handleResult_if}}</Col>
            </Row>
            <Row class="row" v-if="this.list.auditState==3">
              <Col class="col" span="2">处理人</Col>
              <Col class="col" span="6">{{list.auditName}}</Col>
              <Col class="col" span="2">处理结果</Col>
              <Col class="col color" span="14">{{list.auditState | handleResult_if}}</Col>
            </Row>
            <Row class="row" v-if="this.list.crLevel==2">
              <Col class="col" span="2">申请事由</Col>
              <Col class="col" span="22">{{list.why}}
                <div style="width:100%;height:100%;overflow-y:auto;">
                  {{list.why}}
                </div>
              </Col>
            </Row>
            <Row class="row" v-if="this.list.auditState!=1 && this.list.crLevel==2">
              <Col class="col" span="2">审核意见</Col>
              <Col class="col" span="22">
                <div style="width:100%;height:100%;overflow-y:auto;">
                  {{list.auditOpinion}}
                </div>
              </Col>
            </Row>
            <Row class="row" v-if="this.list.auditState!=1 && this.list.crLevel==1">
              <Col class="col" span="2">处理意见</Col>
              <Col class="col" span="22">
                <div style="width:100%;height:100%;overflow-y:auto;">
                  {{list.auditOpinion}}
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        <div class="margin-top-5 ">
          <Card dis-hover>
            <div style="width: 56px;margin: 0 auto;">
              <Button @click="detailFormCancel">返回</Button>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {mapMutations} from 'vuex';

  let auditState_url = 'sys/coreRuleExecute/updateAuditState';
  let window_violatio_url = 'sys/coreRuleExecute/selectMedicateById';
  export default {
    data() {
      return {
        ids: null,
        ocode: "",
        itemName: "",
        isLoadData: true,
        isPass: "true",
        result: '审核通过',
        list: {},
        ismenzhen: true,
        iszhuyuan: true,
        auditPpinion: "",
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
      }
    },
    filters: {
      keepTwoNum:function(value){
        if(value){
          value=Number(value);
          return value.toFixed(2)
        }
      },
      gender_if: function (value) {
        if(!value){return;};
        if (value == "1") {
          return "男"
        } else if (value == "2") {
          return "女"
        } else {
          return "未知"
        }
      },
      //  险种类別
      insHolderCls_if: function (value) {
        if(!value){return;};
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
      handleResult_if: function (value) {
        if(!value){return;};
        if (value == "2") {
          $(".color").css("color", "#00A854");
          return "通过"
        } else if (value == "3") {
          $(".color").css("color", "red");
          return "不通过"
        }
      },
      date_time: function (ms) {
        if (!ms) {
          return
        }
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
    },
    mounted() {
      if ($.trim(this.$route.query.id).length > 0) {
        this.excutData();
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      detailFormCancel: function () {
        let params = {};
        let data = {};
        if (this.$route.query.cbsId) {
          params.cbsId = Number(this.$route.query.cbsId);
          data.cbsId = Number(this.$route.query.cbsId)
        }
        if (this.$route.query.dateStart) {
          params.dateStart = this.$route.query.dateStart;
          params.dateEnd = this.$route.query.dateEnd;

          data.dateStart = this.$route.query.dateStart;
          data.dateEnd = this.$route.query.dateEnd;
        }
        if (this.$route.query.diseaseName){
          params.diseaseName=this.$route.query.diseaseName;
          data.diseaseName=this.$route.query.diseaseName
        }
        if (this.$route.query.outCode) {
          params.outCode = this.$route.query.outCode;
          data.outCode = this.$route.query.outCode
        }
        params.id = Number( this.$route.query.id);
        params.ocode = this.$route.query.ocode;
        this.closeTag({
          name: 'single-disease-details',
          query: params
        });
        const route = {
          query:data,
          name: 'single-disease-list',
          path: 'single-disease-list',
          component: () => import('@/view/disease-mgt/single-disease/single-disease-list.vue')
        };
        this.$router.push(route)
      },
      excutData: function () {
        this.ids = this.$route.query.id;
        this.ocode = this.$route.query.ocode;
        let params = {};
        params.id = Number(this.ids);
        params.ocode = this.ocode;
        this.$put(window_violatio_url, params).then(res => {
          if (res.code == '200') {
            this.list = res.data;
            if (this.list.bzType <= 3) {
              this.ismenzhen = true;
              this.iszhuyuan = false
            } else {
              this.ismenzhen = false;
              this.iszhuyuan = true
            }
            if (this.list.auditState == 2) {
              this.isPass = true
            } else if (this.list.auditState == 3) {
              this.isPass = false
            }
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
    }
  }
</script>


