<template>
    <div>
        <van-nav-bar title="账单明细" />

        <van-cell-group v-if="recordStore.sortedRecords.length > 0" inset>
            <!-- 将 van-cell 包裹在 van-swipe-cell 中 -->
            <van-swipe-cell v-for="record in recordStore.sortedRecords" :key="record.id">
                <!-- 默认插槽，放我们原来的单元格内容 -->
                <van-cell :title="record.category" :value="`${record.type === 'expense' ? '-' : '+'} ${record.amount}`"
                    :label="`${record.date} | 账户: ${record.account}`" :class="record.type" />
                <!-- 右侧滑动插槽 -->
                <template #right>
                    <van-button square type="danger" text="删除" class="delete-button" @click="handleDelete(record.id)" />
                </template>
            </van-swipe-cell>
        </van-cell-group>

        <van-empty v-else description="还没有任何账单，快去记一笔吧！" />
    </div>
</template>

<script setup>
import { useRecordStore } from '@/stores/recordStore';
import { Dialog } from 'vant'; // 导入 Dialog 对话框

const recordStore = useRecordStore();

// 定义删除处理函数
const handleDelete = (recordId) => {
    Dialog({
        title: '确认删除',
        message: '确定要删除这条记账记录吗？此操作不可撤销。',
    })
        .then(() => {
            // 用户点击了确认
            recordStore.removeRecord(recordId);
        })
        .catch(() => {
            // 用户点击了取消
            console.log('取消删除');
        });
};
</script>

<style scoped>
/* ... expense 和 income 的样式不变 ... */
.delete-button {
    height: 100%;
    /* 让删除按钮和单元格一样高 */
}
</style>