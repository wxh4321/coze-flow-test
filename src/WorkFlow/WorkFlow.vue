<script lang="ts" setup>
interface inputDataProp {
    [key:string]:any;
}
import Header from './Header.vue'
import Models from './Models.vue'
import VueFlow from './VueFlow.vue'
import RunResult from './basic/RunResult.vue';

import {
    ArrowLeftBold
} from '@element-plus/icons-vue'
import WorkFlowRunResultIcon from './icons/WorkFlowRunResultIcon.vue';
import RunIcon from './icons/RunIcon.vue';
import MenuIcon from './icons/MenuIcon.vue';
import WorkFlowRunResultCloseIcon from './icons/WorkFlowRunResultCLoseIcon.vue';

import { modelItemDataProp } from './data/data';
import { debounce, deepClone } from '../utils'
import { useGlobalStore } from '../store';

const globalStore = useGlobalStore();
const workFlowData:any = ref({});
const leftClose = ref(false);

const runType = ref('');
const inputData:inputDataProp = ref({});
const visible = computed(()=>{ 
    return runType.value==='try-run';
}) 
const closeOrOpenLeftArea = () => {
    leftClose.value =!leftClose.value;
}
/**
 * 
 * @param type run 运行 try-run 试运行
 */
const showRunResult = (type='run') => {
    runType.value = type;
}

const closeResult = () => {
    runType.value = '';
}
const clickResult = (res:Boolean)=>{
    console.log('clickResult ', res);
}
const tryRun = () => {
    console.log('tryRun');
    showRunResult('try-run');
}
const submitProject = () => {
    console.log('submitProject');
}
const runProject = () => {
    console.log('runProject');
}
const copyResult = () => {
    console.log('copyResult');
}
const addModel = (item:modelItemDataProp) => {
   console.log('addModel',item);
}
const setData = (flowData:any) => {
    workFlowData.value.flowData = flowData;
}
const workFlowDataDebounce = debounce((data: any) => {
    console.log('workFlowDataDebounce ', data);
    globalStore.setWorkFlowState(deepClone(data));
}, 100);

watch(
    ()=>workFlowData.value,
    (newVal)=>{
        workFlowDataDebounce(newVal);
    },
    { immediate: true, deep: true }
);

</script>
<template>
    <Header 
        @clickResult="clickResult"
        @tryRun="tryRun"
        @submitProject="submitProject"
    />
    <div class="workflow-wrapper">
        <el-button :icon="MenuIcon"
        class="w-l-left-close-icon"
        v-if="leftClose"
        @click="closeOrOpenLeftArea"
        />
        <el-button :icon="WorkFlowRunResultIcon"
        class="w-l-right-result-icon"
        v-if="runType===''"
        @click="showRunResult()"
        />
        <div class="workflow-left" :class="[leftClose?'workflow-container-close':'']">
            <div class="workflow-title">
                <span class="w-l-text">选择节点：</span>
                <el-button :icon="ArrowLeftBold" round :size="'small'"
                class="w-l-left-icon"
                @click="closeOrOpenLeftArea"
                />
            </div>
            <div class="workflow-content">
                <Models @addModel="addModel"/>
            </div>
        </div>
        <div class="workflow-right">
            <VueFlow @setData="setData"/>
        </div>
        <div class="workflow-run-result" :class="[runType!=='run'?'workflow-container-right-close':'']">
            <RunResult 
            @closeResult="closeResult"
            @copyResult="copyResult"
            />
        </div>
    </div>
    <div>
        <el-drawer :model-value="visible" :show-close="false"
        @close="closeResult"
        size="600px"
        class="workflow-el-drawer-wrapper"
        >
            <template #header="{}">
                <div class="w-try-run-flex">
                    <el-button class="w-try-run-close-icon" 
                    :icon="WorkFlowRunResultCloseIcon"
                    @click="closeResult" 
                    />
                    <span class="w-try-run-close-title">试运行</span>
                </div>
                
            </template>
            <div class="w-try-run-start w-try-r-s">
                <img src="./images/icon-start.png" alt="w-try-run-icon-start" class="w-try-run-icon-start" />
                <span class="w-try-run-start-text">开始节点</span>
            </div>
            <div class="w-try-run-default-param w-try-run-d-p">
                <span class="w-try-run-d-p-text">{{'BOT_USER_INPUT'}}</span>
                <span class="w-try-run-d-p-label">{{'String'}}</span>
            </div>
            <div class="w-try-run-input">
                <el-input v-model="inputData['BOT_USER_INPUT']" style="width: 100%" placeholder="请输入BOT_USER_INPUT" 
                :clearable="true"
                />
            </div>
            <template #footer="{}">
                <div class="w-try-run-button">
                    <el-button :icon="RunIcon"
                    class="w-t-r-b"
                    @click="runProject"
                    >
                    运行
                    </el-button>
                </div>
            </template>
            
        </el-drawer>
    </div>
</template>
<style lang="scss" scoped>
:deep(.el-button--small.is-round){
    padding: 0 6px;
    border: 1px solid transparent;
    border-radius: 8px;
}
.workflow-el-drawer-wrapper{
    position: relative;
    background: #f7f7fa;
}
:deep(.el-drawer){
    background-color: #f7f7fa;
}
:deep(.el-drawer__header){
    margin-bottom: 0px;
}
.w-try-run-button{
   display: flex;
   justify-content: flex-end;
}
.w-t-r-b{
    background-color: rgb(77,83,232);
    border-radius: 8px;
    color:#fff;
    border: 1px solid transparent;
    align-items: center;
    box-shadow: none;
    cursor: pointer;
    display: inline-flex;
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    font-size: 14px;
    font-weight: 600;
    height: 32px;
    justify-content: center;
    line-height: 22px;
    outline: none;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    min-width: 96px;
}
.w-t-r-b:hover{
    background-color:rgba( 59,62,196 ,1);
}
.w-try-run-default-param,
.w-try-run-start{
    display: flex;
    flex-direction: flex;
    align-items: center;
}
.w-try-run-input{
    box-sizing: border-box;
}
:deep(.el-input__wrapper){
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid rgba( 56,55,67 ,0.08);
}
.w-try-run-icon-start{
    border-radius: 4px;
    flex-shrink: 0;
    height: auto;
    margin-right: 8px;
    width: 20px;
}
.w-try-run-start-text{
    color: #1d1c23;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
}
.w-try-r-s{
    margin-bottom: 12px;
}
.w-try-run-d-p{
    line-height: 22px;
    font-size: 12px;
    margin-bottom: 8px;
    overflow-wrap: break-word;
}
.w-try-run-d-p-text{
    color: #1d1c23;
    font-weight: 500;
}
.w-try-run-d-p-label{
    color: rgba(29, 28, 35, .35);
    margin-left: 8px;
}
.w-try-run-close-title{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    color:rgb(56, 55, 67);
}
.w-try-run-flex{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.w-try-run-close-icon{
    height: 32px;
    width: 32px;
    z-index: 50;
    font-size: 24px;
    border:1px solid transparent;
    background: transparent;
    margin-right: 8px;
    color: rgb(28, 29, 35);
}
.w-l-right-result-icon{
    position: absolute;
    right: 0;
    top: 38px;
    height: 36px;
    width: 36px;
    z-index: 50;
    border: 1px solid transparent;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 0px;
    border-top-left-radius: 10px;
    border-top-right-radius: 0px;
}
.w-l-left-close-icon{
    position: absolute;
    left: 0;
    top: 16px;
    height: 36px;
    width: 36px;
    z-index: 2;
    border: 1px solid transparent;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 10px;
}

.workflow-title{
    padding: 0px 16px 16px;
    text-align: left;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.w-l-text{
    flex: 1;
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    margin: 0;
}
.workflow-run-result{
    height: 100%;
    background: #f7f7fa;
    border-left: 1px solid rgba(29,28,35,.08);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    position: relative;
    transition: width .1s linear,padding .1s linear;
    width: 300px;
}

.w-l-left-icon{
    margin-right: 16px;
    color: rgb(77, 83, 232);
    font-size: 10px;
}

.workflow-wrapper{
    background-color: #f2f3f5;
    box-sizing: border-box;
    position: relative;
    height: calc(100% - 72px);
    display: flex;
    flex-direction: row;
    overflow: hidden;
}
.workflow-content{
    display: flex;
    flex: 1 1;
    flex-direction: row;
    overflow: auto;
    position: relative;
}

.workflow-left{
    height: 100%;
    overflow-y: auto;
    background: #f7f7fa;
    border-right: 1px solid rgba(29,28,35,.08);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    position: relative;
    transition: width .1s linear,padding .1s linear;
    width: 260px;
}
.workflow-container-close {
    left: 0;
    padding: 0;
    top: 0;
    width: 0;
    z-index: 100;
}
.workflow-container-right-close {
    position: relative;
    right: 0;
    padding: 0;
    top: 0;
    width: 0;
    z-index: 100;
}
.workflow-right{
    flex:1;
}

</style>