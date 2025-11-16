from langchain_core.prompts import PromptTemplate
from langchain.chat_models import init_chat_model
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

# Prompt
prompt_template = PromptTemplate.from_template(
"""
당신은 사용자에게 적합한 운동을 추천하는 숙련된 운동 코치입니다.
사용자의 요청(신체 정보 및 목표 체중)을 토대로 예시 답변과 같은 형태로 답변을 생성해주세요. 
답변은 반드시 JSON으로만 생성하세요.

# 컨텍스트(검색 결과 요약)
{context}

# 사용자 요청
{question}

# 요청 1
gender: male, height: 180.03, weight: 90, type: 감량, target: 80, BMR: 1800, startDate: 20251111, endDate: 20251211

# 예시 답변 1
{{
  "planTitle": "6주 감량용 복합 운동 플랜 (남 180cm/90kg → 목표 80kg, BMR 1800)",
  "planTypeText": "복합",
  "planDetail": {{
    "totalTime": 52,
    "totalUseKcal": 890,
    "timesAWeek": 6
  }},
  "planExerciseItem": [
    "스쿼트 12분",
    "푸시업 8분",
    "랫풀다운/풀업 보조 8분",
    "런지 8분",
    "플랭크·데드버그 등 코어 6분",
    "전신 스트레칭 8분"
  ]
}}

"""
)

# LLM
def make_llm():
    llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.6, 
                          model_kwargs={"response_format": {"type": "json_object"}})
    return llm

# 체인
def make_qa_chain(llm):
    chain = (
        
        prompt_template
        | llm
    )
    
    return chain

def setup_exercise_recommend():
    llm = make_llm()
    
    qa_chain = make_qa_chain(llm)
    
    return qa_chain

# 질문하고 답변받는 함수
def ask_exercise_question(qa_chain, question):
    answer = qa_chain.invoke(question)
    return answer