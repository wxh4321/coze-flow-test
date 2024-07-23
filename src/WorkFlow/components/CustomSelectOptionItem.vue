<!-- 自定义下拉框选择选项 -->
<script lang="ts" setup>
import AddIcon from '../icons/AddIcon.vue';
const props = defineProps();
const inputRef:any = ref(null);
const addActived = ref(false);
const inputText = ref('');
const emit = defineEmits(['useItem']);

const addNewCusItem = () => {
    console.log('addNewCusItem ');
    addActived.value = true;
}
const useItem = () => {
    emit('useItem',inputText.value);
    inputText.value = '';
}

watch(
    ()=>addActived.value,
    (newValue:any)=>{
        if(newValue){
            setTimeout(() => {
                inputRef.value && inputRef.value.focus && inputRef.value.focus();
            }, 10);
        }
    }
);
</script>
<template>
    <div class="cus-select-option-item-add" v-if="!addActived" 
    @click="addNewCusItem" 
    >
        <el-button class="c-s-o-i-add-icon" 
        :icon="AddIcon"
        />
        <span class="c-s-o-i-add-text">自定义</span>

    </div>
    <div class="cus-select-option-item-input" v-else>
        <el-input
            ref="inputRef"
            v-model="inputText"
            style="width: 100%;height:28px;"
            maxlength="20"
            placeholder="选择分隔符"
            show-word-limit
            type="text"
        />
        <div class="c-s-o-i-input-cancel" @click="addActived = false">取消</div>
        <div class="c-s-o-i-input-useit" @click="useItem">使用</div>
    </div>
</template>
<style lang="scss" scoped>
*{
    --el-color-primary1:rgba( 77,83,232 ,1);
    --el-color-primary-light-9: #F4EBEB !important;
}
.public-el-wrapper{
    border: 1px solid rgba( 56,55,67 ,0.08) ;
    border-radius: 8px;
    box-shadow:none;
}
:deep(.el-input__wrapper){
    @extend .public-el-wrapper;
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
.cus-select-option-item-add,
.cus-select-option-item-input{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.c-s-o-i-add-icon{
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
    // &:hover{
    //     background-color: var(--el-color-primary-light-9);
    // }
}
.c-s-o-i-add-text{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: rgb(77, 83, 232);
}
.c-s-o-i-input-cancel,
.c-s-o-i-input-useit{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    margin-left: 4px;
    border-radius: 8px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    width: 54px;
    cursor: grab;
}
.c-s-o-i-input-cancel{
    color: rgba(6, 7, 9, 0.5);
    &:hover{
        background-color:var(--el-color-primary-light-9);
    }
}
.c-s-o-i-input-useit{
    background-color: rgb(78, 64, 229);
    color: #fff;
    font-weight: 600;
}

</style>