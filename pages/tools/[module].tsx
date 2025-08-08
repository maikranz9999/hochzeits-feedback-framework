import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ModuleLoader } from '../../lib/moduleLoader';
import { FeedbackAnalyzer } from '../../components/FeedbackAnalyzer';
import type { ModuleConfig } from '../../lib/types';

interface ModulePageProps {
  module: ModuleConfig | null;
}

export default function ModulePage({ module }: ModulePageProps) {
  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Modul nicht gefunden</h1>
          <p className="text-gray-600 mb-4">Das angeforderte Analyse-Modul existiert nicht.</p>
          <Link href="/" className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg transition-colors">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{module.title} | Hochzeits-Feedback-Framework</title>
        <meta name="description" content={module.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <Link href="/" className="bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2">
          ← Zurück zur Übersicht
        </Link>
      </div>

      {/* Module Content */}
      <FeedbackAnalyzer module={module} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const moduleId = params?.module as string;
  const module = ModuleLoader.getModule(moduleId);

  return {
    props: {
      module
    }
  };
};
