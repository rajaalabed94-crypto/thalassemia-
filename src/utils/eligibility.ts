import { EligibilityAnswers, EligibilityEvaluation, ServiceCategory } from '../types';

/**
 * Evaluates a family's eligibility for social protection, psychosocial,
 * and economic support through the MoSD and TPFS joint program.
 */
export function evaluateEligibility(answers: EligibilityAnswers): EligibilityEvaluation {
  // If no family member has thalassemia, the specialized program isn't applicable,
  // but standard social solidarity pathways still exist.
  if (!answers.hasFamilyMemberWithThalassemia) {
    return {
      isEligible: false,
      priorityScore: 10,
      priorityTier: 'standard',
      matchedServices: ['case_management'],
      recommendedSteps: [
        {
          en: 'Confirm clinical diagnosis with your regional health clinic or Thalassemia Society center.',
          ar: 'تأكيد التشخيص الطبي لدى العيادة الصحية أو مركز جمعية أصدقاء مرضى الثلاسيميا.'
        },
        {
          en: 'Inquire about general MoSD social assistance programs at your local directorate.',
          ar: 'الاستفسار عن برامج المساعدات الاجتماعية العامة لوزارة التنمية الاجتماعية في مديريتكم.'
        }
      ],
      assessmentSummary: {
        en: 'This specialized campaign is specifically tailored for families with a member living with thalassemia.',
        ar: 'هذه الحملة المتخصصة مخصصة بشكل رئيسي للأسر التي تضم فرداً مصاباً بالثلاسيميا.'
      }
    };
  }

  let score = 30; // Baseline for confirmed thalassemia condition
  const matchedServices: ServiceCategory[] = ['case_management'];

  // Income vulnerability weighting
  if (answers.monthlyIncomeStatus === 'severely_vulnerable') {
    score += 40;
    matchedServices.push('social_protection');
  } else if (answers.monthlyIncomeStatus === 'unstable_low') {
    score += 25;
    matchedServices.push('social_protection');
  } else if (answers.monthlyIncomeStatus === 'moderate') {
    score += 10;
  }

  // Emotional & psychological burden
  if (answers.facingEmotionalPressure) {
    score += 15;
    matchedServices.push('psychosocial');
  }

  // Referrals / transportation difficulty (social logistics and referral pathways)
  if (answers.transportationDifficulty) {
    score += 15;
    matchedServices.push('referrals');
  }

  // Economic empowerment & youth/parent vocational interest
  if (answers.needsVocationalHelp) {
    score += 10;
    matchedServices.push('economic_empowerment');
  }

  // Age group specific guidance
  if (answers.patientAgeRange === 'child_under_12') {
    score += 5;
    if (!matchedServices.includes('psychosocial')) {
      matchedServices.push('psychosocial');
    }
  }

  // Normalize score to max 100
  const normalizedScore = Math.min(100, score);

  let priorityTier: 'high_priority' | 'medium_priority' | 'standard' = 'standard';
  if (normalizedScore >= 70) {
    priorityTier = 'high_priority';
  } else if (normalizedScore >= 45) {
    priorityTier = 'medium_priority';
  }

  // Generate personalized steps
  const steps: Array<{ en: string; ar: string }> = [];

  steps.push({
    en: 'Submit a confidential support request with your preferred communication method.',
    ar: 'تقديم طلب دعم سري وسريع مع اختيار وسيلة التواصل المفضلة لديك.'
  });

  if (matchedServices.includes('social_protection')) {
    steps.push({
      en: 'A dedicated MoSD social worker will schedule a dignified social and economic assessment.',
      ar: 'يقوم أخصائي اجتماعي مخصص من وزارة التنمية بجدولة تقييم احتياجات اجتماعي واقتصادي بكل كرامة.'
    });
  }

  if (matchedServices.includes('psychosocial')) {
    steps.push({
      en: 'Connect with a certified counselor from the Thalassemia Patients’ Friends Society for family support.',
      ar: 'التواصل مع مستشار نفسي معتمد من جمعية أصدقاء مرضى الثلاسيميا لدعم المريض والأسرة.'
    });
  }

  if (matchedServices.includes('referrals')) {
    steps.push({
      en: 'Coordinate specialized social referrals and logistics with the nearest directorate.',
      ar: 'تنسيق الإحالة لمسارات الدعم والمواصلات ومتابعة الحالة مع أقرب مديرية أو فرع.'
    });
  }

  if (matchedServices.includes('economic_empowerment')) {
    steps.push({
      en: 'Explore vocational training and micro-enterprise grant eligibility for patients or caregivers.',
      ar: 'استكشاف فرص التدريب المهني والمنح الصغيرة للتمكين الاقتصادي للمريض أو المعيل.'
    });
  }

  const summary = {
    en: priorityTier === 'high_priority'
      ? 'Your family qualifies as a high-priority beneficiary for immediate social safety net and case management support.'
      : 'Your family is eligible for tailored social services, psychosocial support, and specialized referrals.',
    ar: priorityTier === 'high_priority'
      ? 'أسرتكم مؤهلة بأولوية مرتفعة للاستفادة العاجلة من شبكة الحماية الاجتماعية وخدمات إدارة الحالة.'
      : 'أسرتكم مؤهلة للاستفادة من باقة الخدمات الاجتماعية والدعم النفسي والإحالات المتخصصة.'
  };

  return {
    isEligible: true,
    priorityScore: normalizedScore,
    priorityTier,
    matchedServices: Array.from(new Set(matchedServices)),
    recommendedSteps: steps,
    assessmentSummary: summary
  };
}
