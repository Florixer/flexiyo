const axios = require('axios');
const crypto = require('crypto');

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";
const SIGNATURE_KEY_BASE_URL = "https://s.mxmcdn.net/site/js/";

const EndPoints = {
    GET_ARTIST: "artist.get",
    GET_TRACK: "track.get",
    GET_TRACK_LYRICS: "track.lyrics.get",
    SEARCH_TRACK: "track.search",
    SEARCH_ARTIST: "artist.search",
    GET_ARTIST_CHART: "chart.artists.get",
    GET_TRACK_CHART: "chart.tracks.get",
    GET_ARTIST_ALBUMS: "artist.albums.get",
    GET_ALBUM: "album.get",
    GET_ALBUM_TRACKS: "album.tracks.get",
    GET_TRACK_LYRICS_TRANSLATION: "crowd.track.translations.get"
};

class MusixMatchAPI {
    constructor() {
        this.baseUrl = "https://www.musixmatch.com/ws/1.1/";
        this.headers = { "User-Agent": USER_AGENT };
        this.secret = null;
    }

    async getLatestApp() {
        const { data } = await axios.get("https://www.musixmatch.com/explore", { headers: this.headers });
        const scriptTags = data.match(/<script.*?src="(.*?)".*?><\/script>/g);
        const lastScriptSrc = scriptTags.pop().match(/src="(.*?)"/)[1];
        return lastScriptSrc.split("/").pop();
    }

    async getSecret() {
        if (this.secret) return this.secret;

        const latestApp = await this.getLatestApp();
        const { data } = await axios.get(SIGNATURE_KEY_BASE_URL + latestApp, { headers: this.headers });

        const regexPattern = /.*signatureSecret:"([^"]*)"/;
        const match = data.match(regexPattern);
        if (match) {
            this.secret = match[1];
            return this.secret;
        } else {
            throw new Error("Couldn't find signature secret");
        }
    }

    async generateSignature(url) {
        const secret = await this.getSecret();
        const currentDate = new Date();
        const l = currentDate.getUTCFullYear().toString();
        const s = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const r = currentDate.getUTCDate().toString().padStart(2, '0');
        const message = `${url}${l}${s}${r}`;
        const key = Buffer.from(secret, 'utf8');
        const hash = crypto.createHmac('sha1', key).update(message).digest('base64');
        const signature = `&signature=${encodeURIComponent(hash)}&signature_protocol=sha1`;
        return signature;
    }

    async makeRequest(url) {
        const signedUrl = `${this.baseUrl}${url}${await this.generateSignature(url)}`;
        const { data } = await axios.get(signedUrl, { headers: this.headers });
        return data;
    }

    async searchTracks(trackQuery, page = 1) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            q: trackQuery,
            f_has_lyrics: 'true',
            page_size: '100',
            page: page.toString()
        });
        return await this.makeRequest(`${EndPoints.SEARCH_TRACK}?${params.toString()}`);
    }

    async getTrack(trackId) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            track_id: trackId
        });
        return await this.makeRequest(`${EndPoints.GET_TRACK}?${params.toString()}`);
    }

    async getTrackLyrics(trackId) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            track_id: trackId
        });
        return await this.makeRequest(`${EndPoints.GET_TRACK_LYRICS}?${params.toString()}`);
    }

    async getArtistChart(country = 'US', page = 1) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            country: country,
            page_size: '100',
            page: page.toString()
        });
        return await this.makeRequest(`${EndPoints.GET_ARTIST_CHART}?${params.toString()}`);
    }

    async getTrackChart(country = 'US', page = 1) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            country: country,
            page_size: '100',
            page: page.toString()
        });
        return await this.makeRequest(`${EndPoints.GET_TRACK_CHART}?${params.toString()}`);
    }

    async searchArtist(query, page = 1) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            q_artist: query,
            page_size: '100',
            page: page.toString()
        });
        return await this.makeRequest(`${EndPoints.SEARCH_ARTIST}?${params.toString()}`);
    }

    async getArtist(artistId) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            artist_id: artistId
        });
        return await this.makeRequest(`${EndPoints.GET_ARTIST}?${params.toString()}`);
    }

    async getArtistAlbums(artistId, page = 1) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            artist_id: artistId,
            page_size: '100',
            page: page.toString()
        });
        return await this.makeRequest(`${EndPoints.GET_ARTIST_ALBUMS}?${params.toString()}`);
    }

    async getAlbum(albumId) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            album_id: albumId
        });
        return await this.makeRequest(`${EndPoints.GET_ALBUM}?${params.toString()}`);
    }

    async getAlbumTracks(albumId, page = 1) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            album_id: albumId,
            page_size: '100',
            page: page.toString()
        });
        return await this.makeRequest(`${EndPoints.GET_ALBUM_TRACKS}?${params.toString()}`);
    }

    async getTrackLyricsTranslation(trackId, selectedLanguage) {
        const params = new URLSearchParams({
            app_id: 'community-app-v1.0',
            format: 'json',
            track_id: trackId,
            selected_language: selectedLanguage
        });
        return await this.makeRequest(`${EndPoints.GET_TRACK_LYRICS_TRANSLATION}?${params.toString()}`);
    }
}

module.exports = MusixMatchAPI;
