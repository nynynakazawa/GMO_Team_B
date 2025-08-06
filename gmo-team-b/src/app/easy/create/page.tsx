"use client";

import React, { useState, useEffect } from "react";
import { GameServerSetup } from "../../../components/GameServerSetup";
import { mockRootProps } from "../../../data/gameServerSetupMockData";
import { Plan } from "../../../types/gameServerSetup";

export default function EasyCreatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [serverName, setServerName] = useState("");
  const [password, setPassword] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setCurrentStep(2);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setCurrentStep(3);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep(4);
  };

  const handleServerNameChange = (name: string) => {
    setServerName(name);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  const handleCreateServer = async () => {
    if (!selectedGame || !selectedPeriod || !selectedPlan || !serverName || !password) {
      setError('すべての項目を入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("VPSサーバー作成開始:", {
        game: selectedGame,
        period: selectedPeriod,
        plan: selectedPlan,
        serverName,
        timestamp: new Date().toISOString()
      });

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
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'サーバー作成に失敗しました');
      }

      console.log("VPSサーバー作成成功:", result);
      
      // 成功時の処理
      alert(`${serverName} の作成を開始しました！\nサーバーID: ${result.serverId}\n管理者パスワード: ${result.adminPass}`);
      
      // 必要に応じてサーバー情報ページにリダイレクト
      // window.location.href = `/easy/serverinfo?serverId=${result.serverId}`;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'サーバー作成中にエラーが発生しました';
      setError(errorMessage);
      console.error('VPSサーバー作成エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // ローディング中はモックデータを使用
  const currentPlans = loading ? mockRootProps.plans : plans;

      return (
      <GameServerSetup
        currentStep={currentStep}
        selectedGame={selectedGame}
        selectedPeriod={selectedPeriod}
        selectedPlan={selectedPlan}
        serverName={serverName}
        password={password}
        games={mockRootProps.games}
        plans={currentPlans}
        periodOptions={mockRootProps.periodOptions}
        onGameSelect={handleGameSelect}
        onPeriodSelect={handlePeriodSelect}
        onPlanSelect={handlePlanSelect}
        onServerNameChange={handleServerNameChange}
        onPasswordChange={handlePasswordChange}
        onCreateServer={handleCreateServer}
        loading={loading}
        error={error}
      />
    );
}
