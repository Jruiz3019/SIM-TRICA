/* MOVED: src/components/Footer -> src/layouts/Footer — motivo: reorganización de layout - Fecha: 2025-10-01 */
// src/layouts/Footer/Footer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './FooterStyle.css';

import InstagramIcon from '../../assets/instagram.png';
import FacebookIcon from '../../assets/facebook.png';
import TikTokIcon from '../../assets/tiktok.png';
import PinterestIcon from '../../assets/pinterest.png';
import WhatsAppIcon from '../../assets/whatsapp.png';

const SOCIAL_ICONS: Record<string, string> = {
    Instagram: InstagramIcon,
    Facebook: FacebookIcon,
    TikTok: TikTokIcon,
    Pinterest: PinterestIcon,
    WhatsApp: WhatsAppIcon,
};

export interface LinkItem {
    label: string;
    href: string;
    external?: boolean;
}

export interface Column {
    title: string;
    links: LinkItem[];
}

export interface FooterProps {
    logoSrc?: string;
    logoAlt?: string;
    columns?: Column[];
    copyright?: string;
    className?: string;
    ariaLabel?: string;
    socialLinks?: LinkItem[];
}

const Footer: React.FC<FooterProps> = ({
    logoSrc,
    logoAlt = "Logo",
    columns = [],
    copyright,
    className = '',
    ariaLabel = 'Pie de página',
    socialLinks = []
}) => {

    const { isAdmin } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setIsVisible(true);
                });
            },
            { threshold: 0.15 }
        );

        const element = document.querySelector('.footer');
        if (element) observer.observe(element);
        return () => { if (element) observer.unobserve(element); };
    }, []);

    return (
        <footer
            className={`footer ${className} ${isVisible ? 'footer--visible' : ''}`}
            role="contentinfo"
            aria-label={ariaLabel}
        >
            <div className="footer__container">

                <div className="footer__main">

                    {/* Columna 1 — Marca */}
                    <div className="footer__brand">
                        {logoSrc && (
                            <Link to="/" aria-label="Volver al inicio" className="footer__brand-logo">
                                <img
                                    src={logoSrc}
                                    alt={logoAlt}
                                    className="footer__logo"
                                    loading="lazy"
                                />
                            </Link>
                        )}
                        <p className="footer__tagline">Aislamiento acústico de precisión</p>
                        <p className="footer__description">
                            Especialistas en insonorización y acondicionamiento acústico
                            para espacios residenciales, comerciales e industriales.
                        </p>

                        {socialLinks.length > 0 && (
                            <div className="footer__social-icons" aria-label="Redes sociales">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="footer__social-icon"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                    >
                                        <img
                                            src={SOCIAL_ICONS[social.label]}
                                            alt={social.label}
                                            loading="lazy"
                                        />
                                    </a>
                                ))}
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="footer__social-icon"
                                        aria-label="Panel administrativo"
                                    >
                                        <span className="footer__admin-icon">⚙</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Columnas de links */}
                    {columns.map((column, columnIndex) => (
                        <div key={columnIndex} className="footer__column">
                            <h4 className="footer__column-title">
                                <span>{column.title}</span>
                                <span className="footer__column-line"></span>
                            </h4>
                            <ul className="footer__links" role="list">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex} role="listitem">
                                        <a
                                            href={link.href}
                                            className="footer__link"
                                            target={link.external ? '_blank' : '_self'}
                                            rel={link.external ? 'noopener noreferrer' : undefined}
                                            aria-label={link.external ? `${link.label} (abre en nueva pestaña)` : link.label}
                                        >
                                            {link.label}
                                            {link.external && (
                                                <span className="footer__external-icon" aria-hidden="true">↗</span>
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {copyright && (
                    <>
                        <div className="footer__separator"></div>
                        <div className="footer__bottom">
                            <span className="footer__copyright-text">{copyright}</span>
                        </div>
                    </>
                )}

            </div>
        </footer>
    );
};

export default Footer;
