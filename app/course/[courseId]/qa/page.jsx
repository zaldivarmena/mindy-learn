"use client"
import React, { useEffect, useState } from 'react'
import QAItem from './_components/QAItem'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function QAPage() {
    const { courseId } = useParams();
    const [qaList, setQAList] = useState([]);

    useEffect(() => {
        getQAList();
    }, [])

    const getQAList = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: 'QA'
        });
        setQAList(result?.data?.content || []);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className='font-bold text-2xl'>Questions & Answers</h2>
                    <p className="text-gray-500">Practice with comprehensive Q&A sets!</p>
                </div>
                <Link href={`/course/${courseId}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Course
                    </Button>
                </Link>
            </div>

            <div className="mt-8 space-y-4">
                {qaList.map((qa, index) => (
                    <QAItem key={index} qa={qa} />
                ))}
            </div>

            {qaList.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No Q&A content available for this course yet.</p>
                </div>
            )}
        </div>
    )
}

export default QAPage
