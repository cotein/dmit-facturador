<template>
	<div>
		<div class="product-info left">
			<sdHeading class="product-info-title" as="h6">
				{{
					props.record.customer.last_name
						? `${props.record.customer.name} ${props.record.customer.last_name}`
						: props.record.customer.name
				}}</sdHeading
			>
			<ul class="info-list">
				<li>
					<span class="info-title">{{
						props.record.customer.fantasy_name ? props.record.customer.fantasy_name : ''
					}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';

type Props = {
	record: InvoiceList;
	index: number;
};

const props = withDefaults(defineProps<Props>(), {
	record: undefined,
	index: undefined,
});
</script>

<style scoped>
.left {
	text-align: left;
}
</style>
