'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ExternalLink, X, Sparkles, Code, Briefcase } from 'lucide-react';

export default function CreatorPortfolioWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-20 z-50">
      {/* Widget compact */}
      {!isExpanded && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div 
            onClick={() => setIsExpanded(true)}
            className="flex items-center space-x-2 px-4 py-3 group-hover:px-5 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden group-hover:block transition-all duration-300">
              Portfolio du créateur
            </span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      )}

      {/* Widget étendu */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Portfolio Créateur</h3>
                <p className="text-xs text-gray-500">Diddy - Développeur</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Masquer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-4">
            {/* Description courte */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-purple-700">DiddyHome</span> - Plateforme révolutionnaire 
                combinant assurance, FinTech et réseaux sociaux. Une création unique et innovante ! 
              </p>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">50+</div>
                <div className="text-xs text-blue-600">Composants</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">15K+</div>
                <div className="text-xs text-green-600">Lignes Code</div>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-2">
                <div className="text-lg font-bold text-purple-600">100%</div>
                <div className="text-xs text-purple-600">TypeScript</div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Technologies utilisées
              </h4>
              <div className="flex flex-wrap gap-1">
                {['Next.js 15', 'TypeScript', 'Tailwind', 'React', 'FinTech'].map((tech) => (
                  <span 
                    key={tech}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Link
                href="/portfolio"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Voir Portfolio</span>
              </Link>
              
              <a
                href="mailto:contact@diddyhome.com"
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Contact</span>
              </a>
            </div>

            {/* Signature discrète */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Créé avec ❤️ par <span className="font-medium text-purple-600">Diddy</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
