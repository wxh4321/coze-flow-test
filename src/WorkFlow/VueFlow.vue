<script lang="ts" setup>
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import type { Elements, FlowEvents, Node, SnapGrid, Styles, VueFlowStore } from '@vue-flow/core'
import { VueFlow, useVueFlow, Position } from '@vue-flow/core';
import { Background, BackgroundVariant } from '@vue-flow/background'
import FlowControls from './controls/FlowControls.vue';

import { debounce } from '../utils'
const { 
  nodes,edges, 
  getNodes, getEdges, findNode, findEdge,
  addNodes, updateNode, 
  addEdges,updateEdge, 
  removeNodes, removeEdges,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  onEdgeUpdate,
  onConnect, onPaneReady, onNodeDragStop, dimensions,
 } = useVueFlow()
import StartNode from './models/StartNode.vue'
import EndNode from './models/EndNode.vue'
import BigModelNode from './models/BigModelNode.vue'
import KnowledgeNode from './models/KnowledgeNode.vue'
import KnowledgeModelDialog from './components/KnowledgeModelDialog.vue'
import TextNode from './models/TextNode.vue'
import ConditionNode from './models/ConditionNode.vue'

import { EventBus } from '../utils/EventBus';
const VueFlowData = {
  id:1
};
const localNodes:any = ref(nodes);
const localEdges:any = ref(edges);

const eventBus = EventBus();
const dialogVisible = ref(false);
const updatedEdge:any = ref(null);
/**
 * 注意：
 * 这里的nodeid 10000-20000 是为了区分不同的节点类型
 * 不能轻易更改已有的节点id，因为不同节点会根据节点id来进行样式的修改，
 * 具体看查看每个节点的样式
 * 注： nodesTypeObj的key 与 src\views\modelMan\data\index.ts中的modelItemDatas id 一一对应
 */
const nodesTypeObj:any = {
    '10000':StartNode, // 开始节点
    '10002':BigModelNode, // 大模型节点
    '10004':KnowledgeNode, // 知识模型节点
    '10007':ConditionNode, // 条件节点
    '10008':TextNode, // 文本节点
    '20000':EndNode // 结束节点
};
onConnect((params:any)=>{
  console.log('connnect ', params);
  params = {
    ...params,
    updatable: true,
    type:'',
    // type: 'step', // 折线
    // markerEnd: { 
    //   type: MarkerType.Arrow,
    //   color:'currentColor'
    // }
  };
  addEdges([params]);
})

onEdgeUpdateStart((params:any)=>{
  console.log('onEdgeUpdateStart ', params.edge)
});
onEdgeUpdateEnd((params:any)=>{
  console.log('onEdgeUpdateEnd ', params.edge);
  if(params){
    removeEdges([params.edge]);
  }
});
onEdgeUpdate((params:any)=>{
  console.log('onEdgeUpdate ', params);
  updateEdge(params.edge, params.connection);
});
onPaneReady((flowInstance) => console.log('flow loaded:', flowInstance))

onNodeDragStop((node) => console.log('drag stop', node))
let vueFlowNodeId = VueFlowData.id;
const addStartNode = () => {
  const nodeId = '10000';
  addNodes({
    id: nodeId+'-'+(vueFlowNodeId++)+'',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    label: markRaw(nodesTypeObj[nodeId]),
    position: { x: 100, y: dimensions.value.height/4 },
    // position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
  })
}
const addEndNode = () => {
  const nodeId = '20000';
  addNodes({
    id: nodeId+'-'+(vueFlowNodeId++)+'',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    deletable:true,
    label: markRaw(nodesTypeObj[nodeId]),
    position: { x: 775 + 100 + 200, y: dimensions.value.height/4 },
  })
}
const addRandomNode = (nodeId:string,position:any) => {
  if(!nodesTypeObj[nodeId]){
    ElMessage({
      message: '此节点类型还在建设中...',
      type: 'success',
    })
    dragNodeData.value = {};
    return;
  }
  
  addNodes({
    id: nodeId+'-'+(vueFlowNodeId++)+'',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    deletable:true,
    label: markRaw(nodesTypeObj[nodeId]),
    position: position || { 
       x: 200,
       y: dimensions.value.height/4
    },
  });
  setTimeout(()=>{
    dragNodeData.value = {};
  },10);
}
const dragNodeData:any = ref({});
const addNodeDebounce = debounce(() => {
    if(!dragNodeData.value.id){
      return;
    }
    console.log('add node', dragNodeData.value.id+'-'+(vueFlowNodeId));
    addRandomNode(dragNodeData.value.id,dragNodeData.value.position);
},500)

const vueFlowDragLeave = (event:any) => {
  addNodeDebounce();
}
const vueFlowDragover = (event:any) => {
  // console.log('vueFlowDragover', event);
}
// 监听全局消息
eventBus.on('dragAddNode', (data: any) => {
    dragNodeData.value = data;
});
// 点击添加节点
eventBus.on('clickAddNode', (data: any) => {
    addNodeDebounce();
});
// 删除某个节点
eventBus.on('deleteNode', (data: any) => {
    console.log('delete node',data.id||'');
    removeNodes(data.id);
});
// 设置当前节点为可拖拽
eventBus.on('makeDraggable', (data: any) => {
    console.log('makeNodeDraggable ',data.id||'');
    const node:any = {
      ...(findNode(data.id))
    };
    node.draggable = true;
    console.log('node ',node);
    updateNode(data.id,node);
});
// 设置当前节点为不可拖拽
eventBus.on('disabledDraggable', (data: any) => {
    console.log('disabledNodeDraggable',data.id||'');
    const node:any = {
      ...(findNode(data.id))
    };
    node.draggable = false;
    console.log('node ',node);
    updateNode(data.id,node);
});
// 打开知识库弹窗
eventBus.on('openKnowledgeDialog', (data: any) => {
  dialogVisible.value = true;
});
const onMoveEnd = (e: FlowEvents['moveEnd']) => {
  console.log('zoom/move end', e.flowTransform)
}
onMounted(()=>{
    addStartNode();
    addEndNode();
});
// watch(
//   () => localNodes.value,
//   (newValue:any)=>{
//     console.log('update nodes',newValue);
//   },
//   { immediate: true, deep: true }
// );
// watch(
//   () => localEdges.value,
//   (newValue:any)=>{
//     console.log('update edges',newValue);
//   },
//   { immediate: true, deep: true }
// );
</script>
<template>
    <VueFlow 
    @dragleave="vueFlowDragLeave"
    @onMoveEnd="onMoveEnd"
    :nodes="localNodes" 
    :edges="localEdges"
    >
    <!-- <MiniMap /> -->
    <FlowControls />
    <Background :variant="BackgroundVariant.Dots" />
    <!-- <button type="button" :style="{ position: 'absolute', left: '10px', top: '10px', zIndex: 4 }" @click="addRandomNode">
      add node
    </button> -->
  </VueFlow>
  <KnowledgeModelDialog :dialogVisible="dialogVisible"
  @closeDialog="dialogVisible=false"
  />
  
</template>
<style lang="scss" scoped>

</style>
<style>
:root {
  --vf-node-bg: #fff;
  --vf-node-text: #222;
  --vf-connection-path: #37d0ff;
  --vf-handle: #555;
}
.tooltip-box-item-in-node{
    max-width: 400px;
    border-radius: 6px;
}
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
.vue-flow__edge-path{
  stroke: #4d53e8;
  stroke-width: 2;
  color: #4d53e8;
}
/* .vue-flow__edge-default.selected{
  stroke: #37d0ff;
} */
.vue-flow__edge:hover .vue-flow__edge-path{
  stroke: #37d0ff;
}
.vue-flow__edge.selected .vue-flow__edge-path, .vue-flow__edge:focus .vue-flow__edge-path, .vue-flow__edge:focus-visible .vue-flow__edge-path {
  stroke: #37d0ff;
  stroke-width: 3;
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
.vue-flow__node-default:hover .vue-flow__handle{
    background: #4d53e8;
    border: 2px solid #fff;
    height: 16px;
    width: 16px;
}
.vue-flow__node-default:hover .vue-flow__handle-right:hover {
    background-image: url(./svg/add-icon.svg);
    background-color:#4d53e8; 
    background-position: 42% 33%;
    background-repeat: no-repeat;
    border: 2px solid #fff;
    height: 20px;
    width: 20px;
}

</style>
