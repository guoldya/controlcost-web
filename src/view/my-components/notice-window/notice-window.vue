<template>
  <Button type="primary" @click="renderFunc">Open notice</Button>
</template>

<script>
    export default {
        name: "notice-window",
      methods: {
        renderFunc () {
          this.$Notice.open({
            title: '这是头部',
            render: function (createElement) {
              return createElement('a','sdasdas',)
            }
          });
        }
      }
    }
</script>
