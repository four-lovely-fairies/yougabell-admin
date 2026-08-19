// `lib/api.ts`가 400줄 한도를 넘어 관심사별로 분할했다.
// 호출부는 기존과 동일하게 `@/lib/api`에서 가져온다.
export * from "./client";
export * from "./users";
export * from "./content";
export * from "./stats";
export * from "./inquiry";
export * from "./admin-api";
