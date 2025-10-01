import { InsurancePeriod, Vehicle, Driver, Claim } from '@/types';
import { 
  mockInsurancePeriods, 
  mockVehicles, 
  mockDrivers, 
  mockClaims,
  getInsurancePeriodById,
  getVehicleById,
  getDriverById,
  getClaimById
} from './mockData';

export class InsuranceService {
  // Périodes d'assurance
  static async getAllInsurancePeriods(): Promise<InsurancePeriod[]> {
    return mockInsurancePeriods;
  }

  static async getInsurancePeriodById(id: string): Promise<InsurancePeriod | null> {
    return getInsurancePeriodById(id) || null;
  }

  static async getActiveInsurancePeriods(): Promise<InsurancePeriod[]> {
    return mockInsurancePeriods.filter(period => period.isActive && !period.isResigned);
  }

  static async getExpiringInsurancePeriods(days: number = 30): Promise<InsurancePeriod[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return mockInsurancePeriods.filter(period => 
      period.isActive && 
      !period.isResigned && 
      period.endDate <= futureDate
    );
  }

  // Véhicules
  static async getAllVehicles(): Promise<Vehicle[]> {
    return mockVehicles;
  }

  static async getVehicleById(id: string): Promise<Vehicle | null> {
    return getVehicleById(id) || null;
  }

  static async getVehiclesByInterlocutor(interlocutorId: string): Promise<Vehicle[]> {
    return mockVehicles.filter(vehicle => 
      vehicle.interlocutor === interlocutorId || 
      vehicle.interlocutor.includes(interlocutorId)
    );
  }

  static async getActiveVehicles(): Promise<Vehicle[]> {
    return mockVehicles.filter(vehicle => vehicle.status === 'active');
  }

  // Conducteurs
  static async getAllDrivers(): Promise<Driver[]> {
    return mockDrivers;
  }

  static async getDriverById(id: string): Promise<Driver | null> {
    return getDriverById(id) || null;
  }

  static async getDriversByInterlocutor(interlocutorId: string): Promise<Driver[]> {
    return mockDrivers.filter(driver => 
      driver.interlocutor === interlocutorId || 
      driver.interlocutor.includes(interlocutorId)
    );
  }

  static async getActiveDrivers(): Promise<Driver[]> {
    return mockDrivers.filter(driver => driver.status === 'active');
  }

  // Sinistres
  static async getAllClaims(): Promise<Claim[]> {
    return mockClaims;
  }

  static async getClaimById(id: string): Promise<Claim | null> {
    return getClaimById(id) || null;
  }

  static async getClaimsByStatus(status: 'pending' | 'in_progress' | 'closed'): Promise<Claim[]> {
    return mockClaims.filter(claim => claim.status === status);
  }

  static async getClaimsByInterlocutor(interlocutorId: string): Promise<Claim[]> {
    return mockClaims.filter(claim => 
      claim.interlocutor === interlocutorId || 
      claim.interlocutor.includes(interlocutorId)
    );
  }

  // Statistiques
  static async getInsuranceSummary(): Promise<{
    totalVehicles: number;
    activeVehicles: number;
    totalDrivers: number;
    activeDrivers: number;
    totalClaims: number;
    pendingClaims: number;
    totalValue: number;
    expiringContracts: number;
  }> {
    const totalVehicles = mockVehicles.length;
    const activeVehicles = mockVehicles.filter(v => v.status === 'active').length;
    const totalDrivers = mockDrivers.length;
    const activeDrivers = mockDrivers.filter(d => d.status === 'active').length;
    const totalClaims = mockClaims.length;
    const pendingClaims = mockClaims.filter(c => c.status === 'pending' || c.status === 'in_progress').length;
    const totalValue = mockVehicles.reduce((sum, v) => sum + v.value, 0);
    const expiringContracts = await this.getExpiringInsurancePeriods().then(periods => periods.length);

    return {
      totalVehicles,
      activeVehicles,
      totalDrivers,
      activeDrivers,
      totalClaims,
      pendingClaims,
      totalValue,
      expiringContracts
    };
  }
}
