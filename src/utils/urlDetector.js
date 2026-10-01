/**
 * Instant Local URL and Platform Detector
 * Runs purely in browser client-side for zero-latency URL validation.
 */
export function detectUrlPlatform(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, platform: null, platformLabel: '', mediaType: null };
  }

  const clean = rawUrl.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    return { isValid: false, platform: null, platformLabel: '', mediaType: null };
  }

  try {
    const parsed = new URL(clean);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // YouTube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return {
        isValid: true,
        platform: 'youtube',
        platformLabel: '▶ YouTube',
        mediaType: 'video',
        cleanUrl: clean
      };
    }

    // Instagram
    if (host.includes('instagram.com')) {
      return {
        isValid: true,
        platform: 'instagram',
        platformLabel: '◎ Instagram',
        mediaType: 'video',
        cleanUrl: clean
      };
    }

    // Direct Audio Extensions
    if (['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac'].some(ext => pathname.endsWith(ext))) {
      return {
        isValid: true,
        platform: 'audio',
        platformLabel: '🎵 Direct Audio',
        mediaType: 'audio',
        cleanUrl: clean
      };
    }

    // Direct Video Extensions
    if (['.mp4', '.webm', '.mov', '.mkv', '.avi', '.m4v'].some(ext => pathname.endsWith(ext))) {
      return {
        isValid: true,
        platform: 'video',
        platformLabel: '▣ Direct Video',
        mediaType: 'video',
        cleanUrl: clean
      };
    }

    // Creative Commons / Open Archives
    if (host.includes('archive.org') || host.includes('wikimedia.org') || host.includes('creativecommons.org')) {
      const isAudio = pathname.endsWith('.mp3') || pathname.endsWith('.m4a') || pathname.endsWith('.ogg') || pathname.includes('audio');
      return {
        isValid: true,
        platform: isAudio ? 'audio' : 'video',
        platformLabel: isAudio ? '🎵 Direct Audio' : '▣ Direct Video',
        mediaType: isAudio ? 'audio' : 'video',
        cleanUrl: clean
      };
    }

    // Any other valid HTTP/HTTPS link
    return {
      isValid: true,
      platform: 'web',
      platformLabel: '🌐 Web Media',
      mediaType: 'video',
      cleanUrl: clean
    };
  } catch (e) {
    return { isValid: false, platform: null, platformLabel: '', mediaType: null };
  }
}
