<script lang="ts" setup>
import RightIcon from '../icons/RightIcon.vue'
import DragIcon from '../icons/DragIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import AddIcon from '../icons/AddIcon.vue';
import ParamsItem from '../basic/ParamsItem.vue'
import ModelHeaderRight from '../basic/ModelHeaderRight.vue'
import DraggableList from '../basic/DraggableList.vue'
import { toopTipText9,toopTipText10,toopTipText11 } from '../data/tooltips'
import { conditionNodeParams } from '../data/node-params'
import { condDescParam, selectParam, textareaParam,checkBoxParam,deleteIconParam } from '../data/node-params-template'
import { EventBus } from '../../utils/EventBus'

const eventBus = EventBus();
const openCard = ref(true);
const titleRef:any = ref(null);
const paramsData:any = ref(conditionNodeParams);
const currentInstance:any = getCurrentInstance(); 
const ctx = currentInstance.ctx;
const inputTitles = [
    // {name:'',flexNum:'b-50'}, // 条件分支
    {name:'引用变量',flexNum:'3'},
    {name:'选择条件',flexNum:'3'},
    {name:'比较值',flexNum:'2'},
    {name:'',flexNum:'5'},
    {name:'',flexNum:'b-26'}
];
const conditionNode:any = ref({
    title:{
        type:'input',
        value:'选择器',
        placeholder:'',
        warning:'',
        disabled: false,
        style:{},
    },
    // 可拖拽列表数据
    draggableListData:[
        {
            id:1,
            title:'如果',
            label:'优先级',
            inputTitles,
            paramsData: [
                // 深拷贝
                ...JSON.parse(JSON.stringify(conditionNodeParams))
            ]
        },
        {
            id:2,
            title:'否则如果',
            label:'优先级',
            inputTitles,
            paramsData: [
                // 深拷贝
                ...JSON.parse(JSON.stringify(conditionNodeParams))
            ]
        },
        {
            id:3,
            title:'否则',
            label:'',
            inputTitles:null,
            paramsData: []
        },
    ],
});



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
const openOrCloseCard = () => {
    openCard.value = !openCard.value;
}
// 新增一条输入框
const addItem = (index:number) => {
    const newItemArr = [
        // {
        //     ...condDescParam,
        // },
        {
            ...selectParam,
            value:'',
            placeholder:'请选择',
            options:[],
        },
        {
            ...selectParam,
            value:'',
            placeholder:'请选择',
            options:[],
        },
        {
            ...selectParam,
            value:'1',
            options:[
                {label:'引用',value:'1'},
                {label:'输入',value:'2'}
            ],
            style:{
                width:'calc(100% + 4px)',
            },
            cutBorderRight:true,
        },
        {
            ...selectParam,
            value:'',
            placeholder:'请选择',
            options:[],
            style:{
                marginLeft:'-4px',
                width:'calc(100% + 4px)',
            },
            cutBorderLeft:true,
        },
        {
            ...deleteIconParam,
            style:{
                marginTop:'6px',
                fontSize:'20px',
            }
        },
    ];
    const list = conditionNode.value.draggableListData[index].paramsData;
    const len = list.length;
    const id = len=== 0 ? 1:((list[len - 1] as any)?.id+1);
    console.log('id arr', id,newItemArr)
    conditionNode.value.draggableListData[index].paramsData.push({
        id,
        list: newItemArr
    });
}
const selectChange = (options:any,index:number) => {
    const { value,i } = options || {};
    console.log('selectChange', value,i,index)
    if(value == 1){
        conditionNode.value.draggableListData[index].paramsData[i].list[3] = {
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
        conditionNode.value.draggableListData[index].paramsData[i].list[3] = {
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

</script>
<template>
    <div class="cond-model-node-wrapper">
        <div :class="[openCard?'cond-model-node-header':'']">
            <div class="cond-model-node-title">
                <el-button class="cm-n-t-icon" 
                :class="[openCard?'cm-n-is-active':'']"
                :icon="RightIcon"
                @click="openOrCloseCard" 
                />
                <img src="../images/icon-condition.png" alt="cm-n-t-start-icon" class="cm-n-t-start-icon" />
                <div class="cm-n-t-text">
                    <el-input v-model="conditionNode.title.value" :placeholder="conditionNode.title.placeholder" :disabled="conditionNode.title.disabled"
                    :style="conditionNode.title.style"
                    ref="titleRef"
                    />
                </div>
                <ModelHeaderRight 
                @testRun="testRun"
                @reName="reName"
                @deleteNode="deleteNode"
                />
                
            </div>
            <div class="cond-model-node-subtitle" v-if="openCard">
                <span>连接多个下游分支，若设定的条件成立则仅运行对应的分支，若均不成立则只运行“否则”分支</span>
            </div>
        </div>
        
        <div class="cond-model-node-content" v-if="openCard">
            <DraggableList 
            :draggable="true" 
            :draggableList="conditionNode.draggableListData"
            :listClass="'cond-model-node-content-item'"
            >
                <template #title="{ data,index }:{ data:any,index:number }">
                    <el-button class="cm-n-drag-icon" 
                    :icon="DragIcon"
                    />
                    <span class="cm-n-c-text">{{data.title}}</span>
                    <div class="cm-n-c-label" v-if="data.inputTitles">{{data.label}}{{index+1}}</div>
                </template>
                <template #default="{data,index}:{ data:any,index:number }">
                    <div>
                        <ParamsItem 
                        :data="data.paramsData"
                        :key="'cmInput'+data.id"
                        :titles="data.inputTitles"
                        :showAddIcon="data.inputTitles!==null"
                        @addItem="addItem(index)"
                        @selectChange="(o:any)=>{selectChange(o,index)}"
                        />
                    </div>
                </template>
            </DraggableList>
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
.cm-n-c-el-icon-right{
    color: rgba(56, 55, 67, 0.6);
    font-weight:500;
    font-size: 12px;
    margin-left: 4px;
}
.cm-n-c-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    color: rgb(77, 83, 232);
    :hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.cm-n-c-r-select-icon{
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
.cond-model-node-wrapper{
    width: 100%; 
}
.cond-model-node-header{
    margin-bottom: 16px;
}
.cond-model-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.cond-model-node-subtitle{
    color: rgba(28, 29, 35, .6);
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: left;
}

.cm-n-t-icon{
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

.cm-n-c-text{
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-left: 4px;
}
.cm-n-c-label{
    color: rgb(75, 74, 88);
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    padding: 2px 8px;
    margin-left: 8px;
    background-color: rgba(139, 139, 149, 0.15);
    border-radius: 8px;
}
.cm-n-c-result-content{
    // margin-top: 8px;
    width: 100%;
}
.cm-n-c-result-nodata{
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    color:rgba(6, 7, 9, 0.3);
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe Ul,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    padding: 12px 0px;
    line-height:18px;
}

.cm-n-drag-icon{
    @extend .cm-n-t-icon;
    margin-right: 0px;
    font-size: 13px;
    transition: transform .3s;
    cursor: move!important;
    &:hover{
        background-color: transparent;
    }
}

.cm-n-c-header-icon-margin{
    margin: 0 12px 0 4px;
}
.cm-n-c-header-icon-export-margin{
    margin: 0 2px 0 4px;
}
.cm-n-c-header-icon{
    height: 12px;
    width: 12px;
    color: rgb(167, 169, 176);
    cursor: default;
}
.cm-n-c-header-add-icon{
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
.cm-n-c-r-export-text{
    color: rgba(6, 7, 9, 0.8);
    font-size: 14px;
    font-weight: 400;
    cursor: grab;
}
.cm-n-c-r-text{
    color: rgba(6, 7, 9, 0.5);
    font-size: 12px;
    font-weight: 500;
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
}
.cm-n-c-header-right{
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
.cm-n-c-h-r-text{
    color: rgb(56, 55, 67);
    font-size: 14px;
    line-height: 20px;
    height: 20px;
}
.cm-n-c-chat-outputlist{
    margin-top: 8px;
}
:deep(.el-button.is-active){
    background-color: transparent;
}

.cm-n-is-active {
    transform: rotate(90deg);
}
.cm-n-t-start-icon{
    width: 20px;
    height: 20px;
    // margin-right: 8px;
}
.cm-n-t-text{
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
div[data-id^="10007-"].vue-flow__node-default{
    width: 850px;
}
.cond-model-node-content-item{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    position: relative;
    width: 100%;
}
</style>