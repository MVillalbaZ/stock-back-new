require('dotenv').config();
const bcryptjs = require('bcryptjs');
const { dbConnection } = require('../database/config');
const Usuario = require('../models/usuario');
const Role = require('../models/role');

const seed = async () => {
  try {
    await dbConnection();

    const roles = ['ADMIN_ROLE', 'USER_ROLE'];
    for (const role of roles) {
      const existeRole = await Role.findOne({ role });
      if (!existeRole) {
        await Role.create({ role });
        console.log(`Rol ${role} creado`);
      }
    }

    const adminEmail = 'admin@admin.com';
    const existeAdmin = await Usuario.findOne({ email: adminEmail });
    
    if (!existeAdmin) {
      const salt = bcryptjs.genSaltSync();
      const password = bcryptjs.hashSync('admin123', salt);
      
      await Usuario.create({
        name: 'Administrador',
        email: adminEmail,
        password,
        role: 'ADMIN_ROLE',
        state: true
      });
      
      console.log('Usuario admin creado exitosamente');
      console.log('Email: admin@admin.com');
      console.log('Password: admin123');
    } else {
      console.log('El usuario admin ya existe');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  }
};

seed();
