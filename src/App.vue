<template>
  <div class="app-container">
    <!-- 主内容区，路由页面将在这里显示 -->
    <router-view />

    <!-- 
      使用Vant的 Tabbar 组件作为底部导航。
      我们使用'route'模式，让它和Vue Router更好地集成。
    -->
    <van-tabbar v-model="active" route>
      <!-- 修正了拼写：van-tabbar-item -->
      <van-tabbar-item icon="orders-o" to="/">明细</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" to="/stats">统计</van-tabbar-item>
      <van-tabbar-item icon="add-o" to="/add" class="add-button"></van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/me">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
// 导入 useRoute 来获取当前路由信息
import { useRoute } from 'vue-router';

// active 的值现在应该与 Vant TabbarItem 的 name 属性或其索引对应
// 在 route 模式下，我们最好监听路由来动态更新它
const active = ref(0);
const route = useRoute();

// 监听路由路径的变化，来反向更新 active 的值
// 这样即使用户通过浏览器前进后退，Tabbar也能保持同步
watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case '/':
        active.value = 0;
        break;
      case '/stats':
        active.value = 1;
        break;
      case '/add':
        active.value = 2;
        break;
      case '/me':
        active.value = 3;
        break;
    }
  },
  { immediate: true } // immediate: true 确保组件加载时就立即执行一次
);
</script>

<style>
/* 全局样式 */
body {
  background-color: #f7f8fa;
}

.app-container {
  /* 确保内容不会被底部的Tabbar遮挡 */
  padding-bottom: 50px;
}

/* 修正了类名：van-tabbar-item__icon (两个下划线) */
.add-button .van-tabbar-item__icon {
  font-size: 40px !important;
  margin-top: -10px;
}
</style>