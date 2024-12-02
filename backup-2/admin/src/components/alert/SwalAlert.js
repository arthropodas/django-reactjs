import Swal from 'sweetalert2';
import "./SwalAlert.css";
const SwalAlert = ({ title, text, icon, confirmButtonText, onConfirm }) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
      customClass: {
        confirmButton: 'custom-button-class',
        title: 'custom-title-class',
      },
      buttonsStyling: false,
    })
  };

export default SwalAlert;
