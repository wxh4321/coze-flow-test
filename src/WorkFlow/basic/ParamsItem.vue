<script lang="ts" setup>
interface titleProp {
    name: string;
    flexNum: string;
}
type titleProps  = titleProp[];
import DeleteIcon from '../icons/DeleteIcon.vue';
import AddIcon from '../icons/AddIcon.vue';

const focusIndex = ref(-1);
const props = defineProps({
    /**
     * 数据结构 一下展示的为主要参数，其他自定义不再展示
     * // 第一行
     * [
     *  {type:'input',value:'',placeholder:'',warning:'',disabled:false,style:{}},
     *  {type:'select',value:'String',options:[{label:'',value:''}],placeholder:'',warning:'',disabled:false,style:{}},
     *  {type:'textarea',value:'',placeholder:'',warning:'',disabled:false,style:{}},
     *  {type:'checkbox',value:'',selected:true,placeholder:'',warning:'',disabled:false,style:{}}
     *  {type:'delete-icon',disabled:false,style:{}}
     * ]
     * ]
     */
    data:{
        type: Array as () => any,
        default:[]
    },
    titles:{
        type: Array as () => titleProps,
        default:[
            {name:'变量名',flexNum:''},
            {name:'变量类型',flexNum:''},
            {name:'描述',flexNum:''},
            {name:'是否必要',flexNum:''},
            {name:'',flexNum:''}
        ]
    },
    showAddIcon: {
        type:Boolean,
        default:true
    },
});
const paramsData = ref(props.data);
const emit = defineEmits(['addItem','saveParams','deleteItem','selectChange']);
// 选择事件监听
const selectChange = (value:any,item:any,i:number,j:number) => {
    emit('selectChange',{value,i,j,item});
}
// 删除某一行
const deleteItem = (item:any,index:number,v:any) => {
    console.log('deleteItem ', item,index,v);
    if(item.disabled || v.actionDisabled){
        return;
    }
    paramsData.value.splice(index,1);
    emit('deleteItem',{item,index});
}
// 保存参数
const saveParams = () => {
    emit('saveParams', paramsData);
}

const textareaFocus = (i:number) => {
    focusIndex.value = i;
    console.log('textareaFocus', i);
}
const textareaBlur = () => {
    focusIndex.value = -1;
}

const addItem = () => {
    emit('addItem');
}


watch(
    () => paramsData.value,
    (val) => {
        console.log('save params data ', val);
        saveParams();
    },
    { immediate: true, deep: true }
);
</script>
<template>
    <div class="params-item-wrapper">
        <div :class="[item.flexNum?('flex-'+item.flexNum):'p-i-col-'+(i+1)]" v-for="(item,i) in props.titles"
        :key="i"
        >
            <div class="p-i-title">{{item.name||''}}</div>
        </div>
    </div>
    <div class="params-item-wrapper" v-for="(item,i) in paramsData"
    :key="item.id"
    >
        <div :class="[props.titles[j].flexNum?('flex-'+props.titles[j].flexNum):'p-i-col-'+(j+1)]" v-for="(v,j) in item.list"
        :key="j"
        >
            <div class="p-i-content" 
            :key="'content'+j"
            >
                <div v-if="v.type==='input'" class="p-i-content-item"
                :class="[
                    v.cutBorderRight?'p-i-c-border-input-right':'',
                    v.cutBorderLeft?'p-i-c-border-input-left':'',
                ]"
                >
                    <el-input v-model="v.value" :placeholder="v.placeholder" :disabled="v.disabled"
                    :style="v.style"
                    />
                </div>
                <div v-if="v.type==='input-text'" class="p-i-content-item">
                    <div class="p-i-input-text"
                    :style="v.style"
                    >
                        <span class="p-i-i-name">{{v.name}}</span>
                        <span class="p-i-i-required" v-if="v.required">*</span>
                        <div class="p-i-i-value" v-if="v.value">{{v.value}}</div>
                    </div>
                </div>
                <div v-if="v.type==='textarea'" class="p-i-content-item"
                :class="[focusIndex===i?'p-i-c-focus':'p-i-c-nofocus']"
                >
                    <el-input type="textarea" v-model="v.value" :placeholder="v.placeholder" :disabled="v.disabled"
                    :maxlength="v.maxlength"
                    @focus="textareaFocus(i)"
                    @blur="textareaBlur"
                    :show-word-limit="v.showWordLimit"
                    :style="v.style"
                    />
                </div>
                <div v-if="v.type==='select'" class="p-i-content-item"
                :class="[
                    v.cutBorderRight?'p-i-c-border-select-right':'',
                    v.cutBorderLeft?'p-i-c-border-select-left':'',
                ]"
                >
                    <el-select v-model="v.value" :placeholder="v.placeholder" :disabled="v.disabled"
                    :no-data-text="v.noDataText"
                    :style="v.style"
                    @change="(value:any)=>{selectChange(value,item,i,j)}"

                    >
                        <el-option
                            v-for="(oItem,opIndex) in v.options"
                            :key="opIndex"
                            :label="oItem.label"
                            :value="oItem.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div v-if="v.type==='checkbox'" class="p-i-content-item">
                    <el-checkbox v-model="v.selected" :disabled="v.disabled"
                    :style="v.style"
                    >{{v.value}}</el-checkbox>
                </div>
                <div v-if="v.type==='delete-icon'" class="p-i-content-item">
                    <el-icon class="p-i-w-delete-icon" @click="deleteItem(item,i,v)" v-if="!v.disabled"
                    :style="v.style"
                    >
                        <DeleteIcon />
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
    <div class="params-item-footer" v-if="props.showAddIcon">
        <el-button :icon="AddIcon"
        class="p-i-f-button"
        @click="addItem"
        >新增</el-button>
    </div>
</template>
<style lang="scss" scoped>
*{
    --el-color-primary-light-9: #F4EBEB !important;
    --el-color-primary:rgba( 77,83,232 ,1)!important;
    --el-color-primary1:rgba( 77,83,232 ,1);
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner){
    margin-top: 2px;
    background-color: var(--el-color-primary1);
    border-color: var(--el-color-primary1);
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px var(--el-color-primary1);
    color: #fff;
}
:deep(.el-checkbox__inner:hover){
    border-color: var(--el-color-primary1);
}
.public-el-wrapper{
    border: 1px solid rgba( 56,55,67 ,0.08) ;
    border-radius: 8px;
    box-shadow:none;
}
:deep(.el-select__wrapper){
   @extend .public-el-wrapper;
}
:deep(.el-textarea__inner){
    @extend .public-el-wrapper;
}
:deep(.el-input){
    height:32px;
}
:deep(.el-input__wrapper){
    @extend .public-el-wrapper;
}
:deep(.el-textarea__inner:focus){
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
:deep(.is-focused) {
    box-shadow: 0 0 0 1px var(--el-color-primary1) inset;
}
.p-i-c-focus{
    :deep(.el-textarea__inner){
        height: 64px!important;
    }
}
.p-i-c-nofocus{
    :deep(.el-textarea__inner){
        height: 32px!important;
    }
}
.delete-icon-area{
    margin-top: 16px;
}
.params-item-footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 8px;
}
.p-i-f-button{
    min-width: 96px;
    color:rgb(77, 83, 232);
    font-size: 14px;
    border-color: transparent;
    border-radius: 8px;
    padding: 4px!important;
}
.w26{
    width: 26px;
}
.mr8{
    margin-left: 8px;
}
.params-item-wrapper{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
}
.p-i-input-text{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.p-i-i-name{
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: rgba(28, 31, 35, .8);
}
.p-i-i-required{
    color: rgb(249, 57, 32);
}
.p-i-i-value{
    margin-left: 8px;
    font-family: SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe Ul, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: rgba(28, 31, 35,.8);
    background-color: rgba(6, 7, 9, 0.04);
    border-radius: 6px;
    padding: 2px 8px;
}
.p-i-title{
    margin-top: 8px;
    color: rgba(28, 31, 35, .35);
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
}
.p-i-content{
    width: 100%;
    margin-top: 8px;
}
.p-i-content-item{
    width: 100%;
}

.p-i-c-border-input-left{
    :deep(.el-input__wrapper){
        border-radius: 0 8px 8px 0;
    }
}
.p-i-c-border-input-right{
    :deep(.el-input__wrapper){
        border-radius: 8px 0 0 8px;
    }
}
.p-i-c-border-select-left{
    :deep(.el-select__wrapper){
        border-radius: 0 8px 8px 0;
    }
}
.p-i-c-border-select-right{
    :deep(.el-select__wrapper){
        border-radius: 8px 0 0 8px;
    }
}
.p-i-col-1{
    flex:3;
}
.p-i-col-2{
    flex:2;
}
.p-i-col-3{
    flex:4;
}
.p-i-col-4{
    width: 56px;
}
.p-i-col-5{
    width: 26px;
}
.flex-1{
    flex:1;
}
.flex-1point2{
    flex:1.2;
}
.flex-2{
    flex:2;
}
.flex-3{
    flex:3;
}
.flex-4{
    flex:4;
}
.flex-5{
    flex:5;
}
.flex-6{
    flex:6;
}
.flex-b-26{
    flex-basis: 26px;
}
.flex-b-100{
    flex-basis: 100px;
}
.flex-b-200{
    flex-basis: 200px;
}
.p-i-w-delete-icon{
    // margin-left: 2px;
    margin-top: 9px;
    color: #888d92;
    cursor: pointer;
    font-size: 16px;
}
</style>