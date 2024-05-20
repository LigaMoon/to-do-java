package com.liga.todoapp.service;

import com.liga.todoapp.exceptions.TaskNotFoundException;
import com.liga.todoapp.model.Task;
import com.liga.todoapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> listAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task listTask(Long taskId) {
        return taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task: " + taskId + " was not found."));
    }

    @Override
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long taskId, Task updatedTask) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task: " + taskId + " was not found."));
        task.setTitle(updatedTask.getTitle());
        task.setCompleted(updatedTask.getCompleted());
        task.setDueAt(updatedTask.getDueAt());
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new TaskNotFoundException("Task: " + taskId + " was not found.");
        }
        taskRepository.deleteById(taskId);
    }

    @Override
    public Task updateTaskStatus(Long taskId, boolean completed) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskNotFoundException("Task: " + taskId + " was not found."));
        task.setCompleted(completed);
        return taskRepository.save(task);
    }
}
