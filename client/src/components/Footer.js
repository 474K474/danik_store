import React from 'react';
import '../css/footer.css'; // Импортируйте файл CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contacts">
        <span>Контакты:</span>
        <a href="https://t.me/mambich474" target="_blank" rel="noopener noreferrer">
          <img src={require('../assets/teleg.png')} alt="Telegram" className="footer-icon" />
        </a>
        <a href="https://www.instagram.com/sypachevmyhail/" target="_blank" rel="noopener noreferrer">
          <img src={require('../assets/inst.png')} alt="Instagram" className="footer-icon" />
        </a>
        <a href="https://wa.me/79823298079" target="_blank" rel="noopener noreferrer">
          <img src={require('../assets/whats.png')} alt="WhatsApp" className="footer-icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;