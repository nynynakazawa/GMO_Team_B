// Game types enum for the game selection
export enum GameType {
  SEVEN_DAYS_TO_DIE = 'seven_days_to_die',
  ARK_SURVIVAL_EVOLVED = 'ark_survival_evolved',
  ARMA3 = 'arma3',
  ASSETTO_CORSA = 'assetto_corsa',
  CORE_KEEPER = 'core_keeper',
  CS2 = 'cs2',
  DAYZ = 'dayz',
  DONT_STARVE_TOGETHER = 'dont_starve_together',
  ENSHROUDED = 'enshrouded',
  FACTORIO = 'factorio',
  FIVEM = 'fivem',
  MINECRAFT_BEDROCK = 'minecraft_bedrock',
  MINECRAFT_JAVA = 'minecraft_java',
  MINECRAFT_FORGE = 'minecraft_forge',
  MINECRAFT_PAPER = 'minecraft_paper',
  MINECRAFT_SPIGOT = 'minecraft_spigot',
  PALWORLD = 'palworld',
  PROJECT_ZOMBOID = 'project_zomboid',
  RUST = 'rust',
  SATISFACTORY = 'satisfactory',
  SOULMASK = 'soulmask',
  TEAM_FORTRESS_2 = 'team_fortress_2',
  TERRARIA = 'terraria',
  UNTURNED = 'unturned',
  VALHEIM = 'valheim'
}

// Plan types for server plans
export enum PlanType {
  PLAN_1GB = 'plan_1gb',
  PLAN_2GB = 'plan_2gb',
  PLAN_4GB = 'plan_4gb',
  PLAN_8GB = 'plan_8gb',
  PLAN_16GB = 'plan_16gb'
}

// Step types for the progress stepper
export enum StepType {
  GAME_SELECTION = 1,
  PERIOD_SELECTION = 2,
  PLAN_SELECTION = 3,
  COMPLETION = 4
}