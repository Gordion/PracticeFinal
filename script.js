$(document).ready(function(){

  $(".regist").on('click', function(e) {
    console.log(0);
    regisClick();
  });

  $("#reg-button").on('click', function(e) {
    e.preventDefault();
    signUp();
  });

  $(".signin").on('click', function(e) {
    console.log(1);
    authClick();
  });

  $("#login-button").on('click', function(e) {
    e.preventDefault();
    signIn();
  });

  $("#logout-button").on('click', function(e) {
    // e.preventDefault();
    signOut();
  });

  $(".overlay").on('click', function(e) {
    console.log(2);
    closeRegisClick();
  });

  function regisClick() {
    $(".overlay").addClass("form-opened");
    $(".regis").addClass("form-opened");
  }

  function authClick() {
    $(".overlay").addClass("form-opened");
    $(".auth").addClass("form-opened");
  }

  function closeRegisClick() {
    $(".overlay").removeClass("form-opened");
    $(".auth").removeClass("form-opened");
    $(".regis").removeClass("form-opened");
  }

  $(".save-quiz").on('click', function(e) {
    e.preventDefault();
    saveResults();
  });

  if (getUserName()) {
    renderUserData(getUserName());
  }

  if (window.location.pathname.indexOf('/userpage') > -1) {
    getResults();
  }

  function getAuthToken() {
    return localStorage.getItem('token');
  }

  function setAuthToken(token) {
    return localStorage.setItem('token', token);
  }

  function signUp() {
    $.ajax({
      "url": "https://ippt-quiz-api.herokuapp.com/api/auth/signUp",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "email": $('.reg-email').val(),
        "password": $('.reg-password').val()
      }),
    }).done(function (response) {
      if (response) {
        console.log('Registration', response);
        closeRegisClick();
      }
    });
  }

  function signIn() {
    const username = $('.auth-email').val();
    const password = $('.auth-password').val();
    $.ajax({
      "url": "https://ippt-quiz-api.herokuapp.com/api/auth/signIn",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "email": username,
        "password": password
      }),
    }).done(function (response) {
      if (response) {
        console.log('Login', response);
        const accessToken = response.accessToken;
        setAuthToken(accessToken);
        renderUserData(username);
        closeRegisClick();
      }
    });
  }

  function setUserName(username) {
    localStorage.setItem('username', username);
    $('.username').text(username).show();
  }

  function getUserName() {
    return localStorage.getItem('username');
  }

  function renderUserData(username) {
    setUserName(username);
    $('.button-userpage').show();
  }

  function signOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

  function saveResults() {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    const quizType = $('.save-quiz').data('quiz-type');
    const result = window.location.search.substring(1);

    $.ajax({
      "url": "https://ippt-quiz-api.herokuapp.com/api/result",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "date": dateTime,
        "type": quizType || "Unknown",
        "result": result
      }),
    }).done(function (response) {
      console.log('Results saved', response);
    });
  }

  function getResults() {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    $.ajax({
      "url": "https://ippt-quiz-api.herokuapp.com/api/result",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "Bearer " + token
      },
    }).done(function (response) {
      console.log('Quiz results', response);
      if (response) {
        response.forEach((item, i) => {
          console.log(item);
          switch (item.type) {
            case 'Values':
              addTableRow($('.values-table tbody'), item);
              break;
            case 'Coords':
              addTableRow($('.coords-table'), item);
              break;
            default:
              console.log('Item type unknown.');
          }

        });
      }
    });
  }

  function addTableRow(table, item) {
    const results = item.result.split('&').map(r => r.split('='));
    table.append(`
      <tr>
        <td class="polit-table date">${item.date}</td>
        ${results.map((r) => `<td class="polit-table value-${r[0]}">${r[1]}</td>`)}
        <td class="polit-table link"><a href="https://gordion.github.io/PracticeFinal/results.html?${item.result}">Посилання</a></td>
      </tr>
    `);
  }

});
