<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>


        <q-toolbar-title>
          Jesus Sotillo
        </q-toolbar-title>

        <div>INDIMIN</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="q-pa-md">


        <div class="q-pa-md" style="max-width: 400px; top:30%;position: absolute;left: 35%;">
          <q-card class="my-card">
            <q-card-section>
              <q-form @submit="Validar" ref="myForm"
                      @reset="onReset"
                      class="q-gutter-md">
                <div class="row">
                  <div class="col-12">
                    <div class="text-h5 q-pa-sm">
                      Iniciar Session
                    </div>
                  </div>

                  <div class=" col-12 q-pt-md">
                    <q-input v-model="Correo" filled type="email" label="Correo" />
                  </div>
                  <div class="col-12 q-pt-md">
                    <q-input v-model="Clave" filled type="password" label="Clave" />
                  </div>

                  <div class=" col-12  self-center q-pt-md">
                    <div>
                      <q-btn label="Iniciar" type="submit" color="primary" />
                      <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                  </div>
                  <div class=" col-12  self-center q-pt-md">
                    <div style="text-align:center">
                      <q-btn flat label="¿Olvidaste tu contraseña?" color="primary" />
                    </div>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

      </div>

    </q-page-container>
  </q-layout>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'PageIndex',
    //Declaracion de variables de la pagina
    data() {
      return {
        //Variables del Formulario
        Correo: null, Clave: null, Token : null
      }
    },
    methods: {
      //Metodo para limpiar campos del formulario
      onReset() {
        this.Correo = null
        this.Clave = null
      },
      //Metodo para mostrar el formulario de persona
      async Validar() {
        try {
          this.$q.loading.show();
          const respuest = await this.$axios.post('/Login', { Correo: this.Correo, Clave: this.Clave })
          this.$q.loading.hide();
          localStorage.Token = 'bearer ' + respuest.data.token;
            const parsed = JSON.stringify(respuest.data.usuario);
            localStorage.setItem('Usuario', parsed);
          this.$axios.defaults.headers.common['Authorization'] = 'bearer ' + respuest.data.token;
          if (respuest.data.usuario != null)
          {
            this.$router.push("/Ciudadanos");
          }
          else
          {

              this.$q.notify({
              message: 'Error: El usuario no tiene un rol valido',
              color: 'red-4',
              textColor: 'white',
              icon: 'cloud_done'
        })
          }


        } catch (e) {
          console.log(e);
           this.$q.loading.hide();
           this.$q.notify({
          message: 'Disculpa, servidor no disponible en este momento',
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done'
        })
        }


      }
    }
  }
</script>
