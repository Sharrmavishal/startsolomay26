import React, { useState, useEffect } from 'react';
import { useContent } from './ContentProvider';

// This component would be used in the admin interface for editing pages
const PageEditor: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real implementation, this would fetch pages from your CMS API
    const fetchPages = async () => {
      try {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
          setPages([
            { id: 1, title: 'About Us', slug: 'about', lastModified: '2025-05-10' },
            { id: 2, title: 'Privacy Policy', slug: 'privacy', lastModified: '2025-05-05' },
            { id: 3, title: 'Terms of Service', slug: 'terms', lastModified: '2025-05-05' },
            { id: 4, title: 'Contact', slug: 'contact', lastModified: '2025-05-12' },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load pages. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPages();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Pages</h2>
        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition">
          Create New Page
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Modified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-6 py-4 whitespace-nowrap">{page.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{page.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap">{page.lastModified}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-primary hover:text-primary-dark mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageEditor;