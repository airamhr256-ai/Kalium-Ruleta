function login() {
    const pass = document.getElementById("pass").value;
    const error = document.getElementById("error");

    if (pass === "kalium.2324") {

        // Guardar token para permitir acceso
        sessionStorage.setItem("kalium_acceso", "permitido");

        // Redirigir
        window.location.href = "ruleta kalium.html";

    } else {
        error.style.display = "block";
    }
}
