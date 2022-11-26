<template>
  <body>
    <AdminNavbar />
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            
            <v-btn color="primary" dark class="mr-4" @click="dialog = true">
              Bloquear días
            </v-btn>
 
            <v-btn outlined class="mr-4" @click="setToday">
              Hoy
            </v-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title type="text">{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu bottom center>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  v-on="on"
                >
                  <span>{{ typeToLabel2[buscar_nivel] }}</span>
                  <v-icon left>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="BuscarPorNivel('1')">
                  <v-list-item-title>1</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('2')">
                  <v-list-item-title>2</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('3')">
                  <v-list-item-title>3</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('4')">
                  <v-list-item-title>4</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('5')">
                  <v-list-item-title>5</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('6')">
                  <v-list-item-title>6</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('7')">
                  <v-list-item-title>7</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('8')">
                  <v-list-item-title>8</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('9')">
                  <v-list-item-title>9</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('10')">
                  <v-list-item-title>10</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('11')">
                  <v-list-item-title>11</v-list-item-title>
                </v-list-item>
                <v-list-item @click="BuscarPorNivel('0')">
                  <v-list-item-title>Quiero ver solo mis eventos</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  v-on="on"              
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon left>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Día</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mes</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 días</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="es"
            :short-weekdays="false"
          ></v-calendar>

          <!-- Modal Agregar Evento -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-container>
                <v-form @submit.prevent="addEvent">
                  <v-row>
                    <v-col cols="4">
                      <!--TIPO DE BLOQUEO-->
                      <v-select
                            :items="['Semana de receso', 'Día feriado', 'Evento USACH']"
                            label="Tipo de bloqueo*"
                            required
                            type="string"
                            v-model="name"
                      ></v-select>
                    </v-col>

                    <v-text-field 
                      type="text" label="Agregar un Detalle" v-model="details">
                    </v-text-field>
                  </v-row>


                    

                   
                  <v-row>
                    <v-col cols="4">
                      <!--FECHA INICIO EVALUACIÓN-->
                      <v-text-field 
                        type="date" label="Inicio evaluación" v-model="start">
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <!--FECHA FIN EVALUACIÓN-->
                      <v-text-field 
                        type="date" label="Fin evaluación" v-model="end">
                      </v-text-field>
                    </v-col>
                    
                    <v-col cols="4">
                      <!--COLOR-->
                      <v-text-field 
                        type="color" label="Color del evento" v-model="color">
                      </v-text-field>
                    </v-col>
                  </v-row>

                 
                  <v-btn type="submit" color="primary" class="mr-4" 
                  @click.stop="dialog = false">Añadir evento al calendario</v-btn>
                </v-form>
              </v-container>
            </v-card>
          </v-dialog>


          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                
                <v-btn icon @click="deleteEvent(selectedEvent)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>


              <v-card-text>
              
                <v-form v-if="currentlyEditing !== selectedEvent.idevento">
                  Detalles: {{selectedEvent.details}}
                </v-form>

                <v-form v-else>

                  <textarea-autosize
                    v-model="selectedEvent.details"
                    type="text"
                    style="width: 100%"
                    :min-height="100"
                  ></textarea-autosize>

                  <v-text-field 
                        type="date" label="Nuevo inicio evento" v-model="start">
                  </v-text-field>

                  <v-text-field 
                        type="date" label="Nuevo fin evento" v-model="end">
                  </v-text-field>

                </v-form>

              </v-card-text>

              
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false; currentlyEditing = null"
                >
                  Cancel
                </v-btn>
                <v-btn text v-if="currentlyEditing !== selectedEvent.idevento"
                @click.prevent="editEvent(selectedEvent)">Editar detalles</v-btn>

                <v-btn text v-else  @click.prevent="updateEvent(selectedEvent)">Guardar Cambios</v-btn>
              </v-card-actions>
              
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </body>  
</template>

<script>
  import AdminNavbar from "@/components/AdminNavbar.vue"
  import Swal from 'sweetalert2/dist/sweetalert2.js';
  import axios from 'axios'

  export default {
    components:{
      AdminNavbar
    },


    data: () => ({
      today: new Date().toISOString().substring(0,10),
      focus: new Date().toISOString().substring(0,10),
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        '4day': '4 dias',
      },


      buscar_nivel: 'base',
      typeToLabel2: {
        base: 'Buscar evaluaciones por nivel',
        l1: 'nivel 1',
        l2: 'nivel 2',
        l3: 'nivel 3',
        l4: 'nivel 4',
        l5: 'nivel 5',
        l6: 'nivel 6',
        l7: 'nivel 7',
        l8: 'nivel 8',
        l9: 'nivel 9',
        l10: 'nivel 10',
        l11: 'nivel 11',
        cola: 'Buscar evaluaciones por nivel'
      },
      nivel_mostrado: '',
      nivel_seleccionado: 0,
      evaluaciones_por_nivel: [],
      mis_dias_bloqueados: [],
      //fecha_i: start,
      //fecha_f: end,
      start: null,
      end: null,
      start_respaldo: null,
      end_respaldo: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      name: null,
     
      details: null,
      color: '#1976D2',
      dialog: false,
      currentlyEditing: null,


      id_admin: 0, //se guardan el valor del id que viene de localstorage
      nombre_admin: '',//se guardan el valor del nombre que viene de localstorage

      arreglo_eventos: [],
      mensajeOk: ''
    }),
    
    computed: {
      title () {
        const { start, end } = this
        //console.log('inicio del mes');
        //console.log(this.start);
        //console.log('fin del mes');
        //console.log(this.end);
        if (!start || !end) {
          //console.log('ENTRÉ AL IF NULO');
          return ''
        }
        //console.log('PASÉ EL IF() NULO DE LA FUNCION title()');
        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? startMonth : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? startYear : endYear

        const startDay = start.day
        const endDay = end.day

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startDay} de ${startMonth} ${startYear} - ${endDay} de ${suffixMonth} ${suffixYear}`
          case 'day':
            return `${startDay} de ${startMonth} de ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },

    // ************************************ MOUNTED ************************************
    async mounted () {
      //se obtiene el valor del id-usuario que se encuentra navegando
      await this.ObtenerLocalStorage();
      // primera petición GET:
      //para ver el listado de cursos al momento de ingresar una evaluación
      //this.start = null;
      //this.end = null;
      
      this.$refs.calendar.checkChange();
    },

    created(){
      this.getEvents();
    },

    methods: {


      async BuscarPorNivel(nivel){
        await this.getEvents();
        this.nivel_seleccionado = parseInt(nivel,10);
        const events = [];
        // Se procede a traer las evaluaciones dependiendo del nivel seelccionado
        // ejemplo: nivel seleccionado = 3, se procede a traer las evaluaciones de nivel 2,3 y 4
        // ejemplo: nivel seleccionado = 7, se procede a traer las evaluaciones de nivel 6,7 y 8

        //se procede a llamar al metodo getEvents()
        if(nivel == 0){
          this.buscar_nivel = 'cola';
          await this.getEvents();
        }

        //Caso contrario, se procede a realizar la peticion que trae las respectivas evaluaciones
        else{
          this.nivel_mostrado = 'l'+nivel;
          this.buscar_nivel= this.nivel_mostrado;

          //se vacia el arreglo events[], el que contiene todos los eventos actuales
          this.events = [];
          this.arreglo_eventos = [];

          await axios
          .get("/evaluacionespornivel/" + this.nivel_seleccionado)
          .then((result) => {
            this.arreglo_eventos = result.data;
          }).catch(e => {
                console.log(e);
                
          });
          console.log('*****');
          console.log(this.arreglo_eventos);
          console.log('*****');

          
          //Bucle para eliminar la zona horaria que viene anidada a la fecha traida desde la base de datos
          for(let j=0; j<this.arreglo_eventos.length; j++){
              this.arreglo_eventos[j].start = this.arreglo_eventos[j].start.substring(0, 10);
              this.arreglo_eventos[j].end = this.arreglo_eventos[j].end.substring(0, 10);
          }
          //Bucle para pasar por el arreglo de evaluaciones e ir pusheando cada evaluacion en el calendario
          for(let j=0;j<this.arreglo_eventos.length; j++){
            events.push(this.arreglo_eventos[j]);
          }
           //Bucle para agregar los eventos del administrador
           for(let j=0;j<this.mis_dias_bloqueados.length; j++){
            events.push(this.mis_dias_bloqueados[j]);
          }
          await Swal.fire({
              icon: 'info', 
              text: 'A continuación, visualizará las evaluaciones del nivel seleccionado (nivel ' + nivel + ') ' + 'y además las evaluaciones que esten un nivel más arriba y un nivel más abajo.',
              showConfirmButton: false,
            
          })
          this.mis_dias_bloqueados = [];
          this.events = events;
        }
        
      },

      ObtenerLocalStorage(){
        //obteniendo id y nombre del profesor
        this.id_admin = localStorage.getItem("id_st_admin")
        this.nombre_admin = localStorage.getItem("nombre_st_admin")

      },

      async updateEvent(evento){
        try {
          if(this.start && this.end){
            let payload = {
              id_programar: evento.idevento,
              detalles: evento.details,
              start: this.start,
              end: this.end
            }
            console.log(evento.details);
            //Petición actualizar detalles del evento (evaluación o bloqueo de días)
            await axios
            .put("/actualizarevento", payload)
            .then((result) => {
              console.log(result.data);
            }).catch(e => {
                  console.log(e);
            }); 

            Swal.fire({
                  position: 'bottom-end',
                  icon: 'success',
                  title: 'Evento actualizado exitosamente',
                  text: 'Evento: '+evento.name,
                  showConfirmButton: false,
                  timer: 1700
            })
            await this.getEvents();
            this.selectedOpen = false;
            this.currentlyEditing = null;

            this.name = null;
            this.details = null;
            //this.start = null;
            //this.end = null;
            this.color = '#1976D2';
          }
          else{
            await Swal.fire({
              icon: 'info',
              title: 'Ops... La fecha ingresada no es válida.',
              text: 'Por favor, modifique la nueva fecha del evento.',
              showConfirmButton: true,
            
             })
             this.start = evento.start;
             this.end = evento.end;
          }
        } catch (error) {
          console.log(error);
        }
        //console.log('valor de inicio luego de actualizar');
        //console.log(this.start);
        //console.log('valor de término luego de actualizar');
        //console.log(this.end);
      },
      async editEvent(evento){
        if(evento.name == 'Semana de receso' || evento.name == 'Día feriado' || evento.name == 'Evento USACH'){
          this.currentlyEditing = evento.idevento

          this.start = evento.start
          this.end = evento.end

          this.start_respaldo = evento.start
          this.end_respaldo = evento.end

        }
        else{
          await Swal.fire({
              icon: 'info',
              text: 'Lo siento, esta evaluación no se puede editar debido a que le pertenece a un docente.',
              showConfirmButton: false,     
          })
        }
        



      },
      //PETICION PARA ELIMINAR UN EVENTO DEL CALENDARIO
      async deleteEvent(ev){
        if(ev.name == 'Semana de receso' || ev.name == 'Día feriado' || ev.name == 'Evento USACH'){  
          try {
              let ide = ev.idevento
              await axios
              .delete("/eliminarevento/" + ide)
              .then((result) => {
                console.log(result.data);
              }).catch(e => {
                    console.log(e);
              }); 
              this.selectedOpen = false;
              this.getEvents();
              
          } catch (error) {
            console.log(error);
          }
        }
        else{
          await Swal.fire({
              icon: 'info',
              text: 'Lo siento, esta evaluación no se puede eliminar debido a que le pertenece a un docente.',
              showConfirmButton: false,     
          })
        }  
      },

      // =============================AGREGAR EVENTO AL CALENDARIO =============================
      async addEvent(){
        try {
  
          if(this.name && this.start && this.end){
            //INGRESAR EVENTO: POST
            
            let payload = {
              nombre: this.name,
              hora_inicio: this.start,
              hora_termino: this.end,
              semana: 0,
              fecha: this.today,
              color: this.color,
              detalles: this.details,
              id_tipo_evaluacion: 1,
              id_calendario: 1,
              id_modalidad: 1,
              codigo_asignatura: 13201,
              id_admin: 1,
              id_profesor_dicta: 1          
            };

            //Peticion para agregar una evaluacion a la base de datos.
            await axios
            .post("/crearevaluacion", payload)
            .then((result) => {
              this.mensajeOk = result.data;
              console.log(this.mensajeOk);
            }).catch(e => {
                  console.log(e);
            }); 
            
            if(this.mensajeOk == "¡Evaluación añadida exitosamente!"){
              Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                title: 'Evento añadido exitosamente',
                text: 'Evento: '+this.name,
                showConfirmButton: false,
                timer: 1700
              })

            await this.getEvents();
            this.name = null;
            this.details = null;
            //this.start = null;
            //this.end = null;
            this.color = '#1976D2'; 
            }
            
            
          }
          else{
            await Swal.fire({
              icon: 'info',
              title: 'Por favor, completa todos los campos solicitados',
              showConfirmButton: true,
            
            })
            this.dialog = true;
            console.log('Campos obligatorios');
          }
        } catch (error) {
          console.log(error);
        }
      },
      async getEvents(){
        try {

          await this.ObtenerLocalStorage();
          const events = [];
          //Peticion para obtener todas las evaluaciones asociadas al profesor de la sesion actual
          await axios
            .get("/obtenereventos/"+ this.id_admin)
            .then((result) => {
              console.log('eventos traidos de forma correcta...')
              this.arreglo_eventos = result.data;
              console.log()
            }).catch(e => {
                  console.log(e);
            }); 
            //Bucle para eliminar la zona horaria que viene anidada a la fecha traida desde la base de datos
            for(let j=0; j<this.arreglo_eventos.length; j++){
              this.arreglo_eventos[j].start = this.arreglo_eventos[j].start.substring(0, 10);
              this.arreglo_eventos[j].end = this.arreglo_eventos[j].end.substring(0, 10);
            }
            console.log(this.arreglo_eventos);

       
            //Bucle para pasar por el arreglo de evaluaciones e ir pusheando cada evaluacion en el calendario
            for(let j=0;j<this.arreglo_eventos.length; j++){
              events.push(this.arreglo_eventos[j]);
            }
            this.events = events;
            this.mis_dias_bloqueados = events;
            
        } catch (error) {
          console.log(error);
        }
        
        //this.$refs.calendar.title();
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },

      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
  }
</script>

