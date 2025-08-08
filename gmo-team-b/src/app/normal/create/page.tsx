"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameServerSetup } from "../../../components/easy/create/GameServerSetup";
import { ServerCreationProgress } from "../../../components/easy/create/ServerCreationProgress";
import { AuthGuard } from "../../../components/auth/AuthGuard";
import { mockRootProps } from "../../../data/gameServerSetupMockData";
import { Plan } from "../../../types/gameServerSetup";

export default function NormalCreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [serverName, setServerName] = useState("");
  const [password, setPassword] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 進捗管理用の状態
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  
  // バリデーションエラー用の状態
  const [validationErrors, setValidationErrors] = useState<{
    game: boolean;
    period: boolean;
    plan: boolean;
    serverName: boolean;
    password: boolean;
  }>({
    game: false,
    period: false,
    plan: false,
    serverName: false,
    password: false,
  });

  // APIからプランを取得
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/vps/plans');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'プランの取得に失敗しました');
        }
        
        const data = await response.json();
        
        console.log("APIレスポンス:", data);
        
        // APIレスポンスをフロントエンドの型に変換
        const convertedPlans: Plan[] = data.plans.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          capacity: plan.capacity,
          monthlyPrice: plan.monthlyPrice,
          originalPrice: plan.monthlyPrice,
          discountedPrice: plan.monthlyPrice,
          discount: 0,
          cpuCores: `${plan.vcpus}Core`,
          storageCapacity: `${plan.disk}GB`,
          cpu: plan.cpu,
          ssd: plan.ssd,
        }));
        
        setPlans(convertedPlans);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
        setError(errorMessage);
        console.error('プラン取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    
    // バリデーションエラーをクリア
    setValidationErrors(prev => ({ ...prev, game: false }));
    
    // 選択したゲーム名をサーバー名に自動設定
    const selectedGameData = mockRootProps.games.find(g => g.id === gameId);
    
    if (selectedGameData) {
      // ゲームデータから名前を取得し、空白を除去してハイフンに置き換え
      const gameName = selectedGameData.name.replace(/\s+/g, '-');
      setServerName(`${gameName}-Server`);
    } else {
      // カスタムゲーム（gameIdが直接ゲーム名）の場合、空白を除去してハイフンに置き換え
      const cleanGameId = gameId.replace(/\s+/g, '-');
      setServerName(`${cleanGameId}-Server`);
    }
    
    setCurrentStep(2);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    // バリデーションエラーをクリア
    setValidationErrors(prev => ({ ...prev, period: false }));
    setCurrentStep(3);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // バリデーションエラーをクリア
    setValidationErrors(prev => ({ ...prev, plan: false }));
    setCurrentStep(4);
  };

  const handleServerNameChange = (name: string) => {
    setServerName(name);
    // バリデーションエラーをクリア
    setValidationErrors(prev => ({ ...prev, serverName: false }));
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
    // バリデーションエラーをクリア
    setValidationErrors(prev => ({ ...prev, password: false }));
  };

  // バリデーション関数
  const validateForm = () => {
    const errors = {
      game: !selectedGame,
      period: !selectedPeriod,
      plan: !selectedPlan,
      serverName: !serverName.trim(),
      password: !password.trim(),
    };
    
    setValidationErrors(errors);
    
    // エラーがある場合はfalseを返す
    return !Object.values(errors).some(error => error);
  };

  const handleCreateServer = async () => {
    // バリデーションを実行
    if (!validateForm()) {
      return; // バリデーションエラーがある場合は処理を中断
    }

    // パスワード要件チェック
    const passwordRequirements = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasValidLength: password.length >= 8 && password.length <= 70
    };

    const missingRequirements = [];
    if (!passwordRequirements.hasLowercase) missingRequirements.push('小文字');
    if (!passwordRequirements.hasUppercase) missingRequirements.push('大文字');
    if (!passwordRequirements.hasNumber) missingRequirements.push('数字');
    if (!passwordRequirements.hasSymbol) missingRequirements.push('記号');
    if (!passwordRequirements.hasValidLength) missingRequirements.push('8-70文字');

    if (missingRequirements.length > 0) {
      const message = `パスワードが要件を満たしていません。\n\n必要な要素:\n• 大文字 (A-Z)\n• 小文字 (a-z)\n• 数字 (0-9)\n• 記号 (!@#$%^&*など)\n• 8-70文字\n\n不足している要素: ${missingRequirements.join(', ')}`;
      alert(message);
      return;
    }

    setLoading(true);
    setError(null);
    
    // 進捗表示を開始
    console.log('進捗表示を開始');
    setShowProgress(true);
    setProgress(0);
    setCurrentStatus('initializing');
    setIsCompleted(false);
    setIsError(false);
    setProgressError(null);

    try {
      // 進捗更新: 初期化完了
      setTimeout(() => {
        setProgress(10);
        setCurrentStatus('authenticating');
      }, 500);
      
      // 選択されたプランの詳細情報を取得
      const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
      
      console.log("VPSサーバー作成開始:", {
        game: selectedGame,
        period: selectedPeriod,
        plan: selectedPlan,
        planData: selectedPlanData,
        serverName,
        timestamp: new Date().toISOString()
      });

      // プラン情報から RAM、CPU、SSD を抽出
      let ramGB = 1; // デフォルト
      let cpuCores = 2; // デフォルト
      let ssdSize = 100; // デフォルト

      if (selectedPlanData) {
        // capacity から RAM を抽出 (例: "1GB RAM" → 1)
        const ramMatch = selectedPlanData.capacity.match(/(\d+)GB/);
        if (ramMatch) {
          ramGB = parseInt(ramMatch[1]);
        }

        // cpuCores から CPU数を抽出 (例: "2Core" → 2)
        const cpuMatch = selectedPlanData.cpuCores.match(/(\d+)Core/);
        if (cpuMatch) {
          cpuCores = parseInt(cpuMatch[1]);
        }

        // storageCapacity から SSD容量を抽出 (例: "100GB" → 100)
        const ssdMatch = selectedPlanData.storageCapacity.match(/(\d+)GB/);
        if (ssdMatch) {
          ssdSize = parseInt(ssdMatch[1]);
        }
      }

      console.log("抽出されたプラン仕様:", { ramGB, cpuCores, ssdSize });

      // 進捗更新: サーバー作成開始
      setTimeout(() => {
        setProgress(30);
        setCurrentStatus('creating_server');
      }, 1000);

      const response = await fetch('/api/vps/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan,
          serverName,
          password,
          game: selectedGame,
          period: selectedPeriod,
          ramGB,
          cpuCores,
          ssdSize,
        }),
      });

      // 進捗更新: サーバー作成処理中
      setProgress(70);
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'サーバー作成に失敗しました');
      }

      console.log("VPSサーバー作成成功:", result);
      
      // 進捗更新: 完了
      setProgress(100);
      setCurrentStatus('completed');
      setIsCompleted(true);
      
      // 成功時の処理: 3秒後にサーバー情報ページに自動遷移
      setTimeout(() => {
        router.push('/normal/serverinfo');
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'サーバー作成中にエラーが発生しました';
      
      // 進捗表示でエラーを表示
      setIsError(true);
      setCurrentStatus('error');
      setProgressError(errorMessage);
      
      setError(errorMessage);
      console.error('VPSサーバー作成エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // 期間選択オプションに時間課金を追加
  const customPeriodOptions = [
    ...mockRootProps.periodOptions,
    { value: "hourly", label: "時間課金" }
  ];
  
  // 時間課金選択時の価格を計算
  const getHourlyPricing = (planName: string) => {
    const hourlyRates: { [key: string]: number } = {
      "1GB": 1.9,
      "2GB": 3.7,
      "4GB": 7.3,
      "8GB": 14.6,
      "16GB": 26.7
    };
    
    // プラン名から容量部分を抽出（例: "1GB RAM / 2Core" → "1GB"）
    const capacityMatch = planName.match(/(\d+GB)/);
    if (capacityMatch) {
      const capacity = capacityMatch[1];
      console.log(`プラン名 "${planName}" から抽出された容量: "${capacity}"`);
      return hourlyRates[capacity] || 0;
    }
    
    console.log(`プラン名 "${planName}" から容量を抽出できませんでした`);
    return 0;
  };
  
  // プランの価格を期間に応じて調整
  const getAdjustedPlans = () => {
    const basePlans = loading ? mockRootProps.plans : plans;
    
    console.log("選択された期間:", selectedPeriod);
    console.log("ベースプラン:", basePlans);
    
    if (selectedPeriod === "hourly") {
      return basePlans.map(plan => {
        const hourlyRate = getHourlyPricing(plan.name);
        console.log(`プラン ${plan.name} の時間課金価格: ${hourlyRate} 円/時間`);
        return {
          ...plan,
          monthlyPrice: hourlyRate,
          originalPrice: hourlyRate,
          discountedPrice: hourlyRate,
          discount: 0
        };
      });
    }
    
    return basePlans;
  };
  
  const currentPlans = getAdjustedPlans();

      return (
      <AuthGuard>
        <>
          <GameServerSetup
            currentStep={currentStep}
            selectedGame={selectedGame}
            selectedPeriod={selectedPeriod}
            selectedPlan={selectedPlan}
            serverName={serverName}
            password={password}
            games={mockRootProps.games}
            plans={currentPlans}
            periodOptions={customPeriodOptions}
            onGameSelect={handleGameSelect}
            onPeriodSelect={handlePeriodSelect}
            onPlanSelect={handlePlanSelect}
            onServerNameChange={handleServerNameChange}
            onPasswordChange={handlePasswordChange}
            onCreateServer={handleCreateServer}
            loading={loading}
            error={error}
            validationErrors={validationErrors}
          />
          
          <ServerCreationProgress
            isVisible={showProgress}
            progress={progress}
            currentStatus={currentStatus}
            isCompleted={isCompleted}
            isError={isError}
            errorMessage={progressError || undefined}
          />
        </>
      </AuthGuard>
    );
}
