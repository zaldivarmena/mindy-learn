"use client"
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
function Create() {
    const [step,setStep]=useState(0);
    const [formData,setFormData]=useState([]);
    const {user}=useUser();
    const [loading,setLoading]=useState(false);

    const router=useRouter();

    const handleUserInput=(fieldName,fieldValue)=>{

        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))

        console.log(formData);
    }

    /**
     * Used to Save User Input and Generate Course Layout using AI
     */
    const GenerateCourseOutline=async()=>{
      const courseId=uuidv4();
      setLoading(true);
      const result=await axios.post('/api/generate-course-outline',{
        courseId:courseId,
        ...formData,
        createdBy:user?.primaryEmailAddress?.emailAddress
      });
      setLoading(false);
      router.replace('/dashboard');
      //Toast Notification
      toast("Your course content is generating, Click on Refresh Button")
      console.log(result.data.result.resp);
    }

   

  return (
    <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
        <h2 className='font-bold text-4xl text-primary'>Start Building Your Personal Study Material</h2>
        <p className='text-gray-500 text-lg'>Fill All details in order to generate study material for your next project</p>

        <div className='mt-10'>
          {step==0?  <SelectOption selectedStudyType={(value)=>handleUserInput('courseType',value)}/>
          : <TopicInput 
          setTopic={(value)=>handleUserInput('topic',value)} 
          setDifficultyLevel={(value)=>handleUserInput('difficultyLevel',value)}
          /> }
        </div>

        <div className='flex justify-between w-full mt-32'>
           {step!=0? <Button variant="outline" onClick={()=>setStep(step-1)}>Previous</Button>:'-'}
            {step==0?<Button onClick={()=>setStep(step+1)}>Next</Button>:
            <Button onClick={GenerateCourseOutline} disabled={loading} >
              {loading?<Loader className=' animate-spin' />:'Generate' }</Button>}
        </div>
    </div>
  )
}

export default Create