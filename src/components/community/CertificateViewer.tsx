import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, AlertCircle, Calendar, Download, Loader2 } from 'lucide-react';
import { supabase, auth } from '../../lib/supabase';

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_url: string | null;
  issued_at: string;
  course: {
    id: string;
    title: string;
    mentor: {
      display_name: string;
      full_name: string;
    };
  };
  student: {
    display_name: string;
    full_name: string;
    email: string;
  };
  template: {
    template_html: string;
    template_name: string;
  } | null;
}

const CertificateViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCertificate();
    }
  }, [id]);

  const loadCertificate = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('course_certificates')
        .select(`
          id,
          certificate_number,
          certificate_url,
          issued_at,
          mentor_courses!course_id (
            id,
            title,
            community_members!mentor_id (
              display_name,
              full_name
            )
          ),
          community_members!student_id (
            display_name,
            full_name,
            email
          ),
          certificate_templates (
            template_html,
            template_name
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Check if user owns this certificate
      const { data: { user } } = await auth.getUser();
      if (!user) {
        setError('Please log in to view certificates');
        setLoading(false);
        return;
      }

      const { data: member } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!member || (data as any).community_members.id !== member.id) {
        setError('You do not have permission to view this certificate');
        setLoading(false);
        return;
      }

      // Format certificate data
      const formattedCertificate: Certificate = {
        id: data.id,
        certificate_number: data.certificate_number,
        certificate_url: data.certificate_url,
        issued_at: data.issued_at,
        course: {
          id: (data.mentor_courses as any).id,
          title: (data.mentor_courses as any).title,
          mentor: {
            display_name: (data.mentor_courses as any).community_members.display_name,
            full_name: (data.mentor_courses as any).community_members.full_name,
          },
        },
        student: {
          display_name: (data.community_members as any).display_name,
          full_name: (data.community_members as any).full_name,
          email: (data.community_members as any).email,
        },
        template: (data.certificate_templates as any)?.[0] || null,
      };

      setCertificate(formattedCertificate);
    } catch (err: any) {
      console.error('Error loading certificate:', err);
      setError(err.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const renderCertificateHTML = () => {
    if (!certificate) return '';

    const template = certificate.template?.template_html || `
      <div style="text-align: center; padding: 40px; font-family: Arial, sans-serif;">
        <h1 style="font-size: 48px; margin-bottom: 20px;">Certificate of Completion</h1>
        <p style="font-size: 24px; margin: 40px 0;">This certifies that</p>
        <h2 style="font-size: 32px; margin: 20px 0; color: #1D3A6B;">{{student_name}}</h2>
        <p style="font-size: 20px; margin: 40px 0;">has successfully completed</p>
        <h3 style="font-size: 28px; margin: 20px 0; color: #1D3A6B;">{{course_title}}</h3>
        <p style="font-size: 16px; margin-top: 60px;">Issued on {{issue_date}}</p>
        <p style="font-size: 14px; margin-top: 40px; color: #666;">Certificate Number: {{certificate_number}}</p>
      </div>
    `;

    const issueDate = new Date(certificate.issued_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return template
      .replace(/\{\{student_name\}\}/g, certificate.student.display_name || certificate.student.full_name)
      .replace(/\{\{course_title\}\}/g, certificate.course.title)
      .replace(/\{\{issue_date\}\}/g, issueDate)
      .replace(/\{\{certificate_number\}\}/g, certificate.certificate_number);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!certificate || !certificate.certificate_url) {
      alert('PDF certificate is not available yet. Please generate it first.');
      return;
    }
    window.open(certificate.certificate_url, '_blank');
  };

  const generatePDF = async () => {
    if (!certificate || !id) return;

    try {
      setGeneratingPDF(true);
      
      // Get Supabase URL and anon key from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration not found');
      }

      // Call Edge Function
      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-certificate-pdf`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ certificateId: id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificate_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Reload certificate to get updated certificate_url
      await loadCertificate();
      
      alert('PDF generated successfully!');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(error.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3A6B]"></div>
          <p className="mt-4 text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/community')}
            className="bg-[#1D3A6B] text-white px-6 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1D3A6B]">Certificate of Completion</h1>
              <p className="text-gray-600 mt-1">Certificate Number: {certificate?.certificate_number}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                Print
              </button>
              {certificate?.certificate_url ? (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-[#1D3A6B] text-white px-4 py-2 rounded-lg hover:bg-[#152A4F] transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              ) : (
                <button
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => navigate('/community')}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-12 print:p-8">
          <div
            className="certificate-content"
            dangerouslySetInnerHTML={{ __html: renderCertificateHTML() }}
          />
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .certificate-content,
            .certificate-content * {
              visibility: visible;
            }
            .certificate-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CertificateViewer;

