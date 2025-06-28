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

  return (
    <div className="App">
      {/* Cabeçalho */}
      <header className="header">
        <div className="logo-container">
          <img src="/gato.png" alt="Logo" className="logo" />
          <h1 className="title">A Casa dos Gatos</h1>
        </div>
        <nav>
          <Link to="/">Produtos</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/contact">Contato</Link>
        </nav>
        <div className="cart-icon-container" onClick={() => setIsCartOpen(true)}>
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{getCartItemsCount()}</span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main>
        <Routes>
          <Route path="/" element={
            <>
              {/* Filtros e Pesquisa */}
              <div className="filters">
                <input 
                  type="text" 
                  placeholder="Pesquisar produtos..." 
                  className="search-bar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="category-filter">
                  {['Todos', 'Alimentação', 'Brinquedos', 'Acessórios', 'Higiene', 'Conforto', 'Saúde', 'Para Donos'].map(category => (
                    <button 
                      key={category} 
                      className={selectedCategory === category ? 'active' : ''}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vitrine de Produtos */}
              <div className="product-showcase">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">{product.image}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">{product.price}</p>
                    <div className="product-buttons">
                      <button onClick={() => addToCart(product)}>Adicionar ao Carrinho</button>
                      <button onClick={() => handleWhatsAppPurchase(product.name, product.price)}>Comprar via WhatsApp</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          } />
          <Route path="/about" element={
            <div className="about-page">
              <h2>Sobre Nós</h2>
              <p>A Casa dos Gatos é a sua loja de referência para tudo o que seu felino precisa. Oferecemos uma vasta gama de produtos de alta qualidade, desde alimentação e brinquedos a acessórios e itens de higiene. Nossa missão é garantir o bem-estar e a felicidade do seu gato, com produtos cuidadosamente selecionados e um atendimento especializado.</p>
              <p>Visite-nos e descubra um mundo de mimos para o seu melhor amigo!</p>
            </div>
          } />
          <Route path="/contact" element={
            <div className="contact-page">
              <h2>Contato</h2>
              <p><strong>Telefone:</strong> <a href={`https://wa.me/${whatsappNumber}`} target="_blank">{whatsappNumber}</a></p>
              <p><strong>Instagram:</strong> <a href={instagramUrl} target="_blank">@acasadosgatos.lages</a></p>
              <p><strong>Endereço:</strong> Lages, SC</p>
            </div>
          } />
        </Routes>
      </main>

      {/* Rodapé */}
      <footer className="footer">
        <p>&copy; 2024 A Casa dos Gatos. Todos os direitos reservados.</p>
        <div className="social-links">
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank">WhatsApp</a>
          <a href={instagramUrl} target="_blank">Instagram</a>
        </div>
      </footer>

      {/* Modal do Carrinho */}
      {isCartOpen && (
        <div className="modal-overlay">
          <div className="modal-content cart-modal">
            <button className="close-button" onClick={() => setIsCartOpen(false)}>×</button>
            <h2>Meu Carrinho</h2>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">{item.image}</div>
                    <div className="cart-item-details">
                      <p>{item.name}</p>
                      <p>{item.price}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remover</button>
                  </div>
                ))}
                <div className="cart-total">
                  <h3>Total: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                </div>
                <button className="checkout-button" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>Finalizar Compra</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal">
            <button className="close-button" onClick={() => setIsCheckoutOpen(false)}>×</button>
            <h2>Checkout</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsPaymentModalOpen(true); }}>
              <h3>Informações do Cliente</h3>
              <input type="text" placeholder="Nome Completo" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} required />
              <input type="tel" placeholder="Telefone (com DDD)" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} required />
              <input type="email" placeholder="Email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} required />
              <input type="text" placeholder="Endereço" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} required />
              <input type="text" placeholder="Cidade" value={customerInfo.city} onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })} required />
              <input type="text" placeholder="CEP" value={customerInfo.zipCode} onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })} required />
              
              <h3>Resumo do Pedido</h3>
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{(parsePrice(item.price) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>

              <button type="submit" className="payment-button">Ir para Pagamento</button>
              <button type="button" className="whatsapp-order-button" onClick={finishOrder}>Finalizar Pedido via WhatsApp</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <button className="close-button" onClick={() => setIsPaymentModalOpen(false)}>×</button>
            <h2>Escolha a Forma de Pagamento</h2>
            <div className="payment-options">
              <button onClick={() => { setSelectedPaymentMethod('pix'); setIsPaymentDetailsOpen(true); }}>PIX</button>
              <button onClick={() => { setSelectedPaymentMethod('card'); setIsPaymentDetailsOpen(true); }}>Cartão de Crédito</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Pagamento */}
      {isPaymentDetailsOpen && (
        <div className="modal-overlay">
          <div className="modal-content payment-details-modal">
            <button className="close-button" onClick={() => { setIsPaymentDetailsOpen(false); setSelectedPaymentMethod(''); }}>×</button>
            {selectedPaymentMethod === 'pix' && (
              <div className="pix-details">
                <h3>Pagamento com PIX</h3>
                <p>Escaneie o QR Code abaixo para pagar:</p>
                <img src="/qr-code-pix.png" alt="QR Code PIX" className="pix-qrcode" />
                <p>Ou use a chave PIX: <strong>{whatsappNumber}</strong></p>
                <p>Tempo restante para pagar: <strong>{Math.floor(pixExpirationTime / 60)}:{('0' + pixExpirationTime % 60).slice(-2)}</strong></p>
                <button onClick={() => handlePaymentSuccess('pix')}>Confirmar Pagamento</button>
              </div>
            )}
            {selectedPaymentMethod === 'card' && (
              <div className="card-details">
                <h3>Pagamento com Cartão de Crédito</h3>
                <input type="text" placeholder="Número do Cartão" value={cardData.number} onChange={(e) => setCardData({...cardData, number: e.target.value})} />
                <input type="text" placeholder="Nome no Cartão" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} />
                <input type="text" placeholder="Validade (MM/AA)" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} />
                <input type="text" placeholder="CVV" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} />
                <select value={cardData.installments} onChange={(e) => setCardData({...cardData, installments: e.target.value})}>
                  <option value="1">1x de {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                  <option value="2">2x de {(getCartTotal() / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                  <option value="3">3x de {(getCartTotal() / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                </select>
                <button onClick={() => handlePaymentSuccess('card')}>Pagar com Cartão</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Sucesso no Pagamento */}
      {isPaymentSuccess && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <h2>Pagamento Aprovado!</h2>
            <p>Seu pedido foi recebido e está sendo preparado.</p>
            <p>Obrigado por comprar na A Casa dos Gatos! 😻</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
