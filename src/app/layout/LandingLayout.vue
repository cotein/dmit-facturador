<template>
	<a-layout>
		<header id="header" class="fixed-top">
			<div class="container d-flex align-items-center">
				<h1 class="logo me-auto"><a href="index.html">DMIT</a><small> Facturador en línea</small></h1>
				<!-- Uncomment below if you prefer to use an image logo -->
				<!-- <a href="index.html" class="logo me-auto"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

				<nav id="navbar" class="navbar">
					<ul>
						<li><a class="nav-link scrollto active" href="#hero">Home</a></li>
						<li><a class="nav-link scrollto" href="#delegate">Delegar servicio</a></li>
						<li><a class="nav-link scrollto" href="#services">Ventajas</a></li>
						<router-link class="getstarted scrollto" :to="{ name: 'login' }">Login</router-link>
					</ul>
					<i class="bi bi-list mobile-nav-toggle"></i>
				</nav>
				<!-- .navbar -->
			</div>
		</header>
		<!-- End Header -->

		<!-- ======= Hero Section ======= -->
		<section id="hero" class="d-flex align-items-center">
			<div class="container">
				<div class="row">
					<div
						class="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<h1>Facturación en línea para tu negocio</h1>
						<h2>
							Desde nuestro servicio podrá emitir comprobantes de venta, listarlos, enviarlos por correo
							electrónico, y más.
						</h2>
						<div class="d-flex justify-content-center justify-content-lg-start">
							<router-link class="btn-get-started scrollto" :to="{ name: 'register' }"
								>Registrarse</router-link
							>
						</div>
					</div>
					<div class="col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="200">
						<img src="/src/assets/img/hero-img.png" class="img-fluid animated" alt="" />
					</div>
				</div>
			</div>
		</section>
		<!-- End Hero -->

		<main id="main">
			<!-- ======= Why Us Section ======= -->
			<section id="delegate" class="why-us section-bg">
				<div class="container-fluid" data-aos="fade-up">
					<div class="row">
						<div
							class="col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1"
						>
							<div class="content">
								<h3><strong>Delegar servicio de facturación electrónica</strong></h3>
								<p>
									Para obtener los beneficios de la factura electrónica de AFIP en línea, primero
									deberá delegar el servicio a nuestro nombre. Delegar el acceso al servicio web de
									Facturación Electrónica de AFIP implica otorgar permisos a una entidad o aplicación
									externa (DMIT Facturación en línea) para que interactúe con el sistema de
									facturación electrónica de AFIP en tu nombre. Aquí tienes los pasos generales para
									hacerlo.
								</p>
							</div>

							<div class="accordion-list">
								<ul>
									<li>
										<a data-bs-toggle="collapse" class="collapse" data-bs-target="#accordion-list-1"
											><span>01</span> Non consectetur a erat nam at lectus urna duis?
											<i class="bx bx-chevron-down icon-show"></i
											><i class="bx bx-chevron-up icon-close"></i
										></a>
										<div
											id="accordion-list-1"
											class="collapse show"
											data-bs-parent=".accordion-list"
										>
											<p>
												Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat
												lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla
												urna porttitor rhoncus dolor purus non.
											</p>
										</div>
									</li>

									<li>
										<a
											data-bs-toggle="collapse"
											data-bs-target="#accordion-list-2"
											class="collapsed"
											><span>02</span> Feugiat scelerisque varius morbi enim nunc?
											<i class="bx bx-chevron-down icon-show"></i
											><i class="bx bx-chevron-up icon-close"></i
										></a>
										<div id="accordion-list-2" class="collapse" data-bs-parent=".accordion-list">
											<p>
												Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi.
												Id interdum velit laoreet id donec ultrices. Fringilla phasellus
												faucibus scelerisque eleifend donec pretium. Est pellentesque elit
												ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa
												tincidunt dui.
											</p>
										</div>
									</li>

									<li>
										<a
											data-bs-toggle="collapse"
											data-bs-target="#accordion-list-3"
											class="collapsed"
											><span>03</span> Dolor sit amet consectetur adipiscing elit?
											<i class="bx bx-chevron-down icon-show"></i
											><i class="bx bx-chevron-up icon-close"></i
										></a>
										<div id="accordion-list-3" class="collapse" data-bs-parent=".accordion-list">
											<p>
												Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis
												orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam
												sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus
												urna duis convallis convallis tellus. Urna molestie at elementum eu
												facilisis sed odio morbi quis
											</p>
										</div>
									</li>
								</ul>
							</div>
						</div>

						<div
							class="col-lg-5 align-items-stretch order-1 order-lg-2 img"
							style="background-image: url('/src/assets/img/why-us.png')"
							data-aos="zoom-in"
							data-aos-delay="150"
						>
							&nbsp;
						</div>
					</div>
				</div>
			</section>
			<!-- End Why Us Section -->

			<section id="services" class="services section-bg">
				<div class="container" data-aos="fade-up">
					<div class="section-title">
						<h2>Ventajas</h2>
						<!-- <p>
							La factura electrónica de AFIP permite a las empresas reducir costos en la emisión y
							almacenamiento de facturas en papel, así como en el envío y recepción de documentos físicos.
						</p> -->
					</div>
					<div class="row">
						<div
							class="col-xl-3 col-md-6 d-flex align-items-stretch"
							data-aos="zoom-in"
							data-aos-delay="100"
						>
							<div class="icon-box align-items-center">
								<div class="icon">
									<i class="bx bx-dollar"></i>
								</div>
								<h4><a href="">Ahorro de Tiempo y Costos</a></h4>
								<p>
									Ahorro significativo de tiempo y costos en el procesamiento de facturas, al eliminar
									la necesidad de imprimir y enviar facturas físicas, se reducen los costos asociados
									con la impresión, el envío y el almacenamiento de documentos en papel. Además,reduce
									el tiempo y los errores asociados con el procesamiento manual de facturas.
								</p>
							</div>
						</div>

						<div
							class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
							data-aos="zoom-in"
							data-aos-delay="200"
						>
							<div class="icon-box">
								<div class="icon"><i class="bx bx-sidebar"></i></div>
								<h4><a href="">Seguridad</a></h4>
								<p>
									Mayor seguridad y confidencialidad de los datos, ya que se utilizan sistemas
									encriptados y autenticación de usuarios.
								</p>
							</div>
						</div>

						<div
							class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
							data-aos="zoom-in"
							data-aos-delay="300"
						>
							<div class="icon-box">
								<div class="icon"><i class="bx bx-tachometer"></i></div>
								<h4><a href="">Mejora de productividad</a></h4>
								<p>
									La implementación de la factura electrónica de AFIP automatiza los procesos de
									facturación, lo que permite a las empresas mejorar su productividad y dedicar más
									tiempo a actividades de mayor valor agregado.
								</p>
							</div>
						</div>

						<div
							class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
							data-aos="zoom-in"
							data-aos-delay="400"
						>
							<div class="icon-box">
								<div class="icon"><i class="bx bx-error-alt"></i></div>
								<h4><a href="">Reducción de errores</a></h4>
								<p>
									La factura electrónica de AFIP reduce significativamente los errores de facturación
									gracias a la validación automática de datos y la eliminación de la necesidad de
									ingresar información manualmente.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!-- End Services Section -->

			<!-- ======= Frequently Asked Questions Section ======= -->
			<section id="faq" class="faq section-bg">
				<div class="container" data-aos="fade-up">
					<div class="section-title">
						<h2>Preguntas frecuentes</h2>
						<p>
							Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem.
							Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit
							alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.
						</p>
					</div>

					<div class="faq-list">
						<ul>
							<li data-aos="fade-up" data-aos-delay="100">
								<i class="bx bx-help-circle icon-help"></i>
								<a data-bs-toggle="collapse" class="collapse" data-bs-target="#faq-list-1"
									>Non consectetur a erat nam at lectus urna duis?
									<i class="bx bx-chevron-down icon-show"></i
									><i class="bx bx-chevron-up icon-close"></i
								></a>
								<div id="faq-list-1" class="collapse show" data-bs-parent=".faq-list">
									<p>
										Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus
										laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor
										rhoncus dolor purus non.
									</p>
								</div>
							</li>

							<li data-aos="fade-up" data-aos-delay="200">
								<i class="bx bx-help-circle icon-help"></i>
								<a data-bs-toggle="collapse" data-bs-target="#faq-list-2" class="collapsed"
									>Feugiat scelerisque varius morbi enim nunc?
									<i class="bx bx-chevron-down icon-show"></i
									><i class="bx bx-chevron-up icon-close"></i
								></a>
								<div id="faq-list-2" class="collapse" data-bs-parent=".faq-list">
									<p>
										Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id
										interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus
										scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim.
										Mauris ultrices eros in cursus turpis massa tincidunt dui.
									</p>
								</div>
							</li>

							<li data-aos="fade-up" data-aos-delay="300">
								<i class="bx bx-help-circle icon-help"></i>
								<a data-bs-toggle="collapse" data-bs-target="#faq-list-3" class="collapsed"
									>Dolor sit amet consectetur adipiscing elit?
									<i class="bx bx-chevron-down icon-show"></i
									><i class="bx bx-chevron-up icon-close"></i
								></a>
								<div id="faq-list-3" class="collapse" data-bs-parent=".faq-list">
									<p>
										Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci.
										Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl
										suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis
										convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
									</p>
								</div>
							</li>

							<li data-aos="fade-up" data-aos-delay="400">
								<i class="bx bx-help-circle icon-help"></i>
								<a data-bs-toggle="collapse" data-bs-target="#faq-list-4" class="collapsed"
									>Tempus quam pellentesque nec nam aliquam sem et tortor consequat?
									<i class="bx bx-chevron-down icon-show"></i
									><i class="bx bx-chevron-up icon-close"></i
								></a>
								<div id="faq-list-4" class="collapse" data-bs-parent=".faq-list">
									<p>
										Molestie a iaculis at erat pellentesque adipiscing commodo. Dignissim
										suspendisse in est ante in. Nunc vel risus commodo viverra maecenas accumsan.
										Sit amet nisl suscipit adipiscing bibendum est. Purus gravida quis blandit
										turpis cursus in.
									</p>
								</div>
							</li>

							<li data-aos="fade-up" data-aos-delay="500">
								<i class="bx bx-help-circle icon-help"></i>
								<a data-bs-toggle="collapse" data-bs-target="#faq-list-5" class="collapsed"
									>Tortor vitae purus faucibus ornare. Varius vel pharetra vel turpis nunc eget lorem
									dolor? <i class="bx bx-chevron-down icon-show"></i
									><i class="bx bx-chevron-up icon-close"></i
								></a>
								<div id="faq-list-5" class="collapse" data-bs-parent=".faq-list">
									<p>
										Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris vitae ultricies
										leo integer malesuada nunc vel. Tincidunt eget nullam non nisi est sit amet.
										Turpis nunc eget lorem dolor sed. Ut venenatis tellus in metus vulputate eu
										scelerisque.
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</section>
			<!-- End Frequently Asked Questions Section -->
		</main>
		<!-- End #main -->

		<!-- ======= Footer ======= -->
		<footer id="footer">
			<div class="footer-top">
				<div class="container">
					<div class="row">
						<div class="col-lg-3 col-md-6 footer-contact">
							<h3>DMIT</h3>
							<strong>Email:</strong> info@dmit.ar<br />
						</div>

						<div class="col-lg-3 col-md-6 footer-links">
							<h4>Useful Links</h4>
							<ul>
								<li><i class="bx bx-chevron-right"></i> <a href="#">Inicio</a></li>
								<li><i class="bx bx-chevron-right"></i> <a href="#">Ventajas</a></li>
							</ul>
						</div>

						<div class="col-lg-3 col-md-6 footer-links">
							<h4>Nuestros Servicios</h4>
							<ul>
								<li><i class="bx bx-chevron-right"></i> <a href="#">Desarrollo Web</a></li>
							</ul>
						</div>

						<div class="col-lg-3 col-md-6 footer-links">
							<h4>Redes Sociales</h4>
							<p>Proximamente...</p>
							<div class="social-links mt-3">
								<a href="#" class="twitter"><i class="bx bxl-twitter"></i></a>
								<a href="#" class="instagram"><i class="bx bxl-instagram"></i></a>
								<a href="#" class="linkedin"><i class="bx bxl-linkedin"></i></a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="container footer-bottom clearfix">
				<div class="copyright">
					&copy; Copyright <strong><span>Arsha</span></strong
					>. All Rights Reserved
				</div>
			</div>
		</footer>
		<!-- End Footer -->

		<div id="preloader" v-if="loading"></div>
		<a href="#" class="back-to-top d-flex align-items-center justify-content-center"
			><i class="bi bi-arrow-up-short"></i
		></a>
	</a-layout>
</template>
<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
const loading = ref<boolean>(true);

onBeforeMount(() => {
	let path = '';
	if (import.meta.env.MODE === 'development') {
		path = '/src/assets';
	} else {
		path = '/assets';
	}
	const css: string[] = [
		'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Jost:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i',
		`${path}/vendor/bootstrap/css/bootstrap.min.css`,
		`${path}/vendor/bootstrap-icons/bootstrap-icons.css`,
		`${path}/vendor/boxicons/css/boxicons.min.css`,
		//`${path}/vendor/glightbox/css/glightbox.min.css`,
		`${path}/vendor/remixicon/remixicon.css`,
		`${path}/vendor/swiper/swiper-bundle.min.css`,
		`${path}/css/style.css`,
	];

	css.forEach((c) => {
		const link = document.createElement('link');
		link.href = c;
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	});

	const script: string[] = [
		`${path}/vendor/bootstrap/js/bootstrap.bundle.min.js`,
		//${path}s/vendor/glightbox/js/glightbox.min.js`,
		`${path}/vendor/isotope-layout/isotope.pkgd.min.js`,
		`${path}/vendor/php-email-form/validate.js`,
		`${path}/vendor/swiper/swiper-bundle.min.js`,
		`${path}/vendor/waypoints/noframework.waypoints.js`,
		`${path}/js/main.js`,
	];

	script.forEach((s) => {
		const script = document.createElement('script');
		script.src = s;
		document.head.appendChild(script);
	});

	AOS.init({
		duration: 1000,
		easing: 'ease-in-out',
		once: true,
		mirror: false,
	});

	onMounted(() => {
		loading.value = false;
	});
});
</script>
