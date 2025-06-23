import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio');

  // Função para detectar qual seção está visível durante o scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'sobre', 'catshop', 'clinica', 'contato'];
      const scrollPosition = window.scrollY + 100; // Offset para melhor detecção

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          // Adicionar pequeno delay para suavizar a transição
          setTimeout(() => {
            setActiveSection(sections[i]);
          }, 50);
          break;
        }
      }
    };

    // Throttle do scroll para melhor performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Adicionar listener de scroll
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Chamar uma vez para definir a seção inicial
    handleScroll();

    // Cleanup do listener
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

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
      description: 'Cama macia e confortável para felinos',
      image: '🛏️',
      price: 'R$ 79,90'
    },
    {
      id: 4,
      name: 'Brinquedo Interativo',
      description: 'Brinquedo estimulante para exercícios',
      image: '🎾',
      price: 'R$ 29,90'
    },
    {
      id: 5,
      name: 'Coleira Elegante',
      description: 'Coleira ajustável com design moderno',
      image: '🎀',
      price: 'R$ 24,90'
    },
    {
      id: 6,
      name: 'Casa de Brincar',
      description: 'Casinha divertida para entretenimento',
      image: '🏠',
      price: 'R$ 129,90'
    }
  ];

  const sendWhatsApp = (productName?: string) => {
    const message = productName 
      ? `Olá! Vi esse produto na vitrine online e gostaria de saber mais: ${productName}`
      : 'Olá! Gostaria de saber mais sobre os serviços da Casa dos Gatos!';
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
              className={activeSection === 'inicio' ? 'active' : ''}
              onClick={() => scrollToSection('inicio')}
            >
              Início
            </button>
            <button 
              className={activeSection === 'sobre' ? 'active' : ''}
              onClick={() => scrollToSection('sobre')}
            >
              Sobre
            </button>
            <button 
              className={activeSection === 'catshop' ? 'active' : ''}
              onClick={() => scrollToSection('catshop')}
            >
              Catshop
            </button>
            <button 
              className={activeSection === 'clinica' ? 'active' : ''}
              onClick={() => scrollToSection('clinica')}
            >
              Clínica Felina
            </button>
            <button 
              className={activeSection === 'contato' ? 'active' : ''}
              onClick={() => scrollToSection('contato')}
            >
              Contato
            </button>
          </nav>
        </div>
      </header>

      {/* Seção Início */}
      <section id="inicio" className="hero">
        <div className="hero-content">
          <h2>A clínica e loja perfeita para quem ama gatos!</h2>
          <p>Cuidado especializado e produtos selecionados para o seu felino</p>
        </div>
        <div className="hero-image">
          <img src="/gatinho.png" alt="Gatinho" className="cat-image" />
        </div>
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className="about">
        <div className="container">
          <h2>Sobre Nós</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                A Casa dos Gatos é uma clínica veterinária exclusiva para felinos, 
                com atendimento humanizado, consultas agendadas e uma catshop com 
                produtos selecionados especialmente para o bem-estar dos gatinhos.
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

      {/* Seção Catshop */}
      <section id="catshop" className="catshop">
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

      {/* Seção Clínica */}
      <section id="clinica" className="clinic">
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
            <p><strong>Importante:</strong> Não atendemos emergências</p>
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className="contact">
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

      {/* Rodapé */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span>🐱</span>
              <h3>A Casa dos Gatos</h3>
            </div>
            
            <div className="footer-social">
              <button onClick={() => sendWhatsApp()}>
                <span>💬</span>
              </button>
              <button onClick={() => window.open(instagramUrl, '_blank')}>
                <span>📸</span>
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
