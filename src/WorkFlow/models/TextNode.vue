<script lang="ts" setup>
import {
    DeleteFilled,
} from '@element-plus/icons-vue'
import RightIcon from '../icons/RightIcon.vue'
import NoticeIcon from '../icons/NoticeIcon.vue'
import AddIcon from '../icons/AddIcon.vue';
import SettingIcon from '../icons/SettingIcon.vue';
import ParamsItem from '../basic/ParamsItem.vue'
import ModelHeaderRight from '../basic/ModelHeaderRight.vue'
import ModelTreeText from '../basic/ModelTreeText.vue'
import CustomSelectOptionItem from '../components/CustomSelectOptionItem.vue'
import { toopTipText12,toopTipText13,toopTipText14 } from '../data/tooltips'
import { textNodeParams } from '../data/node-params'
import { inputTextParam, selectParam, textareaParam,checkBoxParam,deleteIconParam } from '../data/node-params-template'
import { EventBus } from '../../utils/EventBus'

const eventBus = EventBus();
const openCard = ref(true);
const openCollapse:any = ref({});
const openCollapseArr:any = ref([]);
const titleRef:any = ref(null);
const collapseArr = ['input','string','output'];
const paramsData:any = ref(textNodeParams);
const modeRef:any = ref(null);

const textNode:any = ref({
    input:{
        inputParams:paramsData.value,
    },
    output:{
        // outputParams:paramsData1.value,
        // chatgpt历史数据
        treeData:{
            title:'output',
            label:'String',
            children:[]
        }
    },
    select:{
        type:'select',
        value:'1',
        options:[
            {label:'字符串拼接',value:'1'},
            {label:'字符串分隔',value:'2'}
        ],
        placeholder:'',
        noDataText:'暂无数据',
        warning:'',
        disabled:false,
        style:{
            width:'116px'
        },
    },
    splitString:{
        type:'select',
        value:'',
        options:[
            {label:'换行',value:'\\n',},
            {label:'制表符',value:'\\t'},
            {label:'句号',value:'。'},
            {label:'逗号',value:'，'},
            {label:'分号',value:'；'},
            {label:'空格',value:' '},
            {label:'',value:'',type:'others'},
        ],
        placeholder:'选择分隔符',
        noDataText:'暂无数据',
        warning:'',
        disabled:false,
        style:{},
    },
    string:{
        text:'字符串拼接',
        // 字符串拼接
        content:{
            // type:'textarea',
            value:'',
            placeholder:`可以使用{{变量名}}、{{变量名.子变量名}}、{{变量名[数组索引]}的方式引用输入参数中的变量`,
            warning:'',
            showWordLimit:false,
            rows:5, // 行数
            maxlength:1000000000, // 最大字数
            disabled:false,
            style:{},
            streamOutputValue:false,
        }
    },
    title:{
        type:'input',
        value:'文本处理',
        placeholder:'',
        warning:'',
        disabled: false,
        style:{},
    },
    
});
const selectedValue:any = ref(
    textNode.value.splitString.options
    .filter((item:any)=>item.value && item.type !== 'others')
    .map((item:any)=>item.value)
);

const inputTitles = ref([
    {name:'参数名',flexNum:'3'},
    {name:'参数值',flexNum:'2'},
    {name:'',flexNum:'3'},
    {name:'',flexNum:'b-26'}
]);
// 新增一条输入框
const addItemInput = () => {
    const newItemArr = [
        {
            ...inputTextParam,
            name:'String'+(paramsData.value.length+1),
            required:false,
            value:'',
            style:{
                height:'32px'
            }
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
    const id = paramsData.value.length===0?1:((paramsData.value[paramsData.value.length - 1] as any)?.id+1);
    (paramsData.value as any).push({
        id,
        list: newItemArr
    });
}
const useItem = (inputText:string) => {
    // console.log('useItem ', inputText, selectedValue.value)
    if(selectedValue.value.includes(inputText)){
        ElMessage({
        message: '存在重复的符号...',
        type: 'warning',
        });
        return;
    }
    textNode.value.splitString.value.push(inputText);
    selectedValue.value.push(inputText);
    // 插入到options中 倒数第二位
    textNode.value.splitString.options.splice(
        textNode.value.splitString.options.length-1,0,
        {
            label:inputText,
            value:inputText,
            type:'custom',
            checkBoxOptions:{
                type:'checkbox',
                value:'',
                selected:true,
                placeholder:'',
                warning:'',
                disabled:false,
                style:{},
            }
        }
    );

}
// 删除字符
const delSelectItem = (value:string,index:number) => {
    textNode.value.splitString.options = textNode.value.splitString.options.filter((item:any)=>item.value!==value);
    selectedValue.value = selectedValue.value.filter((item:string)=>item!==value);
    setTimeout(()=>{
        textNode.value.splitString.value = textNode.value.splitString.value.filter((item:any)=>item!==value);
    },80);
}
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
    const parent = modeRef.value.parentNode;
    const id = parent.getAttribute('data-id');
    eventBus.emit('deleteNode', {id});
}

const settingString = () => {
    console.log('settingString');
  
}
const appSelectChange = (value:string) => {
    console.log('appSelectChange', value, typeof value)
    if(value==='1'){
        textNode.value.string.text = '字符串拼接';
        textNode.value.output.treeData.label = 'String';
        // 输入的第一条可删除
        paramsData.value[0].list[3].actionDisabled = false;
        paramsData.value[0].list[3].style = {
            marginTop:'6px',
            fontSize:'20px',
            // cursor:'not-allowed'
        }
    }
    if(value==='2'){
        textNode.value.string.text = '分隔符';
        textNode.value.output.treeData.label = 'Array<String>';
        // 输入的第一条不可删除
        paramsData.value[0].list[3].actionDisabled = true;
        paramsData.value[0].list[3].style = {
            marginTop:'6px',
            fontSize:'20px',
            cursor:'not-allowed'
        }
    }
}
const splitSelectChange = (value:any) => {
    console.log('splitSelectChange',value,textNode.value.splitString.value)
    setTimeout(()=>{ // 利用js事件循环机制
        textNode.value.splitString.options.forEach((item:any,i:number)=>{
            if(value.includes(item.value)){
                // 勾选checkbox
                textNode.value.splitString.options[i].checkBoxOptions.selected = true;
            }
            else{
                // 取消勾选checkbox
                textNode.value.splitString.options[i].checkBoxOptions.selected = false;
            }
        });
    },80);
}
const selectChange = (options:any) => {
    const { value,i } = options || {};
    if(value == 1){
        console.log('selectChange', value)
        paramsData.value[i].list[2] = {
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
        paramsData.value[i].list[2] = {
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
    // 初始化分隔符select options 的checkBoxOptions
    textNode.value.splitString.options.forEach((_:any,i:number)=>{
        (textNode.value.splitString.options[i] as any).checkBoxOptions = {
            type:'checkbox',
            value:'',
            selected:false,
            placeholder:'',
            warning:'',
            disabled:false,
            style:{},
        }
    });
    openAll();
});
</script>
<template>
    <div class="text-node-wrapper" ref="modeRef">
        <div :class="[openCard?'text-node-header':'']">
            <div class="text-node-title">
                <el-button class="t-n-t-icon" 
                :class="[openCard?'t-n-is-active':'']"
                :icon="RightIcon"
                @click="openOrCloseCard" 
                />
                <img src="../images/icon-text.png" alt="t-n-t-start-icon" class="t-n-t-start-icon" />
                <div class="t-n-t-text">
                    <el-input v-model="textNode.title.value" :placeholder="textNode.title.placeholder" :disabled="textNode.title.disabled"
                    :style="textNode.title.style"
                    ref="titleRef"
                    />
                </div>
                <ModelHeaderRight 
                @testRun="testRun"
                @reName="reName"
                @deleteNode="deleteNode"
                />
                
            </div>
            <div class="text-node-subtitle" v-if="openCard">
                <span>用于处理多个字符串类型变量的格式</span>
            </div>
        </div>
        <div class="text-node-select-app">
            <div class="t-n-s-a-title">
                <el-tooltip
                    :offset="12"
                    popper-class="tooltip-box-item-in-node"
                    effect="dark"
                    :content="'选择应用'"
                    placement="top"
                >
                    <span class="t-n-s-a-title-text">选择应用</span>
                </el-tooltip>
            </div>
            <div class="t-n-s-a-select">
                <el-select v-model="textNode.select.value" :placeholder="textNode.select.placeholder" :disabled="textNode.select.disabled"
                :no-data-text="textNode.select.noDataText"
                :style="textNode.select.style"
                @change="appSelectChange"
                >
                    <el-option
                        v-for="(oItem,opIndex) in textNode.select.options"
                        :key="opIndex"
                        :label="oItem.label"
                        :value="oItem.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="text-node-content" v-if="openCard">
            <el-collapse @change="collapseChange"
            v-model="openCollapseArr"
            >
                <div class="text-node-content-item">
                    <el-collapse-item name="input" :disabled="true">
                        <template #title>
                            <el-button class="t-n-collapse-icon" 
                            :class="[openCollapse['input']?'t-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('input')"
                            />
                            <span class="t-n-c-text">输入</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText12"
                                placement="top"
                            >
                                <el-icon class="t-n-c-header-icon t-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <div>
                            <ParamsItem :data="paramsData"
                            key="bmInput"
                            :titles="inputTitles"
                            :showAddIcon="textNode.select.value==='1'"
                            @addItem="addItemInput"
                            @selectChange="selectChange"
                            />
                        </div>
                    </el-collapse-item>
                </div>
                <div class="text-node-content-item">
                    <el-collapse-item name="string" :disabled="true">
                        <template #title>
                            <el-button class="t-n-collapse-icon" 
                            :class="[openCollapse['string']?'t-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('string')"
                            />
                            <span class="t-n-c-text">{{textNode.string.text}}</span>
                            <el-popover
                                v-if="textNode.select.value==='1'"
                                placement="top"
                                title=""
                                :width="200"
                                trigger="hover"
                                popper-class="t-n-c-r-popover"
                            >
                                <template #reference>
                                    <el-icon class="t-n-c-header-icon t-n-c-header-icon-export-margin">
                                        <NoticeIcon />
                                    </el-icon>
                                </template>
                                <div class="t-n-c-text-table">table</div>
                            </el-popover>
                            <el-tooltip
                                v-if="textNode.select.value==='2'"
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText14"
                                placement="top"
                            >
                                <el-icon class="t-n-c-header-icon t-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                            <div class="t-n-c-header-right"
                            v-if="textNode.select.value==='1'"
                            >
                                <el-button class="t-n-c-header-add-icon" 
                                :icon="SettingIcon"
                                @click="settingString" 
                                />
                            </div>
                        </template>
                        <div class="t-n-c-result-content">
                            <el-input 
                            v-if="textNode.select.value==='1'"
                            type="textarea" 
                            v-model="textNode.string.content.value" 
                            :placeholder="textNode.string.content.placeholder" 
                            :disabled="textNode.string.content.disabled"
                            :maxlength="textNode.string.content.maxlength"
                            :show-word-limit="textNode.string.content.showWordLimit"
                            :rows="textNode.string.content.rows"
                            :style="textNode.string.content.style"
                            />
                            <el-select 
                            v-if="textNode.select.value==='2'"
                            multiple
                            popper-class="t-n-c-result-content-select"
                            v-model="textNode.splitString.value" 
                            :placeholder="textNode.splitString.placeholder" 
                            :disabled="textNode.splitString.disabled"
                            :no-data-text="textNode.splitString.noDataText"
                            :style="textNode.splitString.style"
                            @change="splitSelectChange"
                            >
                                <el-option
                                    v-for="(oItem,opIndex) in textNode.splitString.options"
                                    :key="oItem.value"
                                    :label="oItem.label"
                                    :value="oItem.value"
                                    :disabled="oItem.type==='others'"
                                >
                                    <CustomSelectOptionItem
                                    v-if="oItem.type==='others'"
                                    @useItem="useItem"
                                    />
                                    <div class="t-n-c-select-option"
                                    v-else-if="oItem.type==='custom'"
                                    >
                                        <el-checkbox v-model="oItem.checkBoxOptions.selected" 
                                        :disabled="oItem.checkBoxOptions.disabled"
                                        :style="oItem.checkBoxOptions.style"
                                        >{{oItem.checkBoxOptions.value}}</el-checkbox>
                                        <span class="t-n-c-s-o-label">{{oItem.label}}</span>
                                        <div class="t-n-c-s-o-right">
                                            <el-tooltip
                                                :offset="12"
                                                popper-class="tooltip-box-item-delete"
                                                effect="light"
                                                :content="'删除'"
                                                placement="top"
                                            >
                                                <el-icon class="t-n-c-s-o-del-icon"
                                                @click="delSelectItem(oItem.value,opIndex)"
                                                ><DeleteFilled /></el-icon>
                                            </el-tooltip>
                                            
                                        </div>
                                    </div>
                                    <div class="t-n-c-select-option"
                                    v-else
                                    >
                                        <el-checkbox v-model="oItem.checkBoxOptions.selected" 
                                        :disabled="oItem.checkBoxOptions.disabled"
                                        :style="oItem.checkBoxOptions.style"
                                        >{{oItem.checkBoxOptions.value}}</el-checkbox>
                                        <span class="t-n-c-s-o-label">{{oItem.label}}</span>
                                        <span class="t-n-c-s-o-value">({{oItem.value}})</span>
                                    </div>
                                </el-option>
                            </el-select>
                        </div>
                    </el-collapse-item>
                </div>
                <div class="text-node-content-item">
                    <el-collapse-item name="output" :disabled="true">
                        <template #title>
                            <el-button class="t-n-collapse-icon" 
                            :class="[openCollapse['output']?'t-n-is-active':'']"
                            :icon="RightIcon"
                            @click="clickCollapseItem('output')"
                            />
                            <span class="t-n-c-text">输出</span>
                            <el-tooltip
                                :offset="12"
                                popper-class="tooltip-box-item-in-node"
                                effect="dark"
                                :content="toopTipText13"
                                placement="top"
                            >
                                <el-icon class="t-n-c-header-icon t-n-c-header-icon-margin">
                                    <NoticeIcon />
                                </el-icon>
                            </el-tooltip>
                        </template>
                        <div class="t-n-c-chat-outputlist">
                            <ModelTreeText :data="textNode.output.treeData"
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
.t-n-c-r-popover{
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
.t-n-c-el-icon-right{
    color: rgba(56, 55, 67, 0.6);
    font-weight:500;
    font-size: 12px;
    margin-left: 4px;
}
.t-n-c-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    color: rgb(77, 83, 232);
    :hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.t-n-c-r-select-icon{
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
.text-node-wrapper{
    width: 100%; 
}
.text-node-header{
    margin-bottom: 16px;
}
.text-node-title{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.text-node-subtitle{
    color: rgba(28, 29, 35, .6);
    font-size: 14px;
    line-height: 22px;
    margin-top: 8px;
    text-align: left;
}

.text-node-select-app{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
}
.t-n-s-a-title{
    flex: 2;
    text-align: left;
    &-text{
        color: rgb(29, 28, 35);
        font-weight: 600;
        font-size: 14px;
        font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
}
.t-n-s-a-select{
    flex: 3;
    text-align: right;
}

.text-node-content{
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
.text-node-content-item{
    background: rgba(46, 46, 56, .04);
    border-radius: 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 12px;
    position: relative;
    width: 100%;
}
.t-n-t-icon{
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

.t-n-c-text{
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-left: 4px;
}
.t-n-c-result-content{
    // margin-top: 8px;
    width: 100%;
}

.t-n-c-select-option{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.t-n-c-s-o-checkbox{
    width: 12px;
}
.t-n-c-s-o-label{
    margin-left: 8px;
    color: rgb(56, 55, 67);
    font-size: 14px;
    // &-selected {
    //     font-weight: 600;
    // }
}
.t-n-c-s-o-value{
    color: rgba(29, 28, 35, .35);
    font-size: 14px;
    margin-left: 4px;
}
.t-n-c-s-o-del-icon{
    color: rgba(56, 55, 67, 0.6);
    font-weight:600;
    font-size: 12px;
    margin-right: 4px;
}
.t-n-c-s-o-right{
    flex: 1;
    text-align: right;
}
.t-n-c-result-nodata{
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    color:rgba(6, 7, 9, 0.3);
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe Ul,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    padding: 12px 0px;
    line-height:18px;
}

.t-n-collapse-icon{
    @extend .t-n-t-icon;
    margin-right: 0px;
    font-size: 13px;
    transition: transform .3s;
    &:hover{
        background-color: transparent;
    }
}

.t-n-c-header-icon-margin{
    margin: 0 12px 0 4px;
}
.t-n-c-header-icon-export-margin{
    margin: 0 2px 0 4px;
}
.t-n-c-header-icon{
    height: 12px;
    width: 12px;
    color: rgb(167, 169, 176);
    cursor: default;
}
.t-n-c-header-add-icon{
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
.t-n-c-r-export-text{
    color: rgba(6, 7, 9, 0.8);
    font-size: 14px;
    font-weight: 400;
    cursor: grab;
}
.t-n-c-r-text{
    color: rgba(6, 7, 9, 0.5);
    font-size: 12px;
    font-weight: 500;
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
}
.t-n-c-header-right{
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
}
.t-n-c-h-r-text{
    color: rgb(56, 55, 67);
    font-size: 14px;
    line-height: 20px;
    height: 20px;
}
.t-n-c-chat-outputlist{
    margin-top: 8px;
    padding-left: 26px;
}
:deep(.el-button.is-active){
    background-color: transparent;
}

.t-n-is-active {
    transform: rotate(90deg);
}
.t-n-t-start-icon{
    width: 20px;
    height: 20px;
    // margin-right: 8px;
}
.t-n-t-text{
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
div[data-id^="10008-"].vue-flow__node-default{
    width: 507px;
}
.t-n-c-result-content-select{
    border-radius: 8px;
}
.t-n-c-result-content-select .el-select-dropdown__item{
    padding: 0px 12px;
}   
.t-n-c-result-content-select .el-select-dropdown__item.is-disabled {
    cursor: pointer;
}
.t-n-c-result-content-select .el-select-dropdown__item.is-selected::after {
    display: none;
}
.tooltip-box-item-delete{
    --el-color-primary:rgba( 77,83,232 ,1)!important;
}
</style>