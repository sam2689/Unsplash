import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: "Client-ID 6VyvPfv5cQ6kh0c9BRfp4z5YgQzPcGZAJAFhT39qDQY",
  }
});

class DownloadService {
  static async downloadImage(photo, quality = 'regular') {
    try {
      const imageUrl = DownloadService.getImageUrlByQuality(photo, quality);
      const filename = DownloadService.generateFilename(photo, quality);

      const blobResult = await DownloadService.downloadViaBlob(imageUrl, filename);

      if (blobResult.success) {
        DownloadService.trackDownload(photo.id, quality, 'blob');
        return blobResult;
      }

      const newTabResult = DownloadService.openInNewTab(imageUrl);
      DownloadService.trackDownload(photo.id, quality, 'new_tab');

      return newTabResult;

    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }


  static getImageUrlByQuality(photo, quality) {
    switch (quality) {
      case 'raw':
        return photo.urls.raw || photo.urls.full;
      case 'full':
        return photo.urls.full;
      case 'regular':
        return photo.urls.regular;
      case 'small':
        return photo.urls.small;
      case 'thumb':
        return photo.urls.thumb;
      default:
        return photo.urls.regular;
    }
  }


  static generateFilename(photo, quality) {
    const username = photo.user?.username || 'unknown';
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `unsplash-${username}-${timestamp}-${quality}.jpg`;
  }


  static async downloadViaBlob(imageUrl, filename) {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      return {
        success: true,
        method: 'blob',
        message: 'Image downloaded successfully'
      };

    } catch (error) {
      console.error('Blob download failed:', error);
      return {
        success: false,
        method: 'blob',
        error: error.message
      };
    }
  }


  static openInNewTab(imageUrl) {
    try {
      const newTab = window.open(imageUrl, '_blank');

      if (!newTab) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return {
        success: true,
        method: 'new_tab',
        message: 'Image opened in new tab'
      };

    } catch (error) {
      console.error('New tab open failed:', error);
      return {
        success: false,
        method: 'new_tab',
        error: error.message
      };
    }
  }

  static trackDownload(photoId, quality, method) {
    console.log(`Download tracked - Photo: ${photoId}, Quality: ${quality}, Method: ${method}`);
  }


  static getQualityOptions() {
    return [
      { value: 'raw', label: 'Original (RAW)', size: 'Highest quality', description: 'Best for printing and editing' },
      { value: 'full', label: 'Full HD', size: '1920x1080', description: 'Great for desktop wallpapers' },
      { value: 'regular', label: 'Regular', size: '1080x720', description: 'Good for web use' },
      { value: 'small', label: 'Small', size: '640x426', description: 'Fast loading for mobile' },
      { value: 'thumb', label: 'Thumbnail', size: '200x133', description: 'For previews and thumbnails' }
    ];
  }

  static estimateFileSize(quality) {
    const sizes = {
      'raw': '10-20 MB',
      'full': '2-5 MB',
      'regular': '500 KB - 1 MB',
      'small': '100-300 KB',
      'thumb': '20-50 KB'
    };

    return sizes[quality] || 'Unknown size';
  }
}

export default DownloadService;