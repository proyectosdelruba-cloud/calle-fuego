// Reglas del programa de fidelización "Fire Coins" 🔥
// Cambia estas dos constantes si algún día quieres ajustar el ratio.

export const COINS_PER_EURO_EARNED = 10; // se ganan 10 Fire Coins por cada 1€ del pedido
export const COINS_PER_EURO_REDEEMED = 100; // 100 Fire Coins = 1€ de descuento al canjear

export function eurosToCoinsEarned(euros: number): number {
  return Math.max(0, Math.floor(euros * COINS_PER_EURO_EARNED));
}

export function coinsToDiscount(coins: number): number {
  return Math.max(0, coins) / COINS_PER_EURO_REDEEMED;
}

// Máximo de Fire Coins que se pueden canjear en un pedido de "totalEuros",
// limitado por el saldo del usuario y por el propio importe del pedido
// (no se puede canjear más de lo que cuesta el pedido).
export function maxRedeemableCoins(totalEuros: number, balance: number): number {
  const capByOrder = Math.floor(totalEuros * COINS_PER_EURO_REDEEMED);
  return Math.max(0, Math.min(balance, capByOrder));
}

export function formatCoins(amount: number): string {
  return new Intl.NumberFormat("es-ES").format(amount);
}