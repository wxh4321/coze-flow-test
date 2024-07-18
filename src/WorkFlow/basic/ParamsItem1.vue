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
     * 数据结构
     * // 第一行
     * [
     *  {type:'input',value:'',placeholder:'',warning:'',disabled:false},
     *  {type:'select',value:'String',options:[{label:'',value:''}],placeholder:'',warning:'',disabled:false},
     *  {type:'textarea',value:'',placeholder:'',warning:'',disabled:false},
     *  {type:'checkbox',value:'',selected:true,placeholder:'',warning:'',disabled:false}
     *  {type:'delete-icon',disabled:false}
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
            {name:'',flexNum:''}]
    }
});
const paramsData = ref(props.data);
const emit = defineEmits(['addItem','saveParams','deleteItem']);

// 删除某一行
const deleteItem = (item:any,index:number) => {
    console.log('deleteItem ', item,index);
    if(item.disabled){
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
        console.log('paramsData ', val);
        saveParams();
    },
    { immediate: true, deep: true }
);
</script>
<template>
    <div class="params-item-wrapper">
        <div :class="[props.titles[i].flexNum?('flex-'+props.titles[i].flexNum):'p-i-col-'+(i+1)]" v-for="(_,i) in paramsData[0].list"
        :key="i"
        v-if="paramsData[0]"
        >
            <div class="p-i-title">{{props.titles[i].name||''}}</div>
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
                <div v-if="v.type==='input'" class="p-i-content-item">
                    <el-input v-model="v.value" :placeholder="v.placeholder" :disabled="v.disabled"/>
                </div>
                <div v-if="v.type==='textarea'" class="p-i-content-item"
                :class="[focusIndex===i?'p-i-c-focus':'p-i-c-nofocus']"
                >
                    <el-input type="textarea" v-model="v.value" :placeholder="v.placeholder" :disabled="v.disabled"
                    :maxlength="v.maxlength"
                    @focus="textareaFocus(i)"
                    @blur="textareaBlur"
                    show-word-limit
                    />
                </div>
                <div v-if="v.type==='select'" class="p-i-content-item">
                    <el-select v-model="v.value" :placeholder="v.placeholder" :disabled="v.disabled">
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
                    <el-checkbox v-model="v.selected" :disabled="v.disabled">{{v.value}}</el-checkbox>
                </div>
                <div v-if="v.type==='delete-icon'" class="p-i-content-item delete-icon-area">
                    <el-icon class="p-i-w-delete-icon" @click="deleteItem(item,i)" v-if="!v.disabled">
                        <DeleteIcon />
                    </el-icon>
                </div>
            </div>
        </div>
    </div>
    <div class="params-item-footer">
        <el-button :icon="AddIcon"
        class="p-i-f-button"
        @click="addItem"
        >新增</el-button>
    </div>
</template>
<style lang="scss" scoped>
:deep(.el-checkbox__input.is-checked .el-checkbox__inner){
    background-color: rgba( 77,83,232 ,1);
    border-color: rgba( 77,83,232 ,1);
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba( 77,83,232 ,1);
    color: #fff;
}
:deep(.el-checkbox__inner:hover){
    border-color: rgba( 77,83,232 ,1);
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
.p-i-title{
    color: rgba(28, 31, 35, .35);
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
}
.p-i-content{
    width: 100%;
    margin-top: 8px;
}
.p-i-content-item{
    width: 100%;
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
.flex-100{
    flex-basis: 100px;
}
.flex-200{
    flex-basis: 200px;
}
.p-i-w-delete-icon{
    // margin-left: 2px;
    color: #888d92;
    cursor: pointer;
    height: 16px;
    width: 16px;
    font-size: 16px;
}
</style>