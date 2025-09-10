import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  inStock?: boolean;
  discount?: number;
  isSpecialOffer?: boolean;
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

interface AdminUser {
  username: string;
  password: string;
}

interface SpecialOffer {
  id: number;
  productId: number;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Discount {
  id: number;
  code: string;
  percentage: number;
  description: string;
  minValue: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiryDate: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const savedPage = localStorage.getItem('currentPage');
      // Nunca carregar a página admin automaticamente por segurança
      return savedPage && savedPage !== 'undefined' && savedPage !== 'admin' ? savedPage : 'inicio';
    } catch {
      return 'inicio';
    }
  });
  const [isCatshopMenuOpen, setCatshopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const savedCategory = localStorage.getItem('selectedCategory');
      return savedCategory && savedCategory !== 'undefined' ? savedCategory : 'Todos';
    } catch {
      return 'Todos';
    }
  });
  
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

  // Estados do Painel de Administração
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [adminCurrentSection, setAdminCurrentSection] = useState('produtos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  // Estados locais do formulário de Oferta para evitar re-render global a cada tecla
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const discountDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza os estados locais quando a oferta sendo editada muda
  useEffect(() => {
    if (editingOffer) {
      setTitleValue(editingOffer.title || '');
      setDescriptionValue(editingOffer.description || '');
      setDiscountValue(editingOffer.discountPercentage || 0);
    } else {
      setTitleValue('');
      setDescriptionValue('');
      setDiscountValue(0);
    }
  }, [editingOffer]);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [discountCode, setDiscountCode] = useState('');

  // Credenciais de administrador (em produção, isso deveria vir de um backend seguro)
  const adminCredentials: AdminUser = {
    username: 'admin',
    password: 'catshop2025'
  };

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

  // Salvar página atual no localStorage
  useEffect(() => {
    if (isCartLoaded) {
      try {
        localStorage.setItem('currentPage', currentPage);
        console.log('Página atual salva no localStorage:', currentPage);
      } catch (error) {
        console.error('Erro ao salvar página atual no localStorage:', error);
      }
    }
  }, [currentPage, isCartLoaded]);

  // Salvar categoria selecionada no localStorage
  useEffect(() => {
    if (isCartLoaded) {
      try {
        localStorage.setItem('selectedCategory', selectedCategory);
        console.log('Categoria selecionada salva no localStorage:', selectedCategory);
      } catch (error) {
        console.error('Erro ao salvar categoria selecionada no localStorage:', error);
      }
    }
  }, [selectedCategory, isCartLoaded]);

  // Inicializar produtos administrativos
  useEffect(() => {
    if (adminProducts.length === 0) {
      setAdminProducts(products.map(p => ({ ...p, inStock: true })));
    }
  }, [adminProducts.length]);




  // Função para navegar entre páginas
  const navigateToPage = (page: string, category?: string) => {
    setCurrentPage(page);
    if (page === 'catshop' && category) {
      setSelectedCategory(category);
    }
    if (page !== 'admin') {
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
      // Salvar página no localStorage apenas se não for admin
      localStorage.setItem('currentPage', page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função otimizada para atualizar editingOffer com debounce para descrição
  const updateEditingOffer = useCallback((field: keyof SpecialOffer, value: any) => {
    if (field === 'description') {
      // Para o campo descrição, usar requestAnimationFrame para suavizar as atualizações
      requestAnimationFrame(() => {
        setEditingOffer(prev => {
          if (!prev) return null;
          return { ...prev, [field]: value };
        });
      });
    } else {
      setEditingOffer(prev => {
        if (!prev) return null;
        return { ...prev, [field]: value };
      });
    }
  }, []);

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
    
    const finalTotal = calculateCartTotalWithDiscount();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: finalTotal,
      customerInfo: { ...customerInfo },
      status: 'pending',
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    setOrders([...orders, newOrder]);
    
    // Incrementar uso do cupom se aplicado
    if (appliedDiscount) {
      incrementDiscountUsage(appliedDiscount.id);
    }
    
    // Enviar pedido via WhatsApp
    const orderDetails = cart.map(item => 
      `${item.name} (Qtd: ${item.quantity}) - ${item.price}`
    ).join('\n');
    
    const subtotal = getCartTotal().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    const total = finalTotal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    let discountInfo = '';
    if (appliedDiscount) {
      const discountAmount = getDiscountAmount().toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      discountInfo = `\n💰 *Subtotal:* ${subtotal}\n🎟️ *Desconto (${appliedDiscount.code}):* -${discountAmount}`;
    }
    
    const message = `🛒 *NOVO PEDIDO - A Casa dos Gatos*\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📱 *Telefone:* ${customerInfo.phone}\n` +
      `📧 *Email:* ${customerInfo.email}\n` +
      `📍 *Endereço:* ${customerInfo.address}, ${customerInfo.city} - ${customerInfo.zipCode}\n\n` +
      `🛍️ *Produtos:*\n${orderDetails}${discountInfo}\n\n` +
      `💰 *Total Final:* ${total}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho, desconto e fechar checkout
    setCart([]);
    setAppliedDiscount(null);
    setDiscountCode('');
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

  // Funções do Painel de Administração
  const adminLogin = (username: string, password: string): boolean => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAdminAuthenticated(true);
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentPage('inicio');
    setAdminCurrentSection('produtos');
    setEditingProduct(null);
    setEditingOffer(null);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...adminProducts.map(p => p.id), 0) + 1,
      inStock: true
    };
    setAdminProducts([...adminProducts, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setAdminProducts(adminProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
    setEditingProduct(null);
  };

  const deleteProduct = (productId: number) => {
    setAdminProducts(adminProducts.filter(p => p.id !== productId));
  };

  const toggleProductStock = (productId: number) => {
    setAdminProducts(adminProducts.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ));
  };

  const addSpecialOffer = (offer: Omit<SpecialOffer, 'id'>) => {
    const newOffer: SpecialOffer = {
      ...offer,
      id: Math.max(...specialOffers.map(o => o.id), 0) + 1
    };
    setSpecialOffers([...specialOffers, newOffer]);
  };

  const updateSpecialOffer = (updatedOffer: SpecialOffer) => {
    setSpecialOffers(specialOffers.map(o => 
      o.id === updatedOffer.id ? updatedOffer : o
    ));
    setEditingOffer(null);
  };

  const deleteSpecialOffer = (offerId: number) => {
    setSpecialOffers(specialOffers.filter(o => o.id !== offerId));
  };

  const applyDiscount = (productId: number, discountPercentage: number) => {
    setAdminProducts(adminProducts.map(p => 
      p.id === productId ? { ...p, discount: discountPercentage } : p
    ));
  };

  const calculateDiscountedPrice = (price: string, discount?: number): string => {
    if (!discount) return price;
    const numericPrice = parsePrice(price);
    const discountedPrice = numericPrice * (1 - discount / 100);
    return `R$ ${discountedPrice.toFixed(2).replace('.', ',')}`;
  };

  // Funções de gestão de descontos
  const addDiscount = (discount: Omit<Discount, 'id'>) => {
    const newDiscount: Discount = {
      ...discount,
      id: Math.max(...discounts.map(d => d.id), 0) + 1
    };
    setDiscounts([...discounts, newDiscount]);
  };

  const updateDiscount = (discountId: number, updatedDiscount: Discount) => {
    setDiscounts(discounts.map(d => 
      d.id === discountId ? updatedDiscount : d
    ));
  };

  const deleteDiscount = (discountId: number) => {
    setDiscounts(discounts.filter(d => d.id !== discountId));
    if (appliedDiscount?.id === discountId) {
      setAppliedDiscount(null);
      setDiscountCode('');
    }
  };

  const applyDiscountCode = (code: string): boolean => {
    const discount = discounts.find(d => 
      d.code.toUpperCase() === code.toUpperCase() && 
      d.isActive &&
      (!d.expiryDate || new Date() <= new Date(d.expiryDate)) &&
      (d.maxUses === 0 || d.currentUses < d.maxUses)
    );

    if (discount) {
      const cartTotal = getCartTotal();
      if (cartTotal >= discount.minValue) {
        setAppliedDiscount(discount);
        setDiscountCode(code.toUpperCase());
        return true;
      }
    }
    return false;
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  const calculateCartTotalWithDiscount = (): number => {
    const subtotal = getCartTotal();
    if (appliedDiscount) {
      const discountAmount = subtotal * (appliedDiscount.percentage / 100);
      return Math.max(0, subtotal - discountAmount);
    }
    return subtotal;
  };

  const getDiscountAmount = (): number => {
    if (appliedDiscount) {
      const subtotal = getCartTotal();
      return subtotal * (appliedDiscount.percentage / 100);
    }
    return 0;
  };

  const incrementDiscountUsage = (discountId: number) => {
    setDiscounts(discounts.map(d => 
      d.id === discountId ? { ...d, currentUses: d.currentUses + 1 } : d
    ));
  };

  const products = [
    {
      id: 1,
      name: 'Ração Premium para Gatos Adultos',
      description: 'Ração seca sabor salmão para gatos castrados',
      image: '🍣',
      price: 'R$ 129,90',
      category: 'Alimentação',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 2,
      name: 'Arranhador Torre com Múltiplos Níveis',
      description: 'Arranhador grande com brinquedos e tocas',
      image: '🗼',
      price: 'R$ 249,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 3,
      name: 'Fonte de Água Automática',
      description: 'Bebedouro com filtro para água sempre fresca',
      image: '💧',
      price: 'R$ 159,90',
      category: 'Acessórios',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 4,
      name: 'Cama Nuvem Extra Macia',
      description: 'Cama redonda de pelúcia para máximo conforto',
      image: '☁️',
      price: 'R$ 89,90',
      category: 'Conforto',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 5,
      name: 'Petisco Catnip Orgânico',
      description: 'Petisco natural de catnip para relaxamento',
      image: '🌿',
      price: 'R$ 24,90',
      category: 'Alimentação',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 6,
      name: 'Caixa de Transporte Segura',
      description: 'Caixa de transporte com travas de segurança',
      image: '✈️',
      price: 'R$ 199,90',
      category: 'Acessórios',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 7,
      name: 'Varinha de Brinquedo com Penas',
      description: 'Brinquedo interativo para estimular o instinto de caça',
      image: '🎣',
      price: 'R$ 19,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 8,
      name: 'Areia Higiênica Super Absorvente',
      description: 'Areia sílica que elimina odores e absorve a umidade',
      image: '✨',
      price: 'R$ 49,90',
      category: 'Higiene',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 9,
      name: 'Coleira com GPS Integrado',
      description: 'Coleira com rastreador para segurança do seu gato',
      image: '🛰️',
      price: 'R$ 299,90',
      category: 'Acessórios',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 10,
      name: 'Túnel Dobrável para Gatos',
      description: 'Túnel de tecido para diversão e esconderijo',
      image: '🚇',
      price: 'R$ 69,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 11,
      name: 'Túnel de Brincar',
      description: 'Túnel dobrável para diversão e exercícios',
      image: '🌀',
      price: 'R$ 89,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 12,
      name: 'Petisco Natural Premium',
      description: 'Snacks naturais e saudáveis para recompensas',
      image: '🦴',
      price: 'R$ 34,90',
      category: 'Alimentação',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 13,
      name: 'Tapete Sanitário',
      description: 'Tapete absorvente para higiene e limpeza',
      image: '🧽',
      price: 'R$ 19,90',
      category: 'Higiene',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 14,
      name: 'Bola Interativa LED',
      description: 'Bola com luzes LED para brincadeiras noturnas',
      image: '💡',
      price: 'R$ 39,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 15,
      name: 'Rede de Descanso',
      description: 'Rede suspensa confortável para relaxamento',
      image: '🕸️',
      price: 'R$ 79,90',
      category: 'Conforto',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 16,
      name: 'Spray Calmante',
      description: 'Spray natural para reduzir stress e ansiedade',
      image: '💨',
      price: 'R$ 54,90',
      category: 'Saúde',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 17,
      name: 'Escova Massageadora',
      description: 'Escova com cerdas macias para massagem relaxante',
      image: '🪮',
      price: 'R$ 29,90',
      category: 'Higiene',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 18,
      name: 'Comedouro Elevado',
      description: 'Comedouro ergonômico em altura ideal',
      image: '🏔️',
      price: 'R$ 89,90',
      category: 'Acessórios',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 19,
      name: 'Manta Térmica',
      description: 'Manta aquecida para conforto nos dias frios',
      image: '🔥',
      price: 'R$ 119,90',
      category: 'Conforto',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 20,
      name: 'Laser Pointer',
      description: 'Ponteiro laser para exercícios e diversão',
      image: '🔴',
      price: 'R$ 24,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 21,
      name: 'Vitamina Multifuncional',
      description: 'Suplemento vitamínico para saúde completa',
      image: '💊',
      price: 'R$ 64,90',
      category: 'Saúde',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 22,
      name: 'Arranhador Compacto',
      description: 'Arranhador pequeno para espaços reduzidos',
      image: '📐',
      price: 'R$ 49,90',
      category: 'Brinquedos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 23,
      name: 'Caneca Gato Preto',
      description: 'Caneca de cerâmica com estampa de gato preto.',
      image: '☕',
      price: 'R$ 39,90',
      category: 'Para Donos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 24,
      name: 'Camiseta "Cat Person"',
      description: 'Camiseta de algodão com estampa divertida.',
      image: '👕',
      price: 'R$ 59,90',
      category: 'Para Donos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 25,
      name: 'Bolsa Ecobag de Gatinho',
      description: 'Bolsa de algodão para compras.',
      image: '👜',
      price: 'R$ 29,90',
      category: 'Para Donos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 26,
      name: 'Chaveiro de Gato',
      description: 'Chaveiro de metal em formato de gato.',
      image: '🔑',
      price: 'R$ 19,90',
      category: 'Para Donos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
    },
    {
      id: 27,
      name: 'Meias de Gatinho',
      description: 'Par de meias com estampa de patas de gato.',
      image: '🧦',
      price: 'R$ 24,90',
      category: 'Para Donos',
      inStock: true,
      discount: 0,
      isSpecialOffer: false
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
    // Combinar produtos estáticos com produtos administrativos
    const allProducts = [...products, ...adminProducts];
    
    const filteredProducts = selectedCategory === 'Todos'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory);

    // Carrossel compacto de ofertas modernizado
    const getActiveOffers = () => {
      const now = new Date();
      return specialOffers.filter(offer => 
        offer.isActive && 
        new Date(offer.startDate) <= now && 
        new Date(offer.endDate) >= now
      );
    };
    
    const offerProducts = allProducts.filter(p => {
      // Produtos marcados como oferta especial
      if (p.isSpecialOffer) return true;
      
      // Produtos com ofertas ativas do sistema administrativo
      const activeOffers = getActiveOffers();
      return activeOffers.some(offer => offer.productId === p.id);
    });
    
    const CompactOffersCarousel = () => {
      if (offerProducts.length === 0) return null;
      
      return (
        <div className="compact-offers-carousel">
          <h3>🎯 Ofertas Especiais</h3>
          <div className="compact-products-grid">
            {offerProducts.map(product => {
              // Verificar se há oferta administrativa ativa para este produto
              const activeOffers = getActiveOffers();
              const adminOffer = activeOffers.find(offer => offer.productId === product.id);
              
              // Calcular desconto (priorizar oferta administrativa)
              const discountPercentage = adminOffer ? adminOffer.discountPercentage : (product.discount || 0);
              const finalPrice = discountPercentage > 0 
                ? calculateDiscountedPrice(product.price, discountPercentage)
                : product.price;
              
              // Título da oferta (usar título administrativo se disponível)
              const offerTitle = adminOffer ? adminOffer.title : 'Oferta Especial';
              
              return (
                <div key={product.id} className={`compact-product-card offer-highlight ${!product.inStock ? 'out-of-stock' : ''}`}>
                  <div className="offer-badge" title={adminOffer?.description || 'Produto em oferta'}>
                    {adminOffer ? `${adminOffer.discountPercentage}% OFF` : 'Oferta'}
                  </div>
                  {adminOffer && (
                    <div className="offer-title-badge">{offerTitle}</div>
                  )}
                  <div className="product-image">
                    <span>{product.image}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">
                    {discountPercentage > 0 ? (
                      <>
                        <span className="original-price">{product.price}</span>
                        <span className="discounted-price">{finalPrice}</span>
                        <span className="discount-badge">-{discountPercentage}%</span>
                      </>
                    ) : (
                      <span>{finalPrice}</span>
                    )}
                  </div>
                  {adminOffer && adminOffer.description && (
                    <div className="offer-description-mini">{adminOffer.description}</div>
                  )}
                  {!product.inStock && (
                    <div className="out-of-stock-badge">❌ Sem Estoque</div>
                  )}
                  <button 
                    className="buy-button" 
                    onClick={() => (product.inStock ?? true) && addToCart(product)}
                    disabled={product.inStock === false}
                  >
                    {product.inStock !== false ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

return (
      <section className="catshop">
        <div className="container">
          <h2>Catshop - Produtos Exclusivos</h2>
          <p className="section-subtitle">Tudo que seu gatinho precisa em um só lugar</p>

          <CompactOffersCarousel />

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
            {filteredProducts.map(product => {
              const finalPrice = product.discount && product.discount > 0 
                ? calculateDiscountedPrice(product.price, product.discount)
                : product.price;
              
              return (
                <div key={product.id} className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
                  <div className="product-image">
                    <span>{product.image}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">
                    {product.discount && product.discount > 0 ? (
                      <>
                        <span className="original-price">{product.price}</span>
                        <span className="discounted-price">{finalPrice}</span>
                        <span className="discount-badge">-{product.discount}%</span>
                      </>
                    ) : (
                      <span>{product.price}</span>
                    )}
                  </div>
                  {!product.inStock && (
                    <div className="out-of-stock-badge">❌ Sem Estoque</div>
                  )}
                  <div className="product-actions">
                    <button 
                      onClick={() => (product.inStock ?? true) && addToCart(product)} 
                      className="add-to-cart-button"
                      disabled={product.inStock === false}
                    >
                      {product.inStock !== false ? 'Adicionar ao Carrinho' : 'Indisponível'}
                    </button>
                    <button onClick={() => {
                      const message = `Olá! Tenho interesse no produto: ${product.name}, no valor de ${finalPrice}.`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                      window.open(whatsappUrl, '_blank');
                    }} className="buy-button"
                    disabled={product.inStock === false}
                    >
                      Comprar pelo WhatsApp
                    </button>
                  </div>
                </div>
              );
            })}
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

  // Componente do Painel de Administração
  const AdminPanel = () => {
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = adminLogin(loginForm.username, loginForm.password);
      if (!success) {
        setLoginError('Credenciais inválidas');
      } else {
        setLoginError('');
        setLoginForm({ username: '', password: '' });
      }
    };

    if (!isAdminAuthenticated) {
      return (
        <section className="admin-login">
          <div className="container">
            <div className="login-form-container">
              <h2>🔐 Painel de Administração</h2>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Usuário:</label>
                  <input
                    type="text"
                    id="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Senha:</label>
                  <input
                    type="password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
                {loginError && <div className="error-message">{loginError}</div>}
                <button type="submit" className="login-button">Entrar</button>
              </form>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="admin-panel">
        <div className="admin-container">
          <div className="admin-header">
            <h2>🛠️ Painel de Administração</h2>
            <button onClick={adminLogout} className="logout-button">Sair</button>
          </div>
          
          <div className="admin-layout">
            <nav className="admin-sidebar">
              <button 
                className={adminCurrentSection === 'produtos' ? 'active' : ''}
                onClick={() => setAdminCurrentSection('produtos')}
              >
                📦 Produtos
              </button>
              <button 
                className={adminCurrentSection === 'ofertas' ? 'active' : ''}
                onClick={() => setAdminCurrentSection('ofertas')}
              >
                🎯 Ofertas Especiais
              </button>
              <button 
                className={adminCurrentSection === 'descontos' ? 'active' : ''}
                onClick={() => setAdminCurrentSection('descontos')}
              >
                💰 Descontos
              </button>
              <button 
                className={adminCurrentSection === 'configuracoes' ? 'active' : ''}
                onClick={() => setAdminCurrentSection('configuracoes')}
              >
                ⚙️ Configurações
              </button>
            </nav>
            
            <main className="admin-content">
              {adminCurrentSection === 'produtos' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h3>Gestão de Produtos</h3>
                    <button 
                      className="add-button"
                      onClick={() => setEditingProduct({ id: 0, name: '', description: '', image: '', price: '', category: '', inStock: true, discount: 0, isSpecialOffer: false })}
                    >
                      ➕ Adicionar Produto
                    </button>
                  </div>
                  
                  {editingProduct && (
                    <div className="product-form-modal">
                      <div className="product-form">
                        <div className="form-header">
                          <h4>{editingProduct.id === 0 ? 'Adicionar Novo Produto' : 'Editar Produto'}</h4>
                          <button className="close-form" onClick={() => setEditingProduct(null)}>✕</button>
                        </div>
                        
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (editingProduct.id === 0) {
                            const newProduct = {
                              ...editingProduct,
                              id: Math.max(...adminProducts.map(p => p.id)) + 1
                            };
                            addProduct(newProduct);
                          } else {
                            updateProduct(editingProduct);
                          }
                          setEditingProduct(null);
                        }}>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Nome do Produto *</label>
                              <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Categoria *</label>
                              <select
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                required
                              >
                                <option value="">Selecione uma categoria</option>
                                <option value="Alimentação">Alimentação</option>
                                <option value="Brinquedos">Brinquedos</option>
                                <option value="Higiene">Higiene</option>
                                <option value="Acessórios">Acessórios</option>
                              </select>
                            </div>
                            
                            <div className="form-group">
                              <label>Preço *</label>
                              <input
                                type="text"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                placeholder="R$ 0,00"
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Emoji/Ícone *</label>
                              <input
                                type="text"
                                value={editingProduct.image}
                                onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                                placeholder="🐱"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="form-group full-width">
                            <label>Descrição *</label>
                            <textarea
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                              rows={3}
                              required
                            />
                          </div>
                          
                          <div className="form-options">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editingProduct.inStock}
                                onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                              />
                              Em estoque
                            </label>
                            
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editingProduct.isSpecialOffer}
                                onChange={(e) => setEditingProduct({...editingProduct, isSpecialOffer: e.target.checked})}
                              />
                              Oferta especial
                            </label>
                            
                            <div className="form-group discount-group">
                              <label>Desconto (%)</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editingProduct.discount}
                                onChange={(e) => setEditingProduct({...editingProduct, discount: Number(e.target.value)})}
                              />
                            </div>
                          </div>
                          
                          <div className="form-actions">
                            <button type="button" onClick={() => setEditingProduct(null)} className="cancel-button">
                              Cancelar
                            </button>
                            <button type="submit" className="save-button">
                              {editingProduct.id === 0 ? 'Adicionar' : 'Salvar'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  
                  <div className="products-table">
                    <div className="table-header">
                      <span>Produto</span>
                      <span>Categoria</span>
                      <span>Preço</span>
                      <span>Status</span>
                      <span>Ações</span>
                    </div>
                    
                    {adminProducts.map(product => (
                      <div key={product.id} className={`table-row ${!product.inStock ? 'out-of-stock' : ''}`}>
                        <div className="product-info">
                          <span className="product-emoji">{product.image}</span>
                          <div>
                            <div className="product-name">{product.name}</div>
                            <div className="product-description">{product.description}</div>
                          </div>
                        </div>
                        <span className="product-category">{product.category}</span>
                        <div className="product-price">
                          {product.discount && product.discount > 0 ? (
                            <>
                              <span className="original-price">{product.price}</span>
                              <span className="discounted-price">{calculateDiscountedPrice(product.price, product.discount)}</span>
                              <span className="discount-badge">-{product.discount}%</span>
                            </>
                          ) : (
                            <span>{product.price}</span>
                          )}
                        </div>
                        <div className="product-status">
                          <span className={`status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {product.inStock ? '✅ Em estoque' : '❌ Sem estoque'}
                          </span>
                          {product.isSpecialOffer && <span className="offer-badge">🎯 Oferta</span>}
                        </div>
                        <div className="product-actions">
                          <button 
                            className="edit-button"
                            onClick={() => setEditingProduct(product)}
                            title="Editar produto"
                          >
                            ✏️
                          </button>
                          <button 
                            className={`stock-button ${product.inStock ? 'in-stock' : 'out-of-stock'}`}
                            onClick={() => toggleProductStock(product.id)}
                            title={product.inStock ? 'Marcar sem estoque' : 'Marcar em estoque'}
                          >
                            {product.inStock ? '📦' : '📭'}
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            title="Excluir produto"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {adminProducts.length === 0 && (
                      <div className="empty-state">
                        <p>Nenhum produto cadastrado ainda.</p>
                        <button 
                          className="add-first-button"
                          onClick={() => setEditingProduct({ id: 0, name: '', description: '', image: '', price: '', category: '', inStock: true, discount: 0, isSpecialOffer: false })}
                        >
                          ➕ Adicionar primeiro produto
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {adminCurrentSection === 'ofertas' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h3>Gestão de Ofertas Especiais</h3>
                    <button 
                      className="add-button"
                      onClick={() => setEditingOffer({ id: 0, productId: 0, title: '', description: '', discountPercentage: 0, startDate: '', endDate: '', isActive: true })}
                    >
                      ➕ Criar Nova Oferta
                    </button>
                  </div>
                  
                  {editingOffer && (
                    <div className="modern-offer-modal">
                      <div className="modern-offer-form">
                        <div className="modern-form-header">
                          <div className="header-content">
                            <div className="header-icon">🎯</div>
                            <div>
                              <h3>{editingOffer.id === 0 ? 'Criar Nova Oferta' : 'Editar Oferta'}</h3>
                              <p className="header-subtitle">Configure uma oferta especial para seus produtos</p>
                            </div>
                          </div>
                          <button className="modern-close-btn" onClick={() => setEditingOffer(null)}>✕</button>
                        </div>
                        
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (editingOffer.productId === 0) {
                            alert('Por favor, selecione um produto para a oferta.');
                            return;
                          }
                          if (new Date(editingOffer.startDate) >= new Date(editingOffer.endDate)) {
                            alert('A data de início deve ser anterior à data de fim.');
                            return;
                          }
                          if (editingOffer.id === 0) {
                            addSpecialOffer(editingOffer);
                          } else {
                            updateSpecialOffer(editingOffer);
                          }
                          setEditingOffer(null);
                        }}>
                          <div className="modern-form-content">
                            {/* Seção de Produto */}
                            <div className="form-section">
                              <h4 className="section-title">Produto</h4>
                              <div className="product-selector">
                                <select
                                  value={editingOffer.productId}
                                  onChange={(e) => updateEditingOffer('productId', Number(e.target.value))}
                                  required
                                  className="modern-select"
                                >
                                  <option value={0}>Selecione um produto</option>
                                  {[...products, ...adminProducts].map(product => (
                                    <option key={product.id} value={product.id}>
                                      {product.image} {product.name} - {product.price}
                                    </option>
                                  ))}
                                </select>
                                {editingOffer.productId > 0 && (() => {
                                  const selectedProduct = [...products, ...adminProducts].find(p => p.id === editingOffer.productId);
                                  return selectedProduct ? (
                                    <div className="product-preview">
                                      <div className="product-preview-card">
                                        <span className="product-emoji">{selectedProduct.image}</span>
                                        <div className="product-info">
                                          <h5>{selectedProduct.name}</h5>
                                          <p className="product-category">{selectedProduct.category}</p>
                                          <p className="product-price">{selectedProduct.price}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>

                            {/* Seção de Detalhes da Oferta */}
                            <div className="form-section">
                              <h4 className="section-title">✨ Detalhes da Oferta</h4>
                              <div className="form-row">
                                <div className="form-group flex-2">
                                  <label>Título da Oferta *</label>
                                  <input
                                    type="text"
                                    value={titleValue}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setTitleValue(v);
                                      if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current);
                                      titleDebounceRef.current = setTimeout(() => {
                                        updateEditingOffer('title', v);
                                      }, 100);
                                    }}
                                    placeholder="Ex: Super Desconto de Verão"
                                    required
                                    className="modern-input"
                                  />
                                </div>
                                <div className="form-group flex-1">
                                  <label>Desconto (%) *</label>
                                  <div className="discount-input-wrapper">
                                    <input
                                      type="number"
                                      min="1"
                                      max="90"
                                      value={editingOffer.discountPercentage}
                                      onChange={(e) => updateEditingOffer('discountPercentage', Number(e.target.value))}
                                      required
                                      className="modern-input discount-input"
                                    />
                                    <span className="discount-badge">{editingOffer.discountPercentage}% OFF</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="form-group">
                                <label>Descrição</label>
                                <textarea
                                  key="description-field"
                                  value={descriptionValue}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setDescriptionValue(newValue);
                                    // Debounce a atualização do editingOffer
                                    setTimeout(() => {
                                      updateEditingOffer('description', newValue);
                                    }, 100);
                                  }}
                                  placeholder="Descreva os detalhes da oferta..."
                                  rows={3}
                                  className="modern-textarea"
                                  style={{ resize: 'vertical' }}
                                />
                              </div>
                            </div>

                            {/* Seção de Período */}
                            <div className="form-section">
                              <h4 className="section-title">Período da Oferta</h4>
                              <div className="form-row">
                                <div className="form-group">
                                  <label>Data de Início *</label>
                                  <input
                                    type="date"
                                    value={editingOffer.startDate}
                                    onChange={(e) => updateEditingOffer('startDate', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="modern-input"
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <label>Data de Fim *</label>
                                  <input
                                    type="date"
                                    value={editingOffer.endDate}
                                    onChange={(e) => updateEditingOffer('endDate', e.target.value)}
                                    min={editingOffer.startDate || new Date().toISOString().split('T')[0]}
                                    required
                                    className="modern-input"
                                  />
                                </div>
                              </div>
                              
                              {editingOffer.startDate && editingOffer.endDate && (
                                  <div className="period-preview">
                                    <span className="period-info">
                                      Duração: {(() => {
                                         const start = new Date(editingOffer.startDate);
                                         const end = new Date(editingOffer.endDate);
                                         const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                         return days;
                                       })()} dias
                                    </span>
                                  </div>
                                )}
                            </div>

                            {/* Seção de Configurações */}
                            <div className="form-section">
                              <h4 className="section-title">Configurações</h4>
                              <div className="modern-checkbox-group">
                                <label className="modern-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={editingOffer.isActive}
                                    onChange={(e) => updateEditingOffer('isActive', e.target.checked)}
                                  />
                                  <span className="checkmark"></span>
                                  <div className="checkbox-content">
                                    <span className="checkbox-title">Oferta ativa</span>
                                    <span className="checkbox-description">A oferta será exibida no site quando ativa</span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="modern-form-actions">
                            <button type="button" className="modern-cancel-btn" onClick={() => setEditingOffer(null)}>
                              Cancelar
                            </button>
                            <button type="submit" className="modern-save-btn">
                              <span className="btn-icon">{editingOffer.id === 0 ? '+' : '✓'}</span>
                              {editingOffer.id === 0 ? 'Criar Oferta' : 'Salvar Alterações'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  
                  <div className="offers-table">
                    {specialOffers.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th>Título</th>
                            <th>Desconto</th>
                            <th>Período</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {specialOffers.map(offer => {
                            const product = [...products, ...adminProducts].find(p => p.id === offer.productId);
                            const isActive = offer.isActive && new Date() >= new Date(offer.startDate) && new Date() <= new Date(offer.endDate);
                            
                            return (
                              <tr key={offer.id}>
                                <td>
                                  <div className="offer-product-info">
                                    <span className="product-emoji">{product?.image}</span>
                                    <div>
                                      <div className="product-name">{product?.name}</div>
                                      <div className="product-category">{product?.category}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="offer-title">{offer.title}</div>
                                  {offer.description && <div className="offer-description">{offer.description}</div>}
                                </td>
                                <td>
                                  <span className="discount-percentage">{offer.discountPercentage}%</span>
                                </td>
                                <td>
                                  <div className="offer-period">
                                    <div>{new Date(offer.startDate).toLocaleDateString('pt-BR')}</div>
                                    <div>até {new Date(offer.endDate).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                </td>
                                <td>
                                  <span className={`offer-status ${isActive ? 'active' : 'inactive'}`}>
                                    {isActive ? '🟢 Ativa' : '🔴 Inativa'}
                                  </span>
                                </td>
                                <td>
                                  <div className="offer-actions">
                                    <button 
                                      className="edit-button"
                                      onClick={() => setEditingOffer(offer)}
                                      title="Editar oferta"
                                    >
                                      ✏️
                                    </button>
                                    <button 
                                      className="delete-button"
                                      onClick={() => deleteSpecialOffer(offer.id)}
                                      title="Excluir oferta"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="empty-state">
                        <p>Nenhuma oferta especial criada ainda.</p>
                        <button 
                          className="add-first-button"
                          onClick={() => setEditingOffer({ id: 0, productId: 0, title: '', description: '', discountPercentage: 0, startDate: '', endDate: '', isActive: true })}
                        >
                          ➕ Criar primeira oferta
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {adminCurrentSection === 'descontos' && (
                <div className="admin-section">
                  <div className="section-header">
                    <h3>Sistema de Descontos</h3>
                    <button 
                      className="add-button"
                      onClick={() => setEditingDiscount({ id: 0, code: '', percentage: 0, description: '', minValue: 0, maxUses: 0, currentUses: 0, isActive: true, expiryDate: '' })}
                    >
                      ➕ Criar Novo Cupom
                    </button>
                  </div>
                  
                  {editingDiscount && (
                    <div className="discount-form-modal">
                      <div className="discount-form">
                        <div className="form-header">
                          <h4>{editingDiscount.id === 0 ? 'Criar Novo Cupom' : 'Editar Cupom'}</h4>
                          <button className="close-button" onClick={() => setEditingDiscount(null)}>✕</button>
                        </div>
                        
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (editingDiscount.id === 0) {
                            addDiscount(editingDiscount);
                          } else {
                            updateDiscount(editingDiscount.id, editingDiscount);
                          }
                          setEditingDiscount(null);
                        }}>
                          <div className="form-grid">
                            <div className="form-group">
                              <label>Código do Cupom *</label>
                              <input
                                type="text"
                                value={editingDiscount.code}
                                onChange={(e) => setEditingDiscount({...editingDiscount, code: e.target.value.toUpperCase()})}
                                placeholder="Ex: DESCONTO10"
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Desconto (%) *</label>
                              <input
                                type="number"
                                min="1"
                                max="90"
                                value={editingDiscount.percentage}
                                onChange={(e) => setEditingDiscount({...editingDiscount, percentage: Number(e.target.value)})}
                                required
                              />
                            </div>
                            
                            <div className="form-group full-width">
                              <label>Descrição</label>
                              <textarea
                                value={editingDiscount.description}
                                onChange={(e) => setEditingDiscount({...editingDiscount, description: e.target.value})}
                                placeholder="Descreva o cupom de desconto..."
                                rows={3}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Valor Mínimo (R$)</label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingDiscount.minValue}
                                onChange={(e) => setEditingDiscount({...editingDiscount, minValue: Number(e.target.value)})}
                                placeholder="0.00"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Máximo de Usos</label>
                              <input
                                type="number"
                                min="1"
                                value={editingDiscount.maxUses}
                                onChange={(e) => setEditingDiscount({...editingDiscount, maxUses: Number(e.target.value)})}
                                placeholder="Ilimitado se vazio"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Data de Expiração</label>
                              <input
                                type="date"
                                value={editingDiscount.expiryDate}
                                onChange={(e) => setEditingDiscount({...editingDiscount, expiryDate: e.target.value})}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={editingDiscount.isActive}
                                  onChange={(e) => setEditingDiscount({...editingDiscount, isActive: e.target.checked})}
                                />
                                Cupom ativo
                              </label>
                            </div>
                          </div>
                          
                          <div className="form-actions">
                            <button type="button" className="cancel-button" onClick={() => setEditingDiscount(null)}>
                              Cancelar
                            </button>
                            <button type="submit" className="save-button">
                              {editingDiscount.id === 0 ? 'Criar Cupom' : 'Salvar Alterações'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  
                  {discounts.length > 0 ? (
                    <div className="discounts-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Desconto</th>
                            <th>Descrição</th>
                            <th>Valor Mín.</th>
                            <th>Usos</th>
                            <th>Expiração</th>
                            <th>Status</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discounts.map(discount => {
                            const isExpired = discount.expiryDate && new Date() > new Date(discount.expiryDate);
                            const isMaxedOut = discount.maxUses > 0 && discount.currentUses >= discount.maxUses;
                            const isActive = discount.isActive && !isExpired && !isMaxedOut;
                            
                            return (
                              <tr key={discount.id}>
                                <td>
                                  <div className="discount-code">{discount.code}</div>
                                </td>
                                <td>
                                  <span className="discount-percentage">{discount.percentage}%</span>
                                </td>
                                <td>
                                  <div className="discount-description">{discount.description || '-'}</div>
                                </td>
                                <td>
                                  <span className="min-value">
                                    {discount.minValue > 0 ? `R$ ${discount.minValue.toFixed(2).replace('.', ',')}` : 'Sem mínimo'}
                                  </span>
                                </td>
                                <td>
                                  <div className="usage-info">
                                    <span className="current-uses">{discount.currentUses}</span>
                                    <span className="usage-separator">/</span>
                                    <span className="max-uses">{discount.maxUses > 0 ? discount.maxUses : '∞'}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="expiry-date">
                                    {discount.expiryDate ? new Date(discount.expiryDate).toLocaleDateString('pt-BR') : 'Sem expiração'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`status-badge ${
                                    isActive ? 'active' : 
                                    isExpired ? 'expired' : 
                                    isMaxedOut ? 'maxed-out' : 'inactive'
                                  }`}>
                                    {isActive ? '✅ Ativo' : 
                                     isExpired ? '⏰ Expirado' : 
                                     isMaxedOut ? '🚫 Esgotado' : '❌ Inativo'}
                                  </span>
                                </td>
                                <td>
                                  <div className="discount-actions">
                                    <button 
                                      className="edit-button"
                                      onClick={() => setEditingDiscount(discount)}
                                      title="Editar cupom"
                                    >
                                      ✏️
                                    </button>
                                    <button 
                                      className="delete-button"
                                      onClick={() => deleteDiscount(discount.id)}
                                      title="Excluir cupom"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">💰</div>
                      <h4>Nenhum cupom de desconto criado</h4>
                      <p>Crie cupons de desconto para oferecer promoções aos seus clientes.</p>
                      <button 
                        className="add-first-button"
                        onClick={() => setEditingDiscount({ id: 0, code: '', percentage: 0, description: '', minValue: 0, maxUses: 0, currentUses: 0, isActive: true, expiryDate: '' })}
                      >
                        ➕ Criar primeiro cupom
                      </button>
                    </div>
                  )}
                </div>
              )}
              {adminCurrentSection === 'configuracoes' && (
                <div className="admin-section">
                  <h3>Configurações</h3>
                  <p>Seção em desenvolvimento...</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    );
  };

  // Função para renderizar a página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <InicioPage />;
      case 'sobre':
        return <SobrePage />;
      case 'catshop':
        const allProducts = [...products, ...adminProducts];
        return <CatshopPage categories={['Todos', ...Array.from(new Set(allProducts.map(p => p.category))).filter((c): c is string => c !== undefined)]} />;
      case 'clinica':
        return <ClinicaPage />;
      case 'admin':
        return <AdminPanel />;
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
                  {(() => {
                    const allProducts = [...products, ...adminProducts];
                    return ['Todos', ...Array.from(new Set(allProducts.map(p => p.category))).filter((c): c is string => c !== undefined)];
                  })().map(category => (
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
              aria-label={`Abrir carrinho com ${getCartItemsCount()} ${getCartItemsCount() === 1 ? 'item' : 'itens'}`}
            >
              🛒 {getCartItemsCount() > 0 && (<span className="cart-count">{getCartItemsCount()}</span>)}
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
                    {/* Seção de cupom de desconto */}
                    <div className="discount-section">
                      <div className="discount-input-group">
                        <input
                          type="text"
                          placeholder="Código do cupom"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          className="discount-input"
                        />
                        <button 
                          className="apply-discount-btn"
                          onClick={() => {
                            if (discountCode.trim()) {
                              const success = applyDiscountCode(discountCode.trim());
                              if (!success) {
                                alert('Cupom inválido, expirado ou não atende aos requisitos mínimos.');
                              }
                            }
                          }}
                          disabled={!discountCode.trim()}
                        >
                          Aplicar
                        </button>
                      </div>
                      
                      {appliedDiscount && (
                        <div className="applied-discount">
                          <div className="discount-info">
                            <span className="discount-code-applied">💰 {appliedDiscount.code}</span>
                            <span className="discount-value">-{appliedDiscount.percentage}%</span>
                            <button 
                              className="remove-discount-btn"
                              onClick={removeDiscountCode}
                              title="Remover cupom"
                            >
                              ✕
                            </button>
                          </div>
                          {appliedDiscount.description && (
                            <div className="discount-description">{appliedDiscount.description}</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="cart-total">
                      {appliedDiscount ? (
                        <>
                          <div className="subtotal">Subtotal: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                          <div className="discount-amount">Desconto: -{getDiscountAmount().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                          <div className="final-total"><strong>Total: {calculateCartTotalWithDiscount().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
                        </>
                      ) : (
                        <strong>Total: {getCartTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                      )}
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
            <p>&copy; 2025 A Casa dos Gatos. Todos os direitos reservados.</p>
            <p>Clínica veterinária exclusiva para felinos - Lages/SC</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
