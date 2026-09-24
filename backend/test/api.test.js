/**
 * Comprehensive API & Service Test Suite
 * Validates all backend endpoints, data flows, and fallbacks.
 */

const http = require('http');
const app = require('../server');

let server;
const PORT = 5001; // test port
const BASE_URL = `http://127.0.0.1:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n🚀 Starting Virtual Health Assistant Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Root Ping
    const rootRes = await request('GET', '/');
    assert(rootRes.status === 200 && rootRes.body.status === 'online', 'GET / returns online status');

    // 2. Health Check
    const healthRes = await request('GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'healthy', 'GET /api/health returns healthy');

    // 3. System Info
    const infoRes = await request('GET', '/api/health/info');
    assert(infoRes.status === 200 && infoRes.body.statistics.totalDoctors > 0, 'GET /api/health/info returns doctor catalog stats');

    // 4. Symptoms Catalog
    const catalogRes = await request('GET', '/api/symptoms/catalog');
    assert(catalogRes.status === 200 && catalogRes.body.data.commonSymptoms.length > 10, 'GET /api/symptoms/catalog returns symptoms list');

    // 5. Symptoms Conditions
    const conditionsRes = await request('GET', '/api/symptoms/conditions');
    assert(conditionsRes.status === 200 && conditionsRes.body.data.length > 20, 'GET /api/symptoms/conditions returns conditions');

    // 6. Test Suggestions for Condition
    const testRes = await request('GET', '/api/symptoms/tests/migraine');
    assert(testRes.status === 200 && testRes.body.data.tests.length > 0, 'GET /api/symptoms/tests/:condition returns diagnostic tests');

    // 7. Symptom Assessment (POST)
    console.log('  ⏳ Testing symptom assessment (AI + fallback)...');
    const assessRes = await request('POST', '/api/symptoms/assess', {
      symptoms: 'severe throbbing one-sided headache with nausea and light sensitivity'
    });
    assert(
      assessRes.status === 200 &&
      assessRes.body.data.conditions.length > 0 &&
      assessRes.body.data.conditions[0].likelihood > 0 &&
      assessRes.body.data.conditions[0].prescribedPlan != null,
      'POST /api/symptoms/assess returns conditions with prescribed care plan'
    );

    // 8. Doctors Listing & Filter
    const doctorsRes = await request('GET', '/api/doctors?specialty=Cardiologist');
    assert(doctorsRes.status === 200 && doctorsRes.body.data.length > 0, 'GET /api/doctors filters by specialty');

    // 9. Doctor by ID
    const docRes = await request('GET', '/api/doctors/1');
    assert(docRes.status === 200 && docRes.body.data.name === 'Dr. Priya Sharma', 'GET /api/doctors/1 returns Dr. Priya Sharma');

    // 10. Doctor Specialties
    const specRes = await request('GET', '/api/doctors/specialties');
    assert(specRes.status === 200 && specRes.body.data.length > 3, 'GET /api/doctors/specialties returns specialties list');

    // 11. Doctor Slots Check
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const slotsRes = await request('GET', `/api/doctors/1/slots?date=${dateStr}`);
    assert(slotsRes.status === 200 && slotsRes.body.data.slots.length > 0, 'GET /api/doctors/1/slots returns slot availability');

    // 12. Doctor Search
    const searchRes = await request('POST', '/api/doctors/search', {
      area: 'Indirapuram'
    });
    assert(searchRes.status === 200 && searchRes.body.data.length > 0, 'POST /api/doctors/search finds doctors in Indirapuram');

    // 13. Book Appointment
    const bookingRes = await request('POST', '/api/appointments', {
      doctorId: '1',
      doctorName: 'Dr. Priya Sharma',
      patientName: 'Test Patient',
      patientPhone: '+91 99999 88888',
      patientEmail: 'test@example.com',
      date: dateStr,
      timeSlot: '10:00 AM',
      symptoms: 'Mild chest discomfort after walking'
    });
    assert(
      bookingRes.status === 201 &&
      bookingRes.body.data.id.startsWith('VHA-') &&
      bookingRes.body.data.status === 'confirmed',
      'POST /api/appointments confirms booking and generates reference code'
    );
    const createdAppointmentId = bookingRes.body.data?.id;

    // 14. Verify Double-Booking Prevention
    const doubleBookRes = await request('POST', '/api/appointments', {
      doctorId: '1',
      doctorName: 'Dr. Priya Sharma',
      patientName: 'Another Patient',
      patientPhone: '+91 91111 22222',
      date: dateStr,
      timeSlot: '10:00 AM'
    });
    assert(
      doubleBookRes.status === 409,
      'POST /api/appointments prevents double-booking on same slot and date'
    );

    // 15. Retrieve Appointment by ID
    if (createdAppointmentId) {
      const getApptRes = await request('GET', `/api/appointments/${createdAppointmentId}`);
      assert(
        getApptRes.status === 200 && getApptRes.body.data.patientName === 'Test Patient',
        'GET /api/appointments/:id retrieves booked appointment'
      );

      // 16. Cancel Appointment
      const cancelRes = await request('PATCH', `/api/appointments/${createdAppointmentId}/cancel`, {
        reason: 'Patient recovered'
      });
      assert(
        cancelRes.status === 200 && cancelRes.body.data.status === 'cancelled',
        'PATCH /api/appointments/:id/cancel successfully marks appointment cancelled'
      );
    }

    // 17. Virtual Doctor Chat
    console.log('  ⏳ Testing Virtual Doctor conversational chat...');
    const chatRes = await request('POST', '/api/chat', {
      message: 'Hello Dr. Patel, what should I eat when I have an upset stomach?'
    });
    assert(
      chatRes.status === 200 &&
      chatRes.body.data.reply &&
      chatRes.body.data.reply.length > 20,
      'POST /api/chat receives clinical conversational response from Dr. Patel'
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    console.log(`\n======================================================`);
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Start test server
server = app.listen(PORT, '127.0.0.1', () => {
  runTests();
});
