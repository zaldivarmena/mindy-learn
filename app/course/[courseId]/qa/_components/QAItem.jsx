"use client"
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

function QAItem({qa}) {
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

    return (
        <div className="border rounded-lg p-4 mb-4 bg-white">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="font-medium text-lg">{qa?.question}</h3>
                    {isAnswerVisible && (
                        <div className="mt-4 pl-4 border-l-2 border-primary">
                            <p className="text-gray-600">{qa?.answer}</p>
                        </div>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAnswerVisible(!isAnswerVisible)}
                >
                    {isAnswerVisible ? 'Hide Answer' : 'Show Answer'}
                </Button>
            </div>
        </div>
    )
}

export default QAItem
