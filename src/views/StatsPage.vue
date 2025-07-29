<template>
    <div>
        <!-- 1. 顶部导航栏 -->
        <van-nav-bar title="统计报表" />

        <!-- 2. 月份选择区域 -->
        <van-field v-model="selectedMonth" is-link readonly label="统计月份" placeholder="请选择月份"
            @click="showPicker = true" />

        <!-- 3. 月份选择的弹出层 -->
        <van-popup v-model:show="showPicker" position="bottom">
            <van-picker title="选择月份" :columns="availableMonths" @confirm="onMonthConfirm"
                @cancel="showPicker = false" />
        </van-popup>

        <!-- 4. 图表展示区域 -->
        <!--    使用v-if，只有在确认有数据时才渲染图表容器 -->
        <div v-if="hasDataForSelectedMonth" class="charts-container">
            <div ref="lineChartDom" class="chart-item"></div>
            <div ref="pieChartDom" class="chart-item"></div>
        </div>

        <!-- 5. 无数据时的占位符 -->
        <van-empty v-else description="该月份无账单数据" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRecordStore } from '@/stores/recordStore';
import * as echarts from 'echarts';

// --- 1. 初始化 Store 和 状态变量 ---
const recordStore = useRecordStore();

const selectedMonth = ref('');      // 存放当前选中的月份，如 '2025-07'
const showPicker = ref(false);        // 控制月份选择弹窗的显示
const lineChartDom = ref(null);       // 绑定折线图的DOM容器
const pieChartDom = ref(null);        // 绑定饼图的DOM容器
let lineChart = null;                 // 存放折线图的ECharts实例
let pieChart = null;                  // 存放饼图的ECharts实例

// --- 2. 核心计算属性 ---

// 将store中的月份数据，转换为Vant Picker需要的格式
const availableMonths = computed(() => {
    const monthKeys = Object.keys(recordStore.monthlyStats).sort((a, b) => b.localeCompare(a));
    // 核心修复：将字符串数组 ['2025-07', ...] 转换为 [{ text: '2025-07', value: '2025-07' }, ...]
    return monthKeys.map(month => ({
        text: month,
        value: month
    }));
});

// 判断当前选中的月份是否有数据
const hasDataForSelectedMonth = computed(() => {
    return recordStore.monthlyStats[selectedMonth.value] !== undefined;
});

// 动态获取当前选中月份的支出分类数据
const expenseByCategory = computed(() => {
    if (!selectedMonth.value) return {};
    // 调用store的getter函数，并访问其.value来获取最终结果
    return recordStore.getExpenseByCategory(selectedMonth.value).value;
});


// --- 3. ECharts 相关函数 ---

// 初始化图表实例
function initCharts() {
    if (lineChartDom.value && !lineChart) {
        lineChart = echarts.init(lineChartDom.value);
    }
    if (pieChartDom.value && !pieChart) {
        pieChart = echarts.init(pieChartDom.value);
    }
}

// 更新图表数据和配置
function updateCharts() {
    // 安全检查，确保实例和数据都已就绪
    if (!lineChart || !pieChart || !hasDataForSelectedMonth.value) return;

    // --- 更新折线图：展示选中月份每日的支出趋势 ---
    const dailyExpense = {};
    recordStore.monthlyStats[selectedMonth.value].records.forEach(r => {
        if (r.type === 'expense') {
            const day = r.date.substring(8, 10); // 只提取“日”
            dailyExpense[day] = (dailyExpense[day] || 0) + Number(r.amount);
        }
    });
    // 将对象转换为数组并按日期排序
    const lineData = Object.entries(dailyExpense).sort((a, b) => a[0].localeCompare(b[0]));

    lineChart.setOption({
        title: { text: `${selectedMonth.value} 每日支出趋势`, left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { trigger: 'axis' },
        grid: { left: '15%', right: '5%', bottom: '15%' },
        xAxis: { type: 'category', data: lineData.map(d => `${d[0]}日`) },
        yAxis: { type: 'value' },
        series: [{ name: '支出', type: 'line', data: lineData.map(d => d[1]), smooth: true, areaStyle: {} }],
        dataZoom: [{ type: 'inside' }], // 支持内部缩放
    }, true);

    // --- 更新饼图：展示选中月份的支出分类占比 ---
    const pieData = Object.entries(expenseByCategory.value).map(([name, value]) => ({ name, value }));
    pieChart.setOption({
        title: { text: `${selectedMonth.value} 支出分类占比`, left: 'center', textStyle: { fontSize: 16 } },
        tooltip: { trigger: 'item', formatter: '{b} : {c}元 ({d}%)' },
        legend: { top: 'bottom' },
        series: [{
            name: '支出分类',
            type: 'pie',
            radius: '60%',
            data: pieData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }],
    }, true);
}


// --- 4. 事件处理与生命周期 ---

// 当用户在Picker中点击“确认”
const onMonthConfirm = ({ selectedOptions }) => {
    // 从Vant 4.x返回的 selectedOptions 数组中获取我们需要的 value
    if (selectedOptions && selectedOptions[0]) {
        selectedMonth.value = selectedOptions[0].value;
    }
    showPicker.value = false;
};

// 组件挂载后
onMounted(async () => {
    // 默认选中最新的月份
    if (availableMonths.value.length > 0) {
        selectedMonth.value = availableMonths.value[0].value;
    }
    // nextTick 确保DOM已更新，为ECharts初始化做准备
    await nextTick();
    initCharts();
});

// 组件销毁前
onUnmounted(() => {
    if (lineChart) lineChart.dispose();
    if (pieChart) pieChart.dispose();
});

// 监听 selectedMonth 的变化，自动更新图表
watch(selectedMonth, () => {
    nextTick().then(() => {
        initCharts(); // 确保实例存在
        updateCharts();
    });
}, { immediate: true }); // immediate: true 确保初始加载时就能执行一次

</script>

<style scoped>
.charts-container {
    padding: 10px;
}

.chart-item {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
}
</style>