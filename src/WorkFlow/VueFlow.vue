<script lang="ts" setup>
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import { VueFlow, useVueFlow, Position } from '@vue-flow/core';
import { Background, BackgroundVariant } from '@vue-flow/background'

const { nodes, addNodes, addEdges, onConnect, onPaneReady, onNodeDragStop, dimensions,
    removeNodes, removeEdges,
 } = useVueFlow()
import StartNode from './models/StartNode.vue'
import EndNode from './models/EndNode.vue'
/**
 * 注意：
 * 这里的nodeid 10000-20000 是为了区分不同的节点类型
 * 不能轻易更改已有的节点id，因为不同节点会根据节点id来进行样式的修改，
 * 具体看查看每个节点的样式
 */
const nodesTypeObj = {
    '10000':StartNode, // 开始节点
    '20000':EndNode // 结束节点
};
onConnect(addEdges)

onPaneReady((flowInstance) => console.log('flow loaded:', flowInstance))

onNodeDragStop((node) => console.log('drag stop', node))

function addStartNode() {
  const nodeId = '10000';
  addNodes({
    id: nodeId,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    label: markRaw(nodesTypeObj[nodeId]),
    position: { x: 100, y: dimensions.value.height/4 },
    // position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
  })
}
function addEndNode() {
  const nodeId = '20000';
  addNodes({
    id: nodeId,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    deletable:true,
    label: markRaw(nodesTypeObj[nodeId]),
    position: { x: 775 + 100 + 200, y: dimensions.value.height/4 },
  })
}
onMounted(()=>{
    addStartNode();
    addEndNode();
});
</script>
<template>
    <VueFlow>
    <!-- <MiniMap /> -->
    <!-- <Controls /> -->
    <Background :variant="BackgroundVariant.Dots" />
    <!-- <button type="button" :style="{ position: 'absolute', left: '10px', top: '10px', zIndex: 4 }" @click="addRandomNode">
      add node
    </button> -->
  </VueFlow>
</template>
<style>
.vue-flow__node-default{
    background: #fff;
    border: 1px solid rgba(28, 31, 35, .08);
    border-radius: 8px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
    padding: 12px;
}
.vue-flow__node-default.selectable:hover,
.vue-flow__node-default:hover {
    box-shadow: 0 0 1px rgba(0, 0, 0, .3), 0 4px 14px rgba(0, 0, 0, .1);
}
.vue-flow__node-default.selected, 
.vue-flow__node.selectable:focus,
.vue-flow__node-default:focus, 
.vue-flow__node-default:focus-visible {
    outline: none;
    border: 2px solid #4d53e8;
}
.vue-flow__node-default .vue-flow__handle, .vue-flow__node-input .vue-flow__handle, .vue-flow__node-output .vue-flow__handle {
    background: #9197f1;
}
.vue-flow__handle {
    align-items: center;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    transition: all .2s linear 0s;
    height: 8px;
    width: 8px;
}
.vue-flow__node-default:hover .vue-flow__handle,
.vue-flow__handle:hover {
    background: #4d53e8;
    border: 2px solid #fff;
    height: 16px;
    width: 16px;
}

</style>
