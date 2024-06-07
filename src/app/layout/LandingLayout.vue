<template>
    <div id="preloader" v-if="isLoading"></div>
    <a-layout>
        <header id="header" class="fixed-top">
            <div class="container d-flex align-items-center" v-if="!isLoading">
                <h1 class="logo me-auto"><a href="www.dmit.ar">DMIT</a><small> Facturador en línea</small></h1>
                <!-- Uncomment below if you prefer to use an image logo -->
                <!-- <a href="www.dmit.ar" class="logo me-auto"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

                <nav id="navbar" class="navbar">
                    <ul>
                        <li>
                            <a class="nav-link scrollto active" href="#hero">Home</a>
                        </li>
                        <li>
                            <a class="nav-link scrollto" href="#delegate">Delegar servicio</a>
                        </li>
                        <li>
                            <a class="nav-link scrollto" href="#services">Ventajas</a>
                        </li>
                        <li>
                            <a class="nav-link scrollto" href="#faq">Preguntas frecuentes</a>
                        </li>
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
                        <img
                            :src="$environment.VITE_SRC_ASSETS + '/img/hero-img.png'"
                            class="img-fluid animated"
                            alt=""
                            height="646"
                            width="780"
                        />
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
                                <h3>
                                    <strong>Delegar servicio de facturación electrónica</strong>
                                </h3>
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
                                            ><span>01</span> ¿Qué es el web service de factura electrónica de AFIP?
                                            <i class="bx bx-chevron-down icon-show"></i
                                            ><i class="bx bx-chevron-up icon-close"></i
                                        ></a>
                                        <div
                                            id="accordion-list-1"
                                            class="collapse show"
                                            data-bs-parent=".accordion-list"
                                        >
                                            <p>
                                                El web service de factura electrónica de AFIP es una herramienta que
                                                permite a los contribuyentes emitir facturas electrónicas en forma
                                                automática.
                                            </p>
                                        </div>
                                    </li>

                                    <li>
                                        <a
                                            data-bs-toggle="collapse"
                                            data-bs-target="#accordion-list-2"
                                            class="collapsed"
                                            ><span>02</span> ¿Qué significa delegar el web service de factura
                                            electrónica de AFIP? <i class="bx bx-chevron-down icon-show"></i
                                            ><i class="bx bx-chevron-up icon-close"></i
                                        ></a>
                                        <div id="accordion-list-2" class="collapse" data-bs-parent=".accordion-list">
                                            <p>
                                                Delegar el web service de factura electrónica de AFIP significa que un
                                                tercero autorizado (DMIT Facturación en línea) se encargará de emitir
                                                las facturas electrónicas en tu nombre. Esto te permite ahorrar tiempo y
                                                esfuerzo, y asegurarte de que tus facturas cumplen con todas las normas
                                                de AFIP.
                                            </p>
                                        </div>
                                    </li>

                                    <li>
                                        <a
                                            data-bs-toggle="collapse"
                                            data-bs-target="#accordion-list-3"
                                            class="collapsed"
                                            ><span>03</span> ¿Cuáles son los beneficios de delegar el web service de
                                            factura electrónica de AFIP? <i class="bx bx-chevron-down icon-show"></i
                                            ><i class="bx bx-chevron-up icon-close"></i
                                        ></a>
                                        <div id="accordion-list-3" class="collapse" data-bs-parent=".accordion-list">
                                            <p>Ahorra tiempo y esfuerzo</p>
                                            <p>Cumple con las normas de AFIP</p>
                                            <p>Evita errores</p>
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
                                <div class="icon">
                                    <i class="bx bx-tachometer"></i>
                                </div>
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
                                <div class="icon">
                                    <i class="bx bx-error-alt"></i>
                                </div>
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
                        <p>¡Resuelve todas tus dudas! Preguntas frecuentes sobre la factura electrónica de AFIP</p>
                    </div>

                    <div class="faq-list">
                        <ul>
                            <li data-aos="fade-up" data-aos-delay="100">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" class="collapse" data-bs-target="#faq-list-1"
                                    >¿Qué es la factura electrónica de AFIP? <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-1" class="collapse show" data-bs-parent=".faq-list">
                                    <p>
                                        La factura electrónica de AFIP es un comprobante digital que tiene la misma
                                        validez legal que la factura en papel. Se emite y recibe en formato electrónico,
                                        y permite agilizar y transparentar el proceso de facturación.
                                    </p>
                                </div>
                            </li>

                            <li data-aos="fade-up" data-aos-delay="200">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-2" class="collapsed"
                                    >¿Quiénes están obligados a emitir facturas electrónicas?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-2" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        La obligación de emitir facturas electrónicas depende de la categoría fiscal del
                                        contribuyente, la actividad que desarrolla y el monto de sus facturaciones.
                                        Puedes consultar si estás obligado en el sitio web de AFIP:
                                        <a-typography-link href="https://www.afip.gob.ar/fe/" target="_blank">
                                            AFIP - Facturación Electrónica
                                        </a-typography-link>
                                    </p>
                                </div>
                            </li>

                            <li data-aos="fade-up" data-aos-delay="300">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-3" class="collapsed"
                                    >¿Cómo puedo emitir facturas electrónicas?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-3" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Puedes emitir facturas electrónicas utilizando un software de facturación
                                        electrónica homologado por AFIP, o a través de un proveedor de servicios de
                                        facturación electrónica (DMIT Facturación en línea).
                                    </p>
                                </div>
                            </li>

                            <li data-aos="fade-up" data-aos-delay="400">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-4" class="collapsed"
                                    >¿Qué necesito para emitir facturas electrónicas?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-4" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Para emitir facturas electrónicas necesitas: Un certificado digital de AFIP, un
                                        software de facturación electrónica homologado o un proveedor de servicios de
                                        facturación electrónica y una conexión a internet.
                                    </p>
                                </div>
                            </li>

                            <li data-aos="fade-up" data-aos-delay="500">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-5" class="collapsed"
                                    >¿Cómo puedo obtener un certificado digital de AFIP?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-5" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        No necesitas obtener un certificado digital de AFIP para emitir facturas,
                                        nosotros lo hacemos por ti.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="500">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-6" class="collapsed"
                                    >¿Qué es el Código de Autorización Electrónico (CAE)?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-6" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        El Código de Autorización Electrónico (CAE) es un código único que se genera
                                        para cada factura electrónica. Es obligatorio incluir el CAE en la factura
                                        electrónica para que sea válida.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="500">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-7" class="collapsed"
                                    >¿Qué debo hacer si tengo problemas para emitir facturas electrónicas?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-7" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Si tienes problemas para emitir facturas electrónicas, puedes consultar la ayuda
                                        online de AFIP o contactarte con el soporte técnico de tu proveedor de software
                                        o servicios de facturación electrónica.
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="500">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-8" class="collapsed"
                                    >¿Cómo puedo consultar el estado de mis facturas electrónicas?
                                    <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-8" class="collapse" data-bs-parent=".faq-list">
                                    <p>
                                        Puedes consultar el estado de tus facturas electrónicas en el sitio web de AFIP:
                                        <a-typography-link
                                            href="https://serviciosweb.afip.gob.ar/genericos/comprobantes/default.aspx"
                                            target="_blank"
                                        >
                                            CONSTATACIÓN DE COMPROBANTES
                                        </a-typography-link>
                                    </p>
                                </div>
                            </li>
                            <li data-aos="fade-up" data-aos-delay="500">
                                <i class="bx bx-help-circle icon-help"></i>
                                <a data-bs-toggle="collapse" data-bs-target="#faq-list-9" class="collapsed"
                                    >Recursos adicionales: <i class="bx bx-chevron-down icon-show"></i
                                    ><i class="bx bx-chevron-up icon-close"></i
                                ></a>
                                <div id="faq-list-9" class="collapse" data-bs-parent=".faq-list">
                                    <ul>
                                        <li>
                                            AFIP - Facturación Electrónica:
                                            <a-typography-link href="https://www.afip.gob.ar/fe/" target="_blank">
                                                AFIP - Facturación Electrónica
                                            </a-typography-link>
                                        </li>
                                        <li>
                                            Preguntas frecuentes sobre la factura electrónica:
                                            <a-typography-link
                                                href="https://www.afip.gob.ar/facturacion/ayuda/"
                                                target="_blank"
                                            >
                                                AFIP - Ayuda Facturación Electrónica
                                            </a-typography-link>
                                        </li>
                                    </ul>
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
                                <li>
                                    <i class="bx bx-chevron-right"></i>
                                    <a href="#hero">Inicio</a>
                                </li>
                                <li>
                                    <i class="bx bx-chevron-right"></i>
                                    <a href="#delegate">Delegar servicio</a>
                                </li>
                                <li>
                                    <i class="bx bx-chevron-right"></i>
                                    <a href="#services">Ventajas</a>
                                </li>
                                <li>
                                    <i class="bx bx-chevron-right"></i>
                                    <a href="#faq">Preguntas frecuentes</a>
                                </li>
                            </ul>
                        </div>

                        <div class="col-lg-3 col-md-6 footer-links">
                            <h4>Nuestros Servicios</h4>
                            <ul>
                                <li>
                                    <i class="bx bx-chevron-right"></i>
                                    <a href="#">DMIT - Facturación electrónica</a>
                                </li>
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
                    <strong><span>DMIT</span></strong>
                </div>
            </div>
        </footer>
        <!-- End Footer -->

        <a href="#" class="back-to-top d-flex align-items-center justify-content-center"
            ><i class="bx bx-up-arrow-alt"></i>
        </a>
    </a-layout>
</template>
<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
const isLoading = ref<boolean>(true);

onBeforeMount(() => {
    let path = '';
    if (import.meta.env.MODE === 'development') {
        path = 'src/assets/vendor';
    } else {
        path = 'assets/vendor';
    }
    const css: string[] = [
        `${path}/css/style.css`,
        //'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Jost:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i',
        //`${path}/bootstrap/css/bootstrap.min.css`,
        //`${path}/bootstrap-icons/bootstrap-icons.css`,
        /*    `${path}/bootstrap-icons/fonts/bootstrap-icons.woff`,
        `${path}/bootstrap-icons/fonts/bootstrap-icons.woff2`, */
        `${path}/boxicons/css/boxicons.min.css`,
        //`${path}/remixicon/remixicon.css`,
        //`${path}/swiper/swiper-bundle.min.css`,
    ];

    css.forEach((c) => {
        const link = document.createElement('link');
        link.href = c;
        link.rel = 'stylesheet';
        link.media = 'print';
        link.onload = function () {
            link.media = 'all';
        };
        document.head.appendChild(link);
    });

    const script: string[] = [
        `${path}/js/main.js`,
        //`${path}/bootstrap/js/bootstrap.bundle.min.js`,
        //`${path}/isotope-layout/isotope.pkgd.min.js`,
        //`${path}/php-email-form/validate.js`,
        //`${path}/swiper/swiper-bundle.min.js`,
        `${path}/waypoints/noframework.waypoints.js`,
    ];

    script.forEach((s) => {
        const script = document.createElement('script');
        script.src = s;
        /* if (s === `${path}/bootstrap/js/bootstrap.bundle.min.js` || `${path}/swiper/swiper-bundle.min.js`) {
            script.defer = true;
        } */
        document.head.appendChild(script);
    });

    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
    });
});

onMounted(() => {
    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
});
</script>
<style scoped>
#faq-list-9 ul li {
    margin: 2px;
    padding: 2px;
}
</style>
