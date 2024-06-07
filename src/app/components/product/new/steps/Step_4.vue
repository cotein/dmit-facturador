<template>
    <div class="content--step">
        <a-form
            name="ninjadash_validation-form"
            ref="step4FormRef"
            :model="productStore.product"
            :rules="rules"
            layout="vertical"
        >
            <a-upload
                v-model:file-list="productStore.product.pictures"
                list-type="picture-card"
                @preview="handlePreview"
                action="http://localhost:8001/api/product/img"
                :beforeUpload="beforeUpload"
                :headers="{
                    Authorization: `${UserTokenGetter.token_type} ${UserTokenGetter.access_token}`,
                }"
            >
                <div v-if="fileList.length < 4">
                    <plus-outlined />
                    <div style="margin-top: 8px">Upload</div>
                </div>
            </a-upload>
            <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </a-form>
    </div>
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref, reactive } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { useUserComposable } from '@/app/composables/user/useUserComposable';
const { UserTokenGetter } = useUserComposable();
const { productStore } = useProductComposable();

const step4FormRef = ref();

function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const www = ref();

const beforeUpload = (file: UploadProps['fileList'][number], fileList: UploadProps['fileList']) => {
    console.log('🚀 ~ file: Step_4.vue:56 ~ beforeUpload ~ file:', file);
    console.log('🚀 ~ file: Step_4.vue:54 ~ beforeUpload ~ fileList:', fileList);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Sólo se pueden cargar imágenes!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('La imagen tiene que ser más pequeña que 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const fileList = ref([]);

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const validateArrayImage = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (value <= 0) {
            reject('El costo del producto debe ser mayor a cero.');
        } else {
            resolve(true);
        }
    });
};

const rules = reactive({
    fileList: [
        { required: true, message: 'Seleccione una imagen', trigger: 'mouseenter' },
        {
            validator: validateArrayImage,
            trigger: 'mouseenter',
        },
    ],
});

const validateForm = async () => {
    const isValid = await step4FormRef.value.validate().catch((error: any) => {
        return false;
    });

    if (isValid) {
        //setProductStep3Data(price);
        return true;
    } else {
        return false;
    }
};
defineExpose({ validateForm });
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.clearfix {
    margin-bottom: 5rem;
}
.content--step {
    min-height: 25rem;
}
</style>
