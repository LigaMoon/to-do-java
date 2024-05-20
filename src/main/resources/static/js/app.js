$(document).ready(function() {
    fetchTasks();
});

function fetchTasks() {
    console.log("Fetching tasks...");
    $.ajax({
        url: 'http://localhost:8080/tasks',
        method: 'GET',
        success: function(tasks) {
            console.log("Tasks fetched successfully:", tasks);
            updateTaskList(tasks);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching tasks:", xhr, status, error);
        }
    });
}

function updateTaskList(tasks) {
    const $taskTable = $('#taskTable tbody');
    $taskTable.empty();

    tasks.sort((a, b) => a.taskId - b.taskId);

    tasks.forEach(function(task) {
        const $checkbox = $('<input>').attr('type', 'checkbox').addClass('completed-item').attr('data-id', task.taskId);
        if (task.completed) {
            $checkbox.prop('checked', true);
        }

        const $row = $('<tr>').append(
            $('<td>').text(task.title),
            $('<td>').addClass('text-center').append($checkbox),
            $('<td>').text(task.dueAt),
            $('<td>').addClass('row justify-content-center').append(
                $('<button>').addClass('col btn btn-danger btn-sm delete-item mx-1').attr('data-id', task.taskId).text('delete'),
                $('<button>').addClass('col btn btn-warning btn-sm edit-item mx-1').attr('data-id', task.taskId).text('edit')
            )
        );
        if (task.completed) {
                    $row.addClass('complete');
            }
        $taskTable.append($row);
    });
}


$('#newTaskForm').on('submit', function(e) {
    e.preventDefault(); //for submit to not submit it without the logic below
    const taskTitle = $('#newTaskTitle').val();

    const taskData = {
        title: taskTitle
    };

    $.ajax({
            url: 'http://localhost:8080/tasks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function(newTask) {
                console.log("Task added successfully:", newTask);
                fetchTasks();
                $('#newTaskTitle').val('');
            },
            error: function(xhr, status, error) {
                console.error("Error adding task:", xhr, status, error);
            }
        });
});


$('#taskTable').on('click', '.delete-item', function() {
    const taskId = $(this).data('id');
    console.log(taskId);

    $.ajax({
            url: `http://localhost:8080/tasks/${taskId}`,
            method: 'DELETE',
            success: function() {
                fetchTasks(); // for perfrmance can convert this into line removal
            },
            //alternative to remove it and provide a fade for visual UI
//            success: function() {
//                $row.fadeOut(400, function() { // Fade and remove row
//                    $(this).remove();
//                });
//            },
            error: function(xhr, status, error) {
                console.error("Error deleting task:", xhr, status, error);
            }
        });
});

$('#taskTable').on('click', '.edit-item', function() {
    const $editButton = $(this);
    const $taskRow = $(this).closest('tr');
    const $taskTitleCell = $taskRow.find('td:nth-child(1)');
    const taskTitle = $taskTitleCell.text();

    console.log(taskTitle);

    $taskTitleCell.html(`<input type="text" id="editedTaskTitle" value='${taskTitle}' required>`);

    $editButton.text('save').removeClass('btn-warning edit-item').addClass('btn-dark save-item');
});


$('#taskTable').on('click', '.save-item', function() {
    const $saveButton = $(this);
    const $taskRow = $(this).closest('tr');
    const taskNewTitle = $taskRow.find('td:nth-child(1) input').val();
    const taskId = $(this).data('id');

    $saveButton.text('edit').removeClass('btn-dark save-item').addClass('btn-warning edit-item');

    const taskData = {
            title: taskNewTitle
        };

    $.ajax({
            url: `http://localhost:8080/tasks/${taskId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function(updatedTask) {
                console.log("Task added successfully:", updatedTask);
                fetchTasks();
            },
            error: function(xhr, status, error) {
                console.error("Error adding task:", xhr, status, error);
            }
        });
});

$('#taskTable').on('change', '.completed-item', function() {
    var $taskRow = $(this).closest('tr');
    const taskId = $(this).data('id');
    const completed = $(this).is(':checked');

    const taskData = {
            completed: completed
        };

    $.ajax({
            url: `http://localhost:8080/tasks/${taskId}/completed`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(taskData),
            success: function(updatedTask) {
                console.log("Task added successfully:", updatedTask);
                fetchTasks();
            },
            error: function(xhr, status, error) {
                console.error("Error adding task:", xhr, status, error);
            }
        });
});