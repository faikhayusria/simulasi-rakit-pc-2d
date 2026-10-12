import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/features/home/HomePage';
import { ScenarioPage } from '@/features/scenario/ScenarioPage';
import { BuilderPage } from '@/features/builder/BuilderPage';
import { ResultsPage } from '@/features/results/ResultsPage';
import { AboutPage } from '@/features/about/AboutPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/scenarios" element={<ScenarioPage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
