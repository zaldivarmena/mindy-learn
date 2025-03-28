"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StepProgress from '../_components/StepProgress';
import QuizCardItem from './_components/QuizCardItem';
import EndScreen from '../_components/EndScreen';

function Quiz() {
    const {courseId}=useParams();
    const [quizData,setQuizData]=useState();
    const [stepCount,setStepCount]=useState(0);
    const [isCorrectAns,setIsCorrectAnswer]=useState(null);
    const [quiz,setQuiz]=useState([]);
    const [correctAns,setCorrectAns]=useState();
    useEffect(()=>{
        GetQuiz()
    },[courseId])

    const GetQuiz=async()=>{
        console.log(courseId)
        const result=await axios.post('/api/study-type',{
            courseId:courseId,
            studyType:'Quiz'
        });

        setQuizData(result.data);
        setQuiz(result.data?.content?.questions)
    }

    const checkAnswer=(userAnswer,currentQuestion)=>{

        console.log(currentQuestion?.answer,userAnswer);
        if(userAnswer==currentQuestion?.answer)
        {
            setScore(score+1);
            setIsCorrectAnswer(true);
            setCorrectAns(currentQuestion?.answer)
            return ;
        }
        setIsCorrectAnswer(false);
    }

    useEffect(()=>{
        setCorrectAns(null);
        setIsCorrectAnswer(null);
    },[stepCount])

    const repeatQuiz=()=>{
        setStepCount(0);
        setIsFinished(false);
        setScore(0);
        setUserAnswers({});
    }

    useEffect(()=>{
        setIsFinished(stepCount==quiz.length)
    },[stepCount,quiz])


    const nextQuestion=()=>{
        setStepCount(stepCount+1);
    }


    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});

    
  return (
    <div>
        <h2 className='font-bold text-2xl text-center mb-4'>Quiz</h2>

        <StepProgress data={quiz} stepCount={stepCount} setStepCount={(value)=>setStepCount(value)} />

        <div>
            {/* {quiz&&quiz.map((item,index)=>( */}
                <QuizCardItem quiz={quiz[stepCount]}
                userSelectedOption={(v)=>checkAnswer(v,quiz[stepCount])}
                userAnswer={userAnswers[quiz[stepCount]?.id]}
                blocked={isCorrectAns !== null}
                />
            {/* ))} */}
        </div>
                {isCorrectAns === false && (
                    <div className='border p-3 border-red-700 bg-red-200 rounded-lg'>
                        <h2 className='font-bold text-lg text-red-600'>Incorrect</h2>
                        <p className='text-red-600'>Correct Answer is : {quiz[stepCount]?.answer}</p>
                    </div>
                )}
                
                {isCorrectAns === true && (
                    <div className='border p-3 border-green-700 bg-green-200 rounded-lg'>
                        <h2 className='font-bold text-lg text-green-600'>Correct</h2>
                        <p className='text-green-600'>Your answer is Correct</p>
                    </div>
                )}

                {isFinished&& <div>
            <div className='text-center'>
                <h2 className='font-bold text-2xl'>Quiz Finished</h2>
                <p className='text-lg'>Your Score is : {score}/{quiz.length}</p>
                <button onClick={repeatQuiz} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Repeat Quiz</button>
            </div>
        </div>}
   
        <EndScreen data={quiz} stepCount={stepCount} />

    </div>
  )
}

export default Quiz;
