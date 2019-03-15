<template>
  <div >
    <div v-for="(op) in items">
      <Poptip
        trigger="hover"
        transfer>
        <div  slot="content">
          <Row class="row">
            <Col class="col" span="11">申请时间:</Col>
            <Col class="col" span="12">{{op.createBy}}</Col>
          </Row>
          <Row class="row">
            <Col class="col" span="11">审批时间:</Col>
            <Col class="col" span="12">{{op.auditBy}}</Col>
          </Row>
          <Row class="row">
            <Col class="col" span="11">审批人:</Col>
            <Col class="col" span="12">{{op.auditName}}</Col>
          </Row>
          </div>
        <span  :style="'color:'+op.color">{{op.handlingResult}}</span>,<span>{{op.text}}</span>
      </Poptip>
    </div>
  </div>
</template>
<script>
  export default {
    props:['items'],
  }
</script>

<style scoped>
  /*列样式*/
  /*列样式*/
  .row > .col:first-child {
    text-align: right;
  }

  .row > .col:nth-child(2n) {
    text-align: left;
  }
</style>
