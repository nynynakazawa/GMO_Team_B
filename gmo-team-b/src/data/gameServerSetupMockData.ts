import { GameType, PlanType } from "./enums";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DiamondIcon from "@mui/icons-material/Diamond";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import GroupIcon from "@mui/icons-material/Group";
import CastleIcon from "@mui/icons-material/Castle";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import BuildIcon from "@mui/icons-material/Build";
import ExtensionIcon from "@mui/icons-material/Extension";
import DescriptionIcon from "@mui/icons-material/Description";
import BugReportIcon from "@mui/icons-material/BugReport";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import PetsIcon from "@mui/icons-material/Pets";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import FactoryIcon from "@mui/icons-material/Factory";
import FaceIcon from "@mui/icons-material/Face";
import SportsIcon from "@mui/icons-material/Sports";
import TerrainIcon from "@mui/icons-material/Terrain";
import PersonIcon from "@mui/icons-material/Person";
import LandscapeIcon from "@mui/icons-material/Landscape";

// Data passed as props to the root component
export const mockRootProps = {
  currentStep: 1 as const,
  selectedGame: null,
  selectedPeriod: null,
  selectedPlan: null,
  serverName: "",
  games: [
    {
      id: GameType.SEVEN_DAYS_TO_DIE,
      name: "7 Days to Die",
      icon: LocalHospitalIcon, // ゾンビ・サバイバル系
      featured: true,
    },
    {
      id: GameType.ARK_SURVIVAL_EVOLVED,
      name: "ARK: Survival Evolved",
      icon: PetsIcon, // 恐竜・猛獣系
      featured: true,
    },
    {
      id: GameType.ARMA3,
      name: "Arma3",
      icon: LocalPoliceIcon, // ミリタリー・戦術系
    },
    {
      id: GameType.ASSETTO_CORSA,
      name: "AssettoCorsa",
      icon: DirectionsCarIcon, // レーシング系
    },
    {
      id: GameType.CORE_KEEPER,
      name: "Core Keeper",
      icon: DiamondIcon, // 採掘・クラフト系
      featured: true,
    },
    {
      id: GameType.CS2,
      name: "CS2",
      icon: GpsFixedIcon, // FPS・シューティング系
      featured: true,
    },
    {
      id: GameType.DAYZ,
      name: "DayZ",
      icon: MyLocationIcon, // 銃・照準系（最も銃に近い形状）
    },
    {
      id: GameType.DONT_STARVE_TOGETHER,
      name: "Don't Starve Together",
      icon: GroupIcon, // 協力サバイバル系
    },
    {
      id: GameType.ENSHROUDED,
      name: "Enshrouded",
      icon: CastleIcon, // ファンタジー・建築系
      featured: true,
    },
    {
      id: GameType.FACTORIO,
      name: "Factorio",
      icon: PrecisionManufacturingIcon, // 工場・自動化系
      featured: true,
    },
    {
      id: GameType.FIVEM,
      name: "FiveM",
      icon: DriveEtaIcon, // GTA・車系
    },
    {
      id: GameType.MINECRAFT_BEDROCK,
      name: "Minecraft 統合版",
      icon: ViewInArIcon, // ブロック・建築系
      featured: true,
    },
    {
      id: GameType.MINECRAFT_JAVA,
      name: "Minecraft Java版",
      icon: ViewInArIcon, // ブロック・建築系
      featured: true,
    },
    {
      id: GameType.MINECRAFT_FORGE,
      name: "Minecraft Forge",
      icon: ExtensionIcon, // MOD・拡張系
    },
    {
      id: GameType.MINECRAFT_PAPER,
      name: "Minecraft Paper",
      icon: DescriptionIcon, // サーバー・パフォーマンス系
    },
    {
      id: GameType.MINECRAFT_SPIGOT,
      name: "Minecraft Spigot",
      icon: BuildIcon, // プラグイン・カスタマイズ系
    },
    {
      id: GameType.PALWORLD,
      name: "Palworld",
      icon: CatchingPokemonIcon, // クリーチャー・ポケモン系
      featured: true,
    },
    {
      id: GameType.PROJECT_ZOMBOID,
      name: "Project Zomboid",
      icon: BugReportIcon, // ゾンビ・サバイバル系
    },
    {
      id: GameType.RUST,
      name: "Rust",
      icon: HomeRepairServiceIcon, // サバイバル・クラフト系
      featured: true,
    },
    {
      id: GameType.SATISFACTORY,
      name: "Satisfactory",
      icon: FactoryIcon, // 工場・建設系
    },
    {
      id: GameType.SOULMASK,
      name: "Soulmask",
      icon: FaceIcon, // マスク・アクション系
    },
    {
      id: GameType.TEAM_FORTRESS_2,
      name: "Team Fortress 2",
      icon: SportsIcon, // チーム・対戦系
    },
    {
      id: GameType.TERRARIA,
      name: "Terraria",
      icon: TerrainIcon, // 2D・探索系
    },
    {
      id: GameType.UNTURNED,
      name: "Unturned",
      icon: PersonIcon, // サバイバル・ゾンビ系
    },
    {
      id: GameType.VALHEIM,
      name: "Valheim",
      icon: LandscapeIcon, // バイキング・北欧系
      featured: true,
    },
  ],
  plans: [
    {
      id: PlanType.PLAN_1GB,
      name: "1GB",
      capacity: "1GB",
      monthlyPrice: 979,
      originalPrice: 1958,
      discountedPrice: 979,
      discount: 50,
      cpuCores: "2Core",
      storageCapacity: "50GB",
      cpu: "2Core",
      ssd: "50GB",
      featured: false,
    },
    {
      id: PlanType.PLAN_2GB,
      name: "2GB",
      capacity: "2GB",
      monthlyPrice: 1379,
      originalPrice: 2758,
      discountedPrice: 1379,
      discount: 50,
      cpuCores: "3Core",
      storageCapacity: "80GB",
      cpu: "3Core",
      ssd: "80GB",
      featured: false,
    },
    {
      id: PlanType.PLAN_4GB,
      name: "4GB",
      capacity: "4GB",
      monthlyPrice: 1379,
      originalPrice: 3968,
      discountedPrice: 1379,
      discount: 65,
      cpuCores: "4Core",
      storageCapacity: "100GB",
      cpu: "4Core",
      ssd: "100GB",
      featured: true,
    },
    {
      id: PlanType.PLAN_8GB,
      name: "8GB",
      capacity: "8GB",
      monthlyPrice: 2758,
      originalPrice: 5516,
      discountedPrice: 2758,
      discount: 50,
      cpuCores: "6Core",
      storageCapacity: "200GB",
      cpu: "6Core",
      ssd: "200GB",
      featured: false,
    },
    {
      id: PlanType.PLAN_16GB,
      name: "16GB",
      capacity: "16GB",
      monthlyPrice: 5516,
      originalPrice: 11032,
      discountedPrice: 5516,
      discount: 50,
      cpuCores: "8Core",
      storageCapacity: "400GB",
      cpu: "8Core",
      ssd: "400GB",
      featured: false,
    },
  ],
  periodOptions: [
    { value: "1month", label: "1ヶ月" },
    { value: "3months", label: "3ヶ月" },
    { value: "6months", label: "6ヶ月" },
    { value: "12months", label: "12ヶ月" },
  ],
};
