"use client";

import React from 'react';
import { Dashboard } from '../../../components/Dashboard';
import { mockRootProps } from '../../../data/dashboardMockData'; // モックデータをインポート

const DashboardPage: React.FC = () => {
  return (
    <Dashboard {...mockRootProps} />
  );
};

export default DashboardPage;
