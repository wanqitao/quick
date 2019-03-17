<template>
  <span :class="questionClass">
    <el-tooltip class="item" :effect="effect" :content="content" :placement="placement">
      <i :class="questionIcon"></i>
    </el-tooltip>
  </span>
</template>

<script>
/**
 * 提示信息组件
 * content 要显示的提示信息 默认值为: 提示信息
 * placement 提示信息位置
 * effect 提示信息主题 有dark/light 默认值为：dark
 * questionClass 提示信息样式 默认值为：popperClass
 * questionIcon 提示信息图标 默认值为：icon-question-sign
 */
export default {
  name: 'questionTooltip',

  data() {
    return {

    }
  },
  props: {
    content: {
      type: String,
      required: false,
      default: '提示信息'
    },
    placement: {
      type: String,
      required: false,
      default: 'right'
    },
    effect: {
      type: String,
      required: false,
      default: 'dark'
    },
    questionClass: {
      type: String,
      required: false,
      default: 'popperClass'
    },
    questionIcon: {
      type: String,
      required: false,
      default: 'icon-question-sign'
    }
  },
  methods: {
  }
}
</script>
<style type="text/css">
.popperClass {
  left: 4px;
  color: #bbb3b3;
  cursor: pointer;
  position: relative;
}
</style>