// Smart Browser Notification Service for Winter Arc
// Rule 1: Never request permission on initial page load
// Rule 2: Max 1 notification per activity per day
// Rule 3: Contextual messages based on real user configuration

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return { supported: false, status: 'unsupported' };
  }
  try {
    const permission = await Notification.requestPermission();
    return { supported: true, status: permission };
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return { supported: true, status: 'denied' };
  }
}

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
}

export function sendContextualNotification(title, options = {}) {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-192x192.svg',
      body: options.body || '',
      tag: options.tag || 'winter-arc-reminder',
      renotify: false,
      silent: false,
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
    return false;
  }
}

// Generate Contextual Messages based on today's real schedule
export function getContextualNotificationMessage(type, { workoutFocus, courseName, topicName, codingLang, isRestDay } = {}) {
  switch (type) {
    case 'workout':
      if (isRestDay) {
        return {
          title: 'Recovery Day · Winter Arc',
          body: 'No heavy workout scheduled today. Focus on mobility, hydration, and active recovery.',
        };
      }
      return {
        title: 'Workout Reminder · Winter Arc',
        body: workoutFocus
          ? `Today's workout: ${workoutFocus}. Ready to train?`
          : 'Time for your daily workout session. Stay disciplined.',
      };

    case 'study':
      return {
        title: 'Deep Study Block · Winter Arc',
        body: courseName
          ? `Today's study: ${courseName}${topicName ? ` — ${topicName}` : ''}. Deep focus starts now.`
          : 'Time for your daily study block. Build your knowledge.',
      };

    case 'coding':
      return {
        title: 'Coding Session · Winter Arc',
        body: codingLang
          ? `Today's coding session: ${codingLang}. Ready to write clean code?`
          : 'Time for daily coding practice. Solve problems and commit.',
      };

    case 'habits':
      return {
        title: 'Habit Checkpoint · Winter Arc',
        body: 'Check in on your daily non-negotiables. Don\'t break the chain.',
      };

    case 'journal':
      return {
        title: 'Evening Reflection · Winter Arc',
        body: 'Take 2 minutes to review your day, celebrate wins, and prepare for tomorrow.',
      };

    case 'sleep':
      return {
        title: 'Sleep Wind-Down · Winter Arc',
        body: 'Time to disconnect screens and prepare for 8-hour regenerative sleep.',
      };

    case 'weekly':
      return {
        title: 'Weekly Review Due · Winter Arc',
        body: 'Sunday retrospective: assess your workouts, study hours, habits, and next week\'s priorities.',
      };

    default:
      return {
        title: 'Winter Arc Reminder',
        body: '100 Days. One Version Better. Keep moving forward.',
      };
  }
}
