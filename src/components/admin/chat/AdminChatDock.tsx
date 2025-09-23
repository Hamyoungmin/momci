"use client";
import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query, limit, Timestamp } from 'firebase/firestore';

interface ChatRoom {
  id: string;
  parentName?: string;
  therapistName?: string;
  lastMessage?: string;
  lastMessageTime?: Timestamp;
  participants?: string[];
}

interface MessageItem {
  id: string;
  senderName?: string;
  message?: string;
  timestamp?: Timestamp;
}

export default function AdminChatDock() {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // 최근 30개 채팅방 실시간 구독 (정렬 인덱스 있는 경우 orderBy 사용, 실패시 클라 정렬로 대체)
  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('lastMessageTime', 'desc'), limit(30));
    const un = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data() as { parentName?: string; therapistName?: string; lastMessage?: string; lastMessageTime?: Timestamp; participants?: string[] };
        const room: ChatRoom = {
          id: d.id,
          parentName: data?.parentName,
          therapistName: data?.therapistName,
          lastMessage: data?.lastMessage,
          lastMessageTime: data?.lastMessageTime,
          participants: data?.participants,
        };
        return room;
      });
      setRooms(list);
      if (!selectedId && list.length > 0) setSelectedId(list[0].id);
    }, () => {
      // 인덱스 문제 등으로 실패 시 정렬 없이 재시도
      const q2 = query(collection(db, 'chats'), limit(30));
      const un2 = onSnapshot(q2, (snap2) => {
        const list2 = snap2.docs.map((d) => {
          const data2 = d.data() as { parentName?: string; therapistName?: string; lastMessage?: string; lastMessageTime?: Timestamp; participants?: string[] };
          const room2: ChatRoom = {
            id: d.id,
            parentName: data2?.parentName,
            therapistName: data2?.therapistName,
            lastMessage: data2?.lastMessage,
            lastMessageTime: data2?.lastMessageTime,
            participants: data2?.participants,
          };
          return room2;
        });
        list2.sort((a, b) => {
          const ta = a.lastMessageTime ? a.lastMessageTime.toDate().getTime() : 0;
          const tb = b.lastMessageTime ? b.lastMessageTime.toDate().getTime() : 0;
          return tb - ta;
        });
        setRooms(list2);
        if (!selectedId && list2.length > 0) setSelectedId(list2[0].id);
      });
      return () => un2();
    });
    return () => un();
  }, [selectedId]);

  // 선택 채팅 메시지 구독
  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    const q = query(collection(db, 'chats', selectedId, 'messages'), orderBy('timestamp', 'desc'), limit(100));
    const un = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data() as { senderName?: string; message?: string; timestamp?: Timestamp };
        const msg: MessageItem = {
          id: d.id,
          senderName: data?.senderName,
          message: data?.message,
          timestamp: data?.timestamp,
        };
        return msg;
      });
      list.sort((a, b) => {
        const ta = a.timestamp ? a.timestamp.toDate().getTime() : 0;
        const tb = b.timestamp ? b.timestamp.toDate().getTime() : 0;
        return ta - tb;
      });
      setMessages(list);
    }, () => setMessages([]));
    return () => un();
  }, [selectedId]);

  const panelClass = useMemo(() => (
    `fixed z-40 bottom-24 right-20 sm:right-24 w-full max-w-[380px] h-[70vh] bg-white border border-gray-200 rounded-xl shadow-2xl transform origin-bottom-right transition-all duration-200 ${open ? 'opacity-100 scale-100 translate-y-0' : 'pointer-events-none opacity-0 scale-95 translate-y-2'}`
  ), [open]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-40 right-20 bottom-6 sm:right-24 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center"
        aria-label="채팅 패널 토글"
        title={open ? '채팅 닫기' : '채팅 열기'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 5V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
        </svg>
      </button>

      <div className={panelClass}>
        {/* 화살표 (버튼에서 나오는 느낌) */}
        <div className="absolute -bottom-2 right-8 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>
        <div className="h-full grid grid-rows-[auto,1fr] rounded-xl overflow-hidden">
          <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">관리자 채팅 뷰어</div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">닫기</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 h-full">
            <div className="sm:col-span-1 border-r overflow-y-auto">
              {rooms.length === 0 && (
                <div className="p-3 text-sm text-gray-500">대화가 없습니다.</div>
              )}
              {rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left p-3 border-b hover:bg-gray-50 ${selectedId === r.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="text-sm font-medium text-gray-900">{r.parentName || '-'}<span className="mx-1 text-gray-400">·</span>{r.therapistName || '-'}</div>
                  <div className="text-xs text-gray-600 truncate">{r.lastMessage || ''}</div>
                </button>
              ))}
            </div>
            <div className="sm:col-span-2 flex flex-col">
              <div className="p-3 border-b text-sm text-gray-700">메시지</div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-500">메시지가 없습니다.</div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className="text-sm">
                    <div className="text-gray-500 mb-0.5">
                      <span className="font-medium text-gray-800">{m.senderName || '-'}</span>
                      <span className="ml-2 text-[11px]">{m.timestamp ? m.timestamp.toDate().toLocaleString('ko-KR') : ''}</span>
                    </div>
                    <div className="text-gray-900 whitespace-pre-wrap break-words">{m.message || ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
