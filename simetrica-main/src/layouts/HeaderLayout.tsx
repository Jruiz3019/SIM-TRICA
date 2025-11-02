// src/layouts/HeaderLayout.tsx
import { useState, useEffect } from 'react';
import Logo from '../assets/logoSi-blanco.png';
import { Link, useNavigate } from 'react-router-dom';
import { useNavVisibility } from '../hooks/useNavVisibility'; // AÑADIDO: Hook para comportamiento dinámico
import { useAuth } from '../context/useAuth';
import * as authService from '../services/authService';
import "./styles/HeaderStyle.css"

const HeaderLayout = () => {
    // Estado para controlar el menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // AÑADIDO: Hook para controlar visibilidad dinámica del navbar
    const isNavVisible = useNavVisibility({ offset: 120, threshold: 8 });
    
    // AÑADIDO: Auth context y navegación
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    // Efecto para detectar scroll y cambiar estilo del header
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Función para alternar el menú móvil
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Función para cerrar el menú móvil al hacer click en un enlace
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Función para manejar el click fuera del menú
    const handleOverlayClick = () => {
        setIsMobileMenuOpen(false);
    };
    
    // AÑADIDO: Función para manejar logout
    const handleLogout = async () => {
        try {
            // Llamar al backend para invalidar el token
            const token = localStorage.getItem('token');
            if (token) {
                await authService.logout(token);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            // Limpiar estado local
            logout();
            closeMobileMenu();
            navigate('/');
        }
    };

    return (
        <>
            {/* MODIFICADO: Header principal con clases dinámicas para scroll y visibilidad */}
            <header 
                className={`header ${isScrolled ? 'header--scrolled' : ''} ${isNavVisible ? 'header--visible' : 'header--hidden'}`}
                aria-hidden={!isNavVisible}
            >
                <div className='container header__container'>
                    {/* Logo de la empresa */}
                    <Link to="/" className='logo-container' aria-label="Volver al inicio">
                        <img 
                            src={Logo} 
                            alt="Simétrica" 
                            className="logo-container__icon"
                        />
                        <span className="logo-container__text">SIMÉTRICA</span>
                    </Link>

                    {/* Navegación desktop */}
                    <nav className='nav-container nav-container--desktop' aria-label="Navegación principal">
                        <Link to="/" className="nav-container__link">Inicio</Link>
                        <Link to="/asociados" className="nav-container__link">Asociados</Link>
                        <Link to="/proyectos" className="nav-container__link">Proyectos</Link>
                        <Link to="/diseños" className="nav-container__link">Diseños</Link>
                        <Link to="/trabaja-con-nosotros" className="nav-container__link">Trabaja con nosotros</Link>
                        <Link className='nav-container__link nav-container__link--cta' to="/contacto">Contacto</Link>
                        
                        {/* Botones de autenticación */}
                        {isAuthenticated ? (
                            <div className="nav-container__auth">
                                <span className="nav-container__username">Hola, {user?.username}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="nav-container__link nav-container__link--logout"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div className="nav-container__auth">
                                <Link to="/login" className="nav-container__link">Iniciar sesión</Link>
                                <Link to="/register" className="nav-container__link nav-container__link--cta">Registrarse</Link>
                            </div>
                        )}
                    </nav>

                    {/* Botón hamburguesa para móvil */}
                    <button 
                        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'mobile-menu-toggle--open' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-nav"
                    >
                        <span className="mobile-menu-toggle__line"></span>
                        <span className="mobile-menu-toggle__line"></span>
                        <span className="mobile-menu-toggle__line"></span>
                    </button>
                </div>
            </header>

            {/* Overlay para cerrar menú móvil */}
            {isMobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay" 
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                ></div>
            )}

            {/* Navegación móvil */}
            <nav 
                id="mobile-nav"
                className={`nav-container nav-container--mobile ${isMobileMenuOpen ? 'nav-container--mobile-open' : ''}`}
                aria-label="Navegación móvil"
            >
                <Link to="/" className="nav-container__link" onClick={closeMobileMenu}>Inicio</Link>
                <Link to="/asociados" className="nav-container__link" onClick={closeMobileMenu}>Asociados</Link>
                <Link to="/proyectos" className="nav-container__link" onClick={closeMobileMenu}>Proyectos</Link>
                <Link to="/diseños" className="nav-container__link" onClick={closeMobileMenu}>Diseños</Link>
                <Link to="/trabaja-con-nosotros" className="nav-container__link" onClick={closeMobileMenu}>Trabaja con nosotros</Link>
                <Link className='nav-container__link nav-container__link--cta' to="/contacto" onClick={closeMobileMenu}>Contacto</Link>
                
                {/* Botones de autenticación móvil */}
                {isAuthenticated ? (
                    <>
                        <div className="nav-container__username-mobile">Hola, {user?.username}</div>
                        <button 
                            onClick={handleLogout}
                            className="nav-container__link nav-container__link--logout"
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-container__link" onClick={closeMobileMenu}>Iniciar sesión</Link>
                        <Link to="/register" className="nav-container__link nav-container__link--cta" onClick={closeMobileMenu}>Registrarse</Link>
                    </>
                )}
            </nav>
        </>
    )
}

export default HeaderLayout;