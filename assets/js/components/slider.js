define(['ractive', 'tmpl'], function(Ractive, tmpl){
    var normalizePercentage = function(val) {
        if(val > 100) {
            return 100
        }
        if(val < 0) {
            return 0
        }
        return val
    }

    var Slider = Ractive.extend({
        template: tmpl.slider,
        isolated: true,
        init: function() {
            var app = this
            var data = app.get()
            if (!data.max) {
                app.set('max', 100)
            }
            if (data.min == null) {
                app.set('min', 0)
            }
            if (!data.step) {
                app.set('step', 1)
            }

            var isDragging = false
            var startPercantage = data.value ? 100 * data.value / (data.max -data.min) : 0
            var dragger, startX, fullWidth

            app.set('percentage', startPercantage)

            app.on('enableCapture', function(e) {
                // 初始化，记录开始位置信息
                dragger = e.node
                fullWidth = dragger.parentNode.offsetWidth
                isDragging = true
                startX = e.original.clientX
                startPercantage = app.get('percentage')
                dragger.setCapture && dragger.setCapture()
                return false
            })

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    var delta = e.clientX - startX
                    var newVal = normalizePercentage(100 * delta / fullWidth + startPercantage)
                    app.set('percentage', newVal)
                    app.fire('valuechange', e, newVal * (data.max - data.min) / 100 + data.min, newVal/100)
                }
            })

            document.addEventListener('mouseup', function(e) {
                if (isDragging) {
                    isDragging = false
                    dragger.releaseCapture && dragger.releaseCapture()

                    // 验证step，防止移动距离过小
                    // TODO snap支持，支持选中的值符合某些条件
                    var delta = e.clientX - startX
                    var minLen = fullWidth * data.step / (data.max - data.min)
                    if(delta && Math.abs(delta) < minLen) {
                        delta = delta > 0 ? minLen : -1 * minLen
                        var newVal = normalizePercentage(100 * delta / fullWidth + startPercantage)
                        app.set('percentage', newVal)
                        app.fire('valuechange', e, newVal * (data.max - data.min) / 100 + data.min, newVal/100)
                    }
                }
            })
        }
    })

    Ractive.components.slider = Slider

    return Slider
})