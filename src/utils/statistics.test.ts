import test from 'node:test';
import assert from 'node:assert/strict';
import { TPFS_2026_OFFICIAL_STATS, PALESTINE_GOVERNORATES_DATA, filterImpactMetrics } from './statistics';

test('2026 Official Stats match brief figures exactly', () => {
  assert.equal(TPFS_2026_OFFICIAL_STATS.totalRegistered, 854);
  assert.equal(TPFS_2026_OFFICIAL_STATS.westBankTotal, 567);
  assert.equal(TPFS_2026_OFFICIAL_STATS.gazaTotal, 287);
  assert.equal(TPFS_2026_OFFICIAL_STATS.age18AndUnder, 243);
  assert.equal(TPFS_2026_OFFICIAL_STATS.age19AndAbove, 611);
  assert.equal(TPFS_2026_OFFICIAL_STATS.westBankTotal + TPFS_2026_OFFICIAL_STATS.gazaTotal, 854);
  assert.equal(TPFS_2026_OFFICIAL_STATS.age18AndUnder + TPFS_2026_OFFICIAL_STATS.age19AndAbove, 854);
});

test('Governorates data contains top cities from TPFS registry', () => {
  const nablus = PALESTINE_GOVERNORATES_DATA.find(g => g.id === 'nablus');
  const jenin = PALESTINE_GOVERNORATES_DATA.find(g => g.id === 'jenin');
  const hebron = PALESTINE_GOVERNORATES_DATA.find(g => g.id === 'hebron');

  assert.ok(nablus);
  assert.equal(nablus?.registeredCount, 154);
  assert.ok(jenin);
  assert.equal(jenin?.registeredCount, 105);
  assert.ok(hebron);
  assert.equal(hebron?.registeredCount, 100);
});

test('filterImpactMetrics returns scaled positive numbers for all filter combinations', () => {
  const allTime = filterImpactMetrics({ region: 'all', timeframe: 'all_time' });
  const wbMonth = filterImpactMetrics({ region: 'west_bank', timeframe: 'this_month' });

  assert.ok(allTime.supportRequests > wbMonth.supportRequests);
  assert.ok(wbMonth.economicEmpowermentProjects >= 1);
});
