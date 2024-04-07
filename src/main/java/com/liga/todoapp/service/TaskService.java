package com.liga.todoapp.service;

import com.liga.todoapp.model.Task;

import java.util.List;

public interface TaskService {
    List<Task> listAllTasks();
    Task addTask(Task task);
    Task updateTask(Long taskId, Task updatedTask);
    void deleteTask(Long taskId);
}
