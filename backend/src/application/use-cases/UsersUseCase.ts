import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthService } from '../../domain/services/AuthService';
import { User } from '../../domain/entities/User';

export class UsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async register(fullName: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const existing = await this.userRepository.getByEmail(email.toLowerCase());
    if (existing) {
      throw new Error('El correo ya está registrado');
    }

    const passwordHash = await this.authService.hashPassword(password);
    const user = await this.userRepository.create({ fullName, email: email.toLowerCase(), passwordHash });
    const token = this.authService.signToken({ sub: user.id, email: user.email });

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.getByEmail(email.toLowerCase());
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await this.authService.comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.authService.signToken({ sub: user.id, email: user.email });
    return { user, token };
  }

  list(): Promise<User[]> {
    return this.userRepository.list();
  }

  getById(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  update(id: string, data: { fullName?: string; email?: string; password?: string }): Promise<User | null> {
    return this.updateInternal(id, data);
  }

  private async updateInternal(id: string, data: { fullName?: string; email?: string; password?: string }): Promise<User | null> {
    const updateData: { fullName?: string; email?: string; passwordHash?: string } = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase();
    if (data.password !== undefined) {
      updateData.passwordHash = await this.authService.hashPassword(data.password);
    }

    return this.userRepository.update(id, updateData);
  }

  softDelete(id: string): Promise<boolean> {
    return this.userRepository.softDelete(id);
  }
}
