document.addEventListener("DOMContentLoaded", () => {
  const bcrypt = dcodeIO.bcrypt;
  const passwordInput = document.getElementById("passwordInput");
  const saltRoundsInput = document.getElementById("saltRoundsInput");
  const hashOutput = document.getElementById("hashOutput");
  const togglePassword = document.getElementById("togglePassword");
  const copyHash = document.getElementById("copyHash");
  const toastCopied = document.getElementById("toastCopied");

  // Mostrar/Ocultar contraseña
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
  });

  // Función para generar el hash
  async function generateHash() {
    const password = passwordInput.value.trim();
    const rounds = parseInt(saltRoundsInput.value, 10) || 10;

    if (password === "") {
      hashOutput.value = "";
      return;
    }

    try {
      const salt = await bcrypt.genSalt(rounds);
      const hash = await bcrypt.hash(password, salt);
      hashOutput.value = hash;

      /* Animación */
      hashOutput.classList.remove("flash-update");
      void hashOutput.offsetWidth;
      hashOutput.classList.add("flash-update");
    } catch (error) {
      console.error("Error generando el hash:", error);
      hashOutput.value = "Error generando hash.";
    }
  }

  function handlePasswordInput() {
    const password = passwordInput.value.trim();
    if (password === "") {
      hashOutput.value = "";
    } else {
      generateHash();
    }
  }

  // Evento al escribir contraseña
  passwordInput.addEventListener("input", handlePasswordInput);
  passwordInput.addEventListener("keyup", handlePasswordInput);

  // Evento al cambiar rounds
  saltRoundsInput.addEventListener("input", () => {
    if (passwordInput.value.trim() !== "") {
      generateHash();
    } else {
      hashOutput.value = "";
    }
  });

  // Copiar el hash al portapapeles
  copyHash.addEventListener("click", async () => {
    const hash = hashOutput.value.trim();
    if (hash === "") return;

    try {
      await navigator.clipboard.writeText(hash);
      showToast();
    } catch (error) {
      console.error("Error copiando hash:", error);
    }
  });

  // Función para mostrar toast de copiado
  function showToast() {
    toastCopied.classList.remove("hidden");

    setTimeout(() => {
      toastCopied.classList.add("hidden");
    }, 2000);
  }
});
