# 리액트 프로젝트 성능 개선

- url: https://front-4th-chapter4-2-advanced.vercel.app/

## 문제들에 대해 했던 시도

1. 병렬로 `Promise.all` 실행

   - 문제: `Promise.all` 내부의 배열에서 await을 실행하게 되면 이전의 요청이 끝날 때 까지 기다림. 즉, 사실상 직렬로 동작한다는 것.
   - 해결방안: await 없이 바로 호출
   - 커밋: [4b5fdc8](https://github.com/confidential-nt/front_4th_chapter4-2_advanced/commit/4b5fdc8469b1ee09692445839252e31c6f74afa4)

2. fetch에 캐시 적용

   - 문제: 기존 코드에서는 같은 fetch를 여러번 호출할 경우, 또 한번 fetch가 실행되는 문제가 있었음.
   - 해결방안: WeakMap을 사용하여 캐시 구현 - 왜 WeakMap 이냐? 참조가 없어지면 자동으로 GC(가비지 컬렉션) 처리되므로, 메모리 누수를 방지하는 데 유리하기 때문.
   - 커밋: [bafeb8](https://github.com/confidential-nt/front_4th_chapter4-2_advanced/commit/bafeb8a4c90a421adb08176f090ab45a95d772eb)

3. 연산에 useMemo 적용

   - 문제: `SearchDialog` 내부에서 `filteredLectures`는 꽤 무거운 연산을 함. 이 연산이 리렌더링될때마다 수행되는건 분명 낭비.
   - 해결방안: useMemo 적용
   - 커밋: [ff8692](https://github.com/confidential-nt/front_4th_chapter4-2_advanced/commit/ff86926df08287ac12d0bf9de368861dd85b6d12)

4. `ScheduleContext`에 useMemo 적용

   - 문제: 기존의 `ScheduleProvider`는 value로 매번 새로운 객체를 넣어주고 있음. 이는 비효율적으로 리렌더링 유발
   - 해결방안: value를 useMemo로 감싸서 전하도록 함
   - 커밋: [bd5c6a](https://github.com/confidential-nt/front_4th_chapter4-2_advanced/commit/bd5c6a21b72cf9ee880a1eca68b0e4a555a1ad78)

5. `ScheduleDndProvider` 더 좁은 범위로 작동하도록 개선

   - 문제: 기존의 `ScheduleDndProvider`는 `ScheduleTables`를 감싸고 있음. 그러나 `ScheduleDndProvider`는 더 좁은 범위에서 사용해도 무방. 그렇지 않으면 불필요한 리렌더링을 광범위하게 유발함
   - 해결 방안: `ScheduleDndProvider`를 더 좁은 범위에서 사용하도록 수정
   - 커밋: [201b0ec](https://github.com/confidential-nt/front_4th_chapter4-2_advanced/commit/201b0ec6858ff258badf042f1e3b4ccb3b967c19)

6. 아이템 요소에 memo 적용

   - 문제: 컴포넌트를 분리 후 요소들을 살펴보니, 아이템 목록 요소들이 많았음. 그런데 이 요소들은 자기가 받는 props가 바뀌는 상황 이외엔 리렌더링 되지 않아야 효율적.
   - 해결 방안: memo로 감쌈
   - 커밋: [63eab1b](https://github.com/confidential-nt/front_4th_chapter4-2_advanced/commit/63eab1b7ea55d11cac1aa4e52b7aeb5f1c5b3845)

## 개선 효과

### DnD 에서 Drag 했을 때

#### before

![](/public/before-1.png)

#### after

![](/public/after-1.png)

### 분석

체감상으로도 상당히 느리다는 느낌을 받았음. 전과 후를 비교해보면 리렌더링되는 요소도 줄었고 그에 따라 한번 드래그했을 때 걸리는 시간이 186ms에서 55.2ms로 줄어듦

### DnD 에서 Drop 했을 때

#### before

![](/public/before-2.png)

#### after

![](/public/after-2.png)

#### 분석

요소를 드래그하다가 정확히 같은 곳에서 드롭했을 때 발생하는 렌더링 시간이 168ms에서 164ms로 줄어듦.

### `SearchDialog`에서 검색 필터를 눌렀을 때

#### before

![](/public/before-3.png)

#### after

![](/public/after-3.png)

#### 분석

렌더링 시간이 275ms에서 210ms로 줄어든 것을 알 수 있다.

### `SearchDialog`에서 검색 결과를 무한 스크롤링할 때

#### before

![](/public/before-4.png)

#### after

![](/public/after-4.png)

#### 분석

렌더링 시간이 325ms에서 284ms로 줄어든 것을 알 수 있다.

## 리뷰

- 최대한 불필요한 렌더링이 발생하는 지점을 찾고 메모이제이션도 적극 활용하려고 했으나, 활용해도 개선 효과가 미미하거나 없는 경우가 꽤 많았음. 이는 아마 근본적인 원인을 못찾았거나 메모이제이션을 잘못 활용하고 있기 때문인것으로 예상. 불필요한 렌더링이 발생하는 원인이 되는 지점을 빨리 찾는 방법이나 도구를 알아볼 필요가 있다.
