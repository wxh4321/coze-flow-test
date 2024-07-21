<script lang="ts" setup>
import ModelTreeTextItem from '../basic/ModelTreeTextItem.vue';

const props:any = defineProps({
    /**
     * 数据结构
     * {
     *  title:'',
     *  label:'',
     *  children:[
     *   {
     *     title:'',
     *     label:'',
     *     children:null,
     *   }
     *  ]
     * }
     */
    data:{
        type:Object,
        default:{}
    },
    // s是否展示底部的线
    showBottomLine:{
        type:Boolean,
        default:true
    }
});
const root = props.data;

</script>
<template>
    <ModelTreeTextItem :data="root"/>
    <div class="model-tree-text-line" v-if="showBottomLine"></div>
</template>
<style lang="scss" scoped>
.model-tree-text-line{
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background-color: #fff;
}
</style>