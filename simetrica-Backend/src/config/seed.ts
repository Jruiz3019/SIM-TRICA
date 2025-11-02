import User, { UserRole } from '../models/user.model.js';

export const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@simetrica.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: UserRole.ADMIN,
      });
      console.log(`✅ Usuario ADMIN creado: ${adminEmail}`);
    } else {
      console.log('ℹ️  Usuario ADMIN ya existe');
    }
  } catch (error) {
    console.error('❌ Error al crear usuario ADMIN:', error);
  }
};
