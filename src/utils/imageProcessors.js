/**
 * Performs fast Hermite resampling (pixel-weighted bilinear curve scaling)
 * to keep text and fine lines sharp when resizing, preventing blurry details.
 */
export function resampleHermite(sourceCanvas, targetWidth, targetHeight) {
  const W = sourceCanvas.width;
  const H = sourceCanvas.height;
  const W2 = targetWidth;
  const H2 = targetHeight;
  
  const ctxSrc = sourceCanvas.getContext('2d');
  const img = ctxSrc.getImageData(0, 0, W, H);
  const data = img.data;
  
  const destCanvas = document.createElement('canvas');
  destCanvas.width = W2;
  destCanvas.height = H2;
  const ctxDest = destCanvas.getContext('2d');
  const img2 = ctxDest.createImageData(W2, H2);
  const data2 = img2.data;
  
  const ratio_w = W / W2;
  const ratio_h = H / H2;
  const ratio_w_half = Math.ceil(ratio_w / 2);
  const ratio_h_half = Math.ceil(ratio_h / 2);

  for (let j = 0; j < H2; j++) {
    for (let i = 0; i < W2; i++) {
      const x2 = (i + 0.5) * ratio_w - 0.5;
      const y2 = (j + 0.5) * ratio_h - 0.5;
      const xc = Math.floor(x2);
      const yc = Math.floor(y2);
      
      let a_sum = 0, r_sum = 0, g_sum = 0, b_sum = 0;
      let weights_sum = 0;

      for (let y = yc - ratio_h_half; y <= yc + ratio_h_half; y++) {
        if (y < 0 || y >= H) continue;
        const dy = y - y2;
        const weight_y = 2 * Math.abs(dy) * Math.abs(dy) * Math.abs(dy) - 3 * dy * dy + 1;
        if (weight_y <= 0) continue;

        for (let x = xc - ratio_w_half; x <= xc + ratio_w_half; x++) {
          if (x < 0 || x >= W) continue;
          const dx = x - x2;
          const weight_x = 2 * Math.abs(dx) * Math.abs(dx) * Math.abs(dx) - 3 * dx * dx + 1;
          const weight = weight_x * weight_y;
          if (weight <= 0) continue;

          const src_idx = (y * W + x) * 4;
          r_sum += data[src_idx] * weight;
          g_sum += data[src_idx + 1] * weight;
          b_sum += data[src_idx + 2] * weight;
          a_sum += data[src_idx + 3] * weight;
          weights_sum += weight;
        }
      }

      const dest_idx = (j * W2 + i) * 4;
      if (weights_sum > 0) {
        data2[dest_idx] = Math.round(r_sum / weights_sum);
        data2[dest_idx + 1] = Math.round(g_sum / weights_sum);
        data2[dest_idx + 2] = Math.round(b_sum / weights_sum);
        data2[dest_idx + 3] = Math.round(a_sum / weights_sum);
      } else {
        data2[dest_idx] = 0;
        data2[dest_idx + 1] = 0;
        data2[dest_idx + 2] = 0;
        data2[dest_idx + 3] = 0;
      }
    }
  }
  
  ctxDest.putImageData(img2, 0, 0);
  return destCanvas;
}

/**
 * Helper to render an HTMLImageElement to an offscreen canvas at native size.
 */
function imageToCanvas(imageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(imageElement, 0, 0);
  }
  return canvas;
}

/**
 * Extracts a palette of dominant colors from the input image.
 * Uses a tiny temporary canvas to read downscaled pixel data.
 */
export function extractDominantColors(imageElement, maxColors = 4) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (!ctx) return ['#d4af37', '#0f0f15', '#facc15', '#a855f7'];
    
    ctx.drawImage(imageElement, 0, 0, 10, 10);
    const data = ctx.getImageData(0, 0, 10, 10).data;
    
    const colors = [];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      const a = data[i+3];
      if (a < 50) continue; // ignore transparent
      colors.push(`rgb(${r},${g},${b})`);
    }
    
    const uniqueColors = Array.from(new Set(colors));
    if (uniqueColors.length === 0) {
      return ['#d4af37', '#0f0f15', '#facc15', '#a855f7'];
    }
    
    const selected = [];
    const step = Math.max(1, Math.floor(uniqueColors.length / maxColors));
    for (let i = 0; i < uniqueColors.length && selected.length < maxColors; i += step) {
      selected.push(uniqueColors[i]);
    }
    
    // Fill up to maxColors if not enough unique colors
    while (selected.length < maxColors) {
      selected.push(selected[0] || '#d4af37');
    }
    
    return selected;
  } catch (err) {
    console.error("Dominant color extraction failed", err);
    return ['#d4af37', '#0f0f15', '#facc15', '#a855f7'];
  }
}

/**
 * Shared logic to draw canvas backgrounds including standard blurs and generative AI styles.
 */
function drawBackground(ctx, canvas, imageElement, width, height, bgType, bgColor, aiStyle = 'mirror', aiPrompt = '', aiGeneratedImageElement = null) {
  const wOrig = imageElement.naturalWidth || imageElement.width;
  const hOrig = imageElement.naturalHeight || imageElement.height;
  const arOrig = wOrig / hOrig;
  const arTarget = width / height;

  if (bgType === 'blur') {
    let coverScale;
    if (arOrig > arTarget) {
      coverScale = height / hOrig;
    } else {
      coverScale = width / wOrig;
    }

    const scaleFactor = 1.1;
    const wCover = wOrig * coverScale * scaleFactor;
    const hCover = hOrig * coverScale * scaleFactor;
    const xCover = (width - wCover) / 2;
    const yCover = (height - hCover) / 2;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';
    ctx.filter = `blur(${Math.max(15, Math.round(Math.min(width, height) * 0.04))}px)`;
    ctx.drawImage(imageElement, xCover, yCover, wCover, hCover);
    ctx.restore();
  } else if (bgType === 'ai') {
    if (aiGeneratedImageElement) {
      ctx.save();
      const wAI = aiGeneratedImageElement.naturalWidth || aiGeneratedImageElement.width || 800;
      const hAI = aiGeneratedImageElement.naturalHeight || aiGeneratedImageElement.height || 800;
      const arAI = wAI / hAI;
      let coverScale;
      if (arAI > arTarget) {
        coverScale = height / hAI;
      } else {
        coverScale = width / wAI;
      }
      const wCover = wAI * coverScale;
      const hCover = hAI * coverScale;
      const xCover = (width - wCover) / 2;
      const yCover = (height - hCover) / 2;
      ctx.drawImage(aiGeneratedImageElement, xCover, yCover, wCover, hCover);
      ctx.restore();
    } else {
      const style = (aiStyle || 'mirror').toLowerCase();
    
    if (style === 'mirror') {
      let coverScale;
      if (arOrig > arTarget) {
        coverScale = height / hOrig;
      } else {
        coverScale = width / wOrig;
      }

      const wCover = wOrig * coverScale;
      const hCover = hOrig * coverScale;
      const xCover = (width - wCover) / 2;
      const yCover = (height - hCover) / 2;

      ctx.save();
      ctx.drawImage(imageElement, xCover, yCover, wCover, hCover);

      ctx.globalAlpha = 0.55;
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(imageElement, xCover, yCover, wCover, hCover);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.translate(0, height);
      ctx.scale(1, -1);
      ctx.drawImage(imageElement, xCover, yCover, wCover, hCover);
      ctx.restore();

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
      ctx.filter = `blur(${Math.max(12, Math.round(Math.min(width, height) * 0.02))}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    } else if (style === 'ambient') {
      const colors = extractDominantColors(imageElement, 4);
      ctx.save();
      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, width, height);

      const radius = Math.max(width, height) * 0.8;
      
      let grad1 = ctx.createRadialGradient(0, 0, 50, 0, 0, radius);
      grad1.addColorStop(0, colors[0].replace('rgb', 'rgba').replace(')', ', 0.35)'));
      grad1.addColorStop(1, 'rgba(8,8,12,0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      let grad2 = ctx.createRadialGradient(width, height, 50, width, height, radius);
      grad2.addColorStop(0, colors[1].replace('rgb', 'rgba').replace(')', ', 0.3)'));
      grad2.addColorStop(1, 'rgba(8,8,12,0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      let grad3 = ctx.createRadialGradient(width, 0, 50, width, 0, radius);
      grad3.addColorStop(0, colors[2].replace('rgb', 'rgba').replace(')', ', 0.25)'));
      grad3.addColorStop(1, 'rgba(8,8,12,0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      let gradCenter = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, radius * 0.6);
      gradCenter.addColorStop(0, colors[3].replace('rgb', 'rgba').replace(')', ', 0.15)'));
      gradCenter.addColorStop(1, 'rgba(8,8,12,0)');
      ctx.fillStyle = gradCenter;
      ctx.fillRect(0, 0, width, height);
      
      ctx.restore();
    } else if (style === 'gilded') {
      const colors = extractDominantColors(imageElement, 3);
      ctx.save();
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, width, height);

      let grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(15, 15, 18, 0.98)');
      grad.addColorStop(0.3, colors[0].replace('rgb', 'rgba').replace(')', ', 0.25)'));
      grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.12)'); 
      grad.addColorStop(1, 'rgba(24, 20, 10, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
      ctx.lineWidth = 1.5;
      for (let y = 20; y < height; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    } else if (style === 'neon') {
      const colors = extractDominantColors(imageElement, 3);
      ctx.save();
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      let grad1 = ctx.createRadialGradient(0, height, 10, 0, height, Math.max(width, height) * 0.75);
      grad1.addColorStop(0, colors[0].replace('rgb', 'rgba').replace(')', ', 0.4)')); 
      grad1.addColorStop(1, 'rgba(5,5,8,0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      let grad2 = ctx.createRadialGradient(width, 0, 10, width, 0, Math.max(width, height) * 0.75);
      grad2.addColorStop(0, colors[1].replace('rgb', 'rgba').replace(')', ', 0.4)')); 
      grad2.addColorStop(1, 'rgba(5,5,8,0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = Math.max(24, Math.round(width * 0.045));
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.save();
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 120;
    noiseCanvas.height = 120;
    const noiseCtx = noiseCanvas.getContext('2d');
    const noiseData = noiseCtx.createImageData(120, 120);
    
    let grainOpacity = 12; 
    const promptLower = (aiPrompt || '').toLowerCase();
    if (promptLower.includes('grain') || promptLower.includes('matte') || promptLower.includes('noise')) {
      grainOpacity = 24; 
    } else if (promptLower.includes('clean') || promptLower.includes('studio') || promptLower.includes('smooth')) {
      grainOpacity = 6;  
    }
    
    for (let p = 0; p < noiseData.data.length; p += 4) {
      const val = Math.floor(Math.random() * 15);
      noiseData.data[p] = val;
      noiseData.data[p + 1] = val;
      noiseData.data[p + 2] = val;
      noiseData.data[p + 3] = grainOpacity;
    }
    noiseCtx.putImageData(noiseData, 0, 0);
    ctx.fillStyle = ctx.createPattern(noiseCanvas, 'repeat');
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    }
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }
}

/**
 * Resizes an image to the exact target size using a Canvas.
 * Matches aspect ratio by applying contain logic and filling the leftover margins
 * with either a blurred, scaled-up cover background, AI generated backdrop, or a solid color.
 */
export function resizeImage(
  imageElement, 
  targetWidth, 
  targetHeight, 
  bgType = 'blur', 
  bgColor = '#ffffff', 
  ultraClarity = true,
  clarityEngine = 'hermite', // 'bicubic' | 'hermite' | 'pixelated'
  aiStyle = 'mirror',
  aiPrompt = '',
  aiGeneratedImageElement = null,
  sizingMode = 'fit'
) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;

  // Configure scaling quality based on choice
  if (clarityEngine === 'pixelated') {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = ultraClarity ? 'high' : 'medium';
  }

  const wOrig = imageElement.naturalWidth || imageElement.width;
  const hOrig = imageElement.naturalHeight || imageElement.height;
  const arOrig = wOrig / hOrig;
  const arTarget = targetWidth / targetHeight;

  // 1. Draw Background
  drawBackground(ctx, canvas, imageElement, targetWidth, targetHeight, bgType, bgColor, aiStyle, aiPrompt, aiGeneratedImageElement);

  // 2. Draw Image based on Sizing Mode
  let drawW, drawH, drawX, drawY;

  if (sizingMode === 'fill' || sizingMode === 'enlarge_to_frame') {
    let scale;
    if (arOrig > arTarget) {
      scale = targetHeight / hOrig;
    } else {
      scale = targetWidth / wOrig;
    }
    drawW = Math.round(wOrig * scale);
    drawH = Math.round(hOrig * scale);
    drawX = Math.round((targetWidth - drawW) / 2);
    drawY = Math.round((targetHeight - drawH) / 2);
  } else if (sizingMode === 'stretch') {
    drawW = targetWidth;
    drawH = targetHeight;
    drawX = 0;
    drawY = 0;
  } else if (sizingMode === 'background_stretch') {
    if (wOrig <= targetWidth && hOrig <= targetHeight) {
      drawW = wOrig;
      drawH = hOrig;
      drawX = Math.round((targetWidth - wOrig) / 2);
      drawY = Math.round((targetHeight - hOrig) / 2);
    } else {
      let scale;
      if (arOrig > arTarget) {
        scale = targetWidth / wOrig;
      } else {
        scale = targetHeight / hOrig;
      }
      drawW = Math.round(wOrig * scale);
      drawH = Math.round(hOrig * scale);
      drawX = Math.round((targetWidth - drawW) / 2);
      drawY = Math.round((targetHeight - drawH) / 2);
    }
  } else {
    let scale;
    if (arOrig > arTarget) {
      scale = targetWidth / wOrig;
    } else {
      scale = targetHeight / hOrig;
    }
    drawW = Math.round(wOrig * scale);
    drawH = Math.round(hOrig * scale);
    drawX = Math.round((targetWidth - drawW) / 2);
    drawY = Math.round((targetHeight - drawH) / 2);
  }

  if (clarityEngine === 'hermite') {
    const srcCanvas = imageToCanvas(imageElement);
    const resampledCanvas = resampleHermite(srcCanvas, drawW, drawH);
    ctx.drawImage(resampledCanvas, drawX, drawY, drawW, drawH);
  } else {
    ctx.drawImage(imageElement, drawX, drawY, drawW, drawH);
  }

  return canvas;
}

/**
 * Creates a lightweight canvas preview of the resized image.
 */
export function resizeImagePreview(
  imageElement, 
  targetWidth, 
  targetHeight, 
  maxPreviewSize = 300, 
  bgType = 'blur', 
  bgColor = '#ffffff', 
  ultraClarity = true,
  clarityEngine = 'hermite',
  aiStyle = 'mirror',
  aiPrompt = '',
  aiGeneratedImageElement = null,
  sizingMode = 'fit'
) {
  let previewScale = 1;
  if (targetWidth > maxPreviewSize || targetHeight > maxPreviewSize) {
    if (targetWidth > targetHeight) {
      previewScale = maxPreviewSize / targetWidth;
    } else {
      previewScale = maxPreviewSize / targetHeight;
    }
  }

  const pWidth = Math.round(targetWidth * previewScale);
  const pHeight = Math.round(targetHeight * previewScale);

  const canvas = document.createElement('canvas');
  canvas.width = pWidth;
  canvas.height = pHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  if (clarityEngine === 'pixelated') {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = ultraClarity ? 'high' : 'medium';
  }

  const wOrig = imageElement.naturalWidth || imageElement.width;
  const hOrig = imageElement.naturalHeight || imageElement.height;
  const arOrig = wOrig / hOrig;
  const arTarget = targetWidth / targetHeight;

  // 1. Draw Background
  drawBackground(ctx, canvas, imageElement, pWidth, pHeight, bgType, bgColor, aiStyle, aiPrompt, aiGeneratedImageElement);

  // 2. Draw Image based on Sizing Mode
  let drawW, drawH, drawX, drawY;

  if (sizingMode === 'fill' || sizingMode === 'enlarge_to_frame') {
    let scale;
    if (arOrig > arTarget) {
      scale = pHeight / hOrig;
    } else {
      scale = pWidth / wOrig;
    }
    drawW = Math.round(wOrig * scale);
    drawH = Math.round(hOrig * scale);
    drawX = Math.round((pWidth - drawW) / 2);
    drawY = Math.round((pHeight - drawH) / 2);
  } else if (sizingMode === 'stretch') {
    drawW = pWidth;
    drawH = pHeight;
    drawX = 0;
    drawY = 0;
  } else if (sizingMode === 'background_stretch') {
    const wOrigScaled = wOrig * previewScale;
    const hOrigScaled = hOrig * previewScale;
    if (wOrigScaled <= pWidth && hOrigScaled <= pHeight) {
      drawW = Math.round(wOrigScaled);
      drawH = Math.round(hOrigScaled);
      drawX = Math.round((pWidth - drawW) / 2);
      drawY = Math.round((pHeight - drawH) / 2);
    } else {
      let scale;
      if (arOrig > arTarget) {
        scale = pWidth / wOrig;
      } else {
        scale = pHeight / hOrig;
      }
      drawW = Math.round(wOrig * scale);
      drawH = Math.round(hOrig * scale);
      drawX = Math.round((pWidth - drawW) / 2);
      drawY = Math.round((pHeight - drawH) / 2);
    }
  } else {
    let scale;
    if (arOrig > arTarget) {
      scale = pWidth / wOrig;
    } else {
      scale = pHeight / hOrig;
    }
    drawW = Math.round(wOrig * scale);
    drawH = Math.round(hOrig * scale);
    drawX = Math.round((pWidth - drawW) / 2);
    drawY = Math.round((pHeight - drawH) / 2);
  }

  if (clarityEngine === 'hermite') {
    const srcCanvas = imageToCanvas(imageElement);
    const resampledCanvas = resampleHermite(srcCanvas, drawW, drawH);
    ctx.drawImage(resampledCanvas, drawX, drawY, drawW, drawH);
  } else {
    ctx.drawImage(imageElement, drawX, drawY, drawW, drawH);
  }

  return canvas;
}

/**
 * Helper to promise-ify canvas.toBlob
 */
export function canvasToBlob(canvas, mimeType, quality = 0.95) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, mimeType, mimeType === 'image/png' ? undefined : quality);
  });
}

/**
 * Formats file size in bytes to a text string.
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Estimates final output file size.
 */
export function estimateFileSize(width, height, format, quality = 0.95) {
  let bytesPerPixel = 0.25; 
  if (format === 'image/jpeg') {
    bytesPerPixel = 0.08 * (quality + 0.1);
  } else if (format === 'image/webp') {
    bytesPerPixel = 0.06 * (quality + 0.1);
  }
  return Math.round(width * height * bytesPerPixel);
}

/**
 * Wraps an image blob inside a Word Document (.doc) HTML package.
 * Keeps embedded resolution lossless for text inspections.
 */
export function imageToDocBlob(imageBlob, sizeName, width, height) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>Stylecraft Image Resizer - ${sizeName}</title>
          <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; padding: 24px; color: #333333; }
            h2 { color: #4f46e5; font-size: 20px; font-weight: bold; margin-bottom: 2px; }
            .info { font-size: 11px; color: #71717a; margin-bottom: 24px; }
            .img-wrapper { margin: 0 auto; border: 1px solid #e4e4e7; padding: 12px; display: inline-block; background: #fafafa; border-radius: 8px; }
            img { max-width: 100%; height: auto; display: block; }
          </style>
        </head>
        <body>
          <h2>Stylecraft Image Resizer</h2>
          <div class="info">Target Output: ${sizeName} (${width} × ${height} px) • High-Fidelity Doc Mode</div>
          <div class="img-wrapper">
            <img src="${base64data}" width="${width}" height="${height}" alt="${sizeName}" />
          </div>
        </body>
        </html>
      `;
      const docBlob = new Blob([htmlContent], { type: 'application/msword' });
      resolve(docBlob);
    };
    reader.readAsDataURL(imageBlob);
  });
}

/**
 * Helper to convert Blob data to Base64 format client-side.
 */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads a file blob to the user's Google Drive using the Drive API v3 multipart upload endpoint.
 * POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
 */
export async function uploadBlobToGoogleDrive(accessToken, blob, filename, mimeType) {
  try {
    const base64Data = await blobToBase64(blob);
    const metadata = {
      name: filename,
      mimeType: mimeType
    };

    const boundary = '314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const close_delim = `\r\n--${boundary}--`;

    const body = 
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n` +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      base64Data +
      close_delim;

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: body
    });

    const data = await response.json();
    console.log("Google Drive Upload API Response:", data);
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    if (!data.id) {
      throw new Error('Upload succeeded but no file ID was returned by Google Drive API.');
    }

    return data; // contains id, name, mimeType, etc.
  } catch (err) {
    console.error("uploadBlobToGoogleDrive error details:", err);
    throw err;
  }
}

/**
 * Fetches user profile information using the Google OAuth UserInfo API.
 * GET https://www.googleapis.com/oauth2/v3/userinfo
 */
export async function fetchGoogleUserInfo(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  console.log("Google UserInfo API Response:", data);
  if (!response.ok) {
    throw new Error(data.error_description || data.error?.message || 'Failed to fetch user info');
  }
  return data; // contains name, email, picture, etc.
}
