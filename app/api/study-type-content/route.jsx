import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {chapters,courseId,type}=await req.json();

    let PROMPT;
    
    // Determine the prompt based on the content type
    if (type === 'Flashcard') {
        PROMPT = 'Generate the flashcard on topic : ' + chapters + ' in JSON format with front back content, Maximum 15';
    } else if (type === 'MindMap') {
        PROMPT = `Generate a mind map for the topic: ${chapters}. The mind map should be in JSON format with the following structure: 
        {
          "nodes": [
            {
              "id": 1,
              "label": "Main Topic",
              "description": "Brief description of the main topic",
              "isRoot": true
            },
            {
              "id": 2,
              "label": "Subtopic 1",
              "description": "Description of subtopic 1",
              "isRoot": false
            },
            {
              "id": 3,
              "label": "Subtopic 2",
              "description": "Description of subtopic 2",
              "isRoot": false
            }
          ],
          "connections": [
            {
              "source": 1,
              "target": 2,
              "label": "Relation description"
            },
            {
              "source": 1,
              "target": 3,
              "label": "Relation description"
            }
          ]
        }
        Make sure to include at least 6-8 nodes with meaningful connections between concepts. All IDs must be numbers, and each node must have a unique ID. The root node should have isRoot set to true, and all connections must reference valid node IDs.`;
    } else {
        // Default to quiz generation
        PROMPT = 'Generate Quiz on topic : ' + chapters + ' with Question and Options along with correct answer in JSON format, (Max 10)';
    }

    //Insert Record to DB , Update status to Generating...
    const result = await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
        courseId: courseId,
        type: type
    }).returning({id: STUDY_TYPE_CONTENT_TABLE.id});

    //Trigger Inngest Function
    const result_ = await inngest.send({
        name: 'studyType.content',
        data: {
           studyType: type, 
           prompt: PROMPT,
           courseId: courseId,
           recordId: result[0].id 
        }
    });

    return NextResponse.json(result[0].id);
}