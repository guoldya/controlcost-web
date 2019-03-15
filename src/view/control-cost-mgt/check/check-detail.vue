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
              <Col class="col" span="6">{{list.visitTime | date_time}}</Col>
              <Col class="col" span="2">险种类別</Col>
              <Col class="col" span="6">{{list.insCls | insHolderCls_if}}</Col>
            </Row>
            <Row class="row" v-if="this.ismenzhen==false">
              <Col class="col" span="2">所属科室</Col>
              <Col class="col" span="6" >{{list.ownDeptName}}</Col>
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
              <Col span="2" v-if="this.list.auditState==1">
                <p class="margin-bottom-10">
                  <Icon type="md-bookmark" size="19"/>
                  申请信息
                </p>
              </Col>
              <Col span="2" v-else>
                <p class="margin-bottom-10">
                  <Icon type="md-bookmark" size="19"/>
                  审核信息
                </p>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col font" span="2">违反规则</Col>
              <Col class="col font" span="6">{{list.crName}}</Col>
              <Col class="col font" span="2">项目名称</Col>
              <Col class="col font" span="14" v-if="list.itemName!=null&&list.unit!=null">
                <span style="margin-right: 24px">{{list.itemName}}</span>
                <span>X{{list.num}}{{list.unit}}</span>
              </Col>
              <Col class="col font" span="14"v-else></Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">ID</Col>
              <Col class="col" span="6">{{list.id}}</Col>
              <Col class="col" span="2">医保编码</Col>
              <Col class="col" span="6">{{list.itemCode}}</Col>
              <Col class="col" span="2">申请时间</Col>
              <Col class="col" span="6">{{list.createBy | date_time}}</Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">申请人</Col>
              <Col class="col" span="6">{{list.docName}}</Col>
              <Col class="col" span="2">申请科室</Col>
              <Col class="col" span="14" v-if="this.list.auditState==1">{{list.deptName}}</Col>
              <Col class="col" span="6" v-else>{{list.deptName}}</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1">审核时间</Col>
              <Col class="col" span="6" v-if="this.list.auditState!=1">{{list.auditBy | date_time}}</Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">提醒金额</Col>
              <Col class="col" span="6" v-if="list.insFee!=null">￥{{list.insFee|keepTwoNum}}</Col>
              <Col class="col" span="6" v-else></Col>
              <Col class="col" span="2">规则详细说明</Col>
              <Col class="col" span="14">{{list.crMessage}}</Col>
            </Row>
            <!--<Row class="row">-->
              <!--<Col class="col" span="2">申请事由</Col>-->
              <!--<Col class="col" span="22" v-if="this.list.auditState==1">{{list.why}}</Col>-->
              <!--<Col class="col" span="6" v-else>{{list.why}}</Col>-->
            <!--</Row>-->
            <Row class="row" v-if="this.list.auditState!=1">
              <Col class="col" span="2">审核结果</Col>
              <Col class="col color" span="6">{{list.auditState | handleResult_if}}</Col>
              <Col class="col" span="2" v-if="this.list.auditState!=1">审核人</Col>
              <Col class="col" span="14" v-if="this.list.auditState!=1">{{list.auditName}}</Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">申请事由</Col>
                <Col class="col" span="22">
                  <div style="width:100%;height:100%;overflow-y:auto;">
                  {{list.why}}
                  </div>
                </Col>
            </Row>
            <Row class="row" v-if="this.list.auditState!=1">
              <Col class="col" span="2">审核意见</Col>
              <Col class="col" span="22">
                <div style="width:100%;height:100%;overflow-y:auto;">
                  {{list.auditOpinion}}
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        <div v-if="this.list.auditState==1" class="margin-top-5">
          <Card>
            <Row>
              <Col span="2">
                <p class="margin-bottom-10">
                  <Icon type="md-bookmark" size="19"/>
                  提交处理
                </p>
              </Col>
            </Row>
            <Row class="row">
              <Col class="col" span="2">处理结果：</Col>
              <Col id="result-handle" span="22" class="col ">
                <RadioGroup v-model="isPass">
                  <Radio label="true">
                    <span>审核通过</span>
                  </Radio>
                  <Radio label="false">
                    <span>审核不通过</span>
                  </Radio>
                </RadioGroup>
              </Col>
            </Row>
            <Row class="row" style="border-right-style:solid;border-bottom: none">
              <Col class="margin-top-10 margin-bottom-10">
                <textarea name="contents"  placeholder="请输入申请理由不超过50个字" class="contents"
                          rows="4" maxlength="50" :focus="sizeControl()"  style="width:99.99%;padding: 10px" v-model="auditPpinion">

                </textarea>
                <span class="inputWord" style="float: right;padding-right: 5px">已输入字符: </span>
              </Col>
            </Row>
            <Row class="row" style="border-top-style: none">
              <Col class="col" style="">
                <Button @click="detailFormCancel" class="margin-right-10">取消</Button>
                <Button type="primary" :loading="modal.modal_loading" @click="formSubmit">保存</Button>
              </Col>
            </Row>
          </Card>
        </div>
        <div v-else class="margin-top-5 ">
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
        modal: {
          isNew: true,
          visible: false,
          modal_loading: false,
        },
      }
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
        console.log(this.$route.query);
        params.id = Number(this.$route.query.id);
        params.ocode = this.$route.query.ocode;
        if(this.$route.query.auditMark){
          params.auditMark = Number(this.$route.query.auditMark);
          data.auditMark = Number(this.$route.query.auditMark);
        }
        if (this.$route.query.dateBefore) {
          params.dateBefore = this.$route.query.dateBefore;
          params.dateAfter = this.$route.query.dateAfter;
          data.dateBefore = this.$route.query.dateBefore;
          data.dateAfter = this.$route.query.dateAfter;
        }
        if (this.$route.query.auditState) {
          data.auditState = this.$route.query.auditState;
          params.auditState = this.$route.query.auditState;
        }
        this.closeTag({
          name: 'check-detail',
          query:params,
        });
        const route = {
          query:data,
          name: 'check-handle',
          path: 'check-handle',
          component: () => import('@/view/control-cost-mgt/check/check-handling.vue')
        };
        this.$router.push(route)
      },
      formSubmit: function () {
        let state = 2;
        if (this.isPass == "false") {
          state = 3;
        }
        let data = {
          id: this.list.id,
          auditPpinion: this.auditPpinion,
          auditState: state,
        };
        this.$put(auditState_url, data).then(res => {
          if (res.code == '200') {
            this.success(res.msg);
            this.detailFormCancel();
          }
          else {
            //提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
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
            };
          } else {
            // 提示信息
            this.warn(res.msg);
          }
        }).catch(err => {
          this.error(err);
        });
      },
      sizeControl:function(){
        var max=50;
        var textArea=$.trim($(".contents").val()).length;
        if(textArea>max)
          $(".contents").val($(".contents").val().substr(0,max));
        else
          $(".inputWord").html("已输入："+textArea+"/"+max+" 字符")
      },
    }
  }
</script>


