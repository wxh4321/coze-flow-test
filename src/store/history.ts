import { deepClone } from '../utils';
import { defineStore } from 'pinia'
import { useGlobalStore } from '.';
const globalStore = useGlobalStore();

export const useHistoryStore = defineStore('history', {
  state:()=>({
    queue: [], // 快照栈堆
    pointer: 0, // 栈堆下标 
    LIMIT: 50 // 栈堆的限制
  }),
  actions:{
    record(data:any){
      while (this.pointer < this.queue.length - 1) {
        this.queue.pop();
      }
      this.pointer++
      this.queue.push(deepClone(data))
      if (this.queue.length - 1 > this.LIMIT) {
        this.queue.shift()
      }
      console.log('record ', this.pointer, this.queue.length, this.queue);

    },
    // 撤销
    undo(){
      --this.pointer
      const data = deepClone(this.queue[this.pointer]);
      if(!data){
        return;
      }
      console.log('undo ', this.pointer, this.queue.length, this.queue);
      globalStore.setFlowData(data);
      return data;
    },
    // 重做
    redo(){
      ++this.pointer
      const data = deepClone(this.queue[this.pointer]);
      if(!data){
        return;
      }
      console.log('redo ', this.pointer, this.queue.length, this.queue);
      globalStore.setFlowData(data);
      return data;
    }
  }
})