<template>
    <div>
        <van-nav-bar title="我的" />

        <div class="user-profile">
            <van-image round width="80" height="80" src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
            <h3 class="username">喵喵用户</h3>
        </div>

        <van-cell-group inset>
            <van-cell title="关于应用" is-link @click="showAbout" />
            <van-cell title="清除本地数据" is-link @click="clearData" />
        </van-cell-group>
    </div>
</template>

<script setup>
import { useRecordStore } from '@/stores/recordStore';
import { Dialog, Toast } from 'vant';

const recordStore = useRecordStore();

const showAbout = () => {
    Toast('喵喵记账 v1.0\n由 秦亚会 开发');
};

const clearData = () => {
    Dialog({
        title: '危险操作',
        message: '这将清除所有本地存储的记账数据，且无法恢复。确定要继续吗？',
        // --- 核心优化在这里 ---
        // 允许点击遮罩层来关闭弹窗
        closeOnClickOverlay: true
    }).then(() => {
        // 调用store里一个新增的action来清空数据
        recordStore.clearAllRecords();
        Toast('所有数据已清除');
    }).catch(() => { });
};
</script>

<style scoped>
.user-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
}

.username {
    margin-top: 10px;
}
</style>