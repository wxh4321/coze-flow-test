<script lang="ts" setup>
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import type { Elements, FlowEvents, GraphEdge, Node, SnapGrid, Styles, VueFlowStore } from '@vue-flow/core'
import { VueFlow, useVueFlow, Position, MarkerType } from '@vue-flow/core';
import { Background, BackgroundVariant } from '@vue-flow/background'
import FlowControls from './controls/FlowControls.vue';

import { debounce,deepClone } from '../utils'
import { useHistoryStore } from '../store/history';
import { useGlobalStore } from '../store';

const historyStore = useHistoryStore();
const globalStore = useGlobalStore();

const {
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  setInteractive,
  zoomTo,
  zoomIn,
  zoomOut,
  fitView,
  viewport,
  minZoom,
  maxZoom,
  nodes, edges,
  getNodes, getEdges, findNode, findEdge,
  addNodes, updateNode,
  addEdges, updateEdge,
  setNodes,setEdges,
  removeNodes, removeEdges,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  onEdgeUpdate,
  onConnect, onPaneReady, onNodeDragStop,onNodeDragStart, dimensions,
  onEdgeClick, onEdgeMouseLeave, onEdgeMouseEnter,
} = useVueFlow()
import StartNode from './models/StartNode.vue'
import EndNode from './models/EndNode.vue'
import BigModelNode from './models/BigModelNode.vue'
import KnowledgeNode from './models/KnowledgeNode.vue'
import KnowledgeModelDialog from './components/KnowledgeModelDialog.vue'
import TextNode from './models/TextNode.vue'
import ConditionNode from './models/ConditionNode.vue'

import { EventBus } from '../utils/EventBus';

const minZoomReached = toRef(() => viewport.value.zoom <= minZoom.value)

const maxZoomReached = toRef(() => viewport.value.zoom >= maxZoom.value)

const VueFlowData = {
  id: 1
};
const updateType = ref('');
const localNodes: any = ref([]);
const localEdges: any = ref([]);
// const flowData:any = ref({});
const eventBus = EventBus();
const dialogVisible = ref(false);
const isBrokenLine = ref(false);

/**
 * 注意：
 * 这里的nodeid 10000-20000 是为了区分不同的节点类型
 * 不能轻易更改已有的节点id，因为不同节点会根据节点id来进行样式的修改，
 * 具体看查看每个节点的样式
 * 注： nodesTypeObj的key 与 src\views\modelMan\data\index.ts中的modelItemDatas id 一一对应
 */
const nodesTypeObj: any = {
  '10000': StartNode, // 开始节点
  '10002': BigModelNode, // 大模型节点
  '10004': KnowledgeNode, // 知识模型节点
  '10007': ConditionNode, // 条件节点
  '10008': TextNode, // 文本节点
  '20000': EndNode // 结束节点
};
const changeEdgeParams = (edge:GraphEdge,payload:any) => {
  const newEdge = {
    ...edge,
    ...payload
  };
  const connection = {
    source: edge.source,
    sourceHandle:null,
    target: edge.target,
    targetHandle:null
  }
  updateEdge(newEdge, connection);
}

const emit = defineEmits(['setData']);


onEdgeClick((params: any) => {
  console.log('onEdgeClick params ', params)
  changeEdgeParams(params.edge,{
    markerEnd: {
      ...(params.edge.markerEnd || {}),
      color: '#37d0ff'
    },
    style: { stroke: '#37d0ff' }
  });
});
onEdgeMouseLeave((params: any) => {
  console.log('onEdgeMouseLeave params ', params)
  changeEdgeParams(params.edge,{
    markerEnd: {
      ...(params.edge.markerEnd || {}),
      color: '#4d53e8'
    },
    style: { stroke: '#4d53e8' }
  });
});
onEdgeMouseEnter((params: any) => {
  console.log('onEdgeMouseEnter params ', params)
  changeEdgeParams(params.edge,{
    markerEnd: {
      ...(params.edge.markerEnd || {}),
      color: '#37d0ff'
    },
    style: { stroke: '#37d0ff' }
  });
});


onEdgeUpdateStart((params: any) => {
  console.log('onEdgeUpdateStart ', params.edge)
});
onEdgeUpdateEnd((params: any) => {
  console.log('onEdgeUpdateEnd ', params.edge);
  if (params) {
    removeEdges([params.edge]);
  }
});
onEdgeUpdate((params: any) => {
  console.log('onEdgeUpdate ', params);
  updateEdge(params.edge, params.connection);
});
onPaneReady((flowInstance) => console.log('flow loaded:', flowInstance))


let vueFlowNodeId = VueFlowData.id;
const addStartNode = () => {
  const nodeId = '10000';
  addNodes({
    id: nodeId + '-' + (vueFlowNodeId++) + '',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    label: markRaw(nodesTypeObj[nodeId]),
    position: { x: 100, y: dimensions.value.height / 4 },
    // position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
  });
}
const addEndNode = () => {
  const nodeId = '20000';
  addNodes({
    id: nodeId + '-' + (vueFlowNodeId++) + '',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    deletable: true,
    label: markRaw(nodesTypeObj[nodeId]),
    position: { x: 775 + 100 + 200, y: dimensions.value.height / 4 },
  })
}
const addRandomNode = (nodeId: string, position: any) => {
  collectNodes();
  if (!nodesTypeObj[nodeId]) {
    ElMessage({
      message: '此节点类型还在建设中...',
      type: 'success',
    })
    dragNodeData.value = {};
    return;
  }

  addNodes({
    id: nodeId + '-' + (vueFlowNodeId++) + '',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    deletable: true,
    label: markRaw(nodesTypeObj[nodeId]),
    position: position || {
      x: 200,
      y: dimensions.value.height / 4
    },
  });
  setTimeout(() => {
    dragNodeData.value = {};
  }, 10);
}
const dragNodeData: any = ref({});
const addNodeDebounce = debounce(() => {
  if (!dragNodeData.value.id) {
    return;
  }
  console.log('add node', dragNodeData.value.id + '-' + (vueFlowNodeId));
  addRandomNode(dragNodeData.value.id, dragNodeData.value.position);
}, 500)
const collectNodes = () => {
  console.log('localNodesDebounce ', nodes);
  // flowData.value.nodes = nodes;
  globalStore.setWorkFlowState({
    flowData:{
      ...(globalStore?.workFlowData?.flowData) || {},
      edges:edges.value,
      nodes:nodes.value
    }
  });
}
const collectEdges = () => {
  console.log('localEdgesDebounce ', edges);
  // flowData.value.edges = edges;
  globalStore.setWorkFlowState({
    ...(globalStore.workFlowData) || {},
    flowData:{
      ...(globalStore.workFlowData?.flowData) || {},
      edges:edges.value,
      nodes:nodes.value
    }
  });
}

const localNodesDebounce = debounce(collectNodes, 100);

const localEdgesDebounce = debounce(collectEdges, 100);

onConnect((params: any) => {
  // 收集数据
  localEdgesDebounce();
  console.log('connnect ', params);
  params = {
    ...params,
    updatable: true,
    type: isBrokenLine.value ? 'step' : '', // type: 'step', // 折线
    markerEnd: {
      type: MarkerType.Arrow,
      color: '#4d53e8'
    }
  };
  addEdges([params]);
})
onNodeDragStart(()=>{
  console.log('onNodeDragStart');
  // 收集数据
  localNodesDebounce(nodes.value);
});
onNodeDragStop((node) => {
  console.log('drag stop', node);
});
// 去掉无用节点,过滤数据
const filterFlowData = (data:any) => {
  data?.nodes?.forEach((node:any)=>{
    if(node.label){
      node.label = '';
    }
  });
}
const flowDataDebounce = debounce((data:any)=>{
  const filterData = deepClone(data);
  filterFlowData(filterData);
  emit('setData',filterData);
},100);

const vueFlowDragLeave = (event: any) => {
  addNodeDebounce();
}
const vueFlowDragover = (event: any) => {
  // console.log('vueFlowDragover', event);
}
eventBus.on('updateNodeData', (type: string) => {
  updateType.value = type;
  if(type!=='history'){
    return;
  }
  const localNodesTmp:any = [];
  const data = (globalStore.workFlowData as any)?.flowData;
  data?.nodes?.forEach((item:any,i:number)=>{
    const node: any = {
      ...(findNode(item.id)),
    };
    Object.keys(item).forEach(key=>{
      if(key!=='label'){
        node[key] = item[key];
      }
      else{
        const nodeId = item.id.split('-')[0];
        node[key] = markRaw(nodesTypeObj[nodeId]);
      }
    });
    localNodesTmp.push(node);
  });

  localNodes.value = localNodesTmp;
  localEdges.value = data?.edges|| [];
  console.log('localNodes ', localNodes.value)
  console.log('localEdges ', localEdges.value)
});
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
  console.log('delete node', data.id || '');
  removeNodes(data.id);
  collectNodes();
});
const makeDraggable = ref(true);
// 设置当前节点为可拖拽
eventBus.on('makeDraggable', (state: any) => {
  makeDraggable.value = state;
});
// 设置当前节点为不可拖拽
eventBus.on('disabledDraggable', (data: any) => {
  console.log('disabledNodeDraggable', data.id || '');
  const node: any = {
    ...(findNode(data.id))
  };
  node.draggable = false;
  console.log('node ', node);
  updateNode(data.id, node);
});
// 打开知识库弹窗
eventBus.on('openKnowledgeDialog', (data: any) => {
  dialogVisible.value = true;
});
// 保存model节点数据
eventBus.on('saveModelData', (payload: any) => {
  const { id, data } = payload || {};
  if(data && id){
    globalStore.workFlowData?.flowData?.nodes?.forEach((node: any) => {
      if (node.id === id) {
        node.data.metaData = data;
      }
    });
  }
  collectNodes();
});
const onMoveEnd = (e: FlowEvents['moveEnd']) => {
  console.log('zoom/move end', e.flowTransform)
}

// 后退
const backStep = () => {
    console.log('backStep');
    historyStore.undo();
    // 发消息更新数据
    setTimeout(()=>{
        eventBus.emit('updateNodeData','history');
    },100);
}
// 前进
const forwardStep = () => {
    console.log('forwardStep');
    historyStore.redo();
    setTimeout(()=>{
        eventBus.emit('updateNodeData','history');
    },100);
}
// 缩小画布
const minusFlow = () => {
    if(minZoomReached.value){
        return;
    }
    zoomPercent.value -= 0.1;
    zoomPercent.value = Number(zoomPercent.value.toFixed(1));
    zoomTo(zoomPercent.value);
}
// 放大画布
const plusFlow = () => {
    if(maxZoomReached.value){
        return;
    }
    zoomPercent.value += 0.1;
    zoomPercent.value = Number(zoomPercent.value.toFixed(1));
    zoomTo(zoomPercent.value);
}
// 自适应
const selfAdaption = () => {
    console.log('selfAdaption');
    fitView({
        minZoom:0.1,
        maxZoom:2
    });
}
// 打开/关闭所有节点
const openAllNode = ref(false);
const openOrCloseAllNode = () => {
  eventBus.emit('openCard',openAllNode.value);
  openAllNode.value =!openAllNode.value;
}

// 切换线类型
const changeLineType = () => {
    isBrokenLine.value =!isBrokenLine.value;
    const arr:any = [];
    localEdges.value.forEach((edge:any)=>{
      edge.type = isBrokenLine.value ? 'step' : ''; // type: 'step', // 折线
      arr.push(edge);
    });
    localEdges.value = arr;
    collectEdges();
}
// 百分比
const zoomPercent = ref(1);

const disabledBackStep = computed(()=>{
  return historyStore.pointer <= 0;
})
const disabledForwardStep = computed(()=>{
    return historyStore.pointer > historyStore.queue.length-1;
})
watch(
    ()=>viewport.value.zoom,
    (newValue:any)=>{
        zoomPercent.value = Number(newValue.toFixed(1));
    }
)


onMounted(() => {
  addStartNode();
  addEndNode();
  zoomTo(zoomPercent.value);
});

</script>
<template>
  <VueFlow @dragleave="vueFlowDragLeave" @onMoveEnd="onMoveEnd"
  v-model:nodes="localNodes" v-model:edges="localEdges"
  :nodesDraggable="makeDraggable"
  :panOnDrag="makeDraggable"
  >
    <!-- <MiniMap /> -->
    <FlowControls 
    @backStep="backStep"
    @forwardStep="forwardStep"
    @minusFlow="minusFlow"
    @plusFlow="plusFlow"
    @selfAdaption="selfAdaption"
    @openOrCloseAllNode="openOrCloseAllNode"
    @changeLineType="changeLineType"
    :openAllNode="openAllNode"
    :isBrokenLine="isBrokenLine"
    :disabledBackStep="disabledBackStep"
    :disabledForwardStep="disabledForwardStep"
    :zoomPercent="zoomPercent"
    />
    <Background :variant="BackgroundVariant.Dots" />
    <!-- <button type="button" :style="{ position: 'absolute', left: '10px', top: '10px', zIndex: 4 }" @click="addRandomNode">
      add node
    </button> -->
  </VueFlow>
  <KnowledgeModelDialog :dialogVisible="dialogVisible" @closeDialog="dialogVisible = false" />

</template>
<style lang="scss" scoped></style>
<style>
:root {
  --vf-node-bg: #fff;
  --vf-node-text: #222;
  --vf-connection-path: #37d0ff;
  --vf-handle: #555;
  --vf-node-color:yellow;
}

.tooltip-box-item-in-node {
  max-width: 400px;
  border-radius: 6px;
}

.vue-flow__node-default {
  --vf-handle: var(--vf-node-color, #1a192b);
  --vf-box-shadow: var(--vf-node-color, #1a192b);
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

.vue-flow__edge-path {
  stroke: #4d53e8;
  stroke-width: 2;
  color: #4d53e8;
}

/* .vue-flow__edge-default.selected{
  stroke: #37d0ff;
} */
.vue-flow__edge:hover .vue-flow__edge-path {
  stroke: #37d0ff;
}

.vue-flow__edge.selected .vue-flow__edge-path,
.vue-flow__edge:focus .vue-flow__edge-path,
.vue-flow__edge:focus-visible .vue-flow__edge-path {
  stroke: #37d0ff;
  stroke-width: 3;
}



.vue-flow__node-default .vue-flow__handle,
.vue-flow__node-input .vue-flow__handle,
.vue-flow__node-output .vue-flow__handle {
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

.vue-flow__node-default:hover .vue-flow__handle {
  background: #4d53e8;
  border: 2px solid #fff;
  height: 16px;
  width: 16px;
}

.vue-flow__node-default:hover .vue-flow__handle-right:hover {
  background-image: url(./svg/add-icon.svg);
  background-color: #4d53e8;
  background-position: 42% 33%;
  background-repeat: no-repeat;
  border: 2px solid #fff;
  height: 20px;
  width: 20px;
}
</style>
