document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    fetch('submit.php', {
        method: 'POST',
        body: formData
    }).then(function(response) {
        return response.text();
    }).then(function(data) {
        alert(data);
        window.location.href = "assigned-hezb.html";
    });
});