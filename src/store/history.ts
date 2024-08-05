import { deepClone } from '../utils';
import { defineStore } from 'pinia'
import { useGlobalStore } from '.';
const globalStore = useGlobalStore();

export const useHistoryStore = defineStore('history', () => {
  const queue:any = ref([]); // 快照栈堆
  const pointer = ref(0); // 栈堆下标 
  const LIMIT = 50;  // 栈堆的限制
  const record = (data:any) => {
      while (pointer.value < queue.value.length - 1) {
        queue.value.pop();
      }
      pointer.value++
      queue.value.push(deepClone(data))
      if (queue.value.length - 1 > LIMIT) {
        queue.value.shift()
      }
      console.log('record ', pointer.value, queue.value.length, queue.value);

    }
    // 撤销
    const undo = () => {
      --pointer.value
      const data = deepClone(queue.value[pointer.value]);
      if(!data){
        return;
      }
      console.log('undo ', pointer.value, queue.value.length, queue.value);
      globalStore.setFlowData(data);
      return data;
    }
    // 重做
    const redo = () => {
      ++pointer.value
      const data = deepClone(queue.value[pointer.value]);
      if(!data){
        return;
      }
      console.log('redo ', pointer.value, queue.value.length, queue.value);
      globalStore.setFlowData(data);
      return data;
    }
    return {
      queue,
      pointer,
      record,
      redo,
      undo
    }

})