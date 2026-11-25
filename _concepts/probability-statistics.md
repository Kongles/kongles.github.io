---
title: "공학 확률·통계 강의실 · 로봇 실험으로 배우는 10강"
date: 2026-11-25
topics: [fusion]
summary: "장애물 경보를 얼마나 믿을지, 처리 시간이 마감을 넘을지, 새 계획기가 정말 빨라졌는지 계산합니다. 확률부터 다변량 분석까지 그림과 풀이로 이어지는 10강입니다."
---

장애물을 90% 검출하는 센서가 경보를 울렸다. 이때 실제로 장애물이 있을 확률도 90%일까? 새 계획기가 여섯 코스에서 평균 2초 빨랐다. 다음 코스에서도 빨라질 거라고 어느 정도 확신할 수 있을까? 첫 질문은 **관측에서 원인을 거꾸로 추론하는 확률**, 둘째는 **표본에서 반복 가능한 효과를 읽는 통계**의 문제다.

이 강의는 공학 확률·통계 강의자료의 1~10장 주제를 따른다. 센서, 제어기, 통신, 경로 계획의 예제와 그림은 학습용 가상 데이터로 새로 만들었다. 함께 읽을 교재는 D. C. Montgomery와 G. C. Runger의 *Applied Statistics and Probability for Engineers* 7판이다. 아래 번호는 이 강의와 강의자료의 순서다. [참고 교재](https://www.wiley.com/en-us/applied-statistics-and-probability-for-engineers-7th-edition-p-9781119400363)

## 강의 순서

{% assign lessons = site.probability | sort: 'chapter' %}
{% for lesson in lessons %}
1. [{{ lesson.short }}]({{ lesson.url | relative_url }}) — {{ lesson.summary }}
{% endfor %}

## 지금 가진 질문에서 시작하기

| 내 질문 | 먼저 읽을 강의 |
|---|---|
| 오경보율이 낮은데 왜 경보를 믿기 어려울까? | [2강 · 조건부확률](/probability-statistics/02/) |
| 연속 프레임과 독립 주행을 같은 표본 수로 세어도 될까? | [1강 · 실험 설계](/probability-statistics/01/)와 [6강 · 표준오차](/probability-statistics/06/) |
| 평균 처리 시간과 다음 프레임에 같은 구간을 써도 될까? | [7강 · 신뢰구간과 예측구간](/probability-statistics/07/) |
| 같은 코스로 두 알고리즘을 비교했는데 무엇을 보고할까? | [9강 · 쌍체 비교](/probability-statistics/09/) |
| 두 센서의 공분산이 상태 추정에 어떻게 쓰일까? | [5강 · 결합분포](/probability-statistics/05/) 다음 [상태 추정 강의실의 가우시안 조건화](/state-estimation/02/) |
