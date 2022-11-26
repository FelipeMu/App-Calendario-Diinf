<template>
  <body>
  <div class="global-container">
    <div class="signup">
      <div class="left-box">
        <img src="@/assets/diinf_logo.jpg">
      </div>
      <div class="right-box">
          <h1>Inicio sesión docente</h1>
        <form action="/calendar">
          <label class="input-label" for="email-user">Correo electrónico</label>
          <input type="email" placeholder="Ingrese su correo" required class="input-box" id="email-user">
          <label class="input-label" for="password-user">Contraseña</label>
          <input type="password" placeholder="Ingrese su contraseña" required class="input-box" id="password-user">
          <button class="btn-signup" type="submit" @click.prevent="validacionTotal()">Ingresar</button>
        </form>
        <a class="link-backup" href="/admin-sign-on">Iniciar sesión como administrador</a>
      </div>
    </div>
  </div>
  <footer>
    <Footer/>
  </footer>
  </body> 
</template>
  

<script>
  import Footer from '@/components/Footer.vue';
  import Swal from 'sweetalert2/dist/sweetalert2.js';
  import axios from 'axios'
  
 
  export default {
    components: {
      Footer
    },

    data: () => ({ 

      id_profesor: null,
      nombre_profesor: "",


      datos_profesor: null,//json recibido por api rest
      activador: false,
      activador_pass: false
    }),

    methods: {

      guardarLocalStorage(){//guardando informacion entre las vistas; st:storage
        localStorage.setItem("id_st_profesor", this.id_profesor);
        localStorage.setItem("nombre_st_profesor", this.nombre_profesor);
        if(this.id_profesor !== undefined){
          this.activador=true;
        }
      },

      async Guardar(){
        await this.guardarLocalStorage();
      },

      AnalizarContrasena(){
        let contrasena_ingresada = document.getElementById('password-user').value
        if(contrasena_ingresada == this.datos_profesor.contrasena){
          this.activador_pass = true;
        }
      },

      async Contrasena(){
        await this.AnalizarContrasena();

      },

      async ExisteUsuario(){
        //obtener rut o dv(digito verificador) del usuario
        let correo_ingresado = document.getElementById("email-user").value; 
        // método get - axios
        await axios
        .get("/datosprofesor/" + correo_ingresado)
        .then((result) => {
          this.result = result.data;
          this.datos_profesor = this.result;
          this.id_profesor = this.datos_profesor.id;
          this.nombre_profesor = this.datos_profesor.nombre;
        }).catch(e => {
              console.log(e);
              
        }); 
      },

      async validacionTotal(){
        if(this.$options.methods.validarCorreo.bind(this)() && this.$options.methods.validarContrasena.bind(this)()){

          //revisar si el usuario existe en la base de datos
          await this.ExisteUsuario();
          //se guarda el rut del usuario en el local storage (asi se puede mantener su sesión)
          await this.Guardar();
          //verificar contraseña
          await this.Contrasena();

          //verificación variable: activador
          //si activador es true -> el usuario pertenece a la base de datos,
          //caso contrario, es una persona no registrada en la plataforma.
          //CASO credenciales correctas
          if(this.activador && this.activador_pass){
            await Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Bienvenido(a) nuevamente!',
              text: this.datos_profesor.nombre,
              showConfirmButton: false,
              timer: 1500
            })
            window.location.href = "/calendar";
            return true;
          }
          else{
            //CASO correo correcto, pero contraseña incorrecta
            if(this.activador && this.activador_pass==false){
              Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'La contraseña no coincide con el correo electrónico ingresado'
              })
              this.activador = false;
              return false; 
            }
            //caso correo electrónico incorrecto y por lo tanto contraseña incorrecta.
            //Esto implica que el usuario no pertence a la plataforma.
            else{
              Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'El usuario ingresado no se encuetra registrado en la plataforma. Por favor verifica que tus credenciales ingresadas sean las correctas.',
              }) 
              return false;
            }
          }    
        }
        else if (this.$options.methods.validarCorreo.bind(this)() == false && this.$options.methods.validarContrasena.bind(this)() == true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, ingresa tu correo instituacional con extensión @usach',
          }) 
          return false;
        }
        else if (this.$options.methods.validarCorreo.bind(this)() == true && this.$options.methods.validarContrasena.bind(this)() == false){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '(!) Las contraseñas no deben tener carácteres especiales. Ingresa una contraseña válida',
          })
          return false; 
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Los campos: Correo y Contraseña no son válidos. Por favor, ingresa tu correo institucional y una contraseña sin caracteres especiales.',
            
          })
          return false;
        }
      },

      /*
      Entrada: -
      Salida: boolean
      Descripcion: Verificar si el correo es perteneciente a la institucion
      */
      validarCorreo(){   
        var emailField = document.getElementById('email-user');     
        // Expresion regular para validar el correo electronico institucional
        var validEmail =  /(^[a-zA-Z]+)([.])([a-zA-Z]+)([.][a-zA-Z])?@usach([.])cl/g;

        // Using test we can check if the text match the pattern
        if( validEmail.test(emailField.value) ){
          return true;
        }
        else{
          return false;
        }     
      },
      
      validarContrasena(){
        var passField = document.getElementById('password-user');     
        // Expresion regular para validar el correo electronico institucional
        var validPass =  /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,20}$/g;

        // Using test we can check if the text match the pattern
        if( validPass.test(passField.value) ){
          return true;
        }
        else{
          return false;
        }     
      }
    } 
  }    
</script>


<style>
 
  html,body { 
  font-family: 'Roboto', sans-serif;
	height: 100%; 
  width: 100%;
  background-image: url("@/assets/278014715_367270155411736_5039396390364308811_n.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}

.global-container{
  width: 100%;
  min-height: 100vh;
  margin:auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.global-container h1{
  color: black; 
  font-weight: 500;
  font-size:160%;
  margin-bottom: 40px;
  
}

.signup{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
}

.right-box{
  padding: 8px;
  --background: red;
  flex-basis: 50%;
  flex-grow: 1;
  color: #fff;
  background-color: rgba(255,255,255,0.7);
  text-align: center;
}

.left-box{
  --padding: 50px;
  flex-basis: 50%;
  flex-grow: 1;
  --background-image: url("@/assets/diinf_logo.jpg");
  --background-repeat: no-repeat;
  --background-attachment: fixed;
  --background-position: center;
  --background-size: cover;
  --background: red;

}
.input-box{
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid black;
  outline: black;
  background: #fff;
}
::placeholder{
  color: black;
}
.input-label{
  float: left;
  color: black;
}

.btn-signup{
  float: right;
  display: block;
}
.link-backup{
  font-style: italic;
  text-align: center;
  width: 100%;
}

.right-box button{
  color: #000;
  width: 100%;
  background: #fff;
  padding: 10px;
  border: 0;
  outline: none;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background 0.2s;
  justify-content: center;
}

.right-box button:hover{
  font-weight: 500;
  background: #000;
  color: #fff;
}
</style>