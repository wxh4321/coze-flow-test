<script lang="ts" setup>
import RightIcon from '../icons/RightIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import ExportIcon from '../icons/ExportIcon.vue'
import ParamsItem from '../basic/ParamsItem.vue'
import { toopTipText, toopTipText1 } from '../data/tooltips'
import { startNodeParams } from '../data/node-params'
import { inputParam, selectParam, textareaParam,checkBoxParam,deleteIconParam } from '../data/node-params-template'
import { EventBus } from '@/utils/EventBus.ts'
import { useGlobalStore } from '../../store';
import { debounce, deepClone } from '../../utils';

const eventBus = EventBus();
const nodeId = ref('');
const openCard = ref(true);
const openCollapse:any = ref({});
const openCollapseArr:any = ref([]);
const paramsData = ref(startNodeParams);
const modeRef: any = ref(null);

// 需要出现在历史数据 做 redo undo的数据，都放在下面的数据结构中
const startNode = ref({
    inputParams:deepClone(startNodeParams),
    openCard:openCard.value,
});
// 是否打开关闭整个节点
eventBus.on('openCard', (value: any) => {
    openCard.value = value;
});
const updateType = ref('');
const debounceUpdateNodeData = debounce((type:string)=>{
    updateType.value = type;
    if(type!=='history'){
        return;
    }
    setTimeout(()=>{
        // 更新数据
        const globalStore = useGlobalStore();
        const data = globalStore.getNodeDataById(nodeId.value);
        console.log('data ..... ', data);
        if(data?.data?.metaData){
            startNode.value = data.data.metaData || {};
        }
    },100);
}, 100);

// 通过undo redo更新数据 type 标识更新种类
eventBus.on('updateNodeData', (type: string) => {
    debounceUpdateNodeData(type);
});
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

const keepOpen = (key:string) => {
    // 打开{key}区域
    openCollapse.value[key] = true;
    openCollapseArr.value.push(key);
}
const keepClose = (key:string) => {
    // 关闭{key}区域
    openCollapse.value[key] = false;
    const findIndex = openCollapseArr.value.findIndex((item:string)=>item===key);
    openCollapseArr.value.splice(findIndex,1);
}
const clickCollapseItem = (key:string) => {
    if(!openCollapse.value[key]){
        keepOpen(key);
    }
    else{
        keepClose(key);
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
    const id = startNode.value.inputParams.length===0?1:(startNode.value.inputParams[startNode.value.inputParams.length - 1].id+1);
    startNode.value.inputParams.push({
        id,
        list: newItemArr
    });
}
onMounted(()=>{
    openAll();
    // 获取当前节点
    const parent = modeRef.value.parentNode;
    const id = parent.getAttribute('data-id');
    nodeId.value = id;
    // eventBus.emit('saveModelData', {id:nodeId.value,data:startNode.value});
});
watch(
    ()=>startNode.value,
    (newValue:any)=>{
        if(updateType.value!=='history'){
            eventBus.emit('saveModelData', {id:nodeId.value,data:newValue});
        }
    },
    { immediate: true, deep: true }
);
</script>
<template>
    <div class="start-node-wrapper" ref="modeRef">
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
                <el-collapse-item name="input" :disabled="true">
                    <template #title>
                        <el-button class="s-n-collapse-icon" 
                        :class="[openCollapse['input']?'s-n-is-active':'']"
                        :icon="RightIcon"
                        @click="clickCollapseItem('input')"
                        />
                        <span class="s-n-c-text">输入</span>
                        <el-tooltip
                            :offset="12"
                            popper-class="tooltip-box-item-in-node"
                            effect="dark"
                            :content="toopTipText"
                            placement="top"
                        >
                            <el-icon class="s-n-c-header-icon s-n-c-header-icon-margin">
                                <NoticeIcon />
                            </el-icon>
                        </el-tooltip>
                        <div class="s-n-c-right">
                            <el-tooltip
                            :offset="12"
                            popper-class="tooltip-box-item-in-node"
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
                        <ParamsItem :data="startNode.inputParams"
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
    background-color: transparent;
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

.s-n-c-header-icon-margin{
    margin: 0 12px 0 4px;
}
.s-n-c-header-icon{
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
div[data-id^="10000-"].vue-flow__node-default{
    width: 775px;
}
div[data-id^="10000-"] div[data-handlepos="left"]{
   display: none;
}

</style>