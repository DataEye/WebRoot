define([
  'jquery', 'ractive', 'tmpl',
  'bootstrap/timepicker'
], function($, Ractive, tmpl) {
  var widget = Ractive.extend({
    template: tmpl.time,
    onrender: function() {
      var app = this
      var data = app.get()

      var options = {}
      var optionList = 'template,minuteStep,showSeconds,secondStep,defaultTime,showMeridian,showInputs,disableFocus,disableMousewheel,modalBackdrop'

      optionList.split(',').forEach(function(key) {
        if (data.hasOwnProperty(key)) {
          options[key] = data[key]
        }
      })

      // 默认24小时展示
      if (!data.hasOwnProperty('showMeridian')) {
        options.showMeridian = false
      }

      options.defaultTime = data.value || 'default'

      $(app.find('input')).timepicker(options).on('changeTime.timepicker', function(e) {
        // 同步变化
        app.set('value', e.time.value)
      })

      app.observe('value', function(val) {
        $(app.find('input')).timepicker('setTime', val)
      }, {
        init: false
      })

      app.on('expand', function() {
        $(app.find('input')).focus()
      })
    }
  })

  Ractive.components.time = widget

  return widget
})