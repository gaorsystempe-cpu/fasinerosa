import { Product, CategoryId } from '../types';

export const COMMON_EXTRAS = [
  { id: 'chifles', name: 'Porción de Chifles Piuranos Artesanales', price: 6 },
  { id: 'zarza', name: 'Zarza Criolla con Ají Limo y Culantro', price: 4 },
  { id: 'cancha', name: 'Cancha Chulpi Tostada y Salada', price: 4 },
  { id: 'yuca_frita', name: 'Yuca Frita Crocante', price: 7 },
  { id: 'carne_extra', name: 'Porción Extra de Carne Aliñada', price: 14 },
  { id: 'mariscos_extra', name: 'Porción Extra de Mariscos Salteados', price: 16 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'seco-chabelo',
    name: 'Seco de Chabelo',
    category: 'insignias',
    price: 49,
    description: 'El plato insignia de las picanterías piuranas. A base de plátano verde "majado" al batán, aderezado con sofrito criollo, chicha de jora y culantro fresco, entreverado con abundante carne de res aliñada jugosa y cancha chulpi.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: 'Plato Insignia',
    isPopular: true,
    isSpicy: false,
    prepTime: '20-25 min',
    portions: '1-2 personas',
    availableExtras: [
      { id: 'chifles', name: 'Porción de Chifles Piuranos', price: 6 },
      { id: 'zarza', name: 'Zarza Criolla Extra', price: 4 },
      { id: 'carne_extra', name: 'Extra Carne Aliñada', price: 14 },
    ]
  },
  {
    id: 'majado-yuca-chancho',
    name: 'Majado de Yuca con Chancho',
    category: 'insignias',
    price: 49,
    description: 'Yuca norteña "majada" a mano, aderezada con ajos dorados y cebolla china fresca, coronada con generosos trozos de chancho frito crocante al estilo piurano, cancha chulpi tostada y sarza criolla.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorito del Fogón',
    isPopular: true,
    isSpicy: false,
    prepTime: '20-25 min',
    portions: '1-2 personas',
    availableExtras: [
      { id: 'chifles', name: 'Porción de Chifles Piuranos', price: 6 },
      { id: 'zarza', name: 'Zarza Criolla Extra', price: 4 },
      { id: 'cancha', name: 'Cancha Chulpi Tostada', price: 4 },
    ]
  },
  {
    id: 'majariscos',
    name: 'Majariscos Piurano',
    category: 'insignias',
    price: 59,
    description: 'La versión marina del seco de chabelo. A base de plátano verde majado, combinado con mariscos frescos del día (langostinos, calamar y conchas) salteados con aderezo criollo tradicional, muy típico de las playas piuranas.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    badge: 'Especialidad Marina',
    isPopular: true,
    isSpicy: true,
    prepTime: '25 min',
    portions: '1-2 personas',
    availableExtras: [
      { id: 'mariscos_extra', name: 'Porción Extra de Mariscos', price: 16 },
      { id: 'chifles', name: 'Porción de Chifles Piuranos', price: 6 },
      { id: 'zarza', name: 'Zarza Criolla Extra', price: 4 },
    ]
  },
  {
    id: 'tamalitos-verdes',
    name: 'Tamalitos Verdes Piuranos (2 Unidades)',
    category: 'entradas',
    price: 20,
    description: 'Hechos con choclo tierno desgranado a mano, culantro fresco y un sutil toque de ají amarillo. Servidos calientes con suculento jugo de seco criollo y sarza criolla norteña.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    badge: 'Tradición Picantera',
    isPopular: true,
    isSpicy: false,
    prepTime: '10-15 min',
    portions: '2 unidades (Entrada)',
    availableExtras: [
      { id: 'zarza', name: 'Porción Extra de Sarza Criolla', price: 4 },
      { id: 'chifles', name: 'Porción de Chifles', price: 6 },
    ]
  },
  {
    id: 'copa-leche-tigre',
    name: 'Copa de Leche de Tigre Piurana',
    category: 'entradas',
    price: 29,
    description: 'A pesar del intenso calor piurano, nos encanta tomar la leche de tigre bien servida y caliente en picantería. Caldo potente marino con tropezones de pescado fresco, langostinos, cebolla roja, ají limo, choclo tierno, zarandaja piurana y su toque de limón de Chulucanas.',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    badge: 'Potencia Marina',
    isPopular: true,
    isSpicy: true,
    prepTime: '15 min',
    portions: '1 copa generosa',
    availableExtras: [
      { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
      { id: 'cancha', name: 'Cancha Chulpi', price: 4 },
    ]
  },
  {
    id: 'tortilla-langostinos',
    name: 'Tortilla de Langostinos Criolla',
    category: 'entradas',
    price: 49,
    description: 'Jugosa tortilla a base de huevos de chacra batidos al momento, colas de langostinos norteños salteados al fuego, picadito de ajíes aromáticos con ajo dorado y sarza criolla fresca.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    badge: 'Receta de Antaño',
    isPopular: false,
    isSpicy: false,
    prepTime: '15-20 min',
    portions: '1-2 personas',
    availableExtras: [
      { id: 'mariscos_extra', name: 'Doble de Langostinos', price: 16 },
      { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
      { id: 'zarza', name: 'Sarza Criolla Extra', price: 4 },
    ]
  },
  {
    id: 'ceviche-mero-piurano',
    name: 'Ceviche Piurano de Mero con Zarandaja',
    category: 'marinos',
    price: 54,
    description: 'Fresco mero del litoral piurano cortado en dados, curado al momento con limón criollo de Chulucanas y ají limo, acompañado de auténtica zarandaja piurana, camote glaseado y chifles artesanales.',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    badge: 'Fresco del Día',
    isPopular: true,
    isSpicy: true,
    prepTime: '15 min',
    portions: '1 persona abundante',
    availableExtras: [
      { id: 'chifles', name: 'Chifles Piuranos Extra', price: 6 },
      { id: 'cancha', name: 'Cancha Chulpi Extra', price: 4 },
      { id: 'zarza', name: 'Zarza Criolla', price: 4 },
    ]
  },
  {
    id: 'arroz-pato-norteno',
    name: 'Arroz con Pato a la Piurana',
    category: 'insignias',
    price: 52,
    description: 'Pierna de pato tierno macerada en chicha de jora norteña ancestral y cerveza negra, cocinado lentamente con arroz al culantro silvestre, ají amarillo y pimientos morrones asados.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    badge: 'Plato Festivo',
    isPopular: true,
    isSpicy: false,
    prepTime: '20-25 min',
    portions: '1 persona contundente',
    availableExtras: [
      { id: 'zarza', name: 'Sarza Criolla Extra', price: 4 },
      { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
    ]
  },
  {
    id: 'chicharron-pescado-chifles',
    name: 'Chicharrón de Pescado con Chifles',
    category: 'marinos',
    price: 42,
    description: 'Crujientes y dorados trozos de pescado fresco marinados en ajo y mostaza criolla, acompañados de salsa tártara casera de la casa, chifles piuranos salados y yuquitas doradas.',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    badge: 'Súper Crocante',
    isPopular: false,
    isSpicy: false,
    prepTime: '15-20 min',
    portions: '1-2 personas',
    availableExtras: [
      { id: 'yuca_frita', name: 'Porción Extra de Yuquitas', price: 7 },
      { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
      { id: 'zarza', name: 'Sarza Criolla', price: 4 },
    ]
  },
  {
    id: 'ronda-facinerosa-familiar',
    name: 'Gran Ronda Picantera La Facinerosa',
    category: 'rondas',
    price: 119,
    description: 'Para vivir la experiencia completa en familia: Seco de Chabelo tradicional + Majado de Yuca con Chancho crocante + Ceviche clásico al limón de Chulucanas + 2 Tamalitos Verdes + Montaña de Chifles piuranos y sarza criolla.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    badge: 'Para 3 a 4 personas',
    isPopular: true,
    isSpicy: false,
    prepTime: '30 min',
    portions: '3-4 personas',
    availableExtras: [
      { id: 'chifles', name: 'Doble de Chifles Artesanales', price: 6 },
      { id: 'cancha', name: 'Cancha Chulpi Tostada', price: 4 },
      { id: 'carne_extra', name: 'Extra Carne Aliñada', price: 14 },
    ]
  },
  {
    id: 'chicha-jora-jarra',
    name: 'Chicha de Jora Artesanal (Jarra 1 Litro)',
    category: 'bebidas',
    price: 16,
    description: 'Elaborada siguiendo la receta tradicional picantera piurana, fermentada con maíz de jora seleccionado y especias naturales. Servida bien fría en jarra de barro o vidrio.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    badge: 'Bebida Ancestral',
    isPopular: true,
    isSpicy: false,
    prepTime: '5 min',
    portions: 'Jarra 1 Litro (4 vasos)',
  },
  {
    id: 'clarito-piurano',
    name: 'Clarito Piurano Bien Helado (Jarra 1 Litro)',
    category: 'bebidas',
    price: 14,
    description: 'El destilado superior y cristalino de la chicha de jora, suave, refrescante y perfecto para acompañar el seco de chabelo y el calor piurano.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorito Norteño',
    isPopular: true,
    isSpicy: false,
    prepTime: '5 min',
    portions: 'Jarra 1 Litro',
  },
  {
    id: 'chicha-morada-jarra',
    name: 'Chicha Morada Especial con Piña y Membrillo (1L)',
    category: 'bebidas',
    price: 15,
    description: 'Hervida con maíz morado cusqueño, cáscaras de piña golden, membrillo fresco, clavo de olor y canela de rama, con toque cítrico de limón recién exprimido.',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
    badge: '100% Natural',
    isPopular: false,
    isSpicy: false,
    prepTime: '5 min',
    portions: 'Jarra 1 Litro',
  },
  {
    id: 'porcion-chifles-artesanales',
    name: 'Porción Generosa de Chifles Piuranos',
    category: 'guarniciones',
    price: 9,
    description: 'Chifles delgados, crocantes y salados en su punto, preparados con plátano bellaco verde de la campiña de Morropón.',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
    badge: '100% Piurano',
    isPopular: false,
    isSpicy: false,
    prepTime: '5 min',
    portions: 'Bolsa / Porción 200g',
  },
  {
    id: 'natilla-piurana-artesanal',
    name: 'Natilla Piurana Tradicional de Leche de Cabra',
    category: 'guarniciones',
    price: 12,
    description: 'Postre emblemático del norte, cocinado a fuego lento en perol de cobre con leche de cabra fresca y chancaca pura, con trocitos de pecanas tostadas.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    badge: 'Postre Típico',
    isPopular: false,
    isSpicy: false,
    prepTime: '5 min',
    portions: 'Pote artesanal 180g',
  },
  // COMBOS PROMOCIONALES
  {
    id: 'dupla-picantera-clarito',
    name: 'Dupla Picantera + Clarito Helado',
    category: 'insignias',
    price: 58,
    description: 'Seco de Chabelo tradicional con abundante carne aliñada + 1 Jarra de Clarito Piurano bien helado (1L) + porción de chifles piuranos artesanales y sarza criolla.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: 'PROMO DÚO',
    isPopular: true,
    isSpicy: false,
    prepTime: '20 min',
    portions: '2 personas',
    availableExtras: [
      { id: 'chifles', name: 'Doble de Chifles Piuranos', price: 6 },
      { id: 'zarza', name: 'Zarza Criolla Extra', price: 4 },
      { id: 'carne_extra', name: 'Extra Carne Aliñada', price: 14 },
    ]
  },
  {
    id: 'trio-marino-facineroso',
    name: 'Trío Marino Norteño',
    category: 'marinos',
    price: 68,
    description: 'Ceviche Piurano de Mero al limón de Chulucanas + Chicharrón de pescado súper crocante + Copa de Leche de Tigre potente y chifles crujientes.',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    badge: 'PROMO MARINA',
    isPopular: true,
    isSpicy: true,
    prepTime: '20 min',
    portions: '2 personas',
    availableExtras: [
      { id: 'mariscos_extra', name: 'Porción Extra de Mariscos', price: 16 },
      { id: 'chifles', name: 'Chifles Piuranos Extra', price: 6 },
    ]
  },
  {
    id: 'combo-tamalitos-chicha',
    name: 'Dúo Tamalitos Verdes + Chicha de Jora',
    category: 'entradas',
    price: 32,
    description: '4 Tamalitos verdes piuranos recién hechos con jugo de seco y sarza criolla + 1 Jarra de Chicha de Jora artesanal de 1L.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    badge: 'PROMO PIQUEO',
    isPopular: true,
    isSpicy: false,
    prepTime: '15 min',
    portions: '2-3 personas',
    availableExtras: [
      { id: 'zarza', name: 'Zarza Criolla Extra', price: 4 },
      { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
    ]
  },
  {
    id: 'combo-majado-jora',
    name: 'Combo Majado de Chancho + Chicha',
    category: 'insignias',
    price: 59,
    description: 'Majado de Yuca generoso con chancho crocante y cancha chulpi + 1 Jarra de Chicha de Jora norteña de 1L + chifles y zarza criolla.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    badge: 'PROMO CRIOLLA',
    isPopular: true,
    isSpicy: false,
    prepTime: '20 min',
    portions: '2 personas',
    availableExtras: [
      { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
      { id: 'cancha', name: 'Cancha Chulpi', price: 4 },
    ]
  }
];

export interface CategoryMetadata {
  id: CategoryId;
  name: string;
  count: number;
  image: string;
  badge?: string;
}

export const CATEGORIES = [
  { 
    id: 'todos', 
    name: 'Todos los Platos', 
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'insignias', 
    name: 'Platos Insignia', 
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'entradas', 
    name: 'Entradas & Piqueos', 
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'marinos', 
    name: 'Ceviches & Marinos', 
    icon: 'Fish',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'rondas', 
    name: 'Rondas Familiares', 
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'bebidas', 
    name: 'Chichas & Bebidas', 
    icon: 'Wine',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'guarniciones', 
    name: 'Guarniciones & Postres', 
    icon: 'Cookie',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80'
  },
] as const;

export const LIMA_DISTRICTS = [
  { name: 'Surquillo (Local Mercado 2)', fee: 4 },
  { name: 'Miraflores', fee: 6 },
  { name: 'San Isidro', fee: 7 },
  { name: 'San Borja', fee: 7 },
  { name: 'Barranco', fee: 7 },
  { name: 'Santiago de Surco', fee: 8 },
  { name: 'Lince / Jesús María', fee: 8 },
  { name: 'Magdalena / San Miguel', fee: 9 },
  { name: 'La Victoria / San Luis', fee: 8 },
  { name: 'Cercado de Lima / Breña', fee: 9 },
  { name: 'Chorrillos', fee: 9 },
  { name: 'Otro distrito de Lima (Consultar)', fee: 8 },
];

export const PIURA_DISTRICTS = LIMA_DISTRICTS;
