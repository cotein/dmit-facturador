<template>
    <a-cascader v-model:value="value" :options="options" :show-search="{ filter }" placeholder="Please select" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { CascaderProps } from 'ant-design-vue';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';

const filter: ShowSearchType['filter'] = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
};

const value = ref<string[]>([]);

const options: CascaderProps['options'] = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                    {
                        value: 'xiasha',
                        label: 'Xia Sha',
                        disabled: true,
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua men',
                    },
                ],
            },
        ],
    },
];
</script>
