import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

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
  const [isCatshopMenuOpen, setCatshopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Estados do E-commerce
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [pixExpirationTime, setPixExpirationTime] = useState(15);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

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

  // Função para processar pagamento com sucesso
  const handlePaymentSuccess = (paymentMethod: string, details?: string) => {
    // Limpar carrinho
    setCart([]);
    
    // Fechar todos os modais
    setIsPaymentModalOpen(false);
    setIsPaymentDetailsOpen(false);
    setIsCheckoutOpen(false);
    
    // Resetar estados
    setSelectedPaymentMethod('');
    setPixExpirationTime(15);
    setCardData({ number: '', name: '', expiry: '', cvv: '', installments: '1' });
    
    // Mostrar modal de sucesso
    setIsPaymentSuccess(true);
    
    // Fechar modal de sucesso após 3 segundos
    setTimeout(() => {
      setIsPaymentSuccess(false);
    }, 3000);
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

  // Função WhatsApp individual (mantida para compatibilidade)
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
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContent = () => {
    if (currentPage === 'home') {
      return (
        <div className="main-content">
          <div className="banner-container">
            <div className="banner-content">
              <h1>Bem-vindo à A Casa dos Gatos!</h1>
              <p>Onde cada miado é um pedido de amor e cada ronronar é uma recompensa.</p>
              <button onClick={() => navigateToPage('products')}>Ver Produtos</button>
            </div>
          </div>

          <div className="info-bar">
            <div className="info-item">
              <img src="/path/to/acolhedor.png" alt="Acolhedor" />
              <h3>Acolhedor</h3>
              <p>Ambiente pensado para o bem-estar do seu felino.</p>
            </div>
            <div className="info-item">
              <img src="/path/to/humanizado.png" alt="Humanizado" />
              <h3>Humanizado</h3>
              <p>Atendimento que entende e respeita seu pet.</p>
            </div>
            <div className="info-item">
              <img src="/path/to/cuidado.png" alt="Cuidado" />
              <h3>Cuidado</h3>
              <p>Produtos e serviços de alta qualidade.</p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Agende uma Consulta Veterinária</h2>
            <p>Cuidamos da saúde do seu gato com a mesma dedicação que você.</p>
            <button onClick={() => navigateToPage('contact')}>Agendar Agora</button>
          </div>
        </div>
      );
    } else if (currentPage === 'products') {
      return (
        <div className="products-page">
          <aside className="category-sidebar">
            <h3>Categorias</h3>
            <ul>
              {['Todos', 'Alimentação', 'Brinquedos', 'Acessórios', 'Conforto', 'Higiene', 'Saúde', 'Para Donos'].map(category => (
                <li 
                  key={category} 
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>
          <main className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price}</p>
                <div className="product-buttons">
                  <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
                  <button onClick={() => handleWhatsAppPurchase(product.name, product.price)}>Comprar via WhatsApp</button>
                </div>
              </div>
            ))}
          </main>
        </div>
      );
    } else if (currentPage === 'about') {
      return (
        <div className="about-page">
          <h2>Sobre Nós</h2>
          <p>A Casa dos Gatos nasceu da paixão por felinos e do desejo de oferecer um espaço completo para o bem-estar e a felicidade dos nossos amigos de quatro patas.</p>
          <p>Nossa missão é proporcionar produtos de alta qualidade, serviços especializados e um atendimento humanizado, sempre pensando no conforto e na segurança dos gatos.</p>
          <p>Contamos com uma equipe de veterinários e especialistas em comportamento felino para garantir o melhor cuidado para o seu pet.</p>
        </div>
      );
    } else if (currentPage === 'contact') {
      return (
        <div className="contact-page">
          <h2>Contato</h2>
          <p><strong>Endereço:</strong> Rua dos Gatos, 123 - Bairro dos Felinos, Lages/SC</p>
          <p><strong>Telefone:</strong> (49) 99838-0557</p>
          <p><strong>Email:</strong> contato@acasadosgatos.com</p>
          <div className="social-media">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header>
        <div className="logo-container">
          <img src="/path/to/catshop.png" alt="Catshop Logo" className="logo" />
          <h1>A Casa dos Gatos</h1>
        </div>
        <div className="header-icons">
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="cart-icon-container" onClick={() => setIsCartOpen(!isCartOpen)}>
            <span role="img" aria-label="cart">🛒</span>
            {getCartItemsCount() > 0 && <span className="cart-badge">{getCartItemsCount()}</span>}
          </div>
          <button className="menu-toggle" onClick={() => setCatshopMenuOpen(!isCatshopMenuOpen)}>☰</button>
        </div>
      </header>

      <nav className={`catshop-menu ${isCatshopMenuOpen ? 'open' : ''}`}>
        <button onClick={() => setCatshopMenuOpen(false)} className="close-menu-btn">×</button>
        <a href="#" onClick={() => { navigateToPage('home'); setCatshopMenuOpen(false); }}>Home</a>
        <a href="#" onClick={() => { navigateToPage('products'); setCatshopMenuOpen(false); }}>Produtos</a>
        <a href="#" onClick={() => { navigateToPage('about'); setCatshopMenuOpen(false); }}>Sobre Nós</a>
        <a href="#" onClick={() => { navigateToPage('contact'); setCatshopMenuOpen(false); }}>Contato</a>
      </nav>

      {renderContent()}

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>×</button>
            <h2>Seu Carrinho</h2>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      min="1"
                    />
                    <span>{item.price}</span>
                    <button onClick={() => removeFromCart(item.id)}>Remover</button>
                  </div>
                ))}
                <div className="cart-total">
                  <strong>Total: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>
                <button className="checkout-btn" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>Finalizar Compra</button>
              </>
            )}
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="checkout-modal">
          <div className="checkout-content">
            <button className="close-checkout-btn" onClick={() => setIsCheckoutOpen(false)}>×</button>
            <h2>Checkout</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsPaymentModalOpen(true); }}>
              <h3>Informações do Cliente</h3>
              <input type="text" placeholder="Nome Completo" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} required />
              <input type="tel" placeholder="Telefone" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} required />
              <input type="email" placeholder="Email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} required />
              <input type="text" placeholder="Endereço" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} required />
              <input type="text" placeholder="Cidade" value={customerInfo.city} onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})} required />
              <input type="text" placeholder="CEP" value={customerInfo.zipCode} onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})} required />
              <button type="submit">Ir para Pagamento</button>
            </form>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="payment-modal">
          <div className="payment-content">
            <button className="close-payment-btn" onClick={() => setIsPaymentModalOpen(false)}>×</button>
            <h2>Forma de Pagamento</h2>
            <div className="payment-options">
              <button onClick={() => { setSelectedPaymentMethod('pix'); setIsPaymentDetailsOpen(true); }}>PIX</button>
              <button onClick={() => { setSelectedPaymentMethod('card'); setIsPaymentDetailsOpen(true); }}>Cartão de Crédito</button>
            </div>
          </div>
        </div>
      )}

      {isPaymentDetailsOpen && (
        <div className="payment-details-modal">
          <div className="payment-details-content">
            <button className="close-payment-details-btn" onClick={() => setIsPaymentDetailsOpen(false)}>×</button>
            {selectedPaymentMethod === 'pix' && (
              <div className="pix-details">
                <h3>Pagamento com PIX</h3>
                <p>Escaneie o QR Code abaixo:</p>
                <img src="/path/to/qrcode.png" alt="PIX QR Code" />
                <p>Ou use a chave: <strong>123.456.789-00</strong></p>
                <p>Tempo de expiração: {pixExpirationTime} segundos</p>
                <button onClick={() => handlePaymentSuccess('pix')}>Confirmar Pagamento</button>
              </div>
            )}
            {selectedPaymentMethod === 'card' && (
              <div className="card-details">
                <h3>Pagamento com Cartão</h3>
                <input type="text" placeholder="Número do Cartão" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} required />
                <input type="text" placeholder="Nome no Cartão" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} required />
                <input type="text" placeholder="Validade (MM/AA)" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} required />
                <input type="text" placeholder="CVV" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} required />
                <select value={cardData.installments} onChange={(e) => setCardData({...cardData, installments: e.target.value})}>
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                </select>
                <button onClick={() => handlePaymentSuccess('card')}>Pagar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isPaymentSuccess && (
        <div className="payment-success-modal">
          <div className="payment-success-content">
            <h3>Pagamento Aprovado!</h3>
            <p>Seu pedido foi recebido e está sendo processado.</p>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2024 A Casa dos Gatos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
  const [isCatshopMenuOpen, setCatshopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Estados do E-commerce
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [pixExpirationTime, setPixExpirationTime] = useState(15);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

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

  // Função para processar pagamento com sucesso
  const handlePaymentSuccess = (paymentMethod: string, details?: string) => {
    // Limpar carrinho
    setCart([]);
    
    // Fechar todos os modais
    setIsPaymentModalOpen(false);
    setIsPaymentDetailsOpen(false);
    setIsCheckoutOpen(false);
    
    // Resetar estados
    setSelectedPaymentMethod('');
    setPixExpirationTime(15);
    setCardData({ number: '', name: '', expiry: '', cvv: '', installments: '1' });
    
    // Mostrar modal de sucesso
    setIsPaymentSuccess(true);
    
    // Fechar modal de sucesso após 3 segundos
    setTimeout(() => {
      setIsPaymentSuccess(false);
    }, 3000);
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

  // Função WhatsApp individual (mantida para compatibilidade)
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
                  <button onClick={() => handleWhatsAppPurchase(product.name, product.price)} className="buy-button">
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
                <img src="/whats.png" alt="WhatsApp" className="method-icon" />
                <div className="method-info">
                  <h4>WhatsApp</h4>
                  <p>(49) 99838-0557</p>
                  <a href="https://wa.me/5549998380557" className="btn-contact btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    💬 Conversar Agora
                  </a>
                </div>
              </div>
              
              <div className="contact-method">
                <img src="/insta.png" alt="Instagram" className="method-icon" />
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
                {/* Botão Continuar compra para forma de pagamento */}
                <button 
                  className="continue-purchase-payment-btn"
                  onClick={() => {
                    setIsPaymentModalOpen(true);
                  }}
                >
                  💳 Continuar compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso do Pagamento */}
      {isPaymentSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-content">
              <div className="success-icon">✅</div>
              <h2>Pagamento efetuado com sucesso!</h2>
              <p>Obrigado pela sua compra. Seu pedido foi processado com sucesso.</p>
              <div className="success-animation">
                <div className="checkmark">
                  <div className="checkmark-circle"></div>
                  <div className="checkmark-stem"></div>
                  <div className="checkmark-kick"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formas de Pagamento */}
      {isPaymentModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            {!isPaymentDetailsOpen ? (
              <>
                <div className="payment-header">
                  <h2>💳 Escolha a Forma de Pagamento</h2>
                  <button className="close-button" onClick={() => setIsPaymentModalOpen(false)}>✕</button>
                </div>
                
                <div className="payment-content">
                  <div className="payment-options">
                    <div 
                      className={`payment-option ${selectedPaymentMethod === 'pix' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('pix')}
                    >
                      <div className="payment-icon">🏦</div>
                      <div className="payment-info">
                        <h3>PIX</h3>
                        <p>Pagamento instantâneo</p>
                        <span className="payment-benefit">Sem taxas</span>
                      </div>
                      <div className="payment-check">
                        {selectedPaymentMethod === 'pix' && '✓'}
                      </div>
                    </div>
                    
                    <div 
                      className={`payment-option ${selectedPaymentMethod === 'credit' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('credit')}
                    >
                      <div className="payment-icon">💳</div>
                      <div className="payment-info">
                        <h3>Cartão de Crédito</h3>
                        <p>Parcelamento disponível</p>
                        <span className="payment-benefit">Até 12x sem juros</span>
                      </div>
                      <div className="payment-check">
                        {selectedPaymentMethod === 'credit' && '✓'}
                      </div>
                    </div>
                    
                    <div 
                      className={`payment-option ${selectedPaymentMethod === 'debit' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('debit')}
                    >
                      <div className="payment-icon">💰</div>
                      <div className="payment-info">
                        <h3>Cartão de Débito</h3>
                        <p>Débito direto na conta</p>
                        <span className="payment-benefit">Aprovação imediata</span>
                      </div>
                      <div className="payment-check">
                        {selectedPaymentMethod === 'debit' && '✓'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="payment-actions">
                    <button 
                      className="back-button"
                      onClick={() => setIsPaymentModalOpen(false)}
                    >
                      Voltar
                    </button>
                    <button 
                      className="confirm-payment-button"
                      onClick={() => {
                        if (selectedPaymentMethod) {
                          setIsPaymentDetailsOpen(true);
                          if (selectedPaymentMethod === 'pix') {
                            // Iniciar countdown do PIX
                            const timer = setInterval(() => {
                              setPixExpirationTime(prev => {
                                if (prev <= 1) {
                                  clearInterval(timer);
                                  return 0;
                                }
                                return prev - 1;
                              });
                            }, 60000); // Decrementa a cada minuto
                          }
                        }
                      }}
                      disabled={!selectedPaymentMethod}
                    >
                      Confirmar Pagamento
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Interface PIX */}
                {selectedPaymentMethod === 'pix' && (
                  <>
                    <div className="payment-header">
                      <h2>🏦 Pagamento via PIX</h2>
                      <button className="close-button" onClick={() => {
                        setIsPaymentModalOpen(false);
                        setIsPaymentDetailsOpen(false);
                        setPixExpirationTime(15);
                      }}>✕</button>
                    </div>
                    
                    <div className="pix-payment-content">
                      <div className="pix-timer">
                        <h3>⏰ Tempo para pagamento: {pixExpirationTime} minutos</h3>
                        {pixExpirationTime === 0 && (
                          <p className="expired-message">QR Code expirado. Gere um novo código.</p>
                        )}
                      </div>
                      
                      <div className="pix-qr-section">
                        <div className="qr-code-placeholder">
                          <div className="qr-code">
                            {/* Aqui seria o QR Code real */}
                            <div className="qr-pattern">
                              <div className="qr-square"></div>
                              <div className="qr-square"></div>
                              <div className="qr-square"></div>
                              <div className="qr-square"></div>
                            </div>
                          </div>
                        </div>
                        <p>Escaneie o QR Code com seu banco</p>
                      </div>
                      
                      <div className="pix-key-section">
                        <h4>Ou copie a chave PIX:</h4>
                        <div className="pix-key-container">
                          <input 
                            type="text" 
                            value="00020126580014BR.GOV.BCB.PIX013636c4b8c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c5204000053039865802BR5925CASA DOS GATOS LAGES6009Lages62070503***6304ABCD"
                            readOnly
                            className="pix-key-input"
                          />
                          <button 
                            className="copy-button"
                            onClick={() => {
                              navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX013636c4b8c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c5204000053039865802BR5925CASA DOS GATOS LAGES6009Lages62070503***6304ABCD");
                              alert('Chave PIX copiada!');
                            }}
                          >
                            📋 Copiar
                          </button>
                        </div>
                      </div>
                      
                      <div className="pix-actions">
                        <button 
                          className="back-button"
                          onClick={() => setIsPaymentDetailsOpen(false)}
                        >
                          Voltar
                        </button>
                        <button 
                          className="confirm-payment-button"
                          onClick={() => {
                            handlePaymentSuccess('pix');
                          }}
                        >
                          Confirmar Pagamento
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Interface Cartão de Crédito */}
                {selectedPaymentMethod === 'credit' && (
                  <>
                    <div className="payment-header">
                      <h2>💳 Cartão de Crédito</h2>
                      <button className="close-button" onClick={() => {
                        setIsPaymentModalOpen(false);
                        setIsPaymentDetailsOpen(false);
                        setCardData({ number: '', name: '', expiry: '', cvv: '', installments: '1' });
                      }}>✕</button>
                    </div>
                    
                    <div className="card-payment-content">
                      <form className="card-form">
                        <div className="form-group">
                          <label>Número do Cartão</label>
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            value={cardData.number}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                              if (value.length <= 19) {
                                setCardData({...cardData, number: value});
                              }
                            }}
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Nome no Cartão</label>
                          <input 
                            type="text" 
                            placeholder="Nome como está no cartão"
                            value={cardData.name}
                            onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Validade</label>
                            <input 
                              type="text" 
                              placeholder="MM/AA"
                              value={cardData.expiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.substring(0,2) + '/' + value.substring(2,4);
                                }
                                if (value.length <= 5) {
                                  setCardData({...cardData, expiry: value});
                                }
                              }}
                              maxLength={5}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>CVV</label>
                            <input 
                              type="text" 
                              placeholder="000"
                              value={cardData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 3) {
                                  setCardData({...cardData, cvv: value});
                                }
                              }}
                              maxLength={3}
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label>Parcelas</label>
                          <select 
                            value={cardData.installments}
                            onChange={(e) => setCardData({...cardData, installments: e.target.value})}
                          >
                            <option value="1">1x sem juros</option>
                            <option value="2">2x sem juros</option>
                            <option value="3">3x sem juros</option>
                            <option value="4">4x sem juros</option>
                            <option value="5">5x sem juros</option>
                            <option value="6">6x sem juros</option>
                            <option value="7">7x sem juros</option>
                            <option value="8">8x sem juros</option>
                            <option value="9">9x sem juros</option>
                            <option value="10">10x sem juros</option>
                            <option value="11">11x sem juros</option>
                            <option value="12">12x sem juros</option>
                          </select>
                        </div>
                      </form>
                      
                      <div className="card-actions">
                        <button 
                          className="back-button"
                          onClick={() => setIsPaymentDetailsOpen(false)}
                        >
                          Voltar
                        </button>
                        <button 
                          className="confirm-payment-button"
                          onClick={() => {
                            if (cardData.number && cardData.name && cardData.expiry && cardData.cvv) {
                              handlePaymentSuccess('credit', `Cartão: ****${cardData.number.slice(-4)} - ${cardData.installments}x`);
                            } else {
                              alert('Por favor, preencha todos os campos do cartão.');
                            }
                          }}
                          disabled={!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                        >
                          Confirmar Pagamento
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Interface Cartão de Débito */}
                {selectedPaymentMethod === 'debit' && (
                  <>
                    <div className="payment-header">
                      <h2>💰 Cartão de Débito</h2>
                      <button className="close-button" onClick={() => {
                        setIsPaymentModalOpen(false);
                        setIsPaymentDetailsOpen(false);
                        setCardData({ number: '', name: '', expiry: '', cvv: '', installments: '1' });
                      }}>✕</button>
                    </div>
                    
                    <div className="card-payment-content">
                      <form className="card-form">
                        <div className="form-group">
                          <label>Número do Cartão</label>
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            value={cardData.number}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                              if (value.length <= 19) {
                                setCardData({...cardData, number: value});
                              }
                            }}
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Nome no Cartão</label>
                          <input 
                            type="text" 
                            placeholder="Nome como está no cartão"
                            value={cardData.name}
                            onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                          />
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>Validade</label>
                            <input 
                              type="text" 
                              placeholder="MM/AA"
                              value={cardData.expiry}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.substring(0,2) + '/' + value.substring(2,4);
                                }
                                if (value.length <= 5) {
                                  setCardData({...cardData, expiry: value});
                                }
                              }}
                              maxLength={5}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>CVV</label>
                            <input 
                              type="text" 
                              placeholder="000"
                              value={cardData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 3) {
                                  setCardData({...cardData, cvv: value});
                                }
                              }}
                              maxLength={3}
                            />
                          </div>
                        </div>
                        
                        <div className="debit-info">
                          <p>💡 O valor será debitado imediatamente da sua conta</p>
                        </div>
                      </form>
                      
                      <div className="card-actions">
                        <button 
                          className="back-button"
                          onClick={() => setIsPaymentDetailsOpen(false)}
                        >
                          Voltar
                        </button>
                        <button 
                          className="confirm-payment-button"
                          onClick={() => {
                            if (cardData.number && cardData.name && cardData.expiry && cardData.cvv) {
                              handlePaymentSuccess('debit', `Cartão: ****${cardData.number.slice(-4)}`);
                            } else {
                              alert('Por favor, preencha todos os campos do cartão.');
                            }
                          }}
                          disabled={!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
                        >
                          Confirmar Pagamento
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
