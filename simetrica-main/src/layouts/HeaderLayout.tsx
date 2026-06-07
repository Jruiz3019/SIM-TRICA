// src/layouts/HeaderLayout.tsx
import { useState, useEffect, useRef } from 'react';
import Logo from '../assets/logoSi-blanco.png';
import { Link, useNavigate } from 'react-router-dom';
import { useNavVisibility } from '../hooks/useNavVisibility';
import { useAuth } from '../context/useAuth';
import * as authService from '../services/authService';
import "./styles/HeaderStyle.css"

const HeaderLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const isNavVisible = useNavVisibility({ offset: 120, threshold: 8 });
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    const handleOverlayClick = () => {
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await authService.logout(token);
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            logout();
            closeMobileMenu();
            navigate('/');
        }
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <>
            <header 
                className={`header ${isScrolled ? 'header--scrolled' : ''} ${isNavVisible ? 'header--visible' : 'header--hidden'}`}
                aria-hidden={!isNavVisible}
            >
                <div className='container header__container'>
                    <Link to="/" className='logo-container' aria-label="Volver al inicio">
                        <img 
                            src={Logo} 
                            alt="Simétrica" 
                            className="logo-container__icon"
                        />
                        <span className="logo-container__text">SIMÉTRICA</span>
                    </Link>

                    <nav className='nav-container nav-container--desktop' aria-label="Navegación principal">
                        <Link to="/" className="nav-container__link">Inicio</Link>
                        
                        <div className="nav-container__dropdown" ref={dropdownRef}>
                            <button 
                                className={`nav-container__link nav-container__dropdown-trigger${isDropdownOpen ? ' nav-container__dropdown-trigger--open' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                Alianzas
                                <span className="nav-container__dropdown-arrow" aria-hidden="true" />
                            </button> 
                            {isDropdownOpen && (
                                <div className="nav-container__dropdown-menu">
                                    <Link to="/asociados" className="nav-container__dropdown-item" onClick={closeDropdown}>IPUC</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/proyectos" className="nav-container__link">Proyectos</Link>
                        <Link to="/diseños" className="nav-container__link">Diseños</Link>
                        <Link to="/trabaja-con-nosotros" className="nav-container__link">Trabaja con nosotros</Link>
                        <Link className='nav-container__link nav-container__link--cta' to="/contacto">Contacto</Link>
                        
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

            {isMobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay" 
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                ></div>
            )}

            <nav 
                id="mobile-nav"
                className={`nav-container nav-container--mobile ${isMobileMenuOpen ? 'nav-container--mobile-open' : ''}`}
                aria-label="Navegación móvil"
            >
                <Link to="/" className="nav-container__link" onClick={closeMobileMenu}>Inicio</Link>
                
                <button 
                    className={`nav-container__link nav-container__dropdown-trigger nav-container__dropdown-trigger--mobile${isMobileDropdownOpen ? ' nav-container__dropdown-trigger--open' : ''}`}
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    aria-expanded={isMobileDropdownOpen}
                >
                    Asociados
                    <span className="nav-container__dropdown-arrow" aria-hidden="true" />
                </button>
                {isMobileDropdownOpen && (
                    <div className="nav-container__dropdown-menu nav-container__dropdown-menu--mobile">
                        <Link to="/asociados" className="nav-container__dropdown-item" onClick={closeMobileMenu}>IPUC</Link>
                    </div>
                )}
                
                <Link to="/proyectos" className="nav-container__link" onClick={closeMobileMenu}>Proyectos</Link>
                <Link to="/diseños" className="nav-container__link" onClick={closeMobileMenu}>Diseños</Link>
                <Link to="/trabaja-con-nosotros" className="nav-container__link" onClick={closeMobileMenu}>Trabaja con nosotros</Link>
                <Link className='nav-container__link nav-container__link--cta' to="/contacto" onClick={closeMobileMenu}>Contacto</Link>
                
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
