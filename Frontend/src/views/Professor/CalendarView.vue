<template>
  <body>
    <Navbar />
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn color="primary" dark class="mr-4" @click="dialog = true">
              Ingresar evaluación
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
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
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
                      <!--CURSO-->
                      <v-select
                            :items=this.cursos_actuales
                            label="Curso*"
                            required
                            type="string"
                            v-model="name"
                      ></v-select>
                    </v-col>


                    <v-col cols="4">
                      <!--TIPO DE EVALUACIÓN-->
                      <v-select
                            :items=this.tipo_evaluaciones
                            label="Tipo de evaluación*"
                            required
                            type="string"
                            v-model="tipo_evaluacion"
                      ></v-select>
                    </v-col>

                    <v-col cols="4">
                      <!--MODALIDAD-->
                      <v-select
                        :items="['Diurno', 'Vespertino', 'Mixto']"
                        label="Modalidad*"
                        required
                        type="string"
                        v-model="modalidad"
                      ></v-select>
                    </v-col>
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
                        type="date" label="Termino evaluación" v-model="end">
                      </v-text-field>
                    </v-col>
                    
                    <v-col cols="4">
                      <!--COLOR-->
                      <v-text-field 
                        type="color" label="Color del evento" v-model="color">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <!--DETALLLES-->
                  <v-text-field 
                    type="text" label="Agregar un detalle" v-model="details">
                  </v-text-field>
                  
                  <v-btn type="submit" color="primary" class="mr-4" 
                  @click.stop="dialog = false">Añadir evaluación al calendario</v-btn>
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
                  Tipo de evaluación: {{selectedEvent.tipo_evaluacion}}<br />
                  Modalidad: {{selectedEvent.modalidad}}<br />
                  Detalles: {{selectedEvent.details}}
                </v-form>

                <v-form v-else>
                  <!--esto es lo que se puede editar-->
                  <textarea-autosize
                    v-model="selectedEvent.details"
                    type="text"
                    style="width: 100%"
                    :min-height="100"
                  ></textarea-autosize>

                  <v-text-field 
                        type="date" label="Nuevo inicio evaluación" v-model="start">
                  </v-text-field>

                  <v-text-field 
                        type="date" label="Nuevo fin evaluación" v-model="end">
                  </v-text-field>


                </v-form>

              </v-card-text>

              
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false; currentlyEditing = null"
                >
                  Cancelar
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
  import Navbar from "@/components/Navbar.vue"
  import Swal from 'sweetalert2/dist/sweetalert2.js';
  import axios from 'axios'

  export default {
    components:{
      Navbar
    },


    data: () => ({
      today: new Date().toISOString().substring(0,10),
      focus: new Date().toISOString().substring(0,10),
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      start: null,
      end: null,
      start_respaldo: null,
      end_respaldo: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      name: null,
      codigo: 0, //codigo del curso seleccionado al momento de ingresar una evaluacion
      nivel: 0, //nivel del curso seleccionado al momento de ingresar una evaluacion

      tipo_evaluacion: null,
      modalidades: ['Diurno', 'Vespertino', 'Mixto'],
      modalidad: null,
      id_modalidad: null,

      details: null,
      color: '#1976D2',
      semana: 0,
      dialog: false,
      currentlyEditing: null,

      jsoncursos: [], //recibe json de objetos de cursos (el objeto tiene solo el atributo nombre)
      cursos_actuales: [], //se guardan solo los nombres de los cursos (ej: [alg.avanzados, diseño base de datos, ..., x])

      jsonevaluaciones: [], //recibe json de objetos de evaluaciones (el objeto tiene el tipo de evaluación)
      tipo_evaluaciones: [], //se guardan solo los nombres de los tipos de evaluación (ej: [PEP, Control, Informe ..., x])
      id_tipo_evaluacion: 0, //id del tipo de evaluacion
      json_curso_seleccionado: {},

      id_profesor: 0, //se guardan el valor del id que viene de localstorage
      nombre_profesor: '',//se guardan el valor del nombre que viene de localstorage

      arreglo_evaluaciones: [],
      mensajeOk: '',
      codigo_rescatado: '',
      seccion_rescatada: '',
      eventos_admin: [],
      eventos_profesores: [],
      eventos_niveles: [],
      ok200: '',

      eventos_dia_actual: [],
      eventos_dia_anterior: [],
      eventos_dia_siguiente: []
    }),
    
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

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
      }
    },

    // ************************************ MOUNTED ************************************
    async mounted () {
      //se obtiene el valor del id-usuario que se encuentra navegando
      await this.ObtenerLocalStorage();
      this.start = null;
      this.end = null;
      // primera petición GET:
      //para ver el listado de cursos al momento de ingresar una evaluación
      await axios
      .get("/miscursos/" + this.id_profesor)
      .then((result) => {
        this.jsoncursos = result.data;
        //se guardan los nombres de los cursos en el arreglo "cursos_actuales"
        let cn = '';
        for (let i=0; i < this.jsoncursos.length; i++) {
          cn = this.jsoncursos[i].nombre+' (sección: '+this.jsoncursos[i].seccion+')';
          this.cursos_actuales[i] = '['+this.jsoncursos[i].codigo_asignatura+'] '+cn;
        }
      }).catch(e => {
            console.log(e);
      }); 

      //segunda petición GET:
      await axios
      .get("/tiposevaluaciones/")
      .then((result) => {
        this.jsonevaluaciones = result.data;
        //se guardan los nombres de los cursos en el arreglo "cursos_actuales"
        for (let i=0; i < this.jsonevaluaciones.length; i++) {
          this.tipo_evaluaciones[i] = this.jsonevaluaciones[i].tipo;
        }
      }).catch(e => {
            console.log(e);
      }); 

      this.$refs.calendar.checkChange();
    },

    async created(){
      console.log(this.start);
      console.log(this.end);
      this.events = [];
      await this.getEvents();
    },

    methods: {

     
      ObtenerLocalStorage(){
        //obteniendo id y nombre del profesor
        this.id_profesor = localStorage.getItem("id_st_profesor")
        this.nombre_profesor = localStorage.getItem("nombre_st_profesor")

      },

      async updateEvent(evento){
        try {
          if(this.start && this.end){

            // para no revisar la misma evaluacion, se hace uso del id del evento
            // y se revisan todas las evaluaciones menos la que contiene dicho id
            let id_del_evento = evento.idevento;
            let inicio = this.start;
            let fin = this.end;
            let bandera = 0; 
            let bandera_diasbloq = 0;
            let bandera_diff1 = 0;
            let bandera_diff1_diabloq = 0;
            let bandera_diasig = 0;
            let bandera_diaant = 0;
        
            // comparando fechas
            console.log(inicio);
            let fecha_iv = new Date(inicio);
            let fecha_fv = new Date(fin);
            for(let i = 0; i<this.events.length; i++){
              if(id_del_evento != this.events[i].idevento){
                if( (inicio < this.events[i].start && fin > this.events[i].end) || (inicio >= this.events[i].start && fin <= this.events[i].end) || (inicio < this.events[i].start && (fin >= this.events[i].start && fin <= this.events[i].end)) || ((inicio >= this.events[i].start && inicio <= this.events[i].end) && fin > this.events[i].end)  ){
                  if(this.events[i].name == 'Día feriado' || this.events[i].name == 'Semana de receso' || this.events[i].name == 'Evento USACH'){
                    bandera_diasbloq = 5;//se activa bandera que representa que hay una evento en el mismo día
                  }
                  else{
                    bandera = 5; //se activa bandera que representa que hay una evaluación
                    
                    //Se analiza si el evento es del propio profesor, en tal caso, se elimina la medalla
                    //que se encuentra delante del nombre de la evaluacion
                    let primeraletra = this.events[i].name.charAt(0);
                    console.log(primeraletra);

                    if(primeraletra == '✪'){
                      this.events[i].name = this.events[i].name.slice(1)
                      this.eventos_dia_actual.push(this.events[i]);
                    }
                    else{
                      //agrego el evento que se encuentra en el mismo dia
                      this.eventos_dia_actual.push(this.events[i]);
                    }    
                  }   
                }
                let temp = new Date(this.events[i].start);
                //dia anterior
                if( (((fecha_iv - temp)/(1000*60*60*24)) == 1)){
                  if(this.events[i].name == 'Día feriado' || this.events[i].name == 'Semana de receso' || this.events[i].name == 'Evento USACH'){
                    bandera_diff1_diabloq = 5;//se activa bandera que representa que hay una evento en el mismo día
                  }
                  else{
                    bandera_diff1 = 5;
                    bandera_diaant = 5;
                    //proceso de eliminar la medalla
                    let primeraletra = this.events[i].name.charAt(0);

                    if(primeraletra == '✪'){
                      this.events[i].name = this.events[i].name.slice(1)
                      this.eventos_dia_anterior.push(this.events[i]);
                    }
                    else{
                      //agrego el evento que se encuentra en el mismo dia
                      this.eventos_dia_anterior.push(this.events[i]);
                    }                
                  }
                }

                //dia siguiente
                if((((fecha_iv - temp)/(1000*60*60*24)) == -1)){
                  if(this.events[i].name == 'Día feriado' || this.events[i].name == 'Semana de receso' || this.events[i].name == 'Evento USACH'){
                    bandera_diff1_diabloq = 5;//se activa bandera que representa que hay una evento en el mismo día
                  }
                  else{
                    bandera_diff1 = 5;
                    bandera_diasig = 5;
                    //proceso de eliminar la medalla
                    let primeraletra = this.events[i].name.charAt(0);

                    if(primeraletra == '✪'){
                      this.events[i].name = this.events[i].name.slice(1)
                      this.eventos_dia_siguiente.push(this.events[i]);
                    }
                    else{
                      //agrego el evento que se encuentra en el mismo dia
                      this.eventos_dia_siguiente.push(this.events[i]);
                    }      
                  }
                }
              }  
            }
            if(bandera_diasbloq == 0){
              //fecha cumple con la restricciones de los dias bloqueados
              let payload = {
                id_programar: evento.idevento,
                detalles: evento.details,
                start: inicio,
                end: fin
              }
              console.log(evento);
              //Petición actualizar detalles del evento (evaluación o bloqueo de días)
              await axios
              .put("/actualizarevento", payload)
              .then((result) => {
                this.ok200 = result.data;
              }).catch(e => {
                    console.log(e);
              }); 

              if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 5 && bandera_diff1 == 0){
                //concatenando eventos
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                } 
                Swal.fire({
                  icon: 'success',
                  title: this.ok200,
                  text: 'Asignatura: '+evento.name+'. (!) CUIDADO, has actualizado la fecha de tu evaluación en una fecha que ya contaba con una. 👉' + cadena_eventos_actuales,
                  showConfirmButton: false,
                })
              }
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 0 && bandera_diff1 == 0){   
                Swal.fire({
                  icon: 'success',
                  title: this.ok200,
                  text: 'Asignatura: '+evento.name,
                  showConfirmButton: false,
                })
              }
              //evaluaciones en el dia siguiente
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 0 && bandera_diff1 == 5 && bandera_diasig == 5 && bandera_diaant == 0){
                
                //concatenando eventos
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 

                Swal.fire({
                    icon: 'success',
                    title: this.ok200,
                    text: 'Asignatura: '+evento.name+'\n'+'(!) CUIDADO, la nueva fecha de tu evaluación tiene evaluaciones en el día siguiente. 👉' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                })
              }
              //evaluaciones en el dia anterior
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 0 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 0){
                
                //concatenando eventos
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 

                Swal.fire({
                    icon: 'success',
                    title: this.ok200,
                    text: 'Asignatura: '+evento.name+'\n'+'(!) CUIDADO, la nueva fecha de tu evaluación tiene evaluaciones en el día anterior. 👉' + cadena_eventos_anteriores,
                    showConfirmButton: false,
                })
              }

              //mismo dia y dia siguiente
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 5 && bandera_diff1 == 5 && bandera_diasig == 5 && bandera_diaant == 0){
                
                //concatenando eventos actuales
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                }
                //concatenando eventos siguientes
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 
                Swal.fire({
                    icon: 'success',
                    title: this.ok200,
                    text: 'Asignatura: '+evento.name+'\n'+'(!) CUIDADO, la nueva fecha en que fue puesta tu evaluación tiene evaluaciones en el mismo día y en el día siguiente. 👉 MISMO DÍA: ' + cadena_eventos_actuales + ' 👉 DÍA SIGUIENTE: ' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                  })
              }

              //mismo dia y dia anterior
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 5 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 0){

                //concatenando eventos actuales
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                }
                //concatenando eventos anteriores
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 
                Swal.fire({
                    icon: 'success',
                    title: this.ok200,
                    text: 'Asignatura: '+evento.name+'\n'+'(!) CUIDADO, la nueva fecha en que fue puesta tu evaluación tiene evaluaciones en el mismo día y en el día anterior. 👉 MISMO DÍA: ' + cadena_eventos_actuales + ' 👉 DÍA ANTERIOR: ' + cadena_eventos_anteriores,
                    showConfirmButton: false,
                  })
              }

              //mismo dia + dia siguiente y anterior
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 5 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 5){
                
                //concatenando eventos actuales
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                }
                //concatenando eventos anteriores
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 
                 //concatenando eventos siguientes
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 
                
                Swal.fire({
                    icon: 'success',
                    title: this.ok200,
                    text: 'Asignatura: '+evento.name+'\n'+'(!) CUIDADO, la nueva fecha en que fue puesta tu evaluación tiene evaluaciones en el mismo día y en el día siguiente y en el día anterior. 👉 MISMO DÍA: ' + cadena_eventos_actuales + ' 👉 DÍA ANTERIOR: ' + cadena_eventos_anteriores + ' 👉 DÍA SIGUIENTE: ' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                  })
              }



              //en el dia siguiente y anterior
              else if(this.ok200 == "¡Evento actualizado exitosamente!" && bandera == 0 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 5){
                
                //concatenando eventos anteriores
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 
                 //concatenando eventos siguientes
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 
                
                Swal.fire({
                    icon: 'success',
                    title: this.ok200,
                    text: 'Asignatura: '+evento.name+'\n'+'(!) CUIDADO, la nueva fecha en que fue puesta tu evaluación tiene evaluaciones en el día siguiente y día anterior. 👉' + 'DÍA ANTERIOR: ' + cadena_eventos_anteriores + ' 👉 DÍA SIGUIENTE: ' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                  })
              }


              this.events = [];
              await this.getEvents(); 
              this.selectedOpen = false;
              this.currentlyEditing = null;
              this.start = null;
              this.end = null;  
              this.name = null;
              this.details = null;
              this.color = '#1976D2';
            }
            else{
              await Swal.fire({
                icon: 'info',
                title: 'Ops... La nueva fecha ingresada topa con algún evento en el cual no se realizan evaluaciones',
                text: 'Por favor, modifique la nueva fecha de su evaluación.',
                showConfirmButton: true,
              
              })
              this.start = evento.start;
              this.end = evento.end;
            }
          }
          else{
            await Swal.fire({
                icon: 'info',
                title: 'Ops... La nueva fecha ingresada no es válida',
                text: 'Por favor, modifique la nueva fecha de su evaluación.',
                showConfirmButton: true,
              
            })
            this.start = evento.start;
            this.end = evento.end;
          } 
        //se vacia la lista de eventos actuales, anteriores y siguientes
        this.eventos_dia_actual = [];
        this.eventos_dia_siguiente = [];
        this.eventos_dia_anterior = [];
        } catch (error) {
          console.log(error);
        }
      },
      
      async editEvent(evento){
        
        if(Object.keys(evento).length == 10 && evento.id_profesor == this.id_profesor){
          this.currentlyEditing = evento.idevento

          //fecha actual de la evaluación
          this.start = evento.start
          this.end = evento.end

          this.start_respaldo = evento.start
          this.end_respaldo = evento.end

        }
        else{
          await Swal.fire({
              icon: 'info',
              text: 'Lo siento, esta evaluación o evento no se puede modificar.',
              showConfirmButton: false,
            
             })
        }
        this.$refs.calendar.checkChange();
        
      },
      //PETICION PARA ELIMINAR UN EVENTO DEL CALENDARIO
      async deleteEvent(ev){
        if(Object.keys(ev).length == 10 && ev.id_profesor == this.id_profesor){
          try {
            let ide = ev.idevento
            await axios
            .delete("/eliminarevento/" + ide)
            .then((result) => {
              console.log(result.data);
            }).catch(e => {
                  console.log(e);
            }); 
            //await db.collection('eventos').doc(ev.id).delete();
            this.selectedOpen = false;
            this.events = [];
            await this.getEvents();
            
          } catch (error) {
            console.log(error);
          }
        }
        else{
          await Swal.fire({
              icon: 'info',
              text: 'Lo siento, esta evaluación o evento no se puede eliminar.',
              showConfirmButton: false,     
             })
        }
      },
      async addEvent(){
        try {  
          if(this.name && this.start && this.end && this.tipo_evaluacion && this.modalidad){
            //this.events = [];
            // Verificacion de no añadir una evaluacion sobre dias bloqueados
            //await this.getEvents();
            //let acceso_denegado =  0; // 0: fecha válida /// 5: fecha inválida
            let inicio = this.start;
            let fin = this.end;
            let bandera = 0; 
            let bandera_diasbloq = 0;
            let bandera_diff1 = 0;
            let bandera_diff1_diabloq = 0;
            let bandera_diasig = 0;
            let bandera_diaant = 0;
            // comparando fechas
            let fecha_iv = new Date(inicio);
            let fecha_fv = new Date(fin);
            for(let i = 0; i<this.events.length; i++){
              if( (inicio < this.events[i].start && fin > this.events[i].end) || (inicio >= this.events[i].start && fin <= this.events[i].end) || (inicio < this.events[i].start && (fin >= this.events[i].start && fin <= this.events[i].end)) || ((inicio >= this.events[i].start && inicio <= this.events[i].end) && fin > this.events[i].end)  ){
                if(this.events[i].name == 'Día feriado' || this.events[i].name == 'Semana de receso' || this.events[i].name == 'Evento USACH'){
                  bandera_diasbloq = 5;//se activa bandera que representa que hay una evento en el mismo día
                }
                else{
                  bandera = 5; //se activa bandera que representa que hay una evaluación

                  //Se analiza si el evento es del propio profesor, en tal caso, se elimina la medalla
                  //que se encuentra delante del nombre de la evaluacion
                  let primeraletra = this.events[i].name.charAt(0);
                  console.log(primeraletra);

                  if(primeraletra == '✪'){
                    this.events[i].name = this.events[i].name.slice(1)
                    this.eventos_dia_actual.push(this.events[i]);
                  }
                  else{
                    //agrego el evento que se encuentra en el mismo dia
                    this.eventos_dia_actual.push(this.events[i]);
                  }
                }
                   
              }
              let temp = new Date(this.events[i].start);
              //dia anterior
              if( (((fecha_iv - temp)/(1000*60*60*24)) == 1)){
                if(this.events[i].name == 'Día feriado' || this.events[i].name == 'Semana de receso' || this.events[i].name == 'Evento USACH'){
                  bandera_diff1_diabloq = 5;//se activa bandera que representa que hay una evento en el mismo día
                }
                else{
                  bandera_diff1 = 5;
                  bandera_diaant = 5;
                  //proceso de eliminar la medalla
                  let primeraletra = this.events[i].name.charAt(0);

                  if(primeraletra == '✪'){
                    this.events[i].name = this.events[i].name.slice(1)
                    this.eventos_dia_anterior.push(this.events[i]);
                  }
                  else{
                    //agrego el evento que se encuentra en el mismo dia
                    this.eventos_dia_anterior.push(this.events[i]);
                  }                
                }
              }

              //dia siguiente
              if((((fecha_iv - temp)/(1000*60*60*24)) == -1)){
                if(this.events[i].name == 'Día feriado' || this.events[i].name == 'Semana de receso' || this.events[i].name == 'Evento USACH'){
                  bandera_diff1_diabloq = 5;//se activa bandera que representa que hay una evento en el mismo día
                }
                else{
                  bandera_diff1 = 5;
                  bandera_diasig = 5;
                  //proceso de eliminar la medalla
                  let primeraletra = this.events[i].name.charAt(0);

                  if(primeraletra == '✪'){
                    this.events[i].name = this.events[i].name.slice(1)
                    this.eventos_dia_siguiente.push(this.events[i]);
                  }
                  else{
                    //agrego el evento que se encuentra en el mismo dia
                    this.eventos_dia_siguiente.push(this.events[i]);
                  }      
                }
              }
            }
            //fecha valida en el calendario
            if(bandera_diasbloq == 0){

              //INGRESAR EVALUACION: POST
              
              //buscando el id del tipo de evaluacion:
              for(let j = 0; j < this.tipo_evaluaciones.length; j++){
                if(this.tipo_evaluacion == this.tipo_evaluaciones[j]){
                  this.id_tipo_evaluacion = j + 1; 
                }
              }

              //buscando el id de la modalidad:
              for(let j = 0; j < this.modalidades.length; j++){
                if(this.modalidad == this.modalidades[j]){
                  this.id_modalidad = j + 1;
                }
              }
      
              let parte_codigo = this.name.split(']');
              let parte_codigo1 = parte_codigo[0];
              let parte_nombre1 = parte_codigo[1];
              //codigo de la asignatura elegida
              this.codigo_rescatado = parte_codigo1.substring(1);

              //se elimina el espacio al inicio del nombre
              parte_nombre1 = parte_nombre1.substring(1);
              parte_nombre1 = parte_nombre1.split(' (');
              this.name = parte_nombre1[0];

              let parte_seccion = parte_nombre1[1];
              parte_seccion = parte_seccion.split(')');
              parte_seccion = parte_seccion[0];
              parte_seccion = parte_seccion.split(' ');
              this.seccion_rescatada = parte_seccion[1];
              

              let id_del_profesor_que_dicta = 0;
              //buscando el id de la tabla profesor_dicta
              for(let j = 0; j<this.jsoncursos.length; j++){
                if(this.jsoncursos[j].nombre == this.name && this.jsoncursos[j].seccion == this.seccion_rescatada && this.jsoncursos[j].codigo_asignatura == this.codigo_rescatado){
                  id_del_profesor_que_dicta = this.jsoncursos[j].id;
                }
              }

              let payload = {
                nombre: this.name,
                hora_inicio: this.start,
                hora_termino: this.end,
                semana: this.semana,
                fecha: this.today,
                color: this.color,
                detalles: this.details,
                id_tipo_evaluacion: this.id_tipo_evaluacion,
                id_calendario: 1,
                id_modalidad: this.id_modalidad,
                codigo_asignatura: this.codigo_rescatado,
                id_admin: 2,
                id_profesor_dicta: id_del_profesor_que_dicta        
              };

              //Peticion para agregar una evaluacion a la base de datos.
              await axios
              .post("/crearevaluacion", payload)
              .then((result) => {
                this.mensajeOk = result.data;
                console.log('¡Evaluación añadida exitosamente!');
              }).catch(e => {
                    console.log(e);
              }); 
              
              

              if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 5 && bandera_diff1 == 0){
                //concatenando eventos
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                } 
                Swal.fire({
                  icon: 'success',
                  title: this.mensajeOk,
                  text: 'Asignatura: '+this.name+'. (!) CUIDADO, has ingresado una evaluación en una fecha que ya contaba con una o más. 👉' + cadena_eventos_actuales,
                  showConfirmButton: false,
                })
              }
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 0 && bandera_diff1 == 0){   
                Swal.fire({
                  icon: 'success',
                  title: this.mensajeOk,
                  text: 'Asignatura: '+this.name,
                  showConfirmButton: false,
                })
              }
              //evaluaciones en el dia siguiente
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 0 && bandera_diff1 == 5 && bandera_diasig == 5 && bandera_diaant == 0){
                
                //concatenando eventos
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 

                Swal.fire({
                    icon: 'success',
                    title: this.mensajeOk,
                    text: 'Asignatura: '+this.name+'\n'+'(!) CUIDADO, tu nueva evaluación tiene otra evaluación al día siguiente. 👉' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                })
              }
              //evaluaciones en el dia anterior
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 0 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 0){
                
                //concatenando eventos
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 

                Swal.fire({
                    icon: 'success',
                    title: this.mensajeOk,
                    text: 'Asignatura: '+this.name+'\n'+'(!) CUIDADO, tu evaluación fue colocada al día siguiente de otra evaluación. 👉' + cadena_eventos_anteriores,
                    showConfirmButton: false,
                })
              }

              //mismo dia y dia siguiente
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 5 && bandera_diff1 == 5 && bandera_diasig == 5 && bandera_diaant == 0){
                
                //concatenando eventos actuales
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                }
                //concatenando eventos siguientes
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 
                Swal.fire({
                    icon: 'success',
                    title: this.mensajeOk,
                    text: 'Asignatura: '+this.name+'\n'+'(!) CUIDADO, el día en que fue colocada tu evaluación ya contenía evaluaciones, además al día siguiente también existen evaluaciones. 👉 MISMO DÍA: ' + cadena_eventos_actuales + ' 👉 DÍA SIGUIENTE: ' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                  })
              }

              //mismo dia y dia anterior
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 5 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 0){

                //concatenando eventos actuales
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                }
                //concatenando eventos anteriores
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 
                Swal.fire({
                    icon: 'success',
                    title: this.mensajeOk,
                    text: 'Asignatura: '+this.name+'\n'+'(!) CUIDADO, el día en que fue colocada tu evaluación ya contenía evaluaciones, además en el día anterior también existen evaluaciones. 👉 MISMO DÍA: ' + cadena_eventos_actuales + ' 👉 DÍA ANTERIOR: ' + cadena_eventos_anteriores,
                    showConfirmButton: false,
                  })
              }

              //mismo dia + dia siguiente y anterior
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 5 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 5){
                
                //concatenando eventos actuales
                let cadena_eventos_actuales = '';
                for(let i=0; i<this.eventos_dia_actual.length; i++){
                  
                  if(i == this.eventos_dia_actual.length - 1){
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_actuales = cadena_eventos_actuales + this.eventos_dia_actual[i].name + ': ' + 'nivel ' + this.eventos_dia_actual[i].nivel + ', '
                  }
                }
                //concatenando eventos anteriores
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 
                 //concatenando eventos siguientes
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 
                
                Swal.fire({
                    icon: 'success',
                    title: this.mensajeOk,
                    text: 'Asignatura: '+this.name+'\n'+'(!) CUIDADO, el día en que fue colocada tu evaluación ya contenía evaluaciones, además existen otras evaluaciones en el día anterior y siguiente. 👉 MISMO DÍA: ' + cadena_eventos_actuales + ' 👉 DÍA ANTERIOR: ' + cadena_eventos_anteriores + ' 👉 DÍA SIGUIENTE: ' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                  })
              }



              //en el dia siguiente y anterior
              else if(this.mensajeOk == "¡Evaluación añadida exitosamente!" && bandera == 0 && bandera_diff1 == 5 && bandera_diaant == 5 && bandera_diasig == 5){
                
                //concatenando eventos anteriores
                let cadena_eventos_anteriores = '';
                for(let i=0; i<this.eventos_dia_anterior.length; i++){
                  
                  if(i == this.eventos_dia_anterior.length - 1){
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_anteriores = cadena_eventos_anteriores + this.eventos_dia_anterior[i].name + ': ' + 'nivel ' + this.eventos_dia_anterior[i].nivel + ', '
                  }
                } 
                 //concatenando eventos siguientes
                let cadena_eventos_siguientes = '';
                for(let i=0; i<this.eventos_dia_siguiente.length; i++){
                  
                  if(i == this.eventos_dia_siguiente.length - 1){
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + '.'
                  }
                  else{
                    cadena_eventos_siguientes = cadena_eventos_siguientes + this.eventos_dia_siguiente[i].name + ': ' + 'nivel ' + this.eventos_dia_siguiente[i].nivel + ', '
                  }
                } 
                
                Swal.fire({
                    icon: 'success',
                    title: this.mensajeOk,
                    text: 'Asignatura: '+this.name+'\n'+'(!) CUIDADO, el día en que fue colocada tu evaluación tiene otras evaluaciones en el día anterior y al siguiente. 👉' + 'DÍA ANTERIOR: ' + cadena_eventos_anteriores + ' 👉 DÍA SIGUIENTE: ' + cadena_eventos_siguientes,
                    showConfirmButton: false,
                  })
              }


              this.events = [];
              await this.getEvents();
              //vaciando campos de combo-box: Ingresar evaluación
              this.name = null,
              this.modalidad = null;
              this.tipo_evaluacion = null;
              this.start = null;
              this.end = null;
              this.details = null;
              this.color = '#1976D2';

            }
            //fecha no permitida para ingresar en el calendario
            else{
              await Swal.fire({
              icon: 'info',
              size:1,
              title: 'Ops... La fecha ingresada topa con algún evento en el cual no se realizan evaluaciones',
              text: 'Por favor, modifique nuevamente la fecha de su evaluación.',
              showConfirmButton: true,
            
              })
              this.dialog = true;
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
          this.eventos_dia_actual = [];
          this.eventos_dia_anterior = [];
          this.eventos_dia_siguiente = [];
        } catch (error) {
          console.log(error);
        }
      },
      async getEvents(){
        try {

          await this.ObtenerLocalStorage();
          
          let events = [];
          events.length = 0;
          this.events.length = 0;
          this.arreglo_evaluaciones.length = 0;
          this.arreglo_evaluaciones = [];
          //Peticion para obtener los eventos del administrador:
          await axios
            .get("/eventosdeladmin")
            .then((result) => {
              console.log('se traen los eventos del admin...')
              this.eventos_admin = result.data;
              console.log('eventos del admin');
              console.log(this.eventos_admin);
            }).catch(e => {
                  console.log(e);
            }); 
            this.arreglo_evaluaciones = this.arreglo_evaluaciones.concat(this.eventos_admin);
            //Petición para obtener las evaluaciones del profesor actual
            await axios
            .get("/eventosdelprofesor/" + this.id_profesor)
            .then((result) => {
              console.log('se traen los eventos de los profesores...')
              this.eventos_profesores = result.data;
              console.log('eventos del profesor');
              console.log(this.eventos_profesores);
            }).catch(e => {
                  console.log(e);
            }); 

 
            //Petición para obtener las evaluaciones de nivels +1 y -1
            await axios
            .get("/eventosdelprofesorniveles/" + this.id_profesor)
            .then((result) => {
              console.log('se traen los eventos de otros niveles...')
              this.eventos_niveles = result.data;
              console.log('eventos de niveles');
              console.log(this.eventos_niveles);
            }).catch(e => {
                  console.log(e);
            }); 

            //Se concatena nuevamente:
            this.arreglo_evaluaciones = this.arreglo_evaluaciones.concat(this.eventos_niveles);
            
            //Bucle para eliminar la zona horaria que viene anidada a la fecha traida desde la base de datos
            for(let j=0; j<this.arreglo_evaluaciones.length; j++){
              this.arreglo_evaluaciones[j].start = this.arreglo_evaluaciones[j].start.substring(0, 10);
              this.arreglo_evaluaciones[j].end = this.arreglo_evaluaciones[j].end.substring(0, 10);
  
            }
            
            for(let i= 0; i<this.eventos_profesores.length; i++){
              this.eventos_profesores[i].start = this.eventos_profesores[i].start.substring(0, 10);
              this.eventos_profesores[i].end = this.eventos_profesores[i].end.substring(0, 10);
              if(this.eventos_profesores[i].name.charAt(0) != '✪'){
                this.eventos_profesores[i].name = '✪' + this.eventos_profesores[i].name
                }
            }
            this.arreglo_evaluaciones = this.arreglo_evaluaciones.concat(this.eventos_profesores);

           
            //Bucle para pasar por el arreglo de evaluaciones e ir pusheando cada evaluacion en el calendario
            for(let j=0;j<this.arreglo_evaluaciones.length; j++){
              events.push(this.arreglo_evaluaciones[j]);
            }
            this.events = events;
  
        } catch (error) {
          console.log(error);
        }
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

