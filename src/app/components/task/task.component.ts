import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterType, TaskModel } from '../../models/task';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  tasklist = signal<TaskModel[]> ([]);

  filter = signal<FilterType>('all');

  taskListFiltered = computed(() => {
    const filter = this.filter();
    const tasks = this.tasklist();
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
   
  })

  newTask = new FormControl('',{
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor() {
    effect(() => {
      localStorage.setItem('tasks', JSON.stringify(this.tasklist()));
    });
    
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      this.tasklist.set(JSON.parse(storage));
    }
  }

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }

  addTask() {
    const newTaskTitle = this.newTask.value.trim();
    if (this.newTask.valid && newTaskTitle !== '') {
      this.tasklist.update((prev_tasks) => [
        ...prev_tasks,
        {
          id: Date.now(),
          title: newTaskTitle,
          completed: false         
        }
      ]);
      
      this.newTask.reset();
    } else {
      this.newTask.reset();
    }
  }

  toggleTask(taskId: number) {
    return this.tasklist.update((prev_tasks) => 
      prev_tasks.map((task) => {
        return task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task;
      }
    ));
  }

  removeTask(taskId: number) {
    return this.tasklist.update((prev_tasks) => 
      prev_tasks.filter((task) => task.id !== taskId)
    );
  }

  updateTaskEditingMode(taskId: number) {
    return this.tasklist.update((prev_tasks) => 
      prev_tasks.map((task) => {
        return task.id === taskId 
          ? { ...task, editing: true } 
          : { ...task, editing: false } 
      }
    ));
  }

  saveTitleTask(taskId: number, event: Event) {
    const newTitle = (event.target as HTMLInputElement).value;
    return this.tasklist.update((prev_tasks) => 
      prev_tasks.map((task) => {
        return task.id === taskId 
          ? { ...task, title: newTitle, editing: false } 
          : task;
      }
    ));
  }

}