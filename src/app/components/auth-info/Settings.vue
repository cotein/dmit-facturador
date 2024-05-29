<script setup lang="ts">
import { SettingDropdown } from './auth-info-style';
</script>

<template>
	<div class="ninjadash-nav-actions__settings">
		<sdPopover placement="bottomRight" action="click">
			<template v-slot:content>
				<SettingDropdown>
					<div class="setting-dropdown">
						<a-row :gutter="10">
							<a-col :sm="12">
								<router-link :to="{ name: 'delegate-afip-service' }">
									<figure class="setting-dropdown__single d-flex">
										<img
											:src="$environment.VITE_SRC_ASSETS + '/img/icon/013-document-1.png'"
											alt=""
										/>
										<figcaption>
											<sdHeading as="h5">Factura electrónica</sdHeading>
											<p>Delegar servicio</p>
										</figcaption>
									</figure>
								</router-link>
							</a-col>
							<a-col :sm="12">
								<figure class="setting-dropdown__single d-flex">
									<img
										:src="$environment.VITE_SRC_ASSETS + '/img/icon/015-color-palette.png'"
										alt=""
									/>
									<figcaption>
										<sdHeading as="h5">Themes</sdHeading>
										<p>Third party themes that are compatible</p>
									</figcaption>
								</figure>
							</a-col>
						</a-row>
					</div>
				</SettingDropdown>
			</template>
			<a to="#" class="ninjadash-nav-action-link">
				<img :src="$environment.VITE_SRC_ASSETS + '/img/icon/setting.png'" />
			</a>
		</sdPopover>
	</div>
</template>
