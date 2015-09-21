define([], function() {
  // 已经加载的ajax请求数目
  var LOADED = 'AJAX_NUM_LOADED'
  // 页面初始化需要的ajax数目
  var TOTAL = 'AJAX_NUM_TOTAL'
  /**
   * 组件没有render之前需要将回调全部存起来
   * 比如datagrid的画图的callback
   */
  var TASK_QUEUE = 'TASK_QUEUE'

  /**
   * 初始化操作
   * 设置已加载ajax数目、页面初始化需要的ajax数目、还有等待render完成之后的任务队列函数
   * 添加一个observer，当已加载请求等于全部请求时自动render组件
   * render之后将任务队列中的函数一一执行
   * @param ractive
   * @param el
   * @param ajaxTotalNum
   */
  function init(ractive, el, ajaxTotalNum) {
    if (ractive.fragment.rendered){
      console.log('Ractive实例已经渲染，可能el已经被设置')
      return
    }

    if (ractive.root != ractive) {
      console.log('只能应用在根节点，不能应用在component上')
      return
    }

    ractive.set(LOADED, 0)
    ractive.set(TOTAL, ajaxTotalNum)
    ractive.set(TASK_QUEUE, [])

    var listener = ractive.observe(LOADED, function AsyncRenderObserve(val) {
      if (val === ractive.get(TOTAL)) {
        ractive.render(el)

        ractive.get(TASK_QUEUE).forEach(function AsyncRenderConsumeQueue(fn) {
          fn()
        })

        ractive.set(TASK_QUEUE, null)

        listener.cancel()
        listener = null
      }
    }, {init: false})
  }


  /**
   * component内部异步请求完成后调用
   * 已加载ajax请求数+1
   * 回调加入到队列中render完成后调用
   *
   * @param ractive {Object} 组件实例
   * @param callback {Function} 回调函数
   * @param args {Array} 回调参数
   */
  function done(ractive, callback, args){
    var root = ractive.root
    var loaded = root.get(LOADED)
    // 没有使用AsyncRender直接返回
    if (typeof loaded !== 'number') {
      typeof callback === 'function' && callback.apply(ractive, args)
      return
    }

    var total = root.get(TOTAL)

    loaded < total && root.add(LOADED)

    if (root.get(LOADED) === total) {
      typeof callback === 'function' && callback.apply(ractive, args)
      return
    }

    // 将回调函数加入任务队列当render后调用
    if (typeof callback === 'function') {
      root.get(TASK_QUEUE).push(function AsyncRenderCallbackWrapper() {
        callback.apply(ractive, args)
      })
    }
  }

  return {
    init: init,
    done: done
  }
})
