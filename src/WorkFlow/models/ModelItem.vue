<script lang="ts" setup>
import { modelItemDataProp } from '../data/data.d';
import AddIcon from '../icons/AddIcon.vue';
const props = defineProps({
    data:{
        type: Object as () => modelItemDataProp,
        default:{}
    }
});
const emit = defineEmits(['addModel']);
const addModel = (item:modelItemDataProp) => {
    if(item.disabled){
        return;
    }
    emit('addModel',item);
}

</script>

<template>
    <div class="model-item-wrapper">
        <img :src="props.data.icon" :alt="'m-i-icon-'+props.data.type" class="m-i-icon" />
        <span class="m-i-title">{{props.data.title}}</span>
        <el-button :icon="AddIcon"
        class="m-i-add-model-icon"
        :class="props.data.disabled?'model-item-disabled':''"
        @click="addModel(props.data)"
        :disabled="props.data.disabled"
        />
    </div>
</template>
<style scoped lang="scss">
.model-item-wrapper{
    user-select:none;
    display: flex;
    align-items: center;
}
.m-i-add-model-icon{
    border-radius: 4px;
    font-size: 18px;
    height: 24px;
    padding: 4px 2px !important;
    color: rgb(77, 83, 232);
    border: 1px solid transparent;
}

.model-item-disabled:hover,
.model-item-disabled
{
    cursor: not-allowed;
    background-color: #e4e7ed;
    border:1px solid #e4e7ed;
    color: #909399;
}
.m-i-title{
    display: inline-block;
    max-width: 100%;
    vertical-align: top;
    color: #1c1f23;
    flex: 1 1;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
}

.m-i-icon{
    flex-shrink: 0;
    margin-right: 6px;
    height: 28px;
    width: 28px;
}
</style>