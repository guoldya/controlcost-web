<template>
  <div>
    <MonacoEditor
      height="300"
      language="sql"
      :code="code"
      :editorOptions="options"
      @mounted="onMounted"
      @codeChange="onCodeChange"
    >
    </MonacoEditor>
  </div>
</template>
<script>
  import MonacoEditor from 'vue-monaco-editor'
  export default {
    components: {
      MonacoEditor
    },
    data(){
      return{
        code: '// Type away! \n',
        options: {
          selectOnLineNumbers: false
        }
      }
    },
    mounted(){
        this.code = 'zhe shi ce shi '
    },
    methods:{
      onMounted:function (editor) {
        this.editor = editor;
      },
      onCodeChange:function (editor) {
        console.log(this.editor.getValue())
        this.code = this.editor.getValue()
      }
    }
  }
</script>
<style>
  .monaco-editor.vs-dark .line-numbers {
    color: #fff;
  }
</style>
