<script lang="ts" setup>
const testClick = () => {
    alert('end node');
}
</script>
<template>
    <div @click="testClick">end node</div>
</template>
<style>
div[data-id="20000"] div[data-handlepos="right"]{
   display: none;
}
</style>