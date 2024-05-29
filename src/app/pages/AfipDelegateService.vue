<template>
	<div>
		<sdPageHeader title="AFIP - Factura electrónica" class="ninjadash-page-header-main"> </sdPageHeader>
		<Main>
			<a-row :gutter="25">
				<a-col :xxl="6" :lg="8" :md="10" :sm="11">
					<a-row>
						<a-col :xs="24">
							<FaqCategoryBox>
								<sdCards headless>
									<!-- <Badge class="faq-badge" type="light"> Browse by Topic </Badge> -->
									<ul>
										<li>
											<a class="active primary" @click="handleChange" href="#">
												Cómo delegar el servicio de Factura electrónica a nombre de DMIT
											</a>
										</li>
									</ul>
								</sdCards>
							</FaqCategoryBox>
						</a-col>

						<a-col :xs="24">
							<FaqSupportBox>
								<sdCards headless>
									<figure>
										<img :src="$environment.VITE_SRC_ASSETS + '/img/pages/support.svg'" alt="" />
									</figure>
									<figcaption>
										<sdHeading as="h5"
											>No encuentra la ayuda que necesita, envíenos un mensaje.</sdHeading
										>
										<sdButton size="default" type="primary"> Formulario de Contacto </sdButton>
									</figcaption>
								</sdCards>
							</FaqSupportBox>
						</a-col>
					</a-row>
				</a-col>
				<a-col :xxl="18" :lg="16" :md="14" :sm="13">
					<FaqWrapper>
						<sdCards headless title="Delegación del servicio de Factura electrónica">
							<a-collapse v-model:activeKey="activeKey" accordion :bordered="false">
								<template #expandIcon="props">
									<unicon name="plus" v-if="!props.isActive" width="14"></unicon>
									<unicon name="minus" v-else width="14"></unicon>
								</template>
								<a-collapse-panel header="Certificados digitales" key="1">
									<p>
										Los certificados digitales para el ambiente de producción se gestionan mediante
										las aplicaciones web “Administrador de Certificados Digitales” y “Administrador
										de Relaciones de Clave Fiscal”, disponibles en www.afip.gob.ar autenticándose
										con clave fiscal.
									</p>
									<!-- <sdHeading as="h4">Was this article helpful?</sdHeading>
									<div class="panel-actions">
										<sdButton :outlined="true" type="success">
											<unicon name="smile" width="14"></unicon>
											<span>Yes</span>
										</sdButton>
										<sdButton :outlined="true" type="warning">
											<unicon name="frown" width="14"></unicon>
											<span>No</span>
										</sdButton>
									</div> -->
								</a-collapse-panel>
								<a-collapse-panel header="Generar Certificados digitales" key="2">
									<p>
										Ud. no necesita generar ningún certificado digital para utilizar el servicio,
										sólo delegarlo a nombre de DMIT.
									</p>
									<!-- <sdHeading as="h4">Was this article helpful?</sdHeading>
									<div class="panel-actions">
										<sdButton :outlined="true" type="success">
											<unicon name="smile" width="14"></unicon>
											<span>Yes</span>
										</sdButton>
										<sdButton :outlined="true" type="warning">
											<unicon name="frown" width="14"></unicon>
											<span>No</span>
										</sdButton>
									</div> -->
								</a-collapse-panel>
								<a-collapse-panel
									header="Paso a paso de cómo delegar el servicio de facturación eletrónica"
									key="3"
								>
									<p>
										Ud. no necesita generar ningún certificado digital para utilizar el servicio,
										sólo delegarlo a nombre de DMIT.
									</p>
									<!-- <sdHeading as="h4">Was this article helpful?</sdHeading>
									<div class="panel-actions">
										<sdButton :outlined="true" type="success">
											<unicon name="smile" width="14"></unicon>
											<span>Yes</span>
										</sdButton>
										<sdButton :outlined="true" type="warning">
											<unicon name="frown" width="14"></unicon>
											<span>No</span>
										</sdButton>
									</div> -->
								</a-collapse-panel>
							</a-collapse>
						</sdCards>
					</FaqWrapper>
				</a-col>
			</a-row>
		</Main>
	</div>
</template>

<script setup lang="ts">
import { Main } from '../styled';
import { Badge, FaqCategoryBox, FaqSupportBox, FaqWrapper } from './style';
import { ref } from 'vue';

let activeKey = ref(['1']);
const handleChange = (e: any) => {
	e.preventDefault();
	e.target.closest('ul').querySelector('a.active').classList.remove('active');
	e.target.classList.add('active');
};
</script>
