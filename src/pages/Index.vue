<template>
  <div class="q-pa-md">
    <q-breadcrumbs style="padding-top: 10px;padding-bottom: 20px;">
      <q-breadcrumbs-el label="Inicio" />
      <q-breadcrumbs-el label="Ciudadanos" />
      <!--<q-breadcrumbs-el label="Breadcrumbs" />-->
    </q-breadcrumbs>
    <!--Barra superior-->
    <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
      <q-btn flat label="Listado de Ciudadanos" />
      <q-space />
      <q-tabs v-model="tab" shrink>
        <q-separator vertical />
        <q-btn stretch flat label="Nuevo" @click="showAgregar" />
        <q-separator vertical />
        <q-btn stretch flat label="Editar" @click="showEditar" />
        <q-separator vertical />
        <q-btn stretch flat label="Eliminar" @click="eliminar" />
      </q-tabs>
    </q-toolbar>
    <div class="row" style="display:none;">
      <div class="col self-center">
        <div class="text-h4 q-pa-md">
          Listado de Ciudadanos
        </div>
      </div>
      <div class="col-2  justify-end ">
        <div class="q-pa-md q-gutter-sm ">
          <q-btn color="primary" @click="showAgregar" label="Agregar Ciudadano" />
        </div>
      </div>
    </div>

    <!--Formulario para Crear y Editar Ciudadano-->
    <div class="q-pa-md" v-if="Agregar">
      <q-card class="my-card">
        <q-card-section>
          <q-form @submit="GuardarCiudadano" ref="myForm"
                  @reset="onReset"
                  class="q-gutter-md">
            <div class="row">
              <div class="col-12">
                <template>
                  <div v-if="Editar" class="text-h5 q-pa-sm">
                    Editar Ciudadano
                  </div>
                  <div v-else class="text-h5 q-pa-sm">
                    Agregar Ciudadano
                  </div>
                </template>
              </div>
              <div class="col-md-3 col-12">
                <q-input filled
                         type="text"
                         v-model="Nombre"
                         label="Nombre *"
                         lazy-rules
                         :rules="[ val => val && val.length > 0 || 'Por favor escriba un nombre']" />
              </div>
              <div class="col-md-3 col-12 offset-md-1">
                <q-input filled
                         v-model="Apellido"
                         label="Apellido *"
                         lazy-rules
                         :rules="[ val => val && val.length > 0 || 'Por favor escriba un apellido']" />
              </div>
              <div class="col-md-3 offset-md-1 col-12">
                <q-input filled
                         v-model="Edad"
                         label="Edad *"
                         mask="###"
                         lazy-rules
                         :rules="[ val => val && val.length > 0 || 'Por favor escriba una edad']" />
              </div>
              
              <div class="col-md-3 col-12 offset-md-9 self-center">
                <div>
                  <q-btn label="Guardar" type="submit" color="primary" />
                  <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <!--Tabla Ciudadano-->
    <div class="q-pa-md">
      <q-table title="Ciudadanos"
               :data="listCiudadano"
               :columns="columns"
               selection="single"
               row-key="Id"
               :filter="filter"
               :selected.sync="selected"
               binary-state-sort>
        <!--Filtro de la tabla-->
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'PageCiudadanoAdmin',
    //Declaracion de variables de la pagina
    data() {
      return {
        filter: '',
        //Variables del Formulario
        Nombre: null, Apellido: null, Edad: null,

        //Variable para crear objeto y poder editar
        selected: [],
        Editar: false,
        tab: '',
        //Variable para habilitar y deshabilitar el modulo de insertar Ciudadanos
        Agregar: false,
        //Columnas de la tabla Ciudadanos
        columns: [
          { name: 'Nombre', label: 'Nombre', field: 'Nombre', align: 'left', sortable: true },
          { name: 'Apellido', label: 'Apellido', field: 'Apellido', align: 'left', sortable: true },
          { name: 'Edad', label: 'Edad', field: 'Edad', align: 'left', sortable: true }
        ],
        //Lista para cargar en la tabla Ciudadanos
        listCiudadano: [

        ],
        

      }
    },
    created() {
      this.ObtenerCiudadanos();
    },
    methods: {
      async ObtenerCiudadanos() {
        try {
          const Ciudadadnos = [];
          this.$q.loading.show();
          const respuesta = await this.$axios.get('/Ciudadano')
          this.$q.loading.hide();
          console.log(respuesta);
          if (respuesta.data.result) {
            respuesta.data.ciudadanos.forEach(item => {
              Ciudadadnos.push({ Id: item.id, Nombre: item.nombre, Apellido: item.apellido, Edad: item.edad });

            })
            this.listCiudadano = Ciudadadnos;  
          } else {
            this.$q.notify({
              message: 'Error al obtener ciudadanos: ' + respuesta.Mensaje,
              color: 'red-4',
              textColor: 'white',
              icon: 'cloud_done'
            })
          }
         
              
        } catch (e) {
          this.$q.loading.hide();
          this.$q.notify({
            message: 'Error al obtener ciudadanos' ,
            color: 'red-4',
            textColor: 'white',
            icon: 'cloud_done'
          })
         
        }
        
      },
      //Metodo para guardar el Ciudadano en la lista de Ciudadanos
      async GuardarCiudadano() {
        try
        {
          if (this.Editar) {
         
            this.$q.loading.show();
            //this.$axios.defaults.headers.common.Accept = 'application/json'
            const respuesta = await this.$axios.put('/Ciudadano', { Id: this.selected[0].Id,  Nombre: this.Nombre, Apellido: this.Apellido, Edad: parseInt(this.Edad) })
            this.$q.loading.hide();
            console.log(respuesta);
            console.log(respuesta.data.result);
            if (respuesta.data.result) {
              this.selected[0].Nombre = this.Nombre;
              this.selected[0].Apellido = this.Apellido;
              this.selected[0].Edad = this.Edad;
              //Envia notificacion de ingreso satisfactorio
              this.$q.notify({
                message: 'Ciudadano guardado',
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done'
              })
              //Limpia los campos del formulario
              this.onReset();

              //Reinicia la validacion del formulario
              this.$refs.myForm.resetValidation();
              //Oculta el formulario para agregar Ciudadanos
              this.Agregar = false;
            } else {
              this.$q.notify({
                message: 'Error al modificar el Ciudadano: ' + respuesta.Mensaje,
                color: 'red-4',
                textColor: 'white',
                icon: 'cloud_done'
              })
            }
          } else {
            //Guarda el Ciudadano en la lista Ciudadano
         
            this.$q.loading.show();
            //this.$axios.defaults.headers.common.Accept = 'application/json'
            const respuesta = await this.$axios.post('/Ciudadano', { Nombre: this.Nombre, Apellido: this.Apellido, Edad: parseInt(this.Edad)})      
            this.$q.loading.hide();
            if (respuesta.result) {
              this.listCiudadano.push({ Id: respuesta.ciudadano.id, Nombre: this.Nombre, Apellido: this.Apellido, Edad: this.Edad });
              //Envia notificacion de ingreso satisfactorio
              this.$q.notify({
                message: 'Ciudadano guardado',
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done'
              })
              //Limpia los campos del formulario
              this.onReset();

              //Reinicia la validacion del formulario
              this.$refs.myForm.resetValidation();
              //Oculta el formulario para agregar Ciudadanos
              this.Agregar = false;
            } else {
              this.$q.notify({
                message: 'Error al insertar el Ciudadano: ' + respuesta.Mensaje,
                color: 'red-4',
                textColor: 'white',
                icon: 'cloud_done'
              })
            }
          }
        } catch (e) {
          console.log(e);
          this.$q.loading.hide();
          this.$q.notify({
            message: 'Error Interno',
            color: 'red-4',
            textColor: 'white',
            icon: 'cloud_done'
          })
        }
       
         

        
      },
      //Metodo para limpiar campos del formulario
      onReset() {
        this.Nombre = null;
        this.Apellido = null;
        this.Edad = null;
        this.Agregar = false;
      },
      //Metodo para mostrar el formulario de Ciudadanos
      showAgregar() {
        this.onReset();
        this.Agregar = true;
        this.Editar = false;

      },
      showEditar() {
        if (this.selected.length > 0) {
          this.Editar = true;
          console.log(this.selected[0]);
          this.Nombre = this.selected[0].Nombre;
          this.Apellido = this.selected[0].Apellido;
          this.Edad = this.selected[0].Edad;
          this.Agregar = true;
        }
      },
      eliminar() {
        this.$q.dialog({
          title: 'Cuidado!',
          message: 'Desea eliminar este Ciudadano?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          var indice = this.listCiudadano.indexOf(this.selected[0]);
          if (indice != -1)
            this.listCiudadano.splice(indice, 1);
          
        })
      },
    },
  }
</script>
