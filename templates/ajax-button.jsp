<button on-click="{{loading ? '' : 'request'}}" type="{{type || 'button'}}"
  class="{{className}}" {{#if disable}} disable {{/if}}>
  {{#if loading}}
    {{loadingText}}
  {{else}}
    {{text}}
  {{/if}}
</button>
