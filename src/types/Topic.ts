import { TChapter } from './Chapter';
import { TSubject } from './Subject';

export type TTopic = {
  id: string;
  name: string;
  description: string;
  contentURL: string;
  contentThumbnail: string;
  sequence: number;
  serviceType: 'FREE' | 'PREMIUM';
  Chapter: TChapter;
  Subject: TSubject;
  explanation?: string;
  revisionRecall?: string;
  hiddenLinks?: string;
  exerciseRevival?: string;
  masterExemplar?: string;
  pyq?: string;
  chapterCheckpoint?: string;
  createdAt: string;
  updatedAt: string;
};

export type TFeatureType = 'explanation' | 'revision_recall' | 'hidden_links' | 'exercise_revival' | 'master_exemplar' | 'pyq' | 'chapter_checkpoint';

export const FEATURE_TYPE_TO_FIELD: Record<TFeatureType, keyof TTopic> = {
  explanation: 'explanation',
  revision_recall: 'revisionRecall',
  hidden_links: 'hiddenLinks',
  exercise_revival: 'exerciseRevival',
  master_exemplar: 'masterExemplar',
  pyq: 'pyq',
  chapter_checkpoint: 'chapterCheckpoint',
};
