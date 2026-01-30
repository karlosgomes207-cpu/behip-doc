/**
 * BeHip convertisseur-video-mpquality
 * - Barre de recherche URL → preview (iframe)
 * - Flèche ↓ → conversion ffmpeg.wasm + téléchargement
 * - Options : MP3 / MP4 / AVI, qualité basse / moyenne / haute
 */

(function () {
  'use strict';

  // --- Références DOM ---
  const urlInput = document.getElementById('urlInput');
  const btnLoad = document.getElementById('btnLoad');
  const urlError = document.getElementById('urlError');
  const previewPlaceholder = document.getElementById('previewPlaceholder');
  const previewIframe = document.getElementById('previewIframe');
  const downloadArrowWrap = document.getElementById('downloadArrowWrap');
  const btnDownload = document.getElementById('btnDownload');
  const formatSelect = document.getElementById('formatSelect');
  const qualitySelect = document.getElementById('qualitySelect');
  const progressSection = document.getElementById('progressSection');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const btnCancel = document.getElementById('btnCancel');
  const adsenseWrap = document.getElementById('adsenseWrap');

  // --- État ---
  let currentVideoUrl = null;      // URL source (lien YouTube, etc.)
  let currentEmbedUrl = null;      // URL iframe embed pour la preview
  let ffmpegLoaded = false;
  let ffmpeg = null;
  let cancelRequested = false;

  // Base URL de l'API (même origine en prod, ou /api en dev avec proxy)
  const API_BASE = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : '';

  /**
   * Détecte le type de plateforme et retourne l'URL d'embed pour la preview.
   * Retourne { embedUrl, videoId } ou null si non reconnu.
   */
  function parseVideoUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    if (!u) return null;

    // YouTube
    const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      return {
        type: 'youtube',
        videoId: ytMatch[1],
        embedUrl: 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=0',
      };
    }

    // Vimeo
    const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        videoId: vimeoMatch[1],
        embedUrl: 'https://player.vimeo.com/video/' + vimeoMatch[1],
      };
    }

    // TikTok (embed)
    const tiktokMatch = u.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    if (tiktokMatch) {
      return {
        type: 'tiktok',
        videoId: tiktokMatch[1],
        embedUrl: 'https://www.tiktok.com/embed/v2/' + tiktokMatch[1],
      };
    }

    // Instagram (embed limité)
    const igMatch = u.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
    if (igMatch) {
      return {
        type: 'instagram',
        videoId: igMatch[1],
        embedUrl: 'https://www.instagram.com/p/' + igMatch[1] + '/embed',
      };
    }

    return null;
  }

  function setUrlError(msg) {
    urlError.textContent = msg || '';
  }

  /**
   * Affiche la preview (iframe) et active la flèche quand la vidéo est "prête".
   * On considère prêt dès que l'embed est chargé (l'API sera appelée au clic sur la flèche).
   */
  function showPreview(embedUrl) {
    previewPlaceholder.classList.add('hidden');
    previewIframe.hidden = false;
    previewIframe.src = embedUrl;
    currentEmbedUrl = embedUrl;
    // La flèche s'active dès qu'on a une URL valide (l'extraction se fait au clic)
    downloadArrowWrap.classList.add('ready');
    downloadArrowWrap.setAttribute('aria-hidden', 'false');
  }

  function hidePreview() {
    previewIframe.src = '';
    previewIframe.hidden = true;
    previewPlaceholder.classList.remove('hidden');
    downloadArrowWrap.classList.remove('ready');
    downloadArrowWrap.setAttribute('aria-hidden', 'true');
    currentVideoUrl = null;
    currentEmbedUrl = null;
  }

  /**
   * Charge la preview à partir de l'URL saisie.
   */
  async function onLoad() {
    const url = urlInput.value.trim();
    setUrlError('');

    const parsed = parseVideoUrl(url);
    if (!parsed) {
      setUrlError('URL non reconnue. Utilisez un lien YouTube, Vimeo, TikTok ou Instagram.');
      hidePreview();
      return;
    }

    currentVideoUrl = url;
    showPreview(parsed.embedUrl);
  }

  /**
   * Récupère le flux vidéo/audio via l'API (même origine → pas de CORS).
   * L'API proxy le flux pour que le navigateur puisse le récupérer.
   */
  async function fetchVideoBlob(url, format) {
    const isAudio = format === 'mp3';
    const endpoint = API_BASE + '/api/get-video';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url, audioOnly: isAudio }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || err.message || 'Erreur lors de la récupération de la vidéo.');
    }

    return await res.blob();
  }

  /**
   * Initialise ffmpeg.wasm et retourne l'instance.
   */
  async function loadFfmpeg() {
    if (ffmpegLoaded && ffmpeg) return ffmpeg;

    if (typeof FFmpegWASM === 'undefined') {
      throw new Error('FFmpeg.wasm non chargé. Vérifiez la connexion ou le CDN.');
    }

    const { FFmpeg } = FFmpegWASM;
    const { fetchFile, toBlobURL } = FFmpegWASM;
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

    ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
      console.log('[ffmpeg]', message);
    });

    ffmpeg.on('progress', ({ progress, time }) => {
      if (progressSection && progressBar && progressText) {
        const pct = Math.round(progress * 100);
        progressBar.style.width = pct + '%';
        progressBar.setAttribute('aria-valuenow', pct);
        progressText.textContent = 'Conversion… ' + pct + '%';
      }
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(baseURL + '/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await toBlobURL(baseURL + '/ffmpeg-core.wasm', 'application/wasm'),
    });

    ffmpegLoaded = true;
    return ffmpeg;
  }

  /**
   * Convertit le blob source en format cible (mp3, mp4, avi) avec qualité.
   * Retourne un Blob du fichier converti.
   */
  async function convertWithFfmpeg(sourceBlob, format, quality) {
    const ff = await loadFfmpeg();
    cancelRequested = false;

    const audioRates = { low: '96k', medium: '128k', high: '192k' };
    const videoScale = { low: '480:-2', medium: '720:-2', high: '1080:-2' };
    const inputName = 'input.' + (format === 'mp3' ? 'mp4' : 'mp4');
    const outputName = 'output.' + format;

    const data = new Uint8Array(await sourceBlob.arrayBuffer());
    await ff.writeFile(inputName, data);

    if (format === 'mp3') {
      const rate = audioRates[quality] || '128k';
      await ff.exec(['-i', inputName, '-vn', '-acodec', 'libmp3lame', '-b:a', rate, '-y', outputName]);
    } else if (format === 'mp4') {
      const scale = videoScale[quality] || '720:-2';
      await ff.exec(['-i', inputName, '-vf', 'scale=' + scale, '-c:v', 'libx264', '-c:a', 'aac', '-y', outputName]);
    } else {
      const scale = videoScale[quality] || '720:-2';
      await ff.exec(['-i', inputName, '-vf', 'scale=' + scale, '-c:v', 'mpeg4', '-c:a', 'mp3', '-y', outputName]);
    }

    if (cancelRequested) throw new Error('Annulé');

    const outData = await ff.readFile(outputName);
    await ff.deleteFile(inputName);
    await ff.deleteFile(outputName);

    return new Blob([outData.buffer], { type: format === 'mp3' ? 'audio/mpeg' : (format === 'mp4' ? 'video/mp4' : 'video/x-msvideo') });
  }

  /**
   * Déclenche le téléchargement d'un Blob.
   */
  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /**
   * Clic sur la flèche : récupération → conversion → téléchargement.
   */
  async function onDownload() {
    if (!currentVideoUrl) return;

    const format = formatSelect.value;
    const quality = qualitySelect.value;

    progressSection.hidden = false;
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', 0);
    progressText.textContent = 'Récupération de la vidéo…';
    btnDownload.disabled = true;
    btnCancel.disabled = false;
    cancelRequested = false;

    try {
      // 1) Récupérer le flux via l'API
      progressText.textContent = 'Téléchargement de la source…';
      let sourceBlob = await fetchVideoBlob(currentVideoUrl, format);

      if (cancelRequested) throw new Error('Annulé');

      // 2) Charger ffmpeg et convertir
      progressText.textContent = 'Chargement de FFmpeg…';
      await loadFfmpeg();
      progressText.textContent = 'Conversion en cours…';
      const outBlob = await convertWithFfmpeg(sourceBlob, format, quality);

      if (cancelRequested) throw new Error('Annulé');

      // 3) Télécharger
      const ext = format;
      const name = 'behip-download.' + ext;
      downloadBlob(outBlob, name);

      progressText.textContent = 'Téléchargement terminé.';
      progressBar.style.width = '100%';
      progressBar.setAttribute('aria-valuenow', 100);

      // Cacher le bandeau AdSense après téléchargement (comme demandé)
      if (adsenseWrap) adsenseWrap.classList.add('hidden');

      // Reset après un court délai
      setTimeout(resetAll, 2000);
    } catch (e) {
      progressText.textContent = 'Erreur : ' + (e.message || 'Échec de la conversion.');
      progressBar.style.width = '0%';
      if (!cancelRequested) setUrlError(e.message || 'Erreur');
    } finally {
      btnDownload.disabled = false;
      btnCancel.disabled = true;
    }
  }

  function onCancel() {
    cancelRequested = true;
  }

  /**
   * Reset complet : preview, flèche, progression, réafficher AdSense.
   */
  function resetAll() {
    hidePreview();
    urlInput.value = '';
    setUrlError('');
    progressSection.hidden = true;
    progressBar.style.width = '0%';
    progressText.textContent = '';
    btnCancel.disabled = true;
    if (adsenseWrap) adsenseWrap.classList.remove('hidden');
  }

  // --- Événements ---
  btnLoad.addEventListener('click', onLoad);
  urlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') onLoad();
  });
  btnDownload.addEventListener('click', onDownload);
  btnCancel.addEventListener('click', onCancel);
})();
