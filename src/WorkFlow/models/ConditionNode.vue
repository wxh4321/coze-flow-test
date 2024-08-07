<script lang="ts" setup>
import ArrowDown from '../icons/ArrowDown.vue'
import RightIcon from '../icons/RightIcon.vue'
import DragIcon from '../icons/DragIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import DeleteIcon from '../icons/DeleteIcon.vue';
import AddIcon from '../icons/AddIcon.vue';
import ParamsItem from '../basic/ParamsItem.vue'
import ModelHeaderRight from '../basic/ModelHeaderRight.vue'
import DraggableList from '../basic/DraggableList.vue'
import ConditionLine from '../basic/ConditionLine.vue'
import { toopTipText9,toopTipText10,toopTipText11 } from '../data/tooltips'
import { conditionNodeParams } from '../data/node-params'
import { condDescParam, selectParam, textareaParam,checkBoxParam,deleteIconParam } from '../data/node-params-template'
import { EventBus } from '../../utils/EventBus'
import { publicTools } from '../data';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { saveModelData } from '../../utils/workflow-tools'
import { useGlobalStore } from '../../store';
import { debounce, deepClone } from '../../utils'

const eventBus = EventBus();
const nodeId = ref('');
const openCard = ref(true);
const listDraggable = ref(false);
const titleRef:any = ref(null);
const paramsData:any = ref(conditionNodeParams);
const modeRef:any = ref(null);

const inputTitles = [
    // {name:'',flexNum:'b-50'}, // 条件分支
    {name:'引用变量',flexNum:'3'},
    {name:'选择条件',flexNum:'3'},
    {name:'比较值',flexNum:'2'},
    {name:'',flexNum:'5'},
    {name:'',flexNum:'b-26'}
];
// 需要出现在历史数据 做 redo undo的数据，都放在下面的数据结构中
const conditionNode:any = ref({
    openCard:openCard.value,
    title:{
        type:'input',
        value:'选择器',
        placeholder:'',
        warning:'',
        disabled: false,
        style:{},
    },
    // 条件分支图例参数
    condDescParam:{
        ...condDescParam,
        icon: markRaw(ArrowDown),
        name:'且',
        style:{
            marginRight:'16px',
        }
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
            title:'否则',
            label:'',
            inputTitles:null,
            paramsData: []
        },
    ],
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
            conditionNode.value = data.data.metaData || {};
        }
    },100);
}, 100);

// 通过undo redo更新数据 type 标识更新种类
eventBus.on('updateNodeData', (type: string) => {
    debounceUpdateNodeData(type);
});
// 计算是否展示标签 （优先级n）
const computedShowLabel = computed(() => {
    return (value:any)=>{
        const len = conditionNode.value.draggableListData.length;
        if(value!==null && len>2){
            return true;
        }
        return false;
    };
})
// 计算条件分支是否可删除
const computedDisabledBranchDelIcon = computed(() => {
    return (index:number)=>{
        const len = conditionNode.value.draggableListData.length;
        if(index===0 && len<=2){
            return true;
        }
        return false;
    }
});
// 是否展示条件分支图例
const showConditionLine = computed(() => {
    return (data:any)=>{
        const list = data?.paramsData||[];
        const len = list.length;
        console.log('showConditionLine len ', len);
        if(len>1){
            return true;
        }
        return false;
    };

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
    const parent = modeRef.value.parentNode;
    const id = parent.getAttribute('data-id');
    eventBus.emit('deleteNode', {id});
}
const openOrCloseCard = () => {
    openCard.value = !openCard.value;
}
// 新增一条输入框
const addItem = (index:number) => {
    const newItemArr = [
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
    const list = conditionNode.value.draggableListData[index]?.paramsData||[];
    const len = list.length;
    const id = len=== 0 ? 1:((list[len - 1] as any)?.id+1);
    conditionNode.value.draggableListData[index].paramsData.push({
        id,
        list: newItemArr
    });
}
const addBranch = () => {
    console.log('addBranch ', publicTools.dragId)
    const len = conditionNode.value.draggableListData.length;
    conditionNode.value.draggableListData.splice(len-1,0,{
        id: publicTools.dragId++,
        title:'否则如果',
        label:'优先级',
        inputTitles,
        paramsData: [
            // 深拷贝
            ...JSON.parse(JSON.stringify(conditionNodeParams))
        ]
    });
}
const deleteItem = (params:any,colIndex:number) => {
    const { item,index } = params||{};
    const len = conditionNode.value.draggableListData[colIndex]?.paramsData?.length;
    console.log('deleteItem', item,index,colIndex);
    console.log('deleteItem len', len);
    if(len===0){// len 为 0 同时删除当前分支
        deleteBranch(colIndex);
    }
}
const deleteBranch = (index:number) => {
    if(computedDisabledBranchDelIcon.value(index)){
        return;
    }
    conditionNode.value.draggableListData.splice(index,1);
    if(index===0){
        // 删除第一条时，重置第一条title = '如果'
        setItem(0,-1,-1,{
            title:'如果'
        });
        // 使得删除按钮不可用
        setItem(0,0,4,{
            disabled:true
        });
    }
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
const setItem = (index:number,i:number,j:number,data={}) => {
    if(i==-1){
        const obj = conditionNode.value.draggableListData[index];
        if(obj){
            conditionNode.value.draggableListData[index] = {
                ...JSON.parse(JSON.stringify(obj)),
                ...data
            };
        }
        
    }
    else if(j==-1){
        const obj = conditionNode.value.draggableListData[index]?.paramsData[i];
        if(obj){
            conditionNode.value.draggableListData[index].paramsData[i] = {
                ...JSON.parse(JSON.stringify(obj)),
                ...data
            };
        }
    }
    else{
        const obj = conditionNode.value.draggableListData[index]?.paramsData[i]?.list[j];
        if(obj){
            conditionNode.value.draggableListData[index].paramsData[i].list[j] = {
                ...obj,
                ...data
            };
        }
        
    }
    
}

const dragMousedown = ()=>{
    console.log('dragMousedown');
    listDraggable.value = true;
    // 设置当前节点为可拖拽
    // eventBus.emit('makeDraggable', {id: ctx.$parent.id});
}
const dragMouseleave = ()=>{
    console.log('dragMouseleave');
    listDraggable.value = false;
    // 设置当前节点为可拖拽
    // eventBus.emit('makeDraggable', {id: ctx.$parent.id});
}
const handleMousedown = ()=>{
    console.log('handleMousedown');
    listDraggable.value = false;
}

onMounted(()=>{
    // 使得删除按钮不可用
    setItem(0,0,4,{
        disabled:true
    });
    // 获取当前节点
    const parent = modeRef.value.parentNode;
    const id = parent.getAttribute('data-id');
    nodeId.value = id;
    // saveModelData(nodeId.value,conditionNode.value);
});
watch(
    ()=>conditionNode.value,
    (newValue:any)=>{
        if(updateType.value!=='history'){
            saveModelData(nodeId.value,newValue);
        }
    },
    { immediate: true, deep: true }
);
</script>
<template>
    <div class="cond-model-node-wrapper" ref="modeRef">
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
        <div class="cond-model-node-branch-title" v-if="openCard">
            <span class="c-m-n-title-text">条件分支</span>
            <div class="c-m-n-title-right"  @click="addBranch">
                <el-button class="c-m-n-add-icon" 
                :icon="AddIcon"
                />
                <span class="c-m-n-r-text">新增分支</span>
            </div>
        </div>
        <div class="cond-model-node-content mt12">
            <DraggableList 
            :draggable="listDraggable" 
            :draggableList="conditionNode.draggableListData"
            :listClass="'cond-model-node-content-item'"
            >
                <template #default="{data,index}:{ data:any,index:number }">
                    <div class="cm-n-drag-title">
                        <el-button class="cm-n-drag-icon" 
                        :icon="DragIcon"
                        @mousedown="dragMousedown"
                        @mouseleave="dragMouseleave"
                        />
                        <span class="cm-n-c-text">{{data.title}}</span>
                        <div class="cm-n-c-label" v-if="computedShowLabel(data.inputTitles)">{{data.label}}{{index+1}}</div>
                        <div class="cm-n-c-right" v-if="data.inputTitles!==null">
                            <el-icon class="cm-n-c-delete-icon" 
                            :class="[computedDisabledBranchDelIcon(index)?'cm-n-c-delete-icon-disabled':'']"
                            @click="deleteBranch(index)"
                            :style="{}"
                            >
                                <DeleteIcon />
                            </el-icon>
                        </div>
                    </div>
                    <div class="cm-n-drag-main" v-if="openCard">
                        <ConditionLine
                        v-if="showConditionLine(data)"
                        :data="conditionNode.condDescParam"
                        />
                        <div class="cm-n-drag-content">
                            <ParamsItem 
                            :data="data.paramsData"
                            :key="'cmInput'+data.id"
                            :titles="data.inputTitles"
                            :showAddIcon="data.inputTitles!==null"
                            @addItem="addItem(index)"
                            @deleteItem="(data:any)=>deleteItem(data,index)"
                            @selectChange="(o:any)=>selectChange(o,index)"
                            />
                        </div>
                        <!-- 右边的handle节点 -->
                        <Handle :id="'target-'+data.id" type="source" 
                        :key="'target-'+data.id"
                        @mousedown="handleMousedown"
                        :position="Position.Right" 
                        :connectable="true" 
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
    --semi-color-primary:rgba( 77,83,232,1)!important;
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
.mt12{
    margin-top: 12px;
}
.mb12{
    margin-bottom: 12px;
}
.cond-model-node-branch-title,
.cond-model-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.cond-model-node-branch-title{
    justify-content: space-between;
}
.c-m-n-title-text{
    font-size: 16px;
    font-weight: 600;
    color: #000;
}
.c-m-n-title-right{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}
.c-m-n-r-text{
    font-size: 12px;
    color: var(--semi-color-primary);
}
.c-m-n-add-icon{
    cursor: pointer !important;
    color: var(--el-color-primary1);
    font-weight: 600;
    padding: 4px!important;
    height: 22px;
    font-size: 14px;
    // margin-right: 8px;
    border-color: transparent;
    background-color: transparent;
    // &:hover{
    //     background-color: var(--el-color-primary-light-9);
    // }
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
.cm-n-c-right{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}
.cm-n-c-delete-icon{
    // margin-left: 2px;
    flex-basis: 26px;
    margin-top: 9px;
    color: #888d92;
    cursor: pointer;
    font-size: 20px;
    &-disabled{
        color: rgb(217, 220, 250);
        cursor: not-allowed;
    }
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
.cm-n-drag-content{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.cm-n-drag-title{
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
}
.cm-n-drag-main{
    width: 100%;
    display: flex;
    flex-direction: row;
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
div[data-id^="10007-"] div[data-handlepos="right"]:not(div[data-handleid^="target-"]) {
   display: none;
}
.cond-model-node-content-item{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    width: 100%;
    position: relative;
}
</style>