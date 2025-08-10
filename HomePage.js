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
    const dateInput = document.getElementById('date');
    const durationInput = document.getElementById('duration');
    const appointmentFormElement = dateInput?.form;

    if (dateInput) {
        dateInput.addEventListener('change', validateDateTime);
    }
    if (appointmentFormElement) {
        appointmentFormElement.addEventListener('submit', function (e) {
            if (!validateDateTime()) {
                e.preventDefault();
            }
        });
    }

    // --- Duplicate Email Check for New Client Form ---
    $(function () {
        // Main new client form
        $('#Email').on('blur', function () {
            var email = $(this).val();
            if (email) {
                $.get('/Clients/IsEmailAvailable', { email: email }, function (data) {
                    if (!data.isAvailable) {
                        if ($('#email-error').length === 0) {
                            $('<span id="email-error" class="text-danger">This email is already registered.</span>')
                                .insertAfter('#Email');
                        }
                    } else {
                        $('#email-error').remove();
                    }
                });
            } else {
                $('#email-error').remove();
            }
        });

        $('#newClientForm').on('submit', function (e) {
            if ($('#email-error').length > 0) {
                e.preventDefault();
                // Use native focus method to avoid deprecated jQuery focus
                document.getElementById('Email')?.focus();
            }
        });

        // Booking (modal) consultation form
        $('#bookingFormFloat #Email').on('blur', function () {
            var email = $(this).val();
            if (email) {
                $.get('/Clients/IsEmailAvailable', { email: email }, function (data) {
                    if (!data.isAvailable) {
                        $('#booking-email-error').remove();
                        $('<span id="booking-email-error" class="text-danger">This email is already registered. Please contact Jenny at 206-307-0755 or SMPINKSEATAC@GMAIL.COM.</span>')
                            .insertAfter('#bookingFormFloat #Email');
                    } else {
                        $('#booking-email-error').remove();
                    }
                });
            } else {
                $('#booking-email-error').remove();
            }
        });

        $('#bookingFormFloat form').on('submit', function (e) {
            if ($('#booking-email-error').length > 0) {
                e.preventDefault();
                // Use native focus method to avoid deprecated jQuery focus
                document.querySelector('#bookingFormFloat #Email')?.focus();
            }
        });
    });

    // --- Booking Form Popout Modal ---
    var btn = document.querySelector('.booking-float-btn');
    var bookinModalForm = document.getElementById('bookingFormFloat');
    var close = document.getElementById('closeBookingFormBtn');

    // Hide modal by default (in case it's visible from previous state)
    if (bookinModalForm) {
        bookinModalForm.classList.remove('active');
        bookinModalForm.style.display = 'none';
    }

    // Show modal on button click
    if (btn && bookinModalForm) {
        btn.addEventListener('click', function () {
            bookinModalForm.classList.add('active');
            bookinModalForm.style.display = 'block';
            document.body.classList.add('booking-modal-open');
        });
    }

    // Close modal on close icon click
    if (close && bookinModalForm) {
        close.addEventListener('click', function () {
            bookinModalForm.classList.remove('active');
            bookinModalForm.style.display = 'none';
            document.body.classList.remove('booking-modal-open');
        });
    }

    // Optional: close modal when clicking outside the form content
    if (bookinModalForm) {
        bookinModalForm.addEventListener('click', function (e) {
            if (e.target === bookinModalForm) {
                bookinModalForm.classList.remove('active');
                bookinModalForm.style.display = 'none';
                document.body.classList.remove('booking-modal-open');
            }
        });
    }
    function validateDateTime() {
        if (!dateInput) return true;
        const dt = new Date(dateInput.value);
        if (isNaN(dt)) return true; // Let HTML5 handle empty/invalid

        // Only Monday-Friday
        if (dt.getDay() === 0 || dt.getDay() === 6) {
            alert('Appointments can only be scheduled Monday through Friday.');
            dateInput.value = '';
            return false;
        }

        // Only 9am-5pm
        const hour = dt.getHours();
        const minute = dt.getMinutes();
        if (hour < 9 || hour > 16 || (hour === 16 && durationInput.value === "60")) {
            alert('Appointments must start between 9:00 AM and 4:30 PM (for 30 min) or 4:00 PM (for 1 hour).');
            dateInput.value = '';
            return false;
        }
        if (hour === 16 && durationInput.value === "30" && minute > 30) {
            alert('Last 30-minute appointment must start by 4:30 PM.');
            dateInput.value = '';
            return false;
        }
        if (hour === 17 || hour > 17) {
            alert('Appointments must end by 5:00 PM.');
            dateInput.value = '';
            return false;
        }
        return true;
    }

    // --- Contact Form Toggle ---
    function toggleClientForm() {
        var isNew = document.getElementById('newClient').checked;
        document.getElementById('newClientForm').style.display = isNew ? 'block' : 'none';
        document.getElementById('verification-step').style.display = isNew ? 'none' : 'block';
        document.getElementById('code-step').style.display = 'none';
        document.getElementById('appointment-step').style.display = 'none';
    }

    // Set initial state for contact forms
    toggleClientForm();

    // Attach event listeners for radio buttons
    document.getElementById('newClient').addEventListener('change', toggleClientForm);
    document.getElementById('existingClient').addEventListener('change', toggleClientForm);

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

    // --- Existing Client Verification Flow ---

    // Step 1: Request Verification Code
    const verifyRequestForm = document.getElementById('verify-request-form');
    if (verifyRequestForm) {
        verifyRequestForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.disabled = true; // Disable button to prevent double submit

            const data = {
                email: this.email.value,
                phoneNumber: this.phoneNumber.value
            };
            fetch('/Clients/AjaxRequestVerification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then(res => {
                    btn.disabled = false; // Re-enable button
                    if (res.success) {
                        document.getElementById('verification-step').style.display = 'none';
                        document.getElementById('code-step').style.display = 'block';
                        document.querySelector('#verify-code-form [name="email"]').value = data.email;
                        document.querySelector('#verify-code-form [name="phoneNumber"]').value = data.phoneNumber;
                    } else {
                        alert(res.message);
                    }
                })
                .catch(() => { btn.disabled = false; });
        });
    }

    // Step 2: Verify Code
    const verifyCodeForm = document.getElementById('verify-code-form');
    if (verifyCodeForm) {
        verifyCodeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                email: this.email.value,
                phoneNumber: this.phoneNumber.value,
                verificationCode: this.verificationCode.value
            };
            fetch('/Clients/AjaxVerifyCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        document.getElementById('code-step').style.display = 'none';
                        document.getElementById('appointment-step').style.display = 'block';
                        document.querySelector('#appointment-form [name="email"]').value = data.email;
                    } else {
                        alert(res.message);
                    }
                });
        });
    }

    // Step 3: Schedule Appointment
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                email: this.email.value,
                appointmentType: this.appointmentType.value,
                appointmentDate: this.appointmentDate.value
            };
            fetch('/Clients/AjaxAddAppointmentForExistingClient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        alert(res.message);
                        // Optionally reset or hide the form
                    } else {
                        alert(res.message);
                    }
                });
        });
    }

    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', function () {
            openLightbox(this.src, this.getAttribute('data-caption'));
        });
    });

    window.openLightbox = function (imgUrl, caption) {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxCaption = document.getElementById("lightbox-caption");
        lightbox.style.display = "flex";
        lightboxImg.src = imgUrl;
        lightboxCaption.textContent = caption || "";
    };

    window.closeLightbox = function () {
        document.getElementById("lightbox").style.display = "none";
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
            e.stopPropagation(); // Prevent closing by overlay click
            closeLightbox();
        });
    }

    // --- Step 4 & 5: Show alerts and reopen modal if needed ---
    var alertDiv = document.getElementById('form-alert');
    if (alertDiv) {
        var message = alertDiv.getAttribute('data-message');
        var error = alertDiv.getAttribute('data-error');
        var source = alertDiv.getAttribute('data-source');

        if (message) {
            alert(message);
        }
        if (error) {
            alert(error);
        }

        // If the booking modal was used, reopen it so the user sees the alert
        if ((message || error) && source === "booking") {
            var bookinModalForm = document.getElementById('bookingFormFloat');
            if (bookinModalForm) {
                bookinModalForm.classList.add('active');
                bookinModalForm.style.display = 'block';
                document.body.classList.add('booking-modal-open');
            }
        }
    }

});
