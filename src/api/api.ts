import axios, { AxiosResponse } from 'axios';
import { Lecture } from '../types/types';

const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () =>
  axios.get<Lecture[]>('/schedules-liberal-arts.json');

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const createCachedFetcher = () => {
  const cache = new WeakMap();

  return async (fetcher: () => Promise<AxiosResponse<Lecture[], unknown>>) => {
    if (cache.has(fetcher)) {
      return cache.get(fetcher);
    }

    const result = await fetcher();
    cache.set(fetcher, result);
    return result;
  };
};

const fetchWithCache = createCachedFetcher();

export const fetchAllLectures = async () =>
  await Promise.all([
    (console.log('API Call 1', performance.now()), fetchWithCache(fetchMajors)),
    (console.log('API Call 2', performance.now()),
    fetchWithCache(fetchLiberalArts)),
    (console.log('API Call 3', performance.now()), fetchWithCache(fetchMajors)),
    (console.log('API Call 4', performance.now()),
    fetchWithCache(fetchLiberalArts)),
    (console.log('API Call 5', performance.now()), fetchWithCache(fetchMajors)),
    (console.log('API Call 6', performance.now()),
    fetchWithCache(fetchLiberalArts)),
  ]);
