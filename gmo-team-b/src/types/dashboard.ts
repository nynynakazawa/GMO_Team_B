// Props types
export interface DashboardProps {
  currentStep: number;
  servers: ServerInfo[];
  billingInfo: BillingInfo;
  planInfo: PlanInfo;
}

export interface ServerInfo {
  id: string;
  name: string;
  ip: string;
  status: 'running' | 'stopped' | 'starting';
}

export interface BillingInfo {
  currentMonthUsage: string;
  period: string;
  paymentMethod: string;
  chargeBalance: string;
  couponBalance: string;
}

export interface PlanInfo {
  memory: string;
  originalPrice: string;
  discountedPrice: string;
  discount: string;
  cpu: string;
  storage: string;
}