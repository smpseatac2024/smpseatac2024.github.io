$(document).ready(function() {
    $('#openForm').click(function() {
        $('#bookingForm').fadeIn();
    });

    $('#closeForm').click(function() {
        $('#bookingForm').fadeOut();
    });

    $('#consultationForm').submit(function(e) {
        e.preventDefault();
        alert('Thank you for booking your consultation! We will contact you soon.');
        $('#bookingForm').fadeOut();
        $(this).trigger("reset"); // Reset the form fields
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const faqs = document.querySelectorAll(".faq");

    faqs.forEach(faq => {
        faq.querySelector(".faq-question").addEventListener("click", function () {
            this.parentElement.classList.toggle("active");
            let answer = this.nextElementSibling;

            if (answer.style.display === "block") {
                answer.style.display = "none";
                this.querySelector(".arrow").innerHTML = "&#x25BA;"; // Right arrow
            } else {
                answer.style.display = "block";
                this.querySelector(".arrow").innerHTML = "&#x25BC;"; // Down arrow
            }
        });
    });
});
// handles email send from client submission of consult form

const form = document.getElementById('request-form');
const result = document.getElementById('result');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object); result.innerHTML = "Please wait..."

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = json.message;
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function () {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
});
// Hamburger Icon
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menuItems = document.querySelector('.menuItems');
  
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menuItems.classList.toggle('active');
    });
  });