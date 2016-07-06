(function(){

  var doList = {
    init: function() {
      this.cacheDom();
      this.bindEvents();
    },

    cacheDom: function() {
      this.taskInput = document.getElementById("newtask");
      this.addButton = document.getElementsByTagName("button")[0];
      this.incompleteTaskHolder = document.getElementById("incomplete-tasks");
      this.completedTasksHolder = document.getElementById("completed-tasks");
      console.log("Dom cached");
    },

    bindEvents: function(taskListItem, checkBoxEventHandler) {
      this.addButton.onclick = this.addTask.bind(this);

      for (var i=0; i < this.incompleteTaskHolder.children.length;i++){
        this.bindTaskEvents(this.incompleteTaskHolder.children[i], this.taskCompleted);
      }

      for (var i=0; i < this.completedTasksHolder.children.length;i++){
        this.bindTaskEvents(this.completedTasksHolder.children[i], this.taskIncomplete);
      }
    },

    bindTaskEvents: function(taskListItem, checkBoxEventHandler) {
      console.log("bind list item events");
      var checkBox = taskListItem.querySelector("input[type=checkbox]");
      var editButton = taskListItem.querySelector("button.edit");
      var deleteButton = taskListItem.querySelector("button.delete");

      editButton.onclick = this.editTask.bind(this);
      deleteButton.onclick = this.deleteTask.bind(this);
      checkBox.onchange = checkBoxEventHandler.bind(this);
    },

    createNewTaskElement: function(taskString) {

      var listItem = document.createElement("li");
      var containsClass = listItem.classList.contains("boxholder");
      var checkBox = document.createElement("input");
      var label = document.createElement("label");
      var editInput = document.createElement("input");
      var editButton = document.createElement("button");
      var deleteButton = document.createElement("button");

      label.innerText = taskString;

      checkBox.type="checkbox";
      editInput.type="text";

      editButton.innerText = "Edit";
      editButton.className = "edit";
      deleteButton.innerText = "Delete";
      deleteButton.className = "delete";

      listItem.appendChild(checkBox);
      listItem.appendChild(label);
      listItem.appendChild(editInput);
      listItem.appendChild(deleteButton);
      listItem.appendChild(editButton);
      return listItem;
    },

    addTask: function(e) {
      console.log("Add Task...");

      var listItem = this.createNewTaskElement(this.taskInput.value);

      this.incompleteTaskHolder.appendChild(listItem);
      this.bindTaskEvents(listItem, this.taskCompleted);

      this.taskInput.value="";
    },

    editTask: function(e) {
      console.log("Edit Task...");

      var listItem = e.target.parentNode;

      var editInput = listItem.querySelector('input[type=text]');
      var label = listItem.querySelector("label");
      var containsClass = listItem.classList.contains("editMode");

      if (containsClass) {
        label.innerText = editInput.value;
      } else {
        editInput.value = label.innerText;
      }

      listItem.classList.toggle("editMode");
    },

    deleteTask: function(e) {
      console.log("Delete Task...");

      var listItem = e.target.parentNode;
      var ul = listItem.parentNode;

      ul.removeChild(listItem);
    },

    taskCompleted: function(e) {
      console.log("Complete Task...");

      var listItem = e.target.parentNode;
      doList.completedTasksHolder.appendChild(listItem);
      doList.bindTaskEvents(listItem, this.taskIncomplete);
    },

    taskIncomplete: function(e) {
      console.log("Incomplete Task...");

      var listItem = e.target.parentNode;
      this.incompleteTaskHolder.appendChild(listItem);
      this.bindTaskEvents(listItem, this.taskCompleted);
    },
  }

  doList.init();
}());
