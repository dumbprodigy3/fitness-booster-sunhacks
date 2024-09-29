document.addEventListener("DOMContentLoaded", function () {
    // Handling form login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent page reload
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Email:', email);
        console.log('Password:', password);
        // Here you can add logic to send data to your server or handle authentication
        alert("Login form submitted!");
    });

    // Handling Google Sign-in Redirect
    const googleButton = document.getElementById('google-auth');
    googleButton.addEventListener('click', function () {
        // Replace with your actual Google Client ID
        // const clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        // const redirectUri = 'YOUR_REDIRECT_URI'; // URL to redirect to after successful login
        // const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
        // const responseType = 'token';
        // const state = 'some_random_state'; // Optional: use a state parameter to maintain state between request and callback

        // Construct the Google OAuth URL
        // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&state=${state}`;

        const googleAuthUrl = `https://z5b1v2y35i.execute-api.us-east-2.amazonaws.com/dev/authorize-google-login`

        // Redirect the user to the Google OAuth page
        window.location.href = googleAuthUrl;
    });
});
