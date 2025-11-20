import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: "Client-ID 6VyvPfv5cQ6kh0c9BRfp4z5YgQzPcGZAJAFhT39qDQY",
  }
});

class Service {

  static async getPhotosAll({page = 1, perPage = 20, query = '', topic = '', color = '', orientation = ''}) {
    if (topic) {
      return await Service.getPhotosByTopic(topic, page, perPage, color, orientation);
    }

    if (query.trim()) {
      return await Service.searchPhotos(query, page, perPage, color, orientation);
    }

    return await Service.getPhotos(page, perPage, color, orientation);
  }


  static async getPhotos(page = 1, perPage = 20, color = '', orientation = '') {
    try {
      const {data} = await api.get("/photos", {
        params: {
          page,
          per_page: perPage,
          ...(color && {color}),
          ...(orientation && {orientation})
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching photos:', error);
      throw error;
    }
  }

  static async searchPhotos(query, page = 1, perPage = 20, color = '', orientation = '') {
    try {
      const {data} = await api.get("/search/photos", {
        params: {
          query,
          page,
          per_page: perPage,
          ...(color && {color}),
          ...(orientation && {orientation})
        }
      });
      return data.results;
    } catch (error) {
      console.error('Error searching photos:', error);
      return [];
    }
  }

  static async getUser(username) {
    try {
      const {data} = await api.get(`/users/${username}`);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async getUserPhotos(username) {
    try {
      const {data} = await api.get(`/users/${username}/photos`);
      return data;
    } catch (error) {
      console.error('Error fetching user photos:', error);
      throw error;
    }
  }

  static async getCollections(page = 1, perPage = 5) {
    const {data} = await api.get('/collections', {
      params: {page, per_page: perPage}
    });
    return data;
  }

  static async getCollectionPhotos(collectionId, page = 1, perPage = 20) {
    const {data} = await api.get(`/collections/${collectionId}/photos`, {
      params: {page, per_page: perPage}
    });
    return data;
  }

  static async getPhotosByTopic(slug, page = 1, perPage = 20, color = '', orientation = '') {
    try {
      const {data} = await api.get(`/topics/${slug}/photos`, {
        params: {
          page,
          per_page: perPage,
          ...(color && {color}),
          ...(orientation && {orientation})
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching topic photos:', error);
      throw error;
    }
  }
}

export default Service;
