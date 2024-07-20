<script lang="ts" setup>
import TestRunIcon from '../icons/TestRunIcon.vue'
import OmitIcon from '../icons/OmitIcon.vue'

const emit = defineEmits(['testRun','reName','deleteNode']);

// 运行本节点
const testRun = () => {
    console.log("testRun");
    emit('testRun');
}
const reName = () => {
    emit('reName');
}
const deleteNode = () => {
    emit('deleteNode');
}
</script>
<template>
    <div class="basic-n-t-right">
        <el-button class="basic-n-t-r-icon" 
        :icon="TestRunIcon"
        @click="testRun" 
        />
        <el-dropdown size="small">
            <el-button class="basic-n-t-r-omit-icon" 
            :icon="OmitIcon"
            />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="reName">重命名</el-dropdown-item>
                    <el-dropdown-item @click="deleteNode">删除</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>      
    </div>
    
</template>

<style lang="scss" scoped>
*{
    --el-color-primary-light-9: #F4EBEB !important;
    --el-color-primary:rgba( 77,83,232 ,1)!important;
    --el-color-primary1:rgba( 77,83,232 ,1);
    --el-dropdown-menuItem-hover-color:rgba( 77,83,232 ,1);
}
.basic-n-t-right{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    :deep(.el-button+.el-button){
        margin-left: 0px;
    }
    
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
}
.basic-n-t-r-omit-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
}
</style>