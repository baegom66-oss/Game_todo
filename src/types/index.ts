/**
 * Game Life Manager — 핵심 데이터 타입
 * 모든 상태는 LocalStorage에 직렬화되어 저장됩니다.
 */

// ─── 공통 ───────────────────────────────────────────────────────────────────

export type ISODateString = string;

export interface BaseEntity {
  id: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ─── 플레이어(게임 플레이) ────────────────────────────────────────────────────

/** 게임별 일일 퀘스트 / 체크리스트 항목 */
export interface GameChecklistItem extends BaseEntity {
  label: string;
  done: boolean;
  /** 해당 날짜(YYYY-MM-DD). 일일 퀘스트 리셋 기준 */
  date: string;
}

/** 게임 접속 기록 */
export interface GameAccessLog {
  id: string;
  playedAt: ISODateString;
  memo?: string;
}

/** 등록된 게임 */
export interface Game extends BaseEntity {
  title: string;
  platform?: string;
  memo: string;
  checklist: GameChecklistItem[];
  accessLogs: GameAccessLog[];
}

// ─── 개발자(프로젝트 · RPG) ───────────────────────────────────────────────────

export type DevProjectStatus = 'planned' | 'in_progress' | 'completed';

/** 프로젝트 하위 작업 */
export interface DevTask extends BaseEntity {
  title: string;
  done: boolean;
  /** 완료 시각. XP 지급 여부 판별에 사용 */
  completedAt?: ISODateString;
}

/** 개발 프로젝트 */
export interface DevProject extends BaseEntity {
  name: string;
  status: DevProjectStatus;
  description?: string;
  tasks: DevTask[];
}

/** 개발 일지 (작성 시 +10 XP) */
export interface DevJournal extends BaseEntity {
  projectId?: string;
  title: string;
  body: string;
  /** XP 중복 지급 방지 */
  xpAwarded: boolean;
}

/** 아이디어 메모장 */
export interface IdeaMemo extends BaseEntity {
  title: string;
  body: string;
  pinned?: boolean;
}

// ─── RPG 경험치 ───────────────────────────────────────────────────────────────

/** XP 지급 사유 (로그·디버깅용, 선택) */
export type XpSource = 'task_complete' | 'journal_write';

export interface XpEvent {
  id: string;
  at: ISODateString;
  amount: number;
  source: XpSource;
  referenceId?: string;
}

/** 개발자 RPG 스탯 — 홈·개발자 페이지 공통 */
export interface DeveloperStats {
  totalXp: number;
  level: number;
  /** 선택: 최근 XP 이벤트 (요약 UI용, 비워도 됨) */
  recentXpEvents?: XpEvent[];
}

// ─── 앱 전체 상태 (LocalStorage 단일 스키마) ─────────────────────────────────

export const STORAGE_KEY = 'game-life-manager:v1' as const;

export interface AppData {
  version: 1;
  games: Game[];
  devProjects: DevProject[];
  devJournals: DevJournal[];
  ideaMemos: IdeaMemo[];
  developerStats: DeveloperStats;
}

/** 빈 앱 초기값 */
export const createInitialAppData = (): AppData => ({
  version: 1,
  games: [],
  devProjects: [],
  devJournals: [],
  ideaMemos: [],
  developerStats: {
    totalXp: 0,
    level: 1,
    recentXpEvents: [],
  },
});

// ─── UI 전용 (저장하지 않음) ─────────────────────────────────────────────────

export type MainView = 'home' | 'player' | 'developer';
