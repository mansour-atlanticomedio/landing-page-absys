import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { vus: 4, duration: '30s' };

if (!__ENV.BASE_URL) throw new Error('Falta BASE_URL');

export default function () {
    const res = http.get(`${__ENV.BASE_URL}`);
    check(res, { 'status 200': (r) => r.status === 200 });
    sleep(1);
}

/*

# Comando de ejecucion

docker run --rm -i --network landing-page-absys_default \
  -e BASE_URL=http://172.26.0.200:8085/biblioteca \
  grafana/k6 run - < k6/smoke.js

  Alternativo

  docker run --rm -i --network host \
  -e BASE_URL=http://host.docker.internal:8085 \
  grafana/k6 run - < smoke.js


*/