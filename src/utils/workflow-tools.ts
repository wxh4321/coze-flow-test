import { EventBus } from './EventBus'
const eventBus = EventBus();
// 存储各个node节点的参数
export const saveModelData = (id:string,data:any) => {
    eventBus.emit('saveModelData', {id,data});
}