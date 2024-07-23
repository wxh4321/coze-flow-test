<!-- 可以拖拽并调整顺序的列表 -->
<script lang="ts" setup>
    const emit = defineEmits(['updateList']);
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
    const dragenterItem = (item:any,i:number) => {
        console.log('dragenterItem ', item, i);
        emit('updateList',draggableList.value); // 更新列表的目的是数据同步
    }
    watch(
        ()=>draggableList.value,
        (newValue:any)=>{
            console.log('update list ', newValue);
            draggableList.value = newValue;
        }
    );
</script>
<template>
    <div class="draggable-list-wrapper" v-for="(item,i) in draggableList"
    :class="props.listClass"
    :draggable="props.draggable"
    @dragenter="dragenterItem(item,i)"
    >
        <div class="d-l-title">
            <slot :data="item" :index="i" name="title"></slot>
        </div>
        <slot :data="item" :index="i"></slot>
    </div>
</template>
<style lang="scss" scoped>
.draggable-list-wrapper{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.d-l-title{
    display: flex;
    align-items: center;
    flex-direction: row;
}
</style>