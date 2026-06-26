async function loadRecyclingPoints() {
    const list = document.getElementById('points-list');
    const status = document.getElementById('points-status');
    if (!list) return;

    list.innerHTML = '';
    if (status) {
        status.textContent = 'Cargando puntos de reciclaje...';
        status.className = 'points-status';
    }

    try {
        const points = await apiRequest('/recycling-points');

        if (status) status.textContent = '';

        if (!points.length) {
            list.innerHTML = '<p class="points-empty">No hay puntos de reciclaje registrados aún.</p>';
            return;
        }

        points.forEach((point) => {
            const card = document.createElement('article');
            card.className = 'point-card';
            card.innerHTML = `
                <h3>${point.name}</h3>
                <p class="point-address">${point.address || 'Sin dirección'}</p>
                <p class="point-coords">Lat: ${point.latitude} · Lng: ${point.longitude}</p>
                <p class="point-material">Material ID: ${point.materialId ?? 'N/A'}</p>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        if (status) {
            status.textContent = `No se pudieron cargar los puntos: ${error.message}`;
            status.classList.add('is-error');
        }
    }
}

function initPoints() {
    loadRecyclingPoints();
}
