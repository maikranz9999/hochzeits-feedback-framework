import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ModuleLoader } from '../lib/moduleLoader';

export default function Dashboard() {
  const modules = ModuleLoader.getAvailableModules();

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      rose: 'from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700',
      blue: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      green: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
      purple: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
    };
    return colorMap[color] || colorMap.rose;
  };

  return (
    <>
      <Head>
        <title>Hochzeits-Feedback-Framework | Unternehmensberatung</title>
        <meta name="description" content="Professionelle Analyse-Tools für Hochzeitsdienstleister" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              💍 Hochzeits-Feedback-Framework
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Professionelle Analyse-Tools für Hochzeitsdienstleister
            </p>
            <div className="text-sm text-gray-500">
              Ihre digitale Unternehmensberatung für die Hochzeitsbranche
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {modules.map((module) => (
              <Link key={module.id} href={`/tools/${module.id}`} className="block">
                <div className="bg-white rounded-xl shadow-lg p-6 card-hover cursor-pointer">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{module.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {module.description}
                    </p>
                    <div className={`inline-block bg-gradient-to-r ${getColorClasses(module.color)} text-white py-2 px-4 rounded-lg font-medium text-sm transition-all`}>
                      Tool öffnen →
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Coming Soon Card */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">🔜</div>
                <h3 className="text-lg font-medium mb-2">Weitere Module</h3>
                <p className="text-sm">In Entwicklung...</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ⚡ Warum unser Framework?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-800 mb-2">Branchenspezifisch</h3>
                <p className="text-sm text-gray-600">
                  Speziell für Hochzeitsdienstleister entwickelt mit jahrelanger Branchenerfahrung.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-semibold text-gray-800 mb-2">Sofort einsetzbar</h3>
                <p className="text-sm text-gray-600">
                  Konkrete Verbesserungsvorschläge mit praktischen Beispielen und Umsetzungstipps.
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-800 mb-2">Stetig erweitert</h3>
                <p className="text-sm text-gray-600">
                  Neue Analyse-Module werden regelmäßig hinzugefügt basierend auf Kundenfeedback.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            Powered by KI-gestützte Analyse • Made for Hochzeitsdienstleister
          </div>
        </div>
      </div>
    </>
  );
}
