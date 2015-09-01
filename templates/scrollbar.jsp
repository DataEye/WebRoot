<%@ page language="java" contentType="text/html; charset=utf-8"%>
<style>
	.scroll-bar{
		padding:15px 0;
		height: 10px;
		position: relative;
	}
	.scroll-bar>.track{
		width:100%;
		background: #ccc;
		background: -webkit-linear-gradient(top, #E0E3EA, #DDE0E7);
		background: -moz-linear-gradient(top, #E0E3EA, #DDE0E7);
		background: linear-gradient(top, #E0E3EA, #DDE0E7);
		-webkit-box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
		-moz-box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
		-webkit-border-radius: 8px;
		-moz-border-radius: 8px;
		border-radius: 8px;
		height: 4px;
		position: absolute;
		left: 0;
		top: 50%;
		margin-top: -2px;
	}
	.scroll-bar>.dragger {
		background: #8dca09;
		background: -webkit-linear-gradient(top,#9FA9BD,#909CB9);
		background: -moz-linear-gradient(top,#9FA9BD,#909CB9);
		background: linear-gradient(top,#9FA9BD,#909CB9);
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		border-radius: 10px;
		width: 45px;
		height: 10px;
		position: absolute;
		cursor: w-resize;
		left: 0;
		top: 50%;
		margin-top: -5px;
		font-size:8px;
		color:#FFFFFF;
		text-align:center;
		line-height:10px;
	}	
</style>
<div class="scroll-bar" on-mousedown="onMouseDown"
       on-mouseup="onMouseUp" on-mousemove="onMouseMove">
	<div class="track"></div>
	<div class="dragger" 
       style="left:{{mouseMoveX}}px">|||</div>
</div>