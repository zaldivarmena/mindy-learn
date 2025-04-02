import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Youtube, FileText, X, Loader } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { parsePdfContent } from '@/configs/AiModel'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  
function TopicInput({setTopic, setDifficultyLevel}) {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isValidYoutubeUrl, setIsValidYoutubeUrl] = useState(true);
  const [manualTopic, setManualTopic] = useState('');
  const fileInputRef = useRef(null);

  // Simplified file upload handler - just shows file name without processing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfName(file.name);
      
      // Just notify the user that PDF processing is disabled
      const message = `PDF "${file.name}" selected. PDF processing is currently disabled.\n\nPlease enter your topic manually.`;
      alert(message);
      
      // No actual PDF processing is done
    } else {
      alert('Please upload a PDF file');
    }
  };
  
  // Handle YouTube URL input
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    
    // Basic validation for YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    setIsValidYoutubeUrl(url === '' || youtubeRegex.test(url));
    
    // Update the topic with the YouTube URL
    if (url && youtubeRegex.test(url)) {
      setTopic(`Reference YouTube video: ${url}\n\n${manualTopic}`);
    } else {
      setTopic(manualTopic);
    }
  };
  
  // Handle manual topic input
  const handleManualTopicChange = (e) => {
    const text = e.target.value;
    setManualTopic(text);
    
    // Update the full topic with both YouTube URL and manual input
    if (youtubeUrl && isValidYoutubeUrl) {
      setTopic(`Reference YouTube video: ${youtubeUrl}\n\n${text}`);
    } else {
      setTopic(text);
    }
  };
  
  // Clear PDF file
  const clearPdfFile = () => {
    setPdfFile(null);
    setPdfName('');
    setPdfContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Update topic without PDF content
    if (youtubeUrl && isValidYoutubeUrl) {
      setTopic(`Reference YouTube video: ${youtubeUrl}\n\n${manualTopic}`);
    } else {
      setTopic(manualTopic);
    }
  };
  return (
    <div className='mt-10 w-full flex flex-col'>
        <h2 className="text-lg font-medium mb-2">Enter topic or paste the content for which you want to generate study material</h2>
        <Textarea 
          placeholder='Start writing here' 
          className="mt-2 w-full" 
          value={manualTopic}
          onChange={handleManualTopicChange} 
        />

        <div className="mt-5">
          <h2 className="text-lg font-medium mb-2">Add references (Optional)</h2>
          <p className="text-sm text-muted-foreground mb-3">Add a PDF or YouTube video as a reference for your course content</p>
          
          {/* YouTube URL Input */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Youtube size={18} className="text-red-500" />
              <h3 className="font-medium">YouTube Video Reference</h3>
            </div>
            <Input
              type="url"
              placeholder="Paste YouTube video URL here"
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              className={!isValidYoutubeUrl ? "border-red-500" : ""}
            />
            {!isValidYoutubeUrl && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid YouTube URL</p>
            )}
          </div>
          
          {/* PDF Upload */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-blue-500" />
              <h3 className="font-medium">PDF Reference</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
                ref={fileInputRef}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('pdf-upload').click()}
                disabled={isProcessingPdf}
                className="flex-1"
              >
                {isProcessingPdf ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2" />
                    Upload PDF
                  </>
                )}
              </Button>
            </div>
            
            {pdfName && (
              <div className="mt-2 p-2 border rounded flex items-center justify-between bg-muted/50">
                <div className="flex items-center">
                  <FileText size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm truncate max-w-[250px]">{pdfName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearPdfFile} className="h-6 w-6 p-0">
                  <X size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>

        <h2 className='mt-5 mb-3 text-lg font-medium'>Select the difficulty Level</h2>
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
    </div>
  )
}

export default TopicInput