// @flow
import { Server } from 'api';
import type { ChapterType } from 'types';
import { DECREMENT_UNREAD } from './library';

// ================================================================================
// Actions
// ================================================================================
const FETCH_CACHE = 'chapters/FETCH_CACHE';
const FETCH_REQUEST = 'chapters/FETCH_REQUEST';
const FETCH_SUCCESS = 'chapters/FETCH_SUCCESS';
const FETCH_FAILURE = 'chapters/FETCH_FAILURE';
export const FETCH_CHAPTERS = 'chapters/FETCH';

const UPDATE_REQUEST = 'chapters/UPDATE_REQUEST';
const UPDATE_SUCCESS = 'chapters/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'chapters/UPDATE_FAILURE';
export const UPDATE_CHAPTERS = 'chapters/UPDATE';

const UPDATE_READING_STATUS_REQUEST = 'chapters/UPDATE_READING_STATUS_REQUEST';
const UPDATE_READING_STATUS_SUCCESS = 'chapters/UPDATE_READING_STATUS_SUCCESS';
const UPDATE_READING_STATUS_FAILURE = 'chapters/UPDATE_READING_STATUS_FAILURE';

// ================================================================================
// Reducers
// ================================================================================
type State = { +[mangaId: number]: Array<ChapterType> };

export default function chaptersReducer(state: State = {}, action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        [action.mangaId]: action.payload,
      };

    case FETCH_CACHE:
      return state;

    case UPDATE_SUCCESS:
      return state; // doesn't directly edit state, calls fetchChapters

    case UPDATE_READING_STATUS_SUCCESS: {
      const {
        mangaId, chapterId, readPage, didReadLastPage,
      } = action;
      return {
        ...state,
        [mangaId]: changeChapterObjReadState(state[mangaId], chapterId, readPage, didReadLastPage),
      };
    }

    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
// Fetch the chapters that are currently cached by the server
type Obj = { ignoreCache?: boolean };
export function fetchChapters(mangaId: number, { ignoreCache = false }: Obj = {}) {
  return (dispatch: Function, getState: Function) => {
    // Return manga's cached chapters if they're already in the store
    if (!ignoreCache && getState().chapters[mangaId]) {
      return Promise.resolve().then(dispatch({ type: FETCH_CACHE }));
    }

    dispatch({ type: FETCH_REQUEST, meta: { mangaId } });

    return fetch(Server.chapters(mangaId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: 'Failed to load chapters',
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: FETCH_SUCCESS, payload: json.content, mangaId }));
  };
}

// Request the server to re-scrape the source site for chapters
// If there have been any changes, re-fetch the cached chapter list from the server
export function updateChapters(mangaId: number) {
  return (dispatch: Function) => {
    dispatch({ type: UPDATE_REQUEST, meta: { mangaId } });

    return fetch(Server.updateMangaChapters(mangaId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: UPDATE_FAILURE,
            errorMessage: 'Failed to update the chapters list',
            meta: { error },
          }),
      )
      .then((json) => {
        if (!json.success) {
          return dispatch({
            type: UPDATE_FAILURE,
            errorMessage: 'Failed to update the chapters list',
            meta: { json },
          });
        }

        if (json.added.length > 0 || json.removed.length > 0) {
          dispatch({ type: UPDATE_SUCCESS, meta: { json } });
          return dispatch(fetchChapters(mangaId, { ignoreCache: true }));
        }

        return dispatch({ type: UPDATE_SUCCESS, meta: { note: 'No updates', json } });
      });
  };
}

// NOTE: This is only to update one chapter object's read + last_page_read
export function updateReadingStatus(
  mangaId: number,
  chapter: ChapterType,
  pageCount: number,
  readPage: number,
) {
  return (dispatch: Function) => {
    // Handle checking if no update needs to happen. Escape early if so.
    // NOTE: Returning null should work, but idk if redux-thunk
    //       wants me to return a dispatch instead.
    if (chapter.read || readPage <= chapter.last_page_read) {
      return null;
    }

    dispatch({ type: UPDATE_READING_STATUS_REQUEST });
    const didReadLastPage = readPage === pageCount - 1;

    return fetch(Server.updateReadingStatus(mangaId, chapter.id, readPage, didReadLastPage)).then(
      () => {
        if (didReadLastPage) {
          // Update library unread that there's one less unread chapter
          dispatch({ type: DECREMENT_UNREAD, mangaId });
        }

        return dispatch({
          type: UPDATE_READING_STATUS_SUCCESS,
          mangaId,
          chapterId: chapter.id,
          readPage,
          didReadLastPage,
        });
      },
      error =>
        dispatch({
          type: UPDATE_READING_STATUS_FAILURE,
          errorMessage: 'Failed to save your reading status',
          meta: { error },
        }),
    );
  };
}

// ================================================================================
// Helper Functions
// ================================================================================
function changeChapterObjReadState(chapters, chapterId, readPage, didReadLastPage) {
  const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
  const chapter = chapters[chapterIndex];

  const newChapter = {
    ...chapter,
    last_page_read: readPage,
    read: didReadLastPage,
  };

  return [...chapters.slice(0, chapterIndex), newChapter, ...chapters.slice(chapterIndex + 1)];
}
