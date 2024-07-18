<script lang="ts" setup>
import RightIcon from '../icons/RightIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import ExportIcon from '../icons/ExportIcon.vue'
import ParamsItem1 from '../basic/ParamsItem1.vue'
import { toopTipText, toopTipText1 } from '../data/tooltips'
import { startNodeParams } from '../data/node-params'
import { inputParam, selectParam, textareaParam,checkBoxParam,deleteIconParam } from '../data/node-params-template'


const openCard = ref(true);
const openCollapse:any = ref({});
const openCollapseArr:any = ref([]);
const paramsData = ref(startNodeParams);
const collapseArr = ['input'];
const openAll = () => {
    collapseArr.forEach(key=>{
        openCollapse.value[key] = true;
    });
    openCollapseArr.value = collapseArr;
}
const openOrCloseCard = () => {
    openCard.value = !openCard.value;
    if(openCard.value){
        openAll();
    }
}

const collapseChange = (arr:any) => {
    openCollapse.value ={};
    if(arr.length>0){
        arr.forEach((key:string)=>{
            openCollapse.value[key] = true;
        });
    }
}
const exportJSONData = () => {
    console.log('exportJSONData');

}
// 新增一条输入框
const addItem = () => {
    const newItemArr = [
        {
            ...inputParam,
            placeholder:'输入变量名',
        },
        {
            ...selectParam,
        },
        {
            ...textareaParam,
            placeholder:'请描述变量的用途',

        },
        {
            ...checkBoxParam,
        },
        {
            ...deleteIconParam,
        },
    ];
    const id = paramsData.value.length===0?1:(paramsData.value[paramsData.value.length - 1].id+1);
    paramsData.value.push({
        id,
        list: newItemArr
    });
}
onMounted(()=>{
    openAll();
});
</script>
<template>
    <div class="start-node-wrapper">
        <div :class="[openCard?'start-node-header':'']">
            <div class="start-node-title">
                <el-button class="s-n-t-icon" 
                :class="[openCard?'s-n-is-active':'']"
                :icon="RightIcon"
                @click="openOrCloseCard" 
                />
                <img src="../images/icon-start.png" alt="s-n-t-start-icon" class="s-n-t-start-icon" />
                <span class="s-n-t-text">开始</span>
            </div>
            <div class="start-node-subtitle" v-if="openCard">
                <span>工作流的起始节点，用于设定启动工作流需要的信息</span>
            </div>
        </div>
        
        <div class="start-node-content" v-if="openCard">
            <el-collapse @change="collapseChange"
            v-model="openCollapseArr"
            >
                <el-collapse-item name="input">
                    <template #title>
                        <el-button class="s-n-collapse-icon" 
                        :class="[openCollapse['input']?'s-n-is-active':'']"
                        :icon="RightIcon"
                        />
                        <span class="s-n-c-text">输入</span>
                        <el-tooltip
                            :offset="12"
                            class="tooltip-box-item"
                            effect="dark"
                            :content="toopTipText"
                            placement="top"
                        >
                            <el-icon class="s-n-c-header-icon">
                                <NoticeIcon />
                            </el-icon>
                        </el-tooltip>
                        <div class="s-n-c-right">
                            <el-tooltip
                            :offset="12"
                            class="tooltip-box-item"
                            effect="dark"
                            :content="toopTipText1"
                            placement="top"
                            >
                                <el-button class="s-n-c-icon" 
                                :icon="ExportIcon"
                                @click="exportJSONData" 
                                />
                            </el-tooltip>
                        </div>
                        
                        
                    </template>
                    <div>
                        <ParamsItem1 :data="paramsData"
                        @addItem="addItem"
                        />
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.start-node-wrapper{
    width: 100%; 
}
.start-node-header{
    margin-bottom: 16px;
}
.start-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.start-node-subtitle{
    color: rgba(28, 29, 35, .6);
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: left;
}
.start-node-content{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    position: relative;
    width: 100%;
    :deep(.el-collapse){
        border-top: none;
        border-bottom: none;
    }
    :deep(.el-collapse-item__arrow){
        display: none;
    }
    :deep(.el-collapse-item__header){
        cursor: default;
        height: 22px;
        border-bottom: none;
        background-color: transparent;
    }
    :deep(.el-collapse-item__content){
        padding-bottom: 0px;
        background-color: transparent;
    }
    :deep(.el-collapse-item__wrap){
        border-bottom: none;
        background-color: transparent;
    }
    
    
}
.s-n-t-icon{
    cursor: pointer !important;
    color: rgba(6, 7, 9);
    fill:rgba(6, 7, 9);
    font-weight: 600;
    padding: 4px!important;
    height: 22px;
    font-size: 14px;
    margin-right: 8px;
    border-color: transparent;
    // transition: transform .3s;
}
.s-n-c-text{
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-left: 4px;
}
.s-n-c-right{
    flex: 1;
    text-align: right;
}
.s-n-c-icon{
    @extend .s-n-t-icon;
    margin-right: 0px;
    background-color: transparent;
    color: rgb(77, 83, 232);
}
// .s-n-c-icon:hover{
//     background-color: #F4EBEB !important;
// }
.s-n-collapse-icon{
    @extend .s-n-t-icon;
    margin-right: 0px;
    font-size: 13px;
    transition: transform .3s;
    &:hover{
        background-color: transparent;
    }
}


.s-n-c-header-icon{
    margin-left: 2px;
    height: 12px;
    width: 12px;
    color: rgb(167, 169, 176);
    cursor: default;
}
:deep(.el-button.is-active){
    background-color: transparent;
}

.s-n-is-active {
    transform: rotate(90deg);
}
.s-n-t-start-icon{
    width: 20px;
    height: 20px;
    margin-right: 8px;
}
.s-n-t-text{
    color: rgba( 56,55,67 ,1);
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 22px;
}
</style>

<style>
div[data-id="10000"].vue-flow__node-default{
    width: 775px;
}
div[data-id="10000"] div[data-handlepos="left"]{
   display: none;
}
</style>