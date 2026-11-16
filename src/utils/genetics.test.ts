import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGeneticProbability } from './genetics';

test('Carrier + Carrier yields 25% affected, 50% carrier, 25% healthy', () => {
  const result = calculateGeneticProbability('carrier', 'carrier');
  assert.equal(result.affected, 25);
  assert.equal(result.carrier, 50);
  assert.equal(result.healthy, 25);
  assert.equal(result.riskLevel, 'high_risk');
});

test('Carrier + Healthy yields 0% affected, 50% carrier, 50% healthy', () => {
  const result = calculateGeneticProbability('carrier', 'healthy');
  assert.equal(result.affected, 0);
  assert.equal(result.carrier, 50);
  assert.equal(result.healthy, 50);
  assert.equal(result.riskLevel, 'carrier_only');
});

test('Affected + Healthy yields 100% healthy carriers, 0% affected', () => {
  const result = calculateGeneticProbability('affected', 'healthy');
  assert.equal(result.affected, 0);
  assert.equal(result.carrier, 100);
  assert.equal(result.healthy, 0);
});

test('Healthy + Healthy yields 100% healthy, 0% risk', () => {
  const result = calculateGeneticProbability('healthy', 'healthy');
  assert.equal(result.affected, 0);
  assert.equal(result.carrier, 0);
  assert.equal(result.healthy, 100);
  assert.equal(result.riskLevel, 'no_risk');
});
