<style scoped>
  @import "../../../styles/common.less";
  /*行样式*/
  .row{
    border:1px solid #ddd;
    border-right-style:none;
  }
  .row:not(:last-child){
    border-bottom-style:none;
  }
  /*列样式*/
  .row>.col{
    border-right:1px solid #ddd ;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .row>.col:nth-child(2n){
    text-align: left;
    padding-left: 5px;
  }
  /*标题文字*/
  p{
    font-weight: bold;
    font-size:15px;
  }
  .row .font{
    font-weight: bold;
  }
  .back{
    margin: 0 auto;
    width: 56px;
    margin-top: 5px;
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
                <p class="margin-bottom-10"><Icon type="md-bookmark" size="19" />基本信息</p>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">患者姓名</Col>
              <Col class="col" span="6" >{{list.empiName}}</Col>
              <Col class="col" span="2">性别</Col>
              <Col class="col" span="6">{{list.gender | gender_if}}</Col>
              <Col class="col" span="2">年龄</Col>
              <Col class="col" span="6">{{list.age}}</Col>
            </Row>
            <Row class="row" v-if="this.iszhuyuan==false">
              <Col class="col" span="2">所属科室</Col>
              <Col class="col" span="6" >{{list.ownDeptName}}</Col>
              <Col class="col" span="2">门诊号</Col>
              <Col class="col" span="6">{{list.opNo}}</Col>
              <Col class="col" span="2">门诊医生</Col>
              <Col class="col" span="6">{{list.diagName}}</Col>
            </Row>
            <Row class="row" v-if="this.iszhuyuan==false">
              <Col class="col" span="2">门诊诊断</Col>
              <Col class="col" span="6" >{{list.dxName}}</Col>
              <Col class="col" span="2">就诊时间</Col>
              <Col class="col" span="6">{{list.visitTime | date_time}}</Col>
              <Col class="col" span="2">险种类別</Col>
              <Col class="col" span="6">{{list.insCls | insHolderCls_if}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">住院号</Col>
              <Col class="col" span="6" >{{list.ipNo}}</Col>
              <Col class="col" span="2">入院诊断</Col>
              <Col class="col" span="6">{{list.dxNameIn}}</Col>
              <Col class="col" span="2">出院诊断</Col>
              <Col class="col" span="6">{{list.dxNameOut}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">入院时间</Col>
              <Col class="col" span="6" >{{list.visitTimeIn | date_time}}</Col>
              <Col class="col" span="2">主治医师</Col>
              <Col class="col" span="6">{{list.diagName}}</Col>
              <Col class="col" span="2">住院次数</Col>
              <Col class="col" span="6">{{list.inCount}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">出院时间</Col>
              <Col class="col" span="6" >{{list.visitTimeOut | date_time}}</Col>
              <Col class="col" span="2">住院天数</Col>
              <Col class="col" span="14">{{list.opDays}}</Col>
            </Row>
          </Card>
        </div>
        <div class="margin-top-5">
          <Card dis-hover>
            <Row>
              <Col span="2">
                <p  class="margin-bottom-10"><Icon type="md-bookmark" size="19"/>违规信息</p>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col font" span="2">违反规则</Col>
              <Col class="col font" span="6" >{{list.crName}}</Col>
              <Col class="col font" span="2">项目名称</Col>
              <Col class="col font" span="14" v-if="list.itemName!=null&&list.unit!=null">
                <span style="margin-right: 24px">{{list.itemName}}</span>
                <span>X{{list.num}}{{list.unit}}</span>
              </Col>
              <Col class="col font" span="14"v-else></Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">ID</Col>
              <Col class="col" span="6" >{{list.id}}</Col>
              <Col class="col" span="2">医保编码</Col>
              <Col class="col" span="6">{{list.itemCode}}</Col>
              <Col class="col" span="2">申请时间</Col>
              <Col class="col" span="6">{{list.createBy | date_time}}</Col>
            </Row>
            <!--审核未通过-->
            <Row class="row"   v-if="this.list.crLevel==2">
              <Col class="col" span="2">申请人</Col>
              <Col class="col" span="6" >{{list.docName}}</Col>
              <Col class="col" span="2">申请科室</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.deptName}}</Col>
              <Col class="col" span="14" v-else>{{list.deptName}}</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1">审核时间</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.auditBy | date_time}}</Col>
            </Row>
            <Row class="row"  v-else>
              <Col class="col" span="2">开单人</Col>
              <Col class="col" span="6" >{{list.docName}}</Col>
              <Col class="col" span="2">开单科室</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.deptName}}</Col>
              <Col class="col" span="14" v-else>{{list.deptName}}</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1">处理时间</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.auditBy | date_time}}</Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">提醒金额</Col>
              <Col class="col" span="6" v-if="list.insFee!=null">￥{{list.insFee|keepTwoNum}}</Col>
              <Col class="col" span="6" v-else></Col>
              <Col class="col" span="2">规则详细说明</Col>
              <Col class="col" span="14">{{list.crMessage}}</Col>
            </Row>
            <!--审核未通过-->
            <Row class="row" v-if="this.list.auditState!=1">
              <Col class="col" span="2" v-if="this.list.auditState!=1 && this.list.crLevel==2">审核人</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1&& this.list.crLevel==1">处理人</Col>
              <Col class="col" span="6" >{{list.auditName}}</Col>
              <Col class="col" span="2"  v-if="this.list.auditState!=1 && this.list.crLevel==2">审核结果</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1&& this.list.crLevel==1">处理结果</Col>
              <Col class="col" span="14" v-if="list.auditState==2" style="color:#00A854">{{list.auditState | handleResult_if}}</Col>
              <Col class="col" span="14" v-if="list.auditState==3" style="color:red">{{list.auditState | handleResult_if}}</Col>
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
              <Button  @click="detailFormCancel">返回</Button>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { mapMutations } from 'vuex';
  let window_violatio_url='sys/coreRuleExecute/selectMedicateById';
  export default {
    data() {
      return {
        itemName:"",
        isLoadData: true,
        isPass: "true",
        result: '审核通过',
        list:{},
        ismenzhen:true,
        iszhuyuan:true,
        auditPpinion:"",
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
      }
    },
    mounted(){
      if($.trim(this.$route.query.id).length>0) {
        this.excutData();
      }
    },
    methods:{
      ...mapMutations([
        'closeTag'
      ]),
      detailFormCancel:function(){
        let params = {};
        let data = {};
        params.id = this.$route.query.id;
        params.ocode = this.$route.query.ocode;
        if (this.$route.query.dateBefore){
          params.dateBefore = this.$route.query.dateBefore;
          params.dateAfter = this.$route.query.dateAfter;
          params.crLevel = this.$route.query.crLevel;
          data.dateBefore = this.$route.query.dateBefore;
          data.dateAfter = this.$route.query.dateAfter;
          data.crLevel = this.$route.query.crLevel;
        }
        if (this.$route.query.dateStart){
          params.dateStart = this.$route.query.dateStart;
          params.dateEnd = this.$route.query.dateEnd;
          params.crLevel = this.$route.query.crLevel;
          params.violated = this.$route.query.violated;
          data.dateStart = this.$route.query.dateStart;
          data.dateEnd = this.$route.query.dateEnd;
          data.crLevel = this.$route.query.crLevel;
          data.violated = this.$route.query.violated;
        }
        this.closeTag({
          name: 'violation-monitor-detail',
          query: this.$route.query,
        });
        const route = {
          query: this.$route.query,
          name: 'violation-monitor',
          path: 'violation-monitor',
          component: () => import('@/view/control-cost-mgt/violation-monitor/violation-monitor.vue')
        };
        this.$router.push(route)
      },
      excutData:function(){
        let params = {};
        params.id = Number(this.$route.query.id);
        params.ocode = this.$route.query.ocode;
        this.$put(window_violatio_url, params).then(res => {
          if (res.code == '200') {
            this.list=res.data;
            if(this.list.bzType<=3){
              this.ismenzhen=true;
              this.iszhuyuan=false
            }else{
              this.ismenzhen=false;
              this.iszhuyuan=true
            }
            if(this.list.auditState==2){
              this.isPass=true
            }else if(this.list.auditState==3){
              this.isPass=false
            };
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


