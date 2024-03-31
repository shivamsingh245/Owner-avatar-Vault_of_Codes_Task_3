const error = document.getElementById("error");
const success = document.getElementById("success");

document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var formData = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('pwd').value,
        confirm_password: document.getElementById('cpwd').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        terms: document.getElementById('terms').checked
    };

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then(res => res.json())
        .then(data => {
            if (data.status == "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerText = data.error;
            }
            else {
                error.style.display = "none";
                success.style.display = "block";
                success.innerText = data.success;
            }
        });
    setTimeout(() => {
        error.style.display = "none";
        success.style.display = "none";
    }, 3000);
});