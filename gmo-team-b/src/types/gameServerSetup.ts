import { GameType, PlanType } from '../data/enums';

// Props types (data passed to components)
export interface GameServerSetupProps {
  currentStep: number;
  selectedGame: string | null;
  selectedPeriod: string | null;
  selectedPlan: string | null;
  serverName: string;
  password: string;
  games: Game[];
  plans: Plan[];
  periodOptions: PeriodOption[];
  onGameSelect: (gameId: string) => void;
  onPeriodSelect: (period: string) => void;
  onPlanSelect: (planId: string) => void;
  onServerNameChange: (name: string) => void;
  onPasswordChange: (password: string) => void;
  onCreateServer: () => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  featured?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  capacity: string;
  monthlyPrice: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  cpuCores: string;
  storageCapacity: string;
  cpu: string;
  ssd: string;
  image?: string;
  featured?: boolean;
}

export interface PeriodOption {
  value: string;
  label: string;
}

// Root component props for the game server setup interface
export interface GameServerSetupRootProps {
  currentStep: number;
  selectedGame: string | null;
  selectedPeriod: string | null;
  selectedPlan: string | null;
  serverName: string;
  games: Game[];
  plans: Plan[];
  periodOptions: PeriodOption[];
}