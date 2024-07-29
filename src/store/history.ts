import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  // 快照栈堆
  const queue:any = ref([])
  // 栈堆下标
  const pointer = ref(0)
  // 栈堆的限制
  const LIMIT = 30

  const record = (data:any) => {
    while (pointer.value < queue.value.length - 1) {
      queue.value.pop()
    }
    pointer.value++
    queue.value.push(JSON.parse(JSON.stringify(data)))
    if (queue.value.length - 1 > LIMIT) {
      queue.value.shift()
    }
  }

  // 撤销
  const undo = () => {
    --pointer.value
    return JSON.parse(JSON.stringify(queue.value[pointer.value]))
  }

  // 重做
  const redo = () => {
    ++pointer.value
    return JSON.parse(JSON.stringify(queue.value[pointer.value]))
  }

  return {
    record,
    undo,
    redo,
  }
})