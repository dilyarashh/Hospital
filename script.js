// Функция для входа
function login() {
  // Получаем email и пароль из формы
  console.log("Получаем данные для авторизации из формы");
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  // Проверяем, введены ли email и пароль
  if (email && password) {
    console.log("Данные для авторизации введены");
    // Отправляем POST-запрос на сервер для авторизации
    console.log("Отправляем POST-запрос на сервер для авторизации");
    fetch("https://mis-api.kreosoft.space/api/doctor/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        // Проверяем, был ли получен успешный ответ
        if (response.ok) {
          console.log("Получен успешный ответ от сервера");
          // Получаем token авторизации из ответа
          return response.json();
        } else {
          // Выводим сообщение об ошибке
          console.log("Ошибка авторизации");
          alert("Ошибка авторизации");
        }
      })
      .then((data) => {
        // Сохраняем token авторизации в localStorage
        console.log("Сохраняем token авторизации в localStorage");
        localStorage.setItem("token", data.token);

        // Обновляем navbar
        console.log("Обновляем navbar");
        updateNavbar();
      });
  } else {
    // Выводим сообщение об ошибке
    console.log("Email и пароль не введены");
    alert("Введите email и пароль");
  }
}
  
  // Функция для регистрации
  function register() {
    // Получаем данные из формы регистрации
    let firstName = document.getElementById("firstName").value;
    let birthdate = document.getElementById("birthdate").value;
    let phone = document.getElementById("phone").value;
    let specialty = document.getElementById("specialty").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    // Проверяем, введены ли все данные
    if (firstName && birthdate && phone && specialty && email && password) {
      // Отправляем POST-запрос на сервер для регистрации
      fetch("/registration/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          birthdate: birthdate,
          phone: phone,
          specialty: specialty,
          email: email,
          password: password,
        }),
      })
        .then((response) => {
          // Проверяем, был ли получен успешный ответ
          if (response.ok) {
            // Получаем token авторизации из ответа
            return response.json();
          } else {
            // Выводим сообщение об ошибке
            alert("Ошибка регистрации");
          }
        })
        .then((data) => {
          // Сохраняем token авторизации в localStorage
          localStorage.setItem("token", data.token);
  
          // Обновляем navbar
          updateNavbar();
        });
    } else {
      // Выводим сообщение об ошибке
      alert("Заполните все поля формы");
    }
  }
  

  function updateNavbar() {
    // Получаем token авторизации из localStorage
    let token = localStorage.getItem("token");
  
    // Если token авторизации есть
    if (token) {
      // Отправляем GET-запрос на сервер для получения данных пользователя
      fetch("https://mis-api.kreosoft.space/api/doctor/profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          // Проверяем, был ли получен успешный ответ
          if (response.ok) {
            // Получаем данные пользователя из ответа
            return response.json();
          } else {
            // Выводим сообщение об ошибке
            alert("Ошибка получения данных пользователя");
          }
        })
        .then((data) => {
          // Извлекаем имя и фамилию из объекта data (предполагаем, что они хранятся в поле name)
          let nameParts = data.name.split(' ');
          let firstName = nameParts[0];
          let lastName = nameParts.length > 1 ? nameParts[1] : ''; // Если нет фамилии, lastName будет пустой строкой

          // Обновляем navbar
          let navbar = document.querySelector(".navbar-nav"); 
          navbar.innerHTML = `
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${firstName} ${lastName} <span class="caret"></span> 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Профиль</a>
                <a class="dropdown-item" href="#" onclick="logout()">Выход</a>
              </div>
            </li>
          `;
        });
    } else {
      // Скрываем форму регистрации и показываем форму входа
      document.getElementById("registration-form").style.display = "none";
      document.getElementById("login-form").style.display = "block";
    }
  }
  
  // Функция для выхода
  function logout() {
    // Удаляем token авторизации из localStorage
    localStorage.removeItem("token");
  
    // Обновляем navbar
    updateNavbar();
  }
  
  // Запускаем обновление navbar при загрузке страницы
  window.onload = updateNavbar;