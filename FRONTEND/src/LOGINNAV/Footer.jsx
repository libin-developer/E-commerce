// src/components/Footer.jsx


const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} buykart@gmail.com || All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
