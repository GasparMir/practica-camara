// DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const switchCameraBtn = document.getElementById('switchCamera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gallery = document.getElementById('gallery');

let stream = null;
let usingFrontCamera = false; 
let closeBtn = null;

// Abrir cámara según la cámara seleccionada
async function openCamera() {
    try {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: {
                facingMode: usingFrontCamera ? 'user' : 'environment',
                width: { ideal: 320 },
                height: { ideal: 240 }
            },
            audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        cameraContainer.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;

        // Crear botón de cerrar si no existe
        if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.textContent = 'X';
            closeBtn.classList.add('close-camera-btn');
            closeBtn.addEventListener('click', closeCamera);
            cameraContainer.appendChild(closeBtn);
            cameraContainer.style.position = 'relative';
        }

        console.log('Cámara abierta', usingFrontCamera ? 'frontal' : 'trasera');
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Revisa los permisos.');
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
    }
}

// Cambiar cámara
async function switchCamera() {
    usingFrontCamera = !usingFrontCamera;
    await openCamera();
}

// Tomar foto
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara');
        return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/png');

    const img = document.createElement('img');
    img.src = imageDataURL;
    gallery.appendChild(img);
}

// Cerrar cámara
function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;

        video.srcObject = null;
    }

    cameraContainer.style.display = 'none';
    openCameraBtn.textContent = 'Abrir Cámara';
    openCameraBtn.disabled = false;

    // Remover botón de cerrar si existe
    if (closeBtn) {
        closeBtn.remove();
        closeBtn = null;
    }
}

// Event listeners
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);

// Limpiar stream al cerrar página
window.addEventListener('beforeunload', closeCamera);

// Detectar si los permisos se revocan mientras la app está abierta
navigator.permissions?.query({ name: 'camera' }).then(permissionStatus => {
    permissionStatus.onchange = () => {
        if (permissionStatus.state !== 'granted') {
            closeCamera();
        }
    };
});
