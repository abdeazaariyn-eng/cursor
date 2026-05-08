export interface Review {
  name: string
  text: string
  stars: number
}

export interface Faq {
  q: string
  a: string
}

export interface Product {
  id: string
  slug: string
  arabicName: string
  shortName: string
  cardHeading: string
  cardSubheading: string
  heroHeading: string
  heroSubheading: string
  emotionalHook: string
  painHeading: string
  badge: string
  badges: string[]
  benefits: string[]
  proofBlocks: string[]
  reviews: Review[]
  faqs: Faq[]
  crossSellPriority: string[]
  image: string
  filterTags: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'baby_head_protection_mask',
    slug: 'baby-head-protection-mask',
    arabicName: 'قناع الحماية الناعم لرأس الأطفال',
    shortName: 'قناع الحماية',
    cardHeading: 'راحة أكثر وأنتِ تشوفين طفلك يتعلم الحركة',
    cardSubheading:
      'قناع ناعم يساعد يحمي رأس الطفل أثناء الزحف، الوقوف، وبدايات المشي داخل البيت.',
    heroHeading: 'راحة أكثر وأنتِ تشوفين طفلك يتعلم الحركة',
    heroSubheading:
      'قناع ناعم يساعد يحمي رأس الطفل أثناء الزحف، الوقوف، وبدايات المشي داخل البيت.',
    emotionalHook:
      'كل أم تعرف لحظة الخوف لما الطفل يتحرك فجأة. هذا المنتج يعطيك طبقة طمأنينة إضافية بدون ما يضايق طفلك.',
    painHeading: 'أول خطواته جميلة... بس تخوف',
    badge: 'الأكثر طلباً',
    badges: ['للطفل', 'بدايات الحركة', 'هدايا'],
    filterTags: ['للطفل', 'هدايا'],
    benefits: [
      'ناعم وخفيف على رأس الطفل.',
      'مناسب لمرحلة الزحف وبدايات الوقوف.',
      'يقلل القلق من الصدمات اليومية داخل البيت.',
      'تصميم لطيف ومريح للتصوير والاستخدام اليومي.',
      'هدية عملية للأمهات الجدد.',
    ],
    proofBlocks: [
      'مختار لمرحلة الحركة الأولى عند الأطفال.',
      'يركز على النعومة والراحة لأن الطفل يرفض أي شيء مزعج.',
      'مناسب للاستخدام تحت إشراف الأم داخل المنزل.',
    ],
    reviews: [
      {
        name: 'أم ع.',
        text: 'كنت أخاف من كل حركة، الحين صرت أهدأ وهو يلعب قدامي.',
        stars: 5,
      },
      {
        name: 'م. الشمري',
        text: 'خفيف وما ضايق ولدي، وحلو شكله بالصور.',
        stars: 5,
      },
      {
        name: 'أم عبدالله',
        text: 'طلبت قطعتين، وحدة عندي ووحدة عند أمي لأن الطفل يقعد عندها كثير.',
        stars: 5,
      },
    ],
    faqs: [
      {
        q: 'لأي عمر مناسب؟',
        a: 'مناسب لمرحلة الزحف وبدايات المشي، عادة من 6 أشهر إلى سنتين حسب حجم الطفل.',
      },
      {
        q: 'كيف يُنظَّف؟',
        a: 'يُغسل بالماء البارد والصابون اللطيف، ويُترك يجف في الهواء بعيداً عن أشعة الشمس المباشرة.',
      },
      {
        q: 'هل يضايق الطفل؟',
        a: 'مصمم ليكون ناعم وخفيف على الرأس، لكن يُنصح باستخدامه تحت إشراف الأم دائماً.',
      },
      {
        q: 'هل يمكن استخدامه هدية؟',
        a: 'نعم، هو هدية عملية وجميلة للأمهات الجدد وتُغلَّف بشكل مرتب.',
      },
    ],
    crossSellPriority: ['portable_baby_bottle_warmer', 'wearable_electric_breast_pump'],
    image: '/images/products/head-protection.webp',
  },
  {
    id: 'portable_baby_bottle_warmer',
    slug: 'portable-baby-bottle-warmer',
    arabicName: 'جهاز تدفئة زجاجات حليب الأطفال المحمول',
    shortName: 'دفاية الزجاجات',
    cardHeading: 'حليب دافئ لطفلك حتى وأنتِ برا البيت',
    cardSubheading:
      'دفاية زجاجات محمولة تساعدك تحافظين على روتين الرضاعة بدون توتر في السيارة، الزيارات، أو السفر.',
    heroHeading: 'حليب دافئ لطفلك حتى وأنتِ برا البيت',
    heroSubheading:
      'دفاية زجاجات محمولة تساعدك تحافظين على روتين الرضاعة بدون توتر في السيارة، الزيارات، أو السفر.',
    emotionalHook:
      'طلعة قصيرة ممكن تصير مربكة إذا وقت الرضاعة جاء والحليب بارد. هذا المنتج يخلي الروتين أسهل وأهدأ.',
    painHeading: 'وقت الرضعة ما ينتظر',
    badge: 'الأكثر مبيعاً',
    badges: ['للطلعات', 'للطفل', 'هدايا'],
    filterTags: ['للطفل', 'للطلعات', 'هدايا'],
    benefits: [
      'مناسب للسيارة والطلعات والزيارات.',
      'يساعدك تجهزين الرضعة براحة أكثر.',
      'يقلل الاعتماد على طلب ماء حار من الخارج.',
      'تصميم محمول وسهل التخزين في شنطة الطفل.',
      'خيار ممتاز كهدية للأم الجديدة.',
    ],
    proofBlocks: [
      'مصمم لفكرة الروتين المرن خارج المنزل.',
      'يناسب الأمهات اللي يتحركون كثير بين البيت، السيارة، والزيارات.',
      'يقلل لخبطة الرضاعة وقت الطلعات.',
    ],
    reviews: [
      {
        name: 'أم فهد',
        text: 'فرق معي في الزيارات، ما عاد أتوتر إذا جاع البيبي.',
        stars: 5,
      },
      {
        name: 'ن. العتيبي',
        text: 'أخليها في شنطة الطفل، من أكثر الأشياء اللي أستخدمها برا البيت.',
        stars: 5,
      },
      {
        name: 'أم سلطان',
        text: 'طلبتها هدية لأختي بعد ما جربتها لنفسي.',
        stars: 5,
      },
    ],
    faqs: [
      {
        q: 'هل تناسب كل الزجاجات؟',
        a: 'تناسب معظم الزجاجات القياسية. راجعي المواصفات المرفقة مع المنتج للتأكد من التوافق.',
      },
      {
        q: 'كيف تُشحن؟',
        a: 'راجعي تعليمات المنتج المرفقة لطريقة الشحن المناسبة وأوقات الشحن.',
      },
      {
        q: 'كيف تُنظَّف؟',
        a: 'امسحيها بقماش رطب ناعم وجافيها، لا تغمريها بالماء لحماية الأجزاء الداخلية.',
      },
      {
        q: 'هل يناسبها السفر الطويل؟',
        a: 'نعم، مصمم للتنقل ويناسب الرحلات القصيرة والزيارات اليومية.',
      },
    ],
    crossSellPriority: ['baby_head_protection_mask', 'wearable_electric_breast_pump'],
    image: '/images/products/bottle-warmer.webp',
  },
  {
    id: 'wearable_electric_breast_pump',
    slug: 'wearable-electric-breast-pump',
    arabicName: 'مضخة ثدي كهربائية جديدة قابلة للارتداء',
    shortName: 'مضخة الثدي',
    cardHeading: 'شفط أسهل وخصوصية أكثر في يومك',
    cardSubheading:
      'مضخة قابلة للارتداء تساعد الأم تنظم وقتها وتتحرك براحة أكبر أثناء الروتين اليومي.',
    heroHeading: 'شفط أسهل وخصوصية أكثر في يومك',
    heroSubheading:
      'مضخة قابلة للارتداء تساعد الأم تنظم وقتها وتتحرك براحة أكبر أثناء الروتين اليومي.',
    emotionalHook:
      'الأم تحتاج راحة وخصوصية، مو جهاز يربطها في مكان واحد. هذه المضخة تعطيك حرية أكثر في وقت حساس من يومك.',
    painHeading: 'وقتك وراحتك مهمين مثل راحة طفلك',
    badge: 'جديد',
    badges: ['للأم', 'هدايا'],
    filterTags: ['للأم', 'هدايا'],
    benefits: [
      'قابلة للارتداء تحت الملابس المناسبة.',
      'تساعد على الحركة داخل البيت أثناء الاستخدام.',
      'مناسبة للأمهات المشغولات أو العائدات للعمل.',
      'تجربة أكثر خصوصية وهدوء.',
      'خيار عملي للأم المرضعة.',
    ],
    proofBlocks: [
      'تركز على الخصوصية والمرونة بدلا من جلسات الشفط المتعبة.',
      'اختيار مناسب للأم اللي تحتاج تنظم وقتها بدون ضغط.',
      'استخدميها حسب إرشادات المنتج ونظافة التعقيم.',
    ],
    reviews: [
      {
        name: 'أم ريم',
        text: 'أكثر شيء حبيته إني أقدر أتحرك وما أحس إني مقيدة.',
        stars: 5,
      },
      {
        name: 'د. الزهراني',
        text: 'ساعدتني أنظم وقتي قبل الدوام.',
        stars: 5,
      },
      {
        name: 'أم يوسف',
        text: 'طلبت قطعتين لأن وجود وحدة احتياط يريحني.',
        stars: 5,
      },
    ],
    faqs: [
      {
        q: 'كيف تُنظَّف وتُعقَّم؟',
        a: 'راجعي دليل المنتج لتعليمات التنظيف والتعقيم. النظافة المنتظمة ضرورية للاستخدام الآمن.',
      },
      {
        q: 'هل هي صاخبة؟',
        a: 'مصممة لتكون هادئة نسبياً للخصوصية مقارنة بالمضخات التقليدية.',
      },
      {
        q: 'هل تناسب كل الأمهات؟',
        a: 'راجعي المقاسات المتوفرة. إذا عندك أسئلة طبية خاصة استشيري طبيبتك.',
      },
      {
        q: 'كيف أحفظ الحليب؟',
        a: 'استخدمي أكياس أو حاويات التخزين المعقمة المخصصة لحليب الأم واحفظيها في الثلاجة أو الفريزر.',
      },
    ],
    crossSellPriority: ['portable_baby_bottle_warmer', 'baby_head_protection_mask'],
    image: '/images/products/breast-pump.webp',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getCrossSells(currentProductId: string): Product[] {
  const product = getProductById(currentProductId)
  if (!product) return []
  return product.crossSellPriority
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p))
}

export function getUpsellProduct(cartProductIds: string[]): Product | undefined {
  for (const p of PRODUCTS) {
    if (!cartProductIds.includes(p.id)) return p
  }
  return PRODUCTS.find((p) => p.id !== 'wearable_electric_breast_pump') || PRODUCTS[0]
}
