import { useState } from 'react';
import {
  Database,
  Calendar,
  BarChart3,
  PlusCircle,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import Logo from './Logo';

const NAV_ITEMS = [
  { id: 'baza', label: 'Baza', icon: Database, description: 'Volonterska baza' },
  { id: 'termini', label: 'Termini', icon: Calendar, description: 'Povijest termina' },
  { id: 'statistika', label: 'Statistika', icon: BarChart3, description: 'Analitika' },
  { id: 'unos', label: 'Unos', icon: PlusCircle, description: 'Novi termin' },
];

export default function Layout({ children, activeTab, onTabChange, heroStats }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-surface-200 z-50
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`
            flex items-center gap-3 p-4 border-b border-surface-100
            ${sidebarCollapsed ? 'lg:justify-center' : ''}
          `}>
            <Logo size={sidebarCollapsed ? 40 : 44} />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="font-display font-bold text-lg text-brand-purple truncate">
                  Zlatni Zmaj
                </h1>
                <p className="text-xs text-surface-500 truncate">Volonteri</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 -mr-2 lg:hidden hover:bg-surface-100 rounded-lg"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full nav-item
                    ${isActive ? 'nav-item-active' : ''}
                    ${sidebarCollapsed ? 'lg:justify-center lg:px-3' : ''}
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'text-surface-400'}`} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Collapse Toggle - Desktop Only */}
          <div className="hidden lg:block p-3 border-t border-surface-100">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`
                w-full flex items-center justify-center gap-2 px-3 py-2
                rounded-lg text-surface-500 hover:bg-surface-100
                hover:text-surface-700 transition-colors
              `}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              {!sidebarCollapsed && <span className="text-sm">Smanji</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
      `}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-surface-100">
          <div className="flex items-center gap-4 px-4 py-3 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 lg:hidden hover:bg-surface-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-surface-700" />
            </button>

            <div className="flex-1 min-w-0">
              <h2 className="font-display font-semibold text-lg text-surface-900">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-surface-500 hidden sm:block">
                {NAV_ITEMS.find(i => i.id === activeTab)?.description}
              </p>
            </div>

            {/* Hero Stats Bar */}
            {heroStats && (
              <div className="hidden md:flex items-center gap-4">
                {heroStats.map((stat, index) => (
                  <div key={index} className="text-right">
                    <p className="text-xs text-surface-500">{stat.label}</p>
                    <p className="font-display font-bold text-brand-purple">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
