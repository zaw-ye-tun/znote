import { Link } from 'react-router-dom';
import { StickyNote, CheckSquare, Lightbulb, Zap, Cloud, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';

/**
 * Home Page
 * 
 * Landing page for Znote.
 * Features:
 * - Hero section with CTA
 * - Feature highlights
 * - Quick start guide
 */

export function HomePage() {
  const features = [
    {
      icon: StickyNote,
      title: 'Smart Notes',
      description: 'Capture ideas instantly with color-coded, pinnable notes'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Stay organized with priority-based tasks and due dates'
    },
    {
      icon: Lightbulb,
      title: 'Idea Vault',
      description: 'Store and categorize your brilliant ideas with tags'
    },
    {
      icon: Zap,
      title: 'Instant Start',
      description: 'No signup required - start using immediately'
    },
    {
      icon: Cloud,
      title: 'Auto Sync',
      description: 'Create an account anytime to sync across devices'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is encrypted and safely stored'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-4xl">Z</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-primary-600 dark:text-primary-400">Znote</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your AI-powered workspace for notes, tasks, and ideas. Start organizing immediately—no account required.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/notes">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Login / Sign Up
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            ✨ No credit card required • Use instantly as guest
          </p>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Everything you need to stay organized
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How it works
        </h2>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start as Guest
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Begin using Znote immediately. No signup required. All your data is stored locally on your device.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Create & Organize
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add notes, manage tasks, and capture ideas. Customize with colors, tags, and priorities.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Save Online (Optional)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                When ready, create an account. All your guest data will automatically sync to your account.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-primary-600 dark:bg-primary-700 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get organized?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of users who trust Znote for their daily organization
          </p>
          <Link to="/notes">
            <Button size="lg" variant="secondary" className="px-8">
              Start Now - It's Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
