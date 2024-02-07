<template>
	<a-upload
		v-model:file-list="fileList"
		name="avatar"
		list-type="picture-card"
		class="avatar-uploader"
		:data="{ company: JSON.stringify(CompanyGetter) }"
		:show-upload-list="false"
		:action="URL_UPLOAD_AVATAR"
		:headers="{
			Authorization: `${UserTokenGetter.token_type} ${UserTokenGetter.access_token}`,
		}"
		:before-upload="beforeUpload"
		@change="handleChange"
	>
		<img class="avatar" v-if="imageUrl" :src="imageUrl" alt="avatar" />
		<div v-else>
			<loading-outlined v-if="loading"></loading-outlined>
			<plus-outlined v-else></plus-outlined>
			<div class="ant-upload-text">Upload</div>
		</div>
	</a-upload>
</template>
<script lang="ts" setup>
import { URL_UPLOAD_AVATAR } from '@/app/types/Constantes';
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useUserComposable } from '@/app/composables/user/useUserComposable';
const { CompanyGetter } = useCompanyComposable();
const { UserTokenGetter, setAvatar } = useUserComposable();

function getBase64(img: any, callback: (base64Url: string) => void) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
}

const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');

const handleChange = (info: UploadChangeParam) => {
	if (info.file.status === 'uploading') {
		loading.value = true;
		return;
	}
	if (info.file.status === 'done') {
		console.log('🚀 ~ file: uploadAvatar.vue:51 ~ handleChange ~ info.file:', info.file);
		// Get this url from response in real world.
		getBase64(info.file.originFileObj, (base64Url: string) => {
			imageUrl.value = base64Url;
			loading.value = false;
		});

		setAvatar(info.file.response);

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
	}
	const isLt2M = file.size / 1024 / 1024 < 1;
	if (!isLt2M) {
		message.error('El tamaño permitido de tu Avatar es de 1MB!');
	}
	return isJpgOrPng && isLt2M;
};
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
@/app/types/Constantes
