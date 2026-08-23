/* 빠른 불러오기 예제 데이터 */
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
