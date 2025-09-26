'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, orderBy, query, updateDoc, doc, serverTimestamp, where, getDoc, setDoc, limit, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface MatchingRow {
  id: string;
  parentId: string;
  parentName?: string;
  therapistId: string;
  therapistName?: string;
  status: 'active' | 'meeting' | 'completed' | 'pending' | 'cancelled';
  createdAt?: Timestamp;
}

interface ChatRow {
  id: string;
  parentId: string;
  parentName?: string;
  therapistId: string;
  therapistName?: string;
  status: 'active' | 'closed' | 'archived' | string;
  lastMessageTime?: Timestamp;
}

interface ChatMessage {
  id: string;
  senderName: string;
  senderType: 'parent' | 'therapist' | string;
  message: string;
  timestamp?: Timestamp;
}

interface MatchingDoc {
  parentId: string;
  therapistId: string;
  status?: string;
  createdAt?: Timestamp;
}

interface ChatDoc {
  parentId: string;
  therapistId: string;
  status?: string;
  lastMessageTime?: Timestamp;
}

interface MessageDoc {
  senderName?: string;
  senderType?: 'parent' | 'therapist' | string;
  message?: string;
  timestamp?: Timestamp;
}

interface UserDoc { name?: string }

export default function AdminMatchingPage() {
  const { userData, currentUser } = useAuth();
  const isWhitelistedAdminEmail = currentUser?.email === 'dudals7334@naver.com' || currentUser?.email === 'everystars@naver.com';
  const isPageAdmin = !!(userData?.userType === 'admin' || isWhitelistedAdminEmail);
  const [rows, setRows] = useState<MatchingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'meeting' | 'completed'>('all');
  const [searchText, setSearchText] = useState('');
  const [chatRows, setChatRows] = useState<ChatRow[]>([]);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatRow | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatMessagesLoading, setChatMessagesLoading] = useState(false);
  const [markingFromChat, setMarkingFromChat] = useState(false);

  useEffect(() => {
    // 관리자만 접근 (간단 가드 - 이메일 화이트리스트 포함)
    if (!isPageAdmin) return;
    const q = query(
      collection(db, 'matchings'),
      where('status', 'in', ['active', 'meeting', 'completed']),
      orderBy('status'),
      orderBy('createdAt', 'desc')
    );
    const un = onSnapshot(q, async (snap) => {
      const list: MatchingRow[] = [];
      for (const d of snap.docs) {
        const data = d.data() as MatchingDoc;
        let parentName: string | undefined;
        let therapistName: string | undefined;
        try {
          if (data.parentId) {
            const p = await getDoc(doc(db, 'users', data.parentId));
            parentName = p.exists() ? (p.data() as UserDoc).name : undefined;
          }
          if (data.therapistId) {
            const t = await getDoc(doc(db, 'users', data.therapistId));
            therapistName = t.exists() ? (t.data() as UserDoc).name : undefined;
          }
        } catch {}
        list.push({
          id: d.id,
          parentId: data.parentId,
          parentName,
          therapistId: data.therapistId,
          therapistName,
          status: (data.status as MatchingRow['status']) || 'active',
          createdAt: data.createdAt
        });
      }
      setRows(list);
      setLoading(false);
    });
    return () => un();
  }, [isPageAdmin]);

  // 현재 1:1 채팅중 목록
  useEffect(() => {
    if (!isPageAdmin) return;
    const q = query(
      collection(db, 'chats'),
      where('status', '==', 'active'),
      orderBy('lastMessageTime', 'desc')
    );
    const un = onSnapshot(q, async (snap) => {
      const list: ChatRow[] = [];
      for (const d of snap.docs) {
        const data = d.data() as ChatDoc;
        let parentName: string | undefined;
        let therapistName: string | undefined;
        try {
          if (data.parentId) {
            const p = await getDoc(doc(db, 'users', data.parentId));
            parentName = p.exists() ? (p.data() as UserDoc).name : undefined;
          }
          if (data.therapistId) {
            const t = await getDoc(doc(db, 'users', data.therapistId));
            therapistName = t.exists() ? (t.data() as UserDoc).name : undefined;
          }
        } catch {}
        list.push({
          id: d.id,
          parentId: data.parentId,
          parentName,
          therapistId: data.therapistId,
          therapistName,
          status: (data.status as ChatRow['status']) || 'active',
          lastMessageTime: data.lastMessageTime
        });
      }
      setChatRows(list);
    });
    return () => un();
  }, [isPageAdmin]);

  // 선택한 채팅 메시지 실시간 미리보기
  useEffect(() => {
    if (!isPageAdmin || !selectedChat || !chatModalOpen) return;
    setChatMessagesLoading(true);
    const q = query(
      collection(db, 'chats', selectedChat.id, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const un = onSnapshot(q, (snap) => {
      const list: ChatMessage[] = [];
      snap.forEach((d) => {
        const data = d.data() as MessageDoc;
        list.push({
          id: d.id,
          senderName: data.senderName || '',
          senderType: data.senderType || 'parent',
          message: data.message || '',
          timestamp: data.timestamp
        });
      });
      // 시간 오름차순으로 보여주기 위해 역순 정렬
      setChatMessages(list.reverse());
      setChatMessagesLoading(false);
    });
    return () => un();
  }, [isPageAdmin, selectedChat, chatModalOpen]);

  const markCompletedFromChat = async () => {
    if (!selectedChat) return;
    try {
      setMarkingFromChat(true);
      // parentId 기준으로 조회 후 클라이언트에서 필터(인덱스 회피)
      const q = query(collection(db, 'matchings'), where('parentId', '==', selectedChat.parentId));
      const snap = await getDocs(q);
      const candidates = snap.docs.filter((d) => {
        const data = d.data() as MatchingDoc;
        return data.therapistId === selectedChat.therapistId && (data.status === 'active' || data.status === 'meeting');
      });
      let matchingId: string;
      if (candidates.length === 0) {
        // 없으면 새 매칭 생성 후 바로 완료 처리
        const created = await addDoc(collection(db, 'matchings'), {
          parentId: selectedChat.parentId,
          therapistId: selectedChat.therapistId,
          status: 'completed',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        matchingId = created.id;
      } else {
        const mDoc = candidates[0];
        matchingId = mDoc.id;
        await updateDoc(doc(db, 'matchings', matchingId), {
          status: 'completed',
          updatedAt: serverTimestamp()
        });
      }
      const key = `${selectedChat.parentId}_${selectedChat.therapistId}`;
      await setDoc(doc(db, 'successful-matches', key), {
        postId: matchingId,
        parentId: selectedChat.parentId,
        therapistId: selectedChat.therapistId,
        matchedAt: serverTimestamp(),
        status: 'completed'
      }, { merge: true });
      alert('매칭을 완료로 표시했습니다.');
      setChatModalOpen(false);
    } catch (e) {
      console.error('채팅 모달에서 매칭 완료 처리 실패:', e);
      alert('매칭 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setMarkingFromChat(false);
    }
  };

  const markCompleted = async (m: MatchingRow) => {
    try {
      await updateDoc(doc(db, 'matchings', m.id), {
        status: 'completed',
        updatedAt: serverTimestamp()
      });
      // 성공 매칭 기록 업서트
      const key = `${m.parentId}_${m.therapistId}`;
      await setDoc(doc(db, 'successful-matches', key), {
        postId: m.id,
        parentId: m.parentId,
        therapistId: m.therapistId,
        matchedAt: serverTimestamp(),
        status: 'completed'
      }, { merge: true });
      alert('매칭을 완료로 표시했습니다.');
    } catch (e) {
      console.error('매칭 완료 처리 실패:', e);
      alert('매칭 완료 처리 중 오류가 발생했습니다.');
    }
  };

  if (!isPageAdmin) {
  return (
      <div className="p-6">
        <h1 className="text-xl font-bold">접근 권한이 없습니다.</h1>
        <Link href="/">홈으로</Link>
    </div>
    );
  }

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">매칭 관리</h1>
        <div className="text-sm text-gray-500">총 {rows.length}건</div>
      </div>

      <div className="bg-white border rounded-lg mb-4 p-4 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'meeting' | 'completed')}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">전체</option>
          <option value="active">active</option>
          <option value="meeting">meeting</option>
          <option value="completed">completed</option>
        </select>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="학부모/치료사 이름 또는 ID 검색"
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <button onClick={() => { setStatusFilter('all'); setSearchText(''); }} className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50">초기화</button>
      </div>

      {loading ? (
        null
      ) : (
        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">매칭ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학부모</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">치료사</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows
                .filter((m) => (statusFilter === 'all' ? true : m.status === statusFilter))
                .filter((m) => {
                  if (!searchText.trim()) return true;
                  const target = `${m.id} ${m.parentName || ''} ${m.parentId} ${m.therapistName || ''} ${m.therapistId}`.toLowerCase();
                  return target.includes(searchText.toLowerCase());
                })
                .map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{m.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.parentName || m.parentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{m.therapistName || m.therapistId}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs border ${m.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : m.status === 'meeting' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.status !== 'completed' && (
                      <button onClick={() => markCompleted(m)} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">매칭 완료</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 현재 1:1 채팅중 목록 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">현재 1:1 채팅중</h2>
          <span className="text-sm text-gray-500">총 {chatRows.length}건</span>
        </div>
        <div className="overflow-x-auto bg-white border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">채팅ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">학부모</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">치료사</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chatRows.map((c) => (
                <tr key={c.id} onClick={() => { setSelectedChat(c); setChatModalOpen(true); }} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-sm text-gray-900">{c.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.parentName || c.parentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{c.therapistName || c.therapistId}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200">{c.status}</span>
                  </td>
                </tr>
              ))}
              {chatRows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={4}>현재 진행 중인 1:1 채팅이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* 채팅 미리보기 모달 */}
      {chatModalOpen && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div>
                <h3 className="text-lg font-semibold">채팅 미리보기</h3>
                <p className="text-sm text-gray-500">{selectedChat.parentName || selectedChat.parentId} · {selectedChat.therapistName || selectedChat.therapistId}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={markCompletedFromChat} disabled={markingFromChat} className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{markingFromChat ? '처리 중…' : '매칭 완료'}</button>
                <button onClick={() => setChatModalOpen(false)} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">닫기</button>
              </div>
            </div>
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
              {chatMessagesLoading ? (
                <div className="text-sm text-gray-500">메시지를 불러오는 중…</div>
              ) : chatMessages.length === 0 ? (
                <div className="text-sm text-gray-500">메시지가 없습니다.</div>
              ) : (
                chatMessages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    <div className={`px-2 py-1 text-xs rounded-full border ${m.senderType === 'therapist' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>{m.senderType === 'therapist' ? '치료사' : m.senderType === 'parent' ? '학부모' : m.senderType}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{m.senderName || (m.senderType === 'therapist' ? '치료사' : '학부모')}</div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">{m.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
