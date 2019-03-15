<template>
  <div style="font-size:16px;">
    <Button v-for="op in items" :size="op.size | sizeFilters" :key="op.id" :type=op.type @click=op.click(op.extra)
            :disabled="!op.enabled" :style="op.style">{{op.text}}
    </Button>
  </div>
</template>

<script>
  export default {
    props: ['items'],
    name: "command-btns",
    filters: {
      sizeFilters: function (value) {
        if ($.trim(value).length<1)
         return 'small';
        else
          return value;
      }
    }
  }
</script>

<style scoped>
  button:not(:first-child) {
    margin-left: 3px;
  }
</style>
