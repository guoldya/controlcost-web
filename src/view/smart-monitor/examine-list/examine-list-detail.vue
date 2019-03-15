<style scoped>
  @import "../../../styles/common.less";
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
  <div class="detailPage">
    <div class="detailTop">
      <Card dis-hover>
        <Row>
          <Col span="2">
            <p style="width: 100px;margin-bottom: 10px">
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
          <Col class="col" span="6">{{list.visitTime | date_time}}</Col>
          <Col class="col" span="2">险种类別</Col>
          <Col class="col" span="6">{{list.insHolderCls | insHolderCls_if}}</Col>
        </Row>
        <Row class="row" v-if="this.ismenzhen==false">
          <Col class="col" span="2">住院号</Col>
          <Col class="col" span="6">{{list.ipNo}}</Col>
          <Col class="col" span="2">入院诊断</Col>
          <Col span="6" class="col">
            <a style="color: #666666;" :title=list.dxNameIn>{{list.dxNameIn}}</a>
          </Col>
          <Col class="col" span="2">出院诊断</Col>
          <Col span="6" class="col">
            <a style="color: #666666;" :title=list.dxNameOut>{{list.dxNameOut}}</a>
          </Col>
        </Row>
        <Row class="row" v-if="this.ismenzhen==false">
          <Col class="col" span="2">入院时间</Col>
          <Col class="col" span="6">{{list.inDate | date_time}}</Col>
          <Col class="col" span="2">主治医师</Col>
          <Col class="col" span="6">{{list.diagName}}</Col>
          <Col class="col" span="2">住院次数</Col>
          <Col class="col" span="6">{{list.opTime}}</Col>
        </Row>
        <Row class="row" v-if="this.ismenzhen==false">
          <Col class="col" span="2">出院时间</Col>
          <Col class="col" span="6">{{list.outDate | date_time}}</Col>
          <Col class="col" span="2">住院天数</Col>
          <Col class="col" span="14">{{list.opDays}}</Col>
        </Row>
      </Card>
    </div>
    <div style="margin-top: 5px" class="detailBottom">
      <Card dis-hover>
        <Row>
          <Col span="2">
            <p style="width: 100px;margin-bottom: 10px">
              <Icon type="md-bookmark" size="19"/>
              申请信息
            </p>
          </Col>
        </Row>
        <Row class="row">
          <Col class="col font" span="2">违反规则</Col>
          <Col span="6" class="col font">
            <a style="color: #666666;" :title=list.crName>{{list.crName}}</a>
          </Col>
          <Col class="col font" span="2">项目名称</Col>
          <Col class="col font" span="14">
            <span style="margin-right: 24px">{{list.itemName}}</span>
            <span>X{{list.num}}{{list.unit}}</span>
          </Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">项目编码</Col>
          <Col class="col" span="6">{{list.itemCode}}</Col>
          <Col class="col" span="2">提醒金额</Col>
          <Col class="col" span="6" v-if="list.crLevel!=3">￥{{list.insFee|keepTwoNum}}</Col>
          <Col class="col" span="14" v-else>￥{{list.insFee |keepTwoNum}}</Col>
          <Col class="col" span="2" v-if="list.crLevel!=3">申请时间</Col>
          <Col class="col" span="6" v-if="list.crLevel!=3">{{list.createBy | date_time}}</Col>
        </Row>
        <Row class="row" v-if="list.crLevel!=3">
          <Col class="col" span="2">申请理由</Col>
          <Col span="22" class="col">
            <a style="color: #666666;" :title=list.why>{{list.why}}</a>
          </Col>
        </Row>
        <Row class="row">
          <Col class="col" span="2">医保办提示</Col>
          <Col span="22" class="col">
            <a style="color: #666666;" :title=list.crMessage>{{list.crMessage}}</a>
          </Col>
        </Row>
        <Row class="row"  v-if="this.list.auditState==1">
          <Col class="col" span="2">审批状态</Col>
          <Col v-if="list.auditState==1" class="col " span="22" style="color: red" >{{list.auditState | handleResult_if}}</Col>
        </Row>
        <Row class="row"  v-if="this.list.auditState!=1 && this.list.crLevel==2">
          <Col class="col" span="2">审核人</Col>
          <Col class="col" span="6">{{list.auditName}}</Col>
          <Col class="col" span="2">审核科室</Col>
          <Col class="col" span="6">{{list.deptName}}</Col>
          <Col class="col" span="2">审核时间</Col>
          <Col class="col" span="6">{{list.auditBy | date_time}}</Col>
        </Row>
        <Row class="row" v-if="this.list.auditState!=1&& this.list.crLevel==2">
          <Col class="col" span="2">审核结果</Col>
          <Col v-if="list.auditState==2" class="col " span="22" style="color:green" >{{list.auditState | handleResult_if}}</Col>
          <Col v-if="list.auditState==3" class="col " span="22" style="color: red" >{{list.auditState | handleResult_if}}</Col>

        </Row>
        <Row class="row"  v-if="this.list.auditState!=1&& this.list.crLevel==1">
          <Col class="col" span="2">处理人</Col>
          <Col class="col" span="6">{{list.auditName}}</Col>
          <Col class="col" span="2">处理科室</Col>
          <Col class="col" span="6">{{list.deptName}}</Col>
          <Col class="col" span="2">处理时间</Col>
          <Col class="col" span="6">{{list.auditBy | date_time}}</Col>
        </Row>
        <Row class="row" v-if="this.list.auditState!=1&& this.list.crLevel==1">
          <Col class="col" span="2">处理结果</Col>
          <Col v-if="this.list.auditState==2" class="col " span="22" style="color:green" >{{list.auditState | handleResult_if}}</Col>
          <Col v-else class="col " span="22" style="color: red" >{{list.auditState | handleResult_if}}</Col>
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
    <div class="back">
      <Button @click="detailFormCancel">返回</Button>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'

  let auditState_url = 'sys/coreRuleExecute/updateAuditState';
  let window_check_url='sys/coreRuleExecute/selectMedicateById';
  export default {
    data() {
      return {
        isLoadData: true,
        searchForm: {},
        searchFormData: {},
        isPass: "true",
        result: '审核通过',
        list: {},
        ismenzhen: true,
        iszhuyuan: true,
        auditPpinion: "",
        genAndAge:{},
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
        }
      },
      handleResult_if:function(value){
        if(!value){return;};
        if(value=="1"){
          $(".color").css("color","#00A854");
          return "未审核"
        }else
        if(value=="2"){
          $(".color").css("color","#00A854");
          return "通过"
        }else if(value=="3"){
          $(".color").css("color","red");
          return "不通过"
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
      detailFormCancel:function(){
        this.closeTag({
          name: 'examine-list-detail',
          query: {
            id: this.$route.query.id,
          }
        });
        const route = {
          name: 'examine-list',
          path: 'examine-list',
          component: () => import('@/view/smart-monitor/examine-list/examine-list.vue')
        };
        this.$router.push(route)
      },
      excutData: function () {
        let params = {};
        params.id = Number(this.$route.query.id);
        params.ocode = this.$route.query.ocode;
        this.$put(window_check_url, params).then(res => {
          if (res.code == '200') {
            this.list=res.data;
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


