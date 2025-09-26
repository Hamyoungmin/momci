'use client';

import { useAuth } from '@/contexts/AuthContext';
import { collection, onSnapshot, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

interface ChatRoom {
  id: string;
  lastMessage: string;
  lastMessageTime?: Timestamp;
  status?: string;
  otherParticipantName?: string;
}

export default function MyChatPage() {
  const { currentUser, loading } = useAuth();
  const [chats, setChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageTime', 'desc')
    );
    const un = onSnapshot(q, (snap) => {
      const rooms: ChatRoom[] = [];
      snap.forEach((d) => {
        const data = d.data() as { lastMessage?: string; lastMessageTime?: Timestamp; status?: string; therapistName?: string; parentName?: string };
        rooms.push({
          id: d.id,
          lastMessage: data.lastMessage ?? '메시지가 없습니다',
          lastMessageTime: data.lastMessageTime,
          status: data.status ?? 'active',
          otherParticipantName: data.therapistName ?? data.parentName ?? '상대방'
        });
      });
      setChats(rooms);
    });
    return () => un();
  }, [currentUser]);

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">채팅목록</h1>
      {chats.length === 0 ? (
        <div className="text-gray-600">진행중인 채팅이 없습니다.</div>
      ) : (
        <ul className="space-y-3">
          {chats.map((c) => (
            <li key={c.id} className="flex items-center">
              {/* 좌측 카드 */}
              <div className="flex-1 border rounded-xl p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{c.otherParticipantName}</div>
                  <div className="text-sm text-gray-600 truncate">{c.lastMessage}</div>
                </div>
                <button onClick={() => (window as unknown as { openChatById?: (id: string) => void }).openChatById?.(c.id)} className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm">열기</button>
              </div>
              {/* 우측 바깥 상태 배지 */}
              <span className={`ml-3 px-2 py-1 text-xs rounded-full border whitespace-nowrap ${c.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {c.status === 'completed' ? '매칭완료' : '인터뷰중'}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500 mt-3">채팅방은 나가지 않는 이상 삭제되지 않고 계속 보관됩니다.</p>
    </section>
  );
}
