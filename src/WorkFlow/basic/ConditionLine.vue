<script lang="ts" setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
</script>
<template>
    <div class="cond-line-wrapper"
    :style="props.data.style"
    >
        <div class="c-l-flex">
            <div class="flex-1 c-l-relative">
                <div class="c-l-up"></div>
            </div>
            <div class="c-l-main">
                <span class="c-l-main-text">{{props.data.name}}</span>
                <el-button 
                class="basic-n-t-r-icon" 
                :style="props.data.iconStyle"
                :icon="props.data.icon"
                />
            </div>
            <div class="flex-1 c-l-relative">
                <div class="c-l-down"></div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
*{
    --el-color-primary-light-9: #F4EBEB !important;
}
.c-l-main-text{
    color: rgb(77, 83, 232);
    font-size: 12px;
    font-weight: 400;
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
.basic-n-t-r-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    margin-left: -4px;
    font-size: 12px;
    color: rgb(77, 83, 232);
    fill:rgb(77, 83, 232);
    // &:hover{
    //     background-color: var(--el-color-primary-light-9);
    // }
}
.cond-line-wrapper{
    width: 50px;
}
.c-l-flex{
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 30px 0px;
}
.flex-1{
    flex:1;
}
.c-l-relative{
    position: relative;
}
.c-l-main{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    padding:6px 4px;
    &:hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.c-l-up,
.c-l-down
{
    box-sizing: border-box;
    border-color: rgba( 56,55,67 ,0.6);
    border-style: solid;
    left: 50%;
    position: absolute;
    right: 0;
}
.c-l-up{
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 0px;
    border-bottom-width: 0px;
    border-top-left-radius: 8px;
    top: 16px;
    bottom: 0px;
}
.c-l-down{
    border-top-width: 0px;
    border-left-width: 1px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    border-bottom-left-radius: 8px;
    top: 0px;
    bottom: 16px;
}
</style>