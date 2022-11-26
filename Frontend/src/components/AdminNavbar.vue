<template>
    <header class="header">
        <div class="logo">
            <img src="@/assets/cropped-logo_diinf_usach.png" alt="Logo departamento ingenieria informatica usach">
        </div>
        <nav>
            <ul class="nav-links">
                <li><span title="Calendario"><a href="/admin-calendar"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                                height="16" fill="currentColor" class="bi bi-calendar-event-fill" viewBox="0 0 16 16">
                                <path
                                    d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                            </svg> Calendario</a></span></li>
                
                
                <li><a href="/admin-gestion">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-bell-fill icon" viewBox="0 0 16 16">
                            <path
                                d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                        </svg> Administrar semestre</a></li>
                

                <li><a href="/admin-profile"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-person-circle icon" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path fill-rule="evenodd"
                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                        </svg> Mi perfil</a></li>

                <li> <a href="/" class="btn" @click="limpiarLS()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="bi bi-door-open-fill" viewBox="0 0 16 16">
                            <path
                                d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                        </svg> Cerrar sesión</a></li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'AdminNavbar',

    methods: {
        async limpiarLS(){
            await localStorage.clear();
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400&family=Poppins:wght@300&family=Roboto+Condensed,wght@1,300&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.header {
    font-family: 'Roboto', sans-serif;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    --align-items: center;
    height: 120px;
    padding-right: 10%;
    padding-left: 10%;
    padding-top: 20px;
    border-block-end: solid #55616d;
}

.header .logo img {
    height: 90px;
    width: auto;
}



.header .nav-links li{
    display: inline-block;
    padding: 7px 20px;
}



.header .nav-links a{
    font-size: 700;
    color: #55616d;
    text-decoration: none;

}


.header .nav-links li:hover{
    transform: scale(1.2);
}
.header .nav-links li a:hover{
    color: #f28828;

}

.header svg {
    height: 40px;
    width: auto;
}




.header a {
    font-size: 700;
    color: #fff;
}
</style>>