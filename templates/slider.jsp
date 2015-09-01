<div class="slider {{style ? 'slider-' + style : ''}}" style="{{#width}} width: {{width}}; {{/width}}
  {{#height}} height: {{height}}; {{/height}}">
  <div class="track {{style ? 'track-' + style : ''}}"></div>
  <div class="highlight-track {{style ? 'highlight-track-' + style : ''}}" style="width: {{percentage}}%;"></div>
  <div class="dragger {{style ? 'dragger-' + style : ''}}" style="left: {{percentage}}%;" on-mousedown="enableCapture"></div>
</div>