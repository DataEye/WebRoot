define([
  'jquery', 'ractive', 'tmpl',
  'bootstrap/colorpicker'
], function($, Ractive, tmpl) {
  var widget = Ractive.extend({
    template: tmpl.color,
    onteardown: function() {
      $(this.find('input')).colorpicker('destroy')
    },
    onrender: function() {
      var app = this
      var data = app.get()

      var options = {}
      var optionList = 'format,color,container,component,input,horizontal,inline,sliders,slidersHorz,template,align,customClass'

      optionList.split(',').forEach(function(key) {
        if (data.hasOwnProperty(key)) {
          options[key] = data[key]
        }
      })

      if (!data.hasOwnProperty('customClass')) {
        options.customClass = 'colorpicker-2x'
      }

      if (!data.hasOwnProperty('sliders')) {
        options.sliders = {
          saturation: {
            maxLeft: 200,
            maxTop: 200
          },
          hue: {
            maxTop: 200
          },
          alpha: {
            maxTop: 200
          }
        }
      }

      $(app.find('input')).colorpicker(options).on('changeColor.colorpicker', function(e) {
        // 同步变化
        app.set('value', e.color.toString())
      })

      app.observe('value', function(val) {
        $(app.find('input')).colorpicker('setValue', val)
      }, {
        init: false
      })

      app.on('expand', function() {
        $(app.find('input')).focus()
      })
    }
  })

  Ractive.components.color = widget

  return widget
})