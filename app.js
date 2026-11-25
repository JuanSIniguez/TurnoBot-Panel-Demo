/* Prototipo de interfaz: datos inventados en memoria, sin API ni persistencia. */
const professionals = [
  { id: 'sofia', name: 'Sofía Martínez', initials: 'SM', color: 'rose', role: 'Colorista · Estilista', services: 'Todos los servicios' },
  { id: 'lucia', name: 'Lucía Fernández', initials: 'LF', color: 'sage', role: 'Estilista', services: 'Corte, brushing' },
  { id: 'camila', name: 'Camila Rodríguez', initials: 'CR', color: 'lilac', role: 'Especialista en color', services: 'Color, tratamiento' }
];
const services = [
  { name: 'Corte de cabello', minutes: 45, people: 'Sofía, Lucía' },
  { name: 'Color completo', minutes: 90, people: 'Sofía, Camila' },
  { name: 'Brushing', minutes: 45, people: 'Sofía, Lucía' },
  { name: 'Tratamiento capilar', minutes: 60, people: 'Sofía, Camila' }
];
const baseDate = new Date(2026, 10, 25);
let currentDate = new Date(baseDate);
let view = 'day';
let filter = 'all';
let bookings = [
  { id: 1, day: 25, hour: 9, pro: 'sofia', client: 'Valentina Ríos', service: 'Corte de cabello', color: '' },
  { id: 2, day: 25, hour: 10, pro: 'lucia', client: 'Florencia Vega', service: 'Brushing', color: 'green' },
  { id: 3, day: 25, hour: 10, pro: 'camila', client: 'Martina Díaz', service: 'Color completo', color: 'purple' },
  { id: 4, day: 25, hour: 11, pro: 'sofia', client: 'Paula Gómez', service: 'Color completo', color: '' },
  { id: 5, day: 25, hour: 12, pro: 'lucia', client: 'Ana Beltrán', service: 'Corte de cabello', color: 'green' },
  { id: 6, day: 25, hour: 14, pro: 'camila', client: 'Carolina Méndez', service: 'Tratamiento capilar', color: 'purple' },
  { id: 7, day: 25, hour: 15, pro: 'sofia', client: 'Julieta Pérez', service: 'Brushing', color: '' },
  { id: 8, day: 25, hour: 16, pro: 'lucia', client: 'Abril Torres', service: 'Corte de cabello', color: 'green' },
  { id: 9, day: 26, hour: 10, pro: 'camila', client: 'Emilia García', service: 'Color completo', color: 'purple' },
  { id: 10, day: 27, hour: 11, pro: 'sofia', client: 'Rocío López', service: 'Corte de cabello', color: '' }
];
const $ = (selector) => document.querySelector(selector);
const localDate = (date, options) => new Intl.DateTimeFormat('es-AR', options).format(date);
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const dayBookings = (date) => bookings.filter(b => b.day === date.getDate() && date.getMonth() === 10 && date.getFullYear() === 2026);
const safe = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const visiblePros = () => professionals.filter(p => filter === 'all' || p.id === filter);
function avatar(p) { return `<span class="pro-avatar ${p.color}">${p.initials}</span>`; }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 3500); }
function renderCalendar() {
  $('#current-date').textContent = localDate(currentDate, { weekday:'long', day:'numeric', month:'long' }).replace(/^./, c => c.toUpperCase());
  const list = dayBookings(currentDate);
  $('#stat-bookings').textContent = String(list.length).padStart(2, '0');
  if (view === 'week') { renderWeek(); return; }
  const pros = visiblePros();
  const board = `<div class="calendar-board-container"><div class="calendar-board" style="--cols:${pros.length}"><div class="calendar-corner"></div>${pros.map(p => `<div class="pro-heading">${avatar(p)}<div><strong>${p.name}</strong><small>${p.role}</small></div></div>`).join('')}${Array.from({length:9}, (_, i) => {
    const hour = i + 9;
    return `<div class="time-label">${String(hour).padStart(2,'0')}:00</div>${pros.map(p => {
      const booking = list.find(b => b.hour === hour && b.pro === p.id);
      if (booking) return `<div class="calendar-cell"><button class="booking ${booking.color}" type="button" data-booking="${booking.id}" aria-label="Ver reserva de ${safe(booking.client)} a las ${hour}"><strong>${safe(booking.client)}</strong><span>${safe(booking.service)}</span><small>${String(hour).padStart(2,'0')}:00 · Confirmada</small></button></div>`;
      if (hour === 13) return `<div class="calendar-cell"><div class="break-block">Pausa</div></div>`;
      return `<div class="calendar-cell"></div>`;
    }).join('')}`;
  }).join('')}</div></div>`;
  $('#calendar').innerHTML = board;
}
function renderWeek() {
  const start = new Date(currentDate); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  $('#calendar').innerHTML = `<div class="week-grid">${Array.from({length:5}, (_, i) => {
    const date = new Date(start); date.setDate(date.getDate() + i);
    const items = dayBookings(date).filter(b => filter === 'all' || b.pro === filter).sort((a,b) => a.hour - b.hour);
    return `<div class="week-day ${sameDay(date, currentDate) ? 'current':''}"><h3><small>${localDate(date,{weekday:'long'}).toUpperCase()}</small>${localDate(date,{day:'numeric',month:'long'})}</h3>${items.length ? items.map(b => `<div class="week-entry"><strong>${String(b.hour).padStart(2,'0')}:00 · ${safe(b.client)}</strong><span>${safe(professionals.find(p=>p.id===b.pro).name)} · ${safe(b.service)}</span></div>`).join('') : '<div class="muted" style="font-size:12px">Sin reservas de ejemplo</div>'}</div>`;
  }).join('')}</div>`;
}
function switchPage(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  $('#breadcrumb-title').textContent = ({agenda:'Agenda',requests:'Solicitudes',services:'Servicios',team:'Profesionales'})[page];
  window.scrollTo({top:0,behavior:'smooth'});
}
function openModal(title, content, actionText, handler) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = content;
  $('#confirm-modal').textContent = actionText;
  $('#dialog-form').onsubmit = e => { e.preventDefault(); handler(); };
  $('#modal').showModal();
}
function newBooking() {
  const proOptions = professionals.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  const serviceOptions = services.map(s => `<option value="${safe(s.name)}">${safe(s.name)}</option>`).join('');
  openModal('Nueva reserva', `<label class="form-field">Nombre del cliente<input name="client" required placeholder="Ej. Clara Suárez" maxlength="70"></label><label class="form-field">Servicio<select name="service">${serviceOptions}</select></label><label class="form-field">Profesional<select name="pro">${proOptions}</select></label><label class="form-field">Hora de inicio<select name="hour">${Array.from({length:9},(_,i)=>`<option value="${i+9}">${String(i+9).padStart(2,'0')}:00</option>`).join('')}</select></label><p class="modal-copy">Fecha: ${localDate(currentDate,{day:'numeric',month:'long',year:'numeric'})}. La reserva existirá solo durante esta visita.</p>`, 'Agregar a la demo', () => {
    const form = $('#dialog-form'); if (!form.reportValidity()) return;
    const data = new FormData(form), client = String(data.get('client')).trim(), pro = data.get('pro'), hour = Number(data.get('hour')), service = data.get('service');
    if (!client) { showToast('Ingresá un nombre para continuar.'); return; }
    if (hour === 13 || dayBookings(currentDate).some(b => b.hour === hour && b.pro === pro)) { showToast('La franja está ocupada o no está disponible. Elegí otra hora.'); return; }
    if (currentDate.getFullYear() !== 2026 || currentDate.getMonth() !== 10) { showToast('La demo solo permite agregar reservas en noviembre de 2026.'); return; }
    const allowed = {'lucia':['Corte de cabello','Brushing'],'camila':['Color completo','Tratamiento capilar']};
    if (allowed[pro] && !allowed[pro].includes(service)) { showToast('Este profesional no presta el servicio seleccionado.'); return; }
    bookings.push({id:Date.now(),day:currentDate.getDate(),hour,pro,client,service,color:({sofia:'',lucia:'green',camila:'purple'})[pro]});
    $('#modal').close(); switchPage('agenda'); renderCalendar(); showToast('Reserva agregada a la demostración. No se guardó en un servidor.');
  });
}
function renderRequests() {
  const requests = [
    { name:'Sofía Martínez', detail:'Ausencia · viernes 27 de noviembre · jornada completa', impact:'1 reserva de ejemplo podría verse afectada', affected:true },
    { name:'Lucía Fernández', detail:'Cambio de horario · lunes 30 de noviembre · ingreso a las 11:00', impact:'Sin reservas afectadas en la demostración', affected:false }
  ];
  $('#request-list').innerHTML = requests.map((r,i) => `<article class="request-card"><div><h3>${r.name}</h3><p>${r.detail}</p><span class="impact ${r.affected?'':'no-impact'}">${r.affected?'⚠ ': '✓ '}${r.impact}</span></div><button class="secondary-button" data-request="${i}" type="button">Revisar solicitud</button></article>`).join('');
  $('#request-list').addEventListener('click', e => { const button=e.target.closest('[data-request]'); if(!button)return; const r=requests[Number(button.dataset.request)]; openModal('Revisar solicitud', `<p class="modal-copy"><strong>${r.name}</strong><br>${r.detail}</p><div class="modal-warning">${r.affected?'Hay una reserva confirmada que podría verse afectada. La resolución deberá ofrecer una alternativa y solicitar la aceptación del cliente antes de aplicar el cambio.':'La aprobación real requerirá permisos y validación de disponibilidad.'}</div><p class="modal-copy" style="margin-top:14px">El flujo de aprobación está pendiente de definición en las specs. Esta pantalla es solo ilustrativa.</p>`, 'Entendido', () => $('#modal').close()); });
}
function renderServices() { $('#service-list').innerHTML = services.map(s => `<div class="table-row"><strong>${safe(s.name)}</strong><span>${s.minutes} min</span><span class="muted">${safe(s.people)}</span><span class="status">Activo</span></div>`).join(''); }
function renderTeam() { $('#team-list').innerHTML = professionals.map(p => `<article class="team-card">${avatar(p)}<h3>${p.name}</h3><p>${p.role}</p><span class="tag">${p.services}</span><br><button class="secondary-button" type="button" data-team="${p.id}">Ver agenda</button></article>`).join(''); }
document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => switchPage(button.dataset.page)));
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { view=button.dataset.view; document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b===button)); renderCalendar(); }));
$('#professional-filter').innerHTML += professionals.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
$('#professional-filter').addEventListener('change', e => { filter=e.target.value; renderCalendar(); });
$('#prev-day').addEventListener('click', () => { currentDate.setDate(currentDate.getDate() + (view==='week'?-7:-1)); renderCalendar(); });
$('#next-day').addEventListener('click', () => { currentDate.setDate(currentDate.getDate() + (view==='week'?7:1)); renderCalendar(); });
$('#today').addEventListener('click', () => { currentDate=new Date(baseDate); renderCalendar(); });
$('#new-booking').addEventListener('click', newBooking);
$('#close-modal').addEventListener('click', () => $('#modal').close());
$('#cancel-modal').addEventListener('click', () => $('#modal').close());
$('#team-list').addEventListener('click', e => { const button=e.target.closest('[data-team]'); if (!button)return; filter=button.dataset.team; $('#professional-filter').value=filter; switchPage('agenda'); renderCalendar(); });
$('#calendar').addEventListener('click', e => { const button=e.target.closest('[data-booking]'); if(!button)return; const b=bookings.find(item=>String(item.id)===button.dataset.booking); if(!b)return; openModal('Detalle de reserva', `<p class="modal-copy"><strong>${safe(b.client)}</strong><br>${safe(b.service)}<br>${safe(professionals.find(p=>p.id===b.pro).name)} · ${String(b.hour).padStart(2,'0')}:00<br>Estado ilustrativo: confirmada</p><div class="modal-warning">Los cambios y cancelaciones reales requerirán validación, permisos e historial. Este prototipo no modifica la reserva desde aquí.</div>`, 'Cerrar', () => $('#modal').close()); });
renderRequests(); renderServices(); renderTeam(); renderCalendar();
