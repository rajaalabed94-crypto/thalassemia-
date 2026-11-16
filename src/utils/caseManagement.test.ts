import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  generateTrackingCode, 
  isValidTransition, 
  createNewRequest 
} from './caseManagement';

test('generateTrackingCode produces valid THAL-2026-XXXXX format', () => {
  const code = generateTrackingCode();
  assert.match(code, /^THAL-2026-\d{5}$/);
});

test('isValidTransition validates sequential status progression', () => {
  assert.equal(isValidTransition('submitted', 'under_review'), true);
  assert.equal(isValidTransition('under_review', 'under_assessment'), true);
  assert.equal(isValidTransition('under_assessment', 'referred_to_service'), true);
  assert.equal(isValidTransition('referred_to_service', 'service_active'), true);
  assert.equal(isValidTransition('service_active', 'service_delivered'), true);
  assert.equal(isValidTransition('service_delivered', 'in_followup'), true);
});

test('createNewRequest populates default values and tracking code', () => {
  const req = createNewRequest({
    fullName: 'Ahmad Khalil',
    phone: '0599123456',
    governorate: 'Jenin',
    locality: 'Jenin Camp',
    applicantRole: 'parent_guardian',
    patientAge: 7,
    primaryNeed: 'social_protection',
    urgencyLevel: 'urgent',
    preferredContact: 'whatsapp',
    notes: 'Needs help with transportation to hospital'
  });

  assert.equal(req.fullName, 'Ahmad Khalil');
  assert.equal(req.status, 'submitted');
  assert.match(req.trackingCode, /^THAL-2026-\d{5}$/);
  assert.equal(req.statusHistory.length, 1);
});
