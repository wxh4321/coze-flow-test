<script lang="ts" setup>
import Header from './Header.vue'
import {
    ArrowLeftBold,
    ArrowRightBold,
    ArrowRight,
    ArrowLeft
} from '@element-plus/icons-vue'
import WorkFlowRunResultIcon from './icons/WorkFlowRunResultIcon.vue';
import WorkFlowRunResultCloseIcon from './icons/WorkFlowRunResultCLoseIcon.vue';

import CopyIcon from './icons/CopyIcon.vue';

const leftClose = ref(false);

const runType = ref('');
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
    console.log('aaaa, res', res);
}
const tryRun = () => {
    console.log('tryRun');
    showRunResult('try-run');
}
const submitProject = () => {
    console.log('submitProject');
}
const copyResult = () => {
    console.log('copyResult');
}
</script>
<template>
    <Header 
        @clickResult="clickResult"
        @tryRun="tryRun"
        @submitProject="submitProject"
    />
    <div class="workflow-wrapper">
        <el-button :icon="ArrowRight"
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
            <div class="workflow-content"></div>
        </div>
        <div class="workflow-right"></div>
        <div class="workflow-run-result" :class="[runType!=='run'?'workflow-container-right-close':'']">
            <div class="workflow-result-title">
                <el-button :icon="ArrowRightBold" round :size="'small'"
                class="w-l-right-icon"
                @click="closeResult"
                />
                <span class="w-l-run-result-text">运行结果</span>
            </div>
            <div class="workflow-run-result-content">
                <div class="w-r-r-text-area">
                    <span>输出变量</span>
                    <el-button :icon="CopyIcon"
                    class="w-r-r-text-icon"
                    @click="copyResult"
                    />
                </div>
                <div class="w-r-r-json">
                    <span><span class="w-r-r-json-key">{{'gggg'}}</span> : {{'88uuuuu - ggggg -  88uuuuu'}}</span>
                </div>
            </div>
        </div>
    </div>
    <el-drawer v-model="visible" :show-close="false">
        <template #header="{ titleId, titleClass }">
            <div class="w-try-run-flex">
                <el-button class="w-try-run-close-icon" 
                :icon="WorkFlowRunResultCloseIcon"
                @click="closeResult" 
                />
                <h4 :id="titleId" class="w-try-run-close-title">This is a custom header!</h4>
            </div>
            
        </template>
        This is drawer content.
    </el-drawer>
</template>
<style lang="scss" scoped>
:deep(.el-button--small.is-round){
    padding: 0 6px;
    border: 1px solid transparent;
    border-radius: 8px;
}
.w-try-run-close-title{

}
.w-try-run-flex{
    display: flex;
    flex-direction: row;
    align-items: center;

}
.w-try-run-close-icon{
    height: 36px;
    width: 36px;
    z-index: 50;
    border:1px solid transparent;
    background: transparent;
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
    padding: 0px 16px;
    text-align: left;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.workflow-result-title{
    padding: 16px 16px 24px;
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
.w-l-run-result-text{
    color: rgba( 56,55,67 ,1);
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    margin-left: 8px;
}
.w-l-left-icon,
.w-l-right-icon
{
    margin-right: 0px;
}
.workflow-wrapper{
    background-color: #f2f3f5;
    box-sizing: border-box;
    position: relative;
    height: 100%;    
    display: flex;
    flex-direction: row;
    overflow: hidden;
}
.workflow-content{
    padding: 0px 16px;
    display: flex;
    flex: 1 1;
    flex-direction: row;
    overflow: auto;
    position: relative;
}
.workflow-run-result-content{
    position: relative;
    padding: 0 24px;
}
.w-r-r-text-icon{
    border: 1px solid transparent;
    background: transparent;
    padding: 0;
}
.w-r-r-json{
    background: rgba(46, 46, 56, .04);
    border: 1px solid rgba(29, 28, 35, .08);
    border-radius: 8px;
    max-height: 272px;
    overflow-y: auto;
    padding: 6px 12px;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgb(29, 28, 35);
}
.w-r-r-json-key{
    color: rgb(77, 83, 232);
}
.w-r-r-text-area{
    align-items: center;
    color: #1d1c23;
    column-gap: 8px;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    margin-bottom: 12px;
    margin-top: 16px;
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