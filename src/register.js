const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', loginUser);

async function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.toLowerCase().trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document
    .getElementById('confirmPassword')
    .value.trim();

  try {
    if (!username || !email || !password || !confirmPassword) {
      return alert('please enter all fields!');
    }
    if (password !== confirmPassword) {
      return alert('password does not match.');
    }
    const response = await axios.post(
      'http://localhost:5000/api/v1/auth/register',
      { name: username, email, password },
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
