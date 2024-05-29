<script setup lang="ts">
import { AuthenticationWrap } from './style';
</script>
<template>
	<AuthenticationWrap
		:style="{
			backgroundImage: `url('/src/assets/img/wave.svg')`,
			'background-color': '#f8f9fb',
		}"
	>
		<div class="ninjadash-authentication-wrap">
			<div class="ninjadash-authentication-brand">
				<!-- <img src="/src/assets/img/Logo_Dark.svg" alt="" /> -->
				<img :src="$environment.VITE_SRC_ASSETS + '/dmit-logo.png'" alt="" />
			</div>
			<router-view></router-view>
		</div>
	</AuthenticationWrap>
</template>
<style scoped>
img {
	width: 231px;
}
</style>
