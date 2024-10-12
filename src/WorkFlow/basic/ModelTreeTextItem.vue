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
    // 是否默认打开所有树节点
    openAll:{
        type:Boolean,
        default:false
    },
});
const root = props.data;
const openCard = ref(props.openAll);

const openOrCloseCard = () => {
    openCard.value = !openCard.value;
}
</script>
<template>
    <div class="model-tree-text-wrapper" v-if="root">
        <div class="m-t-t-father">
            <el-button class="m-t-t-icon" 
            v-if="root.children && root.children.length"
            :class="[openCard?'m-t-t-is-active':'']"
            @click="openOrCloseCard" 
            >
                <IconRightArrow />
            </el-button>
            <span class="m-t-t-title">{{root.title}}</span>
            <span class="m-t-t-label">{{root.label}}</span>
        </div>
        <div class="m-t-t-child" v-for="(child,i) in root.children"
        :key="i+'key'"
        v-if="root.children && openCard"
        >
            <div class="m-t-t-line">
                <div class="m-t-t-line-full-child">
                    <div class="m-t-t-line-full-child-line"></div>
                    <div class="m-t-t-line-full-child-bottom-line"
                    v-if="i!==root.children.length-1"
                    ></div>
                </div>
            </div>
            <div class="m-t-t-right">
                <ModelTreeTextItem :data="child"/>
            </div>
        </div>

    </div>
</template>
<style lang="scss" scoped>
.model-tree-text-wrapper{
    display: flex;
    flex-direction: column;
}
.m-t-t-is-active {
    transform: rotate(90deg);
}
.m-t-t-father{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.m-t-t-icon{
    cursor: pointer !important;
    color: rgba(6, 7, 9);
    fill:rgba(6, 7, 9);
    font-weight: 600;
    padding: 4px!important;
    height: 22px;
    font-size: 10px;
    margin-right: -2px;
    border-color: transparent;
    background-color: transparent;
}
.m-t-t-title{
    color: rgba(28, 31, 35, .8);
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    word-break: keep-all;
}
.m-t-t-label{
    margin-left: 8px;
    padding: 2px 8px;
    background-color: rgba(6,7,9,0.04);
    border-radius: 6px;
    color:rgba(6,7,9,0.8);
    font-size: 12px;
    height: 22px;
    line-height: 16px;
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
}
.m-t-t-child{
    padding-left: 28px;
    display: flex;
    cursor: pointer;
}
.m-t-t-line{
    align-self: stretch;
    display: flex;
    width: 20px;
    &-full-child{
        flex: 1 1;
        height: 100%;
        position: relative;
        width: 100%;
        &-line{
            border-bottom: 1px solid #c6c6cd;
            border-left: 1px solid #c6c6cd;
            border-radius: 0 0 0 4px;
            height: 26px;
            left: 0;
            position: absolute;
            top: 0;
            transform: translateY(-4px);
            width: 100%;
            z-index: 20;
        }
        &-bottom-line{
            background: #c6c6cd;
            height: calc(100% - 19px);
            left: 0;
            position: absolute;
            top: 19px;
            width: 0.8px;
            z-index: 10;
        }
    }
}
.m-t-t-right{
    margin-top: 10px;
    margin-left: 8px;
}
</style>