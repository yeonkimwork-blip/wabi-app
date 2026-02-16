import React, { useState, useEffect } from 'react';
import { Home, Calendar, ArrowLeft, Plus, Clock, MapPin, Target, ChevronRight, Send, Eye, Trophy } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [events, setEvents] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [currentReflection, setCurrentReflection] = useState(null);
  const [selectedReflectionId, setSelectedReflectionId] = useState(null);
  const [completedEventIds, setCompletedEventIds] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedReflections = localStorage.getItem('wabi_reflections');
      const savedEvents = localStorage.getItem('wabi_events');
      const savedCompleted = localStorage.getItem('wabi_completed');
      
      if (savedReflections) {
        const parsed = JSON.parse(savedReflections);
        if (parsed.length > 0) setReflections(parsed);
      }
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents);
        if (parsed.length > 0) setEvents(parsed);
      }
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (parsed.length > 0) setCompletedEventIds(parsed);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (reflections.length > 0) {
      localStorage.setItem('wabi_reflections', JSON.stringify(reflections));
    }
  }, [reflections]);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('wabi_events', JSON.stringify(events));
    }
  }, [events]);

  useEffect(() => {
    if (completedEventIds.length > 0) {
      localStorage.setItem('wabi_completed', JSON.stringify(completedEventIds));
    }
  }, [completedEventIds]);

  // Load sample data only if empty
  useEffect(() => {
    const hasData = localStorage.getItem('wabi_reflections') || localStorage.getItem('wabi_events');
    
    if (!hasData) {
      const sampleEvents = [{
        id: 1,
        name: 'Team Lunch',
        date: '2025-06-03',
        time: '12:00 PM',
        type: 'Social',
        location: 'Office Cafeteria',
        goal: 'Ask one question',
        typeColor: 'bg-indigo-100 text-indigo-600'
      }];
      
      const sampleReflections = [{
        id: 1,
        eventName: 'Team Meeting',
        date: '2025-05-30',
        emotion: '😔',
        emotionBg: 'bg-red-100',
        emotionBorder: 'border-red-300',
        snippet: 'Spoke up once during discussion...',
        fullReflection: 'It was challenging but I managed to speak up once.',
        aiHighlights: ['You voiced your concerns', 'You stayed engaged'],
        comfortLevel: 'Uncomfortable',
        goalForNext: 'Try to speak up twice next time'
      }];
      
      setEvents(sampleEvents);
      setReflections(sampleReflections);
    }
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
        <button 
          onClick={() => onTabChange('home')} 
          className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg ${
            activeTab === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'
          }`}
        >
          <Home size={20} fill={activeTab === 'home' ? 'currentColor' : 'none'} className="mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button 
          onClick={() => onTabChange('events')} 
          className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg ${
            activeTab === 'events' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'
          }`}
        >
          <Calendar size={20} fill={activeTab === 'events' ? 'currentColor' : 'none'} className="mb-1" />
          <span className="text-xs font-medium">Events</span>
        </button>
        <button 
          onClick={() => onTabChange('wins')} 
          className={`flex-1 flex flex-col items-center py-2 px-3 rounded-lg ${
            activeTab === 'wins' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'
          }`}
        >
          <Trophy size={20} fill={activeTab === 'wins' ? 'currentColor' : 'none'} className="mb-1" />
          <span className="text-xs font-medium">Wins</span>
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
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={12} className="text-indigo-600 mr-2" />
                      {formatDate(nextEvent.date)} • {nextEvent.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={12} className="text-indigo-600 mr-2" />
                      {nextEvent.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target size={12} className="text-indigo-600 mr-2" />
                      Goal: <span className="text-indigo-600 font-medium ml-1">{nextEvent.goal}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => {
                        setCurrentReflection({
                          eventId: nextEvent.id,
                          eventName: nextEvent.name,
                          date: nextEvent.date,
                          time: nextEvent.time
                        });
                        setCurrentScreen('reflection');
                      }}
                      className="text-indigo-600 font-medium text-sm flex items-center"
                    >
                      Reflect <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">No upcoming events. Great job staying on top of your reflections! 🎉</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">My Reflections</h2>
            <div className="space-y-3">
              {reflections.map((reflection) => (
                <div 
                  key={reflection.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedReflectionId(reflection.id);
                    setCurrentScreen('viewReflection');
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{reflection.eventName}</h3>
                      <p className="text-sm text-gray-500">{reflection.date}</p>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${reflection.emotionBg}`}>
                      <span className="text-lg">{reflection.emotion}</span>
                    </div>
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
    const [isAITyping, setIsAITyping] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const chatContainerRef = React.useRef(null);

    const emotions = [
      { emoji: '😔', label: 'Uncomfortable', bg: 'bg-red-50', border: 'border-red-200', selected: 'bg-red-100 border-red-400' },
      { emoji: '😐', label: 'Neutral', bg: 'bg-gray-50', border: 'border-gray-200', selected: 'bg-indigo-100 border-indigo-400' },
      { emoji: '🙂', label: 'Comfortable', bg: 'bg-green-50', border: 'border-green-200', selected: 'bg-green-100 border-green-400' }
    ];

    // Auto-scroll to bottom when new messages appear
    React.useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [aiMessages, isAITyping]);

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

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: messages
          })
        });

        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        const aiResponse = data.content.find(block => block.type === "text")?.text || "I'm here to support you.";
        setIsAITyping(false);
        return aiResponse;
      } catch (error) {
        console.error("AI Error:", error);
        setIsAITyping(false);
        return "I'm having trouble connecting right now, but I'm here for you.";
      }
    };

    const handleInitialSubmit = async () => {
      if (!reflectionText.trim() || !selectedEmotion) {
        alert('Please share your reflection and select how you felt');
        return;
      }
      setIsSubmitting(true);
      const aiResponse = await generateAIResponse(reflectionText, selectedEmotion);
      setAiMessages([{ type: 'ai', content: aiResponse }]);
      setShowAIResponse(true);
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
        conversationHistory.push({
          role: aiMessages[i].type === 'user' ? "user" : "assistant",
          content: aiMessages[i].content
        });
      }
      conversationHistory.push({ role: "user", content: currentResponse });

      const aiResponseText = await generateAIResponse(reflectionText, selectedEmotion, conversationHistory);
      setAiMessages(prev => [...prev, { type: 'ai', content: aiResponseText }]);
    };

    // Extract goal from the conversation - prioritize Wabi's suggestions
    const extractGoalFromConversation = () => {
      // If there's no meaningful conversation (only error messages), return default
      const meaningfulMessages = aiMessages.filter(msg => 
        msg.type === 'ai' && 
        !msg.content.includes('having trouble connecting') &&
        msg.content.length > 20
      );
      
      if (meaningfulMessages.length === 0) {
        return 'Continue building social confidence';
      }

      // Strategy 1: Look for the last AI message that contains a concrete suggestion
      // Usually this is after the user has engaged, so it's more specific
      const aiSuggestions = aiMessages.filter(msg => msg.type === 'ai').reverse();
      
      for (const msg of aiSuggestions) {
        const content = msg.content;
        
        // Look for patterns where Wabi suggests a goal
        const suggestionPatterns = [
          /how about (trying to |you try to |you )?([^?.!]+[?.!])/i,
          /you could (try to |try )?([^?.!]+[?.!])/i,
          /maybe (you could |try to |you can )?([^?.!]+[?.!])/i,
          /why don't you (try to |try )?([^?.!]+[?.!])/i,
          /what if you ([^?.!]+[?.!])/i,
          /your goal.*could be[:\s]+([^?.!]+)/i,
          /that sounds like a great goal[:\s-]+([^?.!]+)/i,
          /so (?:your )?goal (?:is|could be) (?:to )?([^?.!]+)/i,
          /let's (?:make|set) your goal[:\s]+([^?.!]+)/i,
          /(?:next time|for next time),? (?:you could|maybe) ([^?.!]+)/i,
        ];
        
        for (const pattern of suggestionPatterns) {
          const match = content.match(pattern);
          if (match) {
            let goal = match[match.length - 1].trim();
            
            // Remove trailing punctuation
            goal = goal.replace(/[?.!]+$/, '');
            
            // Clean up the goal
            goal = goal.replace(/^(to |you |will |can |could |would |should )/i, '');
            goal = goal.trim();
            goal = goal.charAt(0).toUpperCase() + goal.slice(1);
            
            // Limit length
            if (goal.length > 80) {
              goal = goal.substring(0, 77) + '...';
            }
            
            if (goal.length > 10) {
              return goal;
            }
          }
        }
      }
      
      // Strategy 2: If patterns don't match, check if the last AI message itself 
      // looks like a refined goal (short, actionable statement)
      const lastAIMessage = aiMessages.filter(msg => msg.type === 'ai').slice(-1)[0];
      if (lastAIMessage && lastAIMessage.content.length < 100 && lastAIMessage.content.length > 15) {
        const cleaned = lastAIMessage.content
          .replace(/[?.!]+$/, '')
          .replace(/^(okay,? |great!? |perfect!? |sounds good!? )/i, '')
          .trim();
        
        // Check if it doesn't end with a question mark (not a question)
        if (!lastAIMessage.content.includes('?')) {
          return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }
      }
      
      // Strategy 3: If no clear suggestion found, look for user's stated goal
      const userMessages = aiMessages.filter(msg => msg.type === 'user');
      for (const msg of userMessages.reverse()) {
        const lowerMsg = msg.content.toLowerCase().trim();
        if (msg.content.length < 15) continue;
        if (lowerMsg === 'yes' || lowerMsg === 'yeah' || lowerMsg === 'sure' || 
            lowerMsg === 'okay' || lowerMsg === 'ok' || lowerMsg === 'no') continue;
        
        let goal = msg.content.trim();
        
        const prefixes = [
          'i want to ', 'i will ', "i'll ", 'i would like to ',
          'next time i will ', 'next time i want to ', "next time i'll ",
          'i think i will ', 'i plan to ', 'maybe i can ', 'i can try to ',
          'i could ', 'try to ', 'to '
        ];
        
        for (const prefix of prefixes) {
          if (goal.toLowerCase().startsWith(prefix)) {
            goal = goal.substring(prefix.length);
            break;
          }
        }
        
        goal = goal.charAt(0).toUpperCase() + goal.slice(1);
        if (goal.length > 80) {
          goal = goal.substring(0, 77) + '...';
        }
        
        if (goal.length > 10) {
          return goal;
        }
      }
      
      return 'Continue building social confidence';
    };

    const saveReflection = () => {
      if (!selectedEmotion) {
        alert('Please select how you felt');
        return;
      }
      
      const firstAIMessage = aiMessages.find(msg => msg.type === 'ai')?.content || '';
      
      // Check if the AI response is an error message
      const isErrorMessage = firstAIMessage.includes('having trouble connecting') || 
                             firstAIMessage.includes('error') ||
                             firstAIMessage.length < 20;
      
      const highlights = isErrorMessage 
        ? ['You showed up', 'You engaged with the event', 'You took time to reflect']
        : firstAIMessage
            .split('\n')
            .filter(line => line.trim().length > 0 && !line.includes('?'))
            .slice(0, 3);
      
      // Extract the goal from the conversation (prioritizes Wabi's suggestions)
      const goalForNext = extractGoalFromConversation();
      
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
        id: Date.now(),
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
      
      const updatedReflections = [newReflection, ...reflections];
      setReflections(updatedReflections);
      localStorage.setItem('wabi_reflections', JSON.stringify(updatedReflections));
      
      if (currentReflection.eventId) {
        const updatedCompleted = [...completedEventIds, currentReflection.eventId];
        setCompletedEventIds(updatedCompleted);
        localStorage.setItem('wabi_completed', JSON.stringify(updatedCompleted));
      }
      
      setCurrentScreen('home');
      setCurrentReflection(null);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center mb-4">
            <button onClick={() => setCurrentScreen('home')} className="mr-4">
              <ArrowLeft size={24} className="text-white" />
            </button>
            <h1 className="text-xl font-bold">Event Reflection</h1>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{currentReflection?.eventName}</h2>
            <p className="text-indigo-200 text-sm">
              {formatDate(currentReflection?.date)} • {currentReflection?.time}
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {!showAIResponse ? (
            <>
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">How did your event go?</h3>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                  placeholder=""
                />
              </div>

              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How comfortable did you feel?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.emoji}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        selectedEmotion?.emoji === emotion.emoji 
                          ? emotion.selected 
                          : `${emotion.bg} ${emotion.border}`
                      }`}
                    >
                      <div className="text-2xl mb-1">{emotion.emoji}</div>
                      <div className="text-xs font-medium text-gray-600">{emotion.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleInitialSubmit}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Continue'}
              </button>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <div 
                  ref={chatContainerRef}
                  className="space-y-4 max-h-[60vh] overflow-y-auto scroll-smooth"
                >
                  {aiMessages.map((message, idx) => (
                    <div 
                      key={idx} 
                      className={`${
                        message.type === 'ai' 
                          ? 'bg-indigo-50 text-gray-800' 
                          : 'bg-gray-100 text-gray-800 ml-8'
                      } p-4 rounded-lg`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                  {isAITyping && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
                  placeholder="Type your response..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleUserResponse}
                  disabled={isAITyping}
                  className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>

              <button
                onClick={saveReflection}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700"
              >
                Save Reflection
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const ViewReflectionScreen = () => {
    const reflection = reflections.find(r => r.id === selectedReflectionId);
    
    if (!reflection) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <p className="text-gray-500">Reflection not found</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center mb-4">
            <button onClick={() => setCurrentScreen('home')} className="mr-4">
              <ArrowLeft size={24} className="text-white" />
            </button>
            <h1 className="text-xl font-bold">Reflection Details</h1>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{reflection.eventName}</h2>
              <p className="text-indigo-200 text-sm">{reflection.date}</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reflection.emotionBg} ${reflection.emotionBorder} border-2`}>
              <span className="text-2xl">{reflection.emotion}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Your Reflection</h3>
            <p className="text-gray-800">{reflection.fullReflection}</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Comfort Level</h3>
            <p className="text-gray-800 font-medium">{reflection.comfortLevel}</p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Highlights</h3>
            <ul className="space-y-2">
              {reflection.aiHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-800">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-50 rounded-lg p-5 border-2 border-indigo-200 shadow-sm">
            <h3 className="text-sm font-semibold text-indigo-700 uppercase mb-3 flex items-center">
              <Target size={16} className="mr-2" />
              Goal for Next Time
            </h3>
            <p className="text-indigo-900 font-medium">{reflection.goalForNext}</p>
          </div>
        </div>
      </div>
    );
  };

  const WinsScreen = () => {
    // Calculate stats
    const goalsCompleted = reflections.length;
    const eventsAttended = completedEventIds.length;
    
    // Calculate current streak (consecutive days with reflections)
    const calculateStreak = () => {
      if (reflections.length === 0) return 0;
      
      const sortedReflections = [...reflections].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Most recent first
      });
      
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (const reflection of sortedReflections) {
        const reflectionDate = new Date(reflection.date);
        reflectionDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((currentDate - reflectionDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }
      
      return streak;
    };
    
    const currentStreak = calculateStreak();
    
    // Format time ago
    const getTimeAgo = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Your Wins</h1>
          <p className="text-gray-500 mb-8">Celebrate every step forward</p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{goalsCompleted}</div>
              <div className="text-sm text-gray-600">Goals Completed</div>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{eventsAttended}</div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center col-span-2">
              <div className="text-4xl font-bold text-green-600 mb-2">🔥 {currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>

          {/* Recent Wins */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Wins</h2>
            
            {reflections.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Trophy size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No wins yet! Complete your first reflection to see your progress here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reflections.map((reflection) => (
                  <div 
                    key={reflection.id}
                    onClick={() => {
                      setSelectedReflectionId(reflection.id);
                      setCurrentScreen('viewReflection');
                    }}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 line-clamp-1">{reflection.goalForNext}</p>
                      <p className="text-sm text-gray-500">
                        {reflection.eventName} · {getTimeAgo(reflection.date)}
                      </p>
                    </div>
                    
                    <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
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
            return (
              <div 
                key={event.id} 
                className={`bg-white border rounded-lg p-4 ${
                  isCompleted ? 'opacity-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${event.typeColor}`}>
                      <span className="text-sm font-medium">
                        {event.type.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {event.name}
                        {isCompleted && <span className="ml-2 text-xs text-green-600">✓ Reflected</span>}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(event.date)} • {event.time}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400">Goal: {event.goal}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center">
          <button 
            onClick={() => setCurrentScreen('addEvent')}
            className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={24} />
          </button>
          <span className="text-sm text-gray-500 mt-2">Add Event</span>
        </div>
      </div>
    </div>
  );

  const AddEventScreen = () => {
    const [formData, setFormData] = useState({
      name: '',
      date: '',
      time: '',
      type: 'Social',
      location: '',
      goal: ''
    });

    const handleSubmit = () => {
      if (!formData.name || !formData.date || !formData.time) {
        alert('Please fill in required fields');
        return;
      }
      
      const newEvent = {
        id: Date.now(),
        name: formData.name,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        location: formData.location,
        goal: formData.goal,
        typeColor: formData.type === 'Social' 
          ? 'bg-indigo-100 text-indigo-600' 
          : formData.type === 'Professional' 
            ? 'bg-amber-100 text-amber-600' 
            : 'bg-emerald-100 text-emerald-600'
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('wabi_events', JSON.stringify(updatedEvents));
      setCurrentScreen('events');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-6 py-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setCurrentScreen('events')}
              className="mr-4"
            >
              <ArrowLeft size={24} className="text-indigo-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-700">Add Event</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Team Lunch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time*
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type*
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Social">Social</option>
                <option value="Professional">Professional</option>
                <option value="Networking">Networking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Office Cafeteria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                One small goal (optional)
              </label>
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Ask one question during lunch"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700"
            >
              Save Event
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'reflection': return <ReflectionScreen />;
      case 'events': return <EventsScreen />;
      case 'wins': return <WinsScreen />;
      case 'addEvent': return <AddEventScreen />;
      case 'viewReflection': return <ViewReflectionScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {renderScreen()}
      {(currentScreen === 'home' || currentScreen === 'events' || currentScreen === 'wins') && <TabNavigation activeTab={currentScreen} onTabChange={setCurrentScreen} />}
    </div>
  );
}

export default App;
