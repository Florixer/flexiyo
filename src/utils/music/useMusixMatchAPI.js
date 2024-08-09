import React, { useState, useEffect } from "react";
import axios from "axios";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";
const SIGNATURE_KEY_BASE_URL = "https://cors-anywhere.herokuapp.com/https://s.mxmcdn.net/site/js/";

const EndPoints = {
  GET_ARTIST: "artist.get",
  GET_TRACK: "track.get",
  GET_TRACK_LYRICS: "track.lyrics.get",
  GET_MATCHER_LYRICS: "matcher.lyrics.get",
  SEARCH_TRACK: "track.search",
  SEARCH_ARTIST: "artist.search",
  GET_ARTIST_CHART: "chart.artists.get",
  GET_TRACK_CHART: "chart.tracks.get",
  GET_ARTIST_ALBUMS: "artist.albums.get",
  GET_ALBUM: "album.get",
  GET_ALBUM_TRACKS: "album.tracks.get",
  GET_TRACK_LYRICS_TRANSLATION: "crowd.track.translations.get",
};

const useMusixMatchAPI = () => {
  const [secret, setSecret] = useState(null);
  const baseUrl = "https://cors-anywhere.herokuapp.com/https://www.musixmatch.com/ws/1.1/";
  const headers = { "User-Agent": USER_AGENT };

  const getLatestApp = async () => {
    const { data } = await axios.get("https://cors-anywhere.herokuapp.com/https://www.musixmatch.com/explore", {
      headers,
    });
    const scriptTags = data.match(/<script.*?src="(.*?)".*?><\/script>/g);
    const lastScriptSrc = scriptTags.pop().match(/src="(.*?)"/)[1];
    return lastScriptSrc.split("/").pop();
  };

  const getSecret = async () => {
    if (secret) return secret;

    const latestApp = await getLatestApp();
    const { data } = await axios.get(SIGNATURE_KEY_BASE_URL + latestApp, {
      headers,
    });

    const regexPattern = /.*signatureSecret:"([^"]*)"/;
    const match = data.match(regexPattern);
    if (match) {
      setSecret(match[1]);
      return match[1];
    } else {
      throw new Error("Couldn't find signature secret");
    }
  };

  const generateSignature = async (url) => {
    const secretKey = await getSecret();
    const currentDate = new Date();
    const message = `${url}${currentDate.getUTCFullYear()}${(
      currentDate.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${currentDate
      .getUTCDate()
      .toString()
      .padStart(2, "0")}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey),
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message),
    );
    return `&signature=${encodeURIComponent(
      btoa(String.fromCharCode(...new Uint8Array(signature))),
    )}&signature_protocol=sha1`;
  };

  const makeRequest = async (url) => {
    const signedUrl = `${baseUrl}${url}${await generateSignature(url)}`;
    const { data } = await axios.get(signedUrl, { headers });
    return data;
  };

  const searchTracks = async (trackQuery, page = 1) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      q: trackQuery,
      f_has_lyrics: "true",
      page_size: "100",
      page: page.toString(),
    });
    return await makeRequest(`${EndPoints.SEARCH_TRACK}?${params.toString()}`);
  };

  const getTrack = async (trackId) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      track_id: trackId,
    });
    return await makeRequest(`${EndPoints.GET_TRACK}?${params.toString()}`);
  };

  const getTrackLyrics = async (trackId) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      track_id: trackId,
    });
    return await makeRequest(
      `${EndPoints.GET_TRACK_LYRICS}?${params.toString()}`,
    );
  };

  const getMatcherLyrics = async (trackName, trackArtists) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      q_track: trackName,
      q_artist: trackArtists,
    });
    return await makeRequest(
      `${EndPoints.GET_MATCHER_LYRICS}?${params.toString()}`,
    );
  };

  const getArtistChart = async (country = "US", page = 1) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      country,
      page_size: "100",
      page: page.toString(),
    });
    return await makeRequest(
      `${EndPoints.GET_ARTIST_CHART}?${params.toString()}`,
    );
  };

  const getTrackChart = async (country = "US", page = 1) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      country,
      page_size: "100",
      page: page.toString(),
    });
    return await makeRequest(
      `${EndPoints.GET_TRACK_CHART}?${params.toString()}`,
    );
  };

  const searchArtist = async (query, page = 1) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      q_artist: query,
      page_size: "100",
      page: page.toString(),
    });
    return await makeRequest(`${EndPoints.SEARCH_ARTIST}?${params.toString()}`);
  };

  const getArtist = async (artistId) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      artist_id: artistId,
    });
    return await makeRequest(`${EndPoints.GET_ARTIST}?${params.toString()}`);
  };

  const getArtistAlbums = async (artistId, page = 1) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      artist_id: artistId,
      page_size: "100",
      page: page.toString(),
    });
    return await makeRequest(
      `${EndPoints.GET_ARTIST_ALBUMS}?${params.toString()}`,
    );
  };

  const getAlbum = async (albumId) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      album_id: albumId,
    });
    return await makeRequest(`${EndPoints.GET_ALBUM}?${params.toString()}`);
  };

  const getAlbumTracks = async (albumId, page = 1) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      album_id: albumId,
      page_size: "100",
      page: page.toString(),
    });
    return await makeRequest(
      `${EndPoints.GET_ALBUM_TRACKS}?${params.toString()}`,
    );
  };

  const getTrackLyricsTranslation = async (trackId, selectedLanguage) => {
    const params = new URLSearchParams({
      app_id: "community-app-v1.0",
      format: "json",
      track_id: trackId,
      selected_language: selectedLanguage,
    });
    return await makeRequest(
      `${EndPoints.GET_TRACK_LYRICS_TRANSLATION}?${params.toString()}`,
    );
  };

  return {
    searchTracks,
    getTrack,
    getTrackLyrics,
    getMatcherLyrics,
    getArtistChart,
    getTrackChart,
    searchArtist,
    getArtist,
    getArtistAlbums,
    getAlbum,
    getAlbumTracks,
    getTrackLyricsTranslation,
  };
};

export default useMusixMatchAPI;
