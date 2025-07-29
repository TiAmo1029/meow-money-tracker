<template>
    <div>
        <van-nav-bar title="记一笔" left-arrow @click-left="onClickLeft" />

        <van-form @submit="onSubmit">
            <!-- 金额输入 -->
            <van-field v-model="form.amount" label="金额" placeholder="0.00" type="number"
                :rules="[{ required: true, message: '请输入金额' }]" />
            <!-- 类型选择 -->
            <van-field name="type" label="类型">
                <template #input>
                    <van-radio-group v-model="form.type" direction="horizontal">
                        <van-radio name="expense">支出</van-radio>
                        <van-radio name="income">收入</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <!-- 分类输入 -->
            <van-field v-model="form.category" label="分类" placeholder="如：餐饮, 工资"
                :rules="[{ required: true, message: '请输入分类' }]" />
            <!-- 账户输入 -->
            <van-field v-model="form.account" label="账户" placeholder="如：微信, 支付宝"
                :rules="[{ required: true, message: '请输入账户' }]" />

            <!-- 日期选择字段 -->
            <van-field v-model="form.date" is-link readonly label="日期" placeholder="点击选择日期"
                @click="showDatePicker = true" />

            <!-- 提交按钮 -->
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    保 存
                </van-button>
            </div>
        </van-form>

        <!-- 
      日期选择弹窗。
      把 v-model:show 绑定到 showDatePicker。
      它会浮动在页面底部。
    -->
        <van-popup v-model:show="showDatePicker" position="bottom">
            <van-date-picker v-model="currentDate" title="选择日期" @confirm="onDateConfirm"
                @cancel="showDatePicker = false" />
        </van-popup>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRecordStore } from '@/stores/recordStore';
import { useRouter } from 'vue-router';
import { Toast } from 'vant';

const recordStore = useRecordStore();
const router = useRouter();

// 获取今天的日期字符串，格式 YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

const form = ref({
    amount: '',
    type: 'expense',
    category: '',
    account: '',
    date: getTodayString(),
});

const showDatePicker = ref(false);
// 将 DatePicker 的 v-model 绑定到一个数组，格式['YYYY', 'MM', 'DD']
const currentDate = ref(getTodayString().split('-'));

// 点击导航栏左侧箭头返回
const onClickLeft = () => router.back();

// 当日期选择器点击“确认”时
const onDateConfirm = ({ selectedValues }) => {
    // selectedValues 是一个数组，如 ['2025', '07', '28']
    form.value.date = selectedValues.join('-');
    showDatePicker.value = false; // 关闭弹窗
};

// 提交表单
const onSubmit = () => {
    recordStore.addRecord(form.value);
    Toast('保存成功！');
    router.push('/');
};
</script>