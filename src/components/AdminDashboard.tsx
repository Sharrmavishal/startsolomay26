import React, { useState } from 'react';
import { BookOpen, Settings, FileText, Users, BarChart, Layout, Edit, Image, Menu, X } from 'lucide-react';
import PageEditor from './PageEditor';

// This component would be the main admin dashboard interface
const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('pages');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const renderContent = () => {
    switch (activeSection) {
      case 'pages':
        return <PageEditor />;
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
            <p className="text-gray-600">
              This section would contain the editor for {activeSection}.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-md shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`bg-rich text-white w-64 flex-shrink-0 fixed lg:static h-full z-10 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-rich-light">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary-light" />
            <span className="font-bold text-xl">Start Solo CMS</span>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'dashboard' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('dashboard')}
              >
                <BarChart size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'pages' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('pages')}
              >
                <FileText size={20} />
                <span>Pages</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'sections' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('sections')}
              >
                <Layout size={20} />
                <span>Sections</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'blog' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('blog')}
              >
                <Edit size={20} />
                <span>Blog</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'media' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('media')}
              >
                <Image size={20} />
                <span>Media</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'users' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('users')}
              >
                <Users size={20} />
                <span>Users</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition ${
                  activeSection === 'settings' ? 'bg-rich-light text-white' : 'text-gray-300 hover:bg-rich-light/50'
                }`}
                onClick={() => setActiveSection('settings')}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 lg:ml-0 mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          
          {renderContent()}
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;