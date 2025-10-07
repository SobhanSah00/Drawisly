"use client"

import React, { useState, useEffect } from 'react';
import { Pencil, Users, MessageCircle, Mic, Zap, Shield, Sparkles, ArrowRight, Menu, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DrawislyLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = () => {
    router.push("/signup")
  }

  const features = [
    {
      icon: <Pencil className="w-8 h-8" />,
      title: "Infinite Canvas",
      description: "Draw with freedom using shapes, arrows, text, and freehand tools on an endless canvas"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-User Rooms",
      description: "Collaborate in real-time with your team in dedicated rooms with live cursors"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Built-in Chat",
      description: "Communicate seamlessly while drawing with integrated text chat functionality"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Calls",
      description: "Coming soon: Talk to your team directly within rooms for better collaboration",
      badge: "Coming Soon"
    }
  ];

  const useCases = [
    {
      title: "Design Teams",
      desc: "Brainstorm and iterate on designs together in real-time"
    },
    {
      title: "Remote Workshops",
      desc: "Facilitate engaging workshops with visual collaboration"
    },
    {
      title: "Education",
      desc: "Teach complex concepts with interactive diagrams"
    },
    {
      title: "Project Planning",
      desc: "Map out projects and workflows with your team"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center transform rotate-12">
                <Pencil className="w-6 h-6 text-white -rotate-12" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Drawisly
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 transition-colors">How It Works</a>
              <button onClick={handleNavigate} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all">
                Get Started
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-orange-600">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-orange-600">How It Works</a>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Draw With Your Team</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Draw, Chat,
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Collaborate</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                The ultimate collaborative whiteboard for teams. Create stunning diagrams, brainstorm ideas, and communicate in real-time with your team.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                  <button onClick={handleNavigate}>Start Drawing Free</button>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-orange-500 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Free forever</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border-4 border-orange-100">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">3 users collaborating</span>
                  </div>

                  <div className="aspect-video bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 w-20 h-20 border-4 border-orange-500 rounded-lg transform rotate-12"></div>
                    <div className="absolute top-10 right-8 w-16 h-16 bg-orange-500 rounded-full"></div>
                    <div className="absolute bottom-6 left-1/3 w-32 h-1 bg-orange-600"></div>
                    <Pencil className="w-16 h-16 text-orange-500 animate-bounce" />
                  </div>

                  <div className="flex space-x-2">
                    <div className="flex-1 h-2 bg-orange-200 rounded-full"></div>
                    <div className="flex-1 h-2 bg-orange-300 rounded-full"></div>
                    <div className="flex-1 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Collaborate</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern teams working remotely
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-orange-50/30"
              >
                {feature.badge && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {feature.badge}
                  </div>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple Yet Powerful
            </h2>
            <p className="text-xl text-gray-600">Get started in seconds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create a Room", desc: "Start a new drawing room instantly" },
              { step: "02", title: "Invite Your Team", desc: "Share the room link with collaborators" },
              { step: "03", title: "Draw Together", desc: "Collaborate in real-time with chat and drawing" }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-bold text-orange-100 absolute -top-8 -left-4 -z-10">{item.step}</div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-orange-100 hover:shadow-2xl transition-all">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-orange-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Perfect For Every Team</h2>
            <p className="text-xl text-orange-100">From startups to enterprises</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-orange-100">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Drawing?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams already collaborating on Drawisly
          </p>
          <button className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2 mx-auto">
            <span>Get Started For Free</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2025 Drawisly. All rights reserved.</p>
      </footer>
    </div>
  );
}