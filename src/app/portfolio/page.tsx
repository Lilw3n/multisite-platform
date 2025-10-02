'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  Award, 
  Code, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  TrendingUp,
  Shield,
  Gamepad2,
  Home,
  Car,
  Heart,
  Zap,
  Globe,
  Camera,
  Users,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  Download
} from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
  color: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
  icon: React.ReactNode;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  status: string;
  link?: string;
  icon: React.ReactNode;
}

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills: Skill[] = [
    { name: 'Courtage Assurance', level: 95, icon: <Shield className="w-5 h-5" />, color: 'bg-blue-500' },
    { name: 'Négociation Immobilier', level: 90, icon: <Home className="w-5 h-5" />, color: 'bg-green-500' },
    { name: 'Finance & E-commerce', level: 85, icon: <TrendingUp className="w-5 h-5" />, color: 'bg-purple-500' },
    { name: 'Community Management', level: 92, icon: <Users className="w-5 h-5" />, color: 'bg-pink-500' },
    { name: 'Streaming & Création', level: 88, icon: <Camera className="w-5 h-5" />, color: 'bg-red-500' },
    { name: 'Développement Web', level: 80, icon: <Code className="w-5 h-5" />, color: 'bg-indigo-500' },
    { name: 'Gaming & Anime', level: 95, icon: <Gamepad2 className="w-5 h-5" />, color: 'bg-orange-500' },
    { name: 'Sport & Bien-être', level: 85, icon: <Heart className="w-5 h-5" />, color: 'bg-cyan-500' }
  ];

  const experiences: Experience[] = [
    {
      title: 'Courtier en Assurance Principal',
      company: 'DiddyHome Insurance',
      period: '2020 - Présent',
      description: 'Spécialisation VTC/Taxi, développement de solutions innovantes pour professionnels et particuliers. Création d\'une plateforme multisite révolutionnaire.',
      skills: ['Assurance Auto', 'Assurance Habitation', 'Assurance Santé', 'Prévoyance', 'Vie'],
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Négociateur Immobilier',
      company: 'Secteur Immobilier',
      period: '2018 - 2020',
      description: 'Négociation et conseil en transactions immobilières, développement de relations clients durables.',
      skills: ['Négociation', 'Conseil Client', 'Évaluation', 'Juridique'],
      icon: <Home className="w-6 h-6" />
    },
    {
      title: 'Expert Finance & E-commerce',
      company: 'Projets Divers',
      period: '2016 - Présent',
      description: 'Consultation financière, développement e-commerce, optimisation des revenus et stratégies digitales.',
      skills: ['Finance', 'E-commerce', 'Stratégie', 'Optimisation'],
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Community Manager & Streamer',
      company: 'Gaming & Anime Community',
      period: '2015 - Présent',
      description: 'Animation de communautés gaming et anime, streaming, création de contenu engageant.',
      skills: ['Streaming', 'Animation', 'Création Contenu', 'Engagement'],
      icon: <Camera className="w-6 h-6" />
    }
  ];

  const projects: Project[] = [
    {
      name: 'DiddyHome - Plateforme Multisite',
      description: 'Plateforme révolutionnaire combinant CRM assurance, réseau social, FinTech P2P, et IA avancée.',
      technologies: ['Next.js 15', 'TypeScript', 'IA', 'FinTech', 'Mobile-First'],
      status: 'En Production',
      link: '/external/social/hub',
      icon: <Globe className="w-6 h-6" />
    },
    {
      name: 'Système Prêts P2P',
      description: 'Solution complète de prêts entre particuliers avec conformité légale et gestion des risques.',
      technologies: ['FinTech', 'Conformité RGPD', 'Calculs TEG', 'Gestion Risques'],
      status: 'Innovant',
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: 'Mutualisme Solidaire',
      description: 'Système d\'entraide communautaire gamifié inspiré de TikTok avec impact social réel.',
      technologies: ['Social Impact', 'Gamification', 'Anti-Discrimination', 'Solidarité'],
      status: 'Révolutionnaire',
      icon: <Heart className="w-6 h-6" />
    },
    {
      name: 'IA Assistants Assurance',
      description: 'Assistants intelligents pour devis et contrats avec analyse prédictive et recommandations.',
      technologies: ['IA', 'Machine Learning', 'Analyse Prédictive', 'UX Intelligente'],
      status: 'Avancé',
      icon: <Star className="w-6 h-6" />
    }
  ];

  const achievements = [
    { title: 'Plateforme FinTech Révolutionnaire', description: 'Création d\'un écosystème complet P2P + Social + IA' },
    { title: 'Innovation Assurance VTC/Taxi', description: 'Solutions spécialisées pour professionnels du transport' },
    { title: 'Community Building Expert', description: 'Animation de communautés gaming et anime engagées' },
    { title: 'Développement Full-Stack', description: 'Maîtrise Next.js, TypeScript, et architectures modernes' },
    { title: 'Conformité Légale FinTech', description: 'Respect RGPD, taux d\'usure, protection consommateur' },
    { title: 'Mobile-First Innovation', description: 'Design responsive et expérience utilisateur optimale' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-white font-bold text-xl">Diddy Portfolio</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['about', 'skills', 'experience', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`capitalize transition-colors ${
                    activeSection === section 
                      ? 'text-purple-400 border-b-2 border-purple-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            <Link 
              href="/external/social/hub"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
            >
              <span>Voir DiddyHome</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Wendy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">"Diddy"</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Courtier Assurance • Innovateur FinTech • Community Manager • Développeur Full-Stack
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">15 Rue Pierre Curie, 54110 Varangéville</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">06 95 82 08 66</span>
              </div>
            </div>

            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.linkedin.com/in/wendy-b-47ab49106/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="mailto:contact@diddyhome.fr"
                className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
              <Link 
                href="/external/social/hub"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full transition-all"
              >
                <MessageCircle className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* About Section */}
        {activeSection === 'about' && (
          <section className="animate-fadeIn">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <User className="w-8 h-8 mr-3 text-purple-400" />
                À Propos
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Passionné par l'innovation et l'excellence, je combine expertise en assurance, 
                    développement technologique et community management pour créer des solutions révolutionnaires.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Spécialisé dans l'assurance VTC/Taxi, j'ai développé DiddyHome, une plateforme 
                    multisite intégrant FinTech P2P, IA avancée et réseaux sociaux.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Ma polyvalence s'étend de la négociation immobilière au gaming, 
                    en passant par le streaming et la création de communautés engagées.
                  </p>
                </div>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <section className="animate-fadeIn">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Star className="w-8 h-8 mr-3 text-purple-400" />
                Compétences
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${skill.color}`}>
                          {skill.icon}
                        </div>
                        <span className="text-white font-semibold">{skill.name}</span>
                      </div>
                      <span className="text-purple-400 font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${skill.color} transition-all duration-1000`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <section className="animate-fadeIn">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Briefcase className="w-8 h-8 mr-3 text-purple-400" />
                Expérience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 border-l-4 border-purple-400">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-500 p-3 rounded-lg flex-shrink-0">
                        {exp.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                          <span className="text-purple-400 font-semibold">{exp.period}</span>
                        </div>
                        <p className="text-gray-400 mb-2">{exp.company}</p>
                        <p className="text-gray-300 mb-4">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <section className="animate-fadeIn">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Code className="w-8 h-8 mr-3 text-purple-400" />
                Projets Innovants
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg flex-shrink-0">
                        {project.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">{project.name}</h3>
                          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.link && (
                          <Link 
                            href={project.link}
                            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <span>Voir le projet</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section className="animate-fadeIn">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Mail className="w-8 h-8 mr-3 text-purple-400" />
                Contact
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Restons en Contact</h3>
                  <p className="text-gray-300 mb-6">
                    Intéressé par mes projets ou souhaitez collaborer ? 
                    N'hésitez pas à me contacter !
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">contact@diddyhome.fr</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">06 95 82 08 66</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">15 Rue Pierre Curie, 54110 Varangéville</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-purple-400" />
                      <a 
                        href="https://www.linkedin.com/in/wendy-b-47ab49106/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Découvrir DiddyHome</h3>
                  <p className="text-gray-300 mb-4">
                    Explorez ma plateforme révolutionnaire qui combine assurance, 
                    FinTech et réseaux sociaux.
                  </p>
                  <div className="space-y-3">
                    <Link 
                      href="/external/social/hub"
                      className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-center"
                    >
                      Hub Social DiddyHome
                    </Link>
                    <Link 
                      href="/assurance"
                      className="block bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors text-center"
                    >
                      Solutions Assurance
                    </Link>
                    <Link 
                      href="/blog"
                      className="block bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors text-center"
                    >
                      Blog & Actualités
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/20 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around py-2">
          {[
            { key: 'about', icon: User },
            { key: 'skills', icon: Star },
            { key: 'experience', icon: Briefcase },
            { key: 'projects', icon: Code },
            { key: 'contact', icon: Mail }
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`p-3 rounded-lg transition-colors ${
                activeSection === key 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
