import React, { useState, useEffect } from 'react';
import { Home, Calendar, ArrowLeft, Plus, Clock, MapPin, Target, ChevronRight, Send, Eye } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [events, setEvents] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [currentReflection, setCurrentReflection] = useState(null);
  const [selectedReflectionId, setSelectedReflectionId] = useState(null);
  const [completedEventIds, setCompletedEventIds] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedReflections = localStorage.getItem('wabi_reflections');
    const savedEvents = localStorage.getItem('wabi_events');
    const savedCompleted = localStorage.getItem('wabi_completed');
    
    if (savedReflections) setReflections(JSON.parse(savedReflections));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedCompleted) setCompletedEventIds(JSON.parse(savedCompleted));
  }, []);

  // Save reflections whenever they change
  useEffect(() => {
    localStorage.setItem('wabi_reflections', JSON.stringify(reflections));
  }, [reflections]);

  // Save events whenever they change
  useEffect(() => {
    localStorage.setItem('wabi_events', JSON.stringify(events));
  }, [events]);

  // Save completed IDs whenever they change
  useEffect(() => {
    localStorage.setItem('wabi_completed', JSON.stringify(completedEventIds));
  }, [completedEventIds]);

  // Sample data - only loads if no saved data exists
  useEffect(() => {
    const sampleEvents = [{id: 1, name: 'Team Lunch', date: '2025-06-03', time: '12:00 PM', type: 'Social', location: 'Office Cafeteria', goal: 'Ask one question', typeColor: 'bg-indigo-100 text-indigo-600'}];
    const sampleReflections = [{id: 1, eventName: 'Team Meeting', date: '2025-05-30', emotion: '😔', emotionBg: 'bg-red-100', emotionBorder: 'border-red-300', snippet: 'Spoke up once during discussion...', fullReflection: 'It was challenging but I managed to speak up once.', aiHighlights: ['You voiced your concerns', 'You stayed engaged'], comfortLevel: 'Uncomfortable', goalForNext: 'Try to speak up twice next time'}];
    
    // Only set sample data if nothing is saved
    if (reflections.length === 0) setReflections(sampleReflections);
    if (events.length === 0) setEvents(sampleEvents);
  }, []);

  const getNextEvent = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return events.find(event => {
      const eventDate = new Date(event.date);
      return eventDate >= oneWeekAgo && !completedEventIds.includes(event.id);
    }) || null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const TabNavigation = ({ activeTab, onTabChange }) => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex">
        <button onClick={() => onTabChange('home')} className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>
          <Home size={20} fill={activeTab === 'home' ? 'currentColor' : 'none'} className="mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button onClick={() => onTabChange('events')} className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'events' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>
          <Calendar size={20} fill={activeTab === 'events' ? 'currentColor' : 'none'} className="mb-1" />
          <span className="text-xs font-medium">Events</span>
        </button>
      </div>
    </div>
  );

  const HomeScreen = () => {
    const nextEvent = getNextEvent();
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-700 text-center mb-8">Home</h1>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Coming Up Next</h2>
            {nextEvent ? (
              <div className="bg-white border-2 border-indigo-600 rounded-lg p-4 relative">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600 rounded-l-lg"></div>
                <div className="ml-2">
                  <h3 className="font-semibold text-gray-800 mb-3">{nextEvent.name}</h3>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600"><Clock size={12} className="text-indigo-600 mr-2" />{formatDate(nextEvent.date)} • {nextEvent.time}</div>
                    <div className="flex items-center text-sm text-gray-600"><MapPin size={12} className="text-indigo-600 mr-2" />{nextEvent.location}</div>
                    <div className="flex items-center text-sm text-gray-600"><Target size={12} className="text-indigo-600 mr-2" />Goal: <span className="text-indigo-600 font-medium ml-1">{nextEvent.goal}</span></div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => {setCurrentReflection({eventId: nextEvent.id, eventName: nextEvent.name, date: nextEvent.date, time: nextEvent.time}); setCurrentScreen('reflection');}} className="text-indigo-600 font-medium text-sm flex items-center">Reflect <ChevronRight size={16} className="ml-1" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"><p className="text-gray-500">No upcoming events. Great job staying on top of your reflections! 🎉</p></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Reflections</h2>
            <div className="space-y-3">
              {reflections.map((reflection) => (
                <div key={reflection.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => {setSelectedReflectionId(reflection.id); setCurrentScreen('viewReflection');}}>
                  <div className="flex justify-between items-start mb-2">
                    <div><h3 className="font-semibold text-gray-800">{reflection.eventName}</h3><p className="text-sm text-gray-500">{reflection.date}</p></div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${reflection.emotionBg}`}><span className="text-lg">{reflection.emotion}</span></div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{reflection.snippet}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReflectionScreen = () => {
    const [reflectionText, setReflectionText] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [showAIResponse, setShowAIResponse] = useState(false);
    const [aiMessages, setAiMessages] = useState([]);
    const [userResponse, setUserResponse] = useState('');
    const [conversationStep, setConversationStep] = useState(0);
    const [isAITyping, setIsAITyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emotions = [
      { emoji: '😔', label: 'Uncomfortable', bg: 'bg-red-50', border: 'border-red-200', selected: 'bg-red-100 border-red-400' },
      { emoji: '😐', label: 'Neutral', bg: 'bg-gray-50', border: 'border-gray-200', selected: 'bg-indigo-100 border-indigo-400' },
      { emoji: '🙂', label: 'Comfortable', bg: 'bg-green-50', border: 'border-green-200', selected: 'bg-green-100 border-green-400' }
    ];

    const generateAIResponse = async (reflection, emotion, conversationHistory = []) => {
  setIsAITyping(true);
  
  const baseDelay = 1500;
  const readingTime = conversationHistory.length > 0 
    ? conversationHistory[conversationHistory.length - 1].content.length * 20
    : reflection.length * 20;
  const thinkingDelay = baseDelay + Math.min(readingTime, 3000);
  
  await new Promise(resolve => setTimeout(resolve, thinkingDelay));
  
  try {
    const systemPrompt = `You are Wabi, a warm, supportive AI companion for introverts reflecting on social events.

The person just attended: ${currentReflection?.eventName}
They felt: ${emotion?.label || 'uncertain'}
Their reflection: "${reflection}"

IMPORTANT: Keep your FIRST response very brief (1-2 sentences max). Acknowledge one specific positive thing they did, then simply ask: "Would you like to set a small goal for next time?"

For FOLLOW-UP responses: If they engage further or give longer answers, you can be more conversational and ask deeper questions. Match their energy level - short answers get short responses, longer answers get more thoughtful engagement.`;

    const messages = conversationHistory.length > 0 
      ? conversationHistory 
      : [{ role: "user", content: systemPrompt }];

    // Call our backend API instead of Anthropic directly
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: messages,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error('API request failed');
    }

    const data = await response.json();
    const aiResponse = data.content.find(block => block.type === "text")?.text || "I'm here to support you.";
    
    setIsAITyping(false);
    return aiResponse;
  } catch (error) {
    console.error("AI Error:", error);
    setIsAITyping(false);
    return "I'm having trouble connecting right now, but I'm here for you. Could you tell me more about your experience?";
  }
};

    const handleInitialSubmit = async () => {
      if (!reflectionText.trim() || !selectedEmotion) {alert('Please share your reflection and select how you felt'); return;}
      setIsSubmitting(true);
      const aiResponse = await generateAIResponse(reflectionText, selectedEmotion);
      setAiMessages([{ type: 'ai', content: aiResponse }]);
      setShowAIResponse(true);
      setConversationStep(1);
      setIsSubmitting(false);
    };

    const handleUserResponse = async () => {
      if (!userResponse.trim()) return;
      const newUserMessage = { type: 'user', content: userResponse };
      setAiMessages(prev => [...prev, newUserMessage]);
      const currentResponse = userResponse;
      setUserResponse('');
      const conversationHistory = [
        { role: "user", content: `I'm reflecting on: ${currentReflection?.eventName}. I felt ${selectedEmotion?.label}. My reflection: "${reflectionText}"` },
        { role: "assistant", content: aiMessages[0].content }
      ];
      for (let i = 1; i < aiMessages.length; i++) {
        conversationHistory.push({role: aiMessages[i].type === 'user' ? "user" : "assistant", content: aiMessages[i].content});
      }
      conversationHistory.push({ role: "user", content: currentResponse });
      const aiResponseText = await generateAIResponse(reflectionText, selectedEmotion, conversationHistory);
      setAiMessages(prev => [...prev, { type: 'ai', content: aiResponseText }]);
      setConversationStep(prev => prev + 1);
    };

    const saveReflection = () => {
  const firstAIMessage = aiMessages.find(msg => msg.type === 'ai')?.content || '';
  const highlights = firstAIMessage
    .split('\n')
    .filter(line => line.trim().length > 0 && !line.includes('?'))
    .slice(0, 3);
  
  // Extract the actual goal statement from user messages
  let goalForNext = 'Continue building social confidence';
  
  const userMessages = aiMessages.filter(msg => msg.type === 'user');
  
  for (const msg of userMessages.map(m => m.content)) {
    const lowerMsg = msg.toLowerCase().trim();
    
    if (msg.length < 15) continue;
    if (lowerMsg === 'yes' || lowerMsg === 'yeah' || lowerMsg === 'sure' || 
        lowerMsg === 'okay' || lowerMsg === 'ok' || lowerMsg === 'no') continue;
    
    goalForNext = msg;
    
    let cleaned = goalForNext.trim();
    
    const prefixes = [
      'i want to ', 'i will ', "i'll ", 'i would like to ',
      'next time i will ', 'next time i want to ', "next time i'll ",
      'i think i will ', 'i plan to ', 'maybe i can ', 'i can try to ',
      'i could ', 'try to '
    ];
    
    for (const prefix of prefixes) {
      if (cleaned.toLowerCase().startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length);
        break;
      }
    }
    
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    
    if (cleaned.length > 120) {
      cleaned = cleaned.substring(0, 117) + '...';
    }
    
    goalForNext = cleaned;
    break;
  }
  
  // Determine emotion background/border based on emoji
  let emotionBg, emotionBorder;
  if (selectedEmotion.emoji === '😔') {
    emotionBg = 'bg-red-100';
    emotionBorder = 'border-red-300';
  } else if (selectedEmotion.emoji === '🙂') {
    emotionBg = 'bg-green-100';
    emotionBorder = 'border-green-300';
  } else {
    emotionBg = 'bg-gray-100';
    emotionBorder = 'border-gray-300';
  }
  
  const newReflection = {
    id: reflections.length + 1,
    eventName: currentReflection.eventName,
    date: new Date().toLocaleDateString(),
    emotion: selectedEmotion.emoji,
    emotionBg: emotionBg,
    emotionBorder: emotionBorder,
    snippet: reflectionText.slice(0, 40) + '...',
    fullReflection: reflectionText,
    aiHighlights: highlights.length > 0 ? highlights : ['You showed up', 'You participated'],
    comfortLevel: selectedEmotion.label,
    goalForNext: goalForNext
  };
  
  setReflections([newReflection, ...reflections]);
  
  if (currentReflection.eventId) {
    setCompletedEventIds([...completedEventIds, currentReflection.eventId]);
  }
  
  setCurrentScreen('home');
  setCurrentReflection(null);
};
  
  const newReflection = {
    id: reflections.length + 1,
    eventName: currentReflection.eventName,
    date: new Date().toLocaleDateString(),
    emotion: selectedEmotion.emoji,
    emotionBg: selectedEmotion.selected.includes('red') ? 'bg-red-100' : 
              selectedEmotion.selected.includes('green') ? 'bg-green-100' : 'bg-gray-100',
    emotionBorder: selectedEmotion.selected.includes('red') ? 'border-red-300' : 
                  selectedEmotion.selected.includes('green') ? 'border-green-300' : 'border-gray-300',
    snippet: reflectionText.slice(0, 40) + '...',
    fullReflection: reflectionText,
    aiHighlights: highlights.length > 0 ? highlights : ['You showed up', 'You participated'],
    comfortLevel: selectedEmotion.label,
    goalForNext: goalForNext
  };
  
  setReflections([newReflection, ...reflections]);
  
  if (currentReflection.eventId) {
    setCompletedEventIds([...completedEventIds, currentReflection.eventId]);
  }
  
  setCurrentScreen('home');
  setCurrentReflection(null);
};
  
  const newReflection = {
    id: reflections.length + 1,
    eventName: currentReflection.eventName,
    date: new Date().toLocaleDateString(),
    emotion: selectedEmotion.emoji,
    emotionBg: selectedEmotion.selected.includes('red') ? 'bg-red-100' : 
              selectedEmotion.selected.includes('green') ? 'bg-green-100' : 'bg-gray-100',
    emotionBorder: selectedEmotion.selected.includes('red') ? 'border-red-300' : 
                  selectedEmotion.selected.includes('green') ? 'border-green-300' : 'border-gray-300',
    snippet: reflectionText.slice(0, 40) + '...',
    fullReflection: reflectionText,
    aiHighlights: highlights.length > 0 ? highlights : ['You showed up', 'You participated'],
    comfortLevel: selectedEmotion.label,
    goalForNext: goalForNext
  };
  
  setReflections([newReflection, ...reflections]);
  
  if (currentReflection.eventId) {
    setCompletedEventIds([...completedEventIds, currentReflection.eventId]);
  }
  
  setCurrentScreen('home');
  setCurrentReflection(null);
};
  
  const newReflection = {
    id: reflections.length + 1,
    eventName: currentReflection.eventName,
    date: new Date().toLocaleDateString(),
    emotion: selectedEmotion.emoji,
    emotionBg: selectedEmotion.selected.includes('red') ? 'bg-red-100' : 
              selectedEmotion.selected.includes('green') ? 'bg-green-100' : 'bg-gray-100',
    emotionBorder: selectedEmotion.selected.includes('red') ? 'border-red-300' : 
                  selectedEmotion.selected.includes('green') ? 'border-green-300' : 'border-gray-300',
    snippet: reflectionText.slice(0, 40) + '...',
    fullReflection: reflectionText,
    aiHighlights: highlights.length > 0 ? highlights : ['You showed up', 'You participated'],
    comfortLevel: selectedEmotion.label,
    goalForNext: goalForNext
  };
  
  setReflections([newReflection, ...reflections]);
  
  if (currentReflection.eventId) {
    setCompletedEventIds([...completedEventIds, currentReflection.eventId]);
  }
  
  setCurrentScreen('home');
  setCurrentReflection(null);
};

  const ViewReflectionScreen = () => {
    const reflection = reflections.find(r => r.id === selectedReflectionId);
    if (!reflection) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Reflection not found</p></div>);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center mb-4"><button onClick={() => setCurrentScreen('home')} className="mr-4"><ArrowLeft size={24} className="text-white" /></button><h1 className="text-xl font-bold">Reflection Details</h1></div>
          <div><h2 className="text-lg font-semibold">{reflection.eventName}</h2><p className="text-indigo-200 text-sm">{reflection.date}</p></div>
        </div>
        <div className="px-6 py-6 space-y-6">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-semibold text-gray-800">How You Felt</h3><div className={`w-12 h-12 rounded-full flex items-center justify-center ${reflection.emotionBg} border-2 ${reflection.emotionBorder}`}><span className="text-2xl">{reflection.emotion}</span></div></div>
            <p className="text-gray-600 font-medium">{reflection.comfortLevel}</p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm"><h3 className="text-lg font-semibold text-gray-800 mb-3">Your Reflection</h3><div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300"><p className="text-gray-700 italic">"{reflection.fullReflection}"</p></div></div>
          <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200 shadow-sm">
            <div className="flex items-center mb-3"><div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3"><span className="text-white text-sm font-bold">W</span></div><h3 className="text-lg font-semibold text-indigo-800">Wabi's Insights</h3></div>
            <div className="space-y-2">{reflection.aiHighlights.map((highlight, index) => (<div key={index} className="flex items-start"><span className="text-indigo-500 mr-2">✨</span><p className="text-indigo-700">{highlight}</p></div>))}</div>
          </div>
          {reflection.goalForNext && (<div className="bg-green-50 rounded-lg p-5 border border-green-200 shadow-sm"><div className="flex items-center mb-2"><Target size={20} className="text-green-600 mr-2" /><h3 className="text-lg font-semibold text-green-800">Goal for Next Time</h3></div><p className="text-green-700">{reflection.goalForNext}</p></div>)}
        </div>
      </div>
    );
  };

  const EventsScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-8">Upcoming Events</h1>
        <div className="space-y-4 mb-8">
          {events.map((event) => {
            const isCompleted = completedEventIds.includes(event.id);
            return (<div key={event.id} className={`bg-white border rounded-lg p-4 ${isCompleted ? 'opacity-50' : 'border-gray-200'}`}><div className="flex items-start justify-between mb-3"><div className="flex items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${event.typeColor}`}><span className="text-sm font-medium">{event.type.charAt(0)}</span></div><div><h3 className="font-semibold text-gray-800">{event.name}{isCompleted && <span className="ml-2 text-xs text-green-600">✓ Reflected</span>}</h3><p className="text-sm text-gray-500">{formatDate(event.date)} • {event.time}</p></div></div></div><p className="text-sm text-gray-400">Goal: {event.goal}</p></div>);
          })}
        </div>
        <div className="flex flex-col items-center"><button onClick={() => setCurrentScreen('addEvent')} className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"><Plus size={24} /></button><span className="text-sm text-gray-500 mt-2">Add Event</span></div>
      </div>
    </div>
  );

  const AddEventScreen = () => {
    const [formData, setFormData] = useState({name: '', date: '', time: '', type: 'Social', location: '', goal: ''});
    const handleSubmit = () => {
      if (!formData.name || !formData.date || !formData.time) {alert('Please fill in required fields'); return;}
      const newEvent = {id: events.length + 1, name: formData.name, date: formData.date, time: formData.time, type: formData.type, location: formData.location, goal: formData.goal, typeColor: formData.type === 'Social' ? 'bg-indigo-100 text-indigo-600' : formData.type === 'Professional' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'};
      setEvents([...events, newEvent]);
      setCurrentScreen('events');
    };
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-6 py-8">
          <div className="flex items-center mb-8"><button onClick={() => setCurrentScreen('events')} className="mr-4"><ArrowLeft size={24} className="text-indigo-600" /></button><h1 className="text-2xl font-bold text-gray-700">Add Event</h1></div>
          <div className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Event Name*</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Team Lunch" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Date & Time*</label><div className="grid grid-cols-2 gap-3"><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" /><input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Type*</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"><option value="Social">Social</option><option value="Professional">Professional</option><option value="Networking">Networking</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Office Cafeteria" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">One small goal (optional)</label><input type="text" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ask one question during lunch" /></div>
            <button onClick={handleSubmit} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700">Save Event</button>
          </div>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'reflection': return <ReflectionScreen />;
      case 'events': return <EventsScreen />;
      case 'addEvent': return <AddEventScreen />;
      case 'viewReflection': return <ViewReflectionScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {renderScreen()}
      {
        (currentScreen === 'home' || currentScreen === 'events') && <TabNavigation activeTab={currentScreen} onTabChange={setCurrentScreen} />}
</div>
);
}
export default App;
