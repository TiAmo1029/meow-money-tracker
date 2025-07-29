import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';

export const useRecordStore = defineStore('records', () => {
    // === STATE ===
    const records = ref(JSON.parse(localStorage.getItem('meow-money-records')) || []);

    // === GETTERS ===
    const monthlyStats = computed(() => {
        const stats = {};
        records.value.forEach(record => {
            const month = record.date.substring(0, 7);
            if (!stats[month]) {
                stats[month] = { income: 0, expense: 0, records: [] };
            }
            if (record.type === 'income') {
                stats[month].income += Number(record.amount);
            } else {
                stats[month].expense += Number(record.amount);
            }
            stats[month].records.push(record);
        });
        return stats;
    });

    const getExpenseByCategory = (month) => {
        return computed(() => {
            const stats = {};
            if (!monthlyStats.value[month]) return {};

            monthlyStats.value[month].records.forEach(record => {
                if (record.type === 'expense') {
                    // --- 核心修复：这里必须加上 Number(record.amount) 进行累加 ---
                    stats[record.category] = (stats[record.category] || 0) + Number(record.amount);
                }
            });
            return stats;
        });
    };

    const sortedRecords = computed(() => {
        return [...records.value].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    // === ACTIONS ===
    function persist() {
        localStorage.setItem('meow-money-records', JSON.stringify(records.value));
    }
    function addRecord(recordData) {
        records.value.unshift({ id: uuidv4(), ...recordData });
        persist();
    }
    function removeRecord(recordId) {
        const index = records.value.findIndex(r => r.id === recordId);
        if (index > -1) {
            records.value.splice(index, 1);
            persist();
        }
    }
    function clearAllRecords() {
        records.value = []; // 直接把记录数组清空
        persist(); // 更新localStorage
    }

    return { records, monthlyStats, getExpenseByCategory, sortedRecords, addRecord, removeRecord, clearAllRecords };
});