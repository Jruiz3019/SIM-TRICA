/* ARCHIVO AÑADIDO: ContactForm component - 2025-10-01 */
// src/components/ContactForm/ContactForm.tsx
// Formulario de contacto accesible y responsive siguiendo convenciones del proyecto

import React, { useState, useRef } from 'react';
import './ContactFormStyle.css';
import { sendContact } from '../../services/contactService';

/* Interfaces TypeScript para props tipadas y reutilización */
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  phone?: string;
  message: string;
  honeypot?: string; // Campo anti-spam oculto
}

export interface ContactFormProps {
  initialValues?: Partial<ContactFormData>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  ariaLabel?: string;
}

// Regex para validación de email sin dependencias externas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Componente ContactForm reutilizable y accesible
 * Sigue patrones del proyecto: CSS regular (no modules), variables globales, metodología BEM
 * Implementa WCAG 2.1 AA y responsividad completa (mobile, tablet, desktop, TV)
 */
const ContactForm: React.FC<ContactFormProps> = ({
  initialValues = {},
  onSuccess,
  onError,
  className = '',
  ariaLabel = 'Formulario de contacto'
}) => {
  
  // Estado del formulario con valores iniciales
  const [values, setValues] = useState<ContactFormData>({
    name: initialValues.name || '',
    email: initialValues.email || '',
    subject: initialValues.subject || '',
    phone: initialValues.phone || '',
    message: initialValues.message || '',
    honeypot: '' // Campo anti-spam siempre vacío inicialmente
  });

  // Estado de errores de validación
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  
  // Estado del envío del formulario
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  // Ref para verificar si el componente sigue montado (evitar memory leaks)
  const mountedRef = useRef(true);

  // Cleanup para evitar actualizaciones de estado en componentes desmontados
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Validación del formulario sin dependencias externas
   * Retorna objeto con errores encontrados
   */
  const validate = (payload: ContactFormData): Partial<Record<keyof ContactFormData, string>> => {
    const validationErrors: Partial<Record<keyof ContactFormData, string>> = {};
    
    // Validación nombre: requerido, mínimo 2 caracteres
    if (!payload.name || payload.name.trim().length < 2) {
      validationErrors.name = 'Por favor ingrese su nombre completo.';
    }
    
    // Validación email: requerido, formato válido
    if (!payload.email || !emailRegex.test(payload.email.trim())) {
      validationErrors.email = 'Por favor ingrese un correo electrónico válido.';
    }
    
    // Validación mensaje: requerido, mínimo 10 caracteres
    if (!payload.message || payload.message.trim().length < 10) {
      validationErrors.message = 'El mensaje debe tener al menos 10 caracteres.';
    }
    
    // Validación teléfono: opcional, pero si se proporciona debe ser válido
    if (payload.phone && payload.phone.trim().length > 0 && payload.phone.trim().length < 6) {
      validationErrors.phone = 'Por favor ingrese un número de teléfono válido.';
    }
    
    // Validación honeypot: debe estar vacío (protección anti-spam)
    if (payload.honeypot && payload.honeypot.trim() !== '') {
      validationErrors.honeypot = 'Spam detectado.';
    }
    
    return validationErrors;
  };

  /**
   * Manejador de cambios en los campos del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Manejador del envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir envíos múltiples mientras está procesando
    if (status === 'sending') return;
    
    // Validar formulario
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Si hay errores, no enviar
    if (Object.keys(validationErrors).length > 0) {
      // Enfocar primer campo con error para accesibilidad
      const firstErrorField = Object.keys(validationErrors)[0];
      const fieldElement = document.getElementById(firstErrorField);
      if (fieldElement) {
        fieldElement.focus();
      }
      return;
    }

    // Cambiar estado a enviando
    setStatus('sending');
    
    try {
      // Llamar al servicio de envío
      await sendContact(values);
      
      // Verificar que el componente sigue montado antes de actualizar estado
      if (!mountedRef.current) return;
      
      // Éxito: cambiar estado y limpiar formulario
      setStatus('success');
      setValues({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: '',
        honeypot: ''
      });
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      // Verificar que el componente sigue montado antes de actualizar estado
      if (!mountedRef.current) return;
      
      // Error: cambiar estado y mostrar mensaje
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors({ message: errorMessage });
      
      // Llamar callback de error si existe
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  return (
    <form 
      className={`contact-form ${className}`} 
      onSubmit={handleSubmit} 
      aria-label={ariaLabel}
      noValidate // Usamos validación custom para mejor UX
    >
      {/* Campo honeypot: invisible para usuarios, visible para bots */}
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="company" className="sr-only">
          No llenar este campo
        </label>
        <input 
          id="company"
          name="honeypot" 
          type="text"
          value={values.honeypot} 
          onChange={handleChange} 
          tabIndex={-1} 
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {/* Grid responsivo para campos del formulario */}
      <div className="contact-form__grid">
        
        {/* Campo Nombre */}
        <div className="contact-form__field">
          <label htmlFor="name" className="contact-form__label">
            Nombre completo *
          </label>
          <input 
            id="name"
            name="name" 
            type="text"
            value={values.name} 
            onChange={handleChange} 
            required 
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'error-name' : undefined}
            className={`contact-form__input ${errors.name ? 'contact-form__input--error' : ''}`}
            placeholder="Ingrese su nombre completo"
          />
          {errors.name && (
            <div id="error-name" className="contact-form__error" role="alert">
              {errors.name}
            </div>
          )}
        </div>

        {/* Campo Email */}
        <div className="contact-form__field">
          <label htmlFor="email" className="contact-form__label">
            Correo electrónico *
          </label>
          <input 
            id="email"
            name="email" 
            type="email"
            value={values.email} 
            onChange={handleChange} 
            required 
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-email' : undefined}
            className={`contact-form__input ${errors.email ? 'contact-form__input--error' : ''}`}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <div id="error-email" className="contact-form__error" role="alert">
              {errors.email}
            </div>
          )}
        </div>

        {/* Campo Asunto */}
        <div className="contact-form__field">
          <label htmlFor="subject" className="contact-form__label">
            Asunto
          </label>
          <input 
            id="subject"
            name="subject" 
            type="text"
            value={values.subject} 
            onChange={handleChange} 
            className="contact-form__input"
            placeholder="Asunto del mensaje"
          />
        </div>

        {/* Campo Teléfono */}
        <div className="contact-form__field">
          <label htmlFor="phone" className="contact-form__label">
            Teléfono (opcional)
          </label>
          <input 
            id="phone"
            name="phone" 
            type="tel"
            value={values.phone} 
            onChange={handleChange} 
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
            className={`contact-form__input ${errors.phone ? 'contact-form__input--error' : ''}`}
            placeholder="+57 300 123 4567"
          />
          {errors.phone && (
            <div id="error-phone" className="contact-form__error" role="alert">
              {errors.phone}
            </div>
          )}
        </div>

        {/* Campo Mensaje - Ocupa toda la fila */}
        <div className="contact-form__field contact-form__field--full">
          <label htmlFor="message" className="contact-form__label">
            Mensaje *
          </label>
          <textarea 
            id="message"
            name="message" 
            rows={6}
            value={values.message} 
            onChange={handleChange} 
            required 
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'error-message' : undefined}
            className={`contact-form__textarea ${errors.message ? 'contact-form__input--error' : ''}`}
            placeholder="Escriba su mensaje aquí..."
          />
          {errors.message && (
            <div id="error-message" className="contact-form__error" role="alert">
              {errors.message}
            </div>
          )}
        </div>
      </div>

      {/* Sección de acciones */}
      <div className="contact-form__actions">
        <button 
          type="submit" 
          className="contact-form__submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
        </button>
        
        {/* Mensajes de estado */}
        {status === 'success' && (
          <div role="status" className="contact-form__success">
            ✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.
          </div>
        )}
        
        {status === 'error' && (
          <div role="alert" className="contact-form__error">
            ✗ Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo.
          </div>
        )}
      </div>
    </form>
  );
};

export default ContactForm;