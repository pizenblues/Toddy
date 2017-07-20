<template>
  <div class="container" id="todo">
    <section class="panel">
      <input type="checkbox" 
      id="mark-all"
      v-bind:checked="areAllSelected"
      v-on:click="selectAll"
      >
      <input type="text" 
      autofocus class="text-input" 
      placeholder="what u wanna do?"
      v-model="newTask"
      v-on:keyup.enter="addTask">
      <button
      v-on:click="clearList">Limpiar</button>
    </section>
    <ul class="list">
      <li 
      v-for="task in taskList" 
      v-bind:class="{done: task.checked}">
        <input 
        type="checkbox" 
        class="checkbox"
        v-model="task.checked"
        >
        <label for="checkbox">{{ task.text }}</label>
        <button 
        class="delete"
        v-on:click="removeTask(task)"
        >X</button>
      </li>
    </ul>
  </div>
</template>

<script>
import PouchDB from 'pouchdb-browser'

const db = new PouchDB('todos')

export default {
  name: 'list',
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
      this.taskList.splice(index, 1)
    },
    clearList () {
      this.taskList = []
    },
    selectAll: function (task) {
      var targetValue = !this.areAllSelected
      for (var i = 0; i < this.taskList.length; i++) {
        this.taskList[i].checked = targetValue
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    /* Use flexbox */
    display: flex;
    /* Center everything inside .panel and li vertically */
    align-items: center;
    /* Distribute space evenly between the contents*/
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
    border: 1px solid #bbb;
    outline: 0;
    width: 100px;
    height: 38px;
    cursor: pointer;
    font-size: 12px;
  }


  /* Task  area */


  .list li .delete {
    background-color: transparent;
    border: none;
    visibility: hidden;
    font-size: 20px;
    font-weight: bold;
  }

  .list li:hover > .delete {
    /* Show the delete button when hovering over each list item */
    visibility: visible;
  }

  .list label {
    display: inline-block;
    width: 70%;
    font-size: 18px;
    line-height: 24px;
    z-index: 2;
    overflow: hidden;
  }

  .list li.done label {
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
