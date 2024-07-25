/**
 *  此函数的作用是，防止一个函数在短时间内被重复调用,只执行重复操作的最后一次。
 *  用法是传入需要被节流的函数，返回一个新的函数
 *  @param {Function} fuc 需要被防抖的函数，后面称为目标函数
 *  @param {Number}   wait 防抖时间间隔，在wait时间内多次调用的话，只会在最后一次调用以后延迟wait的时间执行目标函数
 *  @param {Boolean}  immediate 是否立即执行目标函数
 */
export function debounce(fuc: any, wait: any, immediate = false) {
  let timer: any = null //计时器
  function tf(...args: any[]) {
    let arg = args //保存调用参数
    let context = this //保存调用函数时的this
    if (timer) clearTimeout(timer) //每次进该函数都需要清除原有计时器
    if (immediate) {
      //判断immediate===true且没有定义过计时器则需要立即执行（计时器被清除，还是存有计时器ID的则这里的判断是false）
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait) //防止immediate=true时的多次调用
      if (callNow) {
        fuc.call(context, ...arg)
      }
    } else {
      //每次调用在等待时间之内的话先回把原有计时器删除，重新添加新的计时器
      timer = setTimeout(() => {
        fuc.call(context, ...arg)
      }, wait)
    }
  }
  tf.clearTimer = function () {
    //提前停止的函数
    clearTimeout(timer)
    timer = null
  }
  return tf
}

/**
 *  此函数的作用是，在制定间隔内任务只执行1次。
 *  用法是传入需要被节流的函数，返回一个新的函数
 *  @param {Function} fuc 需要被节流的函数，后面称为目标函数
 *  @param {Number}   wait 节流时间间隔，在wait时间内多次调用的话，只会执行一次函数。
 *  @param {Boolean}  options 两个参数first--为true时表示目标函数立即执行，在wait时间段内不会再执行，end----为true时表示过了wait时间后才会执行目标函数
 *  ① first为true且end为false----第一次调用执行目标函数，再wait时间段内重复调用不会执行目标函数，超过时间段内再次执行目标函数
 *  ② first为false且end为true----在wait时间段之前调用不会执行目标函数，过了wait时间后调用一次目标函数。
 *  ③ first为true且end为true----第一次调用执行目标函数，过了wait时间后再次调用执行目标函数。
 */
export function throttle(
  func: any,
  wait: any,
  options = { first: true, end: true }
) {
  let context: any
  let args: any
  let timer: any
  let now: any
  let remaining: any
  // previous只有在func函数被执行过后才回重新赋值。
  let previous = 0
  if (options.first === undefined) {
    options.first = true
  }
  if (options.end === undefined) {
    options.end = true
  }
  function tempFunc() {
    context = this
    args = arguments
    now = +new Date() //当前时间戳，每一次调用throttled函数，都会重新获取now，计算时间差。
    //第一次调用时才会满足条件。且first为false表示不立即执行。
    if (!previous && options.first === false) previous = now
    //计算剩余时间，now-previous为已消耗时间。
    remaining = wait - (now - previous)
    //remaining <= 0代表当前时间超过了wait时长。
    //remaining > wait代表now < previous，这种情况是不存在的，因为now >= previous是永远成立的(除非主机时间已经被修改过)。
    //此处就相当于只判断了remaining <= 0是否成立。
    // 条件场景：：①first为true的情况下第一次调用  ②超过时间段内重新执行
    if (remaining <= 0 || remaining > wait) {
      //将要执行func函数，重新设置previous的值，开始下一轮计时。
      previous = now
      // 清掉定时器，防止出现remaining <= 0但是设置的timeout仍然未触发的情况
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      func.apply(context, args)
      if (!timer) context = args = null
    } else if (!timer && options.end !== false) {
      //当在wait等待时间内，如果设置end为true，进入定时器。
      timer = setTimeout(function () {
        previous = options.first === false ? 0 : new Date().getTime()
        timer = null
        func.apply(context, args)
        if (!timer) context = args = null
      }, remaining)
    }
  }
  return tempFunc
}
