<template>
  <div class="q-pa-md">
    <q-breadcrumbs style="padding-top: 10px;padding-bottom: 20px;">
      <q-breadcrumbs-el label="Inicio" />
      <q-breadcrumbs-el label="Tareas" />
      <!--<q-breadcrumbs-el label="Breadcrumbs" />-->
    </q-breadcrumbs>
    <!--Barra superior-->
    <q-toolbar class="bg-grey-3 shadow-2 rounded-borders">
      <q-btn flat label="Listado de Tareas" />
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
          Listado de Tareas
        </div>
      </div>
      <div class="col-2  justify-end ">
        <div class="q-pa-md q-gutter-sm ">
          <q-btn color="primary" @click="showAgregar" label="Agregar Tarea" />
        </div>
      </div>
    </div>

    <!--Formulario para Crear y Editar Tarea-->
    <div class="q-pa-md" v-if="Agregar">
      <q-card class="my-card">
        <q-card-section>
          <q-form @submit="GuardarTarea" ref="myForm"
                  @reset="onReset"
                  class="q-gutter-md">
            <div class="row">
              <div class="col-12">
                <template>
                  <div v-if="Editar" class="text-h5 q-pa-sm">
                    Editar Tarea
                  </div>
                  <div v-else class="text-h5 q-pa-sm">
                    Agregar Tarea
                  </div>
                </template>
              </div>
              <div class="col-md-3 col-12">
                <q-input filled
                         type="text"
                         v-model="Nombre"
                         label="Tarea *"
                         lazy-rules
                         :rules="[ val => val && val.length > 0 || 'Por favor escriba un nombre']" />
              </div>
              <div class="col-md-3 col-12 offset-md-1">
                <q-select v-model="DiaSemanaId" :options="DiasSemana" label="Dia de la Semana" />
              </div>
              <div class="col-md-3 offset-md-1 col-12">
                <q-select v-model="CiudadanoId" :options="Ciudadanos" label="Ciudadano" />
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

    <!--Tabla Tarea-->
    <div class="q-pa-md">
      <q-table title="Tareas"
               :data="listTarea"
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
  export default {
    name: 'PageTareaAdmin',
    //Declaracion de variables de la pagina
    data() {
      return {
        filter: '',
        //Variables del Formulario
        Nombre: null, DiaSemanaId: null, CiudadanoId: null,

        //Variable para crear objeto y poder editar
        selected: [],
        Editar: false,
        tab: '',
        //Variable para habilitar y deshabilitar el modulo de insertar Tareas
        Agregar: false,
        //Columnas de la tabla Tareas
        columns: [
          { name: 'Nombre', label: 'Tarea', field: 'Nombre', align: 'left', sortable: true },
          { name: 'DiaSemana', label: 'Diade la semana', field: 'DiaSemana', align: 'left', sortable: true },
          { name: 'Ciudadano', label: 'Ciudadano', field: 'Ciudadano', align: 'left', sortable: true }
        ],
        //Lista para cargar en la tabla Tareas
        listTarea: [
          { Id: 1, Nombre: 'Cocinar', DiaSemana: 'Lunes', Ciudadano: 'Jesus Sotillo' },
          { Id: 2, Nombre: 'Planchar', DiaSemana: 'Martes', Ciudadano: 'Gregori Salazar' },

        ],
        DiasSemana: [
          { value: 1, label: 'Lunes' },
          { value: 2, label: 'Martes' },
          { value: 3, label: 'Miercoles' },
          { value: 4, label: 'jueves' },
          { value: 5, label: 'viernes' },
          { value: 6, label: 'Sabado' },
          { value: 7, label: 'Domingo' },
        ],
        Ciudadanos: [
          { value: 1, label: 'Jesus Sotillo' },
          { value: 2, label: 'Gregori Salazar' },
          { value: 3, label: 'Adriana polly' }
        ]
      }
    },
    methods: {
      //Metodo para guardar el Tarea en la lista de Tareas
      GuardarTarea() {
        if (this.Editar) {
          this.selected[0].Nombre = this.Nombre;
          this.selected[0].DiaSemana = this.DiaSemanaId.label;
          this.selected[0].Ciudadano = this.CiudadanoId.label;
        } else {
          //Guarda el Tarea en la lista Tarea
          this.listTarea.push({ Id: 3, Nombre: this.Nombre, DiaSemana: this.DiaSemanaId.label, Ciudadano: this.CiudadanoId.label});
        }

        //Limpia los campos del formulario
        this.onReset();
        //Envia notificacion de ingreso satisfactorio
        this.$q.notify({
          message: 'Tarea guardado',
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done'
        })
        //Reinicia la validacion del formulario
        this.$refs.myForm.resetValidation();
        //Oculta el formulario para agregar Tareas
        this.Agregar = false;
      },
      //Metodo para limpiar campos del formulario
      onReset() {
        this.Nombre = null;
        this.Apellido = null;
        this.Edad = null;
        this.Agregar = false;
      },
      //Metodo para mostrar el formulario de Tareas
      showAgregar() {
        this.onReset();
        this.Agregar = true;
        this.Editar = false;

      },
      showEditar() {
        if (this.selected.length > 0) {
          this.Editar = true;
          this.Nombre = this.selected[0].Nombre;
          this.Apellido = this.selected[0].Apellido;
          this.Edad = this.selected[0].Edad;
          this.Agregar = true;
        }
      },
      eliminar() {
        this.$q.dialog({
          title: 'Cuidado!',
          message: 'Desea eliminar este Tarea?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          var indice = this.listTarea.indexOf(this.selected[0]);
          if (indice != -1)
            this.listTarea.splice(indice, 1);

        })
      },
    },
  }
</script>
