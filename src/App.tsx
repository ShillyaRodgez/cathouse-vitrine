import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isCatshopMenuOpen, setCatshopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Função para navegar entre páginas
  const navigateToPage = (page: string, category?: string) => {
    setCurrentPage(page);
    if (page === 'catshop' && category) {
      // Precisamos de uma forma de passar a categoria para a CatshopPage.
      // Uma abordagem é usar um estado compartilhado ou passar props.
      // Por simplicidade, vamos usar um estado no App para a categoria selecionada.
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = '5549998380557'; // Substitua pelo número real
  const instagramUrl = 'https://www.instagram.com/acasadosgatos.lages/'; // Substitua pela URL real

  // A URL `wa.me` é universal e funciona tanto em desktops (abrindo o WhatsApp Web)
  // quanto em dispositivos móveis (abrindo o aplicativo WhatsApp diretamente).
  const handleWhatsAppPurchase = (productName: string, productPrice: string) => {
    const message = `Olá! Tenho interesse no produto: ${productName}, no valor de ${productPrice}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const products = [
    {
      id: 1,
      name: 'Ração Premium para Gatos Adultos',
      description: 'Ração seca sabor salmão para gatos castrados',
      image: '🍣',
      price: 'R$ 129,90',
      category: 'Alimentação'
    },
    {
      id: 2,
      name: 'Arranhador Torre com Múltiplos Níveis',
      description: 'Arranhador grande com brinquedos e tocas',
      image: '🗼',
      price: 'R$ 249,90',
      category: 'Brinquedos'
    },
    {
      id: 3,
      name: 'Fonte de Água Automática',
      description: 'Bebedouro com filtro para água sempre fresca',
      image: '💧',
      price: 'R$ 159,90',
      category: 'Acessórios'
    },
    {
      id: 4,
      name: 'Cama Nuvem Extra Macia',
      description: 'Cama redonda de pelúcia para máximo conforto',
      image: '☁️',
      price: 'R$ 89,90',
      category: 'Conforto'
    },
    {
      id: 5,
      name: 'Petisco Catnip Orgânico',
      description: 'Petisco natural de catnip para relaxamento',
      image: '🌿',
      price: 'R$ 24,90',
      category: 'Alimentação'
    },
    {
      id: 6,
      name: 'Caixa de Transporte Segura',
      description: 'Caixa de transporte com travas de segurança',
      image: '✈️',
      price: 'R$ 199,90',
      category: 'Acessórios'
    },
    {
      id: 7,
      name: 'Varinha de Brinquedo com Penas',
      description: 'Brinquedo interativo para estimular o instinto de caça',
      image: '🎣',
      price: 'R$ 19,90',
      category: 'Brinquedos'
    },
    {
      id: 8,
      name: 'Areia Higiênica Super Absorvente',
      description: 'Areia sílica que elimina odores e absorve a umidade',
      image: '✨',
      price: 'R$ 49,90',
      category: 'Higiene'
    },
    {
      id: 9,
      name: 'Coleira com GPS Integrado',
      description: 'Coleira com rastreador para segurança do seu gato',
      image: '🛰️',
      price: 'R$ 299,90',
      category: 'Acessórios'
    },
    {
      id: 10,
      name: 'Túnel Dobrável para Gatos',
      description: 'Túnel de tecido para diversão e esconderijo',
      image: '🚇',
      price: 'R$ 69,90',
      category: 'Brinquedos'
    },
    {
      id: 11,
      name: 'Túnel de Brincar',
      description: 'Túnel dobrável para diversão e exercícios',
      image: '🌀',
      price: 'R$ 89,90',
      category: 'Brinquedos'
    },
    {
      id: 12,
      name: 'Petisco Natural Premium',
      description: 'Snacks naturais e saudáveis para recompensas',
      image: '🦴',
      price: 'R$ 34,90',
      category: 'Alimentação'
    },
    {
      id: 13,
      name: 'Tapete Sanitário',
      description: 'Tapete absorvente para higiene e limpeza',
      image: '🧽',
      price: 'R$ 19,90',
      category: 'Higiene'
    },
    {
      id: 14,
      name: 'Bola Interativa LED',
      description: 'Bola com luzes LED para brincadeiras noturnas',
      image: '💡',
      price: 'R$ 39,90',
      category: 'Brinquedos'
    },
    {
      id: 15,
      name: 'Rede de Descanso',
      description: 'Rede suspensa confortável para relaxamento',
      image: '🕸️',
      price: 'R$ 79,90',
      category: 'Conforto'
    },
    {
      id: 16,
      name: 'Spray Calmante',
      description: 'Spray natural para reduzir stress e ansiedade',
      image: '💨',
      price: 'R$ 54,90',
      category: 'Saúde'
    },
    {
      id: 17,
      name: 'Escova Massageadora',
      description: 'Escova com cerdas macias para massagem relaxante',
      image: '🪮',
      price: 'R$ 29,90',
      category: 'Higiene'
    },
    {
      id: 18,
      name: 'Comedouro Elevado',
      description: 'Comedouro ergonômico em altura ideal',
      image: '🏔️',
      price: 'R$ 89,90',
      category: 'Acessórios'
    },
    {
      id: 19,
      name: 'Manta Térmica',
      description: 'Manta aquecida para conforto nos dias frios',
      image: '🔥',
      price: 'R$ 119,90',
      category: 'Conforto'
    },
    {
      id: 20,
      name: 'Laser Pointer',
      description: 'Ponteiro laser para exercícios e diversão',
      image: '🔴',
      price: 'R$ 24,90',
      category: 'Brinquedos'
    },
    {
      id: 21,
      name: 'Vitamina Multifuncional',
      description: 'Suplemento vitamínico para saúde completa',
      image: '💊',
      price: 'R$ 64,90',
      category: 'Saúde'
    },
    {
      id: 22,
      name: 'Arranhador Compacto',
      description: 'Arranhador pequeno para espaços reduzidos',
      image: '📐',
      price: 'R$ 49,90',
      category: 'Brinquedos'
    },
    {
      id: 23,
      name: 'Caneca Gato Preto',
      description: 'Caneca de cerâmica com estampa de gato preto.',
      image: '☕',
      price: 'R$ 39,90',
      category: 'Para Donos'
    },
    {
      id: 24,
      name: 'Camiseta "Cat Person"',
      description: 'Camiseta de algodão com estampa divertida.',
      image: '👕',
      price: 'R$ 59,90',
      category: 'Para Donos'
    },
    {
      id: 25,
      name: 'Bolsa Ecobag de Gatinho',
      description: 'Bolsa de algodão para compras.',
      image: '👜',
      price: 'R$ 29,90',
      category: 'Para Donos'
    },
    {
      id: 26,
      name: 'Chaveiro de Gato',
      description: 'Chaveiro de metal em formato de gato.',
      image: '🔑',
      price: 'R$ 19,90',
      category: 'Para Donos'
    },
    {
      id: 27,
      name: 'Meias de Gatinho',
      description: 'Par de meias com estampa de patas de gato.',
      image: '🧦',
      price: 'R$ 24,90',
      category: 'Para Donos'
    },
    {
      id: 28,
      name: 'Livro "O Encantador de Gatos"',
      description: 'Livro sobre comportamento felino.',
      image: '📖',
      price: 'R$ 49,90',
      category: 'Para Donos'
    },
    {
      id: 29,
      name: 'Quadro Decorativo de Gato',
      description: 'Quadro com ilustração de gato para decorar a casa.',
      image: '🖼️',
      price: 'R$ 79,90',
      category: 'Para Donos'
    },
    {
      id: 30,
      name: 'Adesivos de Gato para Notebook',
      description: 'Cartela de adesivos de vinil.',
      image: '🐱',
      price: 'R$ 14,90',
      category: 'Para Donos'
    },
    {
      id: 31,
      name: 'Mousepad de Gato',
      description: 'Mousepad com estampa de gato.',
      image: '🖱️',
      price: 'R$ 34,90',
      category: 'Para Donos'
    },
    {
      id: 32,
      name: 'Almofada de Gato',
      description: 'Almofada em formato de gato.',
      image: '😻',
      price: 'R$ 69,90',
      category: 'Para Donos'
    },
    {
      id: 33,
      name: 'Shampoo Antipulgas',
      description: 'Shampoo especial para prevenção de pulgas',
      image: '🧼',
      price: 'R$ 39,90',
      category: 'Higiene'
    },
    {
      id: 34,
      name: 'Brinquedo Pena',
      description: 'Varinha com penas para estimular caça',
      image: '🪶',
      price: 'R$ 19,90',
      category: 'Brinquedos'
    },
    {
      id: 35,
      name: 'Caixa de Areia Premium',
      description: 'Areia sanitária de alta absorção',
      image: '📦',
      price: 'R$ 34,90',
      category: 'Higiene'
    },
    {
      id: 36,
      name: 'Colchonete Ortopédico',
      description: 'Colchão especial para gatos idosos',
      image: '🛌',
      price: 'R$ 159,90',
      category: 'Conforto'
    },
    {
      id: 37,
      name: 'Dispensador de Ração',
      description: 'Alimentador automático programável',
      image: '⏰',
      price: 'R$ 179,90',
      category: 'Acessórios'
    },
    {
      id: 38,
      name: 'Escada para Gatos',
      description: 'Escada dobrável para acesso a alturas',
      image: '🪜',
      price: 'R$ 89,90',
      category: 'Acessórios'
    },
    {
      id: 39,
      name: 'Kit Dental Felino',
      description: 'Escova e pasta para higiene bucal',
      image: '🦷',
      price: 'R$ 44,90',
      category: 'Higiene'
    },
    {
      id: 40,
      name: 'Bolsa Transporte Luxo',
      description: 'Bolsa elegante para transporte confortável',
      image: '👜',
      price: 'R$ 229,90',
      category: 'Acessórios'
    },
    {
      id: 41,
      name: 'Ração Filhote Premium',
      description: 'Ração especial para gatinhos até 12 meses',
      image: '🍼',
      price: 'R$ 94,90',
      category: 'Alimentação'
    },
    {
      id: 42,
      name: 'Brinquedo Ratinho',
      description: 'Ratinho de pelúcia com catnip natural',
      image: '🐭',
      price: 'R$ 14,90',
      category: 'Brinquedos'
    },
    {
      id: 85,
      name: 'Perfume Felino',
      description: 'Perfume suave e seguro para gatos',
      image: '🌸',
      price: 'R$ 49,90',
      category: 'Higiene'
    },
    {
      id: 86,
      name: 'Comedouro Automático',
      description: 'Comedouro com timer e porções controladas',
      image: '🤖',
      price: 'R$ 299,90',
      category: 'Acessórios'
    },
    {
      id: 87,
      name: 'Corda Sisal Natural',
      description: 'Corda para arranhadores e brinquedos',
      image: '🪢',
      price: 'R$ 29,90',
      category: 'Brinquedos'
    },
    {
      id: 88,
      name: 'Almofada Relaxante',
      description: 'Almofada com ervas calmantes naturais',
      image: '🌿',
      price: 'R$ 69,90',
      category: 'Conforto'
    },
    {
      id: 89,
      name: 'Bebedouro Cascata',
      description: 'Fonte de água em cascata com filtro',
      image: '🏞️',
      price: 'R$ 189,90',
      category: 'Acessórios'
    },
    {
      id: 90,
      name: 'Kit Primeiros Socorros',
      description: 'Kit básico para emergências felinas',
      image: '🏥',
      price: 'R$ 79,90',
      category: 'Saúde'
    },
    {
      id: 91,
      name: 'Bola Massageadora',
      description: 'Bola com texturas para automassagem',
      image: '⚽',
      price: 'R$ 34,90',
      category: 'Brinquedos'
    },
    {
      id: 92,
      name: 'Casinha Iglu',
      description: 'Casa em formato iglu para descanso',
      image: '🏠',
      price: 'R$ 149,90',
      category: 'Conforto'
    },
    {
      id: 93,
      name: 'Spray Educativo',
      description: 'Spray para educar comportamentos',
      image: '📚',
      price: 'R$ 39,90',
      category: 'Higiene'
    },
    {
      id: 94,
      name: 'Rede Protetora',
      description: 'Rede de segurança para janelas e sacadas',
      image: '🕷️',
      price: 'R$ 89,90',
      category: 'Acessórios'
    },
    {
      id: 43,
      name: 'Termômetro Digital',
      description: 'Termômetro específico para felinos',
      image: '🌡️',
      price: 'R$ 59,90',
      category: 'Saúde'
    },
    {
      id: 44,
      name: 'Brinquedo Eletrônico',
      description: 'Brinquedo com movimento automático',
      image: '🔋',
      price: 'R$ 79,90',
      category: 'Brinquedos'
    },
    {
      id: 45,
      name: 'Caixa Sanitária Fechada',
      description: 'Banheiro fechado com filtro de odor',
      image: '🚽',
      price: 'R$ 119,90',
      category: 'Higiene'
    },
    {
      id: 46,
      name: 'Suplemento Pelo',
      description: 'Vitamina para pelagem brilhante',
      image: '✨',
      price: 'R$ 54,90',
      category: 'Saúde'
    },
    {
      id: 47,
      name: 'Arranhador Vertical',
      description: 'Torre arranhador de 1,5m de altura',
      image: '🗼',
      price: 'R$ 249,90',
      category: 'Brinquedos'
    },
    {
      id: 48,
      name: 'Coleira GPS',
      description: 'Coleira com rastreamento por GPS',
      image: '🛰️',
      price: 'R$ 199,90',
      category: 'Acessórios'
    },
    {
      id: 49,
      name: 'Tapete Aquecido',
      description: 'Tapete com aquecimento elétrico seguro',
      image: '🔥',
      price: 'R$ 139,90',
      category: 'Conforto'
    },
    {
      id: 50,
      name: 'Kit Beleza Completo',
      description: 'Kit com todos os itens para estética',
      image: '💅',
      price: 'R$ 89,90',
      category: 'Higiene'
    },
    {
      id: 51,
      name: 'Brinquedo Inteligente',
      description: 'Brinquedo que responde ao movimento',
      image: '🧠',
      price: 'R$ 129,90',
      category: 'Brinquedos'
    },
    {
      id: 52,
      name: 'Cama Ortopédica Luxo',
      description: 'Cama premium com espuma viscoelástica',
      image: '👑',
      price: 'R$ 299,90',
      category: 'Conforto'
    },
    {
      id: 53,
      name: 'Sistema de Câmeras',
      description: 'Câmera para monitorar seu gato remotamente',
      image: '📹',
      price: 'R$ 399,90',
      category: 'Acessórios'
    },
    {
      id: 54,
      name: 'Kit Completo Iniciante',
      description: 'Kit com tudo para novos tutores',
      image: '🎁',
      price: 'R$ 199,90',
      category: 'Acessórios'
    },
    {
      id: 55,
      name: 'Ração Sênior Premium',
      description: 'Ração especial para gatos idosos',
      image: '👴',
      price: 'R$ 109,90',
      category: 'Alimentação'
    },
    {
      id: 56,
      name: 'Brinquedo Varinha Mágica',
      description: 'Varinha com penas coloridas e guizo',
      image: '🪄',
      price: 'R$ 24,90',
      category: 'Brinquedos'
    },
    {
      id: 57,
      name: 'Shampoo Antipulgas',
      description: 'Shampoo natural contra pulgas e carrapatos',
      image: '🧴',
      price: 'R$ 44,90',
      category: 'Higiene'
    },
    {
      id: 58,
      name: 'Casa Árvore Gigante',
      description: 'Arranhador em formato de árvore 2m',
      image: '🌳',
      price: 'R$ 599,90',
      category: 'Brinquedos'
    },
    {
      id: 59,
      name: 'Comedouro Elevado Duplo',
      description: 'Comedouro duplo em altura ergonômica',
      image: '🥣',
      price: 'R$ 89,90',
      category: 'Acessórios'
    },
    {
      id: 60,
      name: 'Bola Dispensadora',
      description: 'Bola que libera petiscos durante o jogo',
      image: '🎾',
      price: 'R$ 49,90',
      category: 'Brinquedos'
    },
    {
      id: 61,
      name: 'Kit Dental Completo',
      description: 'Escova, pasta e brinquedos dentais',
      image: '🦷',
      price: 'R$ 64,90',
      category: 'Higiene'
    },
    {
      id: 62,
      name: 'Mochila Transporte',
      description: 'Mochila ergonômica para transporte',
      image: '🎒',
      price: 'R$ 179,90',
      category: 'Acessórios'
    },
    {
      id: 63,
      name: 'Túnel Dobrável',
      description: 'Túnel de brincar dobrável e portátil',
      image: '🚇',
      price: 'R$ 59,90',
      category: 'Brinquedos'
    },
    {
      id: 64,
      name: 'Vitamina Multifuncional',
      description: 'Complexo vitamínico completo',
      image: '💊',
      price: 'R$ 74,90',
      category: 'Saúde'
    },
    {
      id: 65,
      name: 'Escada para Cama',
      description: 'Escada dobrável para acesso a móveis',
      image: '🪜',
      price: 'R$ 119,90',
      category: 'Acessórios'
    },
    {
      id: 66,
      name: 'Dispensador de Água',
      description: 'Dispensador automático com sensor',
      image: '🚰',
      price: 'R$ 159,90',
      category: 'Acessórios'
    },
    {
      id: 67,
      name: 'Cama Suspensa',
      description: 'Cama que se fixa em radiadores',
      image: '🛏️',
      price: 'R$ 99,90',
      category: 'Conforto'
    },
    {
      id: 68,
      name: 'Kit Limpeza Orelhas',
      description: 'Solução e aplicadores para higiene',
      image: '👂',
      price: 'R$ 34,90',
      category: 'Higiene'
    },
    {
      id: 69,
      name: 'Brinquedo Robô',
      description: 'Robô interativo com controle remoto',
      image: '🤖',
      price: 'R$ 249,90',
      category: 'Brinquedos'
    },
    {
      id: 70,
      name: 'Tapete Sanitário',
      description: 'Tapete absorvente descartável',
      image: '🧽',
      price: 'R$ 29,90',
      category: 'Higiene'
    },
    {
      id: 71,
      name: 'Coleira Antipulgas',
      description: 'Coleira com proteção de 8 meses',
      image: '🔵',
      price: 'R$ 69,90',
      category: 'Saúde'
    },
    {
      id: 72,
      name: 'Fonte Cerâmica',
      description: 'Fonte de água em cerâmica artesanal',
      image: '🏺',
      price: 'R$ 149,90',
      category: 'Acessórios'
    },
    {
      id: 73,
      name: 'Kit Unhas Completo',
      description: 'Cortador, lima e protetor de unhas',
      image: '💅',
      price: 'R$ 54,90',
      category: 'Higiene'
    },
    {
      id: 74,
      name: 'Brinquedo Peixe Eletrônico',
      description: 'Peixe que se move sozinho na água',
      image: '🐠',
      price: 'R$ 89,90',
      category: 'Brinquedos'
    },
    {
      id: 75,
      name: 'Caixa Areia Automática',
      description: 'Caixa que se limpa automaticamente',
      image: '🔄',
      price: 'R$ 899,90',
      category: 'Higiene'
    },
    {
      id: 76,
      name: 'Suplemento Articular',
      description: 'Glucosamina para articulações saudáveis',
      image: '🦴',
      price: 'R$ 84,90',
      category: 'Saúde'
    },
    {
      id: 77,
      name: 'Casa Inteligente',
      description: 'Casa com controle de temperatura',
      image: '🏡',
      price: 'R$ 799,90',
      category: 'Conforto'
    },
    {
      id: 78,
      name: 'Kit Veterinário Doméstico',
      description: 'Kit completo para cuidados básicos',
      image: '⚕️',
      price: 'R$ 149,90',
      category: 'Saúde'
    },
    {
      id: 79,
      name: 'Ração Orgânica Premium',
      description: 'Ração 100% orgânica sem conservantes',
      image: '🌱',
      price: 'R$ 129,90',
      category: 'Alimentação'
    },
    {
      id: 80,
      name: 'Brinquedo Caça Laser',
      description: 'Dispositivo automático com laser rotativo',
      image: '🔴',
      price: 'R$ 199,90',
      category: 'Brinquedos'
    },
    {
      id: 81,
      name: 'Perfume Desodorante',
      description: 'Spray neutralizador de odores naturais',
      image: '🌺',
      price: 'R$ 39,90',
      category: 'Higiene'
    },
    {
      id: 82,
      name: 'Torre Arranhador Luxo',
      description: 'Torre de 2,5m com múltiplos níveis',
      image: '🏰',
      price: 'R$ 699,90',
      category: 'Brinquedos'
    },
    {
      id: 83,
      name: 'Comedouro Inteligente',
      description: 'Comedouro com app e reconhecimento facial',
      image: '📱',
      price: 'R$ 449,90',
      category: 'Acessórios'
    },
    {
      id: 84,
      name: 'Bola Catnip Gigante',
      description: 'Bola de 15cm recheada com catnip',
      image: '🟢',
      price: 'R$ 34,90',
      category: 'Brinquedos'
    },
    {
      id: 85,
      name: 'Kit Spa Completo',
      description: 'Shampoo, condicionador e óleos relaxantes',
      image: '🛁',
      price: 'R$ 89,90',
      category: 'Higiene'
    },
    {
      id: 86,
      name: 'Transportadora Aérea',
      description: 'Aprovada para viagens de avião',
      image: '✈️',
      price: 'R$ 299,90',
      category: 'Acessórios'
    },
    {
      id: 87,
      name: 'Circuito de Bolinhas',
      description: 'Pista circular com bolinhas coloridas',
      image: '🎪',
      price: 'R$ 79,90',
      category: 'Brinquedos'
    },
    {
      id: 88,
      name: 'Suplemento Imunidade',
      description: 'Vitaminas para fortalecer imunidade',
      image: '🛡️',
      price: 'R$ 69,90',
      category: 'Saúde'
    },
    {
      id: 89,
      name: 'Ponte Suspensa',
      description: 'Ponte de corda para escalada',
      image: '🌉',
      price: 'R$ 119,90',
      category: 'Conforto'
    },
    {
      id: 90,
      name: 'Bebedouro Gelado',
      description: 'Mantém água sempre fresca',
      image: '🧊',
      price: 'R$ 179,90',
      category: 'Acessórios'
    },
    {
      id: 91,
      name: 'Almofada Térmica',
      description: 'Almofada que mantém temperatura corporal',
      image: '🌡️',
      price: 'R$ 89,90',
      category: 'Conforto'
    },
    {
      id: 92,
      name: 'Kit Higiene Bucal',
      description: 'Escova elétrica e enxaguante',
      image: '🪥',
      price: 'R$ 74,90',
      category: 'Higiene'
    },
    {
      id: 93,
      name: 'Brinquedo Pássaro Voador',
      description: 'Pássaro eletrônico que voa pela casa',
      image: '🦅',
      price: 'R$ 159,90',
      category: 'Brinquedos'
    },
    {
      id: 94,
      name: 'Caixa Areia Biodegradável',
      description: 'Areia ecológica 100% natural',
      image: '♻️',
      price: 'R$ 49,90',
      category: 'Higiene'
    },
    {
      id: 95,
      name: 'Coleira Luminosa LED',
      description: 'Coleira com luzes LED recarregáveis',
      image: '💡',
      price: 'R$ 59,90',
      category: 'Acessórios'
    },
    {
      id: 96,
      name: 'Fonte Cascata Premium',
      description: 'Fonte de aço inox com 3 níveis',
      image: '⛲',
      price: 'R$ 249,90',
      category: 'Acessórios'
    },
    {
      id: 97,
      name: 'Kit Manicure Profissional',
      description: 'Cortador elétrico e lixas especiais',
      image: '✂️',
      price: 'R$ 94,90',
      category: 'Higiene'
    },
    {
      id: 98,
      name: 'Brinquedo Aquário Virtual',
      description: 'Tela com peixes virtuais interativos',
      image: '🐟',
      price: 'R$ 299,90',
      category: 'Brinquedos'
    },
    {
      id: 99,
      name: 'Sistema Limpeza Automática',
      description: 'Robô aspirador para pelos de gato',
      image: '🤖',
      price: 'R$ 1299,90',
      category: 'Higiene'
    },
    {
      id: 100,
      name: 'Kit Luxo Completo',
      description: 'Conjunto premium com 20 itens essenciais',
      image: '👑',
      price: 'R$ 999,90',
      category: 'Acessórios'
    }
  ];

  const sendWhatsApp = (productName?: string) => {
    const message = productName 
      ? `Olá! Vi esse produto na vitrine online e gostaria de saber mais: ${productName}`
      : 'Olá! Gostaria de saber mais sobre os serviços da Casa dos Gatos!';
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Componente da página Início
  const InicioPage = () => (
    <section className="hero">
      <div className="container">
        <div className="hero-image">
          <img src="/gatinho.png" alt="Gatinho" className="cat-image" />
        </div>
        <div className="hero-content">
          <h2>A clínica e loja perfeita para quem ama gatos!</h2>
          <p>Cuidado especializado e produtos selecionados para o seu felino</p>
        </div>
      </div>
    </section>
  );

  // Componente da página Sobre
  const SobrePage = () => (
    <section className="about">
      <div className="container">
        <h2>Sobre Nós</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
            Somos apaixonados por gatos e foi dessa paixão que nasceu A Casa dos Gatos. Desde sempre, sentimos na pele a dificuldade de encontrar um espaço realmente pensado para os felinos e seus tutores. Seja na busca por um brinquedo específico, um alimento de qualidade ou até mesmo um atendimento veterinário especializado, percebemos que o universo dos gatos ainda era tratado como secundário em muitos estabelecimentos.
            Foi então que unimos amor, experiência e um sonho antigo: criar um ambiente exclusivo para gatos. Nossa fundadora, médica veterinária com vasta experiência e dedicação à medicina felina, sempre teve o desejo de abrir uma clínica onde os bichanos fossem os protagonistas. Mas ela queria ir além: montar também uma loja completa, com uma curadoria especial de produtos pensados unicamente para o bem-estar dos gatos e o conforto de seus donos.
            Hoje, A Casa dos Gatos é esse espaço: um refúgio acolhedor e especializado, onde cada detalhe foi pensado para oferecer o melhor em saúde, bem-estar e qualidade de vida aos nossos queridos felinos. Aqui, você encontra atendimento veterinário dedicado exclusivamente aos gatos, além de uma catshop repleta de itens selecionados com carinho, variedade e qualidade.
            Se você ama gatos como a gente, esse é o seu lugar.
            </p>
            <div className="features">
              <div className="feature">
                <img src="veterinario.png" alt="Clínica Especializada" />
                <h3>Clínica Especializada</h3>
                <p>Atendimento exclusivo para felinos</p>
              </div>
              <div className="feature">
                <img src="catshop.png" alt="Catshop Completa" />
                <h3>Catshop Completa</h3>
                <p>Produtos selecionados para gatos</p>
              </div>
              <div className="feature">
                <img src="humanizado.png" alt="Cuidado Humanizado" />
                <h3>Cuidado Humanizado</h3>
                <p>Tratamento com carinho e respeito</p>
              </div>
              <div className="feature">
                <img src="acolhedor.png" alt="Ambiente acolhedor" />
                <h3>Ambiente acolhedor</h3>
                <p>Espaço confortável para os felinos</p>
              </div>
              <div className="feature">
                <img src="cuidado.png" alt="Gatos bem cuidados" />
                <h3>Gatos bem cuidados</h3>
                <p>Cuidado especial com cada gatinho</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Componente da página Catshop
  const CatshopPage = ({ initialCategory = 'Todos', categories }: { initialCategory?: string, categories: string[] }) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);



    const filteredProducts = selectedCategory === 'Todos'
      ? products
      : products.filter(p => p.category === selectedCategory);

    return (
      <section className="catshop">
        <div className="container">
          <h2>Catshop - Produtos Exclusivos</h2>
          <p className="section-subtitle">Tudo que seu gatinho precisa em um só lugar</p>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <span>{product.image}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-price">{product.price}</div>
                <button onClick={() => handleWhatsAppPurchase(product.name, product.price)} className="buy-button">
                    Comprar pelo WhatsApp
                  </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Componente da página Clínica
  const ClinicaPage = () => (
    <section className="clinic">
      <div className="container">
        <h2>Clínica Felina</h2>
        <div className="clinic-highlight">
          <h3>"Especialista em medicina felina. Aqui, seu gato é tratado com carinho e respeito."</h3>
        </div>

        <div className="vet-section">
          <div className="vet-photo">
            <img src="/veterinária.png" alt="Dra. Fulana de Tal" className="vet-photo" />
          </div>
          <div className="vet-info">
            <h4>Dra. Manuela da Silva Casa</h4>
            <p>CRMV 07412/SC</p>
            <p>Apaixonada por gatos e dedicada a oferecer o melhor cuidado para seu amiguinho.</p>
          </div>
        </div>
        
        <div className="services">
          <h4>Nossos Serviços:</h4>
          <div className="services-grid">
            <div className="service">
              <span>📅</span>
              <h5>Consultas Agendadas</h5>
              <p>Atendimento personalizado com hora marcada</p>
            </div>
            <div className="service">
              <span>💉</span>
              <h5>Vacinações</h5>
              <p>Protocolo completo de imunização felina</p>
            </div>
            <div className="service">
              <span>🛡️</span>
              <h5>Cuidados Preventivos</h5>
              <p>Prevenção é o melhor remédio</p>
            </div>
          </div>
        </div>

        <div className="warning">
          <span>⚠️</span>
          <p><strong>IMPORTANTE:</strong> Não atendemos emergências</p>
        </div>
      </div>
    </section>
  );

  // Componente da página Contato
  const ContatoPage = () => (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Entre em Contato</h2>
        <p>Estamos aqui para ajudar! Seja para tirar dúvidas, agendar um serviço ou simplesmente para um bate-papo sobre gatos.</p>
        
        <div className="contact-content">
          <div className="contact-details-container">
            <div className="contact-item">
              <img src="/whats.png" alt="WhatsApp" />
              <p>WhatsApp: <a href={`https://wa.me/5549998380557`} target="_blank" rel="noopener noreferrer">(49) 99838-0557</a></p>
            </div>
            <div className="contact-item">
              <img src="/insta.png" alt="Instagram" />
              <p>Instagram: <a href="https://www.instagram.com/acasadosgatos.lages/" target="_blank" rel="noopener noreferrer">@acasadosgatos.lages</a></p>
            </div>
            <div className="contact-item">
              <p><strong>Horário de Funcionamento:</strong></p>
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 13h</p>
            </div>
          </div>

          <div className="contact-buttons">
            <a href={`https://wa.me/5549998380557`} className="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>
            <a href="https://www.instagram.com/acasadosgatos.lages/" className="btn btn-instagram" target="_blank" rel="noopener noreferrer">Seguir no Instagram</a>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.9339999999997!2d-50.3258333!3d-27.8166667!4m3!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e01f1f1f1f1f1f%3A0x94e01f1f1f1f1f1f!2sA%20Casa%20dos%20Gatos!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Mapa com a localização da A Casa dos Gatos"
            ></iframe>
          </div>
        </div>
      </div>
      </section>
  );

  // Função para renderizar a página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <InicioPage />;
      case 'sobre':
        return <SobrePage />;
      case 'catshop':
        return <CatshopPage initialCategory={selectedCategory} categories={['Todos', ...Array.from(new Set(products.map(p => p.category))).filter((c): c is string => c !== undefined)]} />;
      case 'clinica':
        return <ClinicaPage />;
      case 'contato':
        return <ContatoPage />;
      default:
        return <InicioPage />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/logo editada.png" alt="Logo A Casa dos Gatos" className="logo-icon" />
            <h1>A CASA DOS GATOS</h1>
          </div>
          <nav className="nav">
            <button 
              className={currentPage === 'inicio' ? 'active' : ''}
              onClick={() => navigateToPage('inicio')}
            >
              Início
            </button>
            <button 
              className={currentPage === 'sobre' ? 'active' : ''}
              onClick={() => navigateToPage('sobre')}
            >
              Sobre
            </button>
            <div 
              className="nav-item dropdown"
              onMouseEnter={() => setCatshopMenuOpen(true)}
              onMouseLeave={() => setCatshopMenuOpen(false)}
            >
              <button 
                className={currentPage === 'catshop' ? 'active' : ''}
                onClick={() => navigateToPage('catshop', 'Todos')}
              >
                Catshop
              </button>
              {isCatshopMenuOpen && (
                <div className="dropdown-menu">
                  {['Todos', ...Array.from(new Set(products.map(p => p.category))).filter((c): c is string => c !== undefined)].map(category => (
                    <button 
                      key={category} 
                      className={selectedCategory === category ? 'active' : ''}
                      onClick={() => {
                        navigateToPage('catshop', category);
                        setCatshopMenuOpen(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              className={currentPage === 'clinica' ? 'active' : ''}
              onClick={() => navigateToPage('clinica')}
            >
              Clínica
            </button>
            <button 
              className={currentPage === 'contato' ? 'active' : ''}
              onClick={() => navigateToPage('contato')}
            >
              Contato
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo da página atual */}
      <main className="main-content">
        {renderCurrentPage()}
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
                      <div className="footer-logo logo">
            <img src="/logo editada.png" alt="Logo" className="logo-icon" />
            <h1>A CASA DOS GATOS</h1>
          </div>
            
            <div className="footer-social">
              <button onClick={() => sendWhatsApp()}>
                <img src={`${process.env.PUBLIC_URL}/whats.png`} alt="WhatsApp" />
              </button>
              <button onClick={() => window.open(instagramUrl, '_blank')}>
                <img src={`${process.env.PUBLIC_URL}/insta.png`} alt="Instagram" />
              </button>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 A Casa dos Gatos. Todos os direitos reservados.</p>
            <p>Clínica veterinária exclusiva para felinos - Lages/SC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
