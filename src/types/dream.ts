export type DreamTags = {
  symbols: string[];
  emotions: string[];
  figures: string[];
  setting: string;
};

export type DreamEntry = {
  id: string;
  timestamp: string;
  transcript: string;
  tags: DreamTags;
};
