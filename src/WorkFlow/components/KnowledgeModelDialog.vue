<script lang="ts" setup>
import {
    ArrowDown,
    Search,
} from '@element-plus/icons-vue'
import EmptyIcon from '../icons/EmptyIcon.vue'

const props = defineProps({
    dialogVisible:{
        type:Boolean,
        default:false,
    }
});
const dialogVisible = ref(props.dialogVisible);
const activeIndex = ref(1);
const tabs = ref([
    {
        name:'全部',
        tabIndex:1,
    },
    {
        name:'文档',
        tabIndex:2,
    },
    {
        name:'表格',
        tabIndex:3,
    },
    {
        name:'照片',
        tabIndex:4,
    },
]);
const dialogData = ref({
    selectSortText:'创建时间',
    selectSortValue: 0,
    inputText:''
});
const emit = defineEmits(['testRun','closeDialog']);

const closeDialog = () => {
    emit('closeDialog', false);
}

const tabClick = (tabIndex:number,tabName:string) => {
    console.log('tab, event ', tabIndex,tabName)
    activeIndex.value = tabIndex;
}
const dropDownClick = (index:number,text:string) => {
    dialogData.value.selectSortValue = index;
    dialogData.value.selectSortText = text;
}


watch(()=>props.dialogVisible,(newVal)=>{
    dialogVisible.value = newVal;
},{ immediate: true, deep: true });

</script>

<template>
    <div class="knowledge-model-dialog">
        <el-dialog v-model="dialogVisible" title="选择知识库" width="1138"
        align-center
        @close="closeDialog"
        >
            <div class="k-m-n-dialog-title">
                <div class="k-m-n-tablist">
                    <div class="k-m-n-tab-item" v-for="(item,i) in tabs"
                    @click="tabClick(item.tabIndex,item.name)"
                    >
                        <span class="k-m-n-text"
                        :class="[activeIndex===item.tabIndex?'k-m-n-text-selected':'']"
                        >{{item.name}}</span>
                        <div class="k-m-n-tab-split-line"
                        v-if="i!==tabs.length-1"
                        ></div>
                    </div>
                </div>
                <div class="k-m-n-dialog-right">
                    <div class="k-m-n-sort">
                        <el-dropdown trigger="click">
                            <el-button class="k-m-n-c-r-select-icon">
                                <span class="k-m-n-sort-text">排序</span>
                                <span class="k-m-n-sort-selected-text">{{dialogData.selectSortText}}</span>
                                <el-icon class="k-m-n-c-el-icon-right"><ArrowDown /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="dropDownClick(0,'创建时间')">创建时间</el-dropdown-item>
                                    <el-dropdown-item @click="dropDownClick(1,'编辑时间')">编辑时间</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="k-m-n-search">
                        <el-input
                        v-model="dialogData.inputText"
                        style="width: 256px"
                        placeholder=""
                        :prefix-icon="Search"
                        />
                    </div>
                </div>
            </div>
            <div class="k-m-n-dialog-content">
                <div class="k-m-n-dialog-content-nodata">
                    <div class="k-m-n-empty-image">
                        <EmptyIcon/>
                    </div>
                    <div class="k-m-n-empty-content">
                        <div class="k-m-n-empty-content-text">暂无知识库</div>
                        <div class="k-m-n-empty-content-subtext">请先创建后添加</div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
*{
    --el-color-primary-light-9: #F4EBEB !important;
    --el-color-primary:rgba( 77,83,232 ,1)!important;
    --el-color-primary1:rgba( 77,83,232 ,1);
    --el-dropdown-menuItem-hover-color:rgba( 77,83,232 ,1);
    list-style: disc;
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
.k-m-n-c-r-select-icon{
    @extend .basic-n-t-icon;
    margin-right: 0px;
    &:hover{
        background-color: var(--el-color-primary-light-9);
    }
}
.k-m-n-text{
    font-family: SF Pro Display,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif;
    cursor: pointer;
    color: #1d1c2399;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    &-selected{
        color: #4d53e8;
    }
}
.k-m-n-dialog-title,
.k-m-n-dialog-content{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.k-m-n-dialog-content-nodata{
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 5%;
    width: 100%;
}
.k-m-n-empty-image{
    width: 150px; 
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.k-m-n-empty-content{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 16px;
    &-text{
        font-size: 16px;
        color:rgb(56, 55, 67);
        font-weight:600;
    }
    &-subtext{
        margin-top: 4px;
        font-size:14px;
        color: rgba(56, 55, 67, 0.8);
    }
}
.k-m-n-dialog-title{
    padding-bottom: 12px;
}
.k-m-n-dialog-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.k-m-n-sort{
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 8px;
    &-text{
        color: rgba(28, 31, 35, .4);
        flex-shrink: 0;
        font-size: 14px;
        font-weight: 600;
        padding-right: 8px;
    }
    &-selected-text{
        color: #1c1f23;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &:hover{
        background-color: var(--el-color-primary-light-9);
    }
}

.k-m-n-c-el-icon-right{
    color: rgba(56, 55, 67, 0.6);
    font-weight:500;
    font-size: 12px;
    margin-left: 4px;
}
.k-m-n-search{
    margin-left: 14px;
    padding-right: 6px;
    :deep(.el-input__wrapper){
        border-radius: 8px;
        padding: 1px 14px;
        box-shadow: none;
    }
}
.k-m-n-dialog-right{
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}
.k-m-n-tab-split-line{
    width: 1px;
    height: 20px;
    background-color: rgba( 56,55,67 ,0.08);
    margin: 0 12px;
}
.k-m-n-tablist{
    margin-left: 24px;
    padding: 6px 0px;
}
.k-m-n-tablist,
.k-m-n-tab-item{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.knowledge-model-dialog{
    :deep(.el-dialog){
        height: 100%;
        max-height: calc(100vh - 140px);
        min-height: 144px;
        background-color: rgb(253, 253, 253);
        border-radius: 12px;
    }
    :deep(.el-dialog__body){
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    :deep(.el-dialog__title){
        color: rgb(56, 55, 67);
        font-weight: 600;
        font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
        font-size: 18px;
    }
    :deep(.el-dialog__close){
        font-size: 18px;
        color: rgb(56, 55, 67);
    }
}
</style>