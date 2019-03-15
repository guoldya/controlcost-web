<template>
  <div>
    <Card dis-hover>
      <Row>
        <div id="form"></div>
      </Row>
    </Card>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Editor from './editor'
  export default {
    data(){
      return{
        form:{},
        formData:{},
      }
    },
    mounted(){
      this.form = $("#form").dxForm({
        formData:this.formData,
        items:[
          {
            template:this.addEditor
          }
        ]
      }).dxForm('instance')
    },
    methods:{
      //上传图片
      addEditor: function (data, itemElement) {
        itemElement.append("<div id='addImage'/>")
        let FileUpload = new Vue(Editor);
        FileUpload.$parent = this;
        FileUpload.$mount('#addImage');
      },
    }
  }
</script>
