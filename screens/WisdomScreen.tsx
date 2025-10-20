import React, { useState } from 'react';
import { getAIWisdom, getAIReflectionPrompt } from '../services/geminiService';
import type { UserData, JournalEntry } from '../types';

interface WisdomScreenProps {
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => void;
}

const renderMarkdown = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    let html = '';
    lines.forEach(line => {
        if (line.startsWith('> ')) {
            html += `<blockquote class="text-xl italic border-l-4 border-slate-300 pl-4 my-4 text-slate-700">${line.substring(2)}</blockquote>`;
        } else if (line.startsWith('**Reflection:**')) {
            html += `<div class="mt-6"><h3 class="font-bold text-slate-800">Reflection</h3><p class="text-slate-600 mt-1">${line.substring('**Reflection:**'.length).trim()}</p></div>`;
        } else if (line.startsWith('**Actionable Step:**')) {
            html += `<div class="mt-6"><h3 class="font-bold text-slate-800">Actionable Step</h3><p class="text-slate-600 mt-1">${line.substring('**Actionable Step:**'.length).trim()}</p></div>`;
        } else {
             html += `<p class="text-slate-700">${line}</p>`;
        }
    });
    return { __html: html };
};

const StreamCard: React.FC<{ title: string; description: string; onClick: () => void; }> = ({ title, description, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-300 text-left"
    >
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
);


const WisdomScreen: React.FC<WisdomScreenProps> = ({ userData, updateUserData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeWisdom, setActiveWisdom] = useState<string | null>(null);
    const [selectedStream, setSelectedStream] = useState<string | null>(null);
    const [isSilent, setIsSilent] = useState(false);
    
    const [quoteViewCount, setQuoteViewCount] = useState(0);
    const [viewedWisdoms, setViewedWisdoms] = useState<string[]>([]);
    const [showReflection, setShowReflection] = useState(false);
    const [reflectionQuestion, setReflectionQuestion] = useState('');
    const [userResponse, setUserResponse] = useState('');
    const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

    const streams = [
        { title: "Mind Discipline", description: "Strengthen your focus and self-control." },
        { title: "Courage & Purpose", description: "Find your why and act with bravery." },
        { title: "Peace & Patience", description: "Cultivate calm in a chaotic world." },
        { title: "Motivation Surge", description: "Get a boost of energy and inspiration." },
    ];

    const triggerReflection = async (wisdoms: string[]) => {
        setShowReflection(true);
        setIsGeneratingQuestion(true);
        const question = await getAIReflectionPrompt(wisdoms);
        setReflectionQuestion(question);
        setIsGeneratingQuestion(false);
        setQuoteViewCount(0);
        setViewedWisdoms([]);
    };

    const handleStreamSelect = async (streamTitle: string) => {
        setIsLoading(true);
        setActiveWisdom(null);
        setSelectedStream(streamTitle);
        try {
            const result = await getAIWisdom(streamTitle);
            setActiveWisdom(result);
            
            const newCount = quoteViewCount + 1;
            const newWisdoms = [...viewedWisdoms, result];
            setQuoteViewCount(newCount);
            setViewedWisdoms(newWisdoms);

            if (newCount >= 3) {
                triggerReflection(newWisdoms);
            }

        } catch (err) {
            setActiveWisdom("There was an error finding wisdom. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveReflection = () => {
        if (!userResponse.trim()) return;
        const newEntry: JournalEntry = {
            date: new Date().toISOString(),
            question: reflectionQuestion,
            response: userResponse,
            context: viewedWisdoms
        };
        updateUserData({ journal: [...userData.journal, newEntry] });
        setShowReflection(false);
        setUserResponse('');
        setReflectionQuestion('');
    };
    
    const handleSkipReflection = () => {
        setShowReflection(false);
        setUserResponse('');
        setReflectionQuestion('');
    };

    if (isSilent) {
        return (
            <div
                onClick={() => setIsSilent(false)}
                className="fixed inset-0 bg-stone-100 z-50 flex flex-col items-center justify-center text-center p-4 cursor-pointer animate-fade-in"
            >
                <h2 className="text-2xl text-slate-700">Take a deep breath.</h2>
                <p className="text-slate-500 mt-2">You are here.</p>
            </div>
        );
    }
    
    if (showReflection) {
        return (
             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">A Moment to Reflect</h2>
                    {isGeneratingQuestion ? (
                         <div className="flex items-center justify-center h-24 space-x-2">
                            <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></div>
                        </div>
                    ) : (
                       <>
                            <p className="text-slate-700 mb-4">{reflectionQuestion}</p>
                            <textarea
                                value={userResponse}
                                onChange={(e) => setUserResponse(e.target.value)}
                                placeholder="Your thoughts..."
                                rows={4}
                                className="w-full bg-slate-100 text-slate-800 placeholder-slate-400 rounded-lg p-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                       </>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={handleSkipReflection} className="bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition duration-300 hover:bg-slate-300">Skip</button>
                        <button onClick={handleSaveReflection} disabled={isGeneratingQuestion || !userResponse.trim()} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-300">Save</button>
                    </div>
                </div>
            </div>
        )
    }

    if (selectedStream) {
        return (
            <div className="flex flex-col h-[calc(100vh-11rem)] animate-fade-in">
                <button onClick={() => setSelectedStream(null)} className="text-slate-500 hover:text-slate-800 self-start mb-4 text-sm font-semibold">
                    &larr; Back to Streams
                </button>
                <div className="flex-grow flex items-center justify-center">
                    {isLoading && (
                         <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce"></div>
                        </div>
                    )}
                    {activeWisdom && (
                         <div className="w-full max-w-lg">
                            <div key={activeWisdom} className="text-left p-6 bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in-fast w-full">
                                <div dangerouslySetInnerHTML={renderMarkdown(activeWisdom)} />
                            </div>
                            <button onClick={() => handleStreamSelect(selectedStream)} className="text-sm bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors mt-6 w-full">
                                More wisdom on "{selectedStream}"
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start h-[calc(100vh-11rem)] animate-fade-in text-center px-2">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 sr-only">Wisdom Mode</h1>
            <p className="text-slate-600 mb-6">Choose a stream for reflection and guidance.</p>
            
            <div className="w-full max-w-md space-y-4">
                {streams.map(stream => (
                    <StreamCard key={stream.title} {...stream} onClick={() => handleStreamSelect(stream.title)} />
                ))}
            </div>

            <div className="mt-8 border-t border-slate-200 w-full max-w-md pt-6">
                 <button 
                    onClick={() => setIsSilent(true)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-lg transition duration-300"
                >
                   Moment of Silence
                </button>
            </div>
        </div>
    );
};

export default WisdomScreen;