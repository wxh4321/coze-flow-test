import mitt from 'mitt' 
let emitter:any = null
export const EventBus = () => {
    if(emitter){
        return emitter
    }
    return emitter = mitt()
}
