<script lang="ts" setup>
import BackOffIcon from '../icons/BackOffIcon.vue';
import ForwardIcon from '../icons/ForwardIcon.vue';
import MinusIcon from '../icons/MinusIcon.vue';
import PlusIcon from '../icons/PlusIcon.vue';
import SelfAdaptionIcon from '../icons/SelfAdaptionIcon.vue';
import FoldAllNodeIcon from '../icons/FoldAllNodeIcon.vue';
import OpenAllNodeIcon from '../icons/OpenAllNodeIcon.vue';
import BrokenLineIcon from '../icons/BrokenLineIcon.vue';
import SmoothLineIcon from '../icons/SmoothLineIcon.vue';
import { EventBus } from '../../utils/EventBus';

const eventBus = EventBus();

const props = defineProps({
    openAllNode:{
        type:Boolean,
        default:false
    },
    isBrokenLine:{
        type:Boolean,
        default:false
    },
    disabledBackStep:{
        type:Boolean,
        default:false
    },
    disabledForwardStep:{
        type:Boolean,
        default:false
    },
    zoomPercent:{
        type:Number,
        default:-1
    }
});
const emit = defineEmits(['backStep','forwardStep','minusFlow','plusFlow','selfAdaption',
'openOrCloseAllNode','changeLineType'
]);
// 后退
const backStep = () => {
    eventBus.emit('updateNodeData','history');
    setTimeout(()=>{
        emit('backStep');
    },100);
}
// 前进
const forwardStep = () => {
    eventBus.emit('updateNodeData','history');
    setTimeout(()=>{
        emit('forwardStep');
    },100);
}
// 缩小画布
const minusFlow = () => {
    emit('minusFlow');
}
// 放大画布
const plusFlow = () => {
    emit('plusFlow');
}
// 自适应
const selfAdaption = () => {
    emit('selfAdaption');
}
const openOrCloseAllNode = () => {
    emit('openOrCloseAllNode');
}

// 切换线类型
const changeLineType = () => {
    emit('changeLineType');
}
const mouseLeave = () => {
    eventBus.emit('updateNodeData','nothistory');
}
</script>
<template>
    <div class="flow-controls-wrapper" 
    @mouseleave="mouseLeave"
    >
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
        >
            <template #content>
                <div class="f-c-content">
                    <span>撤销</span>
                    <div class="f-c-tag-container">
                        <div class="f-c-tag">Ctrl</div>
                        <div class="f-c-tag">z</div>
                    </div>
                </div>
            </template>
            <el-button class="basic-flow-controls-icon" 
            :class="[props.disabledBackStep?'basic-flow-controls-icon-disabled':'']"
            :icon="BackOffIcon" @click="backStep" 
            :disabled="props.disabledBackStep"
            />
        </el-tooltip>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
        >
            <template #content>
                <div class="f-c-content">
                    <span>重做</span>
                    <div class="f-c-tag-container">
                        <div class="f-c-tag">Ctrl</div> 
                        <div class="f-c-tag">shift</div>
                        <div class="f-c-tag">z</div>
                    </div>
                </div>
            </template>
            <el-button class="basic-flow-controls-icon" 
            :class="[props.disabledForwardStep?'basic-flow-controls-icon-disabled':'']"
            :icon="ForwardIcon" @click="forwardStep" 
            :disabled="props.disabledForwardStep"
            />
        </el-tooltip>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
        >
            <template #content>
                <div class="f-c-content">
                    <span>缩小</span>
                    <div class="f-c-tag-container">
                        <div class="f-c-tag">Ctrl</div> 
                        <div class="f-c-tag">-</div>
                    </div>
                </div>
            </template>
            <el-button class="basic-flow-controls-icon" :icon="MinusIcon" @click="minusFlow" />
        </el-tooltip>
        <div class="f-c-zoom-percent">{{Math.floor(props.zoomPercent*100)}}%</div>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
        >
            <template #content>
                <div class="f-c-content">
                    <span>放大</span>
                    <div class="f-c-tag-container">
                        <div class="f-c-tag">Ctrl</div> 
                        <div class="f-c-tag">+</div>
                    </div>
                </div>
            </template>
            <el-button class="basic-flow-controls-icon" :icon="PlusIcon" @click="plusFlow" />
        </el-tooltip>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
            content="自适应视图"
        >
            <el-button class="basic-flow-controls-icon" :icon="SelfAdaptionIcon" @click="selfAdaption" />
        </el-tooltip>
        <div class="f-c-split-line"></div>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
            :content="props.openAllNode?'展开全部节点':'折叠全部节点'"
        >
            <el-button class="basic-flow-controls-icon" :icon="!props.openAllNode?FoldAllNodeIcon:OpenAllNodeIcon" @click="openOrCloseAllNode" />
        </el-tooltip>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
            :content="props.isBrokenLine?'切换为平滑线':'切换为折线'"
        >
            <el-button class="basic-flow-controls-icon" :icon="props.isBrokenLine?BrokenLineIcon:SmoothLineIcon" @click="changeLineType" />
        </el-tooltip>
    </div>
</template>
<style lang="scss" scoped>
* {
    --el-color-primary-light-9: #F4EBEB !important;
    --el-color-primary2: rgb(56, 55, 67);
    --el-color-primary-disabled: rgba( 217,220,250 ,1);
}
.f-c-split-line{
    width: 1px;
    height: 26px;
    background-color: rgba(29, 28, 35, 0.1);
}
.f-c-zoom-percent {
    color: rgba(29,28,35,.8);
    display: flex;
    flex-direction: column;
    font-family: SF Pro Display;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    height: 22px;
    justify-content: center;
    line-height: 22px;
    text-align: center;
    width: 45px;
}
.f-c-content{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}   
.f-c-tag-container {
    display: flex;
    align-items: center;
    margin-left: 4px;
    gap:4px;
}
.f-c-tag {
    background-color: #6b6b75;
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
}
.flow-controls-wrapper {
    align-items: center;
    background: #fff;
    border-radius: 12px;
    bottom: 0;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, .3), 0 4px 14px 0 rgba(0, 0, 0, .1) !important;
    display: flex;
    gap: 12px;
    margin: 0 98px 36px 0 !important;
    padding: 8px 16px;
    position: absolute;
    right: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 10;
}

.basic-flow-controls-icon {
    cursor: pointer !important;
    color: var(--el-color-primary2);
    fill: var(--el-color-primary2);
    font-weight: 600;
    padding: 4px !important;
    height: 24px;
    font-size: 14px;
    // margin-right: 8px;
    border-color: transparent;
    background-color: transparent;
    &-disabled{
        color: var(--el-color-primary-disabled);
        fill: var(--el-color-primary-disabled);
        border-color: transparent;
        background-color: transparent;
        user-select: none;
        &:hover {
            color: var(--el-color-primary-disabled);
            fill: var(--el-color-primary-disabled);
            border-color: transparent;
            background-color: transparent !important;
        }
    }
    &:hover {
        background-color: var(--el-color-primary-light-9);
    }
}
</style>
<style>
.tooltip-box-item-in-controls{
    --el-text-color-primary:rgb(95, 94, 108)!important;
    max-width: 400px;
    border-radius: 6px;
}
</style>