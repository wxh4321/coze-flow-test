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
import { Panel, PanelPosition, useVueFlow, } from '@vue-flow/core'

const {
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  setInteractive,
  zoomTo,
  zoomIn,
  zoomOut,
  fitView,
  viewport,
  minZoom,
  maxZoom,
} = useVueFlow()

const isInteractive = toRef(() => nodesDraggable.value || nodesConnectable.value || elementsSelectable.value)

const minZoomReached = toRef(() => viewport.value.zoom <= minZoom.value)

const maxZoomReached = toRef(() => viewport.value.zoom >= maxZoom.value)

// 后退
const backStep = () => {
    console.log('backStep');
}
// 前进
const forwardStep = () => {
    console.log('forwardStep');
}
// 缩小画布
const minusFlow = () => {
    if(minZoomReached.value){
        return;
    }
    zoomPercent.value -= 0.1;
    zoomPercent.value = Number(zoomPercent.value.toFixed(1));
    zoomTo(zoomPercent.value);
}
// 放大画布
const plusFlow = () => {
    if(maxZoomReached.value){
        return;
    }
    zoomPercent.value += 0.1;
    zoomPercent.value = Number(zoomPercent.value.toFixed(1));
    zoomTo(zoomPercent.value);
}
// 自适应
const selfAdaption = () => {
    console.log('selfAdaption');
    fitView({
        minZoom:0.1,
        maxZoom:2
    });
}
// 打开/关闭所有节点
const openAllNode = ref(false);
const openOrCloseAllNode = () => {
    openAllNode.value =!openAllNode.value;
}

// 切换线类型
const isBrokenLine = ref(false);
const changeLineType = () => {
    isBrokenLine.value =!isBrokenLine.value;
}
// 百分比
const zoomPercent = ref(1);

const disabledBackStep = computed(()=>{
    return true;
})
const disabledForwardStep = computed(()=>{
    return true;
})
watch(
    ()=>viewport.value.zoom,
    (newValue:any)=>{
        zoomPercent.value = Number(newValue.toFixed(1));
    }
)


onMounted(()=>{
    zoomTo(zoomPercent.value);
});


</script>
<template>
    <div class="flow-controls-wrapper">
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
            :class="[disabledBackStep?'basic-flow-controls-icon-disabled':'']"
            :icon="BackOffIcon" @click="backStep" 
            :disabled="disabledBackStep"
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
            :class="[disabledForwardStep?'basic-flow-controls-icon-disabled':'']"
            :icon="ForwardIcon" @click="forwardStep" 
            :disabled="disabledForwardStep"
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
        <div class="f-c-zoom-percent">{{Math.floor(zoomPercent*100)}}%</div>
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
            :content="openAllNode?'展开全部节点':'折叠全部节点'"
        >
            <el-button class="basic-flow-controls-icon" :icon="!openAllNode?FoldAllNodeIcon:OpenAllNodeIcon" @click="openOrCloseAllNode" />
        </el-tooltip>
        <el-tooltip
            :offset="12"
            popper-class="tooltip-box-item-in-controls"
            effect="dark"
            placement="top"
            :content="isBrokenLine?'切换为平滑线':'切换为折线'"
        >
            <el-button class="basic-flow-controls-icon" :icon="isBrokenLine?BrokenLineIcon:SmoothLineIcon" @click="changeLineType" />
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