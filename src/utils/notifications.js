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
export function getContextualNotificationMessage(type, { workoutFocus, courseName, topicName, codingLang, isRestDay, mealType, mealDesc, waterAmount } = {}) {
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
          ? `🏋️ Workout — ${workoutFocus}`
          : '🏋️ Workout — Time for your physical training block.',
      };

    case 'study':
      return {
        title: 'Study Reminder · Winter Arc',
        body: courseName
          ? `📚 Study time — ${courseName}${topicName ? `: ${topicName}` : ''}`
          : '📚 Study time — Open your books and begin your deep study block.',
      };

    case 'coding':
      return {
        title: 'Coding Session · Winter Arc',
        body: codingLang
          ? `💻 Coding session — ${codingLang}`
          : '💻 Coding practice — Time to write clean code and solve problems.',
      };

    case 'water':
      return {
        title: 'Hydration Check · Winter Arc',
        body: waterAmount
          ? `💧 Water reminder — Hydrate 250ml (${waterAmount} logged today).`
          : '💧 Water reminder — Drink a glass of water to keep energy high.',
      };

    case 'meals':
    case 'breakfast':
    case 'lunch':
    case 'dinner':
      const mName = mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : 'Meal';
      return {
        title: `${mName} Reminder · Winter Arc`,
        body: mealDesc ? `🍽️ ${mName} — ${mealDesc}` : `🍽️ Time for ${mName}. Fuel your body cleanly.`,
      };

    case 'activity':
      return {
        title: 'Activity Check · Winter Arc',
        body: '🚶 Activity reminder — Take a 15-minute walk to move closer to your steps goal.',
      };

    case 'journal':
      return {
        title: 'Evening Reflection · Winter Arc',
        body: '📝 Journal reminder — Take 2 minutes to review your day and log your wins.',
      };

    case 'sleep':
      return {
        title: 'Sleep Wind-Down · Winter Arc',
        body: '😴 Sleep reminder — Shut down screens and prepare for 8-hour regenerative sleep.',
      };

    case 'weekly':
      return {
        title: 'Weekly Review Due · Winter Arc',
        body: 'Sunday retrospective: review your workouts, study, and upcoming week focus.',
      };

    default:
      return {
        title: 'Winter Arc Reminder',
        body: '100 Days. One Version Better. Keep moving forward.',
      };
  }
}
