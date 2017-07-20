<template>
  <div class="container" id="todo">
    <section class="panel">
      <input type="checkbox" id="mark-all" v-bind:checked="areAllSelected" 
      v-on:click="selectAll">
      <input type="text" autofocus class="text-input" placeholder="what u wanna do?"
      v-model="newTask" v-on:keyup.enter="addTask">
      <button class="deleteAll" v-on:click="clearList">
        Limpiar
      </button>
    </section>

    <ul class="list">
      <li v-for="task in taskList" v-bind:class="{done: task.checked}">
        <input type="checkbox" class="checkbox" v-model="task.checked"
        v-on:click="checkTask(task)">
        <label for="checkbox">
          <input type="text" :value="task.text" class="singleTask" :disabled="!task._editting">
        </label>
        <button class="edit" v-on:click="editTask(task)" v-if="!task.checked">
          editar
        </button>
        <button class="delete" v-on:click="removeTask(task)">
          borrar
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import PouchDB from 'pouchdb-browser'
//importa pouchdb
const db = new PouchDB('todos')
//crea una nueva bd
export default {
  name: 'list',
  data () {
    return {
      loading: true,
      //pouchdb es async
      newTask: '',
      taskList: []
    }
  },
  mounted () {
    this.getTasks()
  },
  // lol que?
  methods: {
    
    //jala todo de la db y lo muestra
    getTasks () {
      db.allDocs({include_docs: true}, (err, response) => {
        //The include_docs option tells PouchDB to give us the data within each document
        if (err) {
          throw err
        }
        console.log(response)
        this.taskList = response.rows.map(e => e.doc)
        console.log(this.taskList)
        this.loading = false
      })
    },

    //marcar tarea como hecha
    checkTask (task) {
      var index = this.taskList.indexOf(task)
      db.put(task)
    },

    //agregar tarea
    addTask () {
      var task = this.newTask.trim()
      if (!task) {
        return
      }
      // si no hay tareas, no hay nada que hacer
      // si hay, guarda en la db post()
      db.post({
        text: task,
        checked: false
      }, () => {
        this.newTask = ''
        this.loading = true
        this.getTasks()
      })
    },

    //borrar tarea
    removeTask (task) {
      var index = this.taskList.indexOf(task)
      db.remove(task)
      //pretty straightforward
      this.taskList.splice(index, 1)
      //borra elemento del array con splice
    },

    //editar tarea
    editTask (task) {
      this.$set(task, '_editting', true)
      //task._editting = true
      var index = this.taskList.indexOf(task)
      console.log(task)
      
    },

    //borra todos los elementos. naguara im awesome
    clearList () {
      for (var i = 0; i < this.taskList.length; i++){
        db.remove(this.taskList[i])
        //recorre el array desde 0 hasta length y
        //borra el elemento
      }
      this.taskList = []
      //cambia el array por uno vacio
    },

    //marca todo como listo
    selectAll: function (task) {
      var targetValue = !this.areAllSelected
      for (var i = 0; i < this.taskList.length; i++) {
        this.taskList[i].checked = targetValue
        db.put(this.taskList[i])
      }
    }
  },

  computed: {
    areAllSelected: function () {
      return this.taskList.every(function (task) {
        return task.checked
      }) && this.taskList.length > 0
    }
  }
}
</script>

<style>
  ul,li{
      margin: 0;
      padding: 0;
      border: 0;
  }

    body {
    line-height: 1;
    font-family: "Lato", sans-serif;
    background-color: #EFF1F2;
  }

  .container {
    width: 70%;
    margin: 1em auto 3em;
    border: 1px solid #efefef;
  }

  .panel,
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style-type: none;
    padding: 10px;
    border-bottom: 1px solid #efefef;
    background-color: #E7E8EB;
  }

  .text-input {
    border: 1px solid #dedede;
    padding-left: 10px;
    width: 70%;
    height: 35px;
    color: #555;
  }

  button {
    color: #555;
    background-color: #FFFFFF;
    border: none;
    outline: 0;
    height: 38px;
    cursor: pointer;
    font-size: 10px;
    width: 60px;
  }

  /* Task  area */

  .list li .delete .edit {
    border: none;
    color: white;
    border-radius: 50%;
  }

/*
  .list li:hover > .delete {
    visibility: visible;
  }
*/
  .list label {
    display: inline-block;
    width: 70%;
    font-size: 18px;
    line-height: 24px;
    z-index: 2;
    overflow: hidden;
  }

  .list li.done input {
    text-decoration: line-through;
  }

  /* Media Queries */

  @media screen and (max-width: 768px) {
    .container {
      width: 90%;
      max-width: 90%;
    }
    button {
      width: 80px;
    }
  }
</style>
