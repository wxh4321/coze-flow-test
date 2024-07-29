import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      workFlowData: {},
      user:{} // 定义 actions getters 操作user
    }
  },
  getters: {
    getWorkFlowData: (state) => state.workFlowData,
  },
  actions: {
    setWorkFlowState(data:any){
        this.workFlowData = data;
    }
  }
});
