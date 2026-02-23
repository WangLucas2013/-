export enum Difficulty {
  Beginner = "初级",
  Intermediate = "中级",
  Advanced = "高级"
}

export enum GrammarPoint {
  RelativeClause = "定语从句",
  AdverbialClause = "状语从句",
  NonFiniteVerb = "非谓语动词",
  Conjunction = "连词",
  AbsoluteConstruction = "独立主格",
  NounClause = "名词性从句"
}

export interface Question {
  id: string;
  sentence: string; // Use {{0}}, {{1}} for blanks
  options: string[][];
  correctAnswers: number[];
  difficulty: Difficulty;
  grammarPoint: GrammarPoint;
  explanation: {
    rule: string;
    example: string;
    commonMistake: string;
    analysis: string;
  };
}

export const QUESTION_BANK: Question[] = [
  {
    id: "1",
    sentence: "{{0}} tired, she still finished the report.",
    options: [["Although", "Because", "Unless", "Since"]],
    correctAnswers: [0],
    difficulty: Difficulty.Beginner,
    grammarPoint: GrammarPoint.Conjunction,
    explanation: {
      rule: "Although 引导让步状语从句，表示“尽管”。",
      example: "Although it was raining, they went out.",
      commonMistake: "容易与 but 连用。注意：although 和 but 不能同时出现在一个句子中。",
      analysis: "句子前半部分说“累”，后半部分说“完成了报告”，存在转折/让步关系，故选 Although。"
    }
  },
  {
    id: "2",
    sentence: "The boy {{0}} is playing football is my brother.",
    options: [["who", "which", "whose", "whom"]],
    correctAnswers: [0],
    difficulty: Difficulty.Beginner,
    grammarPoint: GrammarPoint.RelativeClause,
    explanation: {
      rule: "who 引导定语从句，先行词为人且在从句中作主语。",
      example: "The girl who is singing is my friend.",
      commonMistake: "误用 which 引导人的定语从句。",
      analysis: "先行词是 The boy（人），从句中缺少主语，因此使用 who。"
    }
  },
  {
    id: "3",
    sentence: "I don't know {{0}} he will come or not.",
    options: [["whether", "if", "that", "when"]],
    correctAnswers: [0],
    difficulty: Difficulty.Intermediate,
    grammarPoint: GrammarPoint.NounClause,
    explanation: {
      rule: "whether...or not 是固定搭配，表示“是否”。",
      example: "I wonder whether it will rain or not.",
      commonMistake: "在有 or not 的情况下误用 if（虽然 if 也可以表示是否，但通常不直接接 or not）。",
      analysis: "句尾有 or not，固定搭配首选 whether。"
    }
  },
  {
    id: "4",
    sentence: "{{0}} the homework, the boy went out to play.",
    options: [["Having finished", "Finished", "To finish", "Finish"]],
    correctAnswers: [0],
    difficulty: Difficulty.Advanced,
    grammarPoint: GrammarPoint.NonFiniteVerb,
    explanation: {
      rule: "现在分词的完成式（Having done）表示该动作发生在主句动作之前。",
      example: "Having seen the film, I didn't want to see it again.",
      commonMistake: "误用过去分词 Finished（过去分词表示被动或完成，但此处主语 boy 是动作执行者）。",
      analysis: "“完成作业”发生在“出去玩”之前，且 boy 与 finish 是主动关系，故用 Having finished。"
    }
  },
  {
    id: "5",
    sentence: "This is the factory {{0}} my father works.",
    options: [["where", "which", "that", "whose"]],
    correctAnswers: [0],
    difficulty: Difficulty.Intermediate,
    grammarPoint: GrammarPoint.RelativeClause,
    explanation: {
      rule: "where 引导定语从句，先行词为地点且在从句中作状语。",
      example: "The house where I live is very old.",
      commonMistake: "误用 which。如果从句缺主语或宾语用 which，缺状语用 where。",
      analysis: "works 是不及物动词，从句不缺宾语，my father works in the factory，需要地点状语，故选 where。"
    }
  },
  {
    id: "6",
    sentence: "Time {{0}}, we will go for a picnic.",
    options: [["permitting", "permitted", "permits", "to permit"]],
    correctAnswers: [0],
    difficulty: Difficulty.Advanced,
    grammarPoint: GrammarPoint.AbsoluteConstruction,
    explanation: {
      rule: "独立主格结构：名词/代词 + 分词。Time 与 permit 是主动关系。",
      example: "Weather permitting, we shall go.",
      commonMistake: "误用 permitted。注意 Time 与 permit 的逻辑关系是主动的。",
      analysis: "这是一个独立主格结构，Time 是逻辑主语，与 permit 是主动关系，故用现在分词 permitting。"
    }
  }
];
