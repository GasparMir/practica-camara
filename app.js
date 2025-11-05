const openCameraBtn = document.getElementById('openCamera');
const switchCameraBtn = document.getElementById('switchCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const gallery = document.getElementById('gallery');
const ctx = canvas.getContext('2d');

let stream = null;
let usingFrontCamera = false;

async function openCamera() {
    try {
        const constraints = {
            video: { facingMode: usingFrontCamera ? 'user' : 'environment' }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        cameraContainer.style.display = 'block';
        openCameraBtn.disabled = true;
    } catch (err) {
        console.error(err);
        alert('No se pudo acceder a la cámara');
    }
}

function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
    }
}

function takePhoto() {
    if (!stream) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    // Crear miniatura y agregar al gallery
    const img = document.createElement('img');
    img.src = dataUrl;
    gallery.appendChild(img);

    closeCamera();
}

async function switchCamera() {
    usingFrontCamera = !usingFrontCamera;
    closeCamera();
    await openCamera();
}

openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
