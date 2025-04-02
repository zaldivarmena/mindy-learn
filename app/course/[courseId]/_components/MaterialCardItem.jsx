import { Button } from '@/components/ui/button'
import axios from 'axios'
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';

function MaterialCardItem({item,studyTypeContent,course,refreshData}) {

  const [loading,setLoading]=useState(false);
  const GenerateContent=async()=>{

    toast(' Generating your content...')
    setLoading(true)
    // console.log(course)
    let chapters='';
    course?.courseLayout.chapters.forEach(chapter=>{
      chapters=(chapter.chapter_title||chapter.chapterTitle)+','+chapters
    });
    
    // Convert the display name to the API type name
    const typeMap = {
      'Mind Map': 'MindMap',
      'Flashcard': 'Flashcard',
      'Quiz': 'Quiz'
    };
    
    const apiType = typeMap[item.name] || item.name;
  
    const result=await axios.post('/api/study-type-content',{
      courseId:course?.courseId,
      type:apiType,
      chapters:chapters
    });

    setLoading(false);
    console.log(result);
    refreshData(true);
    toast('Your content is ready to view')
  }

  // Helper function to check if content is ready for a specific study type
  const isContentReady = () => {
    if (!studyTypeContent) return false;
    
    // For mindmap type, check if there's at least one item with content
    if (item.type === 'mindmap') {
      // Check if there's at least one mind map item with content
      // Note: The API uses 'MindMap' but our local type is 'mindmap'
      return studyTypeContent?.mindmap?.length > 0;
    }
    
    // For other types, just check if the array has items
    return studyTypeContent?.[item.type]?.length > 0;
  }

  return (
   
    <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center
      ${!isContentReady() && 'grayscale'}
    `}>
       {!isContentReady() ?
        <h2 className='p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2'>Generate</h2>
       : <h2 className='p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2'>Ready</h2>}
      
        <Image src={item.icon} alt={item.name} width={50} height={50}/>
        <h2 className='font-medium mt-3'>{item.name}</h2>
        <p className='text-gray-500 text-sm text-center'>{item.desc}</p>

        {!isContentReady() ?
        <Button className="mt-3 w-full" variant="outline" onClick={()=>GenerateContent()} >
          {loading && <RefreshCcw className='animate-spin' /> }
          Generate</Button>
        :
        <Link href={'/course/'+course?.courseId+item.path}>
          <Button className="mt-3 w-full" variant="outline">View</Button>
          </Link>}
    </div>

  )
}

export default MaterialCardItem