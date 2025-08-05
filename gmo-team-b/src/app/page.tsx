import { Dashboard } from "../components/Dashboard";
import { mockRootProps } from "../data/dashboardMockData";

export default function Home() {
  return <Dashboard {...mockRootProps} />;
}