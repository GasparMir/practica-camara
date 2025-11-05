// Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const switchCameraBtn = document.getElementById('switchCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const gallery = document.getElementById('gallery');
const ctx = canvas.getContext('2d');

let stream = null;
let usingFrontCamera = false; // Estado de cámara activa

// Abrir cámara
async function openCamera() {
    try {
        const constraints = {
            video: {
                facingMode: usingFrontCamera ? 'user' : 'environment',
                width: { ideal: 320 },
                height: { ideal: 240 }
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        cameraContainer.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;

        console.log(`Cámara ${usingFrontCamera ? 'frontal' : 'trasera'} abierta`);
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Verifica los permisos.');
    }
}

// Cambiar entre cámaras
async function switchCamera() {
    usingFrontCamera = !usingFrontCamera;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    await openCamera();
}

// Tomar foto
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara.');
        return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/png');

    // Crear elemento imagen y agregarlo al contenedor de galería
    const img = document.createElement('img');
    img.src = imageDataURL;
    gallery.appendChild(img);

    // Hacer scroll automático al final (última foto)
    gallery.scrollLeft = gallery.scrollWidth;

    console.log('Foto capturada');
}

// Cerrar cámara
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        cameraContainer.style.display = 'none';
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
        console.log('Cámara cerrada');
    }
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
window.addEventListener('beforeunload', closeCamera);
