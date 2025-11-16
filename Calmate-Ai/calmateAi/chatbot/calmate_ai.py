from langchain_community.document_loaders import CSVLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain.chat_models import init_chat_model
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data.csv")

# 1. RAG를 만들기 위해 준비해할거

# Document Loader
# 파일경로를 매개변수로 받아서 외부 문서를 읽어서 반환하는 함수
def load_csv(file_path):
    loader = CSVLoader(
        file_path=file_path,
        encoding="utf-8"
    )
    docs = loader.load()
    return docs

# Splitter는 CSVLoader에서 선 작업이 이뤄지기에 생략

# Embedding
def make_embeddings():
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )
    return embeddings

# Vector DB 
def make_databse(docs, embeddings):
    db = FAISS.from_documents(documents=docs, embedding=embeddings)
    return db

# Retriever
def make_retriever(db):
    retriever = db.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 30,        # 최종 선택 수 (그 중에서 뽑아 씀)
            "fetch_k": 120, # 초기 후보폭 크게
            "lambda_mult": 0.5
        })
    return retriever

# 프롬프트
# 6. Prompt
prompt_template = PromptTemplate.from_template(
"""
당신은 '식약처 영양 정보' 데이터베이스를 기반으로 식단을 계획하는 AI 영양사입니다.
사용자의 요청(신체 정보 및 목표 체중, 식단 시작일과 마감일)을 토대로 예시 답변과 같은 형태로 답변을 생성해주세요. 
답변은 JSON으로만 생성하세요.
제약 조건을 반드시 준수해주세요.
반드시 프롬프트 내용을 전부 분석해주세요.

# 컨텍스트(검색 결과 요약)
{context}

# 사용자 요청
{question}

# 제약
사용자가 제공한 알러지 관련 식품은 반드시 제외해주세요.
남성 추천 식단의 총 열량은 최소 1500kcal 이상, 여성 추천 식단의 총 열량은 최소 1200kcal 이상이어야 합니다.

# 예시 (few-shot)
# 요청 1
gender: male, height: 175.3, weight: 90, type: 감량, target: 80, BMR: 1800, allergyNames: [갑각류, 호두], startDate: 20251111, endDate: 20251211

# 예시 답변 1
{{
  "plan_details": {{
    "breakfast": {{
      "items": [
        {{ "menu_name": "귀리 오트밀 (우유와 함께)", "serving_g": 200.0, "kcal": 250.0, "protein_g": 10.0, "fat_g": 6.0 }},
        {{ "menu_name": "삶은 달걀", "serving_g": 100.0, "kcal": 150.0, "protein_g": 13.0, "fat_g": 10.0 }},
        {{ "menu_name": "블루베리", "serving_g": 80.0, "kcal": 45.0, "protein_g": 0.5, "fat_g": 0.2 }}
      ],
      "total_kcal": 445.0,
      "total_protein_g": 23.5,
      "total_fat_g": 16.2
    }},
    "lunch": {{
      "items": [
        {{ "menu_name": "현미밥", "serving_g": 200.0, "kcal": 270.0, "protein_g": 6.0, "fat_g": 2.0 }},
        {{ "menu_name": "닭가슴살 구이", "serving_g": 150.0, "kcal": 180.0, "protein_g": 33.0, "fat_g": 3.0 }},
        {{ "menu_name": "브로콜리 데침", "serving_g": 80.0, "kcal": 30.0, "protein_g": 3.0, "fat_g": 0.5 }},
        {{ "menu_name": "된장국", "serving_g": 150.0, "kcal": 60.0, "protein_g": 4.0, "fat_g": 2.0 }}
      ],
      "total_kcal": 540.0,
      "total_protein_g": 46.0,
      "total_fat_g": 7.5
    }},
    "dinner": {{
      "items": [
        {{ "menu_name": "잡곡밥", "serving_g": 180.0, "kcal": 250.0, "protein_g": 6.0, "fat_g": 2.0 }},
        {{ "menu_name": "연어 스테이크", "serving_g": 120.0, "kcal": 240.0, "protein_g": 25.0, "fat_g": 12.0 }},
        {{ "menu_name": "시금치나물", "serving_g": 60.0, "kcal": 45.0, "protein_g": 3.0, "fat_g": 2.0 }},
        {{ "menu_name": "김치", "serving_g": 50.0, "kcal": 15.0, "protein_g": 1.0, "fat_g": 0.2 }}
      ],
      "total_kcal": 550.0,
      "total_protein_g": 35.0,
      "total_fat_g": 16.2
    }},
    "snack": {{
      "items": [
        {{ "menu_name": "그릭요거트 (무가당)", "serving_g": 100.0, "kcal": 60.0, "protein_g": 6.0, "fat_g": 0.5 }},
        {{ "menu_name": "바나나", "serving_g": 100.0, "kcal": 90.0, "protein_g": 1.0, "fat_g": 0.3 }},
        {{ "menu_name": "아몬드", "serving_g": 20.0, "kcal": 120.0, "protein_g": 4.0, "fat_g": 10.0 }}
      ],
      "total_kcal": 270.0,
      "total_protein_g": 11.0,
      "total_fat_g": 10.8
    }}
  }},
  "summary": {{
    "total_kcal": 1805.0,
    "total_protein_g": 115.5,
    "total_fat_g": 50.7,
    "target_bmr": 1800.0,
    "weekly_weight_change_kg": 0.6
  }},
  "error": null
}}

# 요청 2
gender: female, height: 160.50, weight: 40, type: 증량, target: 50, BMR: 1217, allergyNames: [메밀], startDate: 20251111, endDate: 20251124

# 예시 답변 2
{{
  "plan_details": {{
    "breakfast": {{
      "items": [
        {{ "menu_name": "스크램블 에그 (버터 사용)", "serving_g": 150.0, "kcal": 230.0, "protein_g": 14.0, "fat_g": 18.0 }},
        {{ "menu_name": "통밀 토스트", "serving_g": 80.0, "kcal": 180.0, "protein_g": 6.0, "fat_g": 2.0 }},
        {{ "menu_name": "바나나", "serving_g": 100.0, "kcal": 90.0, "protein_g": 1.0, "fat_g": 0.3 }}
      ],
      "total_kcal": 500.0,
      "total_protein_g": 21.0,
      "total_fat_g": 20.3
    }},
    "lunch": {{
      "items": [
        {{ "menu_name": "현미밥", "serving_g": 200.0, "kcal": 270.0, "protein_g": 6.0, "fat_g": 2.0 }},
        {{ "menu_name": "연어 스테이크 (올리브유로 조리)", "serving_g": 150.0, "kcal": 300.0, "protein_g": 30.0, "fat_g": 15.0 }},
        {{ "menu_name": "시금치나물", "serving_g": 80.0, "kcal": 60.0, "protein_g": 3.0, "fat_g": 2.0 }},
        {{ "menu_name": "된장국", "serving_g": 150.0, "kcal": 60.0, "protein_g": 4.0, "fat_g": 2.0 }}
      ],
      "total_kcal": 690.0,
      "total_protein_g": 43.0,
      "total_fat_g": 21.0
    }},
    "dinner": {{
      "items": [
        {{ "menu_name": "잡곡밥", "serving_g": 180.0, "kcal": 250.0, "protein_g": 6.0, "fat_g": 2.0 }},
        {{ "menu_name": "닭다리살 조림", "serving_g": 200.0, "kcal": 300.0, "protein_g": 28.0, "fat_g": 14.0 }},
        {{ "menu_name": "고구마", "serving_g": 100.0, "kcal": 90.0, "protein_g": 2.0, "fat_g": 0.1 }},
        {{ "menu_name": "오이무침", "serving_g": 70.0, "kcal": 40.0, "protein_g": 1.0, "fat_g": 1.0 }}
      ],
      "total_kcal": 680.0,
      "total_protein_g": 37.0,
      "total_fat_g": 17.1
    }},
    "snack": {{
      "items": [
        {{ "menu_name": "그릭요거트 (꿀 약간)", "serving_g": 150.0, "kcal": 130.0, "protein_g": 10.0, "fat_g": 4.0 }},
        {{ "menu_name": "아몬드", "serving_g": 25.0, "kcal": 150.0, "protein_g": 5.0, "fat_g": 13.0 }},
        {{ "menu_name": "우유", "serving_g": 200.0, "kcal": 130.0, "protein_g": 6.0, "fat_g": 7.0 }}
      ],
      "total_kcal": 410.0,
      "total_protein_g": 21.0,
      "total_fat_g": 24.0
    }}
  }},
  "summary": {{
    "total_kcal": 2280.0,
    "total_protein_g": 122.0,
    "total_fat_g": 82.4,
    "target_bmr": 1217.0,
    "weekly_weight_change_kg": 0.4
  }}
}}

"""
)

# LLM
def make_llm():
    llm = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.3, 
                          model_kwargs={"response_format": {"type": "json_object"}})
    return llm

import re
from langchain_core.runnables import RunnableLambda

STAPLE_KEYWORDS = r"(밥|잡곡|현미|보리|쌀|흰밥|누룽지|죽|떡|빵|토스트|면|국수|우동|라면|파스타|칼국수|수제비|감자|고구마|옥수수|오트|귀리)"
PROTEIN_KEYWORDS = r"(닭|소고기|돼지|계란|달걀|두부|콩|연두부|삶은|훈제|생선|고등어|참치|연어|오징어|낙지|문어|삼치|계육|우육|돈육|스테이크|불고기|제육|탕수육)"
SOUP_KEYWORDS = r"(국|탕|찌개|전골|곰탕|미역국|된장국|누룽지탕)"
SIDE_KEYWORDS = r"(김치|나물|무침|볶음|조림|샐러드|겉절이|피클|볶음김치|장아찌|부침|전|볶음밥 제외)"

def categorize(name: str) -> str:
    n = name.lower()
    if re.search(STAPLE_KEYWORDS, name): return "staple"
    if re.search(PROTEIN_KEYWORDS, name): return "protein"
    if re.search(SOUP_KEYWORDS, name): return "soup"
    if re.search(SIDE_KEYWORDS, name): return "side"
    return "side"  # 기본값은 side

def format_docs(docs):
    # page_content에서 음식명/열량/단백질/지방이 보이도록 줄 단위 요약
    lines = []
    for d in docs:
        row = d.page_content.strip()
        # 간단히 첫 컬럼을 이름으로 본다고 가정 (필요 시 split(',')로 컬럼 파싱)
        name = row.split(",")[0].strip()
        cat = categorize(name)
        # 길이 제한
        row_short = row if len(row) < 280 else row[:280] + "..."
        lines.append(f"[CATEGORY: {cat}] {row_short}")
    return "\n".join(lines)

# 체인
def make_qa_chain(retriever, llm):
    chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough(), # 다음 체인으로 값을 그대로 넘김
        }
        | prompt_template
        | llm
        | StrOutputParser()
    )
    
    return chain

# 전체 시스템을 엮어서 내보내기
def setup_diet_recommend():
    
    docs = load_csv(CSV_PATH)
    
    embeddings = make_embeddings()
    
    db = make_databse(docs, embeddings)
    
    retriever = make_retriever(db)
    
    llm = make_llm()
    
    qa_chain = make_qa_chain(retriever, llm)
    
    return qa_chain

# 질문하고 답변받는 함수
def ask_question(qa_chain, question):
    answer = qa_chain.invoke(question)
    return answer