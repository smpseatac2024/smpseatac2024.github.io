// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener('DOMContentLoaded', function () {
    // --- FAQ Accordion ---
    document.querySelectorAll('.faq_Question').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.faq_Item');
            item.classList.toggle('open');
            // Optionally close others for true accordion:
            document.querySelectorAll('.faq_Item').forEach(other => {
                if (other !== item) other.classList.remove('open');
            });
        });
    });

    // --- Contact Form Toggle ---
    function toggleClientForm() {
        var isNew = document.getElementById('newClient').checked;
        var newForm = document.getElementById('newClientForm');
        var existingForm = document.querySelector('.existing-client-form');
        
        if (newForm) newForm.style.display = isNew ? 'block' : 'none';
        if (existingForm) existingForm.style.display = isNew ? 'none' : 'block';
    }

    // Set initial state for contact forms
    if (document.getElementById('newClient')) {
        toggleClientForm();
        document.getElementById('newClient').addEventListener('change', toggleClientForm);
        document.getElementById('existingClient').addEventListener('change', toggleClientForm);
    }

    // --- Text Size Toggle ---
    const switchInput = document.getElementById('toggleTextSizeSwitch');
    const body = document.body;
    const largeTextClass = 'large-text';

    // Initialize from localStorage
    if (localStorage.getItem('largeTextEnabled') === 'true') {
        body.classList.add(largeTextClass);
        if (switchInput) switchInput.checked = true;
    }

    if (switchInput) {
        switchInput.addEventListener('change', function () {
            if (this.checked) {
                body.classList.add(largeTextClass);
                localStorage.setItem('largeTextEnabled', 'true');
            } else {
                body.classList.remove(largeTextClass);
                localStorage.setItem('largeTextEnabled', 'false');
            }
        });
    }

    // --- Booking Form Modal ---
    var btn = document.querySelector('.booking-float-btn');
    var bookingModalForm = document.getElementById('bookingFormFloat');
    var close = document.getElementById('closeBookingFormBtn');

    if (bookingModalForm) {
        bookingModalForm.classList.remove('active');
        bookingModalForm.style.display = 'none';
    }

    if (btn && bookingModalForm) {
        btn.addEventListener('click', function () {
            bookingModalForm.classList.add('active');
            bookingModalForm.style.display = 'block';
            document.body.classList.add('booking-modal-open');
        });
    }

    if (close && bookingModalForm) {
        close.addEventListener('click', function () {
            bookingModalForm.classList.remove('active');
            bookingModalForm.style.display = 'none';
            document.body.classList.remove('booking-modal-open');
        });
    }

    if (bookingModalForm) {
        bookingModalForm.addEventListener('click', function (e) {
            if (e.target === bookingModalForm) {
                bookingModalForm.classList.remove('active');
                bookingModalForm.style.display = 'none';
                document.body.classList.remove('booking-modal-open');
            }
        });
    }

    // --- Gallery Lightbox ---
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', function () {
            openLightbox(this.src, this.getAttribute('data-caption'));
        });
    });

    window.openLightbox = function (imgUrl, caption) {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxCaption = document.getElementById("lightbox-caption");
        if (lightbox && lightboxImg) {
            lightbox.style.display = "flex";
            lightboxImg.src = imgUrl;
            if (lightboxCaption) {
                lightboxCaption.textContent = caption || "";
            }
        }
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById("lightbox");
        if (lightbox) {
            lightbox.style.display = "none";
        }
    };

    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    const lightboxClose = document.getElementById("lightbox-close");
    if (lightboxClose) {
        lightboxClose.addEventListener("click", function (e) {
            e.stopPropagation();
            closeLightbox();
        });
    }

    // --- Static Form Handlers ---
    // Since we're on GitHub Pages, we need to use a third-party form service
    // Options: Formspree, Netlify Forms, Google Forms, etc.
    
    // Example with mailto (basic solution):
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('To submit this form, please contact us at:\nPhone: 206-307-0755\nEmail: SMPINKSEATAC@GMAIL.COM');
        });
    });
});
