<template>
  <div class="container" id="todo">
    <section class="panel head">
      <input type="checkbox" id="mark-all" v-bind:checked="areAllSelected" 
      v-on:click="selectAll" class="checkbox">
      <input type="text" autofocus class="text-input" placeholder="what u wanna do?"
      v-model="newTask" v-on:keyup.enter="addTask" id="mainInput">
      <button class="deleteAll" v-on:click="clearList">
        X
      </button> 
    </section>

      <ul class="list">
      <draggable :list="taskList" :options="{group:'taskList'}" :move="dragStart(added)" v-model="taskList">
        <li v-for="task in taskList" v-bind:class="{done: task.checked}" :key="task.id" class="task">
          <input type="checkbox" class="checkbox" v-model="task.checked"
          v-on:click="checkTask(task)">
          <label for="checkbox">
          <!--
            <input type="text" :value="task.text" class="singleTask" :disabled="!task._editting">
          -->
            <input type="text" :value="task.text" class="singleTask" v-on:keyup.enter="editTask(task)"
            :disabled="task.checked" v-model="task.text">
          </label>
          <!--
          <button class="edit" v-on:click="editTask(task)" v-if="!task.checked">
            editar
          </button>
          -->
          <button class="delete" v-on:click="removeTask(task)">
            X
          </button>
        </li>
      </draggable>
    </ul>
  </div>
</template>

<script>
import PouchDB from 'pouchdb-browser'
import draggable from 'vuedraggable'

const db = new PouchDB('todos')
export default {
  name: 'list',
  components: {
    draggable
  },
  data () {
    return {
      loading: true,
      newTask: '',
      taskList: []
    }
  },
  mounted () {
    this.getTasks()
  },
  methods: {

    dragStart (evt) {
      //var indice = index.draggedContext.taskList.task
      //var indice = this.taskList.indexOf(task)
      //console.log(indice)
      //var futureIndex = this.targetElement = evt.relatedContext.element
      var futureIndex = evt.draggedContext.element
      var index = this.taskList.indexOf(futureIndex)
      //console.log(index)
      console.log(index)
    },

    dragEnd(){
      console.log("end")
    },
    
    getTasks () {
      db.allDocs({include_docs: true}, (err, response) => {
        if (err) {
          throw err
        }
        console.log(response)
        this.taskList = response.rows.map(e => e.doc)
        console.log(this.taskList)
        this.loading = false
      })
    },

    editTask (task) {
      //this.$set(task, '_editting', true)
      db.get(task._id).then(function(originalTask){
        task._rev = originalTask._rev
        return db.put(task);
      }).then(function(response){
        console.log("editado")
      }).catch(function (err){
        console.log(err)
      })
    },

    checkTask (task) {
      var index = this.taskList.indexOf(task)
      db.put(task)
    },

    addTask () {
      var task = this.newTask.trim()
      if (!task) {
        return
      }
      db.post({
        text: task,
        checked: false
      }, () => {
        this.newTask = ''
        this.loading = true
        this.getTasks()
      })
    },

    removeTask (task) {
      var index = this.taskList.indexOf(task)
      if (!(confirm("Seguro?"))){
        return
      }
      db.remove(task)
      this.taskList.splice(index, 1)
      console.log("removed")
    },

    clearList () {
      if (!(confirm("Seguro?"))){
        return
      }
      for (var i = 0; i < this.taskList.length; i++){
        db.remove(this.taskList[i])
      }
      this.taskList = []
    },

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
    font-family: 'Nunito', sans-serif;
    background-color: #f8f8ff
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
    padding: 10px 20px 10px 60px;
    border-bottom: 2px solid #F9F9F9;
    background: white;
  }

  .text-input {
    border: 2px solid lightblue;
    padding: 10px 5px;
    width: 85%;
    height: 35px;
    color: black;
    font-size: 36px;
    font-weight: bold;
    font-family: 'Nunito', sans-serif;
  }

  button {
    color: #555;
    background-color: #FFFFFF;
    border: none;
    outline: 0;
    height: 38px;
    cursor: pointer;
    font-size: 14px;  
  }

  /* Task  area */

  .list li .delete {
    visibility: hidden;
  }


  .list li:hover > .delete {
    visibility: visible;
  }

  .list label {
    display: inline-block;
    width: 85%;
    font-size: 18px;
    line-height: 24px;
    z-index: 2;
    overflow: hidden;
  }

  .list li.done input {
    text-decoration: line-through;
  }

  .list input[type=text]{
    width: 100%;
    padding-left: 10px;
    border-style: none;
    color: #555;
    font-size: 16px;
    font-weight: bold;
    font-family: 'Nunito', sans-serif;
  }

  .list input[type=text]:disabled{
    background: white;
  }

  /* Media Queries */

  @media screen and (max-width: 768px) {
    .container {
      width: 90%;
      max-width: 90%;
    }
  }

</style>