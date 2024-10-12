<script lang="ts" setup>

import {
    ArrowRightBold,
} from '@element-plus/icons-vue'
const props = defineProps({
    data:{
        type: Object as any,
        default:{}
    }
});
const emit = defineEmits(['closeResult','copyResult']);
const closeResult = () => {
    emit('closeResult');
}
const copyResult = () => {
    emit('copyResult');
}
</script>

<template>
    <div class="workflow-result-title">
        <el-button :icon="ArrowRightBold" round :size="'small'"
        class="w-l-right-icon"
        @click="closeResult"
        />
        <span class="w-l-run-result-text">运行结果</span>
    </div>
    <div class="workflow-run-result-content" v-if="props.data && props.data.length">
        <div class="w-r-r-text-area">
            <span>输出变量</span>
            <el-button 
            class="w-r-r-text-icon"
            @click="copyResult"
            >
                <IconCopy/>
            </el-button>
        </div>
        <div class="w-r-r-json">
            <span><span class="w-r-r-json-key">{{'gggg'}}</span> : {{'88uuuuu - ggggg -  88uuuuu'}}</span>
        </div>
    </div>
    <div v-else class="workflow-run-result-content w-r-flex">
        <el-button
        class="w-r-icon"
        >
            <IconVideo/>
        </el-button>
        <div class="w-r-text">暂无运行结果</div>
        <div class="w-r-subtext">点击“试运行”按钮，运行结果将会在这里显示</div>
    </div>
</template>
<style lang="scss" scoped>
.w-r-subtext{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color:rgba( 56,55,67 ,0.35);
}
.w-r-text{
    font-weight: 500;
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 22px;
    margin: 0;
    color:rgb(56, 55, 67);
}
.w-r-icon:hover,
.w-r-icon{
    justify-content: center;
    background-color: transparent;
    border: 1px solid transparent;
    color:rgba(6, 7, 9, 0.3);
    font-size: 44px;
    height:44px;
    line-height: 44px;
}
.w-r-flex{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
.workflow-result-title{
    padding: 16px 16px 24px;
    text-align: left;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.w-l-right-icon{
    margin-right: 0px;
}
.w-l-run-result-text{
    color: rgba( 56,55,67 ,1);
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    margin-left: 8px;
}
.workflow-run-result-content{
    position: relative;
    padding: 0 24px;
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
</style>