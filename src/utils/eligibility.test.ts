import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEligibility } from './eligibility';

test('evaluateEligibility identifies non-affected family correctly', () => {
  const result = evaluateEligibility({
    hasFamilyMemberWithThalassemia: false,
    patientAgeRange: 'child_under_12',
    monthlyIncomeStatus: 'severely_vulnerable',
    facingEmotionalPressure: false,
    transportationDifficulty: false,
    needsVocationalHelp: false,
    governorate: 'Ramallah'
  });

  assert.equal(result.isEligible, false);
  assert.equal(result.priorityTier, 'standard');
});

test('evaluateEligibility marks severely vulnerable affected family as high priority with social protection', () => {
  const result = evaluateEligibility({
    hasFamilyMemberWithThalassemia: true,
    patientAgeRange: 'child_under_12',
    monthlyIncomeStatus: 'severely_vulnerable',
    facingEmotionalPressure: true,
    transportationDifficulty: true,
    needsVocationalHelp: true,
    governorate: 'Hebron'
  });

  assert.equal(result.isEligible, true);
  assert.equal(result.priorityTier, 'high_priority');
  assert.ok(result.priorityScore >= 70);
  assert.ok(result.matchedServices.includes('social_protection'));
  assert.ok(result.matchedServices.includes('psychosocial'));
  assert.ok(result.matchedServices.includes('referrals'));
  assert.ok(result.matchedServices.includes('economic_empowerment'));
  assert.ok(result.matchedServices.includes('case_management'));
  assert.ok(result.recommendedSteps.length >= 4);
});

test('evaluateEligibility matches adult patient with vocational need', () => {
  const result = evaluateEligibility({
    hasFamilyMemberWithThalassemia: true,
    patientAgeRange: 'adult_18_plus',
    monthlyIncomeStatus: 'moderate',
    facingEmotionalPressure: false,
    transportationDifficulty: false,
    needsVocationalHelp: true,
    governorate: 'Nablus'
  });

  assert.equal(result.isEligible, true);
  assert.ok(result.matchedServices.includes('economic_empowerment'));
  assert.ok(result.matchedServices.includes('case_management'));
});
