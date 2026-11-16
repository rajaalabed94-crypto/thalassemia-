export interface PalestineRegionalData {
  id: string;
  name: { en: string; ar: string };
  region: 'west_bank' | 'gaza';
  registeredCount: number;
  percentageOfTotal: number;
  hospitalRef: { en: string; ar: string };
  tpfsCenter: { en: string; ar: string };
  mosdDirectorate: { en: string; ar: string };
}

export const TPFS_2026_OFFICIAL_STATS = {
  totalRegistered: 854,
  westBankTotal: 567,
  westBankPercentage: 66.4,
  gazaTotal: 287,
  gazaPercentage: 33.6,
  age18AndUnder: 243,
  age19AndAbove: 611,
  dataYear: 2026,
  dataSourceNote: {
    en: 'According to patients registered with the Thalassemia Patients’ Friends Society – Palestine, 2026 Registry Records.',
    ar: 'بحسب المرضى المسجلين لدى جمعية أصدقاء مرضى الثلاسيميا – فلسطين، بيانات السجل لعام ٢٠٢٦.'
  }
};

export const PALESTINE_GOVERNORATES_DATA: PalestineRegionalData[] = [
  {
    id: 'nablus',
    name: { en: 'Nablus', ar: 'نابلس' },
    region: 'west_bank',
    registeredCount: 154,
    percentageOfTotal: 18.0,
    hospitalRef: { en: 'Rafidia Surgical & National Hospitals', ar: 'مستشفى رفيديا الجراحي والمستشفى الوطني' },
    tpfsCenter: { en: 'TPFS Northern Branch - Nablus', ar: 'فرع الجمعية الشمالي - نابلس' },
    mosdDirectorate: { en: 'Nablus Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - نابلس' }
  },
  {
    id: 'jenin',
    name: { en: 'Jenin', ar: 'جنين' },
    region: 'west_bank',
    registeredCount: 105,
    percentageOfTotal: 12.3,
    hospitalRef: { en: 'Khalil Suleiman Governmental Hospital', ar: 'مستشفى الشهيد خليل سليمان الحكومي' },
    tpfsCenter: { en: 'Jenin Coordination Desk', ar: 'مكتب تنسيق جنين الميداني' },
    mosdDirectorate: { en: 'Jenin Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - جنين' }
  },
  {
    id: 'hebron',
    name: { en: 'Hebron', ar: 'الخليل' },
    region: 'west_bank',
    registeredCount: 100,
    percentageOfTotal: 11.7,
    hospitalRef: { en: 'Alia Governmental Hospital - Blood Bank', ar: 'مستشفى عالية الحكومي - بنك الدم' },
    tpfsCenter: { en: 'TPFS Southern Coordination Hub', ar: 'مركز التنسيق الجنوبي لجمعية الثلاسيميا' },
    mosdDirectorate: { en: 'Hebron Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - الخليل' }
  },
  {
    id: 'tulkarm',
    name: { en: 'Tulkarm', ar: 'طولكرم' },
    region: 'west_bank',
    registeredCount: 70,
    percentageOfTotal: 8.2,
    hospitalRef: { en: 'Thabet Thabet Governmental Hospital', ar: 'مستشفى الشهيد د. ثابت ثابت الحكومي' },
    tpfsCenter: { en: 'TPFS Tulkarm Community Center', ar: 'مركز الجمعية المجتمعي - طولكرم' },
    mosdDirectorate: { en: 'Tulkarm Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - طولكرم' }
  },
  {
    id: 'ramallah',
    name: { en: 'Ramallah & Al-Bireh', ar: 'رام الله والبيرة' },
    region: 'west_bank',
    registeredCount: 67,
    percentageOfTotal: 7.8,
    hospitalRef: { en: 'Palestine Medical Complex (PMC)', ar: 'مجمع فلسطين الطبي' },
    tpfsCenter: { en: 'TPFS National Headquarters - Al-Masyoun', ar: 'المقر العام لجمعية الثلاسيميا - الماصيون' },
    mosdDirectorate: { en: 'Ramallah Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - رام الله' }
  },
  {
    id: 'bethlehem',
    name: { en: 'Bethlehem', ar: 'بيت لحم' },
    region: 'west_bank',
    registeredCount: 48,
    percentageOfTotal: 5.6,
    hospitalRef: { en: 'Beit Jala Governmental Hospital', ar: 'مستشفى بيت جالا الحكومي (الحسين)' },
    tpfsCenter: { en: 'Bethlehem Field Office', ar: 'المكتب الميداني - بيت لحم' },
    mosdDirectorate: { en: 'Bethlehem Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - بيت لحم' }
  },
  {
    id: 'qalqilya',
    name: { en: 'Qalqilya', ar: 'قلقيلية' },
    region: 'west_bank',
    registeredCount: 38,
    percentageOfTotal: 4.4,
    hospitalRef: { en: 'Darwish Nazzal Governmental Hospital', ar: 'مستشفى د. درويش نزال الحكومي' },
    tpfsCenter: { en: 'Qalqilya Volunteer Network', ar: 'شبكة المتطوعين - قلقيلية' },
    mosdDirectorate: { en: 'Qalqilya Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - قلقيلية' }
  },
  {
    id: 'tubas',
    name: { en: 'Tubas & Northern Valley', ar: 'طوباس والأغوار الشمالية' },
    region: 'west_bank',
    registeredCount: 28,
    percentageOfTotal: 3.3,
    hospitalRef: { en: 'Tubas Turkish Governmental Hospital', ar: 'مستشفى طوباس التركي الحكومي' },
    tpfsCenter: { en: 'Northern Valley Support Liaison', ar: 'منسق الأغوار الشمالية' },
    mosdDirectorate: { en: 'Tubas Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - طوباس' }
  },
  {
    id: 'salfit',
    name: { en: 'Salfit', ar: 'سلفيت' },
    region: 'west_bank',
    registeredCount: 26,
    percentageOfTotal: 3.0,
    hospitalRef: { en: 'Yasser Arafat Governmental Hospital', ar: 'مستشفى الشهيد ياسر عرفات الحكومي' },
    tpfsCenter: { en: 'Salfit Community Liaison', ar: 'منسق سلفيت وقرى الريف' },
    mosdDirectorate: { en: 'Salfit Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - سلفيت' }
  },
  {
    id: 'jericho',
    name: { en: 'Jericho & Valley', ar: 'أريحا والأغوار' },
    region: 'west_bank',
    registeredCount: 15,
    percentageOfTotal: 1.8,
    hospitalRef: { en: 'Jericho Governmental Hospital', ar: 'مستشفى أريحا الحكومي' },
    tpfsCenter: { en: 'Jericho Case Coordinator', ar: 'منسق الحالات في أريحا' },
    mosdDirectorate: { en: 'Jericho Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - أريحا' }
  },
  {
    id: 'jerusalem',
    name: { en: 'Jerusalem (Al-Quds)', ar: 'القدس الشريف' },
    region: 'west_bank',
    registeredCount: 17,
    percentageOfTotal: 2.0,
    hospitalRef: { en: 'Al-Makassed Hospital & Augusta Victoria', ar: 'مستشفى المقاصد الخيرية والمطلع' },
    tpfsCenter: { en: 'Jerusalem Advocacy & Social Desk', ar: 'مكتب القدس للمناصرة الاجتماعية' },
    mosdDirectorate: { en: 'Jerusalem Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - القدس' }
  },
  {
    id: 'gaza_north',
    name: { en: 'Gaza City & Northern Gaza', ar: 'مدينة غزة وشمال غزة' },
    region: 'gaza',
    registeredCount: 165,
    percentageOfTotal: 19.3,
    hospitalRef: { en: 'Al-Shifa & Indonesian Hospital Blood Units', ar: 'أقسام الدم في مستشفيات الشفاء والإندونيسي' },
    tpfsCenter: { en: 'TPFS Gaza Central Office', ar: 'المقر المركزي لجمعية الثلاسيميا - غزة' },
    mosdDirectorate: { en: 'Gaza Directorate of Social Development', ar: 'مديرية التنمية الاجتماعية - غزة' }
  },
  {
    id: 'gaza_south',
    name: { en: 'Khan Younis, Deir Al-Balah & Rafah', ar: 'خانيونس ودير البلح ورفح' },
    region: 'gaza',
    registeredCount: 122,
    percentageOfTotal: 14.3,
    hospitalRef: { en: 'Nasser Medical Complex & European Hospital', ar: 'مجمع ناصر الطبي والمستشفى الأوروبي' },
    tpfsCenter: { en: 'Southern Gaza Emergency Hub', ar: 'مركز طوارئ جنوب قطاع غزة' },
    mosdDirectorate: { en: 'Southern Gaza Directorates', ar: 'مديريات التنمية الاجتماعية - جنوب غزة' }
  }
];

export interface ImpactFilters {
  region: 'all' | 'west_bank' | 'gaza';
  timeframe: 'this_month' | 'this_year' | 'all_time';
}

export function filterImpactMetrics(filters: ImpactFilters) {
  let baseMultiplier = 1;
  if (filters.region === 'west_bank') baseMultiplier = 0.66;
  if (filters.region === 'gaza') baseMultiplier = 0.34;

  let timeMultiplier = 1;
  if (filters.timeframe === 'this_month') timeMultiplier = 0.18;
  if (filters.timeframe === 'this_year') timeMultiplier = 0.72;

  const factor = baseMultiplier * timeMultiplier;

  return {
    supportRequests: Math.round(185 * factor),
    assessmentsCompleted: Math.round(146 * factor),
    referralsDelivered: Math.round(129 * factor),
    activeServices: Math.round(112 * factor),
    economicEmpowermentProjects: Math.max(1, Math.round(28 * factor))
  };
}
