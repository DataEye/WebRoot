<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="input-group">
  <input type="text" value="{{value}}" class="form-control color-picker" />
  <span class="input-group-addon" on-click="expand">
    <i class="color-picker-preivew" style="background-color: {{value}};"></i>
  </span>
</div>
