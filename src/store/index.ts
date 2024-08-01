import { defineStore } from 'pinia'
import { useHistoryStore } from './history';

export const useGlobalStore = defineStore('global', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      workFlowData: {} as any,
      user:{} // 定义 actions getters 操作user
    }
  },
  getters: {
    getNodeDataById: (state) => {
      return (id: string) => {
        return (state.workFlowData as any)?.flowData.nodes.find((item: any) => item.id === id);
      }
    }
  },
  actions: {
    setWorkFlowState(data:any){
      this.workFlowData = data;
      // 保存历史
      const historyStore = useHistoryStore();
      if(data.flowData){
        historyStore.record(data.flowData);
      }
    },
    setFlowData(data:any){
      this.workFlowData.flowData = data;
    }
  }
});
