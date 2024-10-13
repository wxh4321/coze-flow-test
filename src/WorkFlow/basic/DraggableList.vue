<!-- 可以拖拽并调整顺序的列表 -->
<script lang="ts" setup>
import { debounce, throttle } from '@/utils';

const emit = defineEmits(['updateList','dragMousedown','dragMouseleave']);
const props = defineProps({
    // 是否可拖拽
    draggable:{
        type:Boolean,
        default:true
    },
    // 数据列表
    draggableList:{
        type:Array,
        default:()=>[]
    },
    // 内置样式
    listClass:{
        type: String || Array,
        default:''
    }
});
const draggableList = ref(props.draggableList);

// 拖拽改变列表位置
const changeListDebounce = debounce((targetIndex:number,sourceIndex:number) => {
    let list:any = [...draggableList.value];
    const tmpSourceItem:any = list[sourceIndex];
    list[sourceIndex] = null;
    let tmpTargetIndex = -1;
    let tmpSourceIndex = -1;
    if(targetIndex > sourceIndex){
        tmpTargetIndex = targetIndex-1;
        tmpSourceIndex = targetIndex;
        list.splice(targetIndex+1,0,tmpSourceItem);
    }
    else{
        tmpTargetIndex = targetIndex;
        tmpSourceIndex = targetIndex+1;
        list.splice(targetIndex,0,tmpSourceItem);
    }
    list = list.filter((item:any)=>item);
    // 还原title label
    list.forEach((item:any,i:number)=>{
        if(i==0){
            item.title = '如果';
        }
        else if(i==list.length-1){
            item.title = '否则'
        }
        else{
            item.title = '否则如果'
        }
    })

    draggableList.value = list;
    emit('updateList',list); // 更新列表的目的是数据同步
}, 10)
const datasetIndex = ref(-1)
const handleDragOver = (e:any,item:any,i:number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect ='move';
    if(i===draggableList.value.length-1) return;
    if(datasetIndex.value === i) return;
    changeListDebounce(i,datasetIndex.value);
}

const handleDragStart = (e:any,i:number) => {
    datasetIndex.value = i;
}

const showPageIndex = ref(0);
watch(
    ()=>props.draggableList,
    (newValue:any)=>{
        console.log('update list ', newValue);
        draggableList.value = newValue;
        showPageIndex.value += 1;
    }
);

</script>
<template>
    <div class="draggable-list-wrapper" v-for="(item,i) in draggableList"
    :key="showPageIndex"
    :class="props.listClass"
    :draggable="props.draggable && i!==draggableList.length-1"
    @dragover="(e:any)=>{handleDragOver(e,item,i)}"
    @dragstart="(e:any)=>{handleDragStart(e,i)}"
    >
        <slot :data="item" :index="i"></slot>
    </div>
   
</template>
<style lang="scss" scoped>

.draggable-list-wrapper{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
}

</style>