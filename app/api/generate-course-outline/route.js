import { courseOutlineAIModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {

    const {courseId, topic, courseType, difficultyLevel, createdBy} = await req.json();
    
    // Check if the topic contains a YouTube URL reference
    let enhancedTopic = topic;
    let youtubeTranscript = "";
    
    // Extract YouTube URL if present
    const youtubeUrlMatch = topic.match(/Reference YouTube video: (https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s\n]+/);
    if (youtubeUrlMatch) {
        const youtubeUrl = youtubeUrlMatch[0].replace('Reference YouTube video: ', '');
        try {
            // Try to get video ID from the URL
            let videoId = '';
            if (youtubeUrl.includes('youtube.com/watch?v=')) {
                videoId = new URL(youtubeUrl).searchParams.get('v');
            } else if (youtubeUrl.includes('youtu.be/')) {
                videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
            }
            
            if (videoId) {
                // Get video details using YouTube API (if you have API key)
                // For this implementation, we'll just include the video ID in the prompt
                enhancedTopic = topic.replace(youtubeUrlMatch[0], 
                    `I'm using this YouTube video as reference: ${youtubeUrl} (Video ID: ${videoId})\n\n`);
            }
        } catch (error) {
            console.error('Error processing YouTube URL:', error);
        }
    }
    
    // Prepare the prompt with any reference materials
    const PROMPT = 'Generate a study material for ' + enhancedTopic + ' for ' + courseType + 
        ' and level of difficulty will be ' + difficultyLevel + 
        ' with summary of course, List of Chapters (Max 6) along with summary and Emoji icon for each chapter, ' + 
        'Topic list in each chapter, and all result in JSON format'
    // Generate Course Layout using AI
    const aiResp=await courseOutlineAIModel.sendMessage(PROMPT);
    const aiResult= JSON.parse(aiResp.response.text());

    // Save the result along with User Input
    const dbResult=await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId:courseId,
        courseType:courseType,
        createdBy:createdBy,
        topic:topic,
        courseLayout:aiResult
    }).returning({resp:STUDY_MATERIAL_TABLE})

    //Trigger the Inngest function to generate chapter notes

    inngest.send({
        name:'notes.generate',
        data:{
            course:dbResult[0].resp
        }
    });
    // console.log(result);
    
    return NextResponse.json({result:dbResult[0]})
    
}