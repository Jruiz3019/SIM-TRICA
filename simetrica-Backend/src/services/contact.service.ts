import ContactModel, { ContactStatusEnum } from '../models/contact.model.js';
import type { IContact } from '../models/contact.model.js';

/**
 * Servicio para contactos
 */
export class ContactService {
  /**
   * Crea un nuevo contacto
   */
  async create(data: any): Promise<IContact> {
    const contact = await ContactModel.create({
      ...data,
      status: ContactStatusEnum.PENDING,
      isRead: false,
    });

    return contact;
  }

  /**
   * Obtiene todos los contactos con paginación
   */
  async getAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      ContactModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactModel.countDocuments(),
    ]);

    return {
      data: contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene un contacto por ID
   */
  async getById(id: string): Promise<IContact | null> {
    return await ContactModel.findById(id);
  }

  /**
   * Marca un contacto como leído
   */
  async markAsRead(id: string): Promise<IContact | null> {
    const contact = await ContactModel.findById(id);
    
    if (!contact) {
      return null;
    }

    contact.isRead = true;
    contact.readAt = new Date();
    await contact.save();

    return contact;
  }

  /**
   * Actualiza el estado de un contacto
   */
  async updateStatus(id: string, status: ContactStatusEnum): Promise<IContact | null> {
    const contact = await ContactModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    return contact;
  }

  /**
   * Elimina un contacto
   */
  async delete(id: string): Promise<boolean> {
    const result = await ContactModel.findByIdAndDelete(id);
    return result !== null;
  }
}

export default new ContactService();
