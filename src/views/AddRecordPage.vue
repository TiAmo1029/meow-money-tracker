<template>
    <div>
        <van-nav-bar title="记一笔" left-arrow @click-left="$router.back()" />

        <van-form @submit="onSubmit">
            <van-field v-model="form.amount" label="金额" placeholder="0.00" type="number"
                :rules="[{ required: true, message: '请输入金额' }]" />

            <van-field name="radio" label="类型">
                <template #input>
                    <van-radio-group v-model="form.type" direction="horizontal">
                        <van-radio name="expense">支出</van-radio>
                        <van-radio name="income">收入</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <van-field v-model="form.category" label="分类" placeholder="如；餐饮，工资"
                :rules="[{ required: true, message: '请输入分类' }]" />

            <van-field v-model="form.account" label="账户" placeholder="如：微信，支付宝"
                :rules="[{ required: true, message: '请输入账户' }]" />

            <van-field v-model="form.date" is-link readonly name="dataPicker" label="日期"
                @click="showDatePicker = true" />
            <van-popup v-model:show="showDatePicker" position="bottom">
                <van-data-picker @confirm="onDateConfirm" @cancel="showDatePicker = false" />
            </van-popup>

            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    保存
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRecordStore } from '@/stores/recordStore';
import { useRouter } from 'vue-router';

// --- 核心修复在这里 ---
// 1. 从 'vant' 主包中，只导入你需要的 showToast 函数
import { Toast } from 'vant';

const recordStore = useRecordStore();
const router = useRouter();

const form = ref({
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    // 我们给 category 和 account 一个初始值，避免潜在问题
    category: '',
    account: '',
});

const showDatePicker = ref(false);

const onDateConfirm = ({ selectedValues }) => {
    form.value.date = selectedValues.join('-');
    showDatePicker.value = false;
};

const onSubmit = (values) => {
    console.log('Form submitted with values:', values); // 添加一个log，方便调试

    // 2. 直接调用导入的 showToast 函数
    Toast('保存成功！');

    // 3. 把表单的当前值传递给action
    recordStore.addRecord(form.value);

    router.push('/');
};
</script>
<style scoped>
/* 这里可以留空，或者写一点简单的样式 */
</style>