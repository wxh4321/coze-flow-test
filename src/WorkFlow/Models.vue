<script lang="ts" setup>
import ModelItem from './models/ModelItem.vue';

import { modelItemDatas } from './data/index';
import { modelItemDataProp } from './data/data';
const modelsData = ref(modelItemDatas);
const modelStyle1:any = ref({
    zIndex: 1,
    position: 'relative',
    top: '0px',
    left: '0px',
    boxShadow: 'none',
});
const modelStyle2:any = ref({
    zIndex: 2, 
    position: 'absolute', 
    top: '0px', 
    left: '0px', 
    width: 'calc(100% - 32px)',
});
const emit = defineEmits(['addModel']);
const addModel = (item:modelItemDataProp) => {
    emit('addModel',item);
}

</script>
<template>
    <div class="models-wrapper">
        <div class="mb12 models-items"
        v-for="item in modelsData"
        :key="item.type"
        >
            <div class="models-item" 
            :class="item.disabled?'model-item-disabled':''"
            :style="modelStyle1"
            >
                <ModelItem :data="item"
                @addModel="addModel"
                />
            </div>
            <div class="models-item" 
            :class="item.disabled?'model-item-disabled':''"
            :style="modelStyle2"
            :draggable="!item.disabled"
            >
                <el-tooltip
                    :offset="36"
                    :disabled="item.disabled"
                    class="tooltip-box-item"
                    effect="dark"
                    :content="item.tooltip"
                    placement="right"
                >
                    <ModelItem :data="item"
                    @addModel="addModel"
                    />
                </el-tooltip>
            </div>
        </div>
        
    </div>
</template>
<style>
.el-popper{
    max-width: 200px;
}
</style>
<style lang="scss" scoped>

.models-wrapper{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;
}
.models-items{
    position: relative;
}
.mb12{
    margin-top: 12px;
}
.models-item{
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 8px 0 rgba(29, 28, 35, .06);
    cursor: -webkit-grab;
    cursor: grab;
    font-size: 12px;
    line-height: 16px;
    margin: 0 16px;
    overflow: hidden;
    padding: 12px 16px;
    :deep(.el-popper){
        width: 200px;
    }
}
.model-item-disabled{
    cursor: not-allowed;
    background-color: #e4e7ed;
    border:1px solid #e4e7ed;
    color: #909399;
}
.tooltip-box-item {
//   width: 110px;
//   margin-top: 10px;
}
</style>

