<script lang="ts" setup>
import RightIcon from '../icons/RightIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import AddIcon from '../icons/AddIcon.vue';
import ParamsItem from '../basic/ParamsItem.vue'
import ModelHeaderRight from '../basic/ModelHeaderRight.vue'
import ModelTreeText from '../basic/ModelTreeText.vue'
import { toopTipText9,toopTipText10,toopTipText11 } from '../data/tooltips'
import { knowledgeNodeParams } from '../data/node-params'
import { EventBus } from '../../utils/EventBus'

const eventBus = EventBus();
const openCard = ref(true);
const openCollapse:any = ref({});
const openCollapseArr:any = ref([]);
const titleRef:any = ref(null);
const collapseArr = ['input','knowledge','output'];
const paramsData:any = ref(knowledgeNodeParams);
const currentInstance:any = getCurrentInstance(); 
const ctx = currentInstance.ctx;

const knowledgeNode = ref({
    input:{
        inputParams:paramsData.value,
    },
    output:{
        // outputParams:paramsData1.value,
        // chatgpt历史数据
        treeData:{
            title:'outputList',
            label:'Array<Object>',
            children:[
                {
                    title:'output',
                    label:'String',
                    children:[]
                }
            ]
        }
    },
    title:{
        type:'input',
        value:'知识库',
        placeholder:'',
        warning:'',
        disabled: false,
        style:{},
    },
    
});

const inputTitles = ref([
    {name:'参数名',flexNum:'3'},
    {name:'参数值',flexNum:'2'},
    {name:'',flexNum:'3'},
]);

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

const emit = defineEmits(['testRun']);

// 运行本节点
const testRun = () => {
    emit('testRun');
}
const reName = () => {
    titleRef.value && titleRef.value?.focus();
}
const deleteNode = () => {
    // 获取需要删除的nodeid
    eventBus.emit('deleteNode', {id: ctx.$parent.id});
}

const addKnow = () => {
    console.log('addKnow');
    // 打开弹窗
    eventBus.emit('openKnowledgeDialog');
}
const selectChange = (options:any) => {
    const { value } = options || {};
    if(value == 1){
        console.log('selectChange', value)
        paramsData.value[0].list[2] = {
            type:'select',
            noDataText:'暂无数据',
            warning:'',
            disabled:false,
            value:'',
            placeholder:'请选择',
            options:[],
            style:{
                marginLeft:'-4px',
                width:'calc(100% + 4px)',
            },
            cutBorderLeft:true,
        };
    }
    else{
        paramsData.value[0].list[2] = {
            type:'input',
            value:'',
            placeholder:'输入参数值',
            warning:'',
            disabled: false,
            style:{
                marginLeft:'-4px',
                width:'calc(100% + 4px)'
            },
            cutBorderLeft:true,
        };
    }
}
onMounted(()=>{
    openAll();
});
</script>
<template>
    <div class="know-model-node-wrapper">
        <div :class="[openCard?'know-model-node-header':'']">
            <div class="know-model-node-title">
                <el-button class="km-n-t-icon" 
                :class="[openCard?'km-n-is-active':'']"
                :icon="RightIcon"
                @click="openOrCloseCard" 
                />
                <img src="../images/icon-knowledge.png" alt="km-n-t-start-icon" class="km-n-t-start-icon" />
                <div class="km-n-t-text">
                    <el-input v-model="knowledgeNode.title.value" :placeholder="knowledgeNode.title.placeholder" :disabled="knowledgeNode.title.disabled"
                    :style="knowledgeNode.title.style"
                    ref="titleRef"
                    />
                </div>
                <ModelHeaderRight 
                @testRun="testRun"
                @reName="reName"
                @deleteNode="deleteNode"
                />
                
            </div>
            <div class="know-model-node-subtitle" v-if="openCard">
                <span>在选定的知识中,根据输入变量召回最匹配的信息,并以列表形式返回</span>
            </div>
        </div>
        
        <div class="know-model-node-content" v-if="openCard">
            <el-collapse @change="collapseChange"
            v-model="openCollapseArr"
            >
                <div class="know-model-node-content-item">
                    <el-collapse-item name="input" :disabled="true">
                        <template #title>
                            <el-button class="km-n-collapse-icon" 
                            :class="[openCollapse['input']?'km-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('input')"
                            />
                            <span class="km-n-c-text">输入</span>
                            <el-tooltip
                                :offset="12"
                                class="tooltip-box-item"
                                effect="dark"
                                :content="toopTipText9"
                                placement="top"
                            >
                                <el-icon class="km-n-c-header-icon km-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <div>
                            <ParamsItem :data="paramsData"
                            key="bmInput"
                            :titles="inputTitles"
                            :showAddIcon="false"
                            @selectChange="selectChange"
                            />
                        </div>
                    </el-collapse-item>
                </div>
                <div class="know-model-node-content-item">
                    <el-collapse-item name="knowledge" :disabled="true">
                        <template #title>
                            <el-button class="km-n-collapse-icon" 
                            :class="[openCollapse['knowledge']?'km-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('knowledge')"
                            />
                            <span class="km-n-c-text">知识库</span>
                            <el-tooltip
                                :offset="12"
                                class="tooltip-box-item"
                                effect="dark"
                                :content="toopTipText10"
                                placement="top"
                            >
                                <el-icon class="km-n-c-header-icon km-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                            <div class="km-n-c-header-right">
                                <el-button class="km-n-c-header-add-icon" 
                                :icon="AddIcon"
                                @click="addKnow" 
                                />
                            </div>
                        </template>
                        <div class="km-n-c-result-content">
                            <div class="km-n-c-result-nodata">请添加知识库到此节点</div>
                        </div>
                    </el-collapse-item>
                </div>
                <div class="know-model-node-content-item">
                    <el-collapse-item name="output" :disabled="true">
                        <template #title>
                            <el-button class="km-n-collapse-icon" 
                            :class="[openCollapse['output']?'km-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('output')"
                            />
                            <span class="km-n-c-text">输出</span>
                            <el-tooltip
                                :offset="12"
                                class="tooltip-box-item"
                                effect="dark"
                                :content="toopTipText11"
                                placement="top"
                            >
                                <el-icon class="km-n-c-header-icon km-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <div class="km-n-c-chat-outputlist">
                            <ModelTreeText :data="knowledgeNode.output.treeData"
                            :openAll="true"
                            :showBottomLine="false"
                            />
                        </div>
                    </el-collapse-item>
                </div>
            </el-collapse>
        </div>
    </div>
    
</template>
<style lang="scss" scoped>
*{
    --el-color-primary-light-9: #F4EBEB !important;
    --el-color-primary:rgba( 77,83,232 ,1)!important;
    --el-color-primary1:rgba( 77,83,232 ,1);
    --el-dropdown-menuItem-hover-color:rgba( 77,83,232 ,1);
    list-style: disc;
}

.basic-n-t-icon{
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
}
.km-n-c-el-icon-right{
    color: rgba(56, 55, 67, 0.6);
    font-weight:500;
    font-size: 12px;
    margin-left: 4px;
}
.km-n-c-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    color: rgb(77, 83, 232);
    :hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.km-n-c-r-select-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    &:hover{
        background-color: var(--el-color-primary-light-9);
    }
}

.public-el-wrapper{
    border: 1px solid rgba( 56,55,67 ,0.08) ;
    border-radius: 8px;
    box-shadow:none;
}
:deep(.el-select__wrapper){
   @extend .public-el-wrapper;
}
:deep(.el-textarea__inner){
    @extend .public-el-wrapper;
}
:deep(.el-input__wrapper){
    @extend .public-el-wrapper;
}
:deep(.el-textarea__inner:focus){
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
:deep(.is-focused) {
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
.know-model-node-wrapper{
    width: 100%; 
}
.know-model-node-header{
    margin-bottom: 16px;
}
.know-model-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.know-model-node-subtitle{
    color: rgba(28, 29, 35, .6);
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: left;
}


.know-model-node-content{
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
.know-model-node-content-item{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    position: relative;
    width: 100%;
}
.km-n-t-icon{
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
}

.km-n-c-text{
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-left: 4px;
}
.km-n-c-result-content{
    // margin-top: 8px;
    width: 100%;
}
.km-n-c-result-nodata{
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    color:rgba(6, 7, 9, 0.3);
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe Ul,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    padding: 12px 0px;
    line-height:18px;
}

.km-n-collapse-icon{
    @extend .km-n-t-icon;
    margin-right: 0px;
    font-size: 13px;
    transition: transform .3s;
    &:hover{
        background-color: transparent;
    }
}

.km-n-c-header-icon-margin{
    margin: 0 12px 0 4px;
}
.km-n-c-header-icon-export-margin{
    margin: 0 2px 0 4px;
}
.km-n-c-header-icon{
    height: 12px;
    width: 12px;
    color: rgb(167, 169, 176);
    cursor: default;
}
.km-n-c-header-add-icon{
    cursor: pointer !important;
    color: var(--el-color-primary1);
    fill:var(--el-color-primary1);
    font-weight: 600;
    padding: 4px!important;
    height: 22px;
    font-size: 14px;
    // margin-right: 8px;
    border-color: transparent;
    background-color: transparent;
    &:hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.km-n-c-r-export-text{
    color: rgba(6, 7, 9, 0.8);
    font-size: 14px;
    font-weight: 400;
    cursor: grab;
}
.km-n-c-r-text{
    color: rgba(6, 7, 9, 0.5);
    font-size: 12px;
    font-weight: 500;
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
}
.km-n-c-header-right{
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
.km-n-c-h-r-text{
    color: rgb(56, 55, 67);
    font-size: 14px;
    line-height: 20px;
    height: 20px;
}
.km-n-c-chat-outputlist{
    margin-top: 8px;
}
:deep(.el-button.is-active){
    background-color: transparent;
}

.km-n-is-active {
    transform: rotate(90deg);
}
.km-n-t-start-icon{
    width: 20px;
    height: 20px;
    // margin-right: 8px;
}
.km-n-t-text{
    width: 100%;
    color: rgba( 56,55,67 ,1);
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    display: flex;
    :deep(*){
        --el-input-height: 20px;
    }
    :deep(.el-input__wrapper){
        padding: 2px 8px;
        border: 1px solid transparent;
    }
}


</style>
<style>
div[data-id^="10004-"].vue-flow__node-default{
    width: 484px;
}
</style>