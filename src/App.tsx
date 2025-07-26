import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo-editada.png';
import './App.css';
import gatinho from './assets/gatinho.png';
import veterinario from './assets/veterinario.png';
import catshop from './assets/catshop.png';
import humanizado from './assets/humanizado.png';
import acolhedor from './assets/acolhedor.png';
import cuidado from './assets/cuidado.png';
import veterinaria from './assets/veterinaria.png';
import whats from './assets/whats.png';
import insta from './assets/insta.png';

// Interfaces para tipagem
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  priceNumber?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: CustomerInfo;
  status: 'pending' | 'confirmed' | 'delivered';
  date: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isCatshopMenuOpen, setCatshopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Estados do E-commerce
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Dados dos depoimentos
  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      text: "A Dra. Manuela é incrível! Minha gatinha Luna foi muito bem cuidada. O ambiente é super acolhedor e especializado em felinos.",
      rating: 5,
      date: "Dezembro 2023"
    },
    {
      id: 2,
      name: "João Santos",
      text: "Produtos de excelente qualidade na Catshop! Meu gato Mimi adora os brinquedos que comprei aqui. Recomendo muito!",
      rating: 5,
      date: "Janeiro 2024"
    },
    {
      id: 3,
      name: "Ana Costa",
      text: "Atendimento excepcional! A clínica realmente entende de gatos. Meu Félix ficou super calmo durante a consulta.",
      rating: 5,
      date: "Novembro 2023"
    }
  ];

  // Dados do FAQ
  const faqData = [
    {
      id: 1,
      question: "Vocês atendem emergências?",
      answer: "Não, nossa clínica não atende emergências. Trabalhamos apenas com consultas agendadas para oferecer o melhor atendimento possível."
    },
    {
      id: 2,
      question: "Qual a idade mínima para vacinar meu gatinho?",
      answer: "A primeira vacinação pode ser feita a partir de 6-8 semanas de idade. Agende uma consulta para avaliarmos o protocolo ideal para seu felino."
    },
    {
      id: 3,
      question: "Vocês fazem entrega dos produtos?",
      answer: "Sim! Entre em contato via WhatsApp para verificar a disponibilidade de entrega na sua região e os valores."
    },
    {
      id: 4,
      question: "Como agendar uma consulta?",
      answer: "Você pode agendar pelo WhatsApp ou telefone. Trabalhamos com horários marcados para garantir um atendimento tranquilo para seu gato."
    },
    {
      id: 5,
      question: "Vocês atendem outros animais além de gatos?",
      answer: "Não, somos especializados exclusivamente em felinos. Isso nos permite oferecer um cuidado mais especializado e um ambiente adequado para gatos."
    }
  ];

  const [openFaqId, setOpenFaqId] = useState<number | null>(null);



  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedOrders = localStorage.getItem('orders');
      
      if (savedCart && savedCart !== 'undefined') {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
          console.log('Carrinho carregado do localStorage:', parsedCart);
        }
      }
      if (savedOrders && savedOrders !== 'undefined') {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      localStorage.removeItem('cart');
      localStorage.removeItem('orders');
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // Salvar carrinho no localStorage (apenas após carregamento inicial)
  useEffect(() => {
    if (isCartLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Carrinho salvo no localStorage:', cart);
      } catch (error) {
        console.error('Erro ao salvar carrinho no localStorage:', error);
      }
    }
  }, [cart, isCartLoaded]);

  // Salvar pedidos no localStorage
  useEffect(() => {
    if (isCartLoaded) {
      try {
        localStorage.setItem('orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Erro ao salvar pedidos no localStorage:', error);
      }
    }
  }, [orders, isCartLoaded]);

  // Função para navegar entre páginas
  const navigateToPage = (page: string, category?: string) => {
    setCurrentPage(page);
    if (page === 'catshop' && category) {
      setSelectedCategory(category);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = '5549998380557';
  const instagramUrl = 'https://www.instagram.com/acasadosgatos.lages/';

  // Função para converter preço string para número
  const parsePrice = (priceString: string): number => {
    return parseFloat(priceString.replace('R$ ', '').replace(',', '.'));
  };

  // Funções do Carrinho
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, priceNumber: parsePrice(product.price) }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const price = item.priceNumber || parsePrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };



  // Função para finalizar pedido
  const finishOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: getCartTotal(),
      customerInfo: { ...customerInfo },
      status: 'pending',
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setOrders([...orders, newOrder]);
    
    // Enviar pedido via WhatsApp
    const orderDetails = cart.map(item => 
      `${item.name} (Qtd: ${item.quantity}) - ${item.price}`
    ).join('\n');
    
    const total = getCartTotal().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    const message = `🛒 *NOVO PEDIDO - A Casa dos Gatos*\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📱 *Telefone:* ${customerInfo.phone}\n` +
      `📧 *Email:* ${customerInfo.email}\n` +
      `📍 *Endereço:* ${customerInfo.address}, ${customerInfo.city} - ${customerInfo.zipCode}\n\n` +
      `🛍️ *Produtos:*\n${orderDetails}\n\n` +
      `💰 *Total:* ${total}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho e fechar checkout
    setCart([]);
    setIsCheckoutOpen(false);
    setCustomerInfo({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      zipCode: ''
    });
    
    alert('Pedido enviado com sucesso! Você será redirecionado para o WhatsApp.');
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



  // Componente da página Início
  const InicioPage = () => (
    <section className="hero">
      <div className="container">
        <div className="hero-image">
          <img src={gatinho} alt="Gatinho" className="cat-image" />
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
                <img src={veterinario} alt="Clínica Especializada" />
                <h3>Clínica Especializada</h3>
                <p>Atendimento exclusivo para felinos</p>
              </div>
              <div className="feature">
                <img src={catshop} alt="Catshop Completa" />
                <h3>Catshop Completa</h3>
                <p>Produtos selecionados para gatos</p>
              </div>
              <div className="feature">
                <img src={humanizado} alt="Cuidado Humanizado" />
                <h3>Cuidado Humanizado</h3>
                <p>Tratamento com carinho e respeito</p>
              </div>
              <div className="feature">
                <img src={acolhedor} alt="Ambiente acolhedor" />
                <h3>Ambiente acolhedor</h3>
                <p>Espaço confortável para os felinos</p>
              </div>
              <div className="feature">
                <img src={cuidado} alt="Gatos bem cuidados" />
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
  const CatshopPage = ({ categories }: { categories: string[] }) => {
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
                <div className="product-actions">
                  <button onClick={() => addToCart(product)} className="add-to-cart-button">
                    Adicionar ao Carrinho
                  </button>
                  <button onClick={() => {
                    const message = `Olá! Tenho interesse no produto: ${product.name}, no valor de ${product.price}.`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                    window.open(whatsappUrl, '_blank');
                  }} className="buy-button">
                    Comprar pelo WhatsApp
                  </button>
                </div>
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
            <img src={veterinaria} alt="Dra. Fulana de Tal" className="vet-photo" />
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

  // Componente da página Depoimentos
  const DepoimentosPage = () => (
    <section className="testimonials">
      <div className="container">
        <h2>💬 O que nossos clientes dizem</h2>
        <p className="section-subtitle">Depoimentos reais de tutores que confiam em nosso trabalho</p>
        
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="customer-info">
                  <h4>{testimonial.name}</h4>
                  <span className="date">{testimonial.date}</span>
                </div>
                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
        
        <div className="testimonial-cta">
          <p>Quer compartilhar sua experiência conosco?</p>
          <button 
            className="whatsapp-button"
            onClick={() => {
              const message = "Olá! Gostaria de deixar um depoimento sobre minha experiência na Casa dos Gatos.";
              const encodedMessage = encodeURIComponent(message);
              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            📱 Envie seu depoimento
          </button>
        </div>
      </div>
    </section>
  );

  // Componente da página FAQ
  const FaqPage = () => (
    <section className="faq">
      <div className="container">
        <h2>❓ Perguntas Frequentes</h2>
        <p className="section-subtitle">Tire suas dúvidas sobre nossos serviços e cuidados felinos</p>
        
        <div className="faq-list">
          {faqData.map(faq => (
            <div key={faq.id} className="faq-item">
              <button 
                className={`faq-question ${openFaqId === faq.id ? 'active' : ''}`}
                onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openFaqId === faq.id ? '−' : '+'}</span>
              </button>
              {openFaqId === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="faq-cta">
          <p>Não encontrou a resposta que procurava?</p>
          <button 
            className="whatsapp-button"
            onClick={() => {
              const message = "Olá! Tenho uma dúvida que não encontrei no FAQ do site.";
              const encodedMessage = encodeURIComponent(message);
              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            📱 Fale conosco
          </button>
        </div>
      </div>
    </section>
  );

  // Componente da página Contato
  const ContatoPage = () => (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2>🐾 Entre em Contato Conosco</h2>
          <p className="contact-subtitle">Estamos sempre prontos para cuidar do seu felino com muito amor e carinho!</p>
        </div>
        
        <div className="contact-grid">
          {/* Card de Informações */}
          <div className="contact-card info-card">
            <div className="card-header">
              <span className="card-icon">📞</span>
              <h3>Fale Conosco</h3>
            </div>
            <div className="contact-methods">
              <div className="contact-method">
                <img src={whats} alt="WhatsApp" className="method-icon" />
                <div className="method-info">
                  <h4>WhatsApp</h4>
                  <p>(49) 99838-0557</p>
                  <a href="https://wa.me/5549998380557" className="btn-contact btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    💬 Conversar Agora
                  </a>
                </div>
              </div>
              
              <div className="contact-method">
                <img src={insta} alt="Instagram" className="method-icon" />
                <div className="method-info">
                  <h4>Instagram</h4>
                  <p>@acasadosgatos.lages</p>
                  <a href="https://www.instagram.com/acasadosgatos.lages/" className="btn-contact btn-instagram" target="_blank" rel="noopener noreferrer">
                    📸 Seguir no Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card de Horários */}
          <div className="contact-card schedule-card">
            <div className="card-header">
              <span className="card-icon">🕒</span>
              <h3>Horário de Funcionamento</h3>
            </div>
            <div className="schedule-list">
              <div className="schedule-item">
                <span className="day">Segunda a Sexta</span>
                <span className="time">9h às 18h</span>
              </div>
              <div className="schedule-item">
                <span className="day">Sábado</span>
                <span className="time">9h às 13h</span>
              </div>
              <div className="schedule-item closed">
                <span className="day">Domingo</span>
                <span className="time">Fechado</span>
              </div>
            </div>
          </div>

          {/* Card do Mapa */}
          <div className="contact-card map-card">
            <div className="card-header">
              <span className="card-icon">📍</span>
              <h3>Nossa Localização</h3>
            </div>
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps?q=Rua+Francisco+de+Paula+Ramos,+104,+Lages,+SC,+88523-020&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '15px' }}
                allowFullScreen={true}
                loading="lazy"
                title="Localização da A Casa dos Gatos - Rua Francisco de Paula Ramos, 104, Lages"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Seção de Call to Action */}
        <div className="contact-cta">
          <div className="cta-content">
            <h3>🐱 Pronto para cuidar do seu felino?</h3>
            <p>Entre em contato conosco e agende uma consulta ou tire suas dúvidas!</p>
            <div className="cta-buttons">
              <a href="https://wa.me/5549998380557" className="btn-cta primary" target="_blank" rel="noopener noreferrer">
                📱 Conversar pelo WhatsApp
              </a>
              <a href="https://www.instagram.com/acasadosgatos.lages/" className="btn-cta secondary" target="_blank" rel="noopener noreferrer">
                📷 Ver no Instagram
              </a>
            </div>
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
        return <CatshopPage categories={['Todos', ...Array.from(new Set(products.map(p => p.category))).filter((c): c is string => c !== undefined)]} />;
      case 'clinica':
        return <ClinicaPage />;
      case 'depoimentos':
        return <DepoimentosPage />;
      case 'faq':
        return <FaqPage />;
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
            <img src={logo} alt="Logo A Casa dos Gatos" className="logo-icon" />
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
              className={currentPage === 'depoimentos' ? 'active' : ''}
              onClick={() => navigateToPage('depoimentos')}
            >
              Depoimentos
            </button>
            <button 
              className={currentPage === 'faq' ? 'active' : ''}
              onClick={() => navigateToPage('faq')}
            >
              FAQ
            </button>
            <button 
              className={currentPage === 'contato' ? 'active' : ''}
              onClick={() => navigateToPage('contato')}
            >
              Contato
            </button>
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(true)}
            >
              🛒 Carrinho ({getCartItemsCount()})
            </button>
          </nav>
        </div>
      </header>

      {/* Conteúdo da página atual */}
      <main className="main-content">
        {renderCurrentPage()}
      </main>

      {/* Modal do Carrinho */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>🛒 Seu Carrinho</h2>
              <button className="close-button" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            
            <div className="cart-content">
              {cart.length === 0 ? (
                <p className="empty-cart">Seu carrinho está vazio</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <span className="item-emoji">{item.image}</span>
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>{item.price}</p>
                          </div>
                        </div>
                        <div className="item-controls">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          <button className="remove-button" onClick={() => removeFromCart(item.id)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-footer">
                    <div className="cart-total">
                      <strong>Total: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                    </div>
                    
                    <div className="cart-actions">
                      <button className="continue-shopping" onClick={() => setIsCartOpen(false)}>
                        Continuar Comprando
                      </button>
                      <button className="checkout-button" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>
                        Finalizar Pedido
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal do Checkout */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header">
              <h2>📋 Finalizar Pedido</h2>
              <button className="close-button" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>
            
            <div className="checkout-content">
              <div className="customer-form">
                <h3>Dados do Cliente</h3>
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Endereço *</label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cidade *</label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CEP *</label>
                    <input
                      type="text"
                      value={customerInfo.zipCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="order-summary">
                <h3>Resumo do Pedido</h3>
                <div className="summary-items">
                  {cart.map(item => (
                    <div key={item.id} className="summary-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(parsePrice(item.price) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <strong>Total: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
              </div>
              
              <div className="checkout-actions">
                <button 
                  className="finish-order-button"
                  onClick={finishOrder}
                  disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.city || !customerInfo.zipCode}
                >
                  Enviar Pedido via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo logo">
              <img src={logo} alt="Logo" className="logo-icon" />
              <h1>A CASA DOS GATOS</h1>
            </div>
            
            <div className="footer-social">
              <button onClick={() => {
                const message = 'Olá! Gostaria de mais informações sobre os serviços da Casa dos Gatos.';
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                window.open(whatsappUrl, '_blank');
              }}>
                <img src={whats} alt="WhatsApp" />
              </button>
              <button onClick={() => window.open(instagramUrl, '_blank')}>
                <img src={insta} alt="Instagram" />
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
