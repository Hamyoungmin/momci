// 브라우저 알림 시스템
// 채팅 신청, 첫 응답 등의 알림을 관리합니다

// 알림 타입 정의
export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    type: 'chat_request' | 'first_response' | 'new_message';
    chatRoomId?: string;
    senderId?: string;
    senderName?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

// 알림 권한 상태 확인
export function checkNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    console.warn('🚫 이 브라우저는 알림을 지원하지 않습니다');
    return 'denied';
  }
  
  return Notification.permission;
}

/**
 * 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('🚫 이 브라우저는 알림을 지원하지 않습니다');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    console.log('✅ 알림 권한이 이미 허용됨');
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    console.log('❌ 알림 권한이 차단됨');
    return 'denied';
  }

  try {
    console.log('📋 알림 권한 요청 중...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ 알림 권한 허용됨');
    } else {
      console.log('❌ 알림 권한 거부됨');
    }
    
    return permission;
  } catch (error) {
    console.error('❌ 알림 권한 요청 실패:', error);
    return 'denied';
  }
}

/**
 * 브라우저 알림 표시
 */
export async function showBrowserNotification(notificationData: NotificationData): Promise<Notification | null> {
  const permission = await requestNotificationPermission();
  
  if (permission !== 'granted') {
    console.log('🚫 알림 권한이 없어 알림을 표시할 수 없습니다');
    return null;
  }

  try {
    console.log('📢 알림 표시:', notificationData.title);
    
    const notification = new Notification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/favicon.ico',
      badge: notificationData.badge || '/favicon.ico',
      tag: notificationData.tag || 'default',
      data: notificationData.data || {},
      requireInteraction: true // 사용자가 상호작용할 때까지 유지
    });

    // 알림 클릭 이벤트
    notification.onclick = () => {
      console.log('🖱️ 알림 클릭됨:', notificationData);
      
      // 브라우저 창을 포커스
      window.focus();
      
      // 알림 닫기
      notification.close();
      
      // 커스텀 이벤트 발생 (다른 컴포넌트에서 감지할 수 있도록)
      const customEvent = new CustomEvent('notificationClick', {
        detail: notificationData.data
      });
      window.dispatchEvent(customEvent);
    };

    // 5초 후 자동으로 닫기
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error('❌ 알림 표시 실패:', error);
    return null;
  }
}

/**
 * 채팅 신청 알림 (치료사에게)
 */
export async function notifyChatRequest(
  therapistName: string,
  parentName: string,
  chatRoomId: string
): Promise<void> {
  const notificationData: NotificationData = {
    title: '💬 새로운 채팅 요청',
    body: `${parentName} 학부모님이 채팅을 요청했습니다`,
    icon: '/favicon.ico',
    tag: `chat_request_${chatRoomId}`,
    data: {
      type: 'chat_request',
      chatRoomId,
      senderId: 'parent',
      senderName: parentName
    }
  };

  const notification = await showBrowserNotification(notificationData);
  
  if (notification) {
    console.log('📢 채팅 신청 알림 전송 완료:', therapistName);
  }
}

/**
 * 첫 응답 알림 (학부모에게)
 */
export async function notifyFirstResponse(
  parentName: string,
  therapistName: string,
  chatRoomId: string,
  message: string
): Promise<void> {
  const notificationData: NotificationData = {
    title: `💬 ${therapistName} 치료사님의 답변`,
    body: message.length > 50 ? message.substring(0, 50) + '...' : message,
    icon: '/favicon.ico',
    tag: `first_response_${chatRoomId}`,
    data: {
      type: 'first_response',
      chatRoomId,
      senderId: 'therapist',
      senderName: therapistName
    }
  };

  const notification = await showBrowserNotification(notificationData);
  
  if (notification) {
    console.log('📢 첫 응답 알림 전송 완료:', parentName);
  }
}

/**
 * 새 메시지 알림
 */
export async function notifyNewMessage(
  receiverName: string,
  senderName: string,
  senderType: 'parent' | 'therapist',
  chatRoomId: string,
  message: string
): Promise<void> {
  const senderTitle = senderType === 'parent' ? '학부모' : '치료사';
  
  const notificationData: NotificationData = {
    title: `💬 ${senderName} ${senderTitle}님의 메시지`,
    body: message.length > 50 ? message.substring(0, 50) + '...' : message,
    icon: '/favicon.ico',
    tag: `message_${chatRoomId}`,
    data: {
      type: 'new_message',
      chatRoomId,
      senderId: senderType,
      senderName
    }
  };

  const notification = await showBrowserNotification(notificationData);
  
  if (notification) {
    console.log('📢 새 메시지 알림 전송 완료:', receiverName);
  }
}

/**
 * 알림 클릭 이벤트 리스너 등록
 */
export function setupNotificationClickListener(
  onChatRequest: (data: NotificationData) => void,
  onFirstResponse: (data: NotificationData) => void,
  onNewMessage: (data: NotificationData) => void
): () => void {
  const handleNotificationClick = (event: CustomEvent) => {
    const data = event.detail;
    
    console.log('📱 알림 클릭 이벤트 수신:', data);
    
    switch (data.type) {
      case 'chat_request':
        onChatRequest(data);
        break;
      case 'first_response':
        onFirstResponse(data);
        break;
      case 'new_message':
        onNewMessage(data);
        break;
      default:
        console.log('알 수 없는 알림 타입:', data.type);
    }
  };

  // 이벤트 리스너 등록
  window.addEventListener('notificationClick', handleNotificationClick as EventListener);
  
  // 정리 함수 반환
  return () => {
    window.removeEventListener('notificationClick', handleNotificationClick as EventListener);
  };
}

/**
 * 페이지 비활성화 상태 확인
 */
export function isPageHidden(): boolean {
  return document.hidden || document.visibilityState === 'hidden';
}

/**
 * 페이지가 비활성화되었을 때만 알림 표시
 */
export async function showNotificationIfHidden(notificationData: NotificationData): Promise<Notification | null> {
  if (isPageHidden()) {
    return await showBrowserNotification(notificationData);
  } else {
    console.log('📱 페이지가 활성 상태이므로 알림을 표시하지 않습니다');
    return null;
  }
}

/**
 * 초기 알림 권한 체크 및 안내
 */
export async function initializeNotifications(): Promise<boolean> {
  const permission = checkNotificationPermission();
  
  if (permission === 'default') {
    console.log('📋 알림 권한이 설정되지 않음 - 사용자에게 요청 필요');
    return false;
  }
  
  if (permission === 'denied') {
    console.log('❌ 알림 권한이 차단됨');
    return false;
  }
  
  if (permission === 'granted') {
    console.log('✅ 알림 권한 허용됨 - 알림 시스템 준비 완료');
    return true;
  }
  
  return false;
}
