/* eslint-disable */

// const { default: axios } = require("axios");
import '@babel/polyfill';

const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
  };
  
  // type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
  };

  const loginForm = document.querySelector('.form--login');
  const logOutBtn = document.querySelector('.nav__el--logout');

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data:{
                email,
                password
            }
        })
        
        if(res.data.status === 'success'){
            showAlert('success','Logged in successsfully');
            window.setTimeout(() => {
                location.assign('/')
            }, 1500);
        }
    } catch (error) {
        showAlert('error',error.response.data.message);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
      });
});

const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000/api/v1/users/logout'
      });
      if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error logging out! Try again.');
    }
  };

if (logOutBtn) logOutBtn.addEventListener('click', logout);
