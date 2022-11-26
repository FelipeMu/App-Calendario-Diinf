<template>
  <body>
    <AdminNavbar />
      <br>
        <div class="row">

          <!--Aqui comienza la vista principal de "Mi perfil"-->
          <div class="col-lg-4">
            <div class="card mb-4" style="width: 30rem; left:2%;">
              <div class="card-body text-center">
                <img src="@/assets/avatar_unisex.png" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
                <h5 class="my-3">{{admin.nombre}}</h5>
                <p class="text-muted mb-1">Administrador(a)</p>
                <p class="text-muted mb-4">Universidad Santiago de Chile</p>
                <div class="d-flex justify-content-center mb-2">
                  <!--Aqui viene la ventana model (actualizar perfil)-->
                  <template>
                    <v-row justify="center">
                      <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="600px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-card-actions>

                            <v-flex justify-center>
                              <v-hover v-slot="{ hover }">
                                <v-btn
                                  class="v-btn white--text mx-1 px-6"
                                  elevation="2" 
                                  :style="{'background-color': hover ? 'black' : '#505050'}"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="dialog=true"
                                >
                                Actualizar mis datos personales
                                </v-btn>
                              </v-hover>
                            </v-flex>

                          </v-card-actions>  
                        </template>
                        <v-card :style="[{backgroundColor: 'white'}]">
                          <v-card-title>
                            <span class="text-h5">Actualización de mis datos personales</span>
                          </v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12">
                                  <v-text-field
                                    label="Nombre administrador(a)"
                                    v-model="nombre_admin"
                                    type="text"
                                    required
                                  ></v-text-field>
                                </v-col>
                                
                                <v-col cols="12">
                                  <v-text-field
                                    label="Correo institucional USACH"
                                    v-model="correo_admin"
                                    type="email"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                           
                           
                            <v-hover v-slot="{ hover }">
                              <v-btn
                              
                                color="#adadad"
                                style="text-decoration: none;"
                                elevation="2" 
                                :style="{'background-color': hover ? 'red' : 'gray'}"
                                @click="dialog = false"
                               
                              >
                                Cancelar
                              </v-btn>
                             </v-hover>

                             <v-hover v-slot="{ hover }">
                              <v-btn
                          
                                dark
                                style="text-decoration: none;"
                                elevation="2" 
                                :style="{'background-color': hover ? '#098e00' : 'black'}"
                                @click="ActualizarDatos()"  
                              >
                                Actualizar y guardar
                              </v-btn>
                          </v-hover>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-row>
                  </template>
          

                </div>
              </div>
            </div> 
          </div>
          <div class="col-lg-8">
            <div class="card mb-4" style="width: 60rem;">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Nombre</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{{admin.nombre}}</p>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Correo institucional USACH</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{{admin.correo}}</p>
                  </div>
                </div>
                <hr>
              </div>
            </div>
          </div>
        </div>
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
      dialog: false,
      result: null,
      admin: {},
      id_admin: null,
      todook: '',

      //para ventana - actualizar datos v-model
      nombre_admin: "",
      correo_admin: ""
    }),

    methods: {

      /*
      Entrada: -
      Salida: boolean
      Descripcion: Verificar si el correo es perteneciente a la institucion
      */
      validarCorreo(){   
        var emailField = this.correo_admin;
        // Expresion regular para validar el correo electronico institucional
        var validEmail =  /(^[a-zA-Z]+)([.])([a-zA-Z]+)([.][a-zA-Z])?@usach([.])cl/g;

        // Using test we can check if the text match the pattern
        if( validEmail.test(emailField) ){
          return true;
        }
        else{
          return false;
        }     
      },

      /*
      Entrada: -
      Salida: boolean
      Descripcion: Verificar nombre de usuario (nombre y dos apellidos)
      */
      validarNombreDeUsuario(){   
        var namefield = this.nombre_admin;     
        // Expresion regular para validar nombre y apellidos
        var validName =  /^([a-zA-Z]+)(\s[a-zA-Z]+)(\s[a-zA-Z]+)+$/;

        // Using test we can check if the text match the pattern
        if( validName.test(namefield) ){
          return true;
        }
        else{
          return false;
        }     
      },

      async VerificarNuevosDatos(){
        if(this.nombre_admin !="" && this.correo_admin!=""){
          if(this.$options.methods.validarCorreo.bind(this)() && this.$options.methods.validarNombreDeUsuario.bind(this)()){
            return 200;
          }
          else{
            return 0;
          }
        }
        else{
          return 0;
        }
      },

      // Se procede a verificar el formato de los datos nuevos, si todo va ok, se actualiza la información.
      async ActualizarDatos(){
        //Se verifica que los campos esten no vacios
        let exito = await this.VerificarNuevosDatos();
        if(exito == 200){
          //se pasan las primeras letras a mayúsculas, i.e el nombre y los dos primeros apellidos
          let NombreyApellidos = this.nombre_admin.split(" ");
          for (let i = 0; i < NombreyApellidos.length; i++) {
            NombreyApellidos[i] = NombreyApellidos[i][0].toUpperCase() + NombreyApellidos[i].substr(1);
          }
          this.nombre_admin= NombreyApellidos.join(" ");



          //Se procede a realizar una petición PUT desde axios 
          //Se envia id profesor, nombre modificado y correo modificado
          let payload = {
            nombre: this.nombre_admin,
            correo: this.correo_admin,
            id_admin: this.id_admin
          }
          console.log(payload);
          let ok = 200;
          
          await axios
            .put("/update/admin/", payload)
            .then((result) => {
              this.todook = result.data;
            }).catch(e => {
                  console.log(e);
            }); 

          //Datos actualizados correctamente 
          if(ok == this.todook){
            await Swal.fire({
                icon: 'success',
                title: '¡Tus datos han sido actualizados correctamente!',
                showConfirmButton: false,
                timer: 1700
              })

            //guardar datos en locastorage [falta usar JWT]
            this.guardarLocalStorage();

            this.dialog = false;
            window.location.href = "/admin-profile";   
          }
          else{
            await Swal.fire({
                icon: 'error',
                title: 'Hubo un problema en la actualización de tus datos',
                showConfirmButton: false,
                timer: 1700
            })
            this.dialog = false;  
          } 


        }
        else{
          await Swal.fire({
              icon: 'info',
              title: 'Por favor, completa todos los campos solicitados de forma correcta',
              showConfirmButton: true,
            
          })

        }
        
        
      },

      guardarLocalStorage(){//guardando informacion entre las vistas; st:storage
        localStorage.setItem("id_st_admin", this.id_admin);
        localStorage.setItem("nombre_st_admin", this.nombre_admin);
       
      },

      ObtenerLocalStorage(){
        //obteniendo id Usuario: profesor
        this.id_admin = localStorage.getItem("id_st_admin")
      }

    },

    async mounted() {
        //se obtiene el valor del correo ingresado en el inicio sesion
        await this.ObtenerLocalStorage();
        await axios
          .get("/perfiladmin/" + this.id_admin)
          .then((result) => {
            this.admin = result.data; 
            this.nombre_admin = this.admin.nombre;
            this.correo_admin = this.admin.correo;
          }).catch(e => {
                console.log(e);
            }); 
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