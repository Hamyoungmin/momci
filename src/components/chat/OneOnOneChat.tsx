'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChatMessage, 
  subscribeToMessages, 
  sendMessage 
} from '@/lib/chat';
import { filterPhoneNumber, PhoneFilterResult } from '@/utils/phoneFilter';
import { Timestamp, FieldValue } from 'firebase/firestore';

interface OneOnOneChatProps {
  chatRoomId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserType: 'parent' | 'therapist';
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  position?: 'fixed' | 'anchored';
}

export default function OneOnOneChat({ 
  chatRoomId, 
  otherUserId: _otherUserId, // eslint-disable-line @typescript-eslint/no-unused-vars
  otherUserName, 
  otherUserType,
  onClose,
  isMinimized = false,
  onToggleMinimize,
  position = 'fixed'
}: OneOnOneChatProps) {
  const { currentUser, userData } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [phoneFilterResult, setPhoneFilterResult] = useState<PhoneFilterResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 채팅 메시지 실시간 조회
  useEffect(() => {
    if (!chatRoomId || !currentUser) return;

    console.log('🔥 채팅 메시지 실시간 리스너 설정:', chatRoomId);

    const unsubscribe = subscribeToMessages(chatRoomId, (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
      
      // 새 메시지가 오면 스크롤을 맨 아래로
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => {
      console.log('🔄 채팅 메시지 리스너 해제');
      unsubscribe();
    };
  }, [chatRoomId, currentUser]);

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !userData || sending) return;

    // 🚫 전화번호 필터링 검사
    const filterResult = filterPhoneNumber(newMessage.trim());
    if (filterResult.isBlocked) {
      setPhoneFilterResult(filterResult);
      console.log('🚫 전화번호 교환 차단:', filterResult.reason);
      
      // 3초 후 경고 메시지 자동 숨김
      setTimeout(() => {
        setPhoneFilterResult(null);
      }, 5000);
      
      return; // 메시지 전송 중단
    }

    setSending(true);
    try {
      // 새로운 라이브러리 함수 사용
      const senderType = userData.userType === 'admin' ? 'parent' : userData.userType as 'parent' | 'therapist';
      await sendMessage(
        chatRoomId,
        currentUser.uid,
        userData.name || '익명',
        senderType,
        newMessage.trim()
      );

      setNewMessage('');
      setPhoneFilterResult(null); // 성공 시 경고 메시지 제거
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  // 엔터 키로 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 시간 포맷
  const formatTime = (timestamp: Timestamp | string | Date | FieldValue | null) => {
    if (!timestamp) return '';
    
    try {
      let date: Date;
      if (timestamp instanceof Timestamp) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        // FieldValue인 경우 현재 시간으로 대체
        date = new Date();
      }
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className={`${position === 'fixed' ? 'fixed bottom-4 right-4' : 'absolute bottom-20 right-0'} w-96 h-16 bg-white rounded-lg shadow-xl border flex items-center justify-center z-50`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
        <p className="text-gray-600 text-sm">채팅방 연결 중...</p>
      </div>
    );
  }

  // 최소화된 상태
  if (isMinimized) {
    return (
      <div className={`${position === 'fixed' ? 'fixed bottom-4 right-4' : 'absolute bottom-20 right-0'} w-96 h-16 bg-white rounded-lg shadow-xl border z-50`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {otherUserName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{otherUserName}</h3>
              <p className="text-xs text-gray-500">
                {otherUserType === 'parent' ? '학부모' : '치료사'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleMinimize}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ↑
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${position === 'fixed' ? 'fixed bottom-4 right-4' : 'absolute bottom-20 right-0'} w-96 h-[560px] bg-white rounded-2xl shadow-2xl border flex flex-col z-50`}>
      {/* 헤더 - 카카오톡 스타일 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">
              {otherUserName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{otherUserName}</h3>
            <p className="text-xs text-green-500">온라인</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMinimize}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ↓
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 안내 배너 영역 */}
      <div className="border-b">
        {/* 인터뷰 안내 (노란 배너) */}
        <div className="px-4 py-3 bg-yellow-50">
          <p className="text-xs text-gray-800 font-semibold mb-1">인터뷰 후 수업을 결정하셨나요?</p>
          <p className="text-[11px] text-gray-700">
            매칭 확정을 위해 대표번호로 문자 안내를 보내주세요. 응답 전 교환된 연락처는 차단됩니다.
          </p>
        </div>
        {/* 안전 안내 (붉은 텍스트 라벨 느낌) */}
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-[11px] text-red-600 font-semibold">안전한 소통을 위해 연락처 교환은 금지됩니다.</p>
        </div>
      </div>

      {/* 메시지 영역 - 카카오톡 스타일 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400">💬</span>
            </div>
            <p className="text-gray-500 text-sm">안녕하세요! 첫 메시지를 보내보세요</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMyMessage = message.senderId === currentUser?.uid;
            return (
              <div
                key={message.id}
                className={`flex items-end ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                {/* 프로필 이미지 (상대방만) */}
                {!isMyMessage && (
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                    <span className="text-gray-600 text-xs">
                      {message.senderName.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className={`max-w-[240px] ${isMyMessage ? 'order-1' : 'order-2'}`}>
                  {/* 발신자 이름 (상대방만) */}
                  {!isMyMessage && (
                    <p className="text-xs text-gray-500 mb-1 px-1">
                      {message.senderName}
                    </p>
                  )}
                  
                  {/* 메시지 말풍선 */}
                  <div
                    className={`px-3 py-2 rounded-2xl shadow-sm ${
                      isMyMessage
                        ? 'bg-yellow-300 text-gray-900 rounded-br-sm'
                        : 'bg-white border text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                  </div>
                  <div className={`mt-1 text-[10px] text-gray-400 ${isMyMessage ? 'text-right' : 'text-left'} px-1`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* 전화번호 차단 경고 메시지 */}
        {phoneFilterResult?.isBlocked && (
          <div className="mx-3 mb-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-600 font-semibold text-sm">전화번호 교환이 불가합니다</p>
              </div>
              
              <p className="text-red-600 text-xs mb-3">
                {phoneFilterResult.reason}
              </p>
              
              {phoneFilterResult.suggestions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-red-600 text-xs font-medium">💡 대안:</p>
                  {phoneFilterResult.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-red-500 text-xs pl-2">
                      {suggestion}
                    </p>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setPhoneFilterResult(null)}
                className="mt-2 text-red-500 text-xs hover:text-red-700 underline"
              >
                확인했습니다
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 - 카카오톡 스타일 */}
      <div className="border-t bg-white rounded-b-2xl">
        <div className="flex items-end space-x-2 p-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full resize-none px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={1}
              style={{
                minHeight: '36px',
                maxHeight: '80px'
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              newMessage.trim() && !sending
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
