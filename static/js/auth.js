$(document).ready(function () {
    let signupBtn = document.getElementById("signUpButton");

    signupBtn.addEventListener("click", signUp);

    function signUp() {
        let email = document.getElementById("emailAddress").value;
        let password = document.getElementById("password").value;

        console.log(email);

        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        $.ajax({
            url: '/signup',
            data: {"email": email, "password": password},
            processData: false,
            contentType: false,
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data) {
                window.location = "/account/accounts"
            }
        });
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    let csrftoken = getCookie('csrftoken');

});
