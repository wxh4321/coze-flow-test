<script lang="ts" setup>
import {
    ArrowDown,
} from '@element-plus/icons-vue'
import RightIcon from '../icons/RightIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import UserSettingIcon from '../icons/UserSettingIcon.vue'
import ExportIcon from '../icons/ExportIcon.vue'
import ParamsItem from '../basic/ParamsItem.vue'
import ModelHeaderRight from '../basic/ModelHeaderRight.vue'
import ModelTreeText from '../basic/ModelTreeText.vue'
import { toopTipText1,toopTipText5,toopTipText6,toopTipText7,toopTipText8 } from '../data/tooltips'
import { bigModelInputNodeParams,bigModelOutputNodeParams } from '../data/node-params'
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
const titleRef:any = ref(null);
const collapseArr = ['input','notice','output'];

const modeRef:any = ref(null);
// 需要出现在历史数据 做 redo undo的数据，都放在下面的数据结构中
const bigModelNode = ref({
    openCard:openCard.value,
    input:{
        inputParams:deepClone(bigModelInputNodeParams),
        checkbox:{
            // type:'checkbox',
            value:'',
            selected:false,
            placeholder:'',
            warning:'',
            disabled:false,
            style:{},
        },
        // chatgpt历史数据
        treeData:{
            title:'chatHistory',
            label:'Array<Object>',
            children:[
                {
                    title:'role',
                    label:'String',
                    children:[]
                },
                {
                    title:'content',
                    label:'String',
                    children:[]
                }
            ]
        }
    },
    output:{
        outputParams:deepClone(bigModelOutputNodeParams),
        export:{
            tabText:'Json',
            tabindex:2
        }
    },
    title:{
        type:'input',
        value:'大模型',
        placeholder:'',
        warning:'',
        disabled: false,
        style:{},
    },
    // 提示词
    notice:{
        // type:'textarea',
        value:'',
        placeholder:`用户提示词，可以使用{{变量名}}、{{变量名.子变量名}}、{{变量名[数组索引]}}的方式引用输入参数中的变量`,
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
            bigModelNode.value = data.data.metaData || {};
        }
    },100);
}, 100);

// 通过undo redo更新数据 type 标识更新种类
eventBus.on('updateNodeData', (type: string) => {
    debounceUpdateNodeData(type);
});
const inputTitles = ref([
    {name:'参数名',flexNum:'4'},
    {name:'变量值',flexNum:'2'},
    {name:'',flexNum:'5'},
    {name:'',flexNum:'b-26'}
]);
const outputTitles = ref([
    {name:'参数名',flexNum:'1point2'},
    {name:'变量类型',flexNum:'1'},
    {name:'描述',flexNum:'2'},
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
const addItemInput = () => {
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
    const list = bigModelNode.value.input.inputParams;
    const id = list.length===0?1:((list[list.length - 1] as any)?.id+1);
    bigModelNode.value.input.inputParams.push({
        id,
        list: newItemArr
    });
}
// 新增一条输出框
const addItemOutput = () => {
    const newItemArr = [
        {
            ...inputParam,
            placeholder:'输入变量名',
        },
        {
            ...selectParam,
            value:'String',
        },
        {
            ...inputParam,
            placeholder:'请描述变量的用途',
        },
        {
            ...deleteIconParam,
            style:{
                marginTop:'6px',
                fontSize:'20px',
            }
        },
    ];
    const list = bigModelNode.value.output.outputParams;
    const id = list.length===0?1:((list[list.length - 1] as any)?.id+1);
    bigModelNode.value.output.outputParams.push({
        id,
        list: newItemArr
    });
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
    const parent = modeRef.value.parentNode;
    const id = parent.getAttribute('data-id');
    eventBus.emit('deleteNode', {id});
}

const userSetting = () => {
    console.log('userSetting');
}
const exportJSONData = () => {
    console.log('exportJSONData');
}
const tabClick = (index:number,text:string) => {
    bigModelNode.value.output.export.tabindex = index;
    bigModelNode.value.output.export.tabText = text;
    if(index!==2){
        bigModelNode.value.output.outputParams[0].list[1].disabled = true;
    }
    else{
        bigModelNode.value.output.outputParams[0].list[1].disabled = false;
    }
}
onMounted(()=>{
    openAll();
    // 获取当前节点
    const parent = modeRef.value.parentNode;
    const id = parent.getAttribute('data-id');
    nodeId.value = id;
    // saveModelData(nodeId.value,bigModelNode.value);
});
watch(
    ()=>bigModelNode.value,
    (newValue:any)=>{
        if(updateType.value!=='history'){
            saveModelData(nodeId.value,newValue);
        }
    },
    { immediate: true, deep: true }
);
</script>
<template>
    <div class="big-model-node-wrapper" ref="modeRef">
        <div :class="[openCard?'big-model-node-header':'']">
            <div class="big-model-node-title">
                <el-button class="bm-n-t-icon" 
                :class="[openCard?'bm-n-is-active':'']"
                :icon="RightIcon"
                @click="openOrCloseCard" 
                />
                <img src="../images/icon-LLM.png" alt="bm-n-t-start-icon" class="bm-n-t-start-icon" />
                <div class="bm-n-t-text">
                    <el-input v-model="bigModelNode.title.value" :placeholder="bigModelNode.title.placeholder" :disabled="bigModelNode.title.disabled"
                    :style="bigModelNode.title.style"
                    ref="titleRef"
                    />
                </div>
                <ModelHeaderRight 
                @testRun="testRun"
                @reName="reName"
                @deleteNode="deleteNode"
                />
                
            </div>
            <div class="big-model-node-subtitle" v-if="openCard">
                <span>调用大语言模型,使用变量和提示词生成回复</span>
            </div>
        </div>
        
        <div class="big-model-node-content" v-if="openCard">
            <el-collapse @change="collapseChange"
            v-model="openCollapseArr"
            >
                <div class="big-model-node-content-item">
                    <el-collapse-item name="input" :disabled="true">
                        <template #title>
                            <el-button class="bm-n-collapse-icon" 
                            :class="[openCollapse['input']?'bm-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('input')"
                            />
                            <span class="bm-n-c-text">输入</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText5"
                                placement="top"
                            >
                                <el-icon class="bm-n-c-header-icon bm-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                            <div class="bm-n-c-header-right">
                                <el-checkbox v-model="bigModelNode.input.checkbox.selected" :disabled="bigModelNode.input.checkbox.disabled"
                                :style="bigModelNode.input.checkbox.style"
                                >{{bigModelNode.input.checkbox.value}}</el-checkbox>
                                <span class="bm-n-c-h-r-text">Bot对话历史</span>
                            </div>
                        </template>
                        <div class="bm-n-c-chat-history" v-if="bigModelNode.input.checkbox.selected">
                            <ModelTreeText :data="bigModelNode.input.treeData"/>
                        </div>
                        <div>
                            <ParamsItem :data="bigModelNode.input.inputParams"
                            key="bmInput"
                            @addItem="addItemInput"
                            :titles="inputTitles"
                            />
                        </div>
                    </el-collapse-item>
                </div>
                <div class="big-model-node-content-item">
                    <el-collapse-item name="notice" :disabled="true">
                        <template #title>
                            <el-button class="bm-n-collapse-icon" 
                            :class="[openCollapse['notice']?'bm-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('notice')"
                            />
                            <span class="bm-n-c-text">提示词</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText6"
                                placement="top"
                            >
                                <el-icon class="bm-n-c-header-icon bm-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                            <div class="bm-n-c-header-right">
                                <el-tooltip
                                    :offset="12"
                                    popper-class="tooltip-box-item-in-node"
                                    effect="dark"
                                    :content="toopTipText8"
                                    placement="top"
                                >
                                    <el-button class="bm-n-c-header-setting-icon" 
                                    :icon="UserSettingIcon"
                                    @click="userSetting" 
                                    />
                                </el-tooltip>
                            </div>
                        </template>
                        <div class="bm-n-c-result-content">
                            <el-input type="textarea" v-model="bigModelNode.notice.value" :placeholder="bigModelNode.notice.placeholder" :disabled="bigModelNode.notice.disabled"
                            :maxlength="bigModelNode.notice.maxlength"
                            :show-word-limit="bigModelNode.notice.showWordLimit"
                            :rows="bigModelNode.notice.rows"
                            :style="bigModelNode.notice.style"
                            />
                        </div>
                    </el-collapse-item>
                </div>
                <div class="big-model-node-content-item">
                    <el-collapse-item name="output" :disabled="true">
                        <template #title>
                            <el-button class="bm-n-collapse-icon" 
                            :class="[openCollapse['output']?'bm-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('output')"
                            />
                            <span class="bm-n-c-text">输出</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText7"
                                placement="top"
                            >
                                <el-icon class="bm-n-c-header-icon bm-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                            <div class="bm-n-c-header-right">
                                <el-dropdown>
                                <el-button class="bm-n-c-r-select-icon">
                                    <span class="bm-n-c-r-text">输出格式</span>
                                    <el-popover
                                        placement="top"
                                        title=""
                                        :width="200"
                                        trigger="hover"
                                        popper-class="bm-n-c-r-popover"
                                    >
                                        <template #reference>
                                            <el-icon class="bm-n-c-header-icon bm-n-c-header-icon-export-margin">
                                                <NoticeIcon />
                                            </el-icon>
                                        </template>
                                        <ul class="bm-n-c-sibling-br">
                                            <li><strong>文本</strong>: 使用普通文本格式回复</li>
                                            <li><strong>Markdown</strong>: 将引导模型使用Markdown格式输出回复</li>
                                            <li><strong>JSON</strong>: 将引导模型使用JSON格式输出</li>
                                        </ul>
                                    </el-popover>
                                    <span class="bm-n-c-r-export-text">{{bigModelNode.output.export.tabText}}</span>
                                    <el-icon class="bm-n-c-el-icon-right"><ArrowDown /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="tabClick(0,'文本')">文本</el-dropdown-item>
                                        <el-dropdown-item @click="tabClick(1,'Markdown')">Markdown</el-dropdown-item>
                                        <el-dropdown-item @click="tabClick(2,'Json')">Json</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                                </el-dropdown>
                                <el-tooltip
                                v-if="bigModelNode.output.export.tabindex===2"
                                :offset="12"
                                class="tooltip-box-item-export"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText1"
                                placement="top"
                                >
                                    <el-button class="bm-n-c-icon" 
                                    :icon="ExportIcon"
                                    @click="exportJSONData" 
                                    />
                                </el-tooltip>
                            </div>
                        </template>
                        <div>
                            <ParamsItem :data="bigModelNode.output.outputParams"
                            key="bmouput"
                            :showAddIcon="bigModelNode.output.export.tabindex===2"
                            @addItem="addItemOutput"
                            :titles="outputTitles"
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
.bm-n-c-el-icon-right{
    color: rgba(56, 55, 67, 0.6);
    font-weight:500;
    font-size: 12px;
    margin-left: 4px;
}
.bm-n-c-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    color: rgb(77, 83, 232);
    :hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.bm-n-c-r-select-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    &:hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.bm-n-c-sibling-br{
    padding-left: 18px;
}
.bm-n-c-r-popover{
    li{
        font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
        color: rgb(34, 34, 34);
        font-size: 14px;
        font-weight: 500;
    }
    li::marker{
        unicode-bidi: isolate;
        font-variant-numeric: tabular-nums;
        text-transform: none;
        text-indent: 0px !important;
        text-align: start !important;
        text-align-last: start !important;
    }
    ul>li {
        list-style-type: disc;
    }
    li+li{
        margin-top: 8px;
    }
    strong{
        font-weight: 700;
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
.big-model-node-wrapper{
    width: 100%; 
}
.big-model-node-header{
    margin-bottom: 16px;
}
.big-model-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.big-model-node-subtitle{
    color: rgba(28, 29, 35, .6);
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: left;
}


.big-model-node-content{
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
.big-model-node-content-item{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    position: relative;
    width: 100%;
}
.bm-n-t-icon{
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

.bm-n-c-text{
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-left: 4px;
}
.bm-n-c-result-content{
    margin-top: 8px;
    width: 100%;
}

.bm-n-collapse-icon{
    @extend .bm-n-t-icon;
    margin-right: 0px;
    font-size: 13px;
    transition: transform .3s;
    &:hover{
        background-color: transparent;
    }
}

.bm-n-c-header-icon-margin{
    margin: 0 12px 0 4px;
}
.bm-n-c-header-icon-export-margin{
    margin: 0 2px 0 4px;
}
.bm-n-c-header-icon{
    height: 12px;
    width: 12px;
    color: rgb(167, 169, 176);
    cursor: default;
}
.bm-n-c-header-setting-icon{
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
.bm-n-c-r-export-text{
    color: rgba(6, 7, 9, 0.8);
    font-size: 14px;
    font-weight: 400;
    cursor: grab;
}
.bm-n-c-r-text{
    color: rgba(6, 7, 9, 0.5);
    font-size: 12px;
    font-weight: 500;
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
}
.bm-n-c-header-right{
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
.bm-n-c-h-r-text{
    color: rgb(56, 55, 67);
    font-size: 14px;
    line-height: 20px;
    height: 20px;
}
.bm-n-c-chat-history{
    margin-top: 8px;
}
:deep(.el-button.is-active){
    background-color: transparent;
}

.bm-n-is-active {
    transform: rotate(90deg);
}
.bm-n-t-start-icon{
    width: 20px;
    height: 20px;
    // margin-right: 8px;
}
.bm-n-t-text{
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
div[data-id^="10002-"].vue-flow__node-default{
    width: 711px;
}
</style>