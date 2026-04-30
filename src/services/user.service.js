import { User } from '../models/User.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Servicio de usuarios
 * Maneja operaciones CRUD de usuarios
 */
class UserService {
  /**
   * Obtener todos los usuarios con paginación
   */
  async getAll(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = {};

    // Filtros opcionales
    if (filters.rol) {
      query.rol = filters.rol;
    }
    if (filters.activo !== undefined) {
      query.activo = filters.activo;
    }
    if (filters.search) {
      query.$or = [
        { nombre: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener usuario por ID
   */
  async getById(id) {
    const user = await User.findById(id).select('-password');

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Crear nuevo usuario
   */
  async create(userData) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    const user = await User.create(userData);

    return user.toJSON();
  }

  /**
   * Actualizar usuario
   */
  async update(id, updateData) {
    // No permitir actualizar password directamente aquí
    delete updateData.password;

    // Verificar si el email ya existe (si se está actualizando)
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new ConflictError('El email ya está en uso');
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Desactivar usuario (soft delete)
   */
  async deactivate(id) {
    const user = await User.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Activar usuario
   */
  async activate(id) {
    const user = await User.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Toggle status del usuario (activar/desactivar)
   */
  async toggleStatus(id) {
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    user.activo = !user.activo;
    await user.save();

    return user.toJSON();
  }

  /**
   * Eliminar usuario permanentemente
   */
  async delete(id) {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return { message: 'Usuario eliminado exitosamente' };
  }

  /**
   * Obtener usuarios por rol
   */
  async getByRole(rol) {
    const users = await User.find({ rol, activo: true }).select('-password');
    return users;
  }
}

export default new UserService();
