<script lang="ts" setup>
import {
    ArrowLeft,
} from '@element-plus/icons-vue'
const labels = ref([
    'test',
    '已自动保存 14:12:28'
]);
const showSaveResult = ref(false);
const emit = defineEmits(['clickResult', 'tryRun', 'submitProject']);


const goBack = () => {
    window.history.back();
}
const clickResult = () => {
    showSaveResult.value = !showSaveResult.value;
    emit('clickResult',showSaveResult.value);
}
const tryRun = () => {
    emit('tryRun');
}
const submitProject = () => {
    emit('submitProject');
}
</script>
<template>
    <div class="workflow-header-wrapper">
        <el-button :icon="ArrowLeft" class="w-h-left-icon" @click="goBack" />
        <img src="./images/workflow.png" alt="w-h-title-icon" class="w-h-title-icon" />
        <div class="workflow-flex">
            <div class="w-h-title">
                <span class="w-h-t-text">测试</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" fill="none" viewBox="0 0 17 16">
                    <path stroke="#1D1C23" stroke-linecap="round" stroke-opacity="0.6" stroke-width="1.33"
                        d="M13.091 8v4.254c0 .735-.595 1.33-1.33 1.33h-8.01a1.33 1.33 0 0 1-1.33-1.33v-8.01c0-.734.596-1.33 1.33-1.33h4.255">
                    </path>
                    <path fill="#1D1C23" fill-opacity="0.6" fill-rule="evenodd"
                        d="M11.911 2.918 7.305 7.526c-.293.293-.263 1.095-.246 1.343a.085.085 0 0 0 .08.08c.25.018 1.052.05 1.345-.244l4.606-4.607-1.179-1.18Zm1.572.786.555-.555c.352-.351.373-.9.047-1.226-.326-.325-.875-.304-1.226.047l-.555.555 1.18 1.18Z"
                        clip-rule="evenodd"></path>
                </svg>
            </div>
            <div class="w-h-label">
                <div class="workflow-flex w-h-first-label w-h-first-label-padding">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                        <circle cx="5" cy="5" r="5" fill="currentColor" fill-opacity="0.5"></circle>
                        <path stroke="#fff" stroke-linecap="round" d="M4.5 2.5v2.9a.1.1 0 0 0 .1.1l2.9-.001"></path>
                    </svg>
                    <span class="w-h-l-text">{{ '未发布' }}</span>
                </div>
                <span class="w-h-l-text w-h-l-text-padding" v-for="(text, i) in labels" :key="'text' + i">{{ text }}</span>
            </div>
        </div>
        <div class="w-h-right">
            <span class="w-h-r-text" @click="clickResult">{{ !showSaveResult ? '显示上次运行结果' : '隐藏运行结果' }}</span>
            <div class="w-h-r-try-run" @click="tryRun">试运行</div>
            <el-button type="primary" class="w-h-r-button" @click="submitProject">发布</el-button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.w-h-r-try-run{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: rgb(0, 0, 0);
    cursor: pointer;
}
.w-h-r-button{
    background-color: rgb(78, 64, 229);
    border-radius: 8px;
}

.w-h-r-text {
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #1d1c2399;
    font-weight: 600;
    cursor: pointer;
}

.w-h-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    flex: 1;
}

.workflow-flex {
    flex-direction: row;
    align-items: center;
}

.w-h-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.w-h-label {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 8px;
}

.w-h-t-text {
    color: #1d1c23;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-right: 6px;
}

.w-h-first-label-padding {
    padding: 0px 6px;
}

.w-h-first-label {
    background-color: #f0f0f5;
    border-radius: 4px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 4px;
}

.w-h-l-text-padding {
    padding: 0 6px;
}

.w-h-l-text {
    background-color: #f0f0f5;
    border-radius: 4px;
    color: rgba(29, 28, 35, .5);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
}

.w-h-title-icon {
    display: block;
    height: 30px;
    object-fit: cover;
    width: 30px;
    border-radius: 4px;
    margin-right: 12px;
}

.workflow-header-wrapper {
    padding: 16px 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.w-h-left-icon {
    margin-left: 4px;
    margin-right: 20px;
    border-radius: 4px;
    font-size: 18px;
    height: 24px;
    padding: 4px !important;
    color: rgba(56, 55, 67, 0.8);
    border: 1px solid transparent;
}
</style>