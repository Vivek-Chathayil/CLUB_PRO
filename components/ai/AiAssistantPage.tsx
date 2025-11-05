
import React, { useState }from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { api } from '../../services/api';

const AiAssistantPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        
        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            // Fetch relevant data to provide context to the AI
            // We select only key fields to keep the context concise
            const [users, payments, events, expenses] = await Promise.all([
                api.getAllUsers(),
                api.getAllPayments(),
                api.getUpcomingEvents(),
                api.getAllExpenses(),
            ]);

            const context = `
                Context: You are an AI assistant for a cricket club manager. The following is a summary of the club's current data.
                - Members Summary: There are ${users.length} members. Recently joined members are more important. Current date is ${new Date().toDateString()}.
                - Payments Summary: There are ${payments.length} total payment records. Key statuses are 'paid', 'pending', 'overdue'.
                - Events Summary: ${events.length} upcoming events.
                - Expenses Summary: ${expenses.length} expense records.

                Here is a sample of the data for context:
                - Recent Members: ${JSON.stringify(users.slice(0, 5).map(u => ({ name: u.name, status: u.status, joinDate: u.joinDate })))}
                - Recent Payments: ${JSON.stringify(payments.slice(0, 10).map(p => ({ userName: p.userName, type: p.type, amount: p.amount, status: p.status, date: p.date })))}
                - Upcoming Events: ${JSON.stringify(events.slice(0, 5).map(e => ({ title: e.title, date: e.date, type: e.type })))}
                - Recent Expenses: ${JSON.stringify(expenses.slice(0, 10).map(ex => ({ description: ex.description, amount: ex.amount, category: ex.category, date: ex.date })))}
            `;

            const fullPrompt = `${prompt}`;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const genAIResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    systemInstruction: `You are a helpful AI assistant for a cricket club manager. Analyze the provided data context to answer questions. Provide concise and clear answers. You can use simple markdown for lists (e.g., using '*'). Do not repeat the data context in your response. Answer only the user's question. \n\n${context}`,
                }
            });
            
            setResponse(genAIResponse.text);

        } catch (err: any) {
            console.error("AI Assistant Error:", err);
            setError("Sorry, I couldn't process that request. It's possible the API key is missing or invalid. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold">AI Assistant</h1>
                <p className="text-slate-400 mt-1">Your smart helper for managing the club.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-300 mb-2">
                            Ask a question about your club's data
                        </label>
                        <textarea
                            id="ai-prompt"
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'List all overdue payments' or 'What is our biggest expense category?'"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cricket-green-500 focus:border-cricket-green-500 sm:text-sm transition"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isLoading} disabled={!prompt.trim()}>
                            Get Answer
                        </Button>
                    </div>
                </form>
            </Card>

            {isLoading && (
                 <div className="flex flex-col items-center justify-center p-8 space-y-2">
                    <Spinner />
                    <p className="text-slate-400 text-sm">Thinking...</p>
                 </div>
            )}

            {error && (
                <Card>
                    <p className="text-red-400 text-center">{error}</p>
                </Card>
            )}

            {response && (
                <Card title="AI Response">
                    <div className="text-slate-300 whitespace-pre-wrap p-2">{response}</div>
                </Card>
            )}
        </div>
    );
};

export default AiAssistantPage;
