# Field Notes

RViz2 점군 지구본으로 시작하는 Kongles의 로보틱스 연구 블로그입니다. [블로그 열기](https://kongles.github.io)

## 새 글 올리기

| 글 유형 | Markdown을 넣을 폴더 | 복사해서 쓸 양식 |
| --- | --- | --- |
| 연구 기록 | [_research](_research) | [연구 기록 양식](_templates/research.md) |
| 논문 노트 | [_papers](_papers) | [논문 노트 양식](_templates/papers.md) |
| 개념 정리 | [_concepts](_concepts) | [개념 정리 양식](_templates/concepts.md) |

1. 위 표에서 양식을 열고 GitHub의 **Copy raw file**로 내용을 복사합니다.
2. 같은 줄의 폴더에서 **Add file → Create new file**을 누르고, 글마다 다른 파일 이름을 씁니다. 예를 들어 논문 노트에는 `openvla-reading.md`를 쓸 수 있습니다.
3. 양식을 붙여 넣고 제목, 작성일, 주제, 본문을 수정합니다. 이미 작성한 Markdown 파일은 맨 위에 아래 양식의 설정을 넣은 뒤 **Add file → Upload files**로 올려도 됩니다.
4. **Commit changes**로 `main`에 저장합니다. GitHub Pages 배포가 끝나면 새 글이 홈 목록과 해당 필터에 표시됩니다. [배포 상태](https://github.com/Kongles/kongles.github.io/actions)

```markdown
---
title: "LiDAR와 IMU의 시간 기준 맞추기"
date: 2026-11-25
topics: [slam, fusion]
summary: "두 센서의 타임스탬프를 비교하며 확인한 내용을 정리합니다."
---

## 확인하고 싶은 질문

로봇이 회전하는 동안 두 센서의 관측 시각이 얼마나 어긋날까?
```

글 유형은 저장한 폴더로 정해집니다. `topics`에는 `vla`, `sim-to-real`, `slam`, `fusion` 중 여러 항목을 넣을 수 있습니다. 새 연구 주제는 [_data/topics.yml](_data/topics.yml)에 이름과 설명을 추가하면 홈에도 나타납니다. `summary`는 생략할 수 있습니다.

블로그에 처음 들어 있는 글 네 편에는 `sample: true`가 있어서 ‘작성 예시’로 표시됩니다. 실제 글로 바꿀 때는 해당 줄을 지우면 됩니다. 각 글에는 개별 주소가 있으므로 포트폴리오에서 관련 연구 기록을 직접 연결할 수 있습니다.
