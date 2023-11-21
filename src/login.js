const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', loginUser);

async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.toLowerCase().trim();
  const password = document.getElementById('password').value.trim();

  try {
    if (!email || !password) {
      return alert('please enter all fields!');
    }

    const response = await axios.post(
      'http://localhost:5000/api/v1/auth/login',
      { email, password },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      }
    );

    localStorage.setItem('auth_token', response.data.token);
    window.location.href = './index.html';
  } catch (error) {
    if (error.response.data) {
      document.getElementById('alert-danger').innerText =
        error.response.data.error;
    } else {
      console.log(error.message);
    }
  }
}
