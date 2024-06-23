<template>
    <a-upload
        name="file"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="props.showUploadList"
        :before-upload="beforeUpload"
        @change="handleChange"
        @preview="handlePreview"
        @remove="handleRemove"
    >
        <div v-if="fileList.length < props.allowedImages">
            <plus-outlined />
            <div style="margin-top: 8px">{{ props.uploadText }}</div>
        </div>
    </a-upload>
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-button type="primary" @click="handleUpload" :loading="loading" :disabled="fileList.length === 0">
        Enviar
    </a-button>
</template>
<script lang="ts" setup>
import { URL_UPLOAD_COMPANY_LOGO } from '@/app/types/Constantes';
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { ApiHttp } from '@/api/base-api';
import { useSleepComposable } from '@/app/composables/sleep/useSleepComposable';
import { showMessage } from '@/app/helpers/mesaages';
import { watch } from 'vue';
const { CompanyGetter, company } = useCompanyComposable();
const { sleep } = useSleepComposable();
interface Props {
    urlAction: string;
    data: any;
    showUploadList: boolean;
    allowedImages: number;
    uploadText: string;
}

const props = withDefaults(defineProps<Props>(), {
    urlAction: '',
    data: {},
    showUploadList: false,
    allowedImages: 1,
    uploadText: 'Imagen',
});

function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const fileList = ref<File[]>([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');
const previewVisible = ref<boolean>(false);
const previewImage = ref<string>('');
const previewTitle = ref<string>('');

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
        loading.value = true;
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
            imageUrl.value = base64Url;
            loading.value = false;
        });

        return info.file;
    }
    if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
    }
};

const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Sólo se permiten imágenes');
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
        message.error('El tamaño permitido de tu Avatar es de 1MB!');
        return false;
    }
    if (fileList.value!.length >= props.allowedImages) {
        message.error(`Solo puedes subir ${props.allowedImages} archivo(s)`);
        return false;
    }
    fileList.value!.push(file);
    return false;
};

const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleUpload = async () => {
    loading.value = true;
    const formData = new FormData();
    fileList.value!.forEach((file, index) => {
        console.log('🚀 ~ fileList.value.forEach ~ file:', file);
        formData.append(`file_${index}`, file);
    });

    formData.append('company', CompanyGetter.value!.id);

    await sleep(1500);

    try {
        const { data } = await ApiHttp.post(URL_UPLOAD_COMPANY_LOGO, formData);

        let txt: string = 'Imagen subida correctamente';

        if (props.allowedImages > 1) {
            txt = 'Imágenes subidas correctamente';
        }

        showMessage('success', txt, 2);

        fileList.value = [];

        console.log('🚀 ~ handleUpload ~ data[0]:', data[0]);
        company.value!.urlLogo = data[0].urlLogo;
        company.value!.logo_base64 = data[0].logo_base64;
        //setCompany(data[0]);
    } catch (error) {
        console.error('Upload failed:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

const handleRemove = (file: any) => {
    console.log('🚀 ~ handleRemove ~ file:', file);
    const index = fileList.value.findIndex((item: any) => item.uid === file.uid);
    if (index !== -1) {
        fileList.value.splice(index, 1);
    }
};

watch(
    () => CompanyGetter.value,
    (newValue) => {
        if (newValue) {
            console.log('🚀 ~ watch ~ newValue:', newValue);
            //imageUrl.value = newValue.urlLogo;
        }
    },
);
</script>
<style>
.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
    max-width: 128px;
    max-height: 128px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.avatar {
    width: 128px;
    height: 128px;
    max-width: 128px;
    max-height: 128px;
}
</style>
