<template>
    <body>
      <AdminNavbar />
        <template>
            <br>
            <div class="row">
                <div class="col-lg-4">
                    <div class="card mb-4" style="width: 30rem; left:4%;">                     
                        <div class="card-body text-center">
                            <v-form>
                                <v-text-field 
                                    type="date" label="Inicio periodo universitario" v-model="start">
                                </v-text-field>

                                <v-text-field 
                                    type="date" label="Fin periodo universitario" v-model="end">
                                </v-text-field>

                                <v-text-field
                                v-model="semanas"
                                label="Número de semanas"
                                required
                                ></v-text-field>

                                <v-text-field
                                v-model="periodo"
                                label="Periodo (semestre-año)"
                                required
                                ></v-text-field>

                                <v-btn
                                    color="success"
                                    class="mr-4"
                                    @click="validar_semestre()"
                                >
                                    Crear periodo
                                </v-btn>
                            
                                <v-btn
                                    color="error"
                                    class="mr-4"
                                    @click="cancelar()"
                                >
                                    Cancelar
                                </v-btn>
                            </v-form>
                    
            

                        </div>
                    </div>
                </div> 
                <div class="col-lg-8">
                    <div class="card mb-4" style="width: 50rem; left:12%;">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-sm-3">
                            <p class="mb-0">Fecha de inicio semestre actual</p>
                          </div>
                          <div class="col-sm-9">
                            <p class="text-muted mb-0">{{informacion_semestre.fecha_inicio}}</p>
                          </div>
                        </div>
                        <hr>
                        <div class="row">
                          <div class="col-sm-3">
                            <p class="mb-0">Fecha de término semestre actual</p>
                          </div>
                          <div class="col-sm-9">
                            <p class="text-muted mb-0">{{informacion_semestre.fecha_termino}}</p>
                          </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-sm-3">
                              <p class="mb-0">N° semanas semestre actual</p>
                            </div>
                            <div class="col-sm-9">
                              <p class="text-muted mb-0">{{informacion_semestre.semanas_totales}}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-sm-3">
                              <p class="mb-0">Periodo actual</p>
                            </div>
                            <div class="col-sm-9">
                              <p class="text-muted mb-0">{{informacion_semestre.periodo}}</p>
                            </div>
                        </div>
                        <hr>


                      </div>
                    </div>
                  </div>
            </div>
        </template>  
    </body>  
        
    </template>
  
  <script>
    import Swal from 'sweetalert2/dist/sweetalert2.js';
    import AdminNavbar from "@/components/AdminNavbar.vue"
    import axios from 'axios'
    export default {
      components:{
        AdminNavbar
      },
      data: () => ({
      
        id_admin: '',
        nombre_admin: '',
        start: null,
        end: null,
        semanas: null,
        periodo: null,
        informacion_semestre: []
      }),
  
      methods: {
        /*
        guardarLocalStorage(){//guardando informacion entre las vistas; st:storage
          localStorage.setItem("id_st_admin", this.id_admin);
          localStorage.setItem("nombre_st_admin", this.nombre_admin);
         
        },
        */



        async validar_semestre(){
            console.log('creando semestre...');
            if(this.start && this.end && this.semanas && this.periodo){
                let semestre_anio = this.periodo.split('-');
                let anio_del_periodo = semestre_anio[1];
                let semestre_del_periodo = semestre_anio[0];
                let anio_i = this.start.substr(0, 4);
                let anio_f = this.end.substr(0, 4);


                //verificando concordancia entre las fechas y el periodo
                if(anio_del_periodo == anio_i && anio_del_periodo == anio_f){
                    await Swal.fire({
                        title: '¿Estas seguro(a) que deseas comenzar un nuevo periodo académido?',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Sí, crear periodo',
                        }).then((result) => {
                        if (result.isConfirmed) {
                            //** Aqui va la peticion POST **
                            let payload = {
                                fecha_inicio: this.start,
                                fecha_termino: this.end,
                                semanas_totales: this.semanas,
                                periodo: this.periodo,
                                id_admin: this.id_admin
                            };
                            console.log(payload);
                            axios
                            .post("http://localhost:4000/crearsemestre", payload)
                            .then((result) => {
                                console.log(result.data);
                            }).catch(e => {
                                console.log(e);
                            });


                            Swal.fire('¡Periodo creado exitosamente!', '', 'success');
                            this.start = null;
                            this.end = null;
                            this.periodo = null;
                            this.semanas = null;
                            this.obtenernuevainfo();
                            this.borrarevaluaciones();
                            //petición delete: borrar todas las evaluaciones

                        } else if (result.isDenied) {
                            Swal.fire('Los cambios no fueron guardados', '', 'info');
                            this.start = null;
                            this.end = null;
                            this.periodo = null;
                            this.semanas = null;
                        }
                        })
                }
                else{
                    await Swal.fire({
                        icon: 'info',
                        text: 'Los años de las fechas de inicio y fin no concuerdan con el nuevo periodo académico. Inténtelo nuevamente.',
                        showConfirmButton: false,
                    })

                }
                
            }
            else{
                console.log('datos no válidos');
                await Swal.fire({
                    icon: 'info',
                    text: 'Por favor, ingrese todos los datos solicitados',
                    showConfirmButton: false,
                })
            }
        },

        cancelar(){
            console.log('vaciando todos los campos...');
            this.start = null;
            this.end = null;
            this.periodo = null;
            this.semanas = null;
        },

  
        ObtenerLocalStorage(){
          //obteniendo id Usuario: profesor
          this.id_admin = localStorage.getItem("id_st_admin")
          this.nombre_admin = localStorage.getItem("nombre_st_admin")
        },

        async obtenernuevainfo(){
            //se obtiene el valor del correo ingresado en el inicio sesion
          await this.ObtenerLocalStorage();
          
          //obtener datos del periodo actual del semestre.
          //petición GET
          await axios
            .get("/informacionsemestre")
            .then((result) => {
              this.informacion_semestre = result.data;
              console.log('info del semestre');
              console.log(this.informacion_semestre);
            }).catch(e => {
                  console.log(e);
            });

            //Modificar el formato de fecha que viene de la base de datos
            let fecha_i = this.informacion_semestre.fecha_inicio.substring(0,10);
            let fecha_f = this.informacion_semestre.fecha_termino.substring(0,10);

            this.informacion_semestre.fecha_inicio = fecha_i;
            this.informacion_semestre.fecha_termino = fecha_f;
            console.log('nuevo json');
            console.log(this.informacion_semestre);


        },

        async borrarevaluaciones(){
            await axios
            .delete("/borrarsemestre")
            .then((result) => {
              console.log(result.data);
            }).catch(e => {
                  console.log(e);
            });
            this.obtenernuevainfo();
        }
  
      },
  
      async mounted() {
          //se obtiene el valor del correo ingresado en el inicio sesion
          await this.ObtenerLocalStorage();
          
          //obtener datos del periodo actual del semestre.
          //petición GET
          await axios
            .get("/informacionsemestre")
            .then((result) => {
              this.informacion_semestre = result.data;
              console.log('info del semestre');
              console.log(this.informacion_semestre);
            }).catch(e => {
                  console.log(e);
            });

            //Modificar el formato de fecha que viene de la base de datos
            let fecha_i = this.informacion_semestre.fecha_inicio.substring(0,10);
            let fecha_f = this.informacion_semestre.fecha_termino.substring(0,10);

            this.informacion_semestre.fecha_inicio = fecha_i;
            this.informacion_semestre.fecha_termino = fecha_f;
            console.log('nuevo json');
            console.log(this.informacion_semestre);

      }  
    }
  </script>
  
  <style>
  
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400&family=Poppins:wght@300&family=Roboto+Condensed,wght@1,300&display=swap');
    html,body { 
    font-family: 'Roboto', sans-serif;
      height: 100%; 
    background-image: url("@/assets/278014715_367270155411736_5039396390364308811_n.jpg");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
  }
  

  .container{
     max-width: 80%;
     padding:3%;
  }

  
  /* From uiverse.io */
  .button {
   display: inline-block;
   padding: 12px 24px;
   border: 1px solid #ff8b06;
   border-radius: 4px;
   transition: all 0.2s ease-in;
   position: right;
   overflow: hidden;
   font-size: 15px;
   color: rgb(255, 255, 255);
   text-decoration: none;
   background-color: #ff8b06;
   z-index: 1;
  }
  
  .button:before {
   content: "";
   position: absolute;
   left: 50%;
   transform: translateX(-50%) scaleY(1) scaleX(1.25);
   top: 100%;
   width: 140%;
   height: 180%;
   background-color: rgba(218, 8, 8, 0.05);
   color:#098e00;
   border-radius: 50%;
   display: block;
   transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
   z-index: -1;
  }
  
  .button:after {
   content: "";
   position: absolute;
   left: 55%;
   transform: translateX(-50%) scaleY(1) scaleX(1.45);
   top: 180%;
   width: 160%;
   height: 190%;
   background-color: #ff8b06;
   border-radius: 90%;
   display: block;
   transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
   z-index: -1;
  }
  
  .button:hover {
   color: #ffffff;
   border: 1px solid #ffffff;
  }
  
  .button:hover:before {
   top: -35%;
   background-color: #ff8b06;
   transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .button:hover:after {
   top: -45%;
   background-color: #ff8b06;
   transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  
  </style>