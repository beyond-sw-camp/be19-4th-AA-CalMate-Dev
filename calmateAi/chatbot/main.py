import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import json

from calmate_ai import setup_diet_recommend, ask_question
from calmate_exercise import setup_exercise_recommend, ask_exercise_question

class AiDietRequest(BaseModel):
    gender: str             
    height: int              
    weight: float            
    goalType: str              
    targetValue: float       
    bodyMetric: int            
    allergyNames: List[str] = []  
    startDate: date             
    endDate: date               

app = FastAPI()

try:
    qa_chain_diet = setup_diet_recommend()
except Exception as e:
    qa_chain_diet = None
    print(f"AI 파이프라인 로딩 실패: {e}")

try:
    qa_chain_exercise = setup_exercise_recommend()  # 프롬프트 기반 체인 초기화
except Exception as e:
    qa_chain_exercise = None
    print(f"운동 코치 파이프라인 로딩 실패: {e}")

@app.get("/health")
def health():
    return {"status": "ok", "diet_chain": qa_chain_diet is not None}

GOAL_MAP_KO = {
    "LOSS": "감량",
    "MAINTAIN": "유지",
    "INCREASE": "증량",
}
GENDER_MAP_KO = {
    "M": "male",
    "F": "female",
    "Male": "male",
    "Female": "female",
}

def build_question(
    gender: str,
    height: int,
    weight: float,
    bmr: int,
    goal_type: str,
    target: float,
    start_date: date,
    end_date: date,
    allergy_names: Optional[List[str]] = None,
) -> str:
    norm_gender = GENDER_MAP_KO.get(gender, gender)  # 기본은 입력 유지
    goal_label = GOAL_MAP_KO.get(goal_type, goal_type)  # 모르면 그대로

    allergies = allergy_names or []
    allergy_str = ", ".join(allergies) if allergies else "없음"
    return f"""
    제 신체 정보는 다음과 같습니다:
- 성별: {norm_gender}
- 키: {height}cm
- 몸무게: {weight}kg
- 기초대사량(BMR): {bmr}kcal
- 목표: {goal_label}
- 목표 몸무게: {target}kg
- 시작일: {start_date}
- 마감일: {end_date}
- 알레르기: [{allergy_str}]

이 정보를 바탕으로, 오늘 하루치 식단을 추천해주세요.
#문맥 에서 음식을 찾을 수 없다면 "error"를 반환하세요.
""".strip()

@app.post("/api/v1/diet/recommend")
async def recommend_diet_endpoint(request: AiDietRequest):
    """
    Spring Boot에서 넘어온 AiRequest를 받아 프롬프트를 만들고,
    calmate_ai 체인에 전달하여 JSON을 반환합니다.
    """
    if qa_chain_diet is None:
        raise HTTPException(status_code=500, detail="AI 모델이 초기화되지 않았습니다.")

    # 프롬프트 생성 (사용자가 원한 시그니처와 동일 형태)
    final_prompt = build_question(
        gender=request.gender,
        height=request.height,
        weight=request.weight,
        bmr=request.bodyMetric,
        goal_type=request.goalType,
        target=request.targetValue,
        start_date=request.startDate,
        end_date=request.endDate,
        allergy_names=request.allergyNames,
    )
    print(f"\n[FINAL PROMPT]\n{final_prompt}\n")

    try:
        # LLM 실행 -> 문자열(JSON)
        response_str = ask_question(qa_chain_diet, final_prompt)
        print(f"[RAW AI RESPONSE]\n{response_str}\n")

        # 문자열을 JSON으로 파싱
        data = json.loads(response_str)

        # (선택) 최소 필드 존재 검증
        if not isinstance(data, dict) or "plan_details" not in data or "summary" not in data:
            raise ValueError("필수 필드(plan_details/summary)가 누락된 응답")

        return data

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"AI가 유효한 JSON을 반환하지 못했습니다. 응답: {response_str}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"내부 처리 오류: {str(e)}")
    

class AiExerciseRequest(BaseModel):
    gender: str
    height: int
    weight: float
    goalType: str
    targetValue: float
    bodyMetric: int
    startDate: date
    endDate: date

def build_exercise_question(
    gender: str,
    height: int,
    weight: float,
    bmr: int,
    goal_type: str,
    target: float,
    start_date: date,
    end_date: date,
) -> str:
    norm_gender = GENDER_MAP_KO.get(gender, gender)
    goal_label = GOAL_MAP_KO.get(goal_type, goal_type)
    return f"""
제 신체 정보는 다음과 같습니다:
- 성별: {norm_gender}
- 키: {height}cm
- 몸무게: {weight}kg
- 기초대사량(BMR): {bmr}kcal
- 목표: {goal_label}
- 목표 몸무게: {target}kg
- 시작일: {start_date}
- 마감일: {end_date}

이 정보를 바탕으로, 운동을 추천해주세요.
""".strip()

@app.post("/api/v1/exercise/recommend")
async def recommend_exercise_endpoint(request: AiExerciseRequest):
    if qa_chain_exercise is None:
        raise HTTPException(status_code=500, detail="운동 코치 모델이 초기화되지 않았습니다.")

    final_prompt = build_exercise_question(
        gender=request.gender,
        height=request.height,
        weight=request.weight,
        bmr=request.bodyMetric,
        goal_type=request.goalType,
        target=request.targetValue,
        start_date=request.startDate,
        end_date=request.endDate,
    )
    print(f"\n[FINAL EXERCISE PROMPT]\n{final_prompt}\n")

    try:
        # calmate_exercise 체인은 PromptTemplate에 {context}, {question}가 있으므로
        # dict로 넘겨줘야 함 (RAG 미사용이므로 context는 공란 처리)
        answer = qa_chain_exercise.invoke({"context": "", "question": final_prompt})

        # 모델 응답 형식 안전 처리: AIMessage면 .content, 아니면 str로 변환
        response_str = getattr(answer, "content", None) or str(answer)
        print(f"[RAW EXERCISE RESPONSE]\n{response_str}\n")

        data = json.loads(response_str)
        # (선택) 최소 키 검증: 필요한 키가 있다면 체크
        # for k in ["plan title", "plan-type-text", "plan detail", "plan-exercise-item"]:
        #     if k not in data:
        #         raise ValueError(f"필수 필드 누락: {k}")

        return data

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"운동 코치가 유효한 JSON을 반환하지 못했습니다. 응답: {response_str}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"내부 처리 오류: {str(e)}")



# ---  FastAPI 서버 구동 ---
if __name__ == "__main__":
    # '0.0.0.0' = localhost, 127.0.0.1 및 외부 IP로 모두 접속 허용
    # (Spring Boot가 다른 컴퓨터나 Docker 컨테이너에 있어도 접속 가능)
    # port = 8000 (Java의 8080과 겹치지 않게 주의)
    uvicorn.run(app, host="0.0.0.0", port=8000)