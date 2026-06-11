export class TransactionPointsService {
  calculatePoints(quantityKg: number, pointsPerKg: number): number {
    return Math.max(0, Math.round(quantityKg * pointsPerKg));
  }
}
