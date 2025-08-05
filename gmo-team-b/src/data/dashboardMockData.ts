// Mock data for dashboard interface
export const mockRootProps = {
  currentStep: 1,
  servers: [
    {
      id: "1",
      name: "[VPS] game-2025-08-04-13-54-1",
      ip: "133.117.75.97",
      status: "running" as const
    },
    {
      id: "2", 
      name: "[VPS] game-2025-08-04-13-54-2",
      ip: "133.117.75.98",
      status: "running" as const
    },
    {
      id: "3",
      name: "[VPS] game-2025-08-04-13-54-3", 
      ip: "133.117.75.99",
      status: "running" as const
    },
    {
      id: "4",
      name: "[VPS] game-2025-08-04-13-54-4",
      ip: "133.117.75.100", 
      status: "running" as const
    }
  ],
  billingInfo: {
    currentMonthUsage: "0円",
    period: "2025 8/1~8/31",
    paymentMethod: "クレジットカード",
    chargeBalance: "0円",
    couponBalance: "0円"
  },
  planInfo: {
    memory: "4GB",
    originalPrice: "3,968 円/月",
    discountedPrice: "1,379 円/月", 
    discount: "65%OFF",
    cpu: "CPU 4Core",
    storage: "SSD 100GB"
  }
};