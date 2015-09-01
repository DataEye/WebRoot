/**
 * 模板示例
 * <ajaxButton url="字符串或者函数" data="这里可以绑定到一个函数"
 *  text="确定" loadingText="正在提交..." disable="" className="btn btn-primary"
 *  on-success="成功处理函数" on-error="失败处理函数"
 *  />
 */
define([
  'jquery', 'ractive', 'tmpl'
], function($, Ractive, tmpl) {
  var widget = Ractive.extend({
    template: tmpl.ajax_button,
    onrender: function() {
      var self = this

      this.on('request', function(e) {
        this.set('loading', true)

        var data = this.get()
        var url = $.isFunction(data.url) ? data.url() : data.url
        var formData = $.isFunction(data.data) ? data.data() : data.data

        $.post(url, formData).then(function() {
          self.fire('success', e, arguments)
        }).fail(function() {
          self.fire('error', e, arguments)
        }).always(function() {
          self.set('loading', false)
        })
      })
    }
  })

  Ractive.components.ajaxButton = widget

  return widget
})
