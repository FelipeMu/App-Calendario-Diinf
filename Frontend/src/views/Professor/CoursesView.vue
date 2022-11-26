<template>
  <body>
    <Navbar />
    <div class="row">
      <template>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-card-actions class="px-3 pb-3">
               
                  <v-btn
                    class="button"
                    color="#ffaa00"
                    style="text-decoration: none;"
                    :style="{'font-size': '17px'}"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                  CREAR NUEVO CURSO
                  </v-btn>
          
              </v-card-actions>  
            </template>
            <v-card :style="[{backgroundColor: 'white'}]">
              <v-card-title>
                <span class="text-h5">CREAR NUEVO CURSO</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Codigo asignatura*"
                        v-model="codigo_asignatura"
                        type="text"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        :items="['Diurno', 'Vespertino']"
                        label="Modalidad (Diurno o vespertino)*"
                        v-model="modalidad_asignatura"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Sección*"
                        v-model="seccion_asignatura"
                        type="text"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <small>Por favor, rellenar todos los campos necesarios</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                
                  color="#adadad"
                  style="text-decoration: none;"
                  @click.prevent="dialog = false; this.codigo_asignatura=''; this.modalidad_asignatura=''; this.seccion_asignatura=''"
                  href="/courses"
                >
                  Cancelar
                </v-btn>
                <v-btn
            
                  color="#00ca07"
                  style="text-decoration: none;"
                  @click="CrearCurso()"            
                >
                  Crear
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </template>

      <!-- Aqui comienzan a mostrarse las card de los cursos --> 
      <div class="center1">
        <div class="card" v-for="(curso,index) in cursos" :key="index">
          <div class="additional">
            <div class="user-card">
              <div class="level center">
                {{curso.periodo}}
              </div>

              <div class="points center sec">
                SECCIÓN {{curso.seccion}}
              </div>
              
              <div class="points center">
                NIVEL {{curso.nivel}}
              </div>
              
            </div>
            <div class="more-info">
              <h1>{{curso.nombre}}<h3>({{curso.codigo_asignatura}})</h3></h1>
              <div class="coords">
                <span>Horas semanales: {{curso.hrs_semanal}}</span>
              </div>
              <div class="coords">
                <span>Modalidad: {{curso.modalidad}}</span>
              </div>
              <div class="coords">
                <span>Laboratorio: {{curso.lab}}</span>
              </div>
            </div>
          </div>
          <div class="general">
            <h1>{{curso.nombre}}<h3>({{curso.codigo_asignatura}})</h3></h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a volutpat mauris, at molestie lacus.
              Nam
              vestibulum sodales odio ut pulvinar.</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import Navbar from "@/components/Navbar.vue"
import axios from 'axios'
export default {
  components: {
    Navbar,
  },
  data: () => ({

    dialog: false,
    cursos: null,

    id_profesor: null,
    nombre_profesor: "",

    // variables que almacenan datos ingresados al momento
    // de crear un curso
    codigo_asignatura: "",
    modalidad_asignatura: "",
    seccion_asignatura: "",

    //nombre del curso retornado por la petición ubicada en ComprobarCodigo()
    nombre_curso_retornado: "",
    nivel_curso_retornado: 0,
    id_modalidad_curso: 0

  }),

  methods: {
    ObtenerLocalStorage(){
      //obteniendo rut usuario
      this.id_profesor = localStorage.getItem("id_st_profesor")
      console.log('en ObtenerLocalStorage() - id del profesor:');
      console.log(this.id_profesor);
      this.nombre_profesor = localStorage.getItem("nombre_st_profesor")

    },

    async ComprobarCodigo(){
      await axios
      .get("/infocursobycod/" + this.codigo_asignatura)
      .then((result) => {
        this.nombre_curso_retornado = result.data.nombre;
        this.nivel_curso_retornado = result.data.nivel;
        console.log(this.nombre_curso_retornado)
      }).catch(e => {
            console.log(e);
        }); 

    },

    async CrearCurso(){
      
      //Aqui se debe hacer una query y ver si el código del curso existe en la base de datos.
      //si el código existe, entonces se precede a crear el curso de forma esperada.
      await this.ComprobarCodigo();

      if(this.codigo_asignatura!="" && this.modalidad_asignatura!="" && this.seccion_asignatura!=""){
        //si el código del curso existe en la DB:
        if(this.nombre_curso_retornado !== undefined){
          await Swal.fire({
              icon: 'success',
              title: '¡Curso '+this.nombre_curso_retornado+' creado exitosamente! ',
              showConfirmButton: false,
              timer: 2450
          })

          //determinar el id de la modalidad:
          if(this.modalidad_asignatura == 'Diurno'){
            this.id_modalidad_curso = 1;
          }
          else if(this.modalidad_asignatura == 'Vespertino'){
            this.id_modalidad_curso = 2;
          }
          else{
            // MODALIDAD: Mixto
            this.id_modalidad_curso = 3;
          }
     
          //PETICIÓN *POST* PARA INGRESAR EL 'CURSO NUEVO' A LA TABLA "profesor_dicta"
          let payload= {
            seccion: this.seccion_asignatura,
            id_profesor: this.id_profesor,
            id_modalidad: this.id_modalidad_curso,
            codigo_asignatura: this.codigo_asignatura
          }
          await axios
            //datos a enviar: seccion, id_profesor, id_modalidad, codigo_asignatura
            .post("/crearcurso",payload)
            .then((result) => {
              console.log("curso ingresado en la base de datos");
              console.log(payload)
            }).catch(e => {
                  console.log(e);
            }); 
            this.dialog = false;
            window.location.href = "/courses";

        }
        //si el codigo del curso no existe en la DB
        else{
          await Swal.fire({
              icon: 'error',
              title: 'El código del curso no existe en el sistema',
              showConfirmButton: false,
              timer: 1700
            })
        }
        
       
      }
      else{
        await Swal.fire({
              icon: 'info',
              title: 'Por favor, completa todos los campos solicitados',
              showConfirmButton: true,
          
            })

      }
      
    }

  },

  async mounted() {

    //se obtiene el valor del correo ingresado en el inicio sesion
    this.ObtenerLocalStorage();
    console.log('id del profesor actual :');
    console.log(this.id_profesor);
    await axios
      .get("/miscursos/" + this.id_profesor)
      .then((result) => {
        this.cursos = result.data;
      }).catch(e => {
            console.log(e);
        }); 
  }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400&family=Poppins:wght@300&family=Roboto+Condensed,wght@1,300&display=swap');
@import url('https://fonts.googleapis.com/css?family=Abel');

html,
body {
  font-family: Abel, Arial, Verdana, sans-serif;
  height: 100%;
  background-image: url("@/assets/278014715_367270155411736_5039396390364308811_n.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}

color-card{
  background-color: #ff6200;
}


/* From uiverse.io */
.button {
 display: inline-block;
 padding: 12px 24px;
 border: 1px solid #ffffff;
 border-radius: 4px;
 transition: all 0.2s ease-in;
 position: relative;
 overflow: hidden;
 font-size: 30px;
 color: #55616d;;
 text-decoration: none;
 background-color: #ffffff;
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
 color:rgb(233, 70, 0);
 border-radius: 50%;
 display: block;
 transition: all 0.6s 0.05s cubic-bezier(0.55, 0, 0.1, 1);
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
 background-color: #ff6200;
 border-radius: 50%;
 display: block;
 transition: all 0.6s 0.05s cubic-bezier(0.55, 0, 0.1, 1);
 z-index: -1;
}

.button:hover {
 color: #ffffff;
 border: 1px solid #ffffff;
}

.button:hover:before {
 top: -35%;
 background-color:  #ff6200;
 transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.button:hover:after {
 top: -45%;
 background-color: #ff6200;
 transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}


.row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
}

/* Create two equal columns that sits next to each other */
.center1 {
  flex: 50%;
  padding-top: 1%;
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  flex-wrap: wrap;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
}

.card {
  width: 450px;
  height: 250px;
  background-color: #55616d;

  box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin: 1.5rem;
}

.card h1 {
  text-align: center;
}

.card .additional {
  position: absolute;
  width: 150px;
  height: 100%;
  background: #f28828;
  transition: width 0.4s;
  overflow: hidden;
  z-index: 2;
}

.card:hover .additional {
  width: 100%;
  border-radius: 0 5px 5px 0;
}

.card .additional .user-card {
  width: 150px;
  height: 100%;
  position: relative;
  float: left;
}


.card .additional .user-card::after {
  content: "";
  display: block;
  position: absolute;
  top: 10%;
  right: -2px;
  height: 80%;
  border-left: 2px solid rgba(0, 0, 0, 0.025);

}

.card .additional .user-card .level,
.card .additional .user-card .points {
  text-align: center;
  top: 15%;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.95em;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.2rem 2rem;
  border-radius: 100px;
}

.card .additional .user-card .points {
  top: 85%;
}

.card .additional .user-card .sec {
  top: 50%;
}

.card .additional .more-info {
  width: 300px;
  float: left;
  position: absolute;
  left: 150px;
  height: 100%;
}

.card .additional .more-info h1 {
  color: #fff;
  margin-bottom: 0;
}


.card .additional .coords {
  margin: 0 1rem;
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
}



.card .additional .coords span+span {
  float: right;
}

.card .additional .stats {
  font-size: 2rem;
  display: flex;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  top: auto;
  color: #fff;
}


.card .additional .stats>div {
  flex: 1;
  text-align: center;
}

.card .additional .stats i {
  display: block;
}

.card .additional .stats div.title {
  font-size: 1px;
  font-weight: bold;
  text-transform: uppercase;
}

.card .additional .stats div.value {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.card .additional .stats div.value.infinity {
  font-size: 2.5rem;
}

.card .general {
  width: 300px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: 1rem;
  padding-top: 0;
  color: #fff;
}

.card .general .more {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9em;
}

.btn-edit{
  border: 2px solid #55616d;
  float: right;
  border-radius: 30px;
  padding: 5px 10px;
}

.btn-edit:hover{
  transform: scale(1.1);
}
</style>