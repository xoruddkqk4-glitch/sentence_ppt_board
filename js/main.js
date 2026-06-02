const ROLE_OPTIONS = [
  { value: "subject", label: "주어", lane: "major" },
  { value: "verb", label: "동사", lane: "major" },
  { value: "complement", label: "보어", lane: "major" },
  { value: "object", label: "목적어", lane: "major" },
  { value: "adjective", label: "형용사어", lane: "minor" },
  { value: "adverb", label: "부사어", lane: "minor" },
  { value: "title", label: "제목", lane: "major" },
  { value: "subtitle", label: "소제목", lane: "major" }
];

const ROLE_BY_VALUE = Object.fromEntries(ROLE_OPTIONS.map((role) => [role.value, role]));
const ROLE_COLOR_CLASS = {
  subject: "role-subject",
  verb: "role-verb",
  object: "role-object",
  complement: "role-complement",
  adjective: "role-adjective",
  adverb: "role-adverb",
  title: "role-title",
  subtitle: "role-subtitle"
};
const COMPONENT_PALETTE = {
  subject: "#00B8A9",
  verb: "#F6416C",
  object: "#FFDE7D",
  complement: "#9BB8FF",
  adjective: "#008000",
  adverb: "#F8F3D4",
  title: "#0066cc",
  subtitle: "#5d6675"
};
const MAJOR_ROLES = new Set(["subject", "verb", "complement", "object", "title", "subtitle"]);
const BE_VERBS = new Set(["am", "are", "is", "was", "were", "be", "been", "being"]);
const COMMON_VERBS = new Set([
  "read", "reads", "reading", "wrote", "write", "writes", "study", "studies",
  "studied", "learn", "learns", "learned", "saw", "see", "sees", "make",
  "makes", "made", "take", "takes", "took", "give", "gives", "gave", "go",
  "goes", "went", "come", "comes", "came", "think", "thinks", "thought",
  "feel", "feels", "felt", "look", "looks", "looked", "become", "became",
  "seem", "seems", "seemed", "have", "has", "had", "do", "does", "did",
  "can", "could", "will", "would", "should", "may", "might", "must"
]);
const PREPOSITIONS = new Set([
  "in", "on", "at", "by", "for", "from", "to", "with", "without", "about", "of",
  "before", "after", "during", "through", "under", "over", "into", "near",
  "around", "because", "while"
]);
const APOSTROPHE_LIKE_PATTERN = /[\u0060\u00b4\u2018\u2019\u201b\u2032\u02bb\u02bc\uff07]/g;
const CONTRACTION_SUFFIXES = new Set(["s", "t", "re", "ve", "ll", "d", "m"]);
const MINOR_ANCHOR_SPREAD = 11.0;
const SAMPLE_TEXT = "The young students read the story carefully. Their teacher explained the difficult words on the board. They were extremely excited about the new lesson yesterday.";
const EXPORT_MARKER = "WHITEBOARD_PPT_ANALYSIS_TXT_V1";
const EXPORT_JSON_START = "-----BEGIN WHITEBOARD_PPT_ANALYSIS_JSON-----";
const EXPORT_JSON_END = "-----END WHITEBOARD_PPT_ANALYSIS_JSON-----";
const QUICK_TXT_DATA = {
  "p30.txt": `WHITEBOARD_PPT_ANALYSIS_TXT_V1
영어 문장 분석 저장 파일
저장 시각: 2026-05-30T15:27:29.029Z
총 문장 수: 3

[문장 및 성분 인덱스]

[문장 1] In 1835, the New York Sun newspaper caused a big stir with a series of articles claiming that life had been discovered on the moon.
  단어 수: 25
  - 성분 1: id=s1-c1-0, lane=minor, role=adverb, order=1, wordIndex0=0-2, wordIndex1=1-2, text="In 1835,"
  - 성분 2: id=s1-c1-0, lane=major, role=subject, order=1, wordIndex0=2-7, wordIndex1=3-7, text="the New York Sun newspaper"
  - 성분 3: id=s1-c1-0, lane=major, role=verb, order=2, wordIndex0=7-8, wordIndex1=8-8, text="caused"
  - 성분 4: id=s1-c1-0, lane=major, role=object, order=3, wordIndex0=8-11, wordIndex1=9-11, text="a big stir"
  - 성분 5: id=s1-c1-0, lane=minor, role=adverb, order=2, wordIndex0=11-16, wordIndex1=12-16, text="with a series of articles"
  - 성분 6: id=s1-c1-0, lane=minor, role=adjective, order=3, wordIndex0=16-25, wordIndex1=17-25, text="claiming that life had been discovered on the moon."

[문장 2] The articles described in great detail the moon's beautiful landscapes as well as the existence of strange, magical creatures that looked like bat-like humanoids with wings.
  단어 수: 26
  - 성분 1: id=s2-c1-0, lane=major, role=subject, order=1, wordIndex0=0-2, wordIndex1=1-2, text="The articles"
  - 성분 2: id=s2-c1-0, lane=major, role=verb, order=2, wordIndex0=2-3, wordIndex1=3-3, text="described"
  - 성분 3: id=s2-c1-0, lane=minor, role=adverb, order=1, wordIndex0=3-6, wordIndex1=4-6, text="in great detail"
  - 성분 4: id=s2-c1-0, lane=major, role=object, order=3, wordIndex0=6-19, wordIndex1=7-19, text="the moon's beautiful landscapes as well as the existence of strange, magical creatures"
  - 성분 5: id=s2-c2-0, lane=minor, role=adjective, order=2, wordIndex0=19-26, wordIndex1=20-26, text="that looked like bat-like humanoids with wings."

[문장 3] These discoveries were supposedly made by Dr. Andrew Grant, a character created for the hoax, who was falsely said to be working with the real astronomer Sir John Herschel.
  단어 수: 29
  - 성분 1: id=s3-c1-0, lane=major, role=subject, order=1, wordIndex0=0-2, wordIndex1=1-2, text="These discoveries"
  - 성분 2: id=s3-c2-0-s3-c3-0-u64, lane=major, role=verb, order=2, wordIndex0=2-5, wordIndex1=3-5, text="were made"
  - 성분 3: id=s3-c4-0, lane=minor, role=adverb, order=1, wordIndex0=3-4, wordIndex1=4-4, text="supposedly"
  - 성분 4: id=s3-c5-1-s3-c6-2-u65-u66, lane=minor, role=adverb, order=2, wordIndex0=5-15, wordIndex1=6-15, text="by Dr. Andrew Grant, a character created for the hoax,"
  - 성분 5: id=s3-c5-1-s3-c6-2-u65-u67-s3-c7-3-s3-c8-4-u68-s3-c9-5-u69-s3-c10-6-u70-u71, lane=minor, role=adjective, order=3, wordIndex0=15-29, wordIndex1=16-29, text="who was falsely said to be working with the real astronomer Sir John Herschel."

-----BEGIN WHITEBOARD_PPT_ANALYSIS_JSON-----
{
  "version": 1,
  "app": "sentence-presentation-board",
  "savedAt": "2026-05-30T15:27:29.029Z",
  "passageText": "In 1835, the New York Sun newspaper caused a big stir with a series of articles claiming that life had been discovered on the moon. The articles described in great detail the moon's beautiful landscapes as well as the existence of strange, magical creatures that looked like bat-like humanoids with wings. These discoveries were supposedly made by Dr. Andrew Grant, a character created for the hoax, who was falsely said to be working with the real astronomer Sir John Herschel.",
  "currentSentenceIndex": 2,
  "componentSerial": 71,
  "settings": {
    "theme": "light",
    "align": "center"
  },
  "sentences": [
    {
      "id": "sentence-1",
      "sentenceIndex": 1,
      "text": "In 1835, the New York Sun newspaper caused a big stir with a series of articles claiming that life had been discovered on the moon.",
      "wordCount": 25,
      "components": [
        {
          "id": "s1-c1-0",
          "sentenceIndex": 1,
          "componentIndex": 1,
          "text": "In 1835,",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 0,
          "endIndex": 2,
          "words": [
            "In",
            "1835,"
          ]
        },
        {
          "id": "s1-c1-0",
          "sentenceIndex": 1,
          "componentIndex": 2,
          "text": "the New York Sun newspaper",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 2,
          "endIndex": 7,
          "words": [
            "the",
            "New",
            "York",
            "Sun",
            "newspaper"
          ]
        },
        {
          "id": "s1-c1-0",
          "sentenceIndex": 1,
          "componentIndex": 3,
          "text": "caused",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 7,
          "endIndex": 8,
          "words": [
            "caused"
          ]
        },
        {
          "id": "s1-c1-0",
          "sentenceIndex": 1,
          "componentIndex": 4,
          "text": "a big stir",
          "role": "object",
          "lane": "major",
          "order": 3,
          "startIndex": 8,
          "endIndex": 11,
          "words": [
            "a",
            "big",
            "stir"
          ]
        },
        {
          "id": "s1-c1-0",
          "sentenceIndex": 1,
          "componentIndex": 5,
          "text": "with a series of articles",
          "role": "adverb",
          "lane": "minor",
          "order": 2,
          "startIndex": 11,
          "endIndex": 16,
          "words": [
            "with",
            "a",
            "add",
            "series",
            "of",
            "articles"
          ]
        },
        {
          "id": "s1-c1-0",
          "sentenceIndex": 1,
          "componentIndex": 6,
          "text": "claiming that life had been discovered on the moon.",
          "role": "adjective",
          "lane": "minor",
          "order": 3,
          "startIndex": 16,
          "endIndex": 25,
          "modifierTargetStart": 12,
          "modifierTargetEnd": 16,
          "modifierTargetIndexes": [
            12,
            13,
            14,
            15
          ],
          "words": [
            "claiming",
            "that",
            "life",
            "had",
            "been",
            "discovered",
            "on",
            "the",
            "moon."
          ]
        }
      ]
    },
    {
      "id": "sentence-2",
      "sentenceIndex": 2,
      "text": "The articles described in great detail the moon's beautiful landscapes as well as the existence of strange, magical creatures that looked like bat-like humanoids with wings.",
      "wordCount": 26,
      "components": [
        {
          "id": "s2-c1-0",
          "sentenceIndex": 2,
          "componentIndex": 1,
          "text": "The articles",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 0,
          "endIndex": 2,
          "words": [
            "The",
            "articles"
          ]
        },
        {
          "id": "s2-c1-0",
          "sentenceIndex": 2,
          "componentIndex": 2,
          "text": "described",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 2,
          "endIndex": 3,
          "words": [
            "described"
          ]
        },
        {
          "id": "s2-c1-0",
          "sentenceIndex": 2,
          "componentIndex": 3,
          "text": "in great detail",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 3,
          "endIndex": 6,
          "words": [
            "in",
            "great",
            "detail"
          ]
        },
        {
          "id": "s2-c1-0",
          "sentenceIndex": 2,
          "componentIndex": 4,
          "text": "the moon's beautiful landscapes as well as the existence of strange, magical creatures",
          "role": "object",
          "lane": "major",
          "order": 3,
          "startIndex": 6,
          "endIndex": 19,
          "words": [
            "the",
            "moon's",
            "beautiful",
            "landscapes",
            "as",
            "well",
            "as",
            "the",
            "existence",
            "of",
            "strange,",
            "magical",
            "creatures"
          ]
        },
        {
          "id": "s2-c2-0",
          "sentenceIndex": 2,
          "componentIndex": 5,
          "text": "that looked like bat-like humanoids with wings.",
          "role": "adjective",
          "lane": "minor",
          "order": 2,
          "startIndex": 19,
          "endIndex": 26,
          "modifierTargetStart": 16,
          "modifierTargetEnd": 19,
          "modifierTargetIndexes": [
            16,
            17,
            18
          ],
          "words": [
            "that",
            "looked",
            "like",
            "bat-like",
            "humanoids",
            "with",
            "wings."
          ]
        }
      ]
    },
    {
      "id": "sentence-3",
      "sentenceIndex": 3,
      "text": "These discoveries were supposedly made by Dr. Andrew Grant, a character created for the hoax, who was falsely said to be working with the real astronomer Sir John Herschel.",
      "wordCount": 29,
      "components": [
        {
          "id": "s3-c1-0",
          "sentenceIndex": 3,
          "componentIndex": 1,
          "text": "These discoveries",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 0,
          "endIndex": 2,
          "words": [
            "These",
            "discoveries"
          ]
        },
        {
          "id": "s3-c2-0-s3-c3-0-u64",
          "sentenceIndex": 3,
          "componentIndex": 2,
          "text": "were made",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 2,
          "endIndex": 5,
          "words": [
            "were",
            "made"
          ]
        },
        {
          "id": "s3-c4-0",
          "sentenceIndex": 3,
          "componentIndex": 3,
          "text": "supposedly",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 3,
          "endIndex": 4,
          "words": [
            "supposedly"
          ]
        },
        {
          "id": "s3-c5-1-s3-c6-2-u65-u66",
          "sentenceIndex": 3,
          "componentIndex": 4,
          "text": "by Dr. Andrew Grant, a character created for the hoax,",
          "role": "adverb",
          "lane": "minor",
          "order": 2,
          "startIndex": 5,
          "endIndex": 15,
          "words": [
            "by",
            "Dr.",
            "Andrew",
            "Grant,",
            "a",
            "character",
            "created",
            "for",
            "the",
            "hoax,"
          ]
        },
        {
          "id": "s3-c5-1-s3-c6-2-u65-u67-s3-c7-3-s3-c8-4-u68-s3-c9-5-u69-s3-c10-6-u70-u71",
          "sentenceIndex": 3,
          "componentIndex": 5,
          "text": "who was falsely said to be working with the real astronomer Sir John Herschel.",
          "role": "adjective",
          "lane": "minor",
          "order": 3,
          "startIndex": 15,
          "endIndex": 29,
          "modifierTargetStart": 6,
          "modifierTargetEnd": 15,
          "modifierTargetIndexes": [
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14
          ],
          "words": [
            "who",
            "was",
            "falsely",
            "said",
            "to",
            "be",
            "working",
            "with",
            "the",
            "real",
            "astronomer",
            "Sir",
            "John",
            "Herschel."
          ]
        }
      ]
    }
  ]
}
-----END WHITEBOARD_PPT_ANALYSIS_JSON-----`,
  "p31.txt": `WHITEBOARD_PPT_ANALYSIS_TXT_V1
영어 문장 분석 저장 파일
저장 시각: 2026-05-30T17:46:20.111Z
총 문장 수: 3

[문장 및 성분 인덱스]

[문장 1] In 1835, the New York Sun newspaper caused a big stir with a series of articles claiming that life had been discovered on the moon.
  단어 수: 25
  - 성분 1: id=s1-c1, lane=minor, role=adverb, order=1, wordIndex0=2-4, wordIndex1=3-4, text="In 1835,"
  - 성분 2: id=s1-c2, lane=major, role=subject, order=1, wordIndex0=2-7, wordIndex1=3-7, text="the New York Sun newspaper"
  - 성분 3: id=s1-c3, lane=major, role=verb, order=2, wordIndex0=7-8, wordIndex1=8-8, text="caused"
  - 성분 4: id=s1-c4, lane=major, role=object, order=3, wordIndex0=8-11, wordIndex1=9-11, text="a big stir"
  - 성분 5: id=s1-c5, lane=minor, role=adverb, order=2, wordIndex0=11-16, wordIndex1=12-16, text="with a series of articles"
  - 성분 6: id=s1-c6, lane=minor, role=adjective, order=3, wordIndex0=16-25, wordIndex1=17-25, text="claiming that life had been discovered on the moon."

[문장 2] The articles described in great detail the moon's beautiful landscapes as well as the existence of strange, magical creatures that looked like bat-like humanoids with wings.
  단어 수: 26
  - 성분 1: id=s2-c1, lane=major, role=subject, order=1, wordIndex0=0-2, wordIndex1=1-2, text="The articles"
  - 성분 2: id=s2-c2, lane=major, role=verb, order=2, wordIndex0=2-3, wordIndex1=3-3, text="described"
  - 성분 3: id=s2-c3, lane=minor, role=adverb, order=1, wordIndex0=3-6, wordIndex1=4-6, text="in great detail"
  - 성분 4: id=s2-c4, lane=major, role=object, order=3, wordIndex0=6-19, wordIndex1=7-19, text="the moon's beautiful landscapes as well as the existence of strange, magical creatures"
  - 성분 5: id=s2-c5, lane=minor, role=adjective, order=2, wordIndex0=19-26, wordIndex1=20-26, text="that looked like bat-like humanoids with wings."

[문장 3] These discoveries were supposedly made by Dr. Andrew Grant, a character created for the hoax, who was falsely said to be working with the real astronomer Sir John Herschel.
  단어 수: 29
  - 성분 1: id=s3-c1, lane=major, role=subject, order=1, wordIndex0=0-2, wordIndex1=1-2, text="These discoveries"
  - 성분 2: id=s3-c2, lane=major, role=verb, order=2, wordIndex0=2-5, wordIndex1=3-5, text="were made"
  - 성분 3: id=s3-c3, lane=minor, role=adverb, order=1, wordIndex0=3-4, wordIndex1=4-4, text="supposedly"
  - 성분 4: id=s3-c4, lane=minor, role=adverb, order=2, wordIndex0=5-15, wordIndex1=6-15, text="by Dr. Andrew Grant, a character created for the hoax,"
  - 성분 5: id=s3-c5, lane=minor, role=adjective, order=3, wordIndex0=15-29, wordIndex1=16-29, text="who was falsely said to be working with the real astronomer Sir John Herschel."

-----BEGIN WHITEBOARD_PPT_ANALYSIS_JSON-----
{
  "version": 1,
  "app": "sentence-presentation-board",
  "savedAt": "2026-05-30T17:46:20.111Z",
  "passageText": "In 1835, the New York Sun newspaper caused a big stir with a series of articles claiming that life had been discovered on the moon. The articles described in great detail the moon's beautiful landscapes as well as the existence of strange, magical creatures that looked like bat-like humanoids with wings. These discoveries were supposedly made by Dr. Andrew Grant, a character created for the hoax, who was falsely said to be working with the real astronomer Sir John Herschel.",
  "currentSentenceIndex": 1,
  "componentSerial": 36,
  "sentences": [
    {
      "id": "sentence-1",
      "sentenceIndex": 1,
      "text": "In 1835, the New York Sun newspaper caused a big stir with a series of articles claiming that life had been discovered on the moon.",
      "wordCount": 25,
      "components": [
        {
          "id": "s1-c1",
          "sentenceIndex": 1,
          "componentIndex": 1,
          "text": "In 1835,",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 2,
          "endIndex": 4,
          "pinnedAnchor": true,
          "words": [
            "In",
            "1835,"
          ]
        },
        {
          "id": "s1-c2",
          "sentenceIndex": 1,
          "componentIndex": 2,
          "text": "the New York Sun newspaper",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 2,
          "endIndex": 7,
          "words": [
            "the",
            "New",
            "York",
            "Sun",
            "newspaper"
          ]
        },
        {
          "id": "s1-c3",
          "sentenceIndex": 1,
          "componentIndex": 3,
          "text": "caused",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 7,
          "endIndex": 8,
          "words": [
            "caused"
          ]
        },
        {
          "id": "s1-c4",
          "sentenceIndex": 1,
          "componentIndex": 4,
          "text": "a big stir",
          "role": "object",
          "lane": "major",
          "order": 3,
          "startIndex": 8,
          "endIndex": 11,
          "words": [
            "a",
            "big",
            "stir"
          ]
        },
        {
          "id": "s1-c5",
          "sentenceIndex": 1,
          "componentIndex": 5,
          "text": "with a series of articles",
          "role": "adverb",
          "lane": "minor",
          "order": 2,
          "startIndex": 11,
          "endIndex": 16,
          "pinnedAnchor": true,
          "words": [
            "with",
            "a",
            "series",
            "of",
            "articles"
          ]
        },
        {
          "id": "s1-c6",
          "sentenceIndex": 1,
          "componentIndex": 6,
          "text": "claiming that life had been discovered on the moon.",
          "role": "adjective",
          "lane": "minor",
          "order": 3,
          "startIndex": 16,
          "endIndex": 25,
          "modifierTargetStart": 12,
          "modifierTargetEnd": 16,
          "modifierTargetIndexes": [
            12,
            13,
            14,
            15
          ],
          "words": [
            "claiming",
            "that",
            "life",
            "had",
            "been",
            "discovered",
            "on",
            "the",
            "moon."
          ]
        }
      ]
    },
    {
      "id": "sentence-2",
      "sentenceIndex": 2,
      "text": "The articles described in great detail the moon's beautiful landscapes as well as the existence of strange, magical creatures that looked like bat-like humanoids with wings.",
      "wordCount": 26,
      "components": [
        {
          "id": "s2-c1",
          "sentenceIndex": 2,
          "componentIndex": 1,
          "text": "The articles",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 0,
          "endIndex": 2,
          "words": [
            "The",
            "articles"
          ]
        },
        {
          "id": "s2-c2",
          "sentenceIndex": 2,
          "componentIndex": 2,
          "text": "described",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 2,
          "endIndex": 3,
          "words": [
            "described"
          ]
        },
        {
          "id": "s2-c3",
          "sentenceIndex": 2,
          "componentIndex": 3,
          "text": "in great detail",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 3,
          "endIndex": 6,
          "words": [
            "in",
            "great",
            "detail"
          ]
        },
        {
          "id": "s2-c4",
          "sentenceIndex": 2,
          "componentIndex": 4,
          "text": "the moon's beautiful landscapes as well as the existence of strange, magical creatures",
          "role": "object",
          "lane": "major",
          "order": 3,
          "startIndex": 6,
          "endIndex": 19,
          "words": [
            "the",
            "moon's",
            "beautiful",
            "landscapes",
            "as",
            "well",
            "as",
            "the",
            "existence",
            "of",
            "strange,",
            "magical",
            "creatures"
          ]
        },
        {
          "id": "s2-c5",
          "sentenceIndex": 2,
          "componentIndex": 5,
          "text": "that looked like bat-like humanoids with wings.",
          "role": "adjective",
          "lane": "minor",
          "order": 2,
          "startIndex": 19,
          "endIndex": 26,
          "modifierTargetStart": 16,
          "modifierTargetEnd": 26,
          "modifierTargetIndexes": [
            16,
            17,
            18,
            24,
            25
          ],
          "words": [
            "that",
            "looked",
            "like",
            "bat-like",
            "humanoids",
            "with",
            "wings."
          ]
        }
      ]
    },
    {
      "id": "sentence-3",
      "sentenceIndex": 3,
      "text": "These discoveries were supposedly made by Dr. Andrew Grant, a character created for the hoax, who was falsely said to be working with the real astronomer Sir John Herschel.",
      "wordCount": 29,
      "components": [
        {
          "id": "s3-c1",
          "sentenceIndex": 3,
          "componentIndex": 1,
          "text": "These discoveries",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 0,
          "endIndex": 2,
          "words": [
            "These",
            "discoveries"
          ]
        },
        {
          "id": "s3-c2",
          "sentenceIndex": 3,
          "componentIndex": 2,
          "text": "were made",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 2,
          "endIndex": 5,
          "words": [
            "were",
            "made"
          ]
        },
        {
          "id": "s3-c3",
          "sentenceIndex": 3,
          "componentIndex": 3,
          "text": "supposedly",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 3,
          "endIndex": 4,
          "words": [
            "supposedly"
          ]
        },
        {
          "id": "s3-c4",
          "sentenceIndex": 3,
          "componentIndex": 4,
          "text": "by Dr. Andrew Grant, a character created for the hoax,",
          "role": "adverb",
          "lane": "minor",
          "order": 2,
          "startIndex": 5,
          "endIndex": 15,
          "words": [
            "by",
            "Dr.",
            "Andrew",
            "Grant,",
            "a",
            "character",
            "created",
            "for",
            "the",
            "hoax,"
          ]
        },
        {
          "id": "s3-c5",
          "sentenceIndex": 3,
          "componentIndex": 5,
          "text": "who was falsely said to be working with the real astronomer Sir John Herschel.",
          "role": "adjective",
          "lane": "minor",
          "order": 3,
          "startIndex": 15,
          "endIndex": 29,
          "modifierTargetStart": 6,
          "modifierTargetEnd": 15,
          "modifierTargetIndexes": [
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14
          ],
          "words": [
            "who",
            "was",
            "falsely",
            "said",
            "to",
            "be",
            "working",
            "with",
            "the",
            "real",
            "astronomer",
            "Sir",
            "John",
            "Herschel."
          ]
        }
      ]
    }
  ]
}
-----END WHITEBOARD_PPT_ANALYSIS_JSON-----`,
  "p32.txt": `WHITEBOARD_PPT_ANALYSIS_TXT_V1
영어 문장 분석 저장 파일
저장 시각: 2026-05-30T18:18:20.104Z
총 문장 수: 3

[문장 및 성분 인덱스]

[문장 1] The story claimed that these amazing discoveries were possible due to a powerful new telescope in South Africa, where Herschel was actually doing genuine research at the time.
  단어 수: 28
  - 성분 1: id=s1-c1-0-u3-u5-s1-c2-0-u6-s1-c3-0-u7-s1-c4-0-u8-s1-c5-1-u9-s1-c6-2-u10-s1-c7-3-u11-s1-c8-4-u12-u16, lane=major, role=object, order=3, wordIndex0=3-9, wordIndex1=4-9, text="that these amazing discoveries were possible"
  - 성분 2: id=s1-c1-0-u3-u5-s1-c2-0-u6-s1-c3-0-u7-s1-c4-0-u8-s1-c5-1-u9-s1-c6-2-u10-s1-c7-3-u11-s1-c8-4-u12-u17-u18, lane=minor, role=adverb, order=1, wordIndex0=9-18, wordIndex1=10-18, text="due to a powerful new telescope in South Africa,"
  - 성분 3: id=s1-c1-0-u3-u5-s1-c2-0-u6-s1-c3-0-u7-s1-c4-0-u8-s1-c5-1-u9-s1-c6-2-u10-s1-c7-3-u11-s1-c8-4-u12-u17-u19, lane=minor, role=adjective, order=2, wordIndex0=18-28, wordIndex1=19-28, text="where Herschel was actually doing genuine research at the time."
  - 성분 4: id=s1-c1-0-u3-u4-s1-c1-0-u2-u13-u14, lane=major, role=subject, order=1, wordIndex0=0-2, wordIndex1=1-2, text="The story"
  - 성분 5: id=s1-c1-0-u3-u4-s1-c1-0-u2-u13-u15, lane=major, role=verb, order=2, wordIndex0=2-3, wordIndex1=3-3, text="claimed"

[문장 2] However, the story was completely made up by New York Sun reporter Richard Adams Locke.
  단어 수: 15
  - 성분 1: id=s2-c1-0-u20, lane=minor, role=adverb, order=1, wordIndex0=1-2, wordIndex1=2-2, text="However,"
  - 성분 2: id=s2-c1-0-u21, lane=major, role=subject, order=1, wordIndex0=1-3, wordIndex1=2-3, text="the story"
  - 성분 3: id=s2-c2-0-s2-c3-0-u22, lane=major, role=verb, order=2, wordIndex0=3-7, wordIndex1=4-7, text="was made up"
  - 성분 4: id=s2-c4-0, lane=minor, role=adverb, order=2, wordIndex0=4-5, wordIndex1=5-5, text="completely"
  - 성분 5: id=s2-c5-1, lane=minor, role=adverb, order=3, wordIndex0=6-14, wordIndex1=7-14, text="by New York Sun reporter Richard Adams Locke."

[문장 3] Locke created the hoax to satirize how fascinated people were with the idea of life on other planets and how easily they believed wild, unproven claims.
  단어 수: 26
  - 성분 1: id=s3-c1-0-u23, lane=major, role=subject, order=1, wordIndex0=0-1, wordIndex1=1-1, text="Locke"
  - 성분 2: id=s3-c1-0-u24-u25, lane=major, role=verb, order=2, wordIndex0=1-2, wordIndex1=2-2, text="created"
  - 성분 3: id=s3-c1-0-u24-u26-u27, lane=major, role=object, order=3, wordIndex0=2-4, wordIndex1=3-4, text="the hoax"
  - 성분 4: id=s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u56-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u57-u58-u59, lane=minor, role=adverb, order=1, wordIndex0=4-18, wordIndex1=5-18, text="to satirize how fascinated people were with the idea of life on other planets"
  - 성분 5: id=s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u56-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u57-u58-u60, lane=minor, role=adverb, order=2, wordIndex0=18-26, wordIndex1=19-26, text="and how easily they believed wild, unproven claims."

-----BEGIN WHITEBOARD_PPT_ANALYSIS_JSON-----
{
  "version": 1,
  "app": "sentence-presentation-board",
  "savedAt": "2026-05-30T18:18:20.104Z",
  "passageText": "The story claimed that these amazing discoveries were possible due to a powerful new telescope in South Africa, where Herschel was actually doing genuine research at the time. However, the story was completely made up by New York Sun reporter Richard Adams Locke. Locke created the hoax to satirize how fascinated people were with the idea of life on other planets and how easily they believed wild, unproven claims.",
  "currentSentenceIndex": 2,
  "componentSerial": 60,
  "settings": {
    "theme": "light",
    "align": "center"
  },
  "sentences": [
    {
      "id": "sentence-1",
      "sentenceIndex": 1,
      "text": "The story claimed that these amazing discoveries were possible due to a powerful new telescope in South Africa, where Herschel was actually doing genuine research at the time.",
      "wordCount": 28,
      "components": [
        {
          "id": "s1-c1-0-u3-u5-s1-c2-0-u6-s1-c3-0-u7-s1-c4-0-u8-s1-c5-1-u9-s1-c6-2-u10-s1-c7-3-u11-s1-c8-4-u12-u16",
          "sentenceIndex": 1,
          "componentIndex": 1,
          "text": "that these amazing discoveries were possible",
          "role": "object",
          "lane": "major",
          "order": 3,
          "startIndex": 3,
          "endIndex": 9,
          "words": [
            "that",
            "these",
            "amazing",
            "discoveries",
            "were",
            "possible"
          ]
        },
        {
          "id": "s1-c1-0-u3-u5-s1-c2-0-u6-s1-c3-0-u7-s1-c4-0-u8-s1-c5-1-u9-s1-c6-2-u10-s1-c7-3-u11-s1-c8-4-u12-u17-u18",
          "sentenceIndex": 1,
          "componentIndex": 2,
          "text": "due to a powerful new telescope in South Africa,",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 9,
          "endIndex": 18,
          "words": [
            "due",
            "to",
            "a",
            "powerful",
            "new",
            "telescope",
            "in",
            "South",
            "Africa,"
          ]
        },
        {
          "id": "s1-c1-0-u3-u5-s1-c2-0-u6-s1-c3-0-u7-s1-c4-0-u8-s1-c5-1-u9-s1-c6-2-u10-s1-c7-3-u11-s1-c8-4-u12-u17-u19",
          "sentenceIndex": 1,
          "componentIndex": 3,
          "text": "where Herschel was actually doing genuine research at the time.",
          "role": "adjective",
          "lane": "minor",
          "order": 2,
          "startIndex": 18,
          "endIndex": 28,
          "modifierTargetStart": 11,
          "modifierTargetEnd": 18,
          "modifierTargetIndexes": [
            11,
            12,
            13,
            14,
            15,
            16,
            17
          ],
          "words": [
            "where",
            "Herschel",
            "was",
            "actually",
            "doing",
            "genuine",
            "research",
            "at",
            "the",
            "time."
          ]
        },
        {
          "id": "s1-c1-0-u3-u4-s1-c1-0-u2-u13-u14",
          "sentenceIndex": 1,
          "componentIndex": 4,
          "text": "The story",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 0,
          "endIndex": 2,
          "words": [
            "The",
            "story"
          ]
        },
        {
          "id": "s1-c1-0-u3-u4-s1-c1-0-u2-u13-u15",
          "sentenceIndex": 1,
          "componentIndex": 5,
          "text": "claimed",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 2,
          "endIndex": 3,
          "words": [
            "claimed"
          ]
        }
      ]
    },
    {
      "id": "sentence-2",
      "sentenceIndex": 2,
      "text": "However, the story was completely made up by New York Sun reporter Richard Adams Locke.",
      "wordCount": 15,
      "components": [
        {
          "id": "s2-c1-0-u20",
          "sentenceIndex": 2,
          "componentIndex": 1,
          "text": "However,",
          "role": "adverb",
          "lane": "minor",
          "order": 1,
          "startIndex": 1,
          "endIndex": 2,
          "pinnedAnchor": true,
          "words": [
            "However,"
          ]
        },
        {
          "id": "s2-c1-0-u21",
          "sentenceIndex": 2,
          "componentIndex": 2,
          "text": "the story",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 1,
          "endIndex": 3,
          "words": [
            "the",
            "story"
          ]
        },
        {
          "id": "s2-c2-0-s2-c3-0-u22",
          "sentenceIndex": 2,
          "componentIndex": 3,
          "text": "was made up",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 3,
          "endIndex": 7,
          "words": [
            "was",
            "made",
            "up"
          ]
        },
        {
          "id": "s2-c4-0",
          "sentenceIndex": 2,
          "componentIndex": 4,
          "text": "completely",
          "role": "adverb",
          "lane": "minor",
          "order": 2,
          "startIndex": 4,
          "endIndex": 5,
          "words": [
            "completely"
          ]
        },
        {
          "id": "s2-c5-1",
          "sentenceIndex": 2,
          "componentIndex": 5,
          "text": "by New York Sun reporter Richard Adams Locke.",
          "role": "adverb",
          "lane": "minor",
          "order": 3,
          "startIndex": 6,
          "endIndex": 14,
          "pinnedAnchor": true,
          "words": [
            "by",
            "New",
            "York",
            "Sun",
            "reporter",
            "Richard",
            "Adams",
            "Locke."
          ]
        }
      ]
    },
    {
      "id": "sentence-3",
      "sentenceIndex": 3,
      "text": "Locke created the hoax to satirize how fascinated people were with the idea of life on other planets and how easily they believed wild, unproven claims.",
      "wordCount": 26,
      "components": [
        {
          "id": "s3-c1-0-u23",
          "sentenceIndex": 3,
          "componentIndex": 1,
          "text": "Locke",
          "role": "subject",
          "lane": "major",
          "order": 1,
          "startIndex": 0,
          "endIndex": 1,
          "words": [
            "Locke"
          ]
        },
        {
          "id": "s3-c1-0-u24-u25",
          "sentenceIndex": 3,
          "componentIndex": 2,
          "text": "created",
          "role": "verb",
          "lane": "major",
          "order": 2,
          "startIndex": 1,
          "endIndex": 2,
          "words": [
            "created"
          ]
        },
        {
          "id": "s3-c1-0-u24-u26-u27",
          "sentenceIndex": 3,
          "componentIndex": 3,
          "text": "the hoax",
          "role": "object",
          "lane": "major",
          "order": 3,
          "startIndex": 2,
          "endIndex": 4,
          "words": [
            "the",
            "hoax"
          ]
        },
        {
          "id": "s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u56-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u57-u58-u59, lane=minor, role=adverb, order=1, wordIndex0=4-18, wordIndex1=5-18, text="to satirize how fascinated people were with the idea of life on other planets"
        },
        {
          "id": "s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u45-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u44-u47-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u35-s3-c5-1-u42-u43-u46-u48-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u53-u54-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u50-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u40-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u31-s3-c4-0-u33-s3-c6-2-u34-u36-s3-c1-0-u24-u26-u28-s3-c2-0-u29-s3-c3-0-u30-u32-u37-s3-c7-3-u38-u39-u41-u49-u51-u52-u55-u57-u58-u60, lane=minor, role=adverb, order=2, wordIndex0=18-26, wordIndex1=19-26, text="and how easily they believed wild, unproven claims."
        }
      ]
    }
  ]
}
-----END WHITEBOARD_PPT_ANALYSIS_JSON-----`
};

const QUICK_TXT_FILES = Object.keys(QUICK_TXT_DATA);

const state = {
  passageText: "",
  sentences: [],
  currentSentenceIndex: 0,
  componentSerial: 1,
  mode: "input",
  settings: {
    theme: "light",
    align: "center"
  },
  draggedComponentId: null,
  minorRevealCount: 0,
  minorSlots: [],
  lastModifierClickIndex: null,
  lastModifierComponentId: null,
  quickFilesMap: new Map(),
  hasFolderSelected: false,
  currentFileName: null,
  currentFileHandle: null,
  directoryHandle: null,
  hasLoadedAnalysis: false,
  focusedComponentId: null
};

const elements = {
  app: document.getElementById("app"),
  inputView: document.getElementById("inputView"),
  editView: document.getElementById("editView"),
  presentView: document.getElementById("presentView"),
  passageForm: document.getElementById("passageForm"),
  passageInput: document.getElementById("passageInput"),
  inputMessage: document.getElementById("inputMessage"),
  editMessage: document.getElementById("editMessage"),
  sampleButton: document.getElementById("sampleButton"),
  clearButton: document.getElementById("clearButton"),
  inputSaveTxtButton: document.getElementById("inputSaveTxtButton"),
  inputSaveAsTxtButton: document.getElementById("inputSaveAsTxtButton"),
  inputImportButton: document.getElementById("inputImportButton"),
  fileNameDisplay: document.getElementById("fileNameDisplay"),
  saveTxtButton: document.getElementById("saveTxtButton"),
  saveAsTxtButton: document.getElementById("saveAsTxtButton"),
  analysisFileInput: document.getElementById("analysisFileInput"),
  txtGrid: document.getElementById("txtGrid"),
  selectFolderButton: document.getElementById("selectFolderButton"),
  folderInput: document.getElementById("folderInput"),
  themeSelect: document.getElementById("themeSelect"),
  editProgress: document.getElementById("editProgress"),
  presentProgress: document.getElementById("presentProgress"),
  sentenceTextEditor: document.getElementById("sentenceTextEditor"),
  applySentenceTextButton: document.getElementById("applySentenceTextButton"),
  addSentenceButton: document.getElementById("addSentenceButton"),
  deleteSentenceButton: document.getElementById("deleteSentenceButton"),
  toggleImportantButton: document.getElementById("toggleImportantButton"),
  majorEditLane: document.getElementById("majorEditLane"),
  minorEditLane: document.getElementById("minorEditLane"),
  majorPresentLane: document.getElementById("majorPresentLane"),
  minorAnchorLane: document.getElementById("minorAnchorLane"),
  minorPresentLane: document.getElementById("minorPresentLane"),
  emptyMinorNote: document.getElementById("emptyMinorNote"),
  importantPresentNav: document.getElementById("importantPresentNav"),
  presentFitButton: document.getElementById("presentFitButton"),
  backToInputButton: document.getElementById("backToInputButton"),
  startPresentButton: document.getElementById("startPresentButton"),
  returnEditButton: document.getElementById("returnEditButton"),
  returnInputButton: document.getElementById("returnInputButton"),
  presentFirstSentenceButton: document.getElementById("presentFirstSentenceButton"),
  presentLastSentenceButton: document.getElementById("presentLastSentenceButton"),
  screenOffOverlay: document.getElementById("screenOffOverlay"),
  screenOnButton: document.getElementById("screenOnButton"),
  editFirstButton: document.getElementById("editFirstButton"),
  editPrevButton: document.getElementById("editPrevButton"),
  editNextButton: document.getElementById("editNextButton"),
  editLastButton: document.getElementById("editLastButton"),
  presentPrevButton: document.getElementById("presentPrevButton"),
  presentNextButton: document.getElementById("presentNextButton"),
  elementDetailOverlay: document.getElementById("elementDetailOverlay"),
  elementDetailRole: document.getElementById("elementDetailRole"),
  elementDetailText: document.getElementById("elementDetailText"),
  elementCloseButton: document.getElementById("elementCloseButton")
};

function splitSentences(text) {
  const normalized = normalizeApostrophes(text).trim();
  if (!normalized) {
    return [];
  }

  const tokens = [];
  const regex = /(\/\/[\s\S]*?\/\/)|(\/[^\/]+?\/)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(normalized)) !== null) {
    const beforeText = normalized.slice(lastIndex, match.index).trim();
    if (beforeText) {
      tokens.push(...splitPlainSentences(beforeText));
    }
    tokens.push(match[0].trim());
    lastIndex = regex.lastIndex;
  }

  const afterText = normalized.slice(lastIndex).trim();
  if (afterText) {
    tokens.push(...splitPlainSentences(afterText));
  }

  return tokens.filter(Boolean);
}

function splitPlainSentences(text) {
  const cleaned = text.replace(/\s+/g, " ");
  const matches = cleaned.match(/[^.!?]+[.!?]+["')\]]?|[^.!?]+$/g) || [];
  return matches.map((s) => s.trim()).filter(Boolean);
}

function analyzeSentence(sentenceText, sentenceIndex) {
  const isTitle = sentenceText.startsWith("//") && sentenceText.endsWith("//");
  const isSubtitle = !isTitle && sentenceText.startsWith("/") && sentenceText.endsWith("/");

  if (isTitle || isSubtitle) {
    const cleanText = isTitle 
      ? sentenceText.slice(2, -2).trim() 
      : sentenceText.slice(1, -1).trim();

    return [{
      id: `s${sentenceIndex + 1}-c1-0`,
      text: cleanText,
      role: isTitle ? "title" : "subtitle",
      lane: "major",
      startIndex: 0,
      endIndex: 1,
      order: 1
    }];
  }

  const displayWords = getDisplayWords(sentenceText);
  const plainWords = displayWords.map(getWordCore).filter(Boolean);

  if (plainWords.length === 0) {
    return [];
  }

  const verbIndex = findVerbIndex(plainWords);
  const subjectStart = 0;
  const subjectEnd = Math.max(verbIndex, 1);
  const verbStart = verbIndex;
  const verbEnd = Math.min(verbIndex + getVerbSpan(plainWords, verbIndex), plainWords.length);
  const verbWords = plainWords.slice(verbStart, verbEnd);
  const afterVerbStart = verbEnd;
  const afterVerb = plainWords.slice(afterVerbStart);
  const splitAfterVerb = splitMinorPhrase(afterVerb);
  const components = [];

  addComponent(components, sentenceIndex, "subject", displayWords.slice(subjectStart, subjectEnd), subjectStart, subjectEnd);
  addComponent(components, sentenceIndex, "verb", displayWords.slice(verbStart, verbEnd), verbStart, verbEnd);

  if (splitAfterVerb.core.length > 0) {
    const role = BE_VERBS.has(verbWords[verbWords.length - 1]?.toLowerCase()) ? "complement" : "object";
    const coreStart = afterVerbStart + splitAfterVerb.coreStartOffset;
    addComponent(components, sentenceIndex, role, displayWords.slice(coreStart, coreStart + splitAfterVerb.core.length), coreStart, coreStart + splitAfterVerb.core.length);
  }

  splitAfterVerb.minors.forEach((minor, index) => {
    const role = minor.words.some((word) => word.toLowerCase().endsWith("ly")) ? "adverb" : "adverb";
    const minorStart = afterVerbStart + minor.startOffset;
    addComponent(components, sentenceIndex, role, displayWords.slice(minorStart, minorStart + minor.words.length), minorStart, minorStart + minor.words.length, index);
  });

  if (components.length === 0) {
    addComponent(components, sentenceIndex, "subject", displayWords, 0, displayWords.length);
  }

  return components.map((component, order) => ({ ...component, order: order + 1 }));
}

function findVerbIndex(words) {
  const lowerWords = words.map((word) => word.toLowerCase());
  const explicitIndex = lowerWords.findIndex((word) => BE_VERBS.has(word) || COMMON_VERBS.has(word));
  if (explicitIndex > 0) {
    return explicitIndex;
  }

  const suffixIndex = lowerWords.findIndex((word, index) => index > 0 && /(ed|ing|s)$/.test(word));
  if (suffixIndex > 0) {
    return suffixIndex;
  }

  return Math.min(1, Math.max(0, words.length - 1));
}

function getVerbSpan(words, verbIndex) {
  const nextWord = words[verbIndex + 1]?.toLowerCase();
  if (nextWord && (COMMON_VERBS.has(nextWord) || nextWord.endsWith("ed") || nextWord.endsWith("ing"))) {
    return 2;
  }
  return 1;
}

function splitMinorPhrase(words) {
  const core = [];
  const minors = [];
  let coreStartOffset = null;
  let coreClosed = false;

  for (let index = 0; index < words.length; index += 1) {
    const lowerWord = words[index].toLowerCase();
    if (lowerWord.endsWith("ly")) {
      minors.push({ words: [words[index]], startOffset: index });
      if (core.length > 0) {
        coreClosed = true;
      }
      continue;
    }

    if (PREPOSITIONS.has(lowerWord)) {
      const startOffset = index;
      const phrase = [words[index]];
      if (core.length > 0) {
        coreClosed = true;
      }
      index += 1;
      while (index < words.length) {
        const nextLowerWord = words[index].toLowerCase();
        if (PREPOSITIONS.has(nextLowerWord) || nextLowerWord.endsWith("ly")) {
          index -= 1;
          break;
        }
        phrase.push(words[index]);
        index += 1;
      }
      minors.push({ words: phrase, startOffset });
      continue;
    }

    if (coreClosed) {
      const startOffset = index;
      const phrase = [words[index]];
      index += 1;
      while (index < words.length) {
        const nextLowerWord = words[index].toLowerCase();
        if (PREPOSITIONS.has(nextLowerWord) || nextLowerWord.endsWith("ly")) {
          index -= 1;
          break;
        }
        phrase.push(words[index]);
        index += 1;
      }
      minors.push({ words: phrase, startOffset });
      continue;
    }

    if (coreStartOffset === null) {
      coreStartOffset = index;
    }
    core.push(words[index]);
  }

  return {
    core,
    coreStartOffset: coreStartOffset ?? 0,
    minors
  };
}

function addComponent(collection, sentenceIndex, role, words, startIndex, endIndex, variant = 0) {
  const text = words.join(" ").trim();
  if (!text) {
    return;
  }

  collection.push({
    id: `s${sentenceIndex + 1}-c${collection.length + 1}-${variant}`,
    text,
    role,
    lane: ROLE_BY_VALUE[role].lane,
    startIndex,
    endIndex,
    order: collection.length + 1
  });
}

function preparePresentation() {
  const text = elements.passageInput.value;
  const sentences = splitSentences(text);

  state.passageText = text;
  state.sentences = sentences.map((sentenceText, index) => ({
    id: `sentence-${index + 1}`,
    text: sentenceText,
    isImportant: false,
    wordCount: getPlainWords(sentenceText).length,
    components: analyzeSentence(sentenceText, index)
  }));
  state.currentSentenceIndex = 0;
  state.minorRevealCount = 0;
  state.componentSerial = 1;

  return state.sentences.length;
}

function setMode(mode) {
  const previousMode = state.mode;
  state.mode = mode;
  if (mode === "present" && previousMode !== "present") {
    state.minorRevealCount = 0;
  }
  elements.app.dataset.mode = mode;
  document.documentElement.classList.toggle("present-lock", mode === "present");
  elements.inputView.classList.toggle("hidden", mode !== "input");
  elements.editView.classList.toggle("hidden", mode !== "edit");
  elements.presentView.classList.toggle("hidden", mode !== "present");
  render();
}

function render() {
  applySettings();
  if (state.mode === "edit") {
    renderEditView();
  }
  if (state.mode === "present") {
    renderPresentView();
  }
}

function renderEditView() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  elements.editProgress.textContent = getProgressText();
  elements.sentenceTextEditor.value = sentence.text;

  // 중요 문장 지정 버튼 렌더링
  const isImp = sentence.isImportant === true;
  elements.toggleImportantButton.classList.toggle("is-important", isImp);
  elements.toggleImportantButton.innerHTML = isImp ? "★ 중요 지정 해제" : "☆ 중요 문장 지정";

  renderEditLane(elements.majorEditLane, getComponentsByLane(sentence, "major"));
  renderEditLane(elements.minorEditLane, getComponentsByLane(sentence, "minor"));
  updateNavButtons();

  // 동적 크기 조절 (세로 스크롤 방지)
  adjustEditViewScale();

  // 포커스 복원 처리
  if (state.focusedComponentId) {
    const chip = elements.majorEditLane.querySelector(`[data-component-id="${state.focusedComponentId}"]`) ||
                 elements.minorEditLane.querySelector(`[data-component-id="${state.focusedComponentId}"]`);
    const select = chip?.querySelector(".role-select") || chip?.querySelector(".custom-select");
    if (select) {
      select.focus();
    }
    state.focusedComponentId = null; // 초기화
  }
}

function adjustEditViewScale() {
  if (state.mode !== "edit") {
    return;
  }
  const editView = elements.editView;
  if (!editView) return;

  // 기본 인라인 스타일 초기화
  editView.style.removeProperty("--edit-font-size");
  editView.style.removeProperty("--edit-gap");

  let fontSize = 20; 
  let gap = 16;      
  let loopCount = 0;

  // 세로 스크롤바가 완전히 사라질 때까지 글자 크기와 줄간격을 점진적으로 축소
  while (document.documentElement.scrollHeight > window.innerHeight && fontSize > 8 && loopCount < 50) {
    fontSize -= 0.25;
    gap = Math.max(0, gap - 0.25);

    editView.style.setProperty("--edit-font-size", `${fontSize}px`);
    editView.style.setProperty("--edit-gap", `${gap}px`);
    loopCount++;
  }
}

function toggleImportantSentence() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }
  sentence.isImportant = !sentence.isImportant;
  render();
}

function renderEditLane(container, components) {
  container.innerHTML = "";
  components.forEach((component) => {
    container.appendChild(createEditChip(component));
  });
}

function createEditChip(component) {
  ensureModifierTarget(component);
  const chip = document.createElement("article");
  chip.className = "component-chip edit-chip";
  chip.draggable = true;
  chip.dataset.componentId = component.id;

  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.textContent = "::";
  handle.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "component-text";
  text.textContent = component.text;

  chip.appendChild(handle);

  const customSelect = document.createElement("div");
  customSelect.className = "custom-select";
  customSelect.setAttribute("tabindex", "0");
  customSelect.dataset.componentId = component.id;

  const currentRole = ROLE_OPTIONS.find((r) => r.value === component.role);
  const prefixMap = {
    subject: "1. ",
    verb: "2. ",
    complement: "3. ",
    object: "4. ",
    adjective: "5. ",
    adverb: "6. "
  };

  const trigger = document.createElement("button");
  trigger.className = "custom-select-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-label", `${component.text} 성분 역할 선택`);
  trigger.textContent = (prefixMap[component.role] || "") + (currentRole?.label || "");
  customSelect.appendChild(trigger);

  const optionsList = document.createElement("ul");
  optionsList.className = "custom-select-options hidden";
  customSelect.appendChild(optionsList);

  const items = [];
  ROLE_OPTIONS.forEach((role) => {
    const li = document.createElement("li");
    li.className = "custom-option";
    if (role.value === component.role) {
      li.classList.add("selected");
    }
    li.dataset.value = role.value;
    
    const numPrefix = prefixMap[role.value] || "";
    li.textContent = numPrefix + role.label;
    optionsList.appendChild(li);
    items.push(li);

    li.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateComponentRole(component.id, role.value);
    });
    li.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateComponentRole(component.id, role.value);
    });
  });

  let isOpen = false;
  let tempValue = component.role;

  const documentClickHandler = (e) => {
    if (!customSelect.contains(e.target)) {
      closeDropdown(false);
    }
  };

  const openDropdown = () => {
    document.querySelectorAll(".custom-select-options").forEach((ul) => {
      if (ul !== optionsList) ul.classList.add("hidden");
    });
    optionsList.classList.remove("hidden");
    isOpen = true;
    tempValue = component.role;
    updateHighlights();
    setTimeout(() => {
      document.addEventListener("click", documentClickHandler);
    }, 0);
  };

  const closeDropdown = (apply = false) => {
    optionsList.classList.add("hidden");
    isOpen = false;
    document.removeEventListener("click", documentClickHandler);
    if (apply && tempValue !== component.role) {
      updateComponentRole(component.id, tempValue);
    } else {
      const tempRole = ROLE_OPTIONS.find((r) => r.value === component.role);
      trigger.textContent = (prefixMap[component.role] || "") + (tempRole?.label || "");
    }
  };

  const updateHighlights = () => {
    items.forEach((item) => {
      const isTemp = item.dataset.value === tempValue;
      item.classList.toggle("highlighted", isTemp);
    });
    const tempRole = ROLE_OPTIONS.find((r) => r.value === tempValue);
    trigger.textContent = (prefixMap[tempValue] || "") + (tempRole?.label || "");
  };

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeDropdown(false);
    } else {
      openDropdown();
    }
  });

  customSelect.addEventListener("keydown", (e) => {
    const keyMap = {
      "1": "subject",
      "2": "verb",
      "3": "complement",
      "4": "object",
      "5": "adjective",
      "6": "adverb"
    };

    const targetRole = keyMap[e.key];
    if (targetRole) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        if (tempValue === targetRole) {
          closeDropdown(true);
        } else {
          tempValue = targetRole;
          updateHighlights();
        }
      } else {
        updateComponentRole(component.id, targetRole);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        closeDropdown(true);
      } else {
        openDropdown();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        closeDropdown(false);
      }
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      e.stopPropagation();
      const currentIndex = items.findIndex((item) => item.dataset.value === tempValue);
      const nextIndex = (currentIndex + 1) % items.length;
      tempValue = items[nextIndex].dataset.value;
      updateHighlights();
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      e.stopPropagation();
      const currentIndex = items.findIndex((item) => item.dataset.value === tempValue);
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      tempValue = items[prevIndex].dataset.value;
      updateHighlights();
    }
  });

  customSelect.addEventListener("focusout", (e) => {
    if (!customSelect.contains(e.relatedTarget)) {
      if (isOpen) {
        closeDropdown(false);
      }
    }
  });

  chip.appendChild(customSelect);

  chip.appendChild(text);

  if (component.lane === "minor") {
    const pinBtn = document.createElement("button");
    pinBtn.type = "button";
    pinBtn.className = "pin-order-btn";
    if (Number.isInteger(component.pinOrder) && component.pinOrder >= 1) {
      pinBtn.classList.add("pinned");
      pinBtn.innerHTML = `💡 <span class="pin-num">${component.pinOrder}</span>`;
      pinBtn.setAttribute("aria-label", `우선순위 ${component.pinOrder}번 해제`);
    } else {
      pinBtn.innerHTML = `💡`;
      pinBtn.setAttribute("aria-label", "우선순위 지정");
    }
    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleComponentPin(component.id);
    });
    chip.appendChild(pinBtn);
  }

  if (component.role === "adjective") {
    chip.appendChild(createModifierTargetControl(component));
  }
  if (getComponentWords(component).length > 1) {
    chip.appendChild(createSplitControls(component));
  }
  chip.addEventListener("dragstart", handleDragStart);
  chip.addEventListener("dragend", handleDragEnd);
  return chip;
}

function toggleComponentPin(componentId) {
  const sentence = getCurrentSentence();
  if (!sentence) return;

  const minorComponents = getComponentsByLane(sentence, "minor");
  const component = minorComponents.find((item) => item.id === componentId);
  if (!component) return;

  if (Number.isInteger(component.pinOrder) && component.pinOrder >= 1) {
    const removedOrder = component.pinOrder;
    delete component.pinOrder;

    minorComponents.forEach((item) => {
      if (Number.isInteger(item.pinOrder) && item.pinOrder > removedOrder) {
        item.pinOrder -= 1;
      }
    });
  } else {
    const maxPin = minorComponents.reduce((max, item) => {
      return Number.isInteger(item.pinOrder) ? Math.max(max, item.pinOrder) : max;
    }, 0);
    component.pinOrder = maxPin + 1;
  }

  render();
}

function createSplitControls(component) {
  const wrapper = document.createElement("span");
  wrapper.className = "split-control";
  wrapper.addEventListener("mousedown", (event) => event.stopPropagation());
  wrapper.addEventListener("click", (event) => event.stopPropagation());

  const toggle = document.createElement("button");
  toggle.className = "chip-action";
  toggle.type = "button";
  toggle.textContent = "분리";
  toggle.setAttribute("aria-label", `${component.text}에서 분리할 단어 선택`);

  const panel = document.createElement("span");
  panel.className = "split-panel hidden";

  // Shift+클릭으로 직전 선택 단어와 현재 단어 사이를 범위 선택하기 위한 기준 인덱스.
  let lastSplitClickIndex = null;
  const splitCheckboxes = [];

  getComponentWords(component).forEach((word, index) => {
    const label = document.createElement("label");
    label.className = "split-word-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = String(index);
    splitCheckboxes[index] = checkbox;
    checkbox.addEventListener("click", (event) => {
      applyShiftRangeSelection(event, splitCheckboxes, index, lastSplitClickIndex, checkbox.checked);
      lastSplitClickIndex = index;
    });

    const wordText = document.createElement("span");
    wordText.textContent = word;

    label.append(checkbox, wordText);
    panel.appendChild(label);
  });

  const applyButton = document.createElement("button");
  applyButton.className = "chip-action split-apply";
  applyButton.type = "button";
  applyButton.textContent = "적용";
  applyButton.addEventListener("click", () => {
    const selectedIndexes = [...panel.querySelectorAll("input:checked")].map((input) => Number(input.value));
    splitSelectedWords(component.id, selectedIndexes);
  });
  panel.appendChild(applyButton);

  toggle.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    adjustEditViewScale();
  });
  wrapper.append(toggle, panel);
  return wrapper;
}

function createModifierTargetControl(component) {
  const sentence = getCurrentSentence();
  const wrapper = document.createElement("span");
  wrapper.className = "modifier-control";
  wrapper.addEventListener("mousedown", (event) => event.stopPropagation());
  wrapper.addEventListener("click", (event) => event.stopPropagation());

  const title = document.createElement("span");
  title.className = "modifier-control-title";
  title.textContent = "수식 대상";
  wrapper.appendChild(title);

  const selectedIndexes = new Set(getModifierTargetIndexes(component));
  const ownIndexes = new Set(getIndexRange(component.startIndex, component.endIndex));
  const modifierCheckboxes = [];
  getDisplayWords(sentence?.text || "").forEach((word, index) => {
    if (ownIndexes.has(index)) {
      return;
    }
    const label = document.createElement("label");
    label.className = "modifier-word-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = String(index);
    checkbox.checked = selectedIndexes.has(index);
    modifierCheckboxes[index] = checkbox;
    checkbox.addEventListener("click", (event) => {
      // Shift+클릭이면 직전 클릭과 현재 사이의 체크박스 상태를 먼저 일괄로 바꾼다.
      // 형용사어 수식 대상은 change 시 즉시 renderEditView()로 재렌더되므로,
      // 여기서는 change를 따로 발생시키지 않고 아래 change 핸들러가
      // 한 번만 실행되면서 최종 선택 결과를 읽어 적용하게 한다.
      const lastIndex = state.lastModifierComponentId === component.id ? state.lastModifierClickIndex : null;
      applyShiftRangeSelection(event, modifierCheckboxes, index, lastIndex, checkbox.checked);
      state.lastModifierClickIndex = index;
      state.lastModifierComponentId = component.id;
    });
    checkbox.addEventListener("change", () => {
      const indexes = [...wrapper.querySelectorAll("input:checked")].map((input) => Number(input.value));
      updateModifierTargetWords(component.id, indexes);
    });

    const wordText = document.createElement("span");
    wordText.textContent = word;

    label.append(checkbox, wordText);
    wrapper.appendChild(label);
  });

  return wrapper;
}

// Shift+클릭 시 직전 클릭한 체크박스와 현재 체크박스 사이의 체크박스들을
// 현재 상태(checked)에 맞춰 함께 맞춘다.
// 주의: 형용사어 수식 대상처럼 change 시 renderEditView()로 패널이 통째로 재생성되는
// 경우, 중간에 change를 다시 발생시키면 참조 중인 체크박스가 화면에서 떨어져
// 나머지 반영이 끊긴다. 따라서 checked 값만 바꾸고, 최종 반영은 클릭된 체크박스의
// 기본 change 이벤트(wrapper 전체 :checked를 다시 읽음)에게 맡긴다(한 번만 실행).
function applyShiftRangeSelection(event, checkboxes, currentIndex, anchorIndex, checked) {
  if (!event.shiftKey || anchorIndex === null || anchorIndex === currentIndex) {
    return;
  }
  const from = Math.min(anchorIndex, currentIndex);
  const to = Math.max(anchorIndex, currentIndex);
  for (let index = from; index <= to; index += 1) {
    const box = checkboxes[index];
    if (box && index !== currentIndex && box.checked !== checked) {
      box.checked = checked;
    }
  }
}

function renderPresentView() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  const isTitleOrSub = sentence.components.some(c => c.role === "title" || c.role === "subtitle");
  const hasMinor = sentence.components.some(c => c.lane === "minor");
  const isPureTitle = isTitleOrSub && !hasMinor;

  elements.presentProgress.textContent = getProgressText();
  renderImportantSidebar();
  updateNavButtons();

  if (isPureTitle) {
    setWordGrid(sentence);
    applySettings();
    elements.majorPresentLane.innerHTML = "";
    sentence.components.forEach((component) => {
      const chip = createPresentChip(component);
      elements.majorPresentLane.appendChild(chip);
    });
    elements.minorAnchorLane.innerHTML = "";
    elements.minorPresentLane.innerHTML = "";
    elements.emptyMinorNote.classList.add("hidden");
    
    const stage = document.querySelector(".presentation-stage");
    if (stage) {
      stage.querySelectorAll(".modifier-target-bracket").forEach((bracket) => bracket.remove());
    }
    
    schedulePresentationFit();
    return;
  }

  const majorComponents = getComponentsByLane(sentence, "major");
  const minorComponents = getPresentMinorComponents(sentence);
  state.minorRevealCount = clamp(0, state.minorRevealCount, minorComponents.length);
  const visibleMinorComponents = minorComponents.slice(0, state.minorRevealCount);

  setWordGrid(sentence);
  applySettings();
  renderMajorPresentLane(elements.majorPresentLane, majorComponents, visibleMinorComponents);
  elements.minorAnchorLane.innerHTML = "";
  renderMinorPresentRows(elements.minorPresentLane, visibleMinorComponents);
  renderModifierTargetBrackets(visibleMinorComponents);
  elements.emptyMinorNote.classList.add("hidden");

  schedulePresentationFit();
}

function renderImportantSidebar() {
  if (!elements.importantPresentNav) {
    return;
  }
  elements.importantPresentNav.innerHTML = "";
  
  let shortcutCounter = 1;
  state.sentences.forEach((sentence, idx) => {
    const btn = document.createElement("div");
    btn.className = "important-nav-item";
    if (idx === state.currentSentenceIndex) {
      btn.classList.add("active");
    }
    
    const isImp = sentence.isImportant === true;
    if (isImp) {
      btn.classList.add("important");
    }
    
    // 별표 토글 버튼 (클릭 시 중요 지정 여부 켜고 끔)
    const starBtn = document.createElement("button");
    starBtn.type = "button";
    starBtn.className = "star-toggle-btn";
    starBtn.textContent = isImp ? "★" : "☆";
    starBtn.setAttribute("aria-label", `${idx + 1}번 문장 중요도 설정 토글`);
    starBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 문장 이동 이벤트 전파 방지
      sentence.isImportant = !sentence.isImportant;
      render();
    });
    
    // 문장 번호 표시
    const numSpan = document.createElement("span");
    numSpan.className = "sentence-num";
    numSpan.textContent = String(idx + 1);
    
    // 단축 번호키 배지용 래퍼 컨테이너 (정렬 일관성 유지 목적)
    const badgeWrapper = document.createElement("div");
    badgeWrapper.className = "shortcut-badge-wrapper";
    
    if (isImp && shortcutCounter <= 9) {
      const shortcutBadge = document.createElement("span");
      shortcutBadge.className = "shortcut-badge";
      shortcutBadge.textContent = String(shortcutCounter);
      badgeWrapper.appendChild(shortcutBadge);
      shortcutCounter += 1;
    }
    
    btn.append(starBtn, numSpan, badgeWrapper);
    
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSentence(idx, 0);
    });
    
    elements.importantPresentNav.appendChild(btn);
  });
}

function renderMajorPresentLane(container, components, visibleMinorComponents = []) {
  container.innerHTML = "";
  components.forEach((component) => {
    const chip = createPresentChip(component, getVisibleModifierTargetIndexes(visibleMinorComponents));
    placeComponentOnGrid(chip, component);
    container.appendChild(chip);
  });
}

function renderMinorPresentRows(container, components) {
  container.innerHTML = "";
  const sentence = getCurrentSentence();
  const totalRows = sentence ? getComponentsByLane(sentence, "minor").length : components.length;

  const gap = Math.max(4, 12 - totalRows * 1.5);
  container.style.setProperty("--minor-gap", `${gap}px`);

  components.forEach((component, index) => {
    const row = document.createElement("div");
    row.className = "minor-row";
    const hasBracket = isVisibleModifierTarget(component, components);
    placeMinorRow(row, index, totalRows, hasBracket);
    const chip = createPresentChip(component);
    placeMinorComponentOnGrid(chip, component, index, getMinorAnchorPercent(component));
    chip.draggable = true;
    chip.dataset.componentId = component.id;
    chip.addEventListener("dragstart", handlePresentMinorDragStart);
    chip.addEventListener("dragend", handlePresentMinorDragEnd);
    row.appendChild(chip);
    container.appendChild(row);
  });
}

function placeMinorRow(row, rowIndex, totalRows, hasBracket = false) {
  const spacing = Math.max(50, 96 - totalRows * 8);
  const boxTop = getMinorBoxTop(rowIndex, totalRows);
  const extraHeight = hasBracket ? Math.max(16, Math.round(spacing * 0.35)) : 0;
  const rowHeight = spacing + extraHeight;
  row.style.setProperty("--minor-box-top", `${boxTop}px`);
  row.style.setProperty("--minor-row-height", `${rowHeight}px`);
  row.style.zIndex = String(100 - rowIndex);
}

function getMinorLaneMetrics() {
  const rect = elements.minorPresentLane.getBoundingClientRect();
  const style = getComputedStyle(elements.minorPresentLane);
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padRight = Number.parseFloat(style.paddingRight) || 0;
  const left = rect.left + padLeft;
  const width = Math.max(1, rect.width - padLeft - padRight);
  return { left, width, right: left + width };
}

// 같은 슬롯(동일 위치)에 모인 부사어 점만 그 슬롯을 중심으로 좌우 대칭 분산한다.
// 서로 다른 슬롯(예: 문장 맨앞 vs 맨뒤)에 있는 종요소는 절대 서로 영향받지 않는다(독립 이동).
function spreadAnchors(list, metrics, edgePercent) {
  const result = new Map();
  if (list.length === 0) {
    return result;
  }

  const minSep = metrics.width
    ? clamp(MINOR_ANCHOR_SPREAD, (26 / metrics.width) * 100, 24)
    : MINOR_ANCHOR_SPREAD;
  const minP = edgePercent;
  const maxP = 100 - edgePercent;

  const groups = new Map();
  list.forEach((item) => {
    const key = Math.round(item.percent * 10) / 10;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  });

  groups.forEach((items, slotPercent) => {
    const ordered = items.slice().sort((a, b) => a.order - b.order);
    const count = ordered.length;
    ordered.forEach((item, index) => {
      const offset = (index - (count - 1) / 2) * minSep;
      const percent = clamp(minP, slotPercent + offset, maxP);
      result.set(item.component.id, Math.round(percent * 10) / 10);
    });
  });

  return result;
}

function createPresentChip(component, modifierTargetIndexes = new Set()) {
  const chip = document.createElement("span");
  chip.className = `component-chip present-chip ${ROLE_COLOR_CLASS[component.role]}`;
  if (component.role === "adjective") {
    chip.classList.add("modifier-chip");
  }
  chip.style.setProperty("--component-color", COMPONENT_PALETTE[component.role]);
  chip.dataset.componentId = component.id;
  chip.dataset.role = component.role;

  const text = document.createElement("span");
  text.className = "text-part";
  getComponentWords(component).forEach((word, index) => {
    const wordElement = document.createElement("span");
    wordElement.className = "present-word";
    const wordIndex = Number.isFinite(component.startIndex) ? component.startIndex + index : null;
    if (wordIndex !== null) {
      wordElement.dataset.wordIndex = String(wordIndex);
    }
    wordElement.textContent = word;
    text.appendChild(wordElement);
  });

  chip.appendChild(text);

  chip.addEventListener("click", (event) => {
    if (state.mode !== "present") {
      return;
    }
    event.stopPropagation();
    showElementDetail(component);
  });

  return chip;
}

function setWordGrid(sentence) {
  elements.app.style.setProperty("--word-count", Math.max(sentence.wordCount || 1, 1));
}

function placeComponentOnGrid(element, component) {
  const start = Number.isFinite(component.startIndex) ? component.startIndex + 1 : component.order;
  const end = Number.isFinite(component.endIndex) ? component.endIndex + 1 : start + 1;
  element.style.gridColumn = `${start} / ${Math.max(end, start + 1)}`;
}

function placeMinorComponentOnGrid(element, component, rowIndex, anchorPercent = getMinorAnchorPercent(component)) {
  element.style.setProperty("--anchor-percent", `${anchorPercent}%`);
  element.style.setProperty("--box-percent", `${anchorPercent}%`);
  element.style.setProperty("--connector-x", "50%");
  
  const sentence = getCurrentSentence();
  const totalRows = sentence ? getComponentsByLane(sentence, "minor").length : 1;
  const spacing = Math.max(50, 96 - totalRows * 8);
  const boxTop = Math.max(8, Math.round(spacing * 0.2));
  const approxGap = Math.max(4, 12 - totalRows * 1.5);
  const connectorLength = rowIndex * (spacing + approxGap) + boxTop + 10;
  element.style.setProperty("--connector-length", `${connectorLength}px`);
}

function getMinorBoxTop(rowIndex, totalRows) {
  const spacing = Math.max(50, 96 - totalRows * 8);
  return Math.max(8, Math.round(spacing * 0.2));
}

function getMinorAnchorPercent(component) {
  const slots = getMinorSlots();
  if (slots.length === 0) {
    return 50;
  }

  if (component.role === "adjective") {
    return getModifierTargetCenterPercent(component);
  }

  const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
  const slot = getClosestSlot(start);
  return slot.percent;
}

function getComponentCenterPercent(component) {
  const slots = getMinorSlots();
  const startIndex = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
  const endIndex = Number.isFinite(component.endIndex) ? component.endIndex : startIndex + 1;
  const startSlot = getClosestSlot(startIndex);
  const endSlot = getClosestSlot(endIndex);
  return Math.round(((startSlot.percent + endSlot.percent) / 2) * 10) / 10;
}

function getModifierTargetCenterPercent(component) {
  const indexes = getModifierTargetIndexes(component);
  if (indexes.length === 0) {
    return getClosestSlot(Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1).percent;
  }

  const metrics = getMinorLaneMetrics();
  const targetWords = getVisibleWordElementsByIndexes(indexes);

  if (metrics.width && targetWords.length > 0) {
    const left = Math.min(...targetWords.map((word) => word.getBoundingClientRect().left));
    const right = Math.max(...targetWords.map((word) => word.getBoundingClientRect().right));
    const center = (left + right) / 2;
    // 화살표는 수식 대상(주요소 포함)의 밑줄 정가운데를 정확히 가리켜야 한다.
    // 가장자리 보정(edge clamp)은 화살표를 안쪽으로 당겨 밑줄 중앙을 벗어나게 하므로 적용하지 않는다.
    // 박스가 화면 밖으로 나가는 문제는 clampMinorBoxes와 연결선 확장으로 따로 처리된다.
    const percent = ((center - metrics.left) / metrics.width) * 100;
    return Math.round(clamp(0, percent, 100) * 10) / 10;
  }

  const percents = indexes.map((index) => {
    const startSlot = getClosestSlot(index);
    const endSlot = getClosestSlot(index + 1);
    return (startSlot.percent + endSlot.percent) / 2;
  });
  return Math.round((percents.reduce((sum, percent) => sum + percent, 0) / percents.length) * 10) / 10;
}

function getPlainWords(sentenceText) {
  return getDisplayWords(sentenceText).map(getWordCore).filter(Boolean);
}

function getComponentWords(component) {
  return getDisplayWords(component.text);
}

function getDisplayWords(text) {
  const normalizedText = normalizeApostrophes(text);
  const words = normalizedText.match(/["'“‘(\[]*[A-Za-z0-9\-\u2011\u2012\u2013\u2014\u2015\u2212]+(?:'[A-Za-z0-9\-\u2011\u2012\u2013\u2014\u2015\u2212]+)?["'”’)\].,!?;:]*/g) || [];
  const mergedWords = mergeContractionFragments(words);
  return mergedWords.length > 0 ? mergedWords : [normalizedText].filter(Boolean);
}

function getWordCore(word) {
  return normalizeApostrophes(word).match(/[A-Za-z0-9\-\u2011\u2012\u2013\u2014\u2015\u2212]+(?:'[A-Za-z0-9\-\u2011\u2012\u2013\u2014\u2015\u2212]+)?/)?.[0] || "";
}

function normalizeApostrophes(text) {
  return String(text || "").replace(APOSTROPHE_LIKE_PATTERN, "'");
}

function mergeContractionFragments(words) {
  const mergedWords = [];
  words.forEach((word) => {
    const previous = mergedWords[mergedWords.length - 1];
    const suffixMatch = word.match(/^([A-Za-z]+)([.,!?;:]*)$/);
    const previousMatch = previous?.match(/^(.+?[A-Za-z])([.,!?;:]*)$/);
    const suffix = suffixMatch?.[1]?.toLowerCase();
    if (previousMatch && suffixMatch && CONTRACTION_SUFFIXES.has(suffix) && previousMatch[2] === "") {
      mergedWords[mergedWords.length - 1] = `${previousMatch[1]}'${suffixMatch[1]}${suffixMatch[2]}`;
      return;
    }
    mergedWords.push(word);
  });
  return mergedWords;
}

function getMinorSlots() {
  if (state.minorSlots.length > 0) {
    return state.minorSlots;
  }

  const sentence = getCurrentSentence();
  const wordCount = Math.max(sentence?.wordCount || 1, 1);
  return Array.from({ length: wordCount + 1 }, (_, index) => ({
    index,
    percent: Math.round((index / wordCount) * 1000) / 10
  }));
}

function getClosestSlot(index) {
  const slots = getMinorSlots();
  return slots.reduce((closest, slot) => {
    return Math.abs(slot.index - index) < Math.abs(closest.index - index) ? slot : closest;
  }, slots[0]);
}

function rebuildMinorSlotsFromWords() {
  const slotRect = getMinorLaneMetrics();
  const wordElements = [...elements.majorPresentLane.querySelectorAll(".present-word")];
  const sentence = getCurrentSentence();
  if (!slotRect.width || wordElements.length === 0 || !sentence) {
    state.minorSlots = [];
    return;
  }

  const wordRects = wordElements.map((element) => element.getBoundingClientRect());
  // 슬롯 인덱스는 원문 전체 단어 인덱스(data-word-index) 기준이어야 종요소의 startIndex와 맞아떨어진다.
  const wordIndexes = wordElements.map((element, index) => {
    const value = Number(element.dataset.wordIndex);
    return Number.isFinite(value) ? value : index;
  });
  const firstIndex = wordIndexes[0];
  const lastIndex = wordIndexes[wordIndexes.length - 1];
  const slots = [];
  const first = wordRects[0];
  const last = wordRects[wordRects.length - 1];
  const edgeGap = getMajorEdgeGap();

  // 문장 맨 앞/맨 뒤 슬롯에 몰리는 종요소 개수만큼 가장자리 점을 더 벌려 둔다.
  const visibleMinorComponents = getPresentMinorComponents(sentence).slice(0, state.minorRevealCount);
  const startAnchorCount = visibleMinorComponents.filter((component) => {
    const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
    return start <= firstIndex;
  }).length;
  const endAnchorCount = visibleMinorComponents.filter((component) => {
    const start = Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1;
    return start > lastIndex;
  }).length;

  const startShiftPx = startAnchorCount > 1 ? ((startAnchorCount - 1) * MINOR_ANCHOR_SPREAD / 2 / 100) * slotRect.width : 0;
  const endShiftPx = endAnchorCount > 1 ? ((endAnchorCount - 1) * MINOR_ANCHOR_SPREAD / 2 / 100) * slotRect.width : 0;

  // 가장자리 점이 첫/마지막 단어와 절대 겹치지 않도록, 단어 경계에서 떨어뜨릴 최소 간격(px).
  // 점(::before) 지름 18px의 절반 + 여유. 주요소 글씨가 클수록(짧은 문장) 더 크게 잡아
  // 큰 글자 옆에서도 점이 단어 위로 올라타지 않게 한다.
  const dotClearance = getMinorDotClearance();

  // 문장 맨 앞 슬롯 (첫 단어 앞)
  // 점은 제일 먼저 "첫 단어 왼쪽 경계 - clearance" 위치에 둔다(점 중심 기준).
  // 그보다 더 왼쪽(edgeGap)이 필요하면 더 왼쪽에 두되, 화면(슬롯 영역) 밖으로는 나가지 않는다.
  const startClearancePx = first.left - dotClearance - startShiftPx;
  const startTargetPx = Math.min(startClearancePx, first.left - edgeGap - startShiftPx);
  slots.push({
    index: firstIndex - 0.5,
    percent: clampEdgeSlotPercent(startTargetPx, startClearancePx, slotRect, "start")
  });

  // 단어와 단어 사이 슬롯: 양쪽 주요소 단어의 원문 인덱스 중간값으로 표시
  wordRects.forEach((rect, index) => {
    const nextRect = wordRects[index + 1];
    if (!nextRect) {
      return;
    }
    slots.push({
      index: (wordIndexes[index] + wordIndexes[index + 1]) / 2,
      percent: rectXToPercent((rect.right + nextRect.left) / 2, slotRect)
    });
  });

  // 문장 맨 뒤 슬롯 (마지막 단어 뒤)
  // 점은 제일 먼저 "마지막 단어 오른쪽 경계 + clearance" 위치에 둔다.
  // 그보다 더 오른쪽(edgeGap)이 필요하면 더 오른쪽에 두되, 화면 밖으로는 나가지 않는다.
  const endClearancePx = last.right + dotClearance + endShiftPx;
  const endTargetPx = Math.max(endClearancePx, last.right + edgeGap + endShiftPx);
  slots.push({
    index: lastIndex + 0.5,
    percent: clampEdgeSlotPercent(endTargetPx, endClearancePx, slotRect, "end")
  });

  state.minorSlots = slots;
}

function rectXToPercent(x, rect) {
  const edgeGuard = (getStageEdgeGuard(rect) / rect.width) * 100;
  return Math.round(clamp(edgeGuard, ((x - rect.left) / rect.width) * 100, 100 - edgeGuard) * 10) / 10;
}

// 가장자리 점(문장 맨앞/맨뒤 슬롯)의 percent를 계산한다.
// 핵심 규칙: 점은 반드시 첫 단어보다 왼쪽 / 마지막 단어보다 오른쪽(clearancePx)에 있어야 한다.
// 점이 슬롯 영역(화면) 밖으로 나가면 안 되므로, 그 때만 화면 경계(점 반지름 여유 포함)로 당긴다.
// 단어와의 겹침 방지를 최우선으로 하되, 화면을 벗어나지 않게만 보정한다.
function clampEdgeSlotPercent(targetPx, clearancePx, rect, side) {
  const dotRadiusPx = 11; // 점 반지름(9px) + 약간의 여유
  const minX = rect.left + dotRadiusPx;
  const maxX = rect.right - dotRadiusPx;

  let valuePx;
  if (side === "start") {
    // 첫 단어 왼쪽 clearance 위치를 목표로 하되, 화면 왼쪽 경계(minX)보다는 오른쪽이어야 한다.
    // 단, clearancePx보다 오른쪽으로는 가지 않는다(단어와 겹침 방지).
    valuePx = Math.max(minX, Math.min(targetPx, clearancePx));
  } else {
    // 마지막 단어 오른쪽 clearance 위치를 목표로 하되, 화면 오른쪽 경계(maxX)보다는 왼쪽이어야 한다.
    valuePx = Math.min(maxX, Math.max(targetPx, clearancePx));
  }

  const percent = ((valuePx - rect.left) / rect.width) * 100;
  return Math.round(clamp(0, percent, 100) * 10) / 10;
}

// 가장자리 점과 단어 사이 최소 간격(px). 점 반지름(9px) + 여유 + 글씨 크기 비례.
// 주요소 글씨가 매우 클 때도 점이 첫/마지막 글자 위로 겹치지 않도록 글씨 크기에 비례시킨다.
function getMinorDotClearance() {
  const majorSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-major-current")) || 56;
  return Math.round(clamp(26, 18 + majorSize * 0.32, 160));
}

function getMajorEdgeGap() {
  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-major-current"));
  return clamp(100, currentSize * 1.6, 320);
}

function getStageEdgeGuard(rect) {
  return clamp(80, rect.width * 0.08, 180);
}

function getCurrentSentence() {
  return state.sentences[state.currentSentenceIndex] || null;
}

function getComponentsByLane(sentence, lane) {
  return sentence.components
    .filter((component) => component.lane === lane)
    .sort((a, b) => a.order - b.order);
}

function getPresentMinorComponents(sentence) {
  if (!sentence) {
    return [];
  }
  return sentence.components
    .filter((component) => component.lane === "minor")
    .sort((a, b) => {
      const pinA = Number.isInteger(a.pinOrder) ? a.pinOrder : Infinity;
      const pinB = Number.isInteger(b.pinOrder) ? b.pinOrder : Infinity;
      if (pinA !== pinB) {
        return pinA - pinB;
      }
      return a.order - b.order;
    });
}

function getProgressText() {
  if (state.sentences.length === 0) {
    return "0 / 0";
  }
  return `${state.currentSentenceIndex + 1} / ${state.sentences.length}`;
}

function goToSentence(index, revealCount = 0) {
  if (state.sentences.length === 0) {
    return;
  }
  state.currentSentenceIndex = Math.max(0, Math.min(index, state.sentences.length - 1));
  state.minorRevealCount = clamp(0, revealCount, getCurrentMinorCount());
  render();
}

function updateSentenceText() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }
  const newText = elements.sentenceTextEditor.value.trim();
  if (!newText) {
    alert("문장 텍스트를 입력해 주세요.");
    return;
  }
  sentence.text = newText;
  sentence.wordCount = getPlainWords(newText).length;
  sentence.components = analyzeSentence(newText, state.currentSentenceIndex);
  
  state.passageText = state.sentences.map((s) => s.text).join(" ");
  elements.passageInput.value = state.passageText;
  
  render();
}

function insertNewSentence() {
  if (state.sentences.length === 0) {
    return;
  }
  const insertIndex = state.currentSentenceIndex + 1;
  const defaultText = "Insert new English sentence here.";
  const newSentence = {
    id: `sentence-inserted-${Date.now()}`,
    text: defaultText,
    isImportant: false,
    wordCount: getPlainWords(defaultText).length,
    components: analyzeSentence(defaultText, insertIndex)
  };
  
  state.sentences.splice(insertIndex, 0, newSentence);
  
  reindexSentences();
  
  state.currentSentenceIndex = insertIndex;
  state.minorRevealCount = 0;
  
  render();
}

function deleteCurrentSentence() {
  if (state.sentences.length === 0) {
    return;
  }
  if (state.sentences.length <= 1) {
    alert("더 이상 문장을 삭제할 수 없습니다. 최소 하나의 문장이 필요합니다.");
    return;
  }
  
  if (!confirm("현재 문장을 정말 삭제하시겠습니까?")) {
    return;
  }
  
  state.sentences.splice(state.currentSentenceIndex, 1);
  reindexSentences();
  
  state.currentSentenceIndex = Math.max(0, Math.min(state.currentSentenceIndex, state.sentences.length - 1));
  state.minorRevealCount = 0;
  
  render();
}

function reindexSentences() {
  state.sentences.forEach((sentence, index) => {
    sentence.id = `sentence-${index + 1}`;
    // 성분마다 고유한 id를 부여한다. (배열 순서 기반이라 중복이 생기지 않는다)
    sentence.components.forEach((component, componentIndex) => {
      component.id = `s${index + 1}-c${componentIndex + 1}`;
    });
  });
  state.passageText = state.sentences.map((s) => s.text).join(" ");
  elements.passageInput.value = state.passageText;
}

function getCurrentMinorCount() {
  const sentence = getCurrentSentence();
  return sentence ? getComponentsByLane(sentence, "minor").length : 0;
}

function getModifierTargetOptions(component) {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return [];
  }

  const preferred = sentence.components
    .filter((target) => target.id !== component.id && target.role !== "verb" && target.lane === "major")
    .sort(compareComponentsBySentenceOrder);

  if (preferred.length > 0) {
    return preferred;
  }

  return sentence.components
    .filter((target) => target.id !== component.id)
    .sort(compareComponentsBySentenceOrder);
}

function compareComponentsBySentenceOrder(a, b) {
  const aIndex = Number.isFinite(a.startIndex) ? a.startIndex : a.order;
  const bIndex = Number.isFinite(b.startIndex) ? b.startIndex : b.order;
  return aIndex - bIndex;
}

function updateModifierTarget(componentId, targetId) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  const target = sentence?.components.find((item) => item.id === targetId);
  if (!sentence || !component || component.role !== "adjective") {
    return;
  }

  if (!target) {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    renderEditView();
    return;
  }

  setModifierTarget(component, target);
  renderEditView();
}

function setModifierTarget(component, target) {
  component.modifierTargetId = target.id;
  component.modifierTargetStart = target.startIndex;
  component.modifierTargetEnd = target.endIndex;
  component.modifierTargetIndexes = getIndexRange(target.startIndex, target.endIndex);
}

function updateModifierTargetWords(componentId, indexes) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component || component.role !== "adjective") {
    return;
  }

  setModifierTargetWords(component, indexes);
  renderEditView();
}

function setModifierTargetWords(component, indexes) {
  const wordCount = getPlainWords(getCurrentSentence()?.text || "").length;
  const normalizedIndexes = [...new Set(indexes)]
    .filter((index) => Number.isInteger(index) && index >= 0 && index < wordCount)
    .sort((a, b) => a - b);

  if (normalizedIndexes.length === 0) {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    delete component.modifierTargetIndexes;
    return;
  }

  component.modifierTargetIndexes = normalizedIndexes;
  component.modifierTargetStart = normalizedIndexes[0];
  component.modifierTargetEnd = normalizedIndexes[normalizedIndexes.length - 1] + 1;
  delete component.modifierTargetId;
}

function ensureModifierTarget(component) {
  if (component.role !== "adjective" || getModifierTargetIndexes(component).length > 0) {
    return;
  }

  const target = findDefaultModifierTarget(component);
  if (target) {
    setModifierTarget(component, target);
  }
}

function findDefaultModifierTarget(component) {
  const options = getModifierTargetOptions(component);
  if (options.length === 0) {
    return null;
  }

  const componentStart = Number.isFinite(component.startIndex) ? component.startIndex : component.order;
  return options.find((target) => Number.isFinite(target.startIndex) && target.startIndex > componentStart) || options[options.length - 1];
}

function getModifierTargetIndexes(component) {
  // 형용사어는 자기 자신의 단어를 수식 대상으로 삼을 수 없다. 과거 경계가 다를 때 저장된
  // 자기 단어 인덱스가 남아 있으면 화살표/밑줄이 자기 박스 쪽으로 끌려가므로 항상 제외한다.
  const isOwnWord = (index) =>
    Number.isFinite(component.startIndex) &&
    Number.isFinite(component.endIndex) &&
    index >= component.startIndex &&
    index < component.endIndex;

  if (Array.isArray(component.modifierTargetIndexes)) {
    return component.modifierTargetIndexes
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index) && index >= 0 && !isOwnWord(index))
      .sort((a, b) => a - b);
  }

  if (Number.isFinite(component.modifierTargetStart) && Number.isFinite(component.modifierTargetEnd)) {
    return getIndexRange(component.modifierTargetStart, component.modifierTargetEnd).filter((index) => !isOwnWord(index));
  }

  return [];
}

function getIndexRange(startIndex, endIndex) {
  if (!Number.isFinite(startIndex) || !Number.isFinite(endIndex)) {
    return [];
  }

  const indexes = [];
  for (let index = startIndex; index < endIndex; index += 1) {
    indexes.push(index);
  }
  return indexes;
}

function getVisibleModifierTargetIndexes(visibleMinorComponents) {
  const indexes = new Set();
  visibleMinorComponents
    .filter((component) => component.role === "adjective")
    .forEach((component) => getModifierTargetIndexes(component).forEach((index) => indexes.add(index)));
  return indexes;
}

function renderModifierTargetBrackets(visibleMinorComponents) {
  const stage = document.querySelector(".presentation-stage");
  if (!stage) {
    return;
  }

  stage.querySelectorAll(".modifier-target-bracket").forEach((bracket) => bracket.remove());
  visibleMinorComponents
    .filter((component) => component.role === "adjective")
    .forEach((component) => {
      getContiguousGroups(getModifierTargetIndexes(component)).forEach((indexes) => {
        const bracket = document.createElement("span");
        bracket.className = "modifier-target-bracket";
        bracket.dataset.indexes = indexes.join(",");
        stage.appendChild(bracket);
      });
    });
  updateModifierTargetBrackets();
}

function updateModifierTargetBrackets() {
  if (state.mode !== "present") {
    return;
  }

  const stage = document.querySelector(".presentation-stage");
  const stageRect = stage?.getBoundingClientRect();
  if (!stageRect) {
    return;
  }

  stage.querySelectorAll(".modifier-target-bracket").forEach((bracket) => {
    const indexes = (bracket.dataset.indexes || "")
      .split(",")
      .map((index) => Number(index))
      .filter((index) => Number.isInteger(index));
    const targetWords = getVisibleWordElementsByIndexes(indexes);
    if (targetWords.length === 0) {
      bracket.classList.add("hidden");
      return;
    }

    const left = Math.min(...targetWords.map((word) => word.getBoundingClientRect().left)) - stageRect.left;
    const right = Math.max(...targetWords.map((word) => word.getBoundingClientRect().right)) - stageRect.left;
    const bottom = Math.max(...targetWords.map((word) => word.getBoundingClientRect().bottom)) - stageRect.top;
    bracket.classList.remove("hidden");
    bracket.style.left = `${Math.round(left)}px`;
    bracket.style.top = `${Math.round(bottom + 8)}px`;
    bracket.style.width = `${Math.round(right - left)}px`;
  });
}

function getVisibleWordElementsByIndexes(indexes) {
  const indexSet = new Set(indexes);
  return [...document.querySelectorAll(".presentation-stage .present-word[data-word-index]")]
    .filter((word) => indexSet.has(Number(word.dataset.wordIndex)));
}

function getContiguousGroups(indexes) {
  const sortedIndexes = [...new Set(indexes)].sort((a, b) => a - b);
  const groups = [];
  sortedIndexes.forEach((index) => {
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup[lastGroup.length - 1] + 1 !== index) {
      groups.push([index]);
      return;
    }
    lastGroup.push(index);
  });
  return groups;
}

function getModifierTargetComponent(component) {
  const sentence = getCurrentSentence();
  if (!sentence || component.role !== "adjective") {
    return null;
  }

  const byId = sentence.components.find((target) => target.id === component.modifierTargetId);
  if (byId) {
    return byId;
  }

  return sentence.components.find((target) => {
    return target.id !== component.id
      && Number.isFinite(component.modifierTargetStart)
      && Number.isFinite(component.modifierTargetEnd)
      && target.startIndex === component.modifierTargetStart
      && target.endIndex === component.modifierTargetEnd;
  }) || null;
}

function isVisibleModifierTarget(component, visibleMinorComponents) {
  if (component.lane !== "minor") {
    return false;
  }
  const compStart = component.startIndex;
  const compEnd = component.endIndex;
  if (!Number.isFinite(compStart) || !Number.isFinite(compEnd)) {
    return false;
  }

  const modifiedIndexes = new Set();
  visibleMinorComponents.forEach((minor) => {
    if (minor.role === "adjective") {
      getModifierTargetIndexes(minor).forEach((idx) => modifiedIndexes.add(idx));
    }
  });

  for (let idx = compStart; idx < compEnd; idx += 1) {
    if (modifiedIndexes.has(idx)) {
      return true;
    }
  }
  return false;
}

function goToPresentationNext() {
  const minorCount = getCurrentMinorCount();
  if (state.minorRevealCount < minorCount) {
    state.minorRevealCount += 1;
    renderPresentView();
    return;
  }

  if (state.currentSentenceIndex >= state.sentences.length - 1) {
    return;
  }
  goToSentence(state.currentSentenceIndex + 1, 0);
}

function goToPresentationPrev() {
  if (state.minorRevealCount > 0) {
    state.minorRevealCount -= 1;
    renderPresentView();
    return;
  }

  const previousIndex = state.currentSentenceIndex - 1;
  if (previousIndex < 0) {
    return;
  }
  const previousSentence = state.sentences[previousIndex];
  const previousMinorCount = getComponentsByLane(previousSentence, "minor").length;
  goToSentence(previousIndex, previousMinorCount);
}

function goToPresentationSentence(offset) {
  const nextIndex = state.currentSentenceIndex + offset;
  if (nextIndex < 0 || nextIndex >= state.sentences.length) {
    return;
  }
  goToSentence(nextIndex, 0);
}

function goToPresentationFirstSentence() {
  goToSentence(0, 0);
}

// "전체화면" 버튼: 발표 화면을 전체화면으로 들어가거나 빠져나온다.
function togglePresentFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    return;
  }
  elements.presentView.requestFullscreen?.().catch(() => {});
}

function handleFullscreenChange() {
  const isFullscreen = Boolean(document.fullscreenElement);
  elements.presentFitButton.textContent = isFullscreen ? "전체화면 종료 (🔍)" : "전체화면 (🔍)";
  // 전체화면 진입/이탈로 화면 크기가 바뀌므로 글자 크기와 배치를 다시 맞춘다.
  applySettings();
  schedulePresentationFit();
}

function handlePresentationLastButton() {
  const lastIndex = state.sentences.length - 1;
  if (state.currentSentenceIndex >= lastIndex) {
    // 마지막 문장에서는 "이전 단계" 버튼으로 발표를 끝내고 2단계(수정) 화면으로 돌아간다.
    setMode("edit");
    return;
  }
  goToSentence(lastIndex, 0);
}

function handlePresentationClick(event) {
  if (state.mode !== "present") {
    return;
  }

  const interactiveTarget = event.target.closest("button, input, select, textarea, a, [draggable='true'], .important-present-nav");
  if (interactiveTarget) {
    return;
  }

  goToPresentationNext();
}

function moveComponent(componentId, targetLane, targetIndex = null) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component) {
    return;
  }

  component.lane = targetLane;
  clearManualMinorPosition(component);
  if (targetLane === "major" && !MAJOR_ROLES.has(component.role)) {
    component.role = "subject";
  }
  if (targetLane === "minor" && MAJOR_ROLES.has(component.role)) {
    component.role = "adverb";
  }
  if (component.role !== "adjective") {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    delete component.modifierTargetIndexes;
  }

  const laneComponents = getComponentsByLane(sentence, targetLane).filter((item) => item.id !== componentId);
  const nextIndex = targetIndex === null ? laneComponents.length : Math.max(0, Math.min(targetIndex, laneComponents.length));
  laneComponents.splice(nextIndex, 0, component);
  laneComponents.forEach((item, index) => {
    item.order = index + 1;
  });

  reorderLane(sentence, targetLane === "major" ? "minor" : "major");
  renderEditView();
}

function splitSelectedWords(componentId, selectedIndexes) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component) {
    return;
  }

  const words = getComponentWords(component);
  const selectedSet = new Set(selectedIndexes.filter((index) => index >= 0 && index < words.length));
  if (words.length <= 1 || selectedSet.size === 0) {
    return;
  }

  const replacement = [];
  let currentGroup = null;
  words.forEach((word, index) => {
    const startIndex = Number.isFinite(component.startIndex) ? component.startIndex + index : undefined;
    const selected = selectedSet.has(index);

    if (!currentGroup || currentGroup.selected !== selected) {
      currentGroup = { words: [], startIndex, selected };
      replacement.push(currentGroup);
    }
    currentGroup.words.push(word);
    currentGroup.endIndex = Number.isFinite(startIndex) ? startIndex + 1 : undefined;
  });

  const nextComponents = replacement.map((item) => {
    if (item.id) {
      return item;
    }
    return createDerivedComponent(component, item.words, item.startIndex, item.endIndex);
  });

  const componentIndex = sentence.components.findIndex((item) => item.id === component.id);
  if (componentIndex === -1) {
    return;
  }
  sentence.components.splice(componentIndex, 1, ...nextComponents);
  reorderLane(sentence, component.lane);
  renderEditView();
}

function createDerivedComponent(baseComponent, words, startIndex, endIndex) {
  const derived = {
    ...baseComponent,
    id: getNextComponentId(baseComponent.id),
    text: words.join(" "),
    startIndex,
    endIndex
  };
  clearManualMinorPosition(derived);
  return derived;
}

// 발표 화면에서 드래그로 정해진 수동 위치(점 고정/박스)를 초기화한다.
function clearManualMinorPosition(component) {
  delete component.pinnedAnchor;
  delete component.boxPercent;
}

function getNextComponentId(baseId) {
  state.componentSerial += 1;
  return `${baseId}-u${state.componentSerial}`;
}

function updateComponentRole(componentId, role) {
  state.focusedComponentId = componentId;
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!component) {
    return;
  }

  component.role = role;
  component.lane = ROLE_BY_VALUE[role].lane;
  clearManualMinorPosition(component);
  if (role === "adjective") {
    ensureModifierTarget(component);
  } else {
    delete component.modifierTargetId;
    delete component.modifierTargetStart;
    delete component.modifierTargetEnd;
    delete component.modifierTargetIndexes;
  }
  reorderLane(sentence, "major");
  reorderLane(sentence, "minor");
  renderEditView();
}

function reorderLane(sentence, lane) {
  getComponentsByLane(sentence, lane).forEach((component, index) => {
    component.order = index + 1;
  });
}

function handleDragStart(event) {
  const chip = event.currentTarget;
  state.draggedComponentId = chip.dataset.componentId;
  chip.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.draggedComponentId);
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  state.draggedComponentId = null;
  document.querySelectorAll(".edit-lane").forEach((lane) => lane.classList.remove("drag-over"));
}

function handleLaneDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

function handleLaneDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}

function handleLaneDrop(event) {
  event.preventDefault();
  const lane = event.currentTarget;
  lane.classList.remove("drag-over");
  const componentId = event.dataTransfer.getData("text/plain") || state.draggedComponentId;
  if (!componentId) {
    return;
  }

  const targetLane = lane.dataset.lane;
  // 다른 성분 위에 직접 겹쳐 놓으면 병합한다(README: "겹치게 드래그한 성분 병합").
  // 병합 결과 텍스트는 mergeComponents에서 startIndex 순(문장 순서)으로 합쳐진다.
  // 성분 사이 빈 공간에 놓으면 위치만 이동한다.
  const mergeTargetId = getMergeTargetId(lane, componentId, event.clientX, event.clientY);
  if (mergeTargetId) {
    mergeComponents(componentId, mergeTargetId, targetLane);
    return;
  }
  const targetIndex = getDropIndex(lane, event.clientX, event.clientY);
  moveComponent(componentId, targetLane, targetIndex);
}

function getMergeTargetId(lane, draggedComponentId, clientX, clientY) {
  const targetChip = [...lane.querySelectorAll(".edit-chip:not(.dragging)")].find((chip) => {
    if (chip.dataset.componentId === draggedComponentId) {
      return false;
    }
    const rect = chip.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  });
  return targetChip?.dataset.componentId || null;
}

function mergeComponents(sourceId, targetId, targetLane) {
  const sentence = getCurrentSentence();
  const source = sentence?.components.find((item) => item.id === sourceId);
  const target = sentence?.components.find((item) => item.id === targetId);
  if (!sentence || !source || !target || source.id === target.id) {
    return;
  }

  const ordered = [source, target].sort((a, b) => {
    const aIndex = Number.isFinite(a.startIndex) ? a.startIndex : a.order;
    const bIndex = Number.isFinite(b.startIndex) ? b.startIndex : b.order;
    return aIndex - bIndex;
  });
  const role = targetLane === target.lane ? target.role : ROLE_OPTIONS.find((item) => item.lane === targetLane)?.value || target.role;
  const merged = {
    ...target,
    id: getNextComponentId(`${target.id}-${source.id}`),
    text: ordered.map((item) => item.text).join(" "),
    role,
    lane: targetLane,
    startIndex: Math.min(...ordered.map((item) => Number.isFinite(item.startIndex) ? item.startIndex : Infinity)),
    endIndex: Math.max(...ordered.map((item) => Number.isFinite(item.endIndex) ? item.endIndex : -Infinity))
  };
  if (!Number.isFinite(merged.startIndex)) {
    delete merged.startIndex;
  }
  if (!Number.isFinite(merged.endIndex)) {
    delete merged.endIndex;
  }
  if (merged.role !== "adjective") {
    delete merged.modifierTargetId;
    delete merged.modifierTargetStart;
    delete merged.modifierTargetEnd;
    delete merged.modifierTargetIndexes;
  }
  clearManualMinorPosition(merged);

  const insertIndex = sentence.components.findIndex((item) => item.id === target.id);
  sentence.components = sentence.components.filter((item) => item.id !== source.id && item.id !== target.id);
  sentence.components.splice(Math.max(0, insertIndex), 0, merged);
  reorderLane(sentence, "major");
  reorderLane(sentence, "minor");
  renderEditView();
}

function handlePresentMinorDragStart(event) {
  const chip = event.currentTarget;
  state.draggedComponentId = chip.dataset.componentId;
  chip.classList.add("dragging");
  elements.minorPresentLane.classList.add("present-drop-active");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.draggedComponentId);
}

function handlePresentMinorDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  elements.minorPresentLane.classList.remove("present-drop-active");
  state.draggedComponentId = null;
}

function handlePresentMinorDragOver(event) {
  event.preventDefault();
  elements.minorPresentLane.classList.add("present-drop-active");
}

function handlePresentMinorDrop(event) {
  event.preventDefault();
  elements.minorPresentLane.classList.remove("present-drop-active");
  const componentId = event.dataTransfer.getData("text/plain") || state.draggedComponentId;
  if (!componentId) {
    return;
  }
  moveMinorAnchor(componentId, event.clientX);
}

function moveMinorAnchor(componentId, clientX) {
  const sentence = getCurrentSentence();
  const component = sentence?.components.find((item) => item.id === componentId);
  if (!sentence || !component || component.lane !== "minor") {
    return;
  }

  const metrics = getMinorLaneMetrics();
  if (!metrics.width) {
    return;
  }
  const targetPercent = clamp(0, ((clientX - metrics.left) / metrics.width) * 100, 100);
  const edgePercent = (getStageEdgeGuard(metrics) / metrics.width) * 100;

  if (component.role === "adjective") {
    // 형용사어: 화살표는 수식 대상 가운데에 고정하고 박스 위치만 옮긴다.
    component.boxPercent = Math.round(clamp(edgePercent, targetPercent, 100 - edgePercent) * 10) / 10;
    renderPresentView();
    return;
  }

  // 부사어: 동그라미 점을 문장 맨앞/단어 사이/맨뒤 슬롯으로 스냅한다.
  const slots = getMinorSlots();
  if (slots.length === 0) {
    return;
  }
  const nearestSlot = slots.reduce((closest, slot) => {
    return Math.abs(slot.percent - targetPercent) < Math.abs(closest.percent - targetPercent) ? slot : closest;
  }, slots[0]);
  const span = Math.max(1, (component.endIndex || 0) - (component.startIndex || 0));
  const wordCount = Math.max(sentence.wordCount || 1, 1);
  const startIndex = clamp(0, Math.round(nearestSlot.index), wordCount);
  component.startIndex = startIndex;
  component.endIndex = Math.min(wordCount, startIndex + span);
  // 드래그한 부사어는 선택한 슬롯에 고정(pinned)되어 다른 종요소 자동 배치에 영향받지 않는다.
  component.pinnedAnchor = true;
  renderPresentView();
}

function getDropIndex(lane, clientX, clientY) {
  const chips = [...lane.querySelectorAll(".edit-chip:not(.dragging)")];
  const closest = chips.findIndex((chip) => {
    const rect = chip.getBoundingClientRect();
    const isAboveHalf = clientY < rect.top + rect.height / 2;
    const isBeforeHalf = clientX < rect.left + rect.width / 2;
    return isAboveHalf || (clientY <= rect.bottom && isBeforeHalf);
  });
  return closest === -1 ? chips.length : closest;
}

function applySettings() {
  elements.app.dataset.theme = state.settings.theme;
  elements.themeSelect.value = state.settings.theme;
  const width = window.innerWidth;
  const majorBase = clamp(56, width * 0.07, 124);
  const minorBase = clamp(16, width * 0.016, 32);
  elements.app.style.setProperty("--font-major-current", `${Math.round(majorBase)}px`);
  elements.app.style.setProperty("--font-minor-current", `${Math.round(minorBase)}px`);
}

function schedulePresentationFit() {
  let pass = 0;
  const runPass = () => {
    fitMajorLine();
    rebuildMinorSlotsFromWords();
    updateMinorPositions();
    fitMinorRows();
    clampMinorBoxes();
    updateModifierTargetBrackets();
    updateMinorConnectorLengths();
    pass += 1;
    if (pass < 5) {
      requestAnimationFrame(runPass);
    }
  };
  requestAnimationFrame(runPass);
}

function fitMajorLine() {
  if (state.mode !== "present") {
    return;
  }

  const lane = document.querySelector(".presentation-stage");
  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-major-current"));
  const laneRect = lane.getBoundingClientRect();

  const sentence = getCurrentSentence();
  const isTitleOrSub = sentence?.components.some(c => c.role === "title" || c.role === "subtitle");
  const hasMinor = sentence?.components.some(c => c.lane === "minor");
  const isPureTitle = isTitleOrSub && !hasMinor;

  if (isPureTitle) {
    const availableWidth = Math.max(220, lane.clientWidth - 100);
    const availableHeight = Math.max(150, lane.clientHeight * 0.75);
    const chipElement = elements.majorPresentLane.querySelector(".present-chip");
    if (!chipElement) {
      return;
    }
    const bounds = chipElement.getBoundingClientRect();
    if (!bounds.width || !bounds.height || !availableWidth || !availableHeight) {
      return;
    }
    const widthRatio = availableWidth / bounds.width;
    const heightRatio = availableHeight / bounds.height;
    const ratio = Math.min(widthRatio, heightRatio);
    if (ratio >= 1) {
      return;
    }
    const nextSize = Math.max(20, Math.floor(currentSize * Math.max(0.12, ratio) * 0.95));
    elements.app.style.setProperty("--font-major-current", `${nextSize}px`);
    return;
  }

  const edgeGuard = getStageEdgeGuard(laneRect);
  // 가장자리 점이 들어갈 공간을 양쪽에 예약한다. dotClearance(점~단어 최소 간격)도
  // 함께 반영해 주요소가 줄어들어도 점이 첫/마지막 단어와 겹치지 않게 한다.
  const anchorReserve = Math.max(getMajorEdgeGap(), getMinorDotClearance()) * 2;
  const edgeGroupReserve = getMajorEdgeAnchorReserve(laneRect.width);
  const edgeReserve = edgeGuard * 2 + anchorReserve + edgeGroupReserve;
  const availableWidth = Math.max(220, lane.clientWidth - edgeReserve);
  const bounds = getRenderedBounds(elements.majorPresentLane.querySelectorAll(".present-word"));
  if (!bounds || !availableWidth) {
    return;
  }

  const ratio = availableWidth / bounds.width;
  if (ratio >= 1) {
    return;
  }

  const nextSize = Math.max(24, Math.floor(currentSize * Math.max(0.18, ratio) * 0.98));
  elements.app.style.setProperty("--font-major-current", `${nextSize}px`);
}

function getMajorEdgeAnchorReserve(laneWidth) {
  const wordCount = elements.majorPresentLane.querySelectorAll(".present-word").length;
  if (wordCount === 0) {
    return 0;
  }

  // 공개된 종요소 수에 따라 주요소 줄 크기가 달라지면, 종요소를 1~2개만 공개했을 때
  // 가장자리 점이 첫/마지막 단어와 겹친다. 공개 단계와 무관하게 항상 동일한 여백을 두도록
  // 현재 문장의 모든 종요소를 기준으로 가장자리 점 개수를 계산한다.
  const allMinorComponents = getComponentsByLane(getCurrentSentence(), "minor");
  const startAnchorCount = allMinorComponents.filter((component) => {
    return Number.isFinite(component.startIndex) && component.startIndex <= 0;
  }).length;
  const endAnchorCount = allMinorComponents.filter((component) => {
    return Number.isFinite(component.startIndex) && component.startIndex >= wordCount;
  }).length;
  const maxEdgeAnchorCount = Math.max(startAnchorCount, endAnchorCount);
  return Math.max(0, maxEdgeAnchorCount - 1) * laneWidth * (MINOR_ANCHOR_SPREAD / 100);
}

function getRenderedBounds(nodeList) {
  const rects = [...nodeList].map((element) => element.getBoundingClientRect());
  if (rects.length === 0) {
    return null;
  }

  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));
  return { left, right, width: right - left };
}

function fitMinorRows() {
  if (state.mode !== "present") {
    return;
  }

  const chips = [...elements.minorPresentLane.querySelectorAll(".present-chip")];
  if (chips.length === 0) {
    return;
  }

  const laneRect = getMinorLaneMetrics();
  const edgeGuard = getStageEdgeGuard(laneRect);
  const availableWidth = Math.max(220, laneRect.width - edgeGuard * 2);
  const widestWidth = Math.max(...chips.map((chip) => chip.getBoundingClientRect().width));
  if (widestWidth <= availableWidth) {
    return;
  }

  const currentSize = Number.parseFloat(getComputedStyle(elements.app).getPropertyValue("--font-minor-current"));
  const ratio = availableWidth / widestWidth;
  const nextSize = Math.max(8, Math.floor(currentSize * ratio * 0.9));
  elements.app.style.setProperty("--font-minor-current", `${nextSize}px`);
}

function clampMinorBoxes() {
  if (state.mode !== "present") {
    return;
  }

  const laneRect = getMinorLaneMetrics();
  if (!laneRect.width) {
    return;
  }

  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const anchorPercent = Number.parseFloat(chip.style.getPropertyValue("--anchor-percent")) || 50;
    const desiredBox = Number.parseFloat(chip.style.getPropertyValue("--box-percent"));
    const targetBox = Number.isFinite(desiredBox) ? desiredBox : anchorPercent;
    const chipRect = chip.getBoundingClientRect();
    // 박스가 가장자리(문장 맨앞/맨뒤 슬롯)까지 충분히 붙을 수 있도록 여백을 작게 잡는다.
    const boxGuard = clamp(16, laneRect.width * 0.02, 56);
    const halfPercent = ((chipRect.width / 2 + boxGuard) / laneRect.width) * 100;
    const halfWidthPercent = ((chipRect.width / 2) / laneRect.width) * 100;

    // 박스가 화면 영역 내에 위치하되, 앵커(점/화살표)가 박스의 가로 폭 영역(0% ~ 100%)을 벗어나지 않도록 제한
    let minBox = Math.max(halfPercent, anchorPercent - halfWidthPercent);
    let maxBox = Math.min(100 - halfPercent, anchorPercent + halfWidthPercent);
    if (minBox > maxBox) {
      minBox = halfPercent;
      maxBox = 100 - halfPercent;
    }

    const boxPercent = halfPercent >= 50 ? 50 : clamp(minBox, targetBox, maxBox);
    chip.style.setProperty("--box-percent", `${Math.round(boxPercent * 10) / 10}%`);
    const anchorX = (anchorPercent / 100) * laneRect.width;
    const boxCenterX = (boxPercent / 100) * laneRect.width;

    // 수직선이 항상 박스 내에 안착할 수 있도록 0% ~ 100% 범위로 clamp
    const rawConnector = 50 + ((anchorX - boxCenterX) / chipRect.width) * 100;
    const connectorPercent = clamp(0, rawConnector, 100);
    chip.style.setProperty("--connector-x", `${Math.round(connectorPercent * 10) / 10}%`);
  });
}

function updateMinorConnectorLengths() {
  if (state.mode !== "present") {
    return;
  }

  const stageRect = document.querySelector(".presentation-stage")?.getBoundingClientRect();
  const majorRect = elements.majorPresentLane.getBoundingClientRect();
  if (!stageRect || !majorRect.height) {
    return;
  }

  const dotY = majorRect.top + majorRect.height * 0.85 - stageRect.top;
  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const chipRect = chip.getBoundingClientRect();
    const chipTop = chipRect.top - stageRect.top;
    const component = getCurrentSentence()?.components.find((item) => item.id === chip.dataset.componentId);
    const targetBottomY = component?.role === "adjective"
      ? getModifierTargetBottomY(component, stageRect) ?? dotY
      : dotY;

    // CSS custom properties 설정
    const minConnector = component?.role === "adjective" ? 17 : 9;
    chip.style.setProperty("--connector-length", `${Math.max(minConnector, Math.round(chipTop - targetBottomY))}px`);
    chip.style.setProperty("--connector-top", "-4px");
  });
}

function getModifierTargetBottomY(component, stageRect) {
  const indexes = getModifierTargetIndexes(component);
  if (indexes.length === 0) {
    return null;
  }

  const targetWords = getVisibleWordElementsByIndexes(indexes);
  if (targetWords.length === 0) {
    return null;
  }

  const indexSet = new Set(indexes);
  const brackets = [...document.querySelectorAll(".modifier-target-bracket")];
  const matchingBrackets = brackets.filter((bracket) => {
    const bIndexes = (bracket.dataset.indexes || "").split(",").map(Number);
    return bIndexes.length > 0 && bIndexes.every((idx) => indexSet.has(idx));
  });

  if (matchingBrackets.length > 0) {
    const bottoms = matchingBrackets.map((b) => b.getBoundingClientRect().bottom);
    return Math.max(...bottoms) - stageRect.top;
  }

  const bottom = Math.max(...targetWords.map((word) => word.getBoundingClientRect().bottom));
  return bottom - stageRect.top + 26; // 8px (bracket top offset) + ~18px (average bracket height)
}

function updateMinorPositions() {
  const sentence = getCurrentSentence();
  if (!sentence) {
    return;
  }

  const components = getPresentMinorComponents(sentence).slice(0, state.minorRevealCount);
  const metrics = getMinorLaneMetrics();
  const edgePercent = metrics.width ? (getStageEdgeGuard(metrics) / metrics.width) * 100 : 6;
  const anchorById = new Map();
  const boxById = new Map();
  const autoAdverbs = [];

  components.forEach((component) => {
    if (component.role === "adjective") {
      // 형용사어: 화살표는 항상 수식 대상 정중앙. 박스만 드래그로 옮길 수 있다.
      anchorById.set(component.id, getModifierTargetCenterPercent(component));
      if (Number.isFinite(component.boxPercent)) {
        boxById.set(component.id, clamp(edgePercent, component.boxPercent, 100 - edgePercent));
      }
      return;
    }
    if (component.pinnedAnchor) {
      // 드래그로 직접 옮긴 부사어: 선택한 슬롯(단어 사이)에 고정하고 자동 배치(spread)에서 제외해 독립적으로 움직인다.
      anchorById.set(component.id, getClosestSlot(Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1).percent);
      return;
    }
    autoAdverbs.push({
      component,
      order: component.order,
      percent: getClosestSlot(Number.isFinite(component.startIndex) ? component.startIndex : component.order - 1).percent
    });
  });

  spreadAnchors(autoAdverbs, metrics, edgePercent).forEach((percent, id) => anchorById.set(id, percent));

  elements.minorPresentLane.querySelectorAll(".present-chip").forEach((chip) => {
    const id = chip.dataset.componentId;
    const anchor = anchorById.get(id);
    if (Number.isFinite(anchor)) {
      chip.style.setProperty("--anchor-percent", `${anchor}%`);
      const box = boxById.has(id) ? boxById.get(id) : anchor;
      chip.style.setProperty("--box-percent", `${box}%`);
    }
  });
}

function applyPendingEdits() {
  if (state.mode === "input") {
    if (elements.passageInput.value.trim()) {
      preparePresentation();
    }
  } else if (state.mode === "edit") {
    const sentence = getCurrentSentence();
    if (sentence && elements.sentenceTextEditor) {
      const newText = elements.sentenceTextEditor.value.trim();
      if (newText && newText !== sentence.text) {
        sentence.text = newText;
        sentence.wordCount = getPlainWords(newText).length;
        sentence.components = analyzeSentence(newText, state.currentSentenceIndex);
        state.passageText = state.sentences.map((s) => s.text).join(" ");
        elements.passageInput.value = state.passageText;
        render();
      }
    }
  }
}

async function saveAnalysisTxt(saveAs = false) {
  applyPendingEdits();

  if (state.sentences.length === 0) {
    alert("저장할 분석 결과가 없습니다.");
    return;
  }

  const content = buildAnalysisText();
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  
  let fileName = state.currentFileName;
  if (!fileName) {
    fileName = getAnalysisFileName();
    state.currentFileName = fileName;
  }
  updateFileNameDisplay();

  // 최신 수정본을 로컬 스토리지 캐시 및 빠른 지문 불러오기 맵과 캐시에 즉시 동기화
  localStorage.setItem(`sentence_board_file_cache_${fileName}`, content);
  
  const existingEntry = state.quickFilesMap.get(fileName);
  const isHandle = existingEntry && typeof existingEntry.getFile === "function";
  if (!isHandle) {
    const updatedFile = new File([content], fileName, { type: "text/plain" });
    state.quickFilesMap.set(fileName, updatedFile);
  }
  
  QUICK_TXT_DATA[fileName] = content;

  if (!QUICK_TXT_FILES.includes(fileName)) {
    QUICK_TXT_FILES.push(fileName);
  }
  
  if (state.hasFolderSelected) {
    const filesList = Array.from(state.quickFilesMap.keys());
    localStorage.setItem("sentence_board_selected_folder_files", JSON.stringify(filesList));
  }
  
  renderTxtGrid();

  // "현재 TXT에 저장" (saveAs === false) 이고, 이전에 저장 시점 또는 불러오기 시점에 획득한 파일 핸들이 있는 경우
  if (!saveAs && state.currentFileHandle) {
    try {
      // 쓰기 권한 재확인 및 요청 (보안상 읽기전용 핸들에서 createWritable 에러 방지)
      const perm = await state.currentFileHandle.queryPermission({ mode: "readwrite" });
      if (perm !== "granted") {
        const reqPerm = await state.currentFileHandle.requestPermission({ mode: "readwrite" });
        if (reqPerm !== "granted") {
          throw new Error("파일 쓰기 권한이 거부되었습니다.");
        }
      }

      const writable = await state.currentFileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      const saveMsg = `💾 ${fileName} 파일에 수정 사항을 저장했습니다.`;
      elements.inputMessage.style.color = "var(--color-primary)";
      elements.inputMessage.textContent = saveMsg;
      if (elements.editMessage) {
        elements.editMessage.style.color = "var(--color-primary)";
        elements.editMessage.textContent = saveMsg;
      }
      setTimeout(() => {
        if (elements.inputMessage.textContent === saveMsg) {
          elements.inputMessage.textContent = "";
          elements.inputMessage.style.color = "";
        }
        if (elements.editMessage && elements.editMessage.textContent === saveMsg) {
          elements.editMessage.textContent = "";
          elements.editMessage.style.color = "";
        }
      }, 3000);
      return;
    } catch (error) {
      console.warn("기존 파일 핸들 쓰기 실패. 새 창을 띄웁니다.", error);
      // 실패 시 fall through하여 다른 이름으로 저장 진행
    }
  }

  let startInHandle = null;
  if (state.directoryHandle) {
    startInHandle = state.directoryHandle;
  } else if (state.currentFileHandle) {
    startInHandle = state.currentFileHandle;
  }

  if (startInHandle) {
    try {
      const perm = await startInHandle.queryPermission({ mode: "readwrite" });
      if (perm !== "granted") {
        await startInHandle.requestPermission({ mode: "readwrite" });
      }
    } catch (e) {
      console.warn("Failed to acquire permission for startInHandle:", e);
    }
  }

  if (window.showSaveFilePicker) {
    try {
      const pickerOptions = {
        suggestedName: fileName,
        types: [
          {
            description: "Text file",
            accept: { "text/plain": [".txt"] }
          }
        ]
      };
      if (startInHandle) {
        pickerOptions.startIn = startInHandle;
      } else {
        pickerOptions.id = "sentence_ppt_board";
      }
      const fileHandle = await window.showSaveFilePicker(pickerOptions);
      state.currentFileHandle = fileHandle;
      state.currentFileName = fileHandle.name;
      updateFileNameDisplay();
      
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      // 저장된 새 파일명으로 로컬 스토리지 캐시 및 데이터 동기화 재정렬
      localStorage.setItem(`sentence_board_file_cache_${fileHandle.name}`, content);
      state.quickFilesMap.set(fileHandle.name, fileHandle); // FileHandle 저장
      QUICK_TXT_DATA[fileHandle.name] = content;
      if (!QUICK_TXT_FILES.includes(fileHandle.name)) {
        QUICK_TXT_FILES.push(fileHandle.name);
      }
      
      if (state.hasFolderSelected) {
        const filesList = Array.from(state.quickFilesMap.keys());
        localStorage.setItem("sentence_board_selected_folder_files", JSON.stringify(filesList));
      }
      
      renderTxtGrid();

      const saveMsg = `💾 ${fileHandle.name} 파일로 저장했습니다.`;
      elements.inputMessage.style.color = "var(--color-primary)";
      elements.inputMessage.textContent = saveMsg;
      if (elements.editMessage) {
        elements.editMessage.style.color = "var(--color-primary)";
        elements.editMessage.textContent = saveMsg;
      }
      setTimeout(() => {
        if (elements.inputMessage.textContent === saveMsg) {
          elements.inputMessage.textContent = "";
          elements.inputMessage.style.color = "";
        }
        if (elements.editMessage && elements.editMessage.textContent === saveMsg) {
          elements.editMessage.textContent = "";
          elements.editMessage.style.color = "";
        }
      }, 3000);
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
      console.warn("Save picker failed. Falling back to download.", error);
    }
  }

  // File System Access API 미지원 또는 취소 시 다운로드 링크 생성
  downloadAnalysisTxt(blob, fileName);
}

function getAnalysisFileName() {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `sentence-analysis-${stamp}.txt`;
}

function downloadAnalysisTxt(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function buildAnalysisText() {
  const payload = buildAnalysisPayload();
  const lines = [
    EXPORT_MARKER,
    "영어 문장 분석 저장 파일",
    `저장 시각: ${payload.savedAt}`,
    `총 문장 수: ${payload.sentences.length}`,
    "",
    "[문장 및 성분 인덱스]"
  ];

  payload.sentences.forEach((sentence) => {
    lines.push("");
    lines.push(`[문장 ${sentence.sentenceIndex}] ${sentence.text}`);
    lines.push(`  단어 수: ${sentence.wordCount}`);
    sentence.components.forEach((component) => {
      lines.push(`  - 성분 ${component.componentIndex}: id=${component.id}, lane=${component.lane}, role=${component.role}, order=${component.order}, wordIndex0=${component.startIndex}-${component.endIndex}, wordIndex1=${formatOneBasedRange(component.startIndex, component.endIndex)}, text="${component.text}"`);
    });
  });

  lines.push("");
  lines.push(EXPORT_JSON_START);
  lines.push(JSON.stringify(payload, null, 2));
  lines.push(EXPORT_JSON_END);
  return lines.join("\n");
}

function buildAnalysisPayload() {
  return {
    version: 1,
    app: "sentence-presentation-board",
    savedAt: new Date().toISOString(),
    passageText: state.passageText || state.sentences.map((sentence) => sentence.text).join(" "),
    currentSentenceIndex: state.currentSentenceIndex,
    componentSerial: state.componentSerial,
    settings: { ...state.settings },
    sentences: state.sentences.map((sentence, sentenceIndex) => ({
      id: sentence.id || `sentence-${sentenceIndex + 1}`,
      sentenceIndex: sentenceIndex + 1,
      text: sentence.text,
      isImportant: sentence.isImportant === true,
      wordCount: Number.isFinite(sentence.wordCount) ? sentence.wordCount : getPlainWords(sentence.text).length,
      components: sentence.components.map((component, componentIndex) => ({
        id: component.id,
        sentenceIndex: sentenceIndex + 1,
        componentIndex: componentIndex + 1,
        text: component.text,
        role: component.role,
        lane: component.lane,
        order: component.order,
        startIndex: component.startIndex,
        endIndex: component.endIndex,
        modifierTargetId: component.modifierTargetId,
        modifierTargetStart: component.modifierTargetStart,
        modifierTargetEnd: component.modifierTargetEnd,
        modifierTargetIndexes: component.modifierTargetIndexes,
        pinnedAnchor: component.pinnedAnchor,
        boxPercent: component.boxPercent,
        pinOrder: Number.isInteger(component.pinOrder) ? component.pinOrder : undefined,
        words: getComponentWords(component)
      }))
    }))
  };
}

function formatOneBasedRange(startIndex, endIndex) {
  if (!Number.isFinite(Number(startIndex)) || !Number.isFinite(Number(endIndex))) {
    return "unknown";
  }
  return `${Number(startIndex) + 1}-${Number(endIndex)}`;
}

async function triggerAnalysisImport() {
  if (!window.showOpenFilePicker) {
    elements.analysisFileInput.value = "";
    elements.analysisFileInput.click();
    return;
  }
  
  let startInHandle = null;
  if (state.directoryHandle) {
    startInHandle = state.directoryHandle;
  } else if (state.currentFileHandle) {
    startInHandle = state.currentFileHandle;
  }

  if (startInHandle) {
    try {
      const perm = await startInHandle.queryPermission({ mode: "readwrite" });
      if (perm !== "granted") {
        await startInHandle.requestPermission({ mode: "readwrite" });
      }
    } catch (e) {
      console.warn("Failed to acquire permission for startInHandle:", e);
    }
  }

  try {
    const pickerOptions = {
      types: [
        {
          description: "Text file",
          accept: { "text/plain": [".txt"] }
        }
      ]
    };
    if (startInHandle) {
      pickerOptions.startIn = startInHandle;
    } else {
      pickerOptions.id = "sentence_ppt_board";
    }
    const [fileHandle] = await window.showOpenFilePicker(pickerOptions);
    if (!fileHandle) {
      return;
    }

    state.currentFileName = fileHandle.name;
    updateFileNameDisplay();
    state.currentFileHandle = fileHandle; // 파일 핸들 즉시 저장!
    await saveHandleToDB("currentFileHandle", fileHandle);
    
    const file = await fileHandle.getFile();
    const resultText = await file.text();
    
    // 캐시 동기화 및 로드
    localStorage.setItem(`sentence_board_file_cache_${fileHandle.name}`, resultText);
    importAnalysisTxt(resultText);
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    alert(`지문을 불러오지 못했습니다: ${error.message}`);
  }
}

function handleAnalysisFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  // 최신 가져온 파일명 기록 및 빠른 지문 맵에 등록
  state.currentFileName = file.name;
  updateFileNameDisplay();
  state.currentFileHandle = null; // 수동으로 새 파일 로드 시 이전 핸들 초기화
  state.quickFilesMap.set(file.name, file);
  if (!QUICK_TXT_FILES.includes(file.name)) {
    QUICK_TXT_FILES.push(file.name);
  }
  renderTxtGrid();

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const resultText = String(reader.result || "");
      // 기존 TXT 불러오기로 가져온 최신 데이터를 즉시 로컬 스토리지 캐시에 동기화
      localStorage.setItem(`sentence_board_file_cache_${file.name}`, resultText);
      importAnalysisTxt(resultText);
    } catch (error) {
      alert(`지문을 불러오지 못했습니다: ${error.message}`);
    }
  };
  reader.onerror = () => alert("파일을 읽는 중 오류가 발생했습니다.");
  reader.readAsText(file, "utf-8");
}

function importAnalysisTxt(content) {
  const trimmed = content.trim();
  const isAnalysisFile = trimmed.startsWith(EXPORT_MARKER) || trimmed.includes(EXPORT_MARKER);

  if (isAnalysisFile) {
    try {
      const payload = parseAnalysisTxt(trimmed);
      const loaded = normalizeImportedAnalysis(payload);
      state.passageText = loaded.passageText;
      state.sentences = loaded.sentences;
      state.currentSentenceIndex = loaded.currentSentenceIndex;
      state.minorRevealCount = 0;
      state.componentSerial = loaded.componentSerial;
      state.settings = { ...state.settings, ...loaded.settings };
      elements.passageInput.value = state.passageText;
      elements.inputMessage.textContent = "저장된 분석 결과를 불러왔습니다. 아래 '2단계-문장분석 시작'을 누르시면 적용됩니다.";
      state.hasLoadedAnalysis = true; // 분석 내용 로드 플래그 활성화
    } catch (error) {
      console.warn("분석 JSON 파싱 실패, 순수 지문 본문 추출 폴백 시도:", error);
      try {
        const plainText = extractPassageTextFromDamagedTxt(trimmed);
        loadAsPlainPassage(plainText);
        elements.inputMessage.style.color = "var(--color-primary)";
        elements.inputMessage.textContent = "⚠️ 분석 파일 복원에 실패하여 지문 텍스트만 추출해 불러왔습니다. 아래 '2단계-문장분석 시작'을 누르면 새로 분석됩니다.";
      } catch (fallbackError) {
        throw new Error(`분석 파일 복원 및 지문 추출에 실패했습니다: ${fallbackError.message}`);
      }
    }
  } else {
    loadAsPlainPassage(trimmed);
  }
}

function extractPassageTextFromDamagedTxt(content) {
  // 1. JSON이 존재하지만 파싱 에러(SyntaxError)가 난 경우를 대비해 passageText 값 추출 시도
  const start = content.indexOf(EXPORT_JSON_START);
  const end = content.indexOf(EXPORT_JSON_END);
  if (start !== -1 && end > start) {
    const jsonText = content.slice(start + EXPORT_JSON_START.length, end).trim();
    const match = jsonText.match(/"passageText"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (match && match[1]) {
      try {
        return JSON.parse(`"${match[1]}"`);
      } catch (e) {
        return match[1];
      }
    }
  }

  // 2. JSON에서 추출이 안 되는 경우, [문장 N] 라인들에서 문장 텍스트 추출 시도
  const lines = content.split(/\r?\n/);
  const sentences = [];
  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const match = trimmedLine.match(/^\[문장\s*\d+\]\s*(.+)$/i);
    if (match && match[1]) {
      sentences.push(match[1].trim());
    }
  });

  if (sentences.length > 0) {
    return sentences.join(" ");
  }

  throw new Error("분석 파일 내에서 영어 지문을 추출할 수 없습니다.");
}

function loadAsPlainPassage(content) {
  if (!content) {
    throw new Error("빈 텍스트 파일입니다.");
  }
  elements.passageInput.value = content;
  state.hasLoadedAnalysis = false;
  elements.inputMessage.textContent = "지문 텍스트를 불러왔습니다. 아래 '2단계-문장분석 시작'을 누르시면 분석이 시작됩니다.";
}

function parseAnalysisTxt(content) {
  const start = content.indexOf(EXPORT_JSON_START);
  const end = content.indexOf(EXPORT_JSON_END);
  if (start !== -1 && end > start) {
    const jsonText = content.slice(start + EXPORT_JSON_START.length, end).trim();
    return JSON.parse(jsonText);
  }

  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  throw new Error("이 앱에서 저장한 분석 TXT 파일이 아닙니다.");
}

function normalizeImportedAnalysis(payload) {
  if (!payload || !Array.isArray(payload.sentences)) {
    throw new Error("TXT 파일 안에 문장 분석 데이터가 없습니다.");
  }

  const sentences = payload.sentences
    .map((sentence, sentenceIndex) => normalizeImportedSentence(sentence, sentenceIndex))
    .filter(Boolean);

  if (sentences.length === 0) {
    throw new Error("불러올 문장이 없습니다.");
  }

  return {
    passageText: String(payload.passageText || sentences.map((sentence) => sentence.text).join(" ")),
    sentences,
    currentSentenceIndex: clamp(0, Number(payload.currentSentenceIndex) || 0, sentences.length - 1),
    componentSerial: Math.max(Number(payload.componentSerial) || 1, countImportedComponents(sentences) + 1),
    settings: typeof payload.settings === "object" && payload.settings ? payload.settings : {}
  };
}

function normalizeImportedSentence(sentence, sentenceIndex) {
  const text = String(sentence?.text || "").trim();
  if (!text) {
    return null;
  }

  const components = Array.isArray(sentence.components) && sentence.components.length > 0
    ? sentence.components.map((component, componentIndex) => normalizeImportedComponent(component, sentenceIndex, componentIndex)).filter(Boolean)
    : analyzeSentence(text, sentenceIndex);

  return {
    id: String(sentence.id || `sentence-${sentenceIndex + 1}`),
    text,
    isImportant: sentence.isImportant === true,
    wordCount: Number.isFinite(Number(sentence.wordCount)) ? Number(sentence.wordCount) : getPlainWords(text).length,
    components
  };
}

function normalizeImportedComponent(component, sentenceIndex, componentIndex) {
  const role = ROLE_BY_VALUE[component?.role] ? component.role : "adverb";
  const lane = component?.lane === "major" || component?.lane === "minor" ? component.lane : ROLE_BY_VALUE[role].lane;
  const text = String(component?.text || "").trim();
  if (!text) {
    return null;
  }

  const startIndex = Number(component?.startIndex);
  const endIndex = Number(component?.endIndex);
  const modifierTargetStart = Number(component?.modifierTargetStart);
  const modifierTargetEnd = Number(component?.modifierTargetEnd);
  const boxPercent = Number(component?.boxPercent);
  return {
    // 저장 파일에 중복 id가 있을 수 있으므로 불러올 때 항상 고유 id를 새로 부여한다.
    // (수식 대상은 modifierTargetIndexes(단어 인덱스)로 복원되므로 id 변경의 영향이 없다)
    id: `s${sentenceIndex + 1}-c${componentIndex + 1}`,
    text,
    role,
    lane,
    order: Number.isFinite(Number(component?.order)) ? Number(component.order) : componentIndex + 1,
    startIndex: Number.isFinite(startIndex) ? startIndex : undefined,
    endIndex: Number.isFinite(endIndex) ? endIndex : undefined,
    modifierTargetStart: Number.isFinite(modifierTargetStart) ? modifierTargetStart : undefined,
    modifierTargetEnd: Number.isFinite(modifierTargetEnd) ? modifierTargetEnd : undefined,
    modifierTargetIndexes: Array.isArray(component?.modifierTargetIndexes)
      ? component.modifierTargetIndexes.map((index) => Number(index)).filter((index) => Number.isInteger(index) && index >= 0)
      : undefined,
    pinnedAnchor: component?.pinnedAnchor === true ? true : undefined,
    boxPercent: Number.isFinite(boxPercent) ? boxPercent : undefined,
    pinOrder: Number.isInteger(component?.pinOrder) ? Number(component.pinOrder) : undefined
  };
}

function countImportedComponents(sentences) {
  return sentences.reduce((count, sentence) => count + sentence.components.length, 0);
}

function clamp(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function updateNavButtons() {
  const isFirst = state.currentSentenceIndex === 0;
  const isLast = state.currentSentenceIndex >= state.sentences.length - 1;
  const minorCount = getCurrentMinorCount();
  const isFirstPresentationStep = isFirst && state.minorRevealCount === 0;
  const isLastPresentationStep = isLast && state.minorRevealCount >= minorCount;

  [elements.editFirstButton, elements.editPrevButton].forEach((button) => {
    button.disabled = isFirst;
  });
  elements.presentPrevButton.disabled = isFirstPresentationStep;

  [elements.editLastButton, elements.editNextButton].forEach((button) => {
    button.disabled = isLast;
  });
  elements.presentNextButton.disabled = isLastPresentationStep;
  elements.presentFirstSentenceButton.disabled = isFirst;
  elements.presentLastSentenceButton.textContent = isLast ? "2단계-문장분석" : "마지막 문장";
  // "마지막 문장"(마지막 문장으로 이동) / "2단계-문장분석"(2단계 수정 화면으로 이동) 모두 항상 유효한 동작이므로 비활성화하지 않는다.
  elements.presentLastSentenceButton.disabled = state.sentences.length === 0;
}

function updateFileNameDisplay() {
  if (!elements.fileNameDisplay) return;
  if (state.currentFileName) {
    elements.fileNameDisplay.textContent = state.currentFileName;
    elements.fileNameDisplay.classList.remove("hidden");
  } else {
    elements.fileNameDisplay.textContent = "";
    elements.fileNameDisplay.classList.add("hidden");
  }
}

function renderTxtGrid() {
  if (!elements.txtGrid) return;
  elements.txtGrid.innerHTML = "";

  const files = state.hasFolderSelected ? Array.from(state.quickFilesMap.keys()) : QUICK_TXT_FILES;
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  // 5x5 = 25개의 버튼 생성
  for (let i = 0; i < 25; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "txt-btn";

    if (i < files.length) {
      const fileName = files[i];
      const displayName = fileName.replace(/\.txt$/, "");
      btn.textContent = displayName;
      btn.setAttribute("aria-label", `${displayName} 지문 불러오기`);
      btn.addEventListener("click", () => {
        if (state.hasFolderSelected) {
          loadQuickTxtFromUploadedFile(fileName);
        } else {
          loadQuickTxt(fileName);
        }
      });
    } else {
      btn.textContent = "-";
      btn.disabled = true;
    }

    elements.txtGrid.appendChild(btn);
  }
}

async function loadQuickTxt(fileName) {
  try {
    state.currentFileName = fileName;
    updateFileNameDisplay();
    state.currentFileHandle = null; // 새 지문 불러오기 시 이전 파일 핸들 초기화
    await saveHandleToDB("currentFileHandle", null);
    
    // 로컬 스토리지 캐시 우선 조회
    const cachedContent = localStorage.getItem(`sentence_board_file_cache_${fileName}`);
    const text = cachedContent || QUICK_TXT_DATA[fileName];
    if (!text) {
      throw new Error("정의되지 않은 지문 파일입니다.");
    }
    
    importAnalysisTxt(text);

    elements.inputMessage.style.color = "var(--color-primary)";
    elements.inputMessage.textContent = `✅ [내장] ${fileName.replace(/\.txt$/, "")} 지문을 성공적으로 불러왔습니다.`;
    setTimeout(() => {
      if (elements.inputMessage.textContent.includes("성공적으로")) {
        elements.inputMessage.textContent = "";
        elements.inputMessage.style.color = "";
      }
    }, 3000);
  } catch (error) {
    console.error(error);
    elements.inputMessage.style.color = "var(--color-warning)";
    elements.inputMessage.textContent = `❌ 지문을 불러오지 못했습니다: ${error.message}`;
  }
}

async function ensureDirectoryPermissionAndRebuildMap() {
  if (!state.directoryHandle) {
    return false;
  }
  try {
    let permission = await state.directoryHandle.queryPermission({ mode: "readwrite" });
    if (permission !== "granted") {
      permission = await state.directoryHandle.requestPermission({ mode: "readwrite" });
    }
    if (permission === "granted") {
      state.quickFilesMap.clear();
      for await (const entry of state.directoryHandle.values()) {
        if (entry.kind === "file" && entry.name.toLowerCase().endsWith(".txt")) {
          state.quickFilesMap.set(entry.name, entry);
        }
      }
      return true;
    }
  } catch (e) {
    console.warn("Failed to request directory permission:", e);
  }
  return false;
}

async function loadQuickTxtFromUploadedFile(fileName) {
  try {
    state.currentFileName = fileName;
    updateFileNameDisplay();
    state.currentFileHandle = null; // 새 지문 불러오기 시 이전 파일 핸들 초기화
    
    // 디렉터리 권한 재허가 및 최신 파일 목록 확보
    await ensureDirectoryPermissionAndRebuildMap();
    
    const fileEntry = state.quickFilesMap.get(fileName);
    
    // 1. File System Access API의 파일 핸들인 경우 (entry.getFile이 존재) -> 덮어쓰기 권한을 유지하며 데이터 로드
    if (fileEntry && typeof fileEntry.getFile === "function") {
      state.currentFileHandle = fileEntry; // 현재 파일 핸들에 저장!
      await saveHandleToDB("currentFileHandle", fileEntry);
      try {
        const file = await fileEntry.getFile();
        const resultText = await file.text();
        localStorage.setItem(`sentence_board_file_cache_${fileName}`, resultText);
        localStorage.setItem(`sentence_board_file_raw_cache_${fileName}`, resultText);
        importAnalysisTxt(resultText);
        showSuccessfulLoadMessage(fileName);
        return;
      } catch (error) {
        alert(`지문을 분석하는 중 오류가 발생했습니다: ${error.message}`);
        return;
      }
    }
    
    // 2. Fallback: input directory 등 일반 File 객체인 경우
    if (fileEntry && !fileEntry.isMock) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const resultText = String(reader.result || "");
          localStorage.setItem(`sentence_board_file_cache_${fileName}`, resultText);
          localStorage.setItem(`sentence_board_file_raw_cache_${fileName}`, resultText);
          importAnalysisTxt(resultText);
          showSuccessfulLoadMessage(fileName);
        } catch (error) {
          alert(`지문을 분석하는 중 오류가 발생했습니다: ${error.message}`);
        }
      };
      reader.onerror = () => alert("파일을 읽는 중 오류가 발생했습니다.");
      reader.readAsText(fileEntry, "utf-8");
      return;
    }

    // 3. 실제 파일 객체가 없거나, mock 객체인 경우 (새로고침 후 자동 복구 상태 등) -> 캐시 우선 사용
    const cachedContent = localStorage.getItem(`sentence_board_file_cache_${fileName}`);
    if (cachedContent) {
      importAnalysisTxt(cachedContent);
      showSuccessfulLoadMessage(fileName);
      return;
    }

    const rawCache = localStorage.getItem(`sentence_board_file_raw_cache_${fileName}`);
    if (rawCache) {
      // 첫 로딩 시 로컬 스토리지 수정본 캐시로도 복사
      localStorage.setItem(`sentence_board_file_cache_${fileName}`, rawCache);
      importAnalysisTxt(rawCache);
      showSuccessfulLoadMessage(fileName);
      return;
    }

    throw new Error("파일 객체 또는 캐시 데이터를 찾을 수 없습니다.");
  } catch (error) {
    console.error(error);
    elements.inputMessage.style.color = "var(--color-warning)";
    elements.inputMessage.textContent = `❌ 지문을 불러오지 못했습니다: ${error.message}`;
  }
}

function showSuccessfulLoadMessage(fileName) {
  elements.inputMessage.style.color = "var(--color-primary)";
  elements.inputMessage.textContent = `✅ ${fileName.replace(/\.txt$/, "")} 지문을 성공적으로 불러왔습니다.`;
  setTimeout(() => {
    if (elements.inputMessage.textContent.includes("성공적으로")) {
      elements.inputMessage.textContent = "";
      elements.inputMessage.style.color = "";
    }
  }, 3000);
}

async function selectDirectory() {
  if (!window.showDirectoryPicker) {
    elements.folderInput.click();
    return;
  }
  try {
    const dirHandle = await window.showDirectoryPicker({
      id: "sentence_ppt_board"
    });
    clearRawFolderCache(); // 이전 폴더 원본 백업 캐시 소거
    state.quickFilesMap.clear();
    state.directoryHandle = dirHandle;
    state.currentFileHandle = null;
    state.currentFileName = null;
    updateFileNameDisplay();
    state.hasFolderSelected = true;
    
    await saveHandleToDB("directoryHandle", dirHandle);
    await saveHandleToDB("currentFileHandle", null);

    const txtFiles = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && entry.name.toLowerCase().endsWith(".txt")) {
        state.quickFilesMap.set(entry.name, entry); // FileHandle을 직접 맵에 저장
        txtFiles.push(entry.name);
      }
    }

    if (txtFiles.length === 0) {
      localStorage.removeItem("sentence_board_has_folder_selected");
      localStorage.removeItem("sentence_board_selected_folder_name");
      localStorage.removeItem("sentence_board_selected_folder_files");
      
      elements.inputMessage.style.color = "var(--color-warning)";
      elements.inputMessage.textContent = "⚠️ 선택한 폴더 바로 아래에 .txt 파일이 존재하지 않습니다.";
      return;
    }

    // 로컬 스토리지에 폴더 메타데이터 저장
    try {
      localStorage.setItem("sentence_board_has_folder_selected", "true");
      localStorage.setItem("sentence_board_selected_folder_name", dirHandle.name);
      localStorage.setItem("sentence_board_selected_folder_files", JSON.stringify(txtFiles));
    } catch (e) {
      console.warn("Storage quota exceeded or storage disallowed for metadata:", e);
    }

    // 각 파일의 원본 콘텐츠를 비동기적으로 읽어서 localStorage에 캐싱
    for (const fileName of txtFiles) {
      const fileEntry = state.quickFilesMap.get(fileName);
      if (!fileEntry) continue;
      try {
        const file = await fileEntry.getFile();
        const content = await file.text();
        localStorage.setItem(`sentence_board_file_raw_cache_${fileName}`, content);
      } catch (e) {
        console.warn(`Failed to cache raw content of ${fileName}:`, e);
      }
    }

    renderTxtGrid();

    elements.inputMessage.style.color = "var(--color-primary)";
    elements.inputMessage.textContent = `📁 ${dirHandle.name} 폴더에서 ${txtFiles.length}개의 지문 파일을 성공적으로 연결했습니다.`;
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.error(error);
    alert(`폴더 파일을 읽는 중 오류가 발생했습니다: ${error.message}`);
  }
}

function handleFolderSelected(event) {
  try {
    const files = Array.from(event.target.files || []);
    clearRawFolderCache(); // 이전 폴더 원본 백업 캐시 소거
    state.quickFilesMap.clear();
    state.currentFileHandle = null; // 폴더 변경 시 이전 파일 핸들 초기화
    state.currentFileName = null;
    updateFileNameDisplay();

    const txtFiles = [];
    files.forEach((file) => {
      const pathParts = file.webkitRelativePath.split("/");
      if (pathParts.length === 2 && file.name.toLowerCase().endsWith(".txt")) {
        state.quickFilesMap.set(file.name, file);
        txtFiles.push(file.name);
      }
    });

    if (txtFiles.length === 0) {
      localStorage.removeItem("sentence_board_has_folder_selected");
      localStorage.removeItem("sentence_board_selected_folder_name");
      localStorage.removeItem("sentence_board_selected_folder_files");
      
      elements.inputMessage.style.color = "var(--color-warning)";
      elements.inputMessage.textContent = "⚠️ 선택한 폴더 바로 아래에 .txt 파일이 존재하지 않습니다.";
      return;
    }

    state.hasFolderSelected = true;
    
    // 로컬 스토리지에 폴더 메타데이터 저장
    const folderName = files[0]?.webkitRelativePath.split("/")[0] || "지정 폴더";
    try {
      localStorage.setItem("sentence_board_has_folder_selected", "true");
      localStorage.setItem("sentence_board_selected_folder_name", folderName);
      localStorage.setItem("sentence_board_selected_folder_files", JSON.stringify(txtFiles));
    } catch (e) {
      console.warn("Storage quota exceeded or storage disallowed for metadata:", e);
    }

    // 각 파일의 원본 콘텐츠를 비동기적으로 읽어서 localStorage에 캐싱
    txtFiles.forEach((fileName) => {
      const file = state.quickFilesMap.get(fileName);
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = String(reader.result || "");
          localStorage.setItem(`sentence_board_file_raw_cache_${fileName}`, content);
        } catch (e) {
          console.warn(`Failed to cache raw content of ${fileName}:`, e);
        }
      };
      reader.readAsText(file, "utf-8");
    });

    renderTxtGrid();

    elements.inputMessage.style.color = "var(--color-primary)";
    elements.inputMessage.textContent = `📁 ${folderName} 폴더에서 ${txtFiles.length}개의 지문 파일을 성공적으로 연결했습니다.`;
  } catch (error) {
    console.error(error);
    alert(`폴더 파일을 읽는 중 오류가 발생했습니다: ${error.message}`);
  }
}

function goToInputStart() {
  state.currentSentenceIndex = 0;
  setScreenOff(false);
  setMode("input");
}

function setScreenOff(isOff) {
  elements.screenOffOverlay.classList.toggle("hidden", !isOff);
}

function bindEvents() {
  elements.passageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.hasLoadedAnalysis) {
      state.hasLoadedAnalysis = false;
      elements.inputMessage.textContent = "";
      setMode("edit");
    } else {
      const count = preparePresentation();
      if (count === 0) {
        elements.inputMessage.textContent = "영어 지문을 먼저 입력해 주세요.";
        return;
      }
      elements.inputMessage.textContent = "";
      setMode("edit");
    }
  });

  elements.passageInput.addEventListener("input", () => {
    state.hasLoadedAnalysis = false;
    state.currentFileName = null;
    updateFileNameDisplay();
  });

  elements.sampleButton.addEventListener("click", () => {
    elements.passageInput.value = SAMPLE_TEXT;
    elements.inputMessage.textContent = "";
    state.currentFileName = null;
    updateFileNameDisplay();
  });

  elements.clearButton.addEventListener("click", async () => {
    elements.passageInput.value = "";
    elements.inputMessage.textContent = "";
    state.sentences = [];
    state.currentSentenceIndex = 0;
    state.minorRevealCount = 0;
    state.currentFileName = null;
    updateFileNameDisplay();
    state.currentFileHandle = null;
    await saveHandleToDB("currentFileHandle", null);
  });

  elements.inputSaveTxtButton.addEventListener("click", () => saveAnalysisTxt(false));
  elements.inputSaveAsTxtButton.addEventListener("click", () => saveAnalysisTxt(true));
  elements.inputImportButton.addEventListener("click", triggerAnalysisImport);
  elements.applySentenceTextButton.addEventListener("click", updateSentenceText);
  elements.toggleImportantButton.addEventListener("click", toggleImportantSentence);
  elements.addSentenceButton.addEventListener("click", insertNewSentence);
  elements.deleteSentenceButton.addEventListener("click", deleteCurrentSentence);
  elements.saveTxtButton.addEventListener("click", () => saveAnalysisTxt(false));
  elements.saveAsTxtButton.addEventListener("click", () => saveAnalysisTxt(true));
  elements.analysisFileInput.addEventListener("change", handleAnalysisFileSelected);

  elements.themeSelect.addEventListener("change", () => {
    state.settings.theme = elements.themeSelect.value;
    applySettings();
    schedulePresentationFit();
  });

  elements.backToInputButton.addEventListener("click", () => setMode("input"));
  elements.returnInputButton.addEventListener("click", goToInputStart);
  elements.startPresentButton.addEventListener("click", () => setMode("present"));
  elements.presentFitButton.addEventListener("click", togglePresentFullscreen);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  elements.returnEditButton.addEventListener("click", () => setMode("edit"));
  elements.presentFirstSentenceButton.addEventListener("click", goToPresentationFirstSentence);
  elements.presentLastSentenceButton.addEventListener("click", handlePresentationLastButton);
  elements.screenOnButton.addEventListener("click", () => setScreenOff(false));
  elements.screenOffOverlay.addEventListener("click", (event) => {
    if (event.target === elements.screenOffOverlay) {
      setScreenOff(false);
    }
  });

  elements.editFirstButton.addEventListener("click", () => goToSentence(0));
  elements.editPrevButton.addEventListener("click", () => goToSentence(state.currentSentenceIndex - 1));
  elements.editNextButton.addEventListener("click", () => goToSentence(state.currentSentenceIndex + 1));
  elements.editLastButton.addEventListener("click", () => goToSentence(state.sentences.length - 1));
  elements.presentPrevButton.addEventListener("click", goToPresentationPrev);
  elements.presentNextButton.addEventListener("click", goToPresentationNext);
  elements.presentView.addEventListener("click", handlePresentationClick);

  [elements.majorEditLane, elements.minorEditLane].forEach((lane) => {
    lane.addEventListener("dragover", handleLaneDragOver);
    lane.addEventListener("dragleave", handleLaneDragLeave);
    lane.addEventListener("drop", handleLaneDrop);
  });

  elements.minorPresentLane.addEventListener("dragover", handlePresentMinorDragOver);
  elements.minorPresentLane.addEventListener("drop", handlePresentMinorDrop);

  elements.selectFolderButton.addEventListener("click", selectDirectory);
  elements.folderInput.addEventListener("change", handleFolderSelected);

  document.addEventListener("keydown", handleKeyboard);
  window.addEventListener("resize", () => {
    applySettings();
    schedulePresentationFit();
    scheduleDetailFit();
    adjustEditViewScale();
  });
  elements.elementCloseButton.addEventListener("click", hideElementDetail);
  elements.elementDetailOverlay.addEventListener("click", (event) => {
    if (event.target === elements.elementDetailOverlay) {
      hideElementDetail();
    }
  });
}

function handleKeyboard(event) {
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "TEXTAREA" || activeTag === "INPUT" || activeTag === "SELECT") {
    return;
  }

  if (!elements.screenOffOverlay.classList.contains("hidden")) {
    event.preventDefault();
    setScreenOff(false);
    return;
  }

  if (state.mode === "edit") {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (state.currentSentenceIndex < state.sentences.length - 1) {
        goToSentence(state.currentSentenceIndex + 1);
      }
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (state.currentSentenceIndex > 0) {
        goToSentence(state.currentSentenceIndex - 1);
      }
    }
    return;
  }

  if (state.mode !== "present") {
    return;
  }

  if (event.key >= "1" && event.key <= "9") {
    event.preventDefault();
    const importantSentences = state.sentences
      .map((s, idx) => ({ ...s, originalIndex: idx }))
      .filter(s => s.isImportant);
    const targetIndex = Number(event.key) - 1;
    if (importantSentences[targetIndex]) {
      goToSentence(importantSentences[targetIndex].originalIndex, 0);
    }
    return;
  }

  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    goToPresentationNext();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPresentationPrev();
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    goToPresentationSentence(1);
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    goToPresentationSentence(-1);
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSentence(0, 0);
  }
  if (event.key === "End") {
    event.preventDefault();
    const lastSentence = state.sentences[state.sentences.length - 1];
    goToSentence(state.sentences.length - 1, getComponentsByLane(lastSentence, "minor").length);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    if (!elements.elementDetailOverlay.classList.contains("hidden")) {
      hideElementDetail();
      return;
    }
    setMode("edit");
  }
}

function clearRawFolderCache() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sentence_board_file_raw_cache_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error("Error clearing raw folder cache:", e);
  }
}

// IndexedDB Helpers for persisting File System Access API handles
const DB_NAME = "SentenceBoardDB";
const STORE_NAME = "Handles";

function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveHandleToDB(key, handle) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(handle, key);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (e) {
    console.warn("IndexedDB save failed:", e);
  }
}

async function getHandleFromDB(key) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (e) {
    console.warn("IndexedDB load failed:", e);
    return null;
  }
}

async function restoreSelectedFolder() {
  try {
    // 1. IndexedDB로부터 디렉터리 및 파일 핸들 복구 시도
    const dirHandle = await getHandleFromDB("directoryHandle");
    if (dirHandle) {
      state.directoryHandle = dirHandle;
      state.hasFolderSelected = true;
      
      // 권한 확인 및 빠른 지문 맵 재구축 시도
      try {
        const permission = await dirHandle.queryPermission({ mode: "readwrite" });
        if (permission === "granted") {
          state.quickFilesMap.clear();
          for await (const entry of dirHandle.values()) {
            if (entry.kind === "file" && entry.name.toLowerCase().endsWith(".txt")) {
              state.quickFilesMap.set(entry.name, entry);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to reconstruct map from dirHandle:", e);
      }
    }

    const fileHandle = await getHandleFromDB("currentFileHandle");
    if (fileHandle) {
      state.currentFileHandle = fileHandle;
      state.currentFileName = fileHandle.name;
    }
    updateFileNameDisplay();

    // 2. localStorage 메타데이터를 활용한 화면 구성 복구 (IndexedDB 스캔이 불가능하거나 실패 시 대비 폴백)
    const hasFolder = localStorage.getItem("sentence_board_has_folder_selected") === "true";
    if (!hasFolder) {
      renderTxtGrid();
      return;
    }
    
    const folderName = localStorage.getItem("sentence_board_selected_folder_name") || "지정 폴더";
    const filesJson = localStorage.getItem("sentence_board_selected_folder_files");
    if (!filesJson) {
      renderTxtGrid();
      return;
    }
    
    const txtFiles = JSON.parse(filesJson);
    if (!Array.isArray(txtFiles) || txtFiles.length === 0) {
      renderTxtGrid();
      return;
    }
    
    state.hasFolderSelected = true;
    
    // quickFilesMap이 완전히 빈 경우에만 mock 데이터로 화면 그리드 채우기
    if (state.quickFilesMap.size === 0) {
      txtFiles.forEach((fileName) => {
        state.quickFilesMap.set(fileName, { name: fileName, isMock: true });
      });
    }
    
    elements.inputMessage.style.color = "var(--color-primary)";
    elements.inputMessage.textContent = `📁 [연동됨] ${folderName} 폴더에서 ${txtFiles.length}개의 지문 파일이 연결되어 있습니다.`;
    
    renderTxtGrid();
  } catch (error) {
    console.error("Failed to restore folder selection:", error);
    renderTxtGrid();
  }
}

bindEvents();
applySettings();
restoreSelectedFolder();

function showElementDetail(component) {
  elements.elementDetailOverlay.classList.remove("hidden");
  elements.elementDetailRole.textContent = ROLE_BY_VALUE[component.role]?.label || "성분";
  elements.elementDetailRole.style.backgroundColor = COMPONENT_PALETTE[component.role] || "var(--color-primary)";

  elements.elementDetailText.innerHTML = "";
  const containerDiv = document.createElement("div");
  containerDiv.className = "detail-text-container";

  const words = component.text.trim().split(/\s+/);
  const lines = [];
  for (let i = 0; i < words.length; i += 10) {
    lines.push(words.slice(i, i + 10).join(" "));
  }

  lines.forEach((lineText) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "detail-text-line";
    lineDiv.textContent = lineText;
    containerDiv.appendChild(lineDiv);
  });
  elements.elementDetailText.appendChild(containerDiv);

  scheduleDetailFit();
}

function hideElementDetail() {
  elements.elementDetailOverlay.classList.add("hidden");
}

function scheduleDetailFit() {
  let pass = 0;
  const runPass = () => {
    adjustDetailFontSize();
    pass += 1;
    if (pass < 5) {
      requestAnimationFrame(runPass);
    }
  };
  requestAnimationFrame(runPass);
}

function adjustDetailFontSize() {
  if (elements.elementDetailOverlay.classList.contains("hidden")) {
    return;
  }

  // Clear previous inline style to get the natural stylesheet-defined size
  elements.elementDetailText.style.removeProperty("font-size");

  const container = elements.elementDetailText.querySelector(".detail-text-container");
  if (!container) {
    return;
  }

  // Measure bounds at the clean stylesheet font size
  const bounds = container.getBoundingClientRect();
  if (!bounds.width || !bounds.height) {
    return;
  }

  const maxWidth = window.innerWidth - 120;
  const maxHeight = window.innerHeight - 200;
  const style = window.getComputedStyle(elements.elementDetailText);
  const currentSize = parseFloat(style.fontSize) || 64;

  const widthRatio = maxWidth / bounds.width;
  const heightRatio = maxHeight / bounds.height;
  const ratio = Math.min(widthRatio, heightRatio);

  // Scale both up and down to fit the screen bounds perfectly
  const nextSize = Math.max(16, Math.floor(currentSize * ratio * 0.98));
  elements.elementDetailText.style.setProperty("font-size", `${nextSize}px`, "important");
}
