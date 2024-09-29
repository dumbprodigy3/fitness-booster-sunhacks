document.addEventListener("DOMContentLoaded", function() {
    // Smooth scroll functionality for the "Scroll down" link
    const scrollIndicator = document.querySelector(".scroll-indicator");
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", function() {
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Button click event listeners for logging or additional functions
    const tryNowButton = document.querySelector(".button");
    const joinNowLink = document.querySelector(".join-link");

    if (tryNowButton) {
        tryNowButton.addEventListener("click", function() {
            console.log("Try Now button clicked");
            // Additional functionality can be added here
        });
    }

    if (joinNowLink) {
        joinNowLink.addEventListener("click", function() {
            console.log("Join Now link clicked");
            // Additional functionality can be added here
        });
    }

    // Hover effect for buttons to scale up slightly
    const buttons = [tryNowButton, joinNowLink];

    buttons.forEach(button => {
        if (button) {
            button.addEventListener("mouseover", function() {
                button.style.transform = "scale(1.05)";
                button.style.transition = "transform 0.3s ease";
            });

            button.addEventListener("mouseout", function() {
                button.style.transform = "scale(1)";
            });
        }
    });
});
