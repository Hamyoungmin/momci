'use client';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import OneOnOneChat from '@/components/chat/OneOnOneChat';
import { useEffect, useRef, useState } from 'react';

interface ChatRoom {
  id: string;
  lastMessage: string;
  lastMessageTime?: Timestamp;
  otherParticipantName?: string;
}

interface ChatListPopupProps {
  onClose: () => void;
  initialChatId?: string;
}

export default function ChatListPopup({ onClose, initialChatId }: ChatListPopupProps) {
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  // 드래그 이동 상태
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [chats, setChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const un = onSnapshot(q, (snap) => {
      const rooms: ChatRoom[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          lastMessage: (data.lastMessage as string) || '메시지가 없습니다',
          lastMessageTime: data.lastMessageTime as Timestamp | undefined,
          // any 사용 제거: 안전한 접근으로 대체
          otherParticipantName: (data && typeof data === 'object' && 'therapistName' in data && typeof (data as { therapistName?: unknown }).therapistName === 'string')
            ? (data as { therapistName?: string }).therapistName
            : (data && typeof data === 'object' && 'parentName' in data && typeof (data as { parentName?: unknown }).parentName === 'string')
              ? (data as { parentName?: string }).parentName
              : '상대방'
        };
      });
      rooms.sort((a, b) => {
        const ta = a.lastMessageTime?.toDate().getTime() ?? 0;
        const tb = b.lastMessageTime?.toDate().getTime() ?? 0;
        return tb - ta;
      });
      setChats(rooms);
    });

    return () => un();
  }, [currentUser]);

  const openInlineChat = (id: string, name?: string) => {
    setSelected({ id, name: name || '상대방' });
    setShowPanel(true);
  };

  // 외부에서 전달된 initialChatId가 있으면 자동으로 선택/오픈
  useEffect(() => {
    if (initialChatId && chats.length > 0) {
      const found = chats.find((c) => c.id === initialChatId);
      if (found) openInlineChat(found.id, found.otherParticipantName);
    }
  }, [initialChatId, chats]);

  // 드래그 시작
  const handleDragStart = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    setIsFloating(true);
    const rect = panelRef.current.getBoundingClientRect();
    dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragPos({ x: rect.left, y: rect.top });
    setIsDragging(true);
    window.addEventListener('mousemove', handleDragging);
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragging = (e: MouseEvent) => {
    setDragPos({ x: e.clientX - dragOffsetRef.current.x, y: e.clientY - dragOffsetRef.current.y });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    window.removeEventListener('mousemove', handleDragging);
    window.removeEventListener('mouseup', handleDragEnd);
  };

  // 패널이 열리면 현재 Y 위치 유지, X는 화면 오른쪽 여백으로 이동
  useEffect(() => {
    if (showPanel && panelRef.current && !isFloating) {
      const rect = panelRef.current.getBoundingClientRect();
      const panelWidth = 420;
      // 오른쪽 여백을 4px로 더 붙였습니다 (기존 16px → 4px)
      const rightMargin = 4;
      const left = Math.max(rightMargin, (typeof window !== 'undefined' ? window.innerWidth : 1200) - panelWidth - rightMargin);
      setDragPos({ x: left, y: rect.top });
      setIsFloating(true);
    }
  }, [showPanel, isFloating]);

  return (
    <div className="absolute bottom-20 right-0 mb-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-visible z-[9999] relative">
      <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">1:1 채팅</div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">진행중인 채팅이 없습니다</div>
        ) : (
          chats.map((c) => (
            <button
              key={c.id}
              onClick={() => openInlineChat(c.id, c.otherParticipantName)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs flex-shrink-0">
                💬
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{c.otherParticipantName}</div>
                <div className="text-xs text-gray-500 truncate">{c.lastMessage}</div>
              </div>
            </button>
          ))
        )}
      </div>
      <div className="px-4 py-2 border-t bg-white">
        <button
          onClick={() => { window.location.href = '/mypage/chat'; onClose(); }}
          className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          전체 채팅 보기
        </button>
      </div>

      {showPanel && selected && (
        <div
          ref={panelRef}
          className={isFloating ? 'fixed' : 'absolute right-full mr-3 bottom-0'}
          style={isFloating ? { left: dragPos.x, top: dragPos.y } : undefined}
        >
          <div className="animate-fadeInUp relative select-none">
            {/* 드래그 핸들 영역 (상단 40px) */}
            <div
              onMouseDown={handleDragStart}
              className={`absolute top-0 left-0 right-0 h-14 cursor-move z-[10000] ${
                isDragging ? 'opacity-60' : 'opacity-0'
              }`}
            />
            <OneOnOneChat
              chatRoomId={selected.id}
              otherUserId={''}
              otherUserName={selected.name}
              otherUserType={'therapist'}
              onClose={() => {
                setShowPanel(false);
                setIsFloating(false);
              }}
              position={'anchored'}
            />
          </div>
        </div>
      )}
    </div>
  );
}


