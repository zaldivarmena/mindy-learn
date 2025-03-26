import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  
function TopicInput({setTopic,setDifficultyLevel}) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      // Handle PDF file
      const reader = new FileReader();
      reader.onload = (e) => {
        // You can process the PDF content here
        console.log('PDF loaded:', file.name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a PDF file');
    }
  };
  return (
    <div className='mt-10 w-full flex flex-col'>
        <h2>Enter topic or paste the content for which you want to generate study material</h2>
        <Textarea placeholder='Start writing here' 
        className="mt-2 w-full" onChange={(event)=>setTopic(event.target.value)} />

        <h2 className='mt-5 mb-3'>Select the difficulty Level</h2>
        <Select onValueChange={(value)=>setDifficultyLevel(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty Level" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
            </Select>
            
            <div className="mt-5">
              <h2 className="mb-3">Add PDF References (Optional)</h2>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('pdf-upload').click()}
                >
                  <Upload className="mr-2" />
                  Upload PDF
                </Button>
              </div>
            </div>
    </div>
  )
}

export default TopicInput