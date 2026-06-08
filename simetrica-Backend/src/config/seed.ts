import User, { UserRole } from '../models/user.model.js';

export const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;

    if (!adminEmail || !adminPassword || !adminUsername) {
      console.warn('⚠️  Variables ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_USERNAME no definidas. No se creará admin por defecto.');
      return;
    }

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
