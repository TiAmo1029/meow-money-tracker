<template>
    <div>
        <van-nav-bar title="统计报表" />

        <!-- 
      将Picker包裹在一个Popup中，交互体验更好。
      通过点击一个字段来弹出选择器。
    -->
        <van-field v-model="selectedMonth" is-link readonly label="选择月份" placeholder="请选择要统计的月份"
            @click="showPicker = true" />
        <van-popup v-model:show="showPicker" position="bottom">
            <van-picker title="选择月份" :columns="availableMonths" @confirm="onMonthConfirm"
                @cancel="showPicker = false" />
        </van-popup>

        <!-- ECharts 图表容器 -->
        <div v-if="hasDataForSelectedMonth" class="charts-container">
            <div ref="lineChartDom" style="width: 100%; height: 300px;"></div>
            <div ref="pieChartDom" style="width: 100%; height: 300px;"></div>
        </div>
        <van-empty v-else description="该月份无数据" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRecordStore } from '@/stores/recordStore';
import * as echarts from 'echarts';

const recordStore = useRecordStore();

// --- 状态与数据 ---
const selectedMonth = ref('');
const showPicker = ref(false); // 控制Picker弹窗的显示
const lineChartDom = ref(null);
const pieChartDom = ref(null);
let lineChart = null;
let pieChart = null;

// --- 计算属性 ---
const availableMonths = computed(() => Object.keys(recordStore.monthlyStats).sort((a, b) => b.localeCompare(a)));
const hasDataForSelectedMonth = computed(() => recordStore.monthlyStats[selectedMonth.value] !== undefined);

// 核心修复：创建一个本地的、动态的计算属性来获取分类数据
const expenseByCategory = computed(() => {
    if (!selectedMonth.value) return {};
    return recordStore.getExpenseByCategory(selectedMonth.value).value;
});

// --- ECharts 函数 ---
function initCharts() {
    if (lineChartDom.value && !lineChart) lineChart = echarts.init(lineChartDom.value);
    if (pieChartDom.value && !pieChart) pieChart = echarts.init(pieChartDom.value);
}

function updateCharts() {
    if (!lineChart || !pieChart || !hasDataForSelectedMonth.value) return;

    // 更新折线图 (现在只显示一条线，代表选中月份每天的支出)
    const dailyExpense = {};
    recordStore.monthlyStats[selectedMonth.value].records.forEach(r => {
        if (r.type === 'expense') {
            dailyExpense[r.date] = (dailyExpense[r.date] || 0) + Number(r.amount);
        }
    });
    const lineData = Object.entries(dailyExpense).sort((a, b) => a[0].localeCompare(b[0]));

    lineChart.setOption({
        title: { text: `${selectedMonth.value} 每日支出趋势`, left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: lineData.map(d => d[0].substring(8, 10) + '日') },
        yAxis: { type: 'value' },
        series: [{ name: '支出', type: 'line', data: lineData.map(d => d[1]), smooth: true }],
        dataZoom: [{ type: 'inside' }] // 增加内置缩放
    }, true);

    // 更新饼图
    const pieData = Object.entries(expenseByCategory.value).map(([name, value]) => ({ name, value }));
    pieChart.setOption({
        title: { text: `${selectedMonth.value} 支出分类占比`, left: 'center' },
        tooltip: { trigger: 'item', formatter: '{b} : {c}元 ({d}%)' },
        series: [{ type: 'pie', radius: '50%', data: pieData }],
    }, true);
}

// --- 事件处理 ---
const onMonthConfirm = ({ selectedValues }) => {
    selectedMonth.value = selectedValues[0];
    showPicker.value = false;
};

// --- 生命周期与监听 ---
onMounted(async () => {
    // 默认选中最新的月份
    if (availableMonths.value.length > 0) {
        selectedMonth.value = availableMonths.value[0];
    }
    // nextTick 确保DOM已更新
    await nextTick();
    initCharts();
});

onUnmounted(() => {
    if (lineChart) lineChart.dispose();
    if (pieChart) pieChart.dispose();
});

// 核心修复：只监听selectedMonth的变化就足够了
watch(selectedMonth, () => {
    // 当月份改变时，等待DOM更新（比如v-if重新显示图表容器）
    // 然后再更新图表
    nextTick().then(() => {
        initCharts(); // 确保实例存在
        updateCharts();
    });
}, { immediate: true }); // immediate: true 确保初始加载时就能执行一次

</script>