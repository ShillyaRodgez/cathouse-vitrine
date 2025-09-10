// Configurações e dados
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'catshop2025'
};

// Dados simulados (localStorage)
let products = [];
let offers = [];
let orders = [];
let currentEditingProduct = null;
let currentEditingOffer = null;

// Elementos DOM
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Navegação
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.admin-section');

// Modais
const productModal = document.getElementById('productModal');
const offerModal = document.getElementById('offerModal');
const confirmModal = document.getElementById('confirmModal');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando aplicação...');
    loadData();
    setupEventListeners();
    checkAuthentication();
    
    // Debug: Limpar localStorage para forçar recarregamento dos produtos
    console.log('Limpando localStorage para debug...');
    localStorage.removeItem('adminProducts');
});

// Verificar autenticação
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
        showDashboard();
    } else {
        showLogin();
    }
}

// Mostrar tela de login
function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
}

// Mostrar dashboard
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'flex';
    
    // Garantir que os dados estejam carregados
    if (products.length === 0) {
        loadData();
    }
    
    // Aguardar um pouco para garantir que o DOM esteja pronto
    setTimeout(() => {
        switchSection('products');
        populateCategoryFilter();
        loadProducts();
        updateStats();
    }, 100);
}

// Configurar event listeners
function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Navegação
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            switchSection(section);
        });
    });

    // Produtos
    document.getElementById('addProductBtn').addEventListener('click', () => openProductModal());
    document.getElementById('productSearch').addEventListener('input', loadProducts);
    document.getElementById('categoryFilter').addEventListener('change', loadProducts);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
    document.getElementById('cancelProductBtn').addEventListener('click', closeProductModal);

    // Ofertas
    document.getElementById('addOfferBtn').addEventListener('click', () => openOfferModal());
    document.getElementById('offerForm').addEventListener('submit', handleOfferSubmit);
    document.getElementById('closeOfferModal').addEventListener('click', closeOfferModal);
    document.getElementById('cancelOfferBtn').addEventListener('click', closeOfferModal);

    // Configurações
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', importData);

    // Modal de confirmação
    document.getElementById('cancelConfirm').addEventListener('click', closeConfirmModal);

    // Fechar modais clicando fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Autenticação
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        showDashboard();
        showToast('Login realizado com sucesso!', 'success');
    } else {
        showError('Usuário ou senha incorretos!');
    }
}

function handleLogout() {
    localStorage.removeItem('adminAuthenticated');
    showLogin();
    showToast('Logout realizado com sucesso!', 'success');
}

function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 5000);
}

// Navegação entre seções
function switchSection(sectionName) {
    // Atualizar botões de navegação
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });

    // Mostrar seção correspondente
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionName + 'Section') {
            section.classList.add('active');
        }
    });

    // Carregar dados específicos da seção
    switch (sectionName) {
        case 'products':
            loadProducts();
            break;
        case 'offers':
            loadOffers();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'settings':
            updateStats();
            break;
    }
}

// Gerenciamento de dados
function loadData() {
    console.log('Iniciando loadData()...');
    // Carregar produtos do localStorage ou usar dados padrão
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
        console.log('Produtos carregados do localStorage:', products.length);
    } else {
        console.log('Carregando produtos padrão...');
        // Produtos importados do site principal
        products = [
            { id: 1, name: 'Ração Premium para Gatos Adultos', description: 'Ração seca sabor salmão para gatos castrados', image: '🍣', price: 'R$ 129,90', category: 'Alimentação', inStock: true, discount: 0 },
            { id: 2, name: 'Arranhador Torre com Múltiplos Níveis', description: 'Arranhador grande com brinquedos e tocas', image: '🗼', price: 'R$ 249,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 3, name: 'Fonte de Água Automática', description: 'Bebedouro com filtro para água sempre fresca', image: '💧', price: 'R$ 159,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 4, name: 'Cama Nuvem Extra Macia', description: 'Cama redonda de pelúcia para máximo conforto', image: '☁️', price: 'R$ 89,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 5, name: 'Petisco Catnip Orgânico', description: 'Petisco natural de catnip para relaxamento', image: '🌿', price: 'R$ 24,90', category: 'Alimentação', inStock: true, discount: 0 },
            { id: 6, name: 'Caixa de Transporte Segura', description: 'Caixa de transporte com travas de segurança', image: '✈️', price: 'R$ 199,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 7, name: 'Varinha de Brinquedo com Penas', description: 'Brinquedo interativo para estimular o instinto de caça', image: '🎣', price: 'R$ 19,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 8, name: 'Areia Higiênica Super Absorvente', description: 'Areia sílica que elimina odores e absorve a umidade', image: '✨', price: 'R$ 49,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 9, name: 'Coleira com GPS Integrado', description: 'Coleira com rastreador para segurança do seu gato', image: '🛰️', price: 'R$ 299,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 10, name: 'Túnel Dobrável para Gatos', description: 'Túnel de tecido para diversão e esconderijo', image: '🚇', price: 'R$ 69,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 11, name: 'Túnel de Brincar', description: 'Túnel dobrável para diversão e exercícios', image: '🌀', price: 'R$ 89,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 12, name: 'Petisco Natural Premium', description: 'Snacks naturais e saudáveis para recompensas', image: '🦴', price: 'R$ 34,90', category: 'Alimentação', inStock: true, discount: 0 },
            { id: 13, name: 'Tapete Sanitário', description: 'Tapete absorvente para higiene e limpeza', image: '🧽', price: 'R$ 19,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 14, name: 'Bola Interativa LED', description: 'Bola com luzes LED para brincadeiras noturnas', image: '💡', price: 'R$ 39,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 15, name: 'Rede de Descanso', description: 'Rede suspensa confortável para relaxamento', image: '🕸️', price: 'R$ 79,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 16, name: 'Spray Calmante', description: 'Spray natural para reduzir stress e ansiedade', image: '💨', price: 'R$ 54,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 17, name: 'Escova Massageadora', description: 'Escova com cerdas macias para massagem relaxante', image: '🪮', price: 'R$ 29,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 18, name: 'Comedouro Elevado', description: 'Comedouro ergonômico em altura ideal', image: '🏔️', price: 'R$ 89,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 19, name: 'Manta Térmica', description: 'Manta aquecida para conforto nos dias frios', image: '🔥', price: 'R$ 119,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 20, name: 'Laser Pointer', description: 'Ponteiro laser para exercícios e diversão', image: '🔴', price: 'R$ 24,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 21, name: 'Vitamina Multifuncional', description: 'Suplemento vitamínico para saúde completa', image: '💊', price: 'R$ 64,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 22, name: 'Arranhador Compacto', description: 'Arranhador pequeno para espaços reduzidos', image: '📐', price: 'R$ 49,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 23, name: 'Caneca Gato Preto', description: 'Caneca de cerâmica com estampa de gato preto.', image: '☕', price: 'R$ 39,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 24, name: 'Camiseta "Cat Person"', description: 'Camiseta de algodão com estampa divertida.', image: '👕', price: 'R$ 59,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 25, name: 'Bolsa Ecobag de Gatinho', description: 'Bolsa de algodão para compras.', image: '👜', price: 'R$ 29,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 26, name: 'Chaveiro de Gato', description: 'Chaveiro de metal em formato de gato.', image: '🔑', price: 'R$ 19,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 27, name: 'Meias de Gatinho', description: 'Par de meias com estampa de patas de gato.', image: '🧦', price: 'R$ 24,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 28, name: 'Livro "O Encantador de Gatos"', description: 'Livro sobre comportamento felino.', image: '📖', price: 'R$ 49,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 29, name: 'Quadro Decorativo de Gato', description: 'Quadro com ilustração de gato para decorar a casa.', image: '🖼️', price: 'R$ 79,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 30, name: 'Adesivos de Gato para Notebook', description: 'Cartela de adesivos de vinil.', image: '🐱', price: 'R$ 14,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 31, name: 'Mousepad de Gato', description: 'Mousepad com estampa de gato.', image: '🖱️', price: 'R$ 34,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 32, name: 'Almofada de Gato', description: 'Almofada em formato de gato.', image: '😻', price: 'R$ 69,90', category: 'Para Donos', inStock: true, discount: 0 },
            { id: 33, name: 'Shampoo Antipulgas', description: 'Shampoo especial para prevenção de pulgas', image: '🧼', price: 'R$ 39,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 34, name: 'Brinquedo Pena', description: 'Varinha com penas para estimular caça', image: '🪶', price: 'R$ 19,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 35, name: 'Caixa de Areia Premium', description: 'Areia sanitária de alta absorção', image: '📦', price: 'R$ 34,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 36, name: 'Colchonete Ortopédico', description: 'Colchão especial para gatos idosos', image: '🛌', price: 'R$ 159,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 37, name: 'Dispensador de Ração', description: 'Alimentador automático programável', image: '⏰', price: 'R$ 179,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 38, name: 'Escada para Gatos', description: 'Escada dobrável para acesso a alturas', image: '🪜', price: 'R$ 89,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 39, name: 'Kit Dental Felino', description: 'Escova e pasta para higiene bucal', image: '🦷', price: 'R$ 44,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 40, name: 'Bolsa Transporte Luxo', description: 'Bolsa elegante para transporte confortável', image: '👜', price: 'R$ 229,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 41, name: 'Ração Filhote Premium', description: 'Ração especial para gatinhos até 12 meses', image: '🍼', price: 'R$ 94,90', category: 'Alimentação', inStock: true, discount: 0 },
            { id: 42, name: 'Brinquedo Ratinho', description: 'Ratinho de pelúcia com catnip natural', image: '🐭', price: 'R$ 14,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 43, name: 'Termômetro Digital', description: 'Termômetro específico para felinos', image: '🌡️', price: 'R$ 59,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 44, name: 'Brinquedo Eletrônico', description: 'Brinquedo com movimento automático', image: '🔋', price: 'R$ 79,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 45, name: 'Caixa Sanitária Fechada', description: 'Banheiro fechado com filtro de odor', image: '🚽', price: 'R$ 119,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 46, name: 'Suplemento Pelo', description: 'Vitamina para pelagem brilhante', image: '✨', price: 'R$ 54,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 47, name: 'Arranhador Vertical', description: 'Torre arranhador de 1,5m de altura', image: '🗼', price: 'R$ 249,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 48, name: 'Coleira GPS', description: 'Coleira com rastreamento por GPS', image: '🛰️', price: 'R$ 199,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 49, name: 'Tapete Aquecido', description: 'Tapete com aquecimento elétrico seguro', image: '🔥', price: 'R$ 139,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 50, name: 'Kit Beleza Completo', description: 'Kit com todos os itens para estética', image: '💅', price: 'R$ 89,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 51, name: 'Brinquedo Inteligente', description: 'Brinquedo que responde ao movimento', image: '🧠', price: 'R$ 129,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 52, name: 'Cama Ortopédica Luxo', description: 'Cama premium com espuma viscoelástica', image: '👑', price: 'R$ 299,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 53, name: 'Sistema de Câmeras', description: 'Câmera para monitorar seu gato remotamente', image: '📹', price: 'R$ 399,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 54, name: 'Kit Completo Iniciante', description: 'Kit com tudo para novos tutores', image: '🎁', price: 'R$ 199,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 55, name: 'Ração Sênior Premium', description: 'Ração especial para gatos idosos', image: '👴', price: 'R$ 109,90', category: 'Alimentação', inStock: true, discount: 0 },
            { id: 56, name: 'Brinquedo Varinha Mágica', description: 'Varinha com penas coloridas e guizo', image: '🪄', price: 'R$ 24,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 57, name: 'Shampoo Antipulgas', description: 'Shampoo natural contra pulgas e carrapatos', image: '🧴', price: 'R$ 44,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 58, name: 'Casa Árvore Gigante', description: 'Arranhador em formato de árvore 2m', image: '🌳', price: 'R$ 599,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 59, name: 'Comedouro Elevado Duplo', description: 'Comedouro duplo em altura ergonômica', image: '🥣', price: 'R$ 89,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 60, name: 'Bola Dispensadora', description: 'Bola que libera petiscos durante o jogo', image: '🎾', price: 'R$ 49,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 61, name: 'Kit Dental Completo', description: 'Escova, pasta e brinquedos dentais', image: '🦷', price: 'R$ 64,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 62, name: 'Mochila Transporte', description: 'Mochila ergonômica para transporte', image: '🎒', price: 'R$ 179,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 63, name: 'Túnel Dobrável', description: 'Túnel de brincar dobrável e portátil', image: '🚇', price: 'R$ 59,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 64, name: 'Vitamina Multifuncional', description: 'Complexo vitamínico completo', image: '💊', price: 'R$ 74,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 65, name: 'Escada para Cama', description: 'Escada dobrável para acesso a móveis', image: '🪜', price: 'R$ 119,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 66, name: 'Dispensador de Água', description: 'Dispensador automático com sensor', image: '🚰', price: 'R$ 159,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 67, name: 'Cama Suspensa', description: 'Cama que se fixa em radiadores', image: '🛏️', price: 'R$ 99,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 68, name: 'Kit Limpeza Orelhas', description: 'Solução e aplicadores para higiene', image: '👂', price: 'R$ 34,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 69, name: 'Brinquedo Robô', description: 'Robô interativo com controle remoto', image: '🤖', price: 'R$ 249,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 70, name: 'Tapete Sanitário', description: 'Tapete absorvente descartável', image: '🧽', price: 'R$ 29,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 71, name: 'Coleira Antipulgas', description: 'Coleira com proteção de 8 meses', image: '🔵', price: 'R$ 69,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 72, name: 'Fonte Cerâmica', description: 'Fonte de água em cerâmica artesanal', image: '🏺', price: 'R$ 149,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 73, name: 'Kit Unhas Completo', description: 'Cortador, lima e protetor de unhas', image: '💅', price: 'R$ 54,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 74, name: 'Brinquedo Peixe Eletrônico', description: 'Peixe que se move sozinho na água', image: '🐠', price: 'R$ 89,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 75, name: 'Caixa Areia Automática', description: 'Caixa que se limpa automaticamente', image: '🔄', price: 'R$ 899,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 76, name: 'Suplemento Articular', description: 'Glucosamina para articulações saudáveis', image: '🦴', price: 'R$ 84,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 77, name: 'Casa Inteligente', description: 'Casa com controle de temperatura', image: '🏡', price: 'R$ 799,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 78, name: 'Kit Veterinário Doméstico', description: 'Kit completo para cuidados básicos', image: '⚕️', price: 'R$ 149,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 79, name: 'Ração Orgânica Premium', description: 'Ração 100% orgânica sem conservantes', image: '🌱', price: 'R$ 129,90', category: 'Alimentação', inStock: true, discount: 0 },
            { id: 80, name: 'Brinquedo Caça Laser', description: 'Dispositivo automático com laser rotativo', image: '🔴', price: 'R$ 199,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 81, name: 'Perfume Desodorante', description: 'Spray neutralizador de odores naturais', image: '🌺', price: 'R$ 39,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 82, name: 'Torre Arranhador Luxo', description: 'Torre de 2,5m com múltiplos níveis', image: '🏰', price: 'R$ 699,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 83, name: 'Comedouro Inteligente', description: 'Comedouro com app e reconhecimento facial', image: '📱', price: 'R$ 449,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 84, name: 'Bola Catnip Gigante', description: 'Bola de 15cm recheada com catnip', image: '🟢', price: 'R$ 34,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 85, name: 'Kit Spa Completo', description: 'Shampoo, condicionador e óleos relaxantes', image: '🛁', price: 'R$ 89,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 86, name: 'Transportadora Aérea', description: 'Aprovada para viagens de avião', image: '✈️', price: 'R$ 299,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 87, name: 'Circuito de Bolinhas', description: 'Pista circular com bolinhas coloridas', image: '🎪', price: 'R$ 79,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 88, name: 'Suplemento Imunidade', description: 'Vitaminas para fortalecer imunidade', image: '🛡️', price: 'R$ 69,90', category: 'Saúde', inStock: true, discount: 0 },
            { id: 89, name: 'Ponte Suspensa', description: 'Ponte de corda para escalada', image: '🌉', price: 'R$ 119,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 90, name: 'Bebedouro Gelado', description: 'Mantém água sempre fresca', image: '🧊', price: 'R$ 179,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 91, name: 'Almofada Térmica', description: 'Almofada que mantém temperatura corporal', image: '🌡️', price: 'R$ 89,90', category: 'Conforto', inStock: true, discount: 0 },
            { id: 92, name: 'Kit Higiene Bucal', description: 'Escova elétrica e enxaguante', image: '🪥', price: 'R$ 74,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 93, name: 'Brinquedo Pássaro Voador', description: 'Pássaro eletrônico que voa pela casa', image: '🦅', price: 'R$ 159,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 94, name: 'Caixa Areia Biodegradável', description: 'Areia ecológica 100% natural', image: '♻️', price: 'R$ 49,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 95, name: 'Coleira Luminosa LED', description: 'Coleira com luzes LED recarregáveis', image: '💡', price: 'R$ 59,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 96, name: 'Fonte Cascata Premium', description: 'Fonte de aço inox com 3 níveis', image: '⛲', price: 'R$ 249,90', category: 'Acessórios', inStock: true, discount: 0 },
            { id: 97, name: 'Kit Manicure Profissional', description: 'Cortador elétrico e lixas especiais', image: '✂️', price: 'R$ 94,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 98, name: 'Brinquedo Aquário Virtual', description: 'Tela com peixes virtuais interativos', image: '🐟', price: 'R$ 299,90', category: 'Brinquedos', inStock: true, discount: 0 },
            { id: 99, name: 'Sistema Limpeza Automática', description: 'Robô aspirador para pelos de gato', image: '🤖', price: 'R$ 1299,90', category: 'Higiene', inStock: true, discount: 0 },
            { id: 100, name: 'Kit Luxo Completo', description: 'Conjunto premium com 20 itens essenciais', image: '👑', price: 'R$ 999,90', category: 'Acessórios', inStock: true, discount: 0 }
        ];
        console.log('Produtos padrão carregados:', products.length);
        saveProducts();
    }

    // Carregar ofertas
    const savedOffers = localStorage.getItem('adminOffers');
    if (savedOffers) {
        offers = JSON.parse(savedOffers);
    }

    // Carregar pedidos
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }

    // Popular filtros de categoria
    populateCategoryFilter();
}

function saveProducts() {
    localStorage.setItem('adminProducts', JSON.stringify(products));
}

function saveOffers() {
    localStorage.setItem('adminOffers', JSON.stringify(offers));
}

function saveOrders() {
    localStorage.setItem('adminOrders', JSON.stringify(orders));
}

// Produtos
function loadProducts() {
    console.log('Carregando produtos...', products.length);
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('Elemento productsGrid não encontrado!');
        return;
    }
    
    grid.innerHTML = '';

    const filteredProducts = getFilteredProducts();
    console.log('Produtos filtrados:', filteredProducts.length);

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="empty-state">Nenhum produto encontrado</div>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

function getFilteredProducts() {
    const searchInput = document.getElementById('productSearch');
    const categoryInput = document.getElementById('categoryFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryFilter = categoryInput ? categoryInput.value : '';

    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const statusBadges = [];
    if (product.inStock) {
        statusBadges.push('<span class="status-badge in-stock">Em Estoque</span>');
    } else {
        statusBadges.push('<span class="status-badge out-of-stock">Sem Estoque</span>');
    }
    
    if (product.discount > 0) {
        statusBadges.push('<span class="status-badge on-sale">Promoção</span>');
    }

    card.innerHTML = `
        <div class="product-header">
            <div class="product-emoji">${product.image}</div>
            <div class="product-status">
                ${statusBadges.join('')}
            </div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price}</div>
            <p><strong>Categoria:</strong> ${product.category}</p>
            ${product.discount > 0 ? `<p><strong>Desconto:</strong> ${product.discount}%</p>` : ''}
        </div>
        <div class="product-actions">
            <button class="action-btn edit" onclick="editProduct(${product.id})">✏️ Editar</button>
            <button class="action-btn toggle" onclick="toggleProductStock(${product.id})">
                ${product.inStock ? '❌ Desativar' : '✅ Ativar'}
            </button>
            <button class="action-btn delete" onclick="deleteProduct(${product.id})">🗑️ Excluir</button>
        </div>
    `;

    return card;
}

function populateCategoryFilter() {
    console.log('Populando filtro de categorias...');
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) {
        console.error('Elemento categoryFilter não encontrado!');
        return;
    }
    
    const categories = [...new Set(products.map(p => p.category))];
    console.log('Categorias encontradas:', categories);
    
    categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterProducts() {
    loadProducts();
}

// Modal de produto
function openProductModal(product = null) {
    currentEditingProduct = product;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');

    if (product) {
        title.textContent = 'Editar Produto';
        fillProductForm(product);
    } else {
        title.textContent = 'Novo Produto';
        form.reset();
        document.getElementById('productInStock').checked = true;
        document.getElementById('productDiscount').value = 0;
    }

    modal.classList.add('show');
}

function fillProductForm(product) {
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productEmoji').value = product.image;
    document.getElementById('productInStock').checked = product.inStock;
    document.getElementById('productDiscount').value = product.discount || 0;
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
    currentEditingProduct = null;
}

function handleProductSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productEmoji').value || '📦',
        inStock: document.getElementById('productInStock').checked,
        discount: parseInt(document.getElementById('productDiscount').value) || 0
    };

    if (currentEditingProduct) {
        // Editar produto existente
        const index = products.findIndex(p => p.id === currentEditingProduct.id);
        products[index] = { ...currentEditingProduct, ...formData };
        showToast('Produto atualizado com sucesso!', 'success');
    } else {
        // Adicionar novo produto
        const newProduct = {
            id: Date.now(),
            ...formData
        };
        products.push(newProduct);
        showToast('Produto adicionado com sucesso!', 'success');
    }

    saveProducts();
    loadProducts();
    populateCategoryFilter();
    closeProductModal();
    updateStats();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product);
    }
}

function toggleProductStock(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.inStock = !product.inStock;
        saveProducts();
        loadProducts();
        showToast(`Produto ${product.inStock ? 'ativado' : 'desativado'} com sucesso!`, 'success');
    }
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        showConfirmModal(
            `Tem certeza que deseja excluir o produto "${product.name}"?`,
            () => {
                products = products.filter(p => p.id !== id);
                saveProducts();
                loadProducts();
                populateCategoryFilter();
                updateStats();
                showToast('Produto excluído com sucesso!', 'success');
            }
        );
    }
}

// Ofertas
function loadOffers() {
    const grid = document.getElementById('offersGrid');
    grid.innerHTML = '';

    if (offers.length === 0) {
        grid.innerHTML = '<div class="empty-state">Nenhuma oferta cadastrada</div>';
        return;
    }

    offers.forEach(offer => {
        const offerCard = createOfferCard(offer);
        grid.appendChild(offerCard);
    });

    // Popular select de produtos no modal de oferta
    populateProductSelect();
}

function createOfferCard(offer) {
    const product = products.find(p => p.id === offer.productId);
    const card = document.createElement('div');
    card.className = 'product-card';

    const isActive = offer.isActive && new Date() >= new Date(offer.startDate) && new Date() <= new Date(offer.endDate);

    card.innerHTML = `
        <div class="product-header">
            <div class="product-emoji">${product ? product.image : '🎯'}</div>
            <div class="product-status">
                <span class="status-badge ${isActive ? 'in-stock' : 'out-of-stock'}">
                    ${isActive ? 'Ativa' : 'Inativa'}
                </span>
            </div>
        </div>
        <div class="product-info">
            <h3>${offer.title}</h3>
            <p>${offer.description}</p>
            <p><strong>Produto:</strong> ${product ? product.name : 'Produto não encontrado'}</p>
            <p><strong>Desconto:</strong> ${offer.discountPercentage}%</p>
            <p><strong>Período:</strong> ${formatDate(offer.startDate)} - ${formatDate(offer.endDate)}</p>
        </div>
        <div class="product-actions">
            <button class="action-btn edit" onclick="editOffer(${offer.id})">✏️ Editar</button>
            <button class="action-btn delete" onclick="deleteOffer(${offer.id})">🗑️ Excluir</button>
        </div>
    `;

    return card;
}

function populateProductSelect() {
    const select = document.getElementById('offerProduct');
    select.innerHTML = '<option value="">Selecione um produto</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

function openOfferModal(offer = null) {
    currentEditingOffer = offer;
    const modal = document.getElementById('offerModal');
    const title = document.getElementById('offerModalTitle');
    const form = document.getElementById('offerForm');

    populateProductSelect();

    if (offer) {
        title.textContent = 'Editar Oferta';
        fillOfferForm(offer);
    } else {
        title.textContent = 'Nova Oferta';
        form.reset();
        document.getElementById('offerActive').checked = true;
        // Definir datas padrão
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        document.getElementById('offerStartDate').value = today;
        document.getElementById('offerEndDate').value = nextWeek;
    }

    modal.classList.add('show');
}

function fillOfferForm(offer) {
    document.getElementById('offerProduct').value = offer.productId;
    document.getElementById('offerTitle').value = offer.title;
    document.getElementById('offerDescription').value = offer.description;
    document.getElementById('offerDiscount').value = offer.discountPercentage;
    document.getElementById('offerActive').checked = offer.isActive;
    document.getElementById('offerStartDate').value = offer.startDate;
    document.getElementById('offerEndDate').value = offer.endDate;
}

function closeOfferModal() {
    document.getElementById('offerModal').classList.remove('show');
    currentEditingOffer = null;
}

function handleOfferSubmit(e) {
    e.preventDefault();

    const formData = {
        productId: parseInt(document.getElementById('offerProduct').value),
        title: document.getElementById('offerTitle').value,
        description: document.getElementById('offerDescription').value,
        discountPercentage: parseInt(document.getElementById('offerDiscount').value),
        isActive: document.getElementById('offerActive').checked,
        startDate: document.getElementById('offerStartDate').value,
        endDate: document.getElementById('offerEndDate').value
    };

    if (currentEditingOffer) {
        // Editar oferta existente
        const index = offers.findIndex(o => o.id === currentEditingOffer.id);
        offers[index] = { ...currentEditingOffer, ...formData };
        showToast('Oferta atualizada com sucesso!', 'success');
    } else {
        // Adicionar nova oferta
        const newOffer = {
            id: Date.now(),
            ...formData
        };
        offers.push(newOffer);
        showToast('Oferta adicionada com sucesso!', 'success');
    }

    saveOffers();
    loadOffers();
    closeOfferModal();
    updateStats();
}

function editOffer(id) {
    const offer = offers.find(o => o.id === id);
    if (offer) {
        openOfferModal(offer);
    }
}

function deleteOffer(id) {
    const offer = offers.find(o => o.id === id);
    if (offer) {
        showConfirmModal(
            `Tem certeza que deseja excluir a oferta "${offer.title}"?`,
            () => {
                offers = offers.filter(o => o.id !== id);
                saveOffers();
                loadOffers();
                updateStats();
                showToast('Oferta excluída com sucesso!', 'success');
            }
        );
    }
}

// Pedidos
function loadOrders() {
    const list = document.getElementById('ordersList');
    list.innerHTML = '';

    if (orders.length === 0) {
        list.innerHTML = '<div class="empty-state">Nenhum pedido recebido</div>';
        return;
    }

    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        list.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const statusClass = {
        pending: 'out-of-stock',
        confirmed: 'on-sale',
        delivered: 'in-stock'
    };

    const statusText = {
        pending: 'Pendente',
        confirmed: 'Confirmado',
        delivered: 'Entregue'
    };

    card.innerHTML = `
        <div class="product-header">
            <div class="product-emoji">📋</div>
            <div class="product-status">
                <span class="status-badge ${statusClass[order.status]}">
                    ${statusText[order.status]}
                </span>
            </div>
        </div>
        <div class="product-info">
            <h3>Pedido #${order.id}</h3>
            <p><strong>Cliente:</strong> ${order.customerInfo.name}</p>
            <p><strong>Telefone:</strong> ${order.customerInfo.phone}</p>
            <p><strong>Data:</strong> ${order.date}</p>
            <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
            <p><strong>Itens:</strong> ${order.items.length} produto(s)</p>
        </div>
    `;

    return card;
}

// Configurações e utilitários
function updateStats() {
    document.getElementById('totalProducts').textContent = products.length;
    
    const activeOffers = offers.filter(offer => {
        const now = new Date();
        return offer.isActive && 
               new Date(offer.startDate) <= now && 
               new Date(offer.endDate) >= now;
    }).length;
    document.getElementById('activeOffers').textContent = activeOffers;
    
    document.getElementById('totalOrders').textContent = orders.length;
}

function exportData() {
    const data = {
        products,
        offers,
        orders,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cathouse-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Dados exportados com sucesso!', 'success');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            if (data.products) products = data.products;
            if (data.offers) offers = data.offers;
            if (data.orders) orders = data.orders;

            saveProducts();
            saveOffers();
            saveOrders();

            loadProducts();
            populateCategoryFilter();
            updateStats();

            showToast('Dados importados com sucesso!', 'success');
        } catch (error) {
            showToast('Erro ao importar dados. Verifique o arquivo.', 'error');
        }
    };
    reader.readAsText(file);
}

// Modais e utilitários
function showConfirmModal(message, onConfirm) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('show');
    
    document.getElementById('confirmAction').onclick = () => {
        onConfirm();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
