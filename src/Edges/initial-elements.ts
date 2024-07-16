import type { Edge, Node } from '@vue-flow/core'
import { MarkerType } from '@vue-flow/core'
import CustomLabel from './CustomLabel.vue'

export const initialNodes: Node[] = [
  { id: '1', type: 'input', label: 'Input 1', position: { x: 250, y: 0 } },
  { id: '2', label: 'Node 2', position: { x: 150, y: 100 } },
  { id: '2a', label: 'Node 2a', position: { x: 0, y: 180 } },
  { id: '3', label: 'Node 3', position: { x: 250, y: 200 } },
  { id: '4', label: 'Node 4', position: { x: 400, y: 300 } },
  { id: '3a', label: 'Node 3a', position: { x: 150, y: 300 } },
  { id: '5', label: 'Node 5', position: { x: 250, y: 400 } },
  { id: '6', type: 'output', label: 'Output 6', position: { x: 50, y: 550 } },
  { id: '7', type: 'output', label: 'Output 7', position: { x: 250, y: 550 } },
  { id: '8', type: 'output', label: 'Output 8', position: { x: 525, y: 600 } },
  { id: '9', type: 'output', label: 'Output 9', position: { x: 675, y: 500 } },
]

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'bezier edge (default)', class: 'normal-edge' },
  { id: 'e2-2a', source: '2', target: '2a', type: 'smoothstep', label: 'smoothstep edge' },
  { id: 'e2-3', source: '2', target: '3', type: 'step', label: 'step edge' },
  { id: 'e3-4', source: '3', target: '4', type: 'straight', label: 'straight edge' },
  { id: 'e3-3a', source: '3', target: '3a', type: 'straight', label: 'label only edge', style: { stroke: 'none' } },
  { id: 'e3-5', source: '4', target: '5', animated: true, label: 'animated styled edge', style: { stroke: 'red' } },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    label: h(CustomLabel, { label: 'custom label text' }, {}),
    labelStyle: { fill: 'red', fontWeight: 700 },
    markerEnd: {
      type: MarkerType.Arrow,
    },
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    label: 'label with styled bg',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#FFCC00', color: '#fff', fillOpacity: 0.7 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-8',
    source: '5',
    target: '8',
    type: 'custom',
    data: { text: 'custom edge' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e5-9',
    source: '5',
    target: '9',
    type: 'custom2',
    data: { text: 'custom edge 2' },
  },
]
