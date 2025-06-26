import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('inicio');

  // Função para navegar entre páginas
  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = '5549998380557'; // Substitua pelo número real
  const instagramUrl = 'https://www.instagram.com/acasadosgatos.lages/'; // Substitua pela URL real

  const products = [
    {
      id: 1,
      name: 'Ração Premium Felina',
      description: 'Ração super premium para gatos adultos',
      image: '🍽️',
      price: 'R$ 89,90'
    },
    {
      id: 2,
      name: 'Arranhador Torre',
      description: 'Arranhador vertical com múltiplos níveis',
      image: '🏗️',
      price: 'R$ 159,90'
    },
    {
      id: 3,
      name: 'Cama Aconchegante',
      description: 'Cama macia e confortável para gatos adultos',
      image: '🛏️',
      price: 'R$ 79,90'
    },
    {
      id: 4,
      name: 'Brinquedo Interativo',
      description: 'Brinquedo estimulante para exercícios diários',
      image: '🎾',
      price: 'R$ 29,90'
    },
    {
      id: 5,
      name: 'Coleira Elegante',
      description: 'Coleira ajustável com design moderno e confortável',
      image: '🎀',
      price: 'R$ 24,90'
    },
    {
      id: 6,
      name: 'Casa de Brincar',
      description: 'Casinha divertida para entretenimento e brincadeira',
      image: '🏠',
      price: 'R$ 129,90'
    },
    {
      id: 7,
      name: 'Fonte Automática',
      description: 'Fonte com filtro para água sempre fresca e limpa',
      image: '⛲',
      price: 'R$ 199,90'
    },
    {
      id: 8,
      name: 'Kit Higiene Completo',
      description: 'Shampoo, condicionador e escova para cuidados especiais',
      image: '🧴',
      price: 'R$ 69,90'
    },
    {
      id: 9,
      name: 'Transportadora Confort',
      description: 'Caixa de transporte segura e confortável para viagens',
      image: '🎒',
      price: 'R$ 149,90'
    },
    {
      id: 10,
      name: 'Comedouro Duplo Inox',
      description: 'Comedouro e bebedouro em aço inoxidável antiderrapante',
      image: '🥣',
      price: 'R$ 45,90'
    },
    {
      id: 11,
      name: 'Túnel de Brincar',
      description: 'Túnel dobrável para diversão e exercícios',
      image: '🌀',
      price: 'R$ 89,90'
    },
    {
      id: 12,
      name: 'Petisco Natural Premium',
      description: 'Snacks naturais e saudáveis para recompensas',
      image: '🦴',
      price: 'R$ 34,90'
    },
    {
      id: 13,
      name: 'Tapete Sanitário',
      description: 'Tapete absorvente para higiene e limpeza',
      image: '🧽',
      price: 'R$ 19,90'
    },
    {
      id: 14,
      name: 'Bola Interativa LED',
      description: 'Bola com luzes LED para brincadeiras noturnas',
      image: '💡',
      price: 'R$ 39,90'
    },
    {
      id: 15,
      name: 'Rede de Descanso',
      description: 'Rede suspensa confortável para relaxamento',
      image: '🕸️',
      price: 'R$ 79,90'
    },
    {
      id: 16,
      name: 'Spray Calmante',
      description: 'Spray natural para reduzir stress e ansiedade',
      image: '💨',
      price: 'R$ 54,90'
    },
    {
      id: 17,
      name: 'Escova Massageadora',
      description: 'Escova com cerdas macias para massagem relaxante',
      image: '🪮',
      price: 'R$ 29,90'
    },
    {
      id: 18,
      name: 'Comedouro Elevado',
      description: 'Comedouro ergonômico em altura ideal',
      image: '🏔️',
      price: 'R$ 89,90'
    },
    {
      id: 19,
      name: 'Manta Térmica',
      description: 'Manta aquecida para conforto nos dias frios',
      image: '🔥',
      price: 'R$ 119,90'
    },
    {
      id: 20,
      name: 'Laser Pointer',
      description: 'Ponteiro laser para exercícios e diversão',
      image: '🔴',
      price: 'R$ 24,90'
    },
    {
      id: 21,
      name: 'Vitamina Multifuncional',
      description: 'Suplemento vitamínico para saúde completa',
      image: '💊',
      price: 'R$ 64,90'
    },
    {
      id: 22,
      name: 'Arranhador Compacto',
      description: 'Arranhador pequeno para espaços reduzidos',
      image: '📐',
      price: 'R$ 49,90'
    },
    {
      id: 23,
      name: 'Shampoo Antipulgas',
      description: 'Shampoo especial para prevenção de pulgas',
      image: '🧼',
      price: 'R$ 39,90'
    },
    {
      id: 24,
      name: 'Brinquedo Pena',
      description: 'Varinha com penas para estimular caça',
      image: '🪶',
      price: 'R$ 19,90'
    },
    {
      id: 25,
      name: 'Caixa de Areia Premium',
      description: 'Areia sanitária de alta absorção',
      image: '📦',
      price: 'R$ 34,90'
    },
    {
      id: 26,
      name: 'Colchonete Ortopédico',
      description: 'Colchão especial para gatos idosos',
      image: '🛌',
      price: 'R$ 159,90'
    },
    {
      id: 27,
      name: 'Dispensador de Ração',
      description: 'Alimentador automático programável',
      image: '⏰',
      price: 'R$ 179,90'
    },
    {
      id: 28,
      name: 'Escada para Gatos',
      description: 'Escada dobrável para acesso a alturas',
      image: '🪜',
      price: 'R$ 89,90'
    },
    {
      id: 29,
      name: 'Kit Dental Felino',
      description: 'Escova e pasta para higiene bucal',
      image: '🦷',
      price: 'R$ 44,90'
    },
    {
      id: 30,
      name: 'Bolsa Transporte Luxo',
      description: 'Bolsa elegante para transporte confortável',
      image: '👜',
      price: 'R$ 229,90'
    },
    {
      id: 31,
      name: 'Ração Filhote Premium',
      description: 'Ração especial para gatinhos até 12 meses',
      image: '🍼',
      price: 'R$ 94,90'
    },
    {
      id: 32,
      name: 'Brinquedo Ratinho',
      description: 'Ratinho de pelúcia com catnip natural',
      image: '🐭',
      price: 'R$ 14,90'
    },
    {
      id: 33,
      name: 'Perfume Felino',
      description: 'Perfume suave e seguro para gatos',
      image: '🌸',
      price: 'R$ 49,90'
    },
    {
      id: 34,
      name: 'Comedouro Automático',
      description: 'Comedouro com timer e porções controladas',
      image: '🤖',
      price: 'R$ 299,90'
    },
    {
      id: 35,
      name: 'Corda Sisal Natural',
      description: 'Corda para arranhadores e brinquedos',
      image: '🪢',
      price: 'R$ 29,90'
    },
    {
      id: 36,
      name: 'Almofada Relaxante',
      description: 'Almofada com ervas calmantes naturais',
      image: '🌿',
      price: 'R$ 69,90'
    },
    {
      id: 37,
      name: 'Bebedouro Cascata',
      description: 'Fonte de água em cascata com filtro',
      image: '🏞️',
      price: 'R$ 189,90'
    },
    {
      id: 38,
      name: 'Kit Primeiros Socorros',
      description: 'Kit básico para emergências felinas',
      image: '🏥',
      price: 'R$ 79,90'
    },
    {
      id: 39,
      name: 'Bola Massageadora',
      description: 'Bola com texturas para automassagem',
      image: '⚽',
      price: 'R$ 34,90'
    },
    {
      id: 40,
      name: 'Casinha Iglu',
      description: 'Casa em formato iglu para descanso',
      image: '🏠',
      price: 'R$ 149,90'
    },
    {
      id: 41,
      name: 'Spray Educativo',
      description: 'Spray para educar comportamentos',
      image: '📚',
      price: 'R$ 39,90'
    },
    {
      id: 42,
      name: 'Rede Protetora',
      description: 'Rede de segurança para janelas e sacadas',
      image: '🕷️',
      price: 'R$ 89,90'
    },
    {
      id: 43,
      name: 'Termômetro Digital',
      description: 'Termômetro específico para felinos',
      image: '🌡️',
      price: 'R$ 59,90'
    },
    {
      id: 44,
      name: 'Brinquedo Eletrônico',
      description: 'Brinquedo com movimento automático',
      image: '🔋',
      price: 'R$ 79,90'
    },
    {
      id: 45,
      name: 'Caixa Sanitária Fechada',
      description: 'Banheiro fechado com filtro de odor',
      image: '🚽',
      price: 'R$ 119,90'
    },
    {
      id: 46,
      name: 'Suplemento Pelo',
      description: 'Vitamina para pelagem brilhante',
      image: '✨',
      price: 'R$ 54,90'
    },
    {
      id: 47,
      name: 'Arranhador Vertical',
      description: 'Torre arranhador de 1,5m de altura',
      image: '🗼',
      price: 'R$ 249,90'
    },
    {
      id: 48,
      name: 'Coleira GPS',
      description: 'Coleira com rastreamento por GPS',
      image: '🛰️',
      price: 'R$ 199,90'
    },
    {
      id: 49,
      name: 'Tapete Aquecido',
      description: 'Tapete com aquecimento elétrico seguro',
      image: '🔥',
      price: 'R$ 139,90'
    },
    {
      id: 50,
      name: 'Kit Beleza Completo',
      description: 'Kit com todos os itens para estética',
      image: '💅',
      price: 'R$ 89,90'
    },
    {
      id: 51,
      name: 'Brinquedo Inteligente',
      description: 'Brinquedo que responde ao movimento',
      image: '🧠',
      price: 'R$ 129,90'
    },
    {
      id: 52,
      name: 'Cama Ortopédica Luxo',
      description: 'Cama premium com espuma viscoelástica',
      image: '👑',
      price: 'R$ 299,90'
    },
    {
      id: 53,
      name: 'Sistema de Câmeras',
      description: 'Câmera para monitorar seu gato remotamente',
      image: '📹',
      price: 'R$ 399,90'
    },
    {
      id: 54,
      name: 'Kit Completo Iniciante',
      description: 'Kit com tudo para novos tutores',
      image: '🎁',
      price: 'R$ 199,90'
    },
    {
      id: 55,
      name: 'Ração Sênior Premium',
      description: 'Ração especial para gatos idosos',
      image: '👴',
      price: 'R$ 109,90'
    },
    {
      id: 56,
      name: 'Brinquedo Varinha Mágica',
      description: 'Varinha com penas coloridas e guizo',
      image: '🪄',
      price: 'R$ 24,90'
    },
    {
      id: 57,
      name: 'Shampoo Antipulgas',
      description: 'Shampoo natural contra pulgas e carrapatos',
      image: '🧴',
      price: 'R$ 44,90'
    },
    {
      id: 58,
      name: 'Casa Árvore Gigante',
      description: 'Arranhador em formato de árvore 2m',
      image: '🌳',
      price: 'R$ 599,90'
    },
    {
      id: 59,
      name: 'Comedouro Elevado Duplo',
      description: 'Comedouro duplo em altura ergonômica',
      image: '🥣',
      price: 'R$ 89,90'
    },
    {
      id: 60,
      name: 'Bola Dispensadora',
      description: 'Bola que libera petiscos durante o jogo',
      image: '🎾',
      price: 'R$ 49,90'
    },
    {
      id: 61,
      name: 'Kit Dental Completo',
      description: 'Escova, pasta e brinquedos dentais',
      image: '🦷',
      price: 'R$ 64,90'
    },
    {
      id: 62,
      name: 'Mochila Transporte',
      description: 'Mochila ergonômica para transporte',
      image: '🎒',
      price: 'R$ 179,90'
    },
    {
      id: 63,
      name: 'Túnel Dobrável',
      description: 'Túnel de brincar dobrável e portátil',
      image: '🚇',
      price: 'R$ 59,90'
    },
    {
      id: 64,
      name: 'Vitamina Multifuncional',
      description: 'Complexo vitamínico completo',
      image: '💊',
      price: 'R$ 74,90'
    },
    {
      id: 65,
      name: 'Escada para Cama',
      description: 'Escada dobrável para acesso a móveis',
      image: '🪜',
      price: 'R$ 119,90'
    },
    {
      id: 66,
      name: 'Dispensador de Água',
      description: 'Dispensador automático com sensor',
      image: '🚰',
      price: 'R$ 159,90'
    },
    {
      id: 67,
      name: 'Cama Suspensa',
      description: 'Cama que se fixa em radiadores',
      image: '🛏️',
      price: 'R$ 99,90'
    },
    {
      id: 68,
      name: 'Kit Limpeza Orelhas',
      description: 'Solução e aplicadores para higiene',
      image: '👂',
      price: 'R$ 34,90'
    },
    {
      id: 69,
      name: 'Brinquedo Robô',
      description: 'Robô interativo com controle remoto',
      image: '🤖',
      price: 'R$ 249,90'
    },
    {
      id: 70,
      name: 'Tapete Sanitário',
      description: 'Tapete absorvente descartável',
      image: '🧽',
      price: 'R$ 29,90'
    },
    {
      id: 71,
      name: 'Coleira Antipulgas',
      description: 'Coleira com proteção de 8 meses',
      image: '🔵',
      price: 'R$ 69,90'
    },
    {
      id: 72,
      name: 'Fonte Cerâmica',
      description: 'Fonte de água em cerâmica artesanal',
      image: '🏺',
      price: 'R$ 149,90'
    },
    {
      id: 73,
      name: 'Kit Unhas Completo',
      description: 'Cortador, lima e protetor de unhas',
      image: '💅',
      price: 'R$ 54,90'
    },
    {
      id: 74,
      name: 'Brinquedo Peixe Eletrônico',
      description: 'Peixe que se move sozinho na água',
      image: '🐠',
      price: 'R$ 89,90'
    },
    {
      id: 75,
      name: 'Caixa Areia Automática',
      description: 'Caixa que se limpa automaticamente',
      image: '🔄',
      price: 'R$ 899,90'
    },
    {
      id: 76,
      name: 'Suplemento Articular',
      description: 'Glucosamina para articulações saudáveis',
      image: '🦴',
      price: 'R$ 84,90'
    },
    {
      id: 77,
      name: 'Casa Inteligente',
      description: 'Casa com controle de temperatura',
      image: '🏡',
      price: 'R$ 799,90'
    },
    {
      id: 78,
      name: 'Kit Veterinário Doméstico',
      description: 'Kit completo para cuidados básicos',
      image: '⚕️',
      price: 'R$ 149,90'
    },
    {
      id: 79,
      name: 'Ração Orgânica Premium',
      description: 'Ração 100% orgânica sem conservantes',
      image: '🌱',
      price: 'R$ 129,90'
    },
    {
      id: 80,
      name: 'Brinquedo Caça Laser',
      description: 'Dispositivo automático com laser rotativo',
      image: '🔴',
      price: 'R$ 199,90'
    },
    {
      id: 81,
      name: 'Perfume Desodorante',
      description: 'Spray neutralizador de odores naturais',
      image: '🌺',
      price: 'R$ 39,90'
    },
    {
      id: 82,
      name: 'Torre Arranhador Luxo',
      description: 'Torre de 2,5m com múltiplos níveis',
      image: '🏰',
      price: 'R$ 699,90'
    },
    {
      id: 83,
      name: 'Comedouro Inteligente',
      description: 'Comedouro com app e reconhecimento facial',
      image: '📱',
      price: 'R$ 449,90'
    },
    {
      id: 84,
      name: 'Bola Catnip Gigante',
      description: 'Bola de 15cm recheada com catnip',
      image: '🟢',
      price: 'R$ 34,90'
    },
    {
      id: 85,
      name: 'Kit Spa Completo',
      description: 'Shampoo, condicionador e óleos relaxantes',
      image: '🛁',
      price: 'R$ 89,90'
    },
    {
      id: 86,
      name: 'Transportadora Aérea',
      description: 'Aprovada para viagens de avião',
      image: '✈️',
      price: 'R$ 299,90'
    },
    {
      id: 87,
      name: 'Circuito de Bolinhas',
      description: 'Pista circular com bolinhas coloridas',
      image: '🎪',
      price: 'R$ 79,90'
    },
    {
      id: 88,
      name: 'Suplemento Imunidade',
      description: 'Vitaminas para fortalecer imunidade',
      image: '🛡️',
      price: 'R$ 69,90'
    },
    {
      id: 89,
      name: 'Ponte Suspensa',
      description: 'Ponte de corda para escalada',
      image: '🌉',
      price: 'R$ 119,90'
    },
    {
      id: 90,
      name: 'Bebedouro Gelado',
      description: 'Mantém água sempre fresca',
      image: '🧊',
      price: 'R$ 179,90'
    },
    {
      id: 91,
      name: 'Almofada Térmica',
      description: 'Almofada que mantém temperatura corporal',
      image: '🌡️',
      price: 'R$ 89,90'
    },
    {
      id: 92,
      name: 'Kit Higiene Bucal',
      description: 'Escova elétrica e enxaguante',
      image: '🪥',
      price: 'R$ 74,90'
    },
    {
      id: 93,
      name: 'Brinquedo Pássaro Voador',
      description: 'Pássaro eletrônico que voa pela casa',
      image: '🦅',
      price: 'R$ 159,90'
    },
    {
      id: 94,
      name: 'Caixa Areia Biodegradável',
      description: 'Areia ecológica 100% natural',
      image: '♻️',
      price: 'R$ 49,90'
    },
    {
      id: 95,
      name: 'Coleira Luminosa LED',
      description: 'Coleira com luzes LED recarregáveis',
      image: '💡',
      price: 'R$ 59,90'
    },
    {
      id: 96,
      name: 'Fonte Cascata Premium',
      description: 'Fonte de aço inox com 3 níveis',
      image: '⛲',
      price: 'R$ 249,90'
    },
    {
      id: 97,
      name: 'Kit Manicure Profissional',
      description: 'Cortador elétrico e lixas especiais',
      image: '✂️',
      price: 'R$ 94,90'
    },
    {
      id: 98,
      name: 'Brinquedo Aquário Virtual',
      description: 'Tela com peixes virtuais interativos',
      image: '🐟',
      price: 'R$ 299,90'
    },
    {
      id: 99,
      name: 'Sistema Limpeza Automática',
      description: 'Robô aspirador para pelos de gato',
      image: '🤖',
      price: 'R$ 1299,90'
    },
    {
      id: 100,
      name: 'Kit Luxo Completo',
      description: 'Conjunto premium com 20 itens essenciais',
      image: '👑',
      price: 'R$ 999,90'
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
                <span>🏥</span>
                <h3>Clínica Especializada</h3>
                <p>Atendimento exclusivo para felinos</p>
              </div>
              <div className="feature">
                <span>🛍️</span>
                <h3>Catshop Completa</h3>
                <p>Produtos selecionados para gatos</p>
              </div>
              <div className="feature">
                <span>❤️</span>
                <h3>Cuidado Humanizado</h3>
                <p>Tratamento com carinho e respeito</p>
              </div>
              <div className="feature">
                <span>🐾</span>
                <h3>Ambiente acolhedor</h3>
                <p>Espaço confortável para os felinos</p>
              </div>
              <div className="feature">
                <span>😻</span>
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
  const CatshopPage = () => (
    <section className="catshop">
      <div className="container">
        <h2>Catshop - Produtos Exclusivos</h2>
        <p className="section-subtitle">Tudo que seu gatinho precisa em um só lugar</p>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span>{product.image}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-price">{product.price}</div>
              <button 
                className="buy-button"
                onClick={() => sendWhatsApp(product.name)}
              >
                <span>💬</span> Comprar pelo WhatsApp
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Componente da página Clínica
  const ClinicaPage = () => (
    <section className="clinic">
      <div className="container">
        <h2>Clínica Felina</h2>
        <div className="clinic-highlight">
          <h3>"Especialistas em medicina felina. Aqui, seu gato é tratado com carinho e respeito."</h3>
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
    <section className="contact">
      <div className="container">
        <h2>Contato</h2>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <span>📍</span>
              <div>
                <h4>Endereço</h4>
                <p>Rua Francisco de Paula Ramos, 104<br/>Lages - SC – 88523-020</p>
              </div>
            </div>
            
            <div className="contact-buttons">
              <button className="contact-button whatsapp" onClick={() => sendWhatsApp()}>
                <span>💬</span> WhatsApp
              </button>
              <button 
                className="contact-button instagram"
                onClick={() => window.open(instagramUrl, '_blank')}
              >
                <span>📸</span> Instagram
              </button>
            </div>

            <div className="hours">
              <h4>Horário de Funcionamento</h4>
              <p>Segunda a Sexta: 8h às 18h<br/>Sábado: 8h às 12h</p>
            </div>
          </div>
          
          <div className="map-placeholder">
            <span>🗺️</span>
            <p>Mapa da localização</p>
            <small>Rua Francisco de Paula Ramos, 104 - Lages/SC</small>
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
        return <CatshopPage />;
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
            <button 
              className={currentPage === 'catshop' ? 'active' : ''}
              onClick={() => navigateToPage('catshop')}
            >
              Catshop
            </button>
            <button 
              className={currentPage === 'clinica' ? 'active' : ''}
              onClick={() => navigateToPage('clinica')}
            >
              Clínica Felina
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
