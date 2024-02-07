<template>
	<div>
		<span>{{ props.index! + 1 }}</span>
	</div>
</template>

<script setup lang="ts">
type Props = {
	index: number;
};
const props = withDefaults(defineProps<Props>(), {
	index: 1,
});
</script>

<style scoped>
div {
	text-align: center;
	width: 100%;
}
</style>
