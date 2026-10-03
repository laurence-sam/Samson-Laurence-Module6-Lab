function isValidStudentNumber(value) {
  const trimmed = value.trim();
  const pattern = /^\d{2}-\d{4}-\d{3}$/;
  return pattern.test(trimmed);
}

function isValidPassword(value) {
  const hasMinLength = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecial = /[@$!]/.test(value);
  const hasWhitespace = /\s/.test(value);

  return hasMinLength && hasUpperCase && hasDigit && hasSpecial && !hasWhitespace;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isValidStudentNumber, isValidPassword };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const fullName = document.getElementById('fullName');
    const studentNumber = document.getElementById('studentNumber');
    const email = document.getElementById('email');
    const mobileNumber = document.getElementById('mobileNumber');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const course = document.getElementById('course');
    const terms = document.getElementById('terms');

    const successMessage = document.getElementById('successMessage');
    const registrationSummary = document.getElementById('registrationSummary');

    function setError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(fieldId + 'Error');
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    }

    function clearError(fieldId) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(fieldId + 'Error');
      field.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
    }

    function clearAllErrors() {
      ['fullName', 'studentNumber', 'email', 'mobileNumber', 'password', 'confirmPassword', 'course', 'terms'].forEach(clearError);
      document.getElementById('passwordFeedback').textContent = '';
    }

    function resetOutputs() {
      successMessage.style.display = 'none';
      successMessage.textContent = '';
      registrationSummary.style.display = 'none';
      ['summaryName', 'summaryStudentNumber', 'summaryEmail', 'summaryMobileNumber', 'summaryCourse'].forEach(id => {
        document.getElementById(id).textContent = '';
      });
      clearAllErrors();
    }

    function showSummary(data) {
      document.getElementById('summaryName').textContent = data.fullName;
      document.getElementById('summaryStudentNumber').textContent = data.studentNumber;
      document.getElementById('summaryEmail').textContent = data.email;
      document.getElementById('summaryMobileNumber').textContent = data.mobileNumber;
      document.getElementById('summaryCourse').textContent = data.course;

      successMessage.textContent = 'Registration details validated successfully!';
      successMessage.style.display = 'block';
      registrationSummary.style.display = 'block';
    }

    function validateFullName() {
      const val = fullName.value.trim();
      if (val.length === 0) {
        setError('fullName', 'Full name is required.');
        return false;
      }
      if (val.length < 2) {
        setError('fullName', 'Full name must be at least two characters.');
        return false;
      }
      clearError('fullName');
      return true;
    }

    function validateStudentNumber() {
      if (!isValidStudentNumber(studentNumber.value)) {
        setError('studentNumber', 'Enter a student number in the format 24-1234-123.');
        return false;
      }
      clearError('studentNumber');
      return true;
    }

    function validateEmail() {
      const val = email.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(val)) {
        setError('email', 'Enter a valid email address with a domain and extension.');
        return false;
      }
      clearError('email');
      return true;
    }

    function validateMobileNumber() {
      const val = mobileNumber.value.trim();
      const mobilePattern = /^(09\d{9}|\+639\d{9})$/;
      if (!mobilePattern.test(val)) {
        setError('mobileNumber', 'Enter a mobile number starting with 09 or +639 followed by 9 digits, no spaces or hyphens.');
        return false;
      }
      clearError('mobileNumber');
      return true;
    }

    function validatePassword() {
      if (!isValidPassword(password.value)) {
        setError('password', 'Password must be 8+ characters, include 1 uppercase, 1 digit, 1 special (@$!), no spaces.');
        return false;
      }
      clearError('password');
      return true;
    }

    function validateConfirmPassword() {
      if (confirmPassword.value !== password.value) {
        setError('confirmPassword', 'Passwords do not match.');
        return false;
      }
      clearError('confirmPassword');
      return true;
    }

    function validateCourse() {
      if (course.value !== 'BSIT' && course.value !== 'BSCS') {
        setError('course', 'Please select a valid course.');
        return false;
      }
      clearError('course');
      return true;
    }

    function validateTerms() {
      if (!terms.checked) {
        setError('terms', 'You must agree to the terms and conditions.');
        return false;
      }
      clearError('terms');
      return true;
    }

    fullName.addEventListener('blur', validateFullName);

    password.addEventListener('input', function () {
      const feedback = document.getElementById('passwordFeedback');
      if (password.value.length === 0) {
        feedback.textContent = '';
        return;
      }
      if (isValidPassword(password.value)) {
        feedback.textContent = '✓ Password meets requirements.';
        feedback.style.color = '#27ae60';
      } else {
        feedback.textContent = 'Must be 8+ chars, 1 uppercase, 1 digit, 1 of @$!, no spaces.';
        feedback.style.color = '#e74c3c';
      }
    });

    course.addEventListener('change', validateCourse);
    terms.addEventListener('change', validateTerms);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      const ok = [
        validateFullName(),
        validateStudentNumber(),
        validateEmail(),
        validateMobileNumber(),
        validatePassword(),
        validateConfirmPassword(),
        validateCourse(),
        validateTerms()
      ].every(Boolean);

      if (ok) {
        showSummary({
          fullName: fullName.value.trim(),
          studentNumber: studentNumber.value.trim(),
          email: email.value.trim(),
          mobileNumber: mobileNumber.value.trim(),
          course: course.value
        });
      }
    });

    form.addEventListener('reset', function () {
      setTimeout(resetOutputs, 0);
    });
  });
}