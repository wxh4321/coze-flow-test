<script lang="ts" setup>
import RightIcon from '../icons/RightIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import ParamsItem from '../basic/ParamsItem.vue'
import { toopTipText2,toopTipText3,toopTipText4 } from '../data/tooltips'
import { endNodeParams } from '../data/node-params'
import { inputParam, selectParam, textareaParam,checkBoxParam,deleteIconParam } from '../data/node-params-template'
import { EventBus } from '../../utils/EventBus'
import { saveModelData } from '../../utils/workflow-tools'
import { useGlobalStore } from '../../store';
import { debounce, deepClone } from '../../utils'

const eventBus = EventBus();
const nodeId = ref('');
const openCard = ref(true);
const openCollapse:any = ref({});
const openCollapseArr:any = ref([]);
const collapseArr = ['output','result'];
const paramsData = ref(endNodeParams);
const modeRef: any = ref(null);

// 需要出现在历史数据 做 redo undo的数据，都放在下面的数据结构中
const endNode = ref({
    openCard:openCard.value,
    outputParams:deepClone(endNodeParams),
    answer:{
        value:'1',
        placeholder:'',
        disabled:false,
        noDataText:'暂无数据',
        options:[
            {label:'返回变量，由Bot生成回答',value:'1'},
            {label:'使用设定的内容直接回答',value:'2'}
        ],
    },
    // 返回直接回答的结果
    result:{
        // type:'textarea',
        value:'',
        placeholder:`可以使用{{变量名}}、{{变量名.子变量名}}、{{变量名[数组索引]}}的方式引用输出参数中的变量`,
        warning:'',
        showWordLimit:false,
        rows:5, // 行数
        maxlength:1000000000, // 最大字数
        disabled:false,
        style:{},
        streamOutputValue:false,
    }
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
            endNode.value = data.data.metaData || {};
        }
    },100);
}, 100);

// 通过undo redo更新数据 type 标识更新种类
eventBus.on('updateNodeData', (type: string) => {
    debounceUpdateNodeData(type);
});
const titles = ref([
    {name:'参数名',flexNum:'1'},
    {name:'参数值',flexNum:'1'},
    {name:'',flexNum:'1'},
    {name:'',flexNum:'b-26'}
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
const elSwitchChange = (res:boolean) => {
    // keepOpen('result');
}

// 新增一条输入框
const addItem = () => {
    const newItemArr = [
        {
            ...inputParam,
            placeholder:'输入参数名',
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
    
    const id = endNode.value.outputParams.length===0?1:((endNode.value.outputParams[endNode.value.outputParams.length - 1] as any)?.id+1);
    endNode.value.outputParams.push({
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
    // saveModelData(nodeId.value,endNode.value);
});
watch(
    ()=>endNode.value,
    (newValue:any)=>{
        if(updateType.value!=='history'){
            saveModelData(nodeId.value,newValue);
        }
    },
    { immediate: true, deep: true }
);
</script>
<template>
    <div class="end-node-wrapper" ref="modeRef">
        <div :class="[openCard?'end-node-header':'']">
            <div class="end-node-title">
                <el-button class="e-n-t-icon" 
                :class="[openCard?'e-n-is-active':'']"
                :icon="RightIcon"
                @click="openOrCloseCard" 
                />
                <img src="../images/icon-end.png" alt="e-n-t-start-icon" class="e-n-t-start-icon" />
                <span class="e-n-t-text">结束</span>
            </div>
            <div class="end-node-subtitle" v-if="openCard">
                <span>工作流的最终节点，用于返回工作流运行后的结果信息</span>
            </div>
        </div>
        <div class="end-node-answer" v-if="openCard">
            <span class="e-n-a-title">选择回答模式</span>
            <div class="e-n-a-select">
                <el-select v-model="endNode.answer.value" :placeholder="endNode.answer.placeholder" :disabled="endNode.answer.disabled"
                :no-data-text="endNode.answer.noDataText"
                >
                    <el-option
                        v-for="(oItem,opIndex) in endNode.answer.options"
                        :key="opIndex"
                        :label="oItem.label"
                        :value="oItem.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="end-node-content" v-if="openCard">
            <el-collapse @change="collapseChange"
            v-model="openCollapseArr"
            >
                <div class="end-node-content-item">
                    <el-collapse-item name="output">
                        <template #title>
                            <el-button class="e-n-collapse-icon" 
                            :class="[openCollapse['output']?'e-n-is-active':'']"
                            :icon="RightIcon"
                            />
                            <span class="e-n-c-text">输出变量</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText2"
                                placement="top"
                            >
                                <el-icon class="e-n-c-header-icon e-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <div>
                            <ParamsItem :data="endNode.outputParams"
                            @addItem="addItem"
                            :titles="titles"
                            />
                        </div>
                    </el-collapse-item>
                </div>
                <div class="end-node-content-item" v-if="endNode.answer.value==='2'">
                    <el-collapse-item name="result" :disabled="true">
                        <template #title>
                            <el-button class="e-n-collapse-icon" 
                            :class="[openCollapse['result']?'e-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('result')"
                            />
                            <span class="e-n-c-text">回答内容</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText4"
                                placement="top"
                            >
                                <el-icon class="e-n-c-header-icon e-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                            <div class="e-n-c-header-right">
                                <span class="e-n-c-text">流式输出</span>
                                <el-tooltip
                                    :offset="12"
                                    popper-class="tooltip-box-item-in-node"
                                    effect="dark"
                                    :content="toopTipText3"
                                    placement="top"
                                >
                                    <el-icon class="e-n-c-header-icon e-n-c-header-icon-margin">
                                        <NoticeIcon />
                                    </el-icon>
                                </el-tooltip>
                                <el-switch v-model="endNode.result.streamOutputValue"
                                @change="elSwitchChange"
                                 />
                            </div>
                        </template>
                        <div class="e-n-c-result-content">
                            <el-input type="textarea" v-model="endNode.result.value" :placeholder="endNode.result.placeholder" :disabled="endNode.result.disabled"
                            :maxlength="endNode.result.maxlength"
                            :show-word-limit="endNode.result.showWordLimit"
                            :rows="endNode.result.rows"
                            :style="endNode.result.style"
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
.end-node-wrapper{
    width: 100%; 
}
.end-node-header{
    margin-bottom: 16px;
}
.end-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.end-node-subtitle{
    color: rgba(28, 29, 35, .6);
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: left;
}
.end-node-answer{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
}
.e-n-a-title{
    text-align: left;
    flex: 1;
    font-weight: 600;
    font-size: 14px;
    color: #1d1c23;
}
.e-n-a-select{
   flex: 2;
}
.end-node-content{
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
.end-node-content-item{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    position: relative;
    width: 100%;
}
.e-n-t-icon{
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
.e-n-c-text{
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-left: 4px;
}
.e-n-c-result-content{
    width: 100%;
}

.e-n-c-icon{
    @extend .e-n-t-icon;
    margin-right: 0px;
    background-color: transparent;
    color: rgb(77, 83, 232);
}

.e-n-collapse-icon{
    @extend .e-n-t-icon;
    margin-right: 0px;
    font-size: 13px;
    transition: transform .3s;
    &:hover{
        background-color: transparent;
    }
}

.e-n-c-header-icon-margin{
    margin: 0 12px 0 4px;
}
.e-n-c-header-icon{
    height: 12px;
    width: 12px;
    color: rgb(167, 169, 176);
    cursor: default;
}
.e-n-c-header-right{
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
:deep(.el-button.is-active){
    background-color: transparent;
}

.e-n-is-active {
    transform: rotate(90deg);
}
.e-n-t-start-icon{
    width: 20px;
    height: 20px;
    margin-right: 8px;
}
.e-n-t-text{
    color: rgba( 56,55,67 ,1);
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 22px;
}
</style>
<style>
div[data-id^="20000-"].vue-flow__node-default{
    width: 484px;
}
div[data-id^="20000-"] div[data-handlepos="right"]{
   display: none;
}
</style>