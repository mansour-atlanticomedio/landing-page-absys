import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE = __ENV.BASE_URL;
if (!BASE) throw new Error('Falta BASE_URL');

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // calentamiento
    { duration: '2m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '3m', target: 200 },
    { duration: '3m', target: 300 },
    { duration: '3m', target: 400 },
    { duration: '3m', target: 500 },  // objetivo
    { duration: '4m', target: 500 },  // mantener en 500
    { duration: '1m', target: 0 },    // bajada
  ],
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true }],
    http_req_duration: [
      'p(95)<1000',
      { threshold: 'p(95)<3000', abortOnFail: true, delayAbortEval: '1m' },
    ],
  },
};

const ok = (res) => check(res, { 'status 200': (r) => r.status === 200 });
const pausa = () => sleep(Math.random() * 4 + 2);

export default function () {
  group('inicio', () => ok(http.get(BASE)));
  pausa();
  group('servicios', () => ok(http.get(`${BASE}/servicios`)));
  pausa();
  group('horarios', () => ok(http.get(`${BASE}/conocenos/horarios-ubicacion-y-contacto`)));
  pausa();
  // login: solo si el curl confirma que NO redirige al campus
  group('login', () => ok(http.get(`${BASE}/login`, { redirects: 0 })));
  pausa();
}