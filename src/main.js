// =============================================
// LIBREAVEDRIO v2 — main.js
// =============================================

import './style.css'

// ─── Slideshow hero (secuencial por carga de página) ───
const slideBgs = document.querySelectorAll('.hero-bg')
if (slideBgs.length) {
  const KEY = 'hero_slide_v2'
  let idx = parseInt(sessionStorage.getItem(KEY) || '0')
  if (idx >= slideBgs.length) idx = 0
  slideBgs[idx].style.opacity = '1'
  sessionStorage.setItem(KEY, (idx + 1) % slideBgs.length)
}

// ─── Menú hamburger móvil ───
const toggle = document.querySelector('.nav-toggle')
const navLinks = document.querySelector('.nav-links')
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open')
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'))
  })
}

// ─── Mapa Leaflet (solo si existe #map) ───
if (document.getElementById('map')) {
  import('leaflet').then(({ default: L }) => {
    const map = L.map('map', { scrollWheelZoom: false })
      .setView([41.055714517046276, -3.6072308811227165], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:14px;height:14px;
        background:#930D24;
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(0,0,0,0.3)
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    })

    L.marker([41.055714517046276, -3.6072308811227165], { icon })
      .addTo(map)
      .bindPopup('<strong>Granja Libreavedrio</strong><br>Sierra Norte de Madrid')
      .openPopup()
  })
}

// ─── Formulario contacto (Formspree AJAX) ───
const form = document.getElementById('contact-form')
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = form.querySelector('[type=submit]')
    const msg = document.getElementById('form-msg')
    btn.disabled = true
    btn.textContent = 'Enviando…'

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
      if (res.ok) {
        msg.textContent = '¡Mensaje enviado! Te responderemos pronto.'
        msg.style.color = '#2d6a4f'
        form.reset()
      } else {
        throw new Error()
      }
    } catch {
      msg.textContent = 'Error al enviar. Escríbenos a hola@granjalibreavedrio.es'
      msg.style.color = '#930D24'
    }

    btn.disabled = false
    btn.textContent = 'Enviar mensaje'
  })
}

// ─── Marca página activa en nav ───
const currentPage = location.pathname.split('/').pop() || 'index.html'
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href')
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active')
  }
})
