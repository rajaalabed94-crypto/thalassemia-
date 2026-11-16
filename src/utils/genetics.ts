export type ParentalGeneticStatus = 'carrier' | 'healthy' | 'affected';

export interface GeneticOffspringProbability {
  affected: number;   // Percentage (0-100)
  carrier: number;    // Percentage (0-100)
  healthy: number;    // Percentage (0-100)
  riskLevel: 'high_risk' | 'carrier_only' | 'no_risk';
  summary: {
    en: string;
    ar: string;
  };
}

/**
 * Calculates offspring thalassemia genetic probabilities based on autosomal recessive inheritance.
 */
export function calculateGeneticProbability(
  parent1: ParentalGeneticStatus,
  parent2: ParentalGeneticStatus
): GeneticOffspringProbability {
  // Carrier + Carrier (Autosomal Recessive classic 1:2:1)
  if (parent1 === 'carrier' && parent2 === 'carrier') {
    return {
      affected: 25,
      carrier: 50,
      healthy: 25,
      riskLevel: 'high_risk',
      summary: {
        en: 'Both parents are carriers: In each pregnancy, there is a 25% chance of an affected child, 50% carrier, and 25% healthy non-carrier.',
        ar: 'كلا الوالدين يحملان الصفة الوراثية: في كل حمل هناك احتمال ٢٥٪ لإنجاب طفل مصاب بالثلاسيميا، و٥٠٪ حامل للصفة، و٢٥٪ سليم تماماً.'
      }
    };
  }

  // Carrier + Healthy
  if (
    (parent1 === 'carrier' && parent2 === 'healthy') ||
    (parent1 === 'healthy' && parent2 === 'carrier')
  ) {
    return {
      affected: 0,
      carrier: 50,
      healthy: 50,
      riskLevel: 'carrier_only',
      summary: {
        en: 'One parent is a carrier and one is healthy: Zero chance of an affected child (0%). 50% chance of healthy carrier, 50% healthy non-carrier.',
        ar: 'أحد الوالدين حامل للصفة والآخر سليم: احتمال إنجاب طفل مصاب هو صفر٪. ٥٠٪ احتمال أن يكون الطفل حاملاً للصفة دون أعراض، و٥٠٪ سليم تماماً.'
      }
    };
  }

  // Affected + Healthy
  if (
    (parent1 === 'affected' && parent2 === 'healthy') ||
    (parent1 === 'healthy' && parent2 === 'affected')
  ) {
    return {
      affected: 0,
      carrier: 100,
      healthy: 0,
      riskLevel: 'carrier_only',
      summary: {
        en: 'One parent is affected and one is healthy non-carrier: All children (100%) will be healthy carriers of the trait, with 0% affected.',
        ar: 'أحد الوالدين مصاب والآخر سليم غير حامل: جميع الأبناء (١٠٠٪) سيكونون حاملين للصفة بصحة ممتازة، مع احتمال صفر٪ للإصابة بالمرض.'
      }
    };
  }

  // Affected + Carrier
  if (
    (parent1 === 'affected' && parent2 === 'carrier') ||
    (parent1 === 'carrier' && parent2 === 'affected')
  ) {
    return {
      affected: 50,
      carrier: 50,
      healthy: 0,
      riskLevel: 'high_risk',
      summary: {
        en: 'One parent is affected and one is a carrier: 50% chance of an affected child, and 50% chance of a carrier.',
        ar: 'أحد الوالدين مصاب والآخر حامل للصفة: احتمال ٥٠٪ لإنجاب طفل مصاب، و٥٠٪ حامل للصفة.'
      }
    };
  }

  // Affected + Affected
  if (parent1 === 'affected' && parent2 === 'affected') {
    return {
      affected: 100,
      carrier: 0,
      healthy: 0,
      riskLevel: 'high_risk',
      summary: {
        en: 'Both parents are affected: 100% of children will have thalassemia.',
        ar: 'كلا الوالدين مصابان بالمرض: جميع الأبناء (١٠٠٪) سيكونون مصابين بالثلاسيميا.'
      }
    };
  }

  // Healthy + Healthy
  return {
    affected: 0,
    carrier: 0,
    healthy: 100,
    riskLevel: 'no_risk',
    summary: {
      en: 'Both parents are healthy non-carriers: 100% of children will be completely healthy non-carriers.',
      ar: 'كلا الوالدين سليمين تماماً: جميع الأبناء (١٠٠٪) سيكونون أصحاء غير حاملين للصفة.'
    }
  };
}
