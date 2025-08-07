import { AuthenticationPage } from "../components/auth/AuthenticationPage";
import { Header } from "../components/easy/Header";
import { AuthGuard } from "../components/auth/AuthGuard";

export default function Home() {
  return (
    <AuthGuard requireAuth={false}>
      <div>
        <Header />
        <AuthenticationPage />
      </div>
    </AuthGuard>
  )
}