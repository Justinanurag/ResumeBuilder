import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets';
import ResumePreview from '../components/ResumePreview';
import { ArrowLeftIcon, DownloadIcon, Loader } from 'lucide-react';
import api from '../configs/api';

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) return;
      
      setIsLoading(true);
      try {
        const { data } = await api.get('/api/resumes/public/' + resumeId)
        if (data.resume) {
          setResumeData(data.resume)
        } else {
          setResumeData(null)
        }
      } catch (error) {
        console.log('Error loading resume:', error)
        setResumeData(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadResume()
  }, [resumeId])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin' size={48} />
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-center text-6xl text-slate-400'> Resume not found</p>
        <Link to="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset ring-1 ring-green-400 flex items-center transition-colors'>
          <ArrowLeftIcon className='mr-4 size-4' />
          go to home page
        </Link>
      </div>
    )
  }

  return (
    <div className='bg-slate-100 min-h-screen'>
      <div className='max-w-3xl mx-auto py-10'>
        <div className='flex justify-end mb-4 px-2'>
          <Link
            to={`/download/${resumeId}?auto=1`}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg shadow-sm transition-all'
          >
            <DownloadIcon className='w-4 h-4' />
            Download PDF
          </Link>
        </div>
        <ResumePreview 
          data={resumeData} 
          template={resumeData.template} 
          accentColor={resumeData.accent_color || resumeData.accentColor || '#3B82F6'} 
          fontStyle={resumeData.font_style || 'roboto'}
          classes='py-4 bg-white' 
        />
      </div>
    </div>
  )
}

export default Preview